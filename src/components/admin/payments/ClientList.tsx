import { useState, useMemo, useRef, useCallback } from "react";
import { Search, Plus, Edit2, CreditCard, Check, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { getPaymentTypeLabel } from "./paymentTypes";

interface Client {
  id: string;
  client_no: number;
  name: string;
  expected_payment_day: string | null;
  notes: string | null;
  is_active: boolean;
}

interface Payment {
  id: string;
  client_id: string;
  year: number;
  month: number;
  amount: number;
  paid_date: string | null;
  is_unpaid: boolean;
  memo: string | null;
  payment_type: string;
}

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
type EditingCell = { clientId: string; field: "amount" | "paid_date" } | null;

export default function ClientList({ clients, payments, onNavigate, onAddPayment, onEditClient, onAddClient, onRefresh, defaultFilter }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>(defaultFilter || "all");
  const [sort, setSort] = useState<SortType>("name");
  const [editing, setEditing] = useState<EditingCell>(null);
  const [editValue, setEditValue] = useState("");
  const [savedCells, setSavedCells] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const clientData = useMemo(() => {
    return clients.map((c) => {
      const unpaidTotal = payments
        .filter((p) => p.client_id === c.id && p.is_unpaid)
        .reduce((s, p) => s + (p.amount || 0), 0);

      // For inline editing, find hosting payment for current month
      const thisMonth = payments.find(
        (p) => p.client_id === c.id && p.year === currentYear && p.month === currentMonth && (p.payment_type === "hosting" || !p.payment_type)
      );

      // Count of other payment types this month
      const otherThisMonth = payments.filter(
        (p) => p.client_id === c.id && p.year === currentYear && p.month === currentMonth && p.payment_type && p.payment_type !== "hosting"
      );

      const isManaged = c.expected_payment_day === "따로관리" || c.notes?.includes("따로 관리");

      let status: "paid" | "unpaid" | "managed";
      if (isManaged) status = "managed";
      else if (unpaidTotal > 0 || (thisMonth && thisMonth.is_unpaid)) status = "unpaid";
      else status = "paid";

      return { ...c, unpaidTotal, thisMonth, otherThisMonth, status };
    });
  }, [clients, payments, currentYear, currentMonth]);

  const filtered = useMemo(() => {
    let list = clientData;
    if (search) {
      list = list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (filter === "paid") list = list.filter((c) => c.status === "paid");
    else if (filter === "unpaid") list = list.filter((c) => c.status === "unpaid");
    else if (filter === "managed") list = list.filter((c) => c.status === "managed");

    if (sort === "unpaid") list = [...list].sort((a, b) => b.unpaidTotal - a.unpaidTotal);
    else if (sort === "date") list = [...list].sort((a, b) => {
      const da = a.thisMonth?.paid_date || "";
      const db = b.thisMonth?.paid_date || "";
      return da.localeCompare(db);
    });
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

  const saveCell = useCallback(async (clientId: string, field: "amount" | "paid_date", value: string) => {
    const client = clientData.find((c) => c.id === clientId);
    if (!client) return;

    const existingPayment = client.thisMonth;

    try {
      if (field === "amount") {
        const numAmount = parseInt(value.replace(/,/g, "")) || 0;
        if (existingPayment) {
          const { error } = await supabase.from("payments").update({ amount: numAmount }).eq("id", existingPayment.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("payments").insert({
            client_id: clientId,
            year: currentYear,
            month: currentMonth,
            amount: numAmount,
            is_unpaid: false,
            payment_type: "hosting",
          });
          if (error) throw error;
        }
      } else {
        // paid_date: accept YYYY.MM.DD or YYYY-MM-DD or MM.DD or M/D
        let dateStr: string | null = null;
        if (value.trim()) {
          const cleaned = value.trim().replace(/\./g, "-").replace(/\//g, "-");
          // If short format like 3-8 or 03-08
          if (/^\d{1,2}-\d{1,2}$/.test(cleaned)) {
            const [m, d] = cleaned.split("-");
            dateStr = `${currentYear}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
          } else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(cleaned)) {
            const parts = cleaned.split("-");
            dateStr = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
          } else {
            toast.error("날짜 형식이 올바르지 않습니다 (예: 2026.03.08 또는 3.8)");
            return;
          }
        }

        if (existingPayment) {
          const updates: any = { paid_date: dateStr };
          if (dateStr && existingPayment.is_unpaid) {
            updates.is_unpaid = false;
          }
          const { error } = await supabase.from("payments").update(updates).eq("id", existingPayment.id);
          if (error) throw error;
        } else if (dateStr) {
          const { error } = await supabase.from("payments").insert({
            client_id: clientId,
            year: currentYear,
            month: currentMonth,
            amount: 0,
            paid_date: dateStr,
            is_unpaid: false,
            payment_type: "hosting",
          });
          if (error) throw error;
        }
      }

      showSaved(`${clientId}-${field}`);
      onRefresh();
    } catch (e: any) {
      toast.error(e.message || "저장 중 오류가 발생했습니다");
    }
  }, [clientData, currentYear, currentMonth, onRefresh, showSaved]);

  const startEditing = (clientId: string, field: "amount" | "paid_date") => {
    const client = clientData.find((c) => c.id === clientId);
    if (!client) return;

    if (field === "amount") {
      setEditValue(client.thisMonth?.amount ? client.thisMonth.amount.toLocaleString("ko-KR") : "");
    } else {
      setEditValue(client.thisMonth?.paid_date?.replace(/-/g, ".") || "");
    }
    setEditing({ clientId, field });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    if (!editing) return;
    saveCell(editing.clientId, editing.field, editValue);
    setEditing(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, clientId: string, field: "amount" | "paid_date") => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      setEditing(null);
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Save current, move to next field in same row
      saveCell(clientId, field, editValue);
      if (field === "paid_date") {
        startEditing(clientId, "amount");
      } else {
        // Move to next row's paid_date
        const idx = filtered.findIndex((c) => c.id === clientId);
        if (idx < filtered.length - 1) {
          startEditing(filtered[idx + 1].id, "paid_date");
        } else {
          setEditing(null);
        }
      }
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "paid": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[11px]">납부완료</Badge>;
      case "unpaid": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[11px]">미납</Badge>;
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
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const cy = now.getFullYear();
    const cm = now.getMonth() + 1;

    // Generate last 13 months columns
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

        const thisMonthP = payments.find(
          (p) => p.client_id === c.id && p.year === cy && p.month === cm && (p.payment_type === "hosting" || !p.payment_type)
        );

        // Collect other payment types for this month
        const otherTypes = payments
          .filter((p) => p.client_id === c.id && p.year === cy && p.month === cm && p.payment_type && p.payment_type !== "hosting")
          .map((p) => `${getPaymentTypeLabel(p.payment_type)}:${p.amount?.toLocaleString()}`)
          .join(", ");

        const row: Record<string, any> = {
          "No": c.client_no,
          "고객사명": c.name,
          "예상납부일": c.expected_payment_day || "",
          "입금일": thisMonthP?.paid_date?.replace(/-/g, ".") || "",
          "비고": c.notes || "",
          "미납금": unpaidTotal,
          "기타항목(이달)": otherTypes || "",
        };

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

    // Set column widths
    ws["!cols"] = [
      { wch: 5 }, { wch: 18 }, { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 14 }, { wch: 20 },
      ...monthCols.map(() => ({ wch: 12 })),
      { wch: 14 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "고객사 입금현황");
    XLSX.writeFile(wb, `입금현황_${cy}${String(cm).padStart(2, "0")}.xlsx`);
    toast.success("Excel 파일이 다운로드되었습니다");
  }, [clients, payments]);

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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,97%)]">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-[50px]">No</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">고객사명</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-[90px]">예상납부일</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-[120px]">입금일 ✎</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">비고</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground w-[120px]">미납금</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground w-[130px]">이달 금액 ✎</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-[80px]">상태</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-[90px]">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const isEditingDate = editing?.clientId === c.id && editing.field === "paid_date";
                const isEditingAmount = editing?.clientId === c.id && editing.field === "amount";

                return (
                  <tr key={c.id} className="border-b border-[hsl(220,13%,93%)] hover:bg-[hsl(220,14%,97.5%)] transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{c.client_no}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onNavigate("detail", c.id)}
                        className="font-medium text-[hsl(221,83%,53%)] hover:underline"
                      >
                        {c.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.expected_payment_day || "-"}</td>

                    {/* Editable: 입금일 */}
                    <td className="px-2 py-1.5">
                      <div className="relative">
                        {isEditingDate ? (
                          <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={(e) => handleKeyDown(e, c.id, "paid_date")}
                            placeholder="3.8"
                            className="w-full h-8 px-2 text-[13px] rounded-lg border border-[hsl(221,83%,53%)] bg-blue-50/50 outline-none focus:ring-2 focus:ring-[hsl(221,83%,53%)]/20"
                          />
                        ) : (
                          <button
                            onClick={() => startEditing(c.id, "paid_date")}
                            className="w-full h-8 px-2 text-left text-[13px] rounded-lg hover:bg-[hsl(220,14%,94%)] text-muted-foreground transition-colors cursor-text"
                          >
                            {c.thisMonth?.paid_date ? c.thisMonth.paid_date.replace(/-/g, ".") : "-"}
                          </button>
                        )}
                        <SavedCheck cellKey={`${c.id}-paid_date`} />
                      </div>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">{c.notes || "-"}</td>
                    <td className={`px-4 py-3 text-right font-medium ${c.unpaidTotal > 0 ? "text-red-600" : ""}`}>
                      {c.unpaidTotal > 0 ? formatWon(c.unpaidTotal) : "-"}
                    </td>

                    {/* Editable: 이달 금액 */}
                    <td className="px-2 py-1.5">
                      <div className="relative">
                        {isEditingAmount ? (
                          <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => {
                              const num = e.target.value.replace(/[^0-9]/g, "");
                              setEditValue(num ? parseInt(num).toLocaleString("ko-KR") : "");
                            }}
                            onBlur={commitEdit}
                            onKeyDown={(e) => handleKeyDown(e, c.id, "amount")}
                            placeholder="0"
                            className="w-full h-8 px-2 text-[13px] text-right rounded-lg border border-[hsl(221,83%,53%)] bg-blue-50/50 outline-none focus:ring-2 focus:ring-[hsl(221,83%,53%)]/20"
                          />
                        ) : (
                          <button
                            onClick={() => startEditing(c.id, "amount")}
                            className="w-full h-8 px-2 text-right text-[13px] rounded-lg hover:bg-[hsl(220,14%,94%)] transition-colors cursor-text"
                          >
                            {c.thisMonth ? formatWon(c.thisMonth.amount || 0) : "-"}
                          </button>
                        )}
                        <SavedCheck cellKey={`${c.id}-amount`} />
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">{statusBadge(c.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditClient(c)}
                          className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,93%)] text-muted-foreground transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onAddPayment(c.id)}
                          className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,93%)] text-muted-foreground transition-colors"
                          title="입금 등록"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
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
