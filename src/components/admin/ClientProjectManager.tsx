import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Loader2, FolderKanban, Calendar, X, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Project {
  id: string;
  company_id: string;
  project_name: string;
  contract_amount: number;
  contract_start_date: string | null;
  contract_end_date: string | null;
  status: string;
  description: string | null;
  created_at: string;
}

interface Props {
  companyId: string;
  companyName: string;
  isSuperAdmin: boolean;
}

const STATUS_OPTIONS = [
  { value: "in_progress", label: "진행중", color: "bg-blue-100 text-blue-700" },
  { value: "completed", label: "완료", color: "bg-emerald-100 text-emerald-700" },
  { value: "paused", label: "중단", color: "bg-amber-100 text-amber-700" },
  { value: "planned", label: "계획", color: "bg-purple-100 text-purple-700" },
];

const formatAmount = (v: number) => v.toLocaleString("ko-KR");

export default function ClientProjectManager({ companyId, companyName, isSuperAdmin }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [form, setForm] = useState({
    project_name: "", contract_amount: "", contract_start_date: "", contract_end_date: "", status: "in_progress", description: "",
  });

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("client_projects")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });
    setProjects((data as any[]) || []);
    setLoading(false);
  }, [companyId]);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => {
    setEditProject(null);
    setForm({ project_name: "", contract_amount: "", contract_start_date: "", contract_end_date: "", status: "in_progress", description: "" });
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditProject(p);
    setForm({
      project_name: p.project_name,
      contract_amount: p.contract_amount ? formatAmount(p.contract_amount) : "",
      contract_start_date: p.contract_start_date || "",
      contract_end_date: p.contract_end_date || "",
      status: p.status,
      description: p.description || "",
    });
    setShowModal(true);
  };

  const handleAmountChange = (val: string) => {
    const num = val.replace(/[^\d]/g, "");
    setForm(f => ({ ...f, contract_amount: num ? Number(num).toLocaleString("ko-KR") : "" }));
  };

  const handleSubmit = async () => {
    if (!form.project_name) { toast.error("프로젝트명은 필수입니다"); return; }
    const amount = Number((form.contract_amount || "0").replace(/[^\d]/g, ""));
    const payload = {
      company_id: companyId,
      project_name: form.project_name,
      contract_amount: amount,
      contract_start_date: form.contract_start_date || null,
      contract_end_date: form.contract_end_date || null,
      status: form.status,
      description: form.description || null,
    };
    try {
      if (editProject) {
        await supabase.from("client_projects").update(payload).eq("id", editProject.id);
        toast.success("수정 완료");
      } else {
        await supabase.from("client_projects").insert(payload);
        toast.success("추가 완료");
      }
      setShowModal(false);
      fetch();
    } catch { toast.error("저장 실패"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("client_projects").delete().eq("id", id);
    toast.success("삭제 완료");
    fetch();
  };

  const getStatusBadge = (status: string) => {
    const s = STATUS_OPTIONS.find(o => o.value === status);
    return s ? <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span> : null;
  };

  if (loading) return <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
          <FolderKanban className="w-3.5 h-3.5 text-primary" /> 프로젝트 ({projects.length})
        </p>
        {isSuperAdmin && (
          <button onClick={openAdd} className="text-[11px] text-primary hover:underline flex items-center gap-1">
            <Plus className="w-3 h-3" /> 추가
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="text-[11px] text-muted-foreground py-2">등록된 프로젝트가 없습니다</p>
      ) : (
        <div className="space-y-1.5">
          {projects.map(p => (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white border border-border/40 text-[12px]">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{p.project_name}</span>
                  {getStatusBadge(p.status)}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
                  {p.contract_amount > 0 && <span className="font-medium text-foreground">{formatAmount(p.contract_amount)}원</span>}
                  {p.contract_start_date && (
                    <span className="flex items-center gap-0.5">
                      <Calendar className="w-3 h-3" />
                      {p.contract_start_date}{p.contract_end_date ? ` ~ ${p.contract_end_date}` : ""}
                    </span>
                  )}
                </div>
              </div>
              {isSuperAdmin && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <button onClick={() => openEdit(p)} className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground"><Edit className="w-3 h-3" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editProject ? "프로젝트 수정" : "프로젝트 추가"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-[12px] font-medium">프로젝트명 *</label>
              <Input value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))} className="h-8 text-[13px] mt-1" />
            </div>
            <div>
              <label className="text-[12px] font-medium">계약금액</label>
              <Input value={form.contract_amount} onChange={e => handleAmountChange(e.target.value)} placeholder="0" className="h-8 text-[13px] mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-medium">시작일</label>
                <Input type="date" value={form.contract_start_date} onChange={e => setForm(f => ({ ...f, contract_start_date: e.target.value }))} className="h-8 text-[13px] mt-1" />
              </div>
              <div>
                <label className="text-[12px] font-medium">종료일</label>
                <Input type="date" value={form.contract_end_date} onChange={e => setForm(f => ({ ...f, contract_end_date: e.target.value }))} className="h-8 text-[13px] mt-1" />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium">상태</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full h-8 text-[13px] mt-1 rounded-md border border-input bg-background px-3">
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium">설명</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full text-[13px] mt-1 rounded-md border border-input bg-background px-3 py-2 min-h-[60px] resize-none" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-muted/50">취소</button>
            <button onClick={handleSubmit} disabled={!form.project_name} className="px-4 py-2 text-[13px] rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" /> {editProject ? "수정" : "추가"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
