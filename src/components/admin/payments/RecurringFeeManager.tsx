import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PAYMENT_TYPES, getPaymentTypeLabel, getPaymentTypeColor } from "./paymentTypes";
import { Trash2, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RecurringFee {
  id: string;
  client_id: string;
  payment_type: string;
  amount: number;
  is_active: boolean;
  billing_cycle: string;
  contract_start_date: string | null;
}

interface Props {
  clientId: string;
  clientName: string;
  onClose?: () => void;
}

function getNextRenewalDate(startDate: string): { date: string; daysLeft: number } {
  const start = new Date(startDate);
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  
  let renewal = new Date(start);
  while (renewal <= now) {
    renewal.setFullYear(renewal.getFullYear() + 1);
  }
  
  const diffMs = renewal.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const dateStr = `${renewal.getFullYear()}.${String(renewal.getMonth() + 1).padStart(2, "0")}.${String(renewal.getDate()).padStart(2, "0")}`;
  
  return { date: dateStr, daysLeft };
}

export default function RecurringFeeManager({ clientId, clientName }: Props) {
  const [fees, setFees] = useState<RecurringFee[]>([]);
  const [loading, setLoading] = useState(true);

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
        .insert({ client_id: clientId, payment_type: paymentType, amount: 0, is_active: true, billing_cycle: "monthly" } as any);
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
        <span className="text-[11px] text-muted-foreground">월간/연간 주기 설정 가능</span>
      </div>

      {fees.length === 0 ? (
        <p className="text-[12px] text-muted-foreground py-3 text-center">설정된 정기 금액이 없습니다</p>
      ) : (
        <div className="space-y-2">
          {fees.map((fee) => {
            const isAnnual = fee.billing_cycle === "annual";
            const renewal = isAnnual && fee.contract_start_date ? getNextRenewalDate(fee.contract_start_date) : null;

            return (
              <div key={fee.id} className="bg-[hsl(220,14%,97%)] rounded-lg px-3 py-2 space-y-1.5">
                {/* Row 1: type, cycle, amount, controls */}
                <div className="flex items-center gap-2">
                  <Badge className={`${getPaymentTypeColor(fee.payment_type)} text-[10px] shrink-0`}>
                    {getPaymentTypeLabel(fee.payment_type)}
                  </Badge>
                  <Select
                    value={fee.billing_cycle || "monthly"}
                    onValueChange={(v) => updateFee(fee.id, { billing_cycle: v })}
                  >
                    <SelectTrigger className="w-[72px] h-6 text-[11px] bg-white border-[hsl(220,13%,90%)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly" className="text-[11px]">월간</SelectItem>
                      <SelectItem value="annual" className="text-[11px]">연간</SelectItem>
                    </SelectContent>
                  </Select>
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

                {/* Row 2: Annual contract details */}
                {isAnnual && (
                  <div className="flex items-center gap-2 pl-1">
                    <CalendarDays className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="text-[11px] text-muted-foreground">계약시작일:</span>
                    <input
                      type="date"
                      defaultValue={fee.contract_start_date || ""}
                      className="h-6 px-1.5 text-[11px] rounded border border-[hsl(220,13%,90%)] bg-white focus:outline-none focus:border-[hsl(221,83%,53%)]"
                      onChange={(e) => {
                        if (e.target.value) {
                          updateFee(fee.id, { contract_start_date: e.target.value });
                        }
                      }}
                    />
                    {renewal && (
                      <span className={`text-[11px] font-medium ${renewal.daysLeft <= 30 ? "text-red-600" : renewal.daysLeft <= 90 ? "text-amber-600" : "text-muted-foreground"}`}>
                        갱신일: {renewal.date}
                        {renewal.daysLeft <= 90 && ` (${renewal.daysLeft}일 남음)`}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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

export { getNextRenewalDate };
