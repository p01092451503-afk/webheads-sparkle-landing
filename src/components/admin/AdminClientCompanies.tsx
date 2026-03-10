import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, ChevronDown, ChevronUp, Trash2, Edit, Loader2, Building2, User, Phone, Mail, X, Save, EyeOff, Eye, CheckSquare, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface ClientCompany {
  id: string;
  business_number: string;
  num: string | null;
  company_name: string;
  ceo_name: string | null;
  business_type: string | null;
  business_item: string | null;
  zip_code: string | null;
  address1: string | null;
  address2: string | null;
  is_active: boolean;
  created_at: string;
}

interface ClientContact {
  id: string;
  company_id: string;
  name: string | null;
  position: string | null;
  department: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

interface Props {
  isSuperAdmin: boolean;
}

export default function AdminClientCompanies({ isSuperAdmin }: Props) {
  const [companies, setCompanies] = useState<ClientCompany[]>([]);
  const [contacts, setContacts] = useState<ClientContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editCompany, setEditCompany] = useState<ClientCompany | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkProcessing, setBulkProcessing] = useState(false);

  // Form state
  const [form, setForm] = useState({
    business_number: "", company_name: "", ceo_name: "", num: "",
    business_type: "", business_item: "", zip_code: "", address1: "", address2: "",
  });
  const [formContacts, setFormContacts] = useState<Omit<ClientContact, "id" | "company_id">[]>([
    { name: "", position: "", department: "", phone: "", mobile: "", email: "" },
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [cRes, ctRes] = await Promise.all([
      supabase.from("client_companies").select("*").order("company_name"),
      supabase.from("client_contacts").select("*"),
    ]);
    setCompanies((cRes.data as any[]) || []);
    setContacts((ctRes.data as any[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() => {
    let list = companies.filter(c => showInactive ? !c.is_active : c.is_active);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(c =>
      c.company_name.toLowerCase().includes(q) ||
      c.business_number.includes(q) ||
      (c.ceo_name || "").toLowerCase().includes(q) ||
      contacts.some(ct => ct.company_id === c.id && (
        (ct.name || "").toLowerCase().includes(q) ||
        (ct.email || "").toLowerCase().includes(q) ||
        (ct.phone || "").includes(q) ||
        (ct.mobile || "").includes(q)
      ))
    );
  }, [companies, contacts, search, showInactive]);

  const activeCount = useMemo(() => companies.filter(c => c.is_active).length, [companies]);
  const inactiveCount = useMemo(() => companies.filter(c => !c.is_active).length, [companies]);

  const getContacts = (companyId: string) => contacts.filter(c => c.company_id === companyId);

  const toggleActive = async (e: React.MouseEvent, company: ClientCompany) => {
    e.stopPropagation();
    const newStatus = !company.is_active;
    if (!newStatus) {
      if (!confirm(`"${company.company_name}"을(를) 무효 고객사로 변경하시겠습니까?`)) return;
    }
    await supabase.from("client_companies").update({ is_active: newStatus }).eq("id", company.id);
    toast.success(newStatus ? "유효 처리되었습니다" : "무효 처리되었습니다");
    fetchData();
  };

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(c => c.id)));
    }
  };

  const bulkActivate = async () => {
    if (selectedIds.size === 0) return;
    setBulkProcessing(true);
    try {
      const ids = Array.from(selectedIds);
      const { error } = await supabase.from("client_companies").update({ is_active: true }).in("id", ids);
      if (error) throw error;
      toast.success(`${ids.length}개 고객사가 유효 처리되었습니다`);
      setSelectedIds(new Set());
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "처리 중 오류가 발생했습니다");
    } finally {
      setBulkProcessing(false);
    }
  };

  // Clear selection when switching views
  useEffect(() => { setSelectedIds(new Set()); }, [showInactive]);

  const openAdd = async () => {
    setEditCompany(null);
    // 자동 고객번호 부여: 기존 최대 num + 1
    let nextNum = "";
    try {
      const { data } = await supabase.from("client_companies").select("num").not("num", "is", null);
      if (data) {
        const nums = data.map(d => parseInt(d.num || "0", 10)).filter(n => !isNaN(n));
        const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
        nextNum = String(maxNum + 1);
      }
    } catch {}
    setForm({ business_number: "", company_name: "", ceo_name: "", num: nextNum, business_type: "", business_item: "", zip_code: "", address1: "", address2: "" });
    setFormContacts([{ name: "", position: "", department: "", phone: "", mobile: "", email: "" }]);
    setShowModal(true);
  };

  const openEdit = (c: ClientCompany) => {
    setEditCompany(c);
    setForm({
      business_number: c.business_number, company_name: c.company_name,
      ceo_name: c.ceo_name || "", num: c.num || "",
      business_type: c.business_type || "", business_item: c.business_item || "",
      zip_code: c.zip_code || "", address1: c.address1 || "", address2: c.address2 || "",
    });
    const cts = getContacts(c.id);
    setFormContacts(cts.length > 0
      ? cts.map(ct => ({ name: ct.name || "", position: ct.position || "", department: ct.department || "", phone: ct.phone || "", mobile: ct.mobile || "", email: ct.email || "" }))
      : [{ name: "", position: "", department: "", phone: "", mobile: "", email: "" }]
    );
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.business_number || !form.company_name) {
      toast.error("사업자등록번호와 상호는 필수입니다");
      return;
    }
    try {
      if (editCompany) {
        await supabase.from("client_companies").update({
          business_number: form.business_number, company_name: form.company_name,
          ceo_name: form.ceo_name || null, num: form.num || null,
          business_type: form.business_type || null, business_item: form.business_item || null,
          zip_code: form.zip_code || null, address1: form.address1 || null, address2: form.address2 || null,
        }).eq("id", editCompany.id);
        await supabase.from("client_contacts").delete().eq("company_id", editCompany.id);
        const validContacts = formContacts.filter(c => c.name || c.email || c.phone || c.mobile);
        if (validContacts.length > 0) {
          await supabase.from("client_contacts").insert(
            validContacts.map(c => ({ ...c, company_id: editCompany.id }))
          );
        }
        toast.success("수정 완료");
      } else {
        const { data } = await supabase.from("client_companies").insert({
          business_number: form.business_number, company_name: form.company_name,
          ceo_name: form.ceo_name || null, num: form.num || null,
          business_type: form.business_type || null, business_item: form.business_item || null,
          zip_code: form.zip_code || null, address1: form.address1 || null, address2: form.address2 || null,
        }).select().single();
        if (data) {
          const validContacts = formContacts.filter(c => c.name || c.email || c.phone || c.mobile);
          if (validContacts.length > 0) {
            await supabase.from("client_contacts").insert(
              validContacts.map(c => ({ ...c, company_id: data.id }))
            );
          }
        }
        toast.success("추가 완료");
      }
      setShowModal(false);
      fetchData();
    } catch {
      toast.error("저장 실패");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("client_companies").delete().eq("id", id);
    toast.success("삭제 완료");
    fetchData();
  };

  const addContact = () => {
    setFormContacts(prev => [...prev, { name: "", position: "", department: "", phone: "", mobile: "", email: "" }]);
  };

  const removeContact = (idx: number) => {
    setFormContacts(prev => prev.filter((_, i) => i !== idx));
  };

  const updateContact = (idx: number, field: string, value: string) => {
    setFormContacts(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">고객사 관리</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            유효 {activeCount}개 · 무효 {inactiveCount}개
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors border ${
              showInactive
                ? "bg-destructive/10 text-destructive border-destructive/30"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {showInactive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showInactive ? "무효 고객사" : "무효 보기"}
            {inactiveCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                {inactiveCount}
              </span>
            )}
          </button>
          {isSuperAdmin && (
            <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="w-3.5 h-3.5" /> 고객사 추가
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="상호, 사업자번호, 담당자명, 이메일 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-[13px]"
        />
      </div>

      {/* Bulk action bar for inactive view */}
      {showInactive && filtered.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-muted/30 border-border/60">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {selectedIds.size === filtered.length ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
            전체선택
          </button>
          {selectedIds.size > 0 && (
            <>
              <span className="text-[12px] text-muted-foreground">{selectedIds.size}개 선택됨</span>
              <button
                onClick={bulkActivate}
                disabled={bulkProcessing}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                {bulkProcessing ? "처리 중..." : "선택 유효 처리"}
              </button>
            </>
          )}
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {filtered.map((c) => {
          const cts = getContacts(c.id);
          const isOpen = expandedId === c.id;
          return (
            <div key={c.id} className={`rounded-xl border overflow-hidden ${
              c.is_active ? "bg-white border-border/60" : "bg-muted/30 border-destructive/20"
            }`}>
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedId(isOpen ? null : c.id)}
              >
                {showInactive && (
                  <Checkbox
                    checked={selectedIds.has(c.id)}
                    onCheckedChange={() => {
                      setSelectedIds(prev => {
                        const next = new Set(prev);
                        if (next.has(c.id)) next.delete(c.id); else next.add(c.id);
                        return next;
                      });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0"
                  />
                )}
                <Building2 className={`w-4 h-4 shrink-0 ${c.is_active ? "text-muted-foreground" : "text-destructive/50"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[13px] font-semibold truncate ${c.is_active ? "text-foreground" : "text-muted-foreground line-through"}`}>
                      {c.company_name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{c.business_number}</span>
                    {!c.is_active && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">무효</span>
                    )}
                    {cts.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        연락처 {cts.length}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {c.ceo_name && `대표: ${c.ceo_name}`}
                    {c.address1 && ` · ${c.address1}`}
                    {c.address2 && ` ${c.address2}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {isSuperAdmin && (
                    <>
                      <button
                        onClick={(e) => toggleActive(e, c)}
                        title={c.is_active ? "무효 처리" : "유효 처리"}
                        className={`p-1.5 rounded-md transition-colors ${
                          c.is_active
                            ? "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            : "hover:bg-green-100 text-muted-foreground hover:text-green-600"
                        }`}
                      >
                        {c.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); openEdit(c); }} className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-border/40 px-4 py-3 bg-muted/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] mb-3">
                    {c.business_type && <div><span className="text-muted-foreground">업태:</span> {c.business_type}</div>}
                    {c.business_item && <div><span className="text-muted-foreground">종목:</span> {c.business_item}</div>}
                    {c.zip_code && <div><span className="text-muted-foreground">우편번호:</span> {c.zip_code}</div>}
                    {c.address2 && <div><span className="text-muted-foreground">상세주소:</span> {c.address2}</div>}
                    {c.num && <div><span className="text-muted-foreground">NUM:</span> {c.num}</div>}
                  </div>

                  {cts.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-foreground">발행정보 / 연락처</p>
                      {cts.map((ct) => (
                        <div key={ct.id} className="flex items-center gap-4 text-[12px] py-1.5 px-3 rounded-lg bg-white border border-border/40">
                          <div className="flex items-center gap-1.5 min-w-[80px]">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">{ct.name || "-"}</span>
                            {ct.position && <span className="text-muted-foreground text-[10px]">({ct.position})</span>}
                          </div>
                          {ct.department && <span className="text-muted-foreground text-[11px]">{ct.department}</span>}
                          {ct.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" />{ct.phone}</span>}
                          {ct.mobile && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" />{ct.mobile}</span>}
                          {ct.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-muted-foreground" />{ct.email}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">등록된 연락처가 없습니다</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-[13px] text-muted-foreground">
            {showInactive ? "무효 처리된 고객사가 없습니다" : "검색 결과가 없습니다"}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editCompany ? "고객사 수정" : "고객사 추가"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-medium text-foreground">사업자등록번호 *</label>
                <Input value={form.business_number} onChange={(e) => setForm(f => ({ ...f, business_number: e.target.value }))} className="h-8 text-[13px] mt-1" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-foreground">상호 *</label>
                <Input value={form.company_name} onChange={(e) => setForm(f => ({ ...f, company_name: e.target.value }))} className="h-8 text-[13px] mt-1" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-foreground">대표자명</label>
                <Input value={form.ceo_name} onChange={(e) => setForm(f => ({ ...f, ceo_name: e.target.value }))} className="h-8 text-[13px] mt-1" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-foreground">NUM</label>
                <Input value={form.num} onChange={(e) => setForm(f => ({ ...f, num: e.target.value }))} className="h-8 text-[13px] mt-1" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-foreground">업태</label>
                <Input value={form.business_type} onChange={(e) => setForm(f => ({ ...f, business_type: e.target.value }))} className="h-8 text-[13px] mt-1" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-foreground">종목</label>
                <Input value={form.business_item} onChange={(e) => setForm(f => ({ ...f, business_item: e.target.value }))} className="h-8 text-[13px] mt-1" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-foreground">우편번호</label>
                <Input value={form.zip_code} onChange={(e) => setForm(f => ({ ...f, zip_code: e.target.value }))} className="h-8 text-[13px] mt-1" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-foreground">주소1</label>
                <Input value={form.address1} onChange={(e) => setForm(f => ({ ...f, address1: e.target.value }))} className="h-8 text-[13px] mt-1" />
              </div>
              <div className="col-span-2">
                <label className="text-[12px] font-medium text-foreground">주소2</label>
                <Input value={form.address2} onChange={(e) => setForm(f => ({ ...f, address2: e.target.value }))} className="h-8 text-[13px] mt-1" />
              </div>
            </div>

            {/* Contacts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-semibold text-foreground">발행정보 / 연락처</label>
                <button onClick={addContact} className="text-[11px] text-primary hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> 연락처 추가
                </button>
              </div>
              {formContacts.map((ct, idx) => (
                <div key={idx} className="grid grid-cols-6 gap-2 mb-2 items-end">
                  <div>
                    <label className="text-[10px] text-muted-foreground">성명</label>
                    <Input value={ct.name || ""} onChange={(e) => updateContact(idx, "name", e.target.value)} className="h-7 text-[12px]" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">직급</label>
                    <Input value={ct.position || ""} onChange={(e) => updateContact(idx, "position", e.target.value)} className="h-7 text-[12px]" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">전화</label>
                    <Input value={ct.phone || ""} onChange={(e) => updateContact(idx, "phone", e.target.value)} className="h-7 text-[12px]" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">휴대폰</label>
                    <Input value={ct.mobile || ""} onChange={(e) => updateContact(idx, "mobile", e.target.value)} className="h-7 text-[12px]" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">이메일</label>
                    <Input value={ct.email || ""} onChange={(e) => updateContact(idx, "email", e.target.value)} className="h-7 text-[12px]" />
                  </div>
                  <div className="flex items-end pb-0.5">
                    {formContacts.length > 1 && (
                      <button onClick={() => removeContact(idx)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-muted/50 transition-colors">취소</button>
            <button onClick={handleSubmit} disabled={!form.business_number || !form.company_name} className="px-4 py-2 text-[13px] rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" /> {editCompany ? "수정" : "추가"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
