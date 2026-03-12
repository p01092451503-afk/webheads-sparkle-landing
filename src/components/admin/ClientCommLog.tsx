import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Loader2, MessageCircle, Phone, Mail, Users, FileText, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface CommLog {
  id: string;
  company_id: string;
  log_type: string;
  title: string | null;
  content: string | null;
  log_date: string;
  created_at: string;
}

interface Props {
  companyId: string;
  isSuperAdmin: boolean;
}

const LOG_TYPES = [
  { value: "meeting", label: "미팅", icon: Users, color: "text-blue-600 bg-blue-50" },
  { value: "call", label: "통화", icon: Phone, color: "text-emerald-600 bg-emerald-50" },
  { value: "email", label: "이메일", icon: Mail, color: "text-amber-600 bg-amber-50" },
  { value: "memo", label: "메모", icon: FileText, color: "text-purple-600 bg-purple-50" },
];

export default function ClientCommLog({ companyId, isSuperAdmin }: Props) {
  const [logs, setLogs] = useState<CommLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ log_type: "memo", title: "", content: "", log_date: new Date().toISOString().split("T")[0] });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("client_comm_logs")
      .select("*")
      .eq("company_id", companyId)
      .order("log_date", { ascending: false });
    setLogs((data as any[]) || []);
    setLoading(false);
  }, [companyId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleSubmit = async () => {
    if (!form.content && !form.title) { toast.error("제목 또는 내용을 입력하세요"); return; }
    try {
      await supabase.from("client_comm_logs").insert({
        company_id: companyId,
        log_type: form.log_type,
        title: form.title || null,
        content: form.content || null,
        log_date: form.log_date,
      });
      toast.success("기록 추가 완료");
      setShowModal(false);
      fetchLogs();
    } catch { toast.error("저장 실패"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("client_comm_logs").delete().eq("id", id);
    toast.success("삭제 완료");
    fetchLogs();
  };

  const getTypeInfo = (type: string) => LOG_TYPES.find(t => t.value === type) || LOG_TYPES[3];

  if (loading) return <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5 text-primary" /> 커뮤니케이션 로그 ({logs.length})
        </p>
        <button onClick={() => { setForm({ log_type: "memo", title: "", content: "", log_date: new Date().toISOString().split("T")[0] }); setShowModal(true); }} className="text-[11px] text-primary hover:underline flex items-center gap-1">
          <Plus className="w-3 h-3" /> 추가
        </button>
      </div>

      {logs.length === 0 ? (
        <p className="text-[11px] text-muted-foreground py-2">기록이 없습니다</p>
      ) : (
        <div className="relative pl-4 border-l-2 border-border/40 space-y-2">
          {logs.map(log => {
            const typeInfo = getTypeInfo(log.log_type);
            const Icon = typeInfo.icon;
            return (
              <div key={log.id} className="relative">
                <div className="absolute -left-[21px] top-2 w-3 h-3 rounded-full border-2 border-background bg-border" />
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-white border border-border/40 text-[12px]">
                  <div className={`p-1 rounded ${typeInfo.color} shrink-0 mt-0.5`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {log.title && <span className="font-medium">{log.title}</span>}
                      <span className="text-[10px] text-muted-foreground">{new Date(log.log_date).toLocaleDateString("ko-KR")}</span>
                    </div>
                    {log.content && <p className="text-[11px] text-muted-foreground mt-0.5 whitespace-pre-wrap">{log.content}</p>}
                  </div>
                  {isSuperAdmin && (
                    <button onClick={() => handleDelete(log.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>커뮤니케이션 기록 추가</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-[12px] font-medium">유형</label>
              <div className="flex gap-2 mt-1">
                {LOG_TYPES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setForm(f => ({ ...f, log_type: t.value }))}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                      form.log_type === t.value ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <t.icon className="w-3 h-3" /> {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium">날짜</label>
              <Input type="date" value={form.log_date} onChange={e => setForm(f => ({ ...f, log_date: e.target.value }))} className="h-8 text-[13px] mt-1" />
            </div>
            <div>
              <label className="text-[12px] font-medium">제목</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="선택사항" className="h-8 text-[13px] mt-1" />
            </div>
            <div>
              <label className="text-[12px] font-medium">내용</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="w-full text-[13px] mt-1 rounded-md border border-input bg-background px-3 py-2 min-h-[80px] resize-none" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-muted/50">취소</button>
            <button onClick={handleSubmit} className="px-4 py-2 text-[13px] rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" /> 추가
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
