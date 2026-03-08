import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Settings2, Check, X, Building2, BarChart3, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ExpenseStatistics = lazy(() => import("./ExpenseStatistics"));

interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  sort_order: number;
  is_active: boolean;
}

interface Expense {
  id: string;
  category_id: string | null;
  client_id: string | null;
  vendor_id: string | null;
  year: number;
  month: number;
  amount: number;
  supply_amount: number;
  tax_amount: number;
  description: string | null;
  is_paid: boolean;
  paid_date: string | null;
  memo: string | null;
  invoice_issued: boolean;
  vendor_name: string | null;
}

interface Vendor {
  id: string;
  name: string;
  is_active: boolean;
}

interface Client {
  id: string;
  name: string;
}

interface Props {
  clients?: { id: string; name: string }[];
  isSuperAdmin?: boolean;
  logActivity?: (action: string, targetType?: string, targetId?: string, details?: any) => Promise<void>;
}

const formatWon = (n: number) => "₩" + n.toLocaleString("ko-KR");

export default function ExpenseManager({ clients: externalClients, isSuperAdmin, logActivity }: Props) {
  const [internalClients, setInternalClients] = useState<Client[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [newVendorName, setNewVendorName] = useState("");
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");

  // Form state
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formClientId, setFormClientId] = useState("none");
  const [formVendorId, setFormVendorId] = useState("none");
  const [formVendorName, setFormVendorName] = useState("");
  const [formTotalAmount, setFormTotalAmount] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formMemo, setFormMemo] = useState("");
  const [formInvoiceIssued, setFormInvoiceIssued] = useState(false);

  const formTotal = useMemo(() => parseInt(formTotalAmount.replace(/[^0-9]/g, "")) || 0, [formTotalAmount]);
  const formSupplyCalc = useMemo(() => Math.round(formTotal / 1.1), [formTotal]);
  const formTaxCalc = useMemo(() => formTotal - formSupplyCalc, [formTotal, formSupplyCalc]);

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === (now.getMonth() + 1);

  const goMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m > 12) { m = 1; y += 1; }
    if (m < 1) { m = 12; y -= 1; }
    setViewYear(y);
    setViewMonth(m);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [catRes, expRes, clientRes, vendorRes] = await Promise.all([
      supabase.from("expense_categories" as any).select("*").order("sort_order"),
      supabase.from("expenses" as any).select("*").eq("year", viewYear).eq("month", viewMonth).order("created_at"),
      !externalClients ? supabase.from("clients").select("id, name").order("name") : Promise.resolve({ data: null }),
      supabase.from("vendors" as any).select("*").order("name"),
    ]);
    if (catRes.data) setCategories(catRes.data as any);
    if (expRes.data) setExpenses(expRes.data as any);
    if (clientRes.data) setInternalClients(clientRes.data as Client[]);
    if (vendorRes.data) setVendors(vendorRes.data as any);
    setLoading(false);
  }, [viewYear, viewMonth, externalClients]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const clients = externalClients || internalClients;

  const filtered = useMemo(() => {
    if (catFilter === "all") return expenses;
    return expenses.filter((e) => e.category_id === catFilter);
  }, [expenses, catFilter]);

  const totalExpense = useMemo(() => expenses.reduce((s, e) => s + (e.amount || 0), 0), [expenses]);
  const unpaidTotal = useMemo(() => expenses.filter((e) => !e.is_paid).reduce((s, e) => s + (e.amount || 0), 0), [expenses]);
  const paidTotal = useMemo(() => expenses.filter((e) => e.is_paid).reduce((s, e) => s + (e.amount || 0), 0), [expenses]);

  const getCategoryName = (id: string | null) => categories.find((c) => c.id === id)?.name || "미분류";
  const getCategoryColor = (id: string | null) => categories.find((c) => c.id === id)?.color || "bg-gray-100 text-gray-600";
  const getClientName = (id: string | null) => clients.find((c) => c.id === id)?.name || null;
  const getVendorName = (id: string | null) => vendors.find((v) => v.id === id)?.name || null;

  const openAddModal = () => {
    setEditExpense(null);
    setFormCategoryId(categories[0]?.id || "");
    setFormClientId("none");
    setFormVendorId("none");
    setFormVendorName("");
    setFormTotalAmount("");
    setFormDescription("");
    setFormMemo("");
    setFormInvoiceIssued(false);
    setModalOpen(true);
  };

  const openEditModal = (exp: Expense) => {
    setEditExpense(exp);
    setFormCategoryId(exp.category_id || "");
    setFormClientId(exp.client_id || "none");
    setFormVendorId(exp.vendor_id || "none");
    setFormVendorName(exp.vendor_name || "");
    setFormTotalAmount(exp.amount ? exp.amount.toLocaleString("ko-KR") : "");
    setFormDescription(exp.description || "");
    setFormMemo(exp.memo || "");
    setFormInvoiceIssued(exp.invoice_issued || false);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const amount = formTotal;
    const supplyAmount = formSupplyCalc;
    const taxAmount = formTaxCalc;
    if (!formCategoryId || amount <= 0) {
      toast.error("카테고리와 금액을 입력해주세요");
      return;
    }

    const data = {
      category_id: formCategoryId,
      client_id: formClientId === "none" ? null : formClientId,
      vendor_id: formVendorId === "none" ? null : formVendorId,
      year: viewYear,
      month: viewMonth,
      amount,
      supply_amount: supplyAmount,
      tax_amount: taxAmount,
      description: formDescription || null,
      memo: formMemo || null,
      invoice_issued: formInvoiceIssued,
      vendor_name: formVendorName.trim() || null,
    };

    try {
      if (editExpense) {
        const { error } = await supabase.from("expenses" as any).update(data as any).eq("id", editExpense.id);
        if (error) throw error;
        toast.success("수정되었습니다");
      } else {
        const { error } = await supabase.from("expenses" as any).insert({ ...data, is_paid: false } as any);
        if (error) throw error;
        toast.success("지출이 등록되었습니다");
      }
      setModalOpen(false);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "저장 중 오류 발생");
    }
  };

  const togglePaid = async (exp: Expense) => {
    try {
      const updates: any = { is_paid: !exp.is_paid };
      if (!exp.is_paid) updates.paid_date = new Date().toISOString().split("T")[0];
      const { error } = await supabase.from("expenses" as any).update(updates).eq("id", exp.id);
      if (error) throw error;
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "상태 변경 실패");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("expenses" as any).delete().eq("id", deleteId);
      if (error) throw error;
      toast.success("삭제되었습니다");
      setDeleteId(null);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "삭제 실패");
    }
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const maxOrder = Math.max(0, ...categories.map((c) => c.sort_order));
      const { error } = await supabase.from("expense_categories" as any).insert({
        name: newCatName.trim(),
        sort_order: maxOrder + 1,
        color: "bg-gray-100 text-gray-600",
      } as any);
      if (error) throw error;
      setNewCatName("");
      fetchData();
      toast.success("카테고리가 추가되었습니다");
    } catch (e: any) {
      toast.error(e.message || "추가 실패");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("expense_categories" as any).delete().eq("id", id);
      if (error) throw error;
      fetchData();
      toast.success("카테고리가 삭제되었습니다");
    } catch (e: any) {
      toast.error(e.message || "삭제 실패");
    }
  };

  const addVendor = async () => {
    if (!newVendorName.trim()) return;
    try {
      const { error } = await supabase.from("vendors" as any).insert({ name: newVendorName.trim() } as any);
      if (error) throw error;
      setNewVendorName("");
      fetchData();
      toast.success("협력사가 추가되었습니다");
    } catch (e: any) {
      toast.error(e.message || "추가 실패");
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      const { error } = await supabase.from("vendors" as any).delete().eq("id", id);
      if (error) throw error;
      fetchData();
      toast.success("협력사가 삭제되었습니다");
    } catch (e: any) {
      toast.error(e.message || "삭제 실패");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => goMonth(-1)} className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,93%)] text-muted-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[14px] font-semibold min-w-[100px] text-center">{viewYear}년 {viewMonth}월</span>
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
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-9 text-[13px]">
                <Settings2 className="w-3.5 h-3.5 mr-1" />카테고리 관리
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-3" align="end">
              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-muted-foreground">지출 카테고리</p>
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between gap-2">
                    <Badge className={`${cat.color} text-[10px]`}>{cat.name}</Badge>
                    <button onClick={() => deleteCategory(cat.id)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-1.5 pt-1">
                  <Input
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="새 카테고리"
                    className="h-7 text-[12px]"
                    onKeyDown={(e) => e.key === "Enter" && addCategory()}
                  />
                  <Button size="sm" onClick={addCategory} className="h-7 px-2 text-[11px] bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-9 text-[13px]">
                <Building2 className="w-3.5 h-3.5 mr-1" />협력사 관리
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-3" align="end">
              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-muted-foreground">협력사 목록</p>
                {vendors.map((v) => (
                  <div key={v.id} className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-foreground">{v.name}</span>
                    <button onClick={() => deleteVendor(v.id)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {vendors.length === 0 && <p className="text-[11px] text-muted-foreground">등록된 협력사가 없습니다</p>}
                <div className="flex gap-1.5 pt-1">
                  <Input
                    value={newVendorName}
                    onChange={(e) => setNewVendorName(e.target.value)}
                    placeholder="새 협력사"
                    className="h-7 text-[12px]"
                    onKeyDown={(e) => e.key === "Enter" && addVendor()}
                  />
                  <Button size="sm" onClick={addVendor} className="h-7 px-2 text-[11px] bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button size="sm" onClick={openAddModal} className="h-9 text-[13px] bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]">
            <Plus className="w-3.5 h-3.5 mr-1" />지출 등록
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[12px] text-muted-foreground mb-1">이달 총 지출</p>
          <p className="text-xl font-bold">{formatWon(totalExpense)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[12px] text-muted-foreground mb-1">지출완료</p>
          <p className="text-xl font-bold text-emerald-600">{formatWon(paidTotal)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[12px] text-muted-foreground mb-1">미지출</p>
          <p className={`text-xl font-bold ${unpaidTotal > 0 ? "text-red-600" : ""}`}>{formatWon(unpaidTotal)}</p>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[hsl(220,13%,91%)] flex items-center justify-between">
          <h3 className="text-[14px] font-semibold">지출 내역</h3>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-[130px] h-8 text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-[12px]">전체 카테고리</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-[12px]">{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,97%)]">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">카테고리</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">내용</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">협력사</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">공급가액</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">세액</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">합계</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">지출일</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-[80px]">계산서</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">메모</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-[80px]">상태</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-[80px]">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp) => (
                <tr key={exp.id} className="border-b border-[hsl(220,13%,93%)] hover:bg-[hsl(220,14%,97.5%)]">
                  <td className="px-4 py-3">
                    <Badge className={`${getCategoryColor(exp.category_id)} text-[10px]`}>
                      {getCategoryName(exp.category_id)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{exp.description || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{exp.vendor_name || getVendorName(exp.vendor_id) || getClientName(exp.client_id) || "-"}</td>
                  <td className="px-4 py-3 text-right font-medium text-muted-foreground">{formatWon(exp.supply_amount || 0)}</td>
                  <td className="px-4 py-3 text-right font-medium text-muted-foreground">{formatWon(exp.tax_amount || 0)}</td>
                  <td className="px-4 py-3 text-right font-bold">{formatWon(exp.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{exp.paid_date?.replace(/-/g, ".") || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={async () => {
                      try {
                        await supabase.from("expenses" as any).update({ invoice_issued: !exp.invoice_issued } as any).eq("id", exp.id);
                        fetchData();
                      } catch { toast.error("변경 실패"); }
                    }}>
                      {exp.invoice_issued
                        ? <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer text-[11px] whitespace-nowrap">발급</Badge>
                        : <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer text-[11px] whitespace-nowrap">미발급</Badge>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{exp.memo || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => togglePaid(exp)}>
                      {exp.is_paid
                        ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer text-[11px] whitespace-nowrap">지출완료</Badge>
                        : <Badge className="bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer text-[11px] whitespace-nowrap">미지출</Badge>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEditModal(exp)} className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,93%)] text-muted-foreground">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(exp.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="px-4 py-12 text-center text-muted-foreground">
                  {loading ? "불러오는 중..." : "등록된 지출이 없습니다"}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-[16px]">{editExpense ? "지출 수정" : "지출 등록"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-[13px]">카테고리 *</Label>
              <Select value={formCategoryId} onValueChange={setFormCategoryId}>
                <SelectTrigger className="h-9 text-[13px]"><SelectValue placeholder="선택" /></SelectTrigger>
                <SelectContent>
                  {categories.filter((c) => c.is_active).map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-[13px]">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">합계 금액 (부가세 포함) *</Label>
              <Input
                value={formTotalAmount}
                onChange={(e) => {
                  const num = e.target.value.replace(/[^0-9]/g, "");
                  setFormTotalAmount(num ? parseInt(num).toLocaleString("ko-KR") : "");
                }}
                placeholder="0"
                className="h-9 text-[13px] text-right"
              />
            </div>
            {formTotal > 0 && (
              <div className="rounded-lg bg-[hsl(220,14%,96%)] px-3 py-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground">공급가액</span>
                  <span className="text-[13px] font-medium">{formatWon(formSupplyCalc)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground">세액 (10%)</span>
                  <span className="text-[13px] font-medium">{formatWon(formTaxCalc)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[hsl(220,13%,88%)] pt-1">
                  <span className="text-[12px] font-semibold text-foreground">합계</span>
                  <span className="text-[14px] font-bold">{formatWon(formTotal)}</span>
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-[13px]">내용</Label>
              <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="지출 내용" className="h-9 text-[13px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">협력사 (선택)</Label>
              <Input
                value={formVendorName}
                onChange={(e) => setFormVendorName(e.target.value)}
                placeholder="협력사명 직접 입력"
                className="h-9 text-[13px]"
                list="vendor-suggestions"
              />
              <datalist id="vendor-suggestions">
                {vendors.filter((v) => v.is_active).map((v) => (
                  <option key={v.id} value={v.name} />
                ))}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">메모</Label>
              <Input value={formMemo} onChange={(e) => setFormMemo(e.target.value)} placeholder="메모 (선택)" className="h-9 text-[13px]" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none pl-1">
              <input
                type="checkbox"
                checked={formInvoiceIssued}
                onChange={(e) => setFormInvoiceIssued(e.target.checked)}
                className="w-4 h-4 rounded accent-[hsl(221,83%,53%)] cursor-pointer"
              />
              <span className="text-[13px] text-foreground" style={{ fontWeight: 500 }}>
                세금계산서 발급
              </span>
            </label>
            <Button onClick={handleSubmit} className="w-full h-10 text-[13px] bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]">
              {editExpense ? "수정" : "등록"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>지출 삭제</AlertDialogTitle>
            <AlertDialogDescription>이 지출 내역을 삭제하시겠습니까?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
