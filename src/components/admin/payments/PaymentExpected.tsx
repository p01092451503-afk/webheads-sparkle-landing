import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Save, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExpectedRow {
  id: string;
  clientName: string;
  amount: string;
  description: string;
  memo: string;
}

interface Props {
  year: number;
  month: number;
}

const createEmptyRow = (): ExpectedRow => ({
  id: crypto.randomUUID(),
  clientName: "",
  amount: "",
  description: "",
  memo: "",
});

export default function PaymentExpected({ year, month }: Props) {
  const [rows, setRows] = useState<ExpectedRow[]>([createEmptyRow()]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadData = useCallback(async () => {
    const { data } = await supabase
      .from("expense_notes")
      .select("content")
      .eq("year", year)
      .eq("month", month + 100) // offset to avoid collision with expense notes
      .maybeSingle();

    if (data?.content) {
      try {
        const parsed = JSON.parse(data.content);
        const arr = Array.isArray(parsed) ? parsed : [];
        if (arr.length > 0) {
          setRows(arr.map((r: any) => ({ ...createEmptyRow(), ...r })));
        } else {
          setRows([createEmptyRow()]);
        }
      } catch {
        setRows([createEmptyRow()]);
      }
    } else {
      setRows([createEmptyRow()]);
    }
    setLoaded(true);
  }, [year, month]);

  useEffect(() => {
    setLoaded(false);
    loadData();
  }, [loadData]);

  const saveData = useCallback(async () => {
    setSaving(true);
    const filtered = rows.filter(r => r.clientName || r.amount || r.description || r.memo);
    const content = JSON.stringify(filtered);
    const key = { year, month: month + 100 };

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
  }, [rows, year, month]);

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

  const updateRow = (id: string, field: keyof ExpectedRow, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRow = (atIndex?: number) => {
    setRows(prev => {
      const newRow = createEmptyRow();
      if (atIndex !== undefined) {
        const copy = [...prev];
        copy.splice(atIndex, 0, newRow);
        return copy;
      }
      return [newRow, ...prev];
    });
  };

  const removeRow = (id: string) => {
    setRows(prev => {
      const next = prev.filter(r => r.id !== id);
      return next.length === 0 ? [createEmptyRow()] : next;
    });
  };

  const moveRow = (idx: number, dir: -1 | 1) => {
    setRows(prev => {
      const copy = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= copy.length) return prev;
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRow(idx);
      setTimeout(() => {
        const inputs = document.querySelectorAll<HTMLInputElement>("[data-expected-client]");
        inputs[idx]?.focus();
      }, 30);
    }
  };

  const formatAmount = (val: string) => {
    const num = parseInt(val.replace(/[^0-9]/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString("ko-KR");
  };

  const totalAmount = rows.reduce((sum, r) => {
    const num = parseInt(r.amount.replace(/[^0-9]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  if (!loaded) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-semibold text-foreground">
            {year}년 {month}월 청구내역
          </h3>
          {totalAmount > 0 && (
            <span className="text-[12px] text-muted-foreground">
              합계: ₩{totalAmount.toLocaleString("ko-KR")}
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" onClick={() => addRow(0)} className="h-7 text-[12px] gap-1">
            <Plus className="w-3.5 h-3.5" /> 행 추가
          </Button>
          <Button size="sm" onClick={saveData} disabled={saving} className="h-7 text-[12px] gap-1">
            <Save className="w-3.5 h-3.5" /> 저장
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-background">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-3 py-2 font-medium text-muted-foreground w-[20%]">고객사명</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground w-[18%]">금액</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground w-[28%]">내용</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground w-[24%]">메모</th>
              <th className="px-2 py-2 w-[10%]" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-2 py-1">
                  <Input
                    data-expected-client
                    value={row.clientName}
                    onChange={e => updateRow(row.id, "clientName", e.target.value)}
                    onKeyDown={e => handleKeyDown(e, idx)}
                    placeholder="고객사"
                    className="h-7 text-[12px] border-0 bg-transparent shadow-none focus-visible:ring-1"
                  />
                </td>
                <td className="px-2 py-1">
                  <Input
                    value={row.amount}
                    onChange={e => updateRow(row.id, "amount", formatAmount(e.target.value))}
                    onKeyDown={e => handleKeyDown(e, idx)}
                    placeholder="0"
                    className="h-7 text-[12px] text-right border-0 bg-transparent shadow-none focus-visible:ring-1"
                  />
                </td>
                <td className="px-2 py-1">
                  <Input
                    value={row.description}
                    onChange={e => updateRow(row.id, "description", e.target.value)}
                    onKeyDown={e => handleKeyDown(e, idx)}
                    placeholder="내용"
                    className="h-7 text-[12px] border-0 bg-transparent shadow-none focus-visible:ring-1"
                  />
                </td>
                <td className="px-2 py-1">
                  <Input
                    value={row.memo}
                    onChange={e => updateRow(row.id, "memo", e.target.value)}
                    onKeyDown={e => handleKeyDown(e, idx)}
                    placeholder="메모"
                    className="h-7 text-[12px] border-0 bg-transparent shadow-none focus-visible:ring-1"
                  />
                </td>
                <td className="px-1 py-1">
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => moveRow(idx, -1)} className="p-0.5 text-muted-foreground hover:text-foreground" title="위로">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => moveRow(idx, 1)} className="p-0.5 text-muted-foreground hover:text-foreground" title="아래로">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeRow(row.id)} className="p-0.5 text-muted-foreground hover:text-destructive" title="삭제">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
