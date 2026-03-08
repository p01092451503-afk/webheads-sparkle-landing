import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PAYMENT_TYPES, getPaymentTypeLabel, getPaymentTypeColor } from "./paymentTypes";
import { Save, Plus, Trash2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecurringFee {
  id: string;
  client_id: string;
  payment_type: string;
  amount: number;
  is_active: boolean;
}

interface Props {
  clientId: string;
  clientName: string;
  onClose?: () => void;
}

export default function RecurringFeeManager({ clientId, clientName }: Props) {
  const [fees, setFees] = useState<RecurringFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchFees = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("client_recurring_fees" as any)
      .select("*")
      .eq("client_id", clientId)
      .order("created_at");
    if (data) setFees(data as any);
    setLoading(false);
  }, [clientId]);

  useEffect(() => { fetchFees(); }, [fetchFees]);

  const addFee = async (paymentType: string) => {
    try {
      const { error } = await supabase
        .from("client_recurring_fees" as any)
        .insert({ client_id: clientId, payment_type: paymentType, amount: 0, is_active: true } as any);
      if (error) throw error;
      fetchFees();
    } catch (e: any) {
      toast.error(e.message || "추가 중 오류 발생");
    }
  };

  const updateFee = async (id: string, updates: Partial<RecurringFee>) => {
    try {
      const { error } = await supabase
        .from("client_recurring_fees" as any)
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
      fetchFees();
      toast.success("저장되었습니다");
    } catch (e: any) {
      toast.error(e.message || "저장 중 오류 발생");
    }
  };

  const deleteFee = async (id: string) => {
    try {
      const { error } = await supabase
        .from("client_recurring_fees" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchFees();
      toast.success("삭제되었습니다");
    } catch (e: any) {
      toast.error(e.message || "삭제 중 오류 발생");
    }
  };

  const usedTypes = fees.map((f) => f.payment_type);
  const availableTypes = PAYMENT_TYPES.filter((t) => !usedTypes.includes(t.value));

  if (loading) {
    return <div className="text-[12px] text-muted-foreground py-4 text-center">불러오는 중...</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[13px] font-bold text-foreground">정기 청구 금액 설정</h4>
        <span className="text-[11px] text-muted-foreground">매월 자동 생성됩니다</span>
      </div>

      {fees.length === 0 ? (
        <p className="text-[12px] text-muted-foreground py-3 text-center">설정된 정기 금액이 없습니다</p>
      ) : (
        <div className="space-y-2">
          {fees.map((fee) => (
            <div key={fee.id} className="flex items-center gap-2 bg-[hsl(220,14%,97%)] rounded-lg px-3 py-2">
              <Badge className={`${getPaymentTypeColor(fee.payment_type)} text-[10px] shrink-0`}>
                {getPaymentTypeLabel(fee.payment_type)}
              </Badge>
              <input
                type="text"
                defaultValue={fee.amount ? fee.amount.toLocaleString("ko-KR") : ""}
                placeholder="금액"
                className="flex-1 h-7 px-2 text-[12px] text-right rounded border border-[hsl(220,13%,90%)] bg-white focus:outline-none focus:border-[hsl(221,83%,53%)]"
                onBlur={(e) => {
                  const num = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
                  if (num !== fee.amount) {
                    updateFee(fee.id, { amount: num });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
              />
              <span className="text-[11px] text-muted-foreground">원</span>
              <button
                onClick={() => updateFee(fee.id, { is_active: !fee.is_active })}
                className={`text-[10px] px-2 py-0.5 rounded font-medium transition-all ${
                  fee.is_active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {fee.is_active ? "활성" : "비활성"}
              </button>
              <button
                onClick={() => deleteFee(fee.id)}
                className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {availableTypes.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-muted-foreground">추가:</span>
          {availableTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => addFee(t.value)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all hover:opacity-80 ${t.color}`}
            >
              + {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
