import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Loader2, CheckCircle2, Circle, ChevronLeft, ChevronRight, ListChecks, Settings2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  year: number;
  month: number;
  task_name: string;
  is_completed: boolean;
  completed_at: string | null;
  sort_order: number;
}

interface Template {
  id: string;
  task_name: string;
  sort_order: number;
  is_active: boolean;
}

interface Props {
  isSuperAdmin: boolean;
}

export default function MonthlyChecklist({ isSuperAdmin }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTemplate, setNewTemplate] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("monthly_checklists")
      .select("*")
      .eq("year", year)
      .eq("month", month)
      .order("sort_order");
    setItems((data as any[]) || []);
    setLoading(false);
  }, [year, month]);

  const fetchTemplates = useCallback(async () => {
    const { data } = await supabase.from("checklist_templates").select("*").eq("is_active", true).order("sort_order");
    setTemplates((data as any[]) || []);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const generateFromTemplates = async () => {
    if (items.length > 0) {
      if (!confirm("이미 항목이 있습니다. 템플릿에서 추가하시겠습니까?")) return;
    }
    const newItems = templates.map(t => ({
      year, month, task_name: t.task_name, sort_order: t.sort_order,
    }));
    if (newItems.length === 0) { toast.error("등록된 템플릿이 없습니다"); return; }
    await supabase.from("monthly_checklists").insert(newItems);
    toast.success(`${newItems.length}개 항목이 생성되었습니다`);
    fetchItems();
  };

  const toggleItem = async (item: ChecklistItem) => {
    const newCompleted = !item.is_completed;
    await supabase.from("monthly_checklists").update({
      is_completed: newCompleted,
      completed_at: newCompleted ? new Date().toISOString() : null,
    }).eq("id", item.id);
    fetchItems();
  };

  const [isAdding, setIsAdding] = useState(false);
  const addTask = async () => {
    if (!newTask.trim() || isAdding) return;
    setIsAdding(true);
    const taskName = newTask.trim();
    setNewTask("");
    const maxOrder = items.reduce((max, i) => Math.max(max, i.sort_order), 0);
    await supabase.from("monthly_checklists").insert({
      year, month, task_name: taskName, sort_order: maxOrder + 1,
    });
    await fetchItems();
    setIsAdding(false);
  };

  const deleteItem = async (id: string) => {
    await supabase.from("monthly_checklists").delete().eq("id", id);
    fetchItems();
  };

  const addTemplate = async () => {
    if (!newTemplate.trim()) return;
    const maxOrder = templates.reduce((max, t) => Math.max(max, t.sort_order), 0);
    await supabase.from("checklist_templates").insert({ task_name: newTemplate.trim(), sort_order: maxOrder + 1 });
    setNewTemplate("");
    fetchTemplates();
    toast.success("템플릿 추가 완료");
  };

  const deleteTemplate = async (id: string) => {
    await supabase.from("checklist_templates").delete().eq("id", id);
    fetchTemplates();
  };

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const completedCount = items.filter(i => i.is_completed).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ListChecks className="w-5 h-5" /> 월간 업무 체크리스트
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">매월 반복 업무를 관리합니다</p>
        </div>
        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <button onClick={() => setShowTemplates(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium border border-border hover:bg-muted/50 transition-colors">
              <Settings2 className="w-3.5 h-3.5" /> 템플릿 관리
            </button>
          )}
        </div>
      </div>

      {/* Month selector */}
      <div className="flex items-center gap-3">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <span className="text-[14px] font-semibold min-w-[100px] text-center">{year}년 {month}월</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"><ChevronRight className="w-4 h-4" /></button>

        {items.length === 0 && (
          <button onClick={generateFromTemplates} className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" /> 템플릿에서 생성
          </button>
        )}
      </div>

      {/* Progress */}
      {items.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[12px] font-semibold text-foreground">{completedCount}/{items.length} ({progress}%)</span>
        </div>
      )}

      {/* Checklist */}
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="space-y-1.5">
          {items.map(item => (
            <div key={item.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors ${
              item.is_completed ? "bg-muted/30 border-border/40" : "bg-white border-border/60"
            }`}>
              <button onClick={() => toggleItem(item)} className="shrink-0">
                {item.is_completed
                  ? <CheckCircle2 className="w-5 h-5 text-primary" />
                  : <Circle className="w-5 h-5 text-muted-foreground/40 hover:text-primary/60 transition-colors" />
                }
              </button>
              <span className={`flex-1 text-[13px] ${item.is_completed ? "line-through text-muted-foreground" : "text-foreground font-medium"}`}>
                {item.task_name}
              </span>
              {item.completed_at && (
                <span className="text-[10px] text-muted-foreground">
                  {new Date(item.completed_at).toLocaleDateString("ko-KR")}
                </span>
              )}
              {isSuperAdmin && (
                <button onClick={() => deleteItem(item.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          {/* Add task inline */}
          {isSuperAdmin && (
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
                placeholder="새 항목 추가..."
                className="h-8 text-[13px] flex-1"
              />
              <button onClick={addTask} disabled={!newTask.trim()} className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                추가
              </button>
            </div>
          )}
        </div>
      )}

      {/* Template management dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>체크리스트 템플릿 관리</DialogTitle></DialogHeader>
          <p className="text-[12px] text-muted-foreground">매월 기본으로 생성할 업무 항목을 관리합니다.</p>
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {templates.map(t => (
              <div key={t.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/40 bg-muted/20 text-[13px]">
                <span className="flex-1">{t.task_name}</span>
                <button onClick={() => deleteTemplate(t.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input value={newTemplate} onChange={e => setNewTemplate(e.target.value)} onKeyDown={e => e.key === "Enter" && addTemplate()} placeholder="새 템플릿 항목..." className="h-8 text-[13px]" />
            <button onClick={addTemplate} disabled={!newTemplate.trim()} className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shrink-0">
              추가
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
