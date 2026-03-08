import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PAYMENT_TYPES, getPaymentTypeLabel, getPaymentTypeColor } from "./paymentTypes";

interface Client {
  id: string;
  client_no: number;
  name: string;
  expected_payment_day: string | null;
  notes: string | null;
  is_active: boolean;
}

interface Payment {
  id: string;
  client_id: string;
  year: number;
  month: number;
  amount: number;
  paid_date: string | null;
  is_unpaid: boolean;
  memo: string | null;
  payment_type: string;
}

interface Props {
  client: Client;
  payments: Payment[];
  onBack: () => void;
  onAddPayment: () => void;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (paymentId: string) => void;
  onEditClient: () => void;
}

const formatWon = (n: number) => "₩" + n.toLocaleString("ko-KR");

export default function ClientDetail({ client, payments, onBack, onAddPayment, onEditPayment, onDeletePayment, onEditClient }: Props) {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const clientPayments = useMemo(
    () => payments
      .filter((p) => p.client_id === client.id)
      .sort((a, b) => b.year - a.year || b.month - a.month),
    [payments, client.id]
  );

  const filteredPayments = useMemo(
    () => typeFilter === "all" ? clientPayments : clientPayments.filter((p) => p.payment_type === typeFilter),
    [clientPayments, typeFilter]
  );

  const unpaidTotal = useMemo(
    () => clientPayments.filter((p) => p.is_unpaid).reduce((s, p) => s + (p.amount || 0), 0),
    [clientPayments]
  );

  // Unpaid by type
  const unpaidByType = useMemo(() => {
    const map = new Map<string, number>();
    clientPayments.filter((p) => p.is_unpaid).forEach((p) => {
      const t = p.payment_type || "hosting";
      map.set(t, (map.get(t) || 0) + (p.amount || 0));
    });
    return map;
  }, [clientPayments]);

  // Chart: last 12 months (hosting only for chart clarity)
  const chartData = useMemo(() => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const data: { month: string; amount: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      let m = now.getMonth() + 1 - i;
      let y = now.getFullYear();
      if (m <= 0) { m += 12; y -= 1; }
      const total = clientPayments
        .filter((p) => p.year === y && p.month === m && !p.is_unpaid)
        .reduce((s, p) => s + (p.amount || 0), 0);
      data.push({ month: `${m}월`, amount: total });
    }
    return data;
  }, [clientPayments]);

  // Unique payment types used by this client
  const usedTypes = useMemo(() => {
    const types = new Set(clientPayments.map((p) => p.payment_type || "hosting"));
    return Array.from(types);
  }, [clientPayments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">{client.name}</h2>
            {!client.is_active && <Badge variant="secondary" className="text-[11px]">비활성</Badge>}
          </div>
          <div className="flex items-center gap-4 text-[12px] text-muted-foreground mt-1">
            <span>예상납부일: {client.expected_payment_day || "-"}</span>
            {client.notes && <span>비고: {client.notes}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onEditClient} className="h-8 text-[12px]">
            <Edit2 className="w-3 h-3 mr-1" />수정
          </Button>
          <Button size="sm" onClick={onAddPayment} className="h-8 text-[12px] bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]">
            <Plus className="w-3 h-3 mr-1" />입금 추가
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[hsl(220,13%,91%)]">
          <h3 className="text-[14px] font-semibold mb-2">총 미납 현황</h3>
          <p className={`text-2xl font-bold ${unpaidTotal > 0 ? "text-red-600" : "text-emerald-600"}`}>
            {unpaidTotal > 0 ? formatWon(unpaidTotal) : "미납 없음"}
          </p>
          {unpaidByType.size > 0 && (
            <div className="mt-3 space-y-1.5">
              {Array.from(unpaidByType.entries()).map(([type, amount]) => (
                <div key={type} className="flex items-center justify-between text-[12px]">
                  <Badge className={`${getPaymentTypeColor(type)} hover:opacity-90 text-[10px]`}>{getPaymentTypeLabel(type)}</Badge>
                  <span className="text-red-600 font-medium">{formatWon(amount)}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-[12px] text-muted-foreground mt-2">총 {clientPayments.length}건의 기록</p>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[hsl(220,13%,91%)]">
          <h3 className="text-[14px] font-semibold mb-3">월별 입금 추이 (12개월, 전체 항목)</h3>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
                <Tooltip formatter={(v: number) => formatWon(v)} />
                <Line type="monotone" dataKey="amount" stroke="hsl(221,83%,53%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[hsl(220,13%,91%)] flex items-center justify-between">
          <h3 className="text-[14px] font-semibold">입금 내역</h3>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px] h-8 text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-[12px]">전체 항목</SelectItem>
              {PAYMENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-[12px]">{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,97%)]">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">연도</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">월</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">항목</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">금액</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">입금일</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">메모</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">상태</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-[80px]">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.id} className="border-b border-[hsl(220,13%,93%)] hover:bg-[hsl(220,14%,97.5%)]">
                  <td className="px-4 py-3">{p.year}</td>
                  <td className="px-4 py-3">{p.month}월</td>
                  <td className="px-4 py-3">
                    <Badge className={`${getPaymentTypeColor(p.payment_type || "hosting")} hover:opacity-90 text-[10px]`}>
                      {getPaymentTypeLabel(p.payment_type || "hosting")}
                    </Badge>
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${p.is_unpaid ? "text-red-600" : ""}`}>
                    {formatWon(p.amount || 0)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.paid_date?.replace(/-/g, ".") || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.memo || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    {p.is_unpaid
                      ? <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[11px]">미납</Badge>
                      : <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[11px]">완료</Badge>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onEditPayment(p)} className="p-1.5 rounded-lg hover:bg-[hsl(220,14%,93%)] text-muted-foreground">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDeletePayment(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">입금 내역이 없습니다</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
