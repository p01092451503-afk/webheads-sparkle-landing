import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Search, Plus, Edit2, CreditCard, Check, Download, ChevronLeft, ChevronRight, X, FileText, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { PAYMENT_TYPES, getPaymentTypeLabel, getPaymentTypeColor, INVOICE_STATUSES, getInvoiceStatusLabel, getInvoiceStatusColor } from "./paymentTypes";
import type { PaymentClient as Client, PaymentRecord as Payment } from "./paymentTypes";

interface Props {
  clients: Client[];
  payments: Payment[];
  onNavigate: (view: string, clientId?: string) => void;
  onAddPayment: (clientId?: string) => void;
  onEditClient: (client: Client) => void;
  onAddClient: () => void;
  onRefresh: () => void;
  defaultFilter?: FilterType;
}

const formatWon = (n: number) => "₩" + n.toLocaleString("ko-KR");

type FilterType = "all" | "paid" | "unpaid" | "managed";
type SortType = "unpaid" | "date" | "name";
// Editing cell now includes paymentType
type EditingCell = { clientId: string; field: "amount" | "paid_date" | "notes"; paymentType?: string } | null;

// Default visible columns
const DEFAULT_VISIBLE_TYPES = ["hosting", "maintenance", "sms", "ssl", "commission"];

export default function ClientList({ clients, payments, onNavigate, onAddPayment, onEditClient, onAddClient, onRefresh, defaultFilter }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>(defaultFilter || "all");
  const [sort, setSort] = useState<SortType>("name");
  const [editing, setEditing] = useState<EditingCell>(null);
  const [editValue, setEditValue] = useState("");
  const [savedCells, setSavedCells] = useState<Set<string>>(new Set());
  const [visibleTypes, setVisibleTypes] = useState<string[]>(DEFAULT_VISIBLE_TYPES);
  const [annualClients, setAnnualClients] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch annual contract clients
  useEffect(() => {
    supabase
      .from("client_recurring_fees" as any)
      .select("client_id, billing_cycle")
      .eq("billing_cycle", "annual")
      .eq("is_active", true)
      .then(({ data }) => {
        if (data) {
          setAnnualClients(new Set((data as any[]).map((d) => d.client_id)));
        }
      });
  }, []);
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === (now.getMonth() + 1);

  const goMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m > 12) { m = 1; y += 1; }
    if (m < 1) { m = 12; y -= 1; }
    setViewYear(y);
    setViewMonth(m);
    setEditing(null);
  };

  const clientData = useMemo(() => {
    return clients.map((c) => {
      const unpaidTotal = payments
        .filter((p) => p.client_id === c.id && p.is_unpaid)
        .reduce((s, p) => s + (p.amount || 0), 0);

      const monthPayments = payments.filter(
        (p) => p.client_id === c.id && p.year === viewYear && p.month === viewMonth
      );

      // Map by type
      const byType: Record<string, Payment> = {};
      monthPayments.forEach((p) => {
        byType[p.payment_type || "hosting"] = p;
      });

      const monthTotal = monthPayments.reduce((s, p) => s + (p.amount || 0), 0);
      const isManaged = c.expected_payment_day === "따로관리" || c.notes?.includes("따로 관리");

      let status: "paid" | "unpaid" | "managed";
      if (isManaged) status = "managed";
      else if (unpaidTotal > 0 || monthPayments.some((p) => p.is_unpaid)) status = "unpaid";
      else status = "paid";

      return { ...c, unpaidTotal, monthPayments, byType, monthTotal, status };
    });
  }, [clients, payments, viewYear, viewMonth]);

  const filtered = useMemo(() => {
    let list = clientData;
    if (search) {
      list = list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (filter === "paid") list = list.filter((c) => c.status === "paid");
    else if (filter === "unpaid") list = list.filter((c) => c.status === "unpaid");
    else if (filter === "managed") list = list.filter((c) => c.status === "managed");

    if (sort === "unpaid") list = [...list].sort((a, b) => b.unpaidTotal - a.unpaidTotal);
    else if (sort === "date") {
      list = [...list].sort((a, b) => {
        const da = a.byType["hosting"]?.paid_date || "";
        const db = b.byType["hosting"]?.paid_date || "";
        return da.localeCompare(db);
      });
    }
    else list = [...list].sort((a, b) => (a.client_no || 0) - (b.client_no || 0));

    return list;
  }, [clientData, search, filter, sort]);

  const showSaved = useCallback((key: string) => {
    setSavedCells((prev) => new Set(prev).add(key));
    setTimeout(() => {
      setSavedCells((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 1500);
  }, []);

  const saveCell = useCallback(async (clientId: string, field: "amount" | "paid_date", value: string, paymentType: string = "hosting") => {
    const client = clientData.find((c) => c.id === clientId);
    if (!client) return;

    const existingPayment = client.byType[paymentType];

    try {
      if (field === "amount") {
        const numAmount = parseInt(value.replace(/,/g, "")) || 0;
        if (existingPayment) {
          const { error } = await supabase.from("payments").update({ amount: numAmount }).eq("id", existingPayment.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("payments").insert({
            client_id: clientId,
            year: viewYear,
            month: viewMonth,
            amount: numAmount,
            is_unpaid: false,
            payment_type: paymentType,
          });
          if (error) throw error;
        }
      } else {
        let dateStr: string | null = null;
        if (value.trim()) {
          const cleaned = value.trim().replace(/\./g, "-").replace(/\//g, "-");
          if (/^\d{1,2}-\d{1,2}$/.test(cleaned)) {
            const [m, d] = cleaned.split("-");
            dateStr = `${viewYear}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
          } else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(cleaned)) {
            const parts = cleaned.split("-");
            dateStr = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
          } else {
            toast.error("날짜 형식이 올바르지 않습니다 (예: 3.8)");
            return;
          }
        }

        if (existingPayment) {
          const updates: any = { paid_date: dateStr };
          if (dateStr && existingPayment.is_unpaid) updates.is_unpaid = false;
          const { error } = await supabase.from("payments").update(updates).eq("id", existingPayment.id);
          if (error) throw error;
        } else if (dateStr) {
          const { error } = await supabase.from("payments").insert({
            client_id: clientId,
            year: viewYear,
            month: viewMonth,
            amount: 0,
            paid_date: dateStr,
            is_unpaid: false,
            payment_type: paymentType,
          });
          if (error) throw error;
        }
      }

      showSaved(`${clientId}-${paymentType}-${field}`);
      onRefresh();
    } catch (e: any) {
      toast.error(e.message || "저장 중 오류가 발생했습니다");
    }
  }, [clientData, viewYear, viewMonth, onRefresh, showSaved]);

  const startEditing = (clientId: string, field: "amount" | "paid_date", paymentType: string = "hosting") => {
    const client = clientData.find((c) => c.id === clientId);
    if (!client) return;

    const payment = client.byType[paymentType];
    if (field === "amount") {
      setEditValue(payment?.amount ? payment.amount.toLocaleString("ko-KR") : "");
    } else {
      setEditValue(payment?.paid_date?.replace(/-/g, ".") || "");
    }
    setEditing({ clientId, field, paymentType });
  };

  useEffect(() => {
    if (editing) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [editing]);

  const toggleUnpaid = useCallback(async (clientId: string, paymentType: string) => {
    const client = clientData.find((c) => c.id === clientId);
    if (!client) return;
    const payment = client.byType[paymentType];
    if (!payment) return;

    try {
      const { error } = await supabase.from("payments").update({ is_unpaid: !payment.is_unpaid }).eq("id", payment.id);
      if (error) throw error;
      showSaved(`${clientId}-${paymentType}-status`);
      onRefresh();
    } catch (e: any) {
      toast.error(e.message || "상태 변경 중 오류가 발생했습니다");
    }
  }, [clientData, onRefresh, showSaved]);

  const commitEdit = () => {
    if (!editing) return;
    saveCell(editing.clientId, editing.field, editValue, editing.paymentType || "hosting");
    setEditing(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      setEditing(null);
    }
  };

  const cycleInvoiceStatus = useCallback(async (clientId: string, paymentType: string) => {
    const client = clientData.find((c) => c.id === clientId);
    if (!client) return;
    const payment = client.byType[paymentType];
    if (!payment) return;

    const order = ["none", "pre", "post", "done"];
    const currentIdx = order.indexOf(payment.invoice_status || "none");
    const nextStatus = order[(currentIdx + 1) % order.length];
    const now = nextStatus === "done" ? new Date().toISOString().split("T")[0] : payment.invoice_date;

    try {
      const { error } = await supabase.from("payments").update({
        invoice_status: nextStatus,
        invoice_date: nextStatus === "done" ? now : payment.invoice_date,
      }).eq("id", payment.id);
      if (error) throw error;
      showSaved(`${clientId}-${paymentType}-invoice`);
      onRefresh();
    } catch (e: any) {
      toast.error(e.message || "계산서 상태 변경 중 오류가 발생했습니다");
    }
  }, [clientData, onRefresh, showSaved]);

  const saveMemo = useCallback(async (clientId: string, paymentType: string, memo: string) => {
    const client = clientData.find((c) => c.id === clientId);
    if (!client) return;
    const payment = client.byType[paymentType];
    if (!payment) return;

    try {
      const { error } = await supabase.from("payments").update({ memo }).eq("id", payment.id);
      if (error) throw error;
      showSaved(`${clientId}-${paymentType}-memo`);
      onRefresh();
    } catch (e: any) {
      toast.error(e.message || "메모 저장 중 오류가 발생했습니다");
    }
  }, [clientData, onRefresh, showSaved]);

  const toggleType = (typeValue: string) => {
    setVisibleTypes((prev) =>
      prev.includes(typeValue)
        ? prev.filter((t) => t !== typeValue)
        : [...prev, typeValue]
    );
  };

  const toggleClientStatus = useCallback(async (clientId: string, currentStatus: string) => {
    if (currentStatus === "managed") return;
    const client = clientData.find((c) => c.id === clientId);
    if (!client) return;

    const monthPayments = client.monthPayments;
    if (monthPayments.length === 0) return;

    const newUnpaid = currentStatus === "unpaid" ? false : true;
    try {
      for (const p of monthPayments) {
        const updates: any = { is_unpaid: newUnpaid };
        if (!newUnpaid && !p.paid_date) {
          updates.paid_date = new Date().toISOString().split("T")[0];
        }
        await supabase.from("payments").update(updates).eq("id", p.id);
      }
      showSaved(`${clientId}-status`);
      onRefresh();
    } catch (e: any) {
      toast.error(e.message || "상태 변경 중 오류가 발생했습니다");
    }
  }, [clientData, onRefresh, showSaved]);

  const statusBadge = (status: string, clientId: string) => {
    const isManaged = status === "managed";
    const base = "cursor-pointer transition-all hover:scale-105 text-[11px]";
    switch (status) {
      case "paid": return <Badge onClick={() => toggleClientStatus(clientId, status)} className={`bg-emerald-100 text-emerald-700 hover:bg-emerald-200 ${base}`}>납부완료</Badge>;
      case "unpaid": return <Badge onClick={() => toggleClientStatus(clientId, status)} className={`bg-red-100 text-red-700 hover:bg-red-200 ${base}`}>미납</Badge>;
      case "managed": return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 text-[11px]">따로관리</Badge>;
    }
  };

  const SavedCheck = ({ cellKey }: { cellKey: string }) => {
    if (!savedCells.has(cellKey)) return null;
    return (
      <span className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center animate-in zoom-in-50 duration-200">
        <Check className="w-2.5 h-2.5 text-white" />
      </span>
    );
  };

  const handleExportExcel = useCallback(() => {
    const cy = now.getFullYear();
    const cm = now.getMonth() + 1;

    const monthCols: { year: number; month: number; label: string }[] = [];
    for (let i = 12; i >= 0; i--) {
      let m = cm - i;
      let y = cy;
      if (m <= 0) { m += 12; y -= 1; }
      monthCols.push({ year: y, month: m, label: `${y}.${String(m).padStart(2, "0")}` });
    }

    const rows = clients
      .filter((c) => c.is_active)
      .sort((a, b) => (a.client_no || 0) - (b.client_no || 0))
      .map((c) => {
        const unpaidTotal = payments
          .filter((p) => p.client_id === c.id && p.is_unpaid)
          .reduce((s, p) => s + (p.amount || 0), 0);

        const row: Record<string, any> = {
          "No": c.client_no,
          "고객사명": c.name,
          "예상납부일": c.expected_payment_day || "",
          "비고": c.notes || "",
          "미납금": unpaidTotal,
        };

        // Add per-type columns for current month
        PAYMENT_TYPES.forEach((t) => {
          const p = payments.find(
            (p) => p.client_id === c.id && p.year === cy && p.month === cm && p.payment_type === t.value
          );
          row[t.label] = p?.amount || 0;
        });

        let total = 0;
        monthCols.forEach((mc) => {
          const monthTotal = payments
            .filter((p) => p.client_id === c.id && p.year === mc.year && p.month === mc.month)
            .reduce((s, p) => s + (p.amount || 0), 0);
          row[mc.label] = monthTotal;
          total += monthTotal;
        });

        row["총합"] = total;
        return row;
      });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 5 }, { wch: 18 }, { wch: 10 }, { wch: 15 }, { wch: 14 },
      ...PAYMENT_TYPES.map(() => ({ wch: 12 })),
      ...monthCols.map(() => ({ wch: 12 })),
      { wch: 14 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "고객사 입금현황");
    XLSX.writeFile(wb, `입금현황_${cy}${String(cm).padStart(2, "0")}.xlsx`);
    toast.success("Excel 파일이 다운로드되었습니다");
  }, [clients, payments]);

  // Available types not currently shown
  const hiddenTypes = PAYMENT_TYPES.filter((t) => !visibleTypes.includes(t.value));

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="고객사 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-[13px] bg-white"
            />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <SelectTrigger className="w-[120px] h-9 text-[13px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="paid">납부완료</SelectItem>
              <SelectItem value="unpaid">미납</SelectItem>
              <SelectItem value="managed">따로관리</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
            <SelectTrigger className="w-[130px] h-9 text-[13px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">고객사명 순</SelectItem>
              <SelectItem value="unpaid">미납금 순</SelectItem>
              <SelectItem value="date">납부일 순</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleExportExcel} className="h-9 text-[13px]">
            <Download className="w-3.5 h-3.5 mr-1" />Excel 내보내기
          </Button>
          <Button size="sm" variant="outline" onClick={onAddClient} className="h-9 text-[13px]">
            <Plus className="w-3.5 h-3.5 mr-1" />고객사 추가
          </Button>
          <Button size="sm" onClick={() => onAddPayment()} className="h-9 text-[13px] bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]">
            <CreditCard className="w-3.5 h-3.5 mr-1" />입금 등록
          </Button>
        </div>
      </div>

      {/* Month Navigation + Table */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] overflow-hidden">
        {/* Month Selector */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[hsl(220,13%,91%)]">
          <div className="flex items-center gap-2">
            <button onClick={() => goMonth(-1)} className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,93%)] text-muted-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[14px] font-semibold min-w-[100px] text-center">
              {viewYear}년 {viewMonth}월
            </span>
            <button onClick={() => goMonth(1)} className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,93%)] text-muted-foreground transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
            {!isCurrentMonth && (
              <button
                onClick={() => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth() + 1); }}
                className="ml-2 px-2.5 py-1 rounded-lg text-[11px] font-medium text-[hsl(221,83%,53%)] bg-[hsl(221,83%,53%,0.08)] hover:bg-[hsl(221,83%,53%,0.14)] transition-colors"
              >
                이번 달
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isCurrentMonth && (
              <span className="text-[11px] text-muted-foreground">과거 데이터 조회 중</span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1560px] w-full text-[13px]">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,97%)]">
                <th className="text-left px-3 py-3 font-semibold text-muted-foreground w-[45px] whitespace-nowrap">No</th>
                <th className="text-left px-3 py-3 font-semibold text-muted-foreground w-[140px] whitespace-nowrap">고객사명</th>
                <th className="text-left px-3 py-3 font-semibold text-muted-foreground w-[75px] whitespace-nowrap">예상납부일</th>
                <th className="text-left px-3 py-3 font-semibold text-muted-foreground w-[90px] whitespace-nowrap">입금일 ✎</th>
                <th className="text-left px-3 py-3 font-semibold text-muted-foreground w-[60px] whitespace-nowrap">비고</th>
                <th className="text-right px-3 py-3 font-semibold text-muted-foreground w-[100px] whitespace-nowrap">미납금</th>

                {/* Dynamic payment type columns */}
                {visibleTypes.map((typeValue) => {
                  const typeInfo = PAYMENT_TYPES.find((t) => t.value === typeValue);
                  if (!typeInfo) return null;
                    const isDefault = DEFAULT_VISIBLE_TYPES.includes(typeValue);
                    return (
                    <th key={typeValue} className="text-right px-1 py-3 font-semibold w-[95px]">
                      <div className="flex items-center justify-end gap-1">
                        <span className={`text-[11px] px-1.5 py-0.5 rounded ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        {!isDefault && (
                          <button
                            onClick={() => toggleType(typeValue)}
                            className="p-0.5 rounded hover:bg-[hsl(220,14%,90%)] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                            title="열 숨기기"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </th>
                  );
                })}

                {/* Add column button */}
                {hiddenTypes.length > 0 && (
                  <th className="px-2 py-3 w-[40px]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,93%)] text-muted-foreground transition-colors" title="입금 항목 추가">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2" align="end">
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold text-muted-foreground px-2 pb-1">항목 추가</p>
                          {hiddenTypes.map((t) => (
                            <button
                              key={t.value}
                              onClick={() => toggleType(t.value)}
                              className={`w-full text-left px-3 py-1.5 rounded-md text-[12px] font-medium transition-all hover:opacity-80 ${t.color}`}
                            >
                              + {t.label}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </th>
                )}

                <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-[70px]">상태</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-[60px]">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const isEditingDate = editing?.clientId === c.id && editing.field === "paid_date";

                return (
                  <tr key={c.id} className="border-b border-[hsl(220,13%,93%)] hover:bg-[hsl(220,14%,97.5%)] transition-colors">
                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{c.client_no}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onNavigate("detail", c.id)}
                          className="font-medium text-[hsl(221,83%,53%)] hover:underline"
                        >
                          {c.name}
                        </button>
                        {annualClients.has(c.id) && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium">연간</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{c.expected_payment_day || "-"}</td>

                    {/* Editable: 입금일 (hosting) */}
                    <td className="px-2 py-1.5">
                      <div className="relative">
                        {isEditingDate ? (
                          <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={handleKeyDown}
                            placeholder="3.8"
                            className="w-full h-8 px-2 text-[13px] rounded-lg border border-[hsl(221,83%,53%)] bg-blue-50/50 outline-none focus:ring-2 focus:ring-[hsl(221,83%,53%)]/20"
                          />
                        ) : (
                          <button
                            onClick={() => startEditing(c.id, "paid_date", "hosting")}
                            className="w-full h-8 px-2 text-left text-[13px] rounded-lg hover:bg-[hsl(220,14%,94%)] text-muted-foreground transition-colors cursor-text"
                          >
                            {c.byType["hosting"]?.paid_date ? c.byType["hosting"].paid_date.replace(/-/g, ".") : "-"}
                          </button>
                        )}
                        <SavedCheck cellKey={`${c.id}-hosting-paid_date`} />
                      </div>
                    </td>

                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{c.notes || "-"}</td>
                    <td className={`px-3 py-3 text-right font-medium whitespace-nowrap ${c.unpaidTotal > 0 ? "text-red-600" : ""}`}>
                      {c.unpaidTotal > 0 ? formatWon(c.unpaidTotal) : "-"}
                    </td>

                    {/* Dynamic payment type amount cells */}
                    {visibleTypes.map((typeValue) => {
                      const payment = c.byType[typeValue];
                      const isEditingThis = editing?.clientId === c.id && editing.field === "amount" && editing.paymentType === typeValue;
                      const cellKey = `${c.id}-${typeValue}-amount`;
                      const isUnpaid = payment?.is_unpaid;
                      const invoiceStatus = payment?.invoice_status || "none";

                      return (
                        <td key={typeValue} className="px-1 py-1">
                          <div className="relative">
                            {isEditingThis ? (
                              <input
                                ref={inputRef}
                                value={editValue}
                                onChange={(e) => {
                                  const num = e.target.value.replace(/[^0-9]/g, "");
                                  setEditValue(num ? parseInt(num).toLocaleString("ko-KR") : "");
                                }}
                                onBlur={commitEdit}
                                onKeyDown={handleKeyDown}
                                placeholder="0"
                                className="w-full h-7 px-2 text-[12px] text-right rounded-lg border border-[hsl(221,83%,53%)] bg-blue-50/50 outline-none focus:ring-2 focus:ring-[hsl(221,83%,53%)]/20"
                              />
                            ) : (
                              <div className="space-y-0.5">
                                {/* Amount row */}
                                <div className="flex items-center gap-0.5">
                                  <button
                                    onClick={() => startEditing(c.id, "amount", typeValue)}
                                    className={`flex-1 h-7 px-1.5 text-right text-[12px] rounded hover:bg-[hsl(220,14%,94%)] transition-colors cursor-text ${isUnpaid ? "text-red-600 font-semibold" : ""}`}
                                  >
                                    {payment?.amount ? formatWon(payment.amount) : "-"}
                                  </button>
                                  {payment && payment.amount > 0 && (
                                    <button
                                      onClick={() => toggleUnpaid(c.id, typeValue)}
                                      className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
                                        isUnpaid
                                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                                          : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                      }`}
                                      title={isUnpaid ? "미납 → 납부완료" : "납부완료 → 미납"}
                                    >
                                      {isUnpaid ? "!" : "✓"}
                                    </button>
                                  )}
                                </div>
                                {/* Invoice + memo row */}
                                {payment && payment.amount > 0 && (
                                  <div className="flex items-center justify-end gap-0.5 pr-5">
                                    <button
                                      onClick={() => cycleInvoiceStatus(c.id, typeValue)}
                                      className={`text-[9px] px-1.5 py-0.5 rounded font-medium transition-all hover:opacity-80 ${getInvoiceStatusColor(invoiceStatus)}`}
                                      title="계산서 상태 변경"
                                    >
                                      {getInvoiceStatusLabel(invoiceStatus)}
                                    </button>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <button
                                          className={`p-0.5 rounded transition-colors ${payment.memo ? "text-[hsl(221,83%,53%)]" : "text-muted-foreground/30 hover:text-muted-foreground/60"}`}
                                          title={payment.memo || "메모 추가"}
                                        >
                                          <MessageSquare className="w-3 h-3" />
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-56 p-2" align="start">
                                        <textarea
                                          defaultValue={payment.memo || ""}
                                          placeholder="메모 입력..."
                                          rows={3}
                                          className="w-full px-2 py-1.5 text-[12px] rounded-lg border border-[hsl(220,13%,90%)] resize-none focus:outline-none focus:border-[hsl(221,83%,53%)] transition-colors"
                                          onBlur={(e) => {
                                            if (e.target.value !== (payment.memo || "")) {
                                              saveMemo(c.id, typeValue, e.target.value);
                                            }
                                          }}
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <SavedCheck cellKey={`${c.id}-${typeValue}-invoice`} />
                                    <SavedCheck cellKey={`${c.id}-${typeValue}-memo`} />
                                  </div>
                                )}
                              </div>
                            )}
                            <SavedCheck cellKey={cellKey} />
                            <SavedCheck cellKey={`${c.id}-${typeValue}-status`} />
                          </div>
                        </td>
                      );
                    })}

                    {/* + column spacer */}
                    {hiddenTypes.length > 0 && <td className="px-2 py-3" />}

                    <td className="px-4 py-3 text-center">{statusBadge(c.status, c.id)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => onEditClient(c)}
                          className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,93%)] text-muted-foreground transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7 + visibleTypes.length + (hiddenTypes.length > 0 ? 1 : 0)} className="px-4 py-12 text-center text-muted-foreground">
                    검색 결과가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
