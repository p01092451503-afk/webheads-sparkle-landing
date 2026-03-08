import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, CheckCircle, Users, TrendingUp } from "lucide-react";

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
}

interface Props {
  clients: Client[];
  payments: Payment[];
  onNavigate: (view: string, clientId?: string) => void;
}

const formatWon = (n: number) => "₩" + n.toLocaleString("ko-KR");

export default function PaymentDashboard({ clients, payments, onNavigate }: Props) {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const activeClients = useMemo(() => clients.filter((c) => c.is_active), [clients]);

  const totalUnpaid = useMemo(
    () => payments.filter((p) => p.is_unpaid).reduce((s, p) => s + (p.amount || 0), 0),
    [payments]
  );

  const thisMonthPayments = useMemo(
    () => payments.filter((p) => p.year === currentYear && p.month === currentMonth),
    [payments, currentYear, currentMonth]
  );

  const paidThisMonth = useMemo(
    () => thisMonthPayments.filter((p) => !p.is_unpaid && p.paid_date),
    [thisMonthPayments]
  );

  const collectionRate = activeClients.length > 0
    ? Math.round((paidThisMonth.length / activeClients.length) * 100)
    : 0;

  const unpaidClients = useMemo(() => {
    const map = new Map<string, number>();
    payments.filter((p) => p.is_unpaid).forEach((p) => {
      map.set(p.client_id, (map.get(p.client_id) || 0) + (p.amount || 0));
    });
    return map;
  }, [payments]);

  const unpaidClientCount = unpaidClients.size;

  const expectedThisMonth = useMemo(
    () => thisMonthPayments.reduce((s, p) => s + (p.amount || 0), 0),
    [thisMonthPayments]
  );

  // Last 6 months chart data
  const chartData = useMemo(() => {
    const data: { month: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      let y = currentYear;
      if (m <= 0) { m += 12; y -= 1; }
      const total = payments
        .filter((p) => p.year === y && p.month === m && !p.is_unpaid)
        .reduce((s, p) => s + (p.amount || 0), 0);
      data.push({ month: `${m}월`, amount: total });
    }
    return data;
  }, [payments, currentYear, currentMonth]);

  // Top 10 unpaid
  const top10Unpaid = useMemo(() => {
    return Array.from(unpaidClients.entries())
      .map(([clientId, amount]) => ({
        client: clients.find((c) => c.id === clientId),
        amount,
      }))
      .filter((x) => x.client)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }, [unpaidClients, clients]);

  const kpis = [
    { label: "총 미납금", value: formatWon(totalUnpaid), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "이달 수금률", value: `${collectionRate}%`, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", progress: collectionRate },
    { label: "미납 고객사", value: `${unpaidClientCount}개사`, icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "이달 예상 수금", value: formatWon(expectedThisMonth), icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 border border-[hsl(220,13%,91%)]">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-4.5 h-4.5 ${kpi.color}`} />
              </div>
              <span className="text-[12px] text-muted-foreground font-medium">{kpi.label}</span>
            </div>
            <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
            {kpi.progress !== undefined && (
              <div className="mt-2 h-2 bg-[hsl(220,14%,93%)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${kpi.progress}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-2xl p-5 border border-[hsl(220,13%,91%)]">
          <h3 className="text-[14px] font-semibold mb-4">월별 수금 현황</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
                <Tooltip formatter={(v: number) => formatWon(v)} />
                <Bar dataKey="amount" fill="hsl(221,83%,53%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Unpaid */}
        <div className="bg-white rounded-2xl p-5 border border-[hsl(220,13%,91%)]">
          <h3 className="text-[14px] font-semibold mb-4">미납 TOP 10</h3>
          <div className="space-y-2">
            {top10Unpaid.length === 0 && (
              <p className="text-[13px] text-muted-foreground py-8 text-center">미납 고객사가 없습니다</p>
            )}
            {top10Unpaid.map((item, i) => (
              <button
                key={item.client!.id}
                onClick={() => onNavigate("detail", item.client!.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[hsl(220,14%,96%)] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-[13px] font-medium">{item.client!.name}</span>
                </div>
                <span className="text-[13px] font-semibold text-red-600">{formatWon(item.amount)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
