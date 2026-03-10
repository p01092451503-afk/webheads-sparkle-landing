import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Loader2, FolderKanban, Calendar, Save, ChevronDown, ChevronUp, AlertTriangle, ArrowRight, StickyNote } from "lucide-react";
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

interface ProjectNote {
  id: string;
  project_id: string;
  note_type: string;
  content: string;
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

const NOTE_TYPES = [
  { value: "progress", label: "진행상황", icon: ArrowRight, color: "text-blue-600 bg-blue-50" },
  { value: "issue", label: "이슈", icon: AlertTriangle, color: "text-red-600 bg-red-50" },
  { value: "memo", label: "메모", icon: StickyNote, color: "text-amber-600 bg-amber-50" },
];

const formatAmount = (v: number) => v.toLocaleString("ko-KR");

export default function ClientProjectManager({ companyId, companyName, isSuperAdmin }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newNoteType, setNewNoteType] = useState("progress");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [form, setForm] = useState({
    project_name: "", contract_amount: "", contract_start_date: "", contract_end_date: "", status: "in_progress", description: "",
  });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("client_projects")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });
    setProjects((data as any[]) || []);
    setLoading(false);
  }, [companyId]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const fetchNotes = useCallback(async (projectId: string) => {
    setNotesLoading(true);
    const { data } = await supabase
      .from("project_notes")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    setNotes((data as any[]) || []);
    setNotesLoading(false);
  }, []);

  const toggleExpand = (projectId: string) => {
    if (expandedId === projectId) {
      setExpandedId(null);
      setNotes([]);
    } else {
      setExpandedId(projectId);
      fetchNotes(projectId);
    }
  };

  const addNote = async () => {
    if (!newNote.trim() || !expandedId || isAddingNote) return;
    setIsAddingNote(true);
    const content = newNote.trim();
    setNewNote("");
    await supabase.from("project_notes").insert({
      project_id: expandedId,
      note_type: newNoteType,
      content,
    });
    await fetchNotes(expandedId);
    setIsAddingNote(false);
  };

  const deleteNote = async (noteId: string) => {
    if (!expandedId) return;
    await supabase.from("project_notes").delete().eq("id", noteId);
    fetchNotes(expandedId);
  };

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
      fetchProjects();
    } catch { toast.error("저장 실패"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("client_projects").delete().eq("id", id);
    toast.success("삭제 완료");
    fetchProjects();
  };

  const getStatusBadge = (status: string) => {
    const s = STATUS_OPTIONS.find(o => o.value === status);
    return s ? <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span> : null;
  };

  const getNoteTypeInfo = (type: string) => NOTE_TYPES.find(t => t.value === type) || NOTE_TYPES[2];

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
            <div key={p.id} className="rounded-lg border border-border/40 overflow-hidden">
              <div
                className={`flex items-center gap-3 px-3 py-2 bg-white text-[12px] cursor-pointer hover:bg-muted/20 transition-colors ${expandedId === p.id ? "border-b border-border/30" : ""}`}
                onClick={() => toggleExpand(p.id)}
              >
                <button className="shrink-0 text-muted-foreground">
                  {expandedId === p.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
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
                  {p.description && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{p.description}</p>
                  )}
                </div>
                {isSuperAdmin && (
                  <div className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openEdit(p)} className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground"><Edit className="w-3 h-3" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                  </div>
                )}
              </div>

              {/* Expanded notes section */}
              {expandedId === p.id && (
                <div className="bg-muted/10 px-4 py-3 space-y-3">
                  {p.description && (
                    <p className="text-[11px] text-muted-foreground bg-muted/30 rounded-md px-3 py-2">{p.description}</p>
                  )}

                  {/* Add note */}
                  {isSuperAdmin && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {NOTE_TYPES.map(t => (
                          <button
                            key={t.value}
                            onClick={() => setNewNoteType(t.value)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                              newNoteType === t.value ? "border-primary bg-primary/5 text-primary" : "border-border/40 text-muted-foreground hover:bg-muted/50"
                            }`}
                          >
                            <t.icon className="w-2.5 h-2.5" /> {t.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={newNote}
                          onChange={e => setNewNote(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter" && !e.nativeEvent.isComposing) addNote(); }}
                          placeholder="진행상황, 이슈, 메모를 기록하세요..."
                          className="h-7 text-[12px] flex-1"
                        />
                        <button onClick={addNote} disabled={!newNote.trim() || isAddingNote} className="px-2.5 py-1 rounded text-[11px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shrink-0">
                          추가
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notes list */}
                  {notesLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" /></div>
                  ) : notes.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground text-center py-3">기록이 없습니다</p>
                  ) : (
                    <div className="space-y-1">
                      {notes.map(note => {
                        const typeInfo = getNoteTypeInfo(note.note_type);
                        const Icon = typeInfo.icon;
                        return (
                          <div key={note.id} className="flex items-start gap-2 px-3 py-2 rounded-md bg-background border border-border/30 text-[12px]">
                            <div className={`p-0.5 rounded shrink-0 mt-0.5 ${typeInfo.color}`}>
                              <Icon className="w-3 h-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="whitespace-pre-wrap text-[12px]">{note.content}</p>
                              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                {new Date(note.created_at).toLocaleDateString("ko-KR")} {new Date(note.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            {isSuperAdmin && (
                              <button onClick={() => deleteNote(note.id)} className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
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
