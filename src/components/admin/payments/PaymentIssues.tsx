import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentIssues() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Use month + 200 offset to avoid collision with expense notes and expected
  const storageMonth = viewMonth + 200;

  const loadData = useCallback(async () => {
    const { data } = await supabase
      .from("expense_notes")
      .select("content")
      .eq("year", viewYear)
      .eq("month", storageMonth)
      .maybeSingle();

    setContent(data?.content || "");
    setLoaded(true);
  }, [viewYear, storageMonth]);

  useEffect(() => {
    setLoaded(false);
    loadData();
  }, [loadData]);

  const saveData = useCallback(async () => {
    setSaving(true);
    const key = { year: viewYear, month: storageMonth };

    const { data: existing } = await supabase
      .from("expense_notes")
      .select("id")
      .eq("year", key.year)
      .eq("month", key.month)
      .maybeSingle();

    if (existing) {
      await supabase.from("expense_notes").update({ content }).eq("id", existing.id);
    } else {
      await supabase.from("expense_notes").insert({ ...key, content });
    }
    setSaving(false);
    toast.success("저장되었습니다");
  }, [content, viewYear, storageMonth]);

  // Ctrl+S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        saveData();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [saveData]);

  const goMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  if (!loaded) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => goMonth(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-[14px] font-semibold text-foreground min-w-[120px] text-center">
            {viewYear}년 {viewMonth}월 Issue
          </h3>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => goMonth(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button size="sm" onClick={saveData} disabled={saving} className="h-7 text-[12px] gap-1">
          <Save className="w-3.5 h-3.5" /> 저장
        </Button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-background">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="미납 관련 이슈, 메모 등을 자유롭게 기록하세요..."
          className="w-full min-h-[400px] p-4 text-[13px] leading-relaxed bg-transparent border-0 outline-none resize-y placeholder:text-muted-foreground/50"
        />
      </div>

      <p className="text-[11px] text-muted-foreground">
        Ctrl+S (⌘+S) 로 빠르게 저장할 수 있습니다
      </p>
    </div>
  );
}
