import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, TrendingUp, DollarSign, Target, CheckCircle2,
  ArrowUpDown, Filter
} from "lucide-react";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

type Priority = "HIGH" | "MEDIUM" | "LOW";
type FrozenFilter = "all" | "frozen" | "unfrozen";

interface AnalysisRow {
  id: string;
  inquiry_id: string;
  analysis_status: string;
  is_frozen: boolean;
  strategic_score: any;
  recommended_plan: string | null;
  cost_scenarios: any;
  created_at: string;
  // joined
  company?: string;
  name?: string;
  inquiry_created_at?: string;
}

function getPriority(score: number): Priority {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

const PRIORITY_STYLES: Record<Priority, { bg: string; text: string; label: string }> = {
  HIGH: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", label: "HIGH" },
  MEDIUM: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", label: "MEDIUM" },
  LOW: { bg: "bg-muted", text: "text-muted-foreground", label: "LOW" },
};

const PIE_COLORS = ["hsl(221,83%,53%)", "hsl(142,71%,45%)", "hsl(262,83%,58%)", "hsl(25,95%,53%)"];

export default function SalesPriorityDashboard({ onSelectInquiry }: { onSelectInquiry?: (inquiryId: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<AnalysisRow[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | Priority>("ALL");
  const [planFilter, setPlanFilter] = useState<string>("ALL");
  const [frozenFilter, setFrozenFilter] = useState<FrozenFilter>("all");
  const [sortField, setSortField] = useState<"score" | "date">("score");

  useEffect(() => {
    (async () => {
      const [{ data: analyses }, { data: inquiries }] = await Promise.all([
        supabase.from("inquiry_analyses").select("id, inquiry_id, analysis_status, is_frozen, strategic_score, recommended_plan, cost_scenarios, created_at").limit(500),
        supabase.from("contact_inquiries").select("id, company, name, created_at").limit(500),
      ]);

      const inqMap = new Map((inquiries || []).map((i: any) => [i.id, i]));
      const merged = (analyses || [])
        .filter((a: any) => a.strategic_score)
        .map((a: any) => {
          const inq = inqMap.get(a.inquiry_id);
          return {
            ...a,
            company: inq?.company || "—",
            name: inq?.name || "—",
            inquiry_created_at: inq?.created_at,
          };
        });
      setRows(merged);
      setLoading(false);
    })();
  }, []);

  const getScore = (row: AnalysisRow): number => {
    const s = row.strategic_score;
    if (!s) return 0;
    return typeof s.total === "number" ? s.total : 0;
  };

  const getMonthly = (row: AnalysisRow): number => {
    try {
      const sc = row.cost_scenarios;
      if (!sc) return 0;
      const b = sc.scenario_b || sc.scenarioB;
      if (!b) return 0;
      const m = b.monthly || b.monthlyPrice || 0;
      return typeof m === "number" ? m : parseInt(m) || 0;
    } catch { return 0; }
  };

  const filtered = useMemo(() => {
    let result = rows;
    if (priorityFilter !== "ALL") {
      result = result.filter(r => getPriority(getScore(r)) === priorityFilter);
    }
    if (planFilter !== "ALL") {
      result = result.filter(r => r.recommended_plan === planFilter);
    }
    if (frozenFilter === "frozen") result = result.filter(r => r.is_frozen);
    if (frozenFilter === "unfrozen") result = result.filter(r => !r.is_frozen);

    result.sort((a, b) => {
      if (sortField === "score") return getScore(b) - getScore(a);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return result;
  }, [rows, priorityFilter, planFilter, frozenFilter, sortField]);

  // Summary cards
  const now = new Date();
  const thisMonth = rows.filter(r => {
    const d = new Date(r.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const highCount = thisMonth.filter(r => getPriority(getScore(r)) === "HIGH").length;
  const avgScore = rows.length > 0 ? Math.round(rows.reduce((s, r) => s + getScore(r), 0) / rows.length) : 0;
  const monthlies = rows.map(r => getMonthly(r)).filter(m => m > 0);
  const avgMonthly = monthlies.length > 0 ? Math.round(monthlies.reduce((a, b) => a + b, 0) / monthlies.length) : 0;
  const frozenCount = rows.filter(r => r.is_frozen).length;
  const frozenRate = rows.length > 0 ? Math.round((frozenCount / rows.length) * 100) : 0;

  // Plan distribution
  const planCounts = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach(r => {
      const p = r.recommended_plan || "미정";
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const availablePlans = useMemo(() => {
    const set = new Set(rows.map(r => r.recommended_plan || "미정"));
    return Array.from(set);
  }, [rows]);

  // Trend data (last 30 days)
  const trendData = useMemo(() => {
    const days: Record<string, { count: number; totalScore: number }> = {};
    const d30 = new Date();
    d30.setDate(d30.getDate() - 30);
    rows.filter(r => new Date(r.created_at) >= d30).forEach(r => {
      const day = r.created_at.slice(0, 10);
      if (!days[day]) days[day] = { count: 0, totalScore: 0 };
      days[day].count++;
      days[day].totalScore += getScore(r);
    });
    return Object.entries(days)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({
        date: date.slice(5),
        문의수: v.count,
        평균스코어: v.count > 0 ? Math.round(v.totalScore / v.count) : 0,
      }));
  }, [rows]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "이번 달 HIGH 문의", value: highCount, suffix: "건", icon: Target, color: "text-red-600" },
          { label: "평균 전략 스코어", value: avgScore, suffix: "점", icon: TrendingUp, color: "text-primary" },
          { label: "평균 예상 월 매출", value: avgMonthly > 0 ? `₩${avgMonthly.toLocaleString()}` : "—", suffix: "", icon: DollarSign, color: "text-green-600" },
          { label: "확정 완료율", value: frozenRate, suffix: "%", icon: CheckCircle2, color: "text-amber-600" },
        ].map((card, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-[11px] font-medium text-muted-foreground">{card.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {typeof card.value === "number" ? card.value : card.value}{card.suffix}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value as any)}
          className="text-[12px] px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground"
        >
          <option value="ALL">우선순위 전체</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
        <select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          className="text-[12px] px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground"
        >
          <option value="ALL">플랜 전체</option>
          {availablePlans.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={frozenFilter}
          onChange={e => setFrozenFilter(e.target.value as FrozenFilter)}
          className="text-[12px] px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground"
        >
          <option value="all">확정 전체</option>
          <option value="frozen">확정</option>
          <option value="unfrozen">미확정</option>
        </select>
        <button
          onClick={() => setSortField(f => f === "score" ? "date" : "score")}
          className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
        >
          <ArrowUpDown className="w-3 h-3" />
          {sortField === "score" ? "스코어순" : "날짜순"}
        </button>
        <span className="text-[11px] text-muted-foreground ml-auto">{filtered.length}건</span>
      </div>

      {/* Priority Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">회사명</th>
                <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">추천 플랜</th>
                <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground">스코어</th>
                <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground">우선순위</th>
                <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground hidden sm:table-cell">매출잠재력</th>
                <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground hidden md:table-cell">구매의향</th>
                <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground hidden md:table-cell">긴급도</th>
                <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground">분석일</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-muted-foreground">데이터 없음</td>
                </tr>
              )}
              {filtered.map((row) => {
                const score = getScore(row);
                const p = getPriority(score);
                const ps = PRIORITY_STYLES[p];
                const ss = row.strategic_score || {};
                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectInquiry?.(row.inquiry_id)}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{row.company}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary">
                        {row.recommended_plan || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-foreground">{score}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${ps.bg} ${ps.text}`}>
                        {ps.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell text-muted-foreground">
                      {ss.revenue_potential ?? ss.revenuePotential ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-center hidden md:table-cell text-muted-foreground">
                      {ss.purchase_intent ?? ss.purchaseIntent ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-center hidden md:table-cell text-muted-foreground">
                      {ss.urgency ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-right text-muted-foreground">
                      {row.created_at?.slice(0, 10)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Plan Distribution Pie */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-bold text-foreground mb-4">추천 플랜 분포</h3>
          {planCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={planCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  style={{ fontSize: "11px" }}
                >
                  {planCounts.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid hsl(220,13%,91%)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[12px] text-muted-foreground text-center py-10">데이터 없음</p>
          )}
        </div>

        {/* Trend Line */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[13px] font-bold text-foreground mb-4">최근 30일 추이</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid hsl(220,13%,91%)" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line yAxisId="left" type="monotone" dataKey="문의수" stroke="hsl(221,83%,53%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="평균스코어" stroke="hsl(142,71%,45%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[12px] text-muted-foreground text-center py-10">데이터 없음</p>
          )}
        </div>
      </div>
    </div>
  );
}
