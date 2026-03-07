import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Zap, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type RangeKey = "today" | "7d" | "30d";

interface AILog {
  id: string;
  inquiry_id: string | null;
  function_name: string;
  model_used: string | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
  duration_ms: number | null;
  status: string;
  error_code: string | null;
  error_message: string | null;
  created_at: string;
}

const RANGE_DAYS: Record<RangeKey, number> = { today: 0, "7d": 7, "30d": 30 };
const RANGE_LABELS: Record<RangeKey, string> = { today: "오늘", "7d": "7일", "30d": "30일" };

const FN_LABELS: Record<string, string> = {
  "analyze-inquiry": "기초 분석",
  "analyze-inquiry-pro": "영업 분석",
  "generate-proposal": "제안서 생성",
};

const BAR_COLORS = ["hsl(221, 83%, 53%)", "hsl(152, 57%, 42%)", "hsl(38, 92%, 50%)"];

export default function AIUsageDashboard() {
  const [logs, setLogs] = useState<AILog[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>("30d");

  const fetchLogs = useCallback(async (r: RangeKey) => {
    setLoading(true);
    const since = new Date();
    if (r === "today") {
      since.setHours(0, 0, 0, 0);
    } else {
      since.setDate(since.getDate() - RANGE_DAYS[r]);
    }

    const allData: AILog[] = [];
    let offset = 0;
    let hasMore = true;
    while (hasMore) {
      const { data } = await supabase
        .from("ai_call_logs" as any)
        .select("*")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false })
        .range(offset, offset + 999);
      if (!data || data.length === 0) { hasMore = false; }
      else { allData.push(...(data as any)); offset += 1000; hasMore = data.length === 1000; }
    }

    setLogs(allData);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLogs(range); }, [range, fetchLogs]);

  const stats = useMemo(() => {
    const total = logs.length;
    const success = logs.filter(l => l.status === "success").length;
    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;
    const withDuration = logs.filter(l => l.duration_ms != null);
    const avgDuration = withDuration.length > 0
      ? Math.round(withDuration.reduce((s, l) => s + (l.duration_ms || 0), 0) / withDuration.length)
      : 0;
    const totalTokens = logs.reduce((s, l) => s + (l.total_tokens || 0), 0);
    return { total, successRate, avgDuration, totalTokens };
  }, [logs]);

  const chartData = useMemo(() => {
    const fnCounts: Record<string, number> = {};
    logs.forEach(l => {
      fnCounts[l.function_name] = (fnCounts[l.function_name] || 0) + 1;
    });
    return Object.entries(fnCounts)
      .map(([name, count]) => ({ name: FN_LABELS[name] || name, count }))
      .sort((a, b) => b.count - a.count);
  }, [logs]);

  const failedLogs = useMemo(() =>
    logs.filter(l => l.status === "failed").slice(0, 20),
  [logs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Range Filter */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-foreground">AI 사용 현황</span>
        <div className="flex items-center gap-1 ml-auto bg-[hsl(220,14%,96%)] rounded-lg p-0.5">
          {(Object.keys(RANGE_LABELS) as RangeKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setRange(k)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                range === k
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {RANGE_LABELS[k]}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Zap} label="총 호출" value={stats.total.toLocaleString()} sub="회" />
        <StatCard icon={CheckCircle2} label="성공률" value={`${stats.successRate}%`} sub={`${stats.total}건 중`} color={stats.successRate >= 90 ? "hsl(152, 57%, 42%)" : stats.successRate >= 70 ? "hsl(38, 92%, 50%)" : "hsl(0, 84%, 60%)"} />
        <StatCard icon={Clock} label="평균 응답시간" value={stats.avgDuration >= 1000 ? `${(stats.avgDuration / 1000).toFixed(1)}s` : `${stats.avgDuration}ms`} sub="" />
        <StatCard icon={Zap} label="총 토큰" value={stats.totalTokens.toLocaleString()} sub="tokens" />
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">함수별 호출 횟수</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 93%)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "hsl(220, 9%, 30%)" }} width={90} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220,13%,91%)" }}
                  formatter={(v: number) => [`${v}회`, "호출 횟수"]}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Failed Logs */}
      {failedLogs.length > 0 && (
        <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[hsl(0,84%,60%)]" />
            최근 실패 로그 ({failedLogs.length})
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {failedLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-[hsl(0,84%,60%,0.04)] text-[12px]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-foreground">{FN_LABELS[log.function_name] || log.function_name}</span>
                    {log.error_code && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[hsl(0,84%,60%,0.1)] text-[hsl(0,84%,50%)]">
                        {log.error_code}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground truncate">{log.error_message || "알 수 없는 오류"}</p>
                </div>
                <span className="text-muted-foreground shrink-0 text-[11px]">
                  {new Date(log.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {logs.length === 0 && (
        <div className="text-center py-12 text-[13px] text-muted-foreground">
          선택한 기간에 AI 호출 기록이 없습니다.
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string; sub: string; color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-bold" style={{ color: color || "hsl(220, 9%, 20%)" }}>{value}</span>
        {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}
