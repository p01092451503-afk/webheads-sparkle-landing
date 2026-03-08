import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface Expense {
  id: string;
  category_id: string | null;
  year: number;
  month: number;
  amount: number;
  vendor_name: string | null;
  vendor_id: string | null;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Vendor {
  id: string;
  name: string;
}

interface Props {
  allExpenses: Expense[];
  categories: Category[];
  vendors: Vendor[];
}

const formatWon = (n: number) => "₩" + n.toLocaleString("ko-KR");

const PIE_COLORS = [
  "hsl(221,83%,53%)", "hsl(155,60%,45%)", "hsl(40,90%,55%)",
  "hsl(350,70%,55%)", "hsl(270,60%,55%)", "hsl(190,70%,45%)",
  "hsl(20,80%,55%)", "hsl(100,50%,45%)", "hsl(300,50%,55%)",
];

export default function ExpenseStatistics({ allExpenses, categories, vendors }: Props) {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const cy = now.getFullYear();
  const cm = now.getMonth() + 1;

  // Monthly trend (last 12 months)
  const monthlyData = useMemo(() => {
    const months: { key: string; label: string; year: number; month: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      let m = cm - i;
      let y = cy;
      while (m <= 0) { m += 12; y -= 1; }
      months.push({ key: `${y}-${m}`, label: `${m}월`, year: y, month: m });
    }
    return months.map(({ key, label, year, month }) => {
      const total = allExpenses
        .filter((e) => e.year === year && e.month === month)
        .reduce((s, e) => s + (e.amount || 0), 0);
      return { key, label, total };
    });
  }, [allExpenses, cy, cm]);

  // Category breakdown (all time in loaded data)
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    allExpenses.forEach((e) => {
      const catId = e.category_id || "__none__";
      map.set(catId, (map.get(catId) || 0) + (e.amount || 0));
    });
    return Array.from(map.entries())
      .map(([catId, total]) => {
        const cat = categories.find((c) => c.id === catId);
        return { name: cat?.name || "미분류", total };
      })
      .sort((a, b) => b.total - a.total);
  }, [allExpenses, categories]);

  const categoryTotal = categoryData.reduce((s, d) => s + d.total, 0);

  // Vendor ranking
  const vendorData = useMemo(() => {
    const map = new Map<string, number>();
    allExpenses.forEach((e) => {
      const name = e.vendor_name || vendors.find((v) => v.id === e.vendor_id)?.name;
      if (!name) return;
      map.set(name, (map.get(name) || 0) + (e.amount || 0));
    });
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [allExpenses, vendors]);

  const vendorMax = vendorData.length > 0 ? vendorData[0].total : 1;

  // Summary KPIs
  const thisMonthTotal = allExpenses
    .filter((e) => e.year === cy && e.month === cm)
    .reduce((s, e) => s + (e.amount || 0), 0);

  const lastMonth = cm === 1 ? { y: cy - 1, m: 12 } : { y: cy, m: cm - 1 };
  const lastMonthTotal = allExpenses
    .filter((e) => e.year === lastMonth.y && e.month === lastMonth.m)
    .reduce((s, e) => s + (e.amount || 0), 0);

  const changePercent = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[12px] text-muted-foreground mb-1">이번 달 지출</p>
          <p className="text-xl font-bold">{formatWon(thisMonthTotal)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[12px] text-muted-foreground mb-1">지난 달 지출</p>
          <p className="text-xl font-bold text-muted-foreground">{formatWon(lastMonthTotal)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[12px] text-muted-foreground mb-1">전월 대비</p>
          <p className={`text-xl font-bold ${changePercent > 0 ? "text-red-600" : changePercent < 0 ? "text-emerald-600" : ""}`}>
            {lastMonthTotal === 0 ? "-" : `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%`}
          </p>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-5">
        <h3 className="text-[14px] font-semibold mb-4">월별 지출 추이</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(220,9%,46%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220,9%,46%)" }} tickFormatter={(v) => v >= 10000 ? `${(v / 10000).toFixed(0)}만` : v.toLocaleString()} />
              <Tooltip
                formatter={(value: number) => [formatWon(value), "지출"]}
                contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid hsl(220,13%,91%)" }}
              />
              <Bar dataKey="total" fill="hsl(221,83%,53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-5">
          <h3 className="text-[14px] font-semibold mb-4">카테고리별 비중</h3>
          {categoryData.length === 0 ? (
            <p className="text-[13px] text-muted-foreground py-8 text-center">데이터가 없습니다</p>
          ) : (
            <>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      dataKey="total"
                      nameKey="name"
                      paddingAngle={2}
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatWon(value)} contentStyle={{ fontSize: 12, borderRadius: 12 }} />
                    <Legend
                      formatter={(value) => <span className="text-[11px]">{value}</span>}
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-3">
                {categoryData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{formatWon(d.total)}</span>
                      <span className="text-muted-foreground w-[42px] text-right">
                        {categoryTotal > 0 ? ((d.total / categoryTotal) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Vendor Ranking */}
        <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-5">
          <h3 className="text-[14px] font-semibold mb-4">협력사별 지출 현황</h3>
          {vendorData.length === 0 ? (
            <p className="text-[13px] text-muted-foreground py-8 text-center">데이터가 없습니다</p>
          ) : (
            <div className="space-y-3">
              {vendorData.map((d, i) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-4 text-right">{i + 1}</span>
                      <span className="font-medium">{d.name}</span>
                    </div>
                    <span className="font-medium">{formatWon(d.total)}</span>
                  </div>
                  <div className="h-1.5 bg-[hsl(220,14%,95%)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(d.total / vendorMax) * 100}%`,
                        backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
