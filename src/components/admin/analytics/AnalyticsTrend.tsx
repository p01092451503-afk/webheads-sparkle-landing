import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { SectionGroup } from "./AnalyticsShared";

interface Props {
  isToday: boolean;
  dailyData: { date: string | number; label: string; views: number; sessions: number }[];
}

export default function AnalyticsTrend({ isToday, dailyData }: Props) {
  return (
    <SectionGroup title={isToday ? "시간대별 방문 추이" : "일별 방문 추이"} number={3}>
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-5">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dailyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tossGradViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="tossGradSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(152, 57%, 42%)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(152, 57%, 42%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 93%)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(220, 9%, 60%)" }} axisLine={false} tickLine={false}
              interval={isToday ? 2 : (dailyData.length > 14 ? Math.floor(dailyData.length / 7) : 0)} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(220, 9%, 60%)" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <RechartsTooltip
              contentStyle={{ background: "white", border: "1px solid hsl(220, 13%, 91%)", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 16px hsl(0 0% 0% / 0.06)" }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Area type="monotone" dataKey="views" name="페이지뷰" stroke="hsl(221, 83%, 53%)" strokeWidth={2} fill="url(#tossGradViews)"
              dot={{ r: 2.5, fill: "hsl(221, 83%, 53%)", strokeWidth: 0 }} activeDot={{ r: 4, fill: "hsl(221, 83%, 53%)", strokeWidth: 2, stroke: "white" }} />
            <Area type="monotone" dataKey="sessions" name="세션" stroke="hsl(152, 57%, 42%)" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#tossGradSessions)"
              dot={{ r: 2, fill: "hsl(152, 57%, 42%)", strokeWidth: 0 }} activeDot={{ r: 3.5, fill: "hsl(152, 57%, 42%)", strokeWidth: 2, stroke: "white" }} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[hsl(220,13%,95%)]">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(221,83%,53%)]" /><span className="text-[11px] text-muted-foreground">페이지뷰</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(152,57%,42%)]" /><span className="text-[11px] text-muted-foreground">세션</span></div>
        </div>
      </div>
    </SectionGroup>
  );
}
