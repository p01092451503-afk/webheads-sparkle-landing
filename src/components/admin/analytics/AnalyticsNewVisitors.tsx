import { useState } from "react";
import { dedupeLocation } from "@/lib/utils";
import { Eye, Globe, Wifi, MapPin, ArrowUpRight, Smartphone, User, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

interface NewVisitorData {
  totalNew: number;
  uniqueNewSessions: number;
  uniqueNewIPs: number;
  dailyNewArr: { date: string; label: string; count: number }[];
  availableDates: string[];
  topLandingPages: [string, number][];
  topDevices: [string, number][];
  topLocations: [string, number][];
  topReferrers: [string, number][];
  topBrowsers: [string, number][];
}

interface Props {
  pageViews: any[];
  toLocalDateKey: (date: Date) => string;
}

export default function AnalyticsNewVisitors({ pageViews, toLocalDateKey }: Props) {
  const [newVisitorDateFilter, setNewVisitorDateFilter] = useState<string>("all");
  const newVisitorCutoff = new Date("2026-03-04T00:00:00");

  

  const newVisitorData: NewVisitorData = (() => {
    const oldVisitorIds = new Set<string>();
    pageViews.forEach((v: any) => {
      if (new Date(v.created_at) < newVisitorCutoff) {
        if (v.ip_address) oldVisitorIds.add(`ip:${v.ip_address}`);
        if (v.session_id) oldVisitorIds.add(`sid:${v.session_id}`);
      }
    });

    const newVisitors = pageViews.filter((v: any) => {
      if (new Date(v.created_at) < newVisitorCutoff) return false;
      if (v.visitor_type && v.visitor_type !== "human") return false;
      const ipKey = v.ip_address ? `ip:${v.ip_address}` : null;
      const sidKey = v.session_id ? `sid:${v.session_id}` : null;
      if (ipKey && oldVisitorIds.has(ipKey)) return false;
      if (sidKey && oldVisitorIds.has(sidKey)) return false;
      return true;
    });

    const filteredNewVisitors = newVisitorDateFilter === "all"
      ? newVisitors
      : newVisitors.filter((v: any) => toLocalDateKey(new Date(v.created_at)) === newVisitorDateFilter);

    const totalNew = filteredNewVisitors.length;
    const uniqueNewSessions = new Set(filteredNewVisitors.map((v: any) => v.session_id)).size;
    const uniqueNewIPs = new Set(filteredNewVisitors.filter((v: any) => v.ip_address).map((v: any) => v.ip_address)).size;

    const dailyNew: Record<string, number> = {};
    newVisitors.forEach((v: any) => {
      const key = toLocalDateKey(new Date(v.created_at));
      dailyNew[key] = (dailyNew[key] || 0) + 1;
    });
    const dailyNewArr = Object.entries(dailyNew)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date,
        label: new Date(date).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
        count,
      }));

    const availableDates = Object.keys(dailyNew).sort().reverse();

    const landingPages: Record<string, number> = {};
    filteredNewVisitors.forEach((v: any) => { landingPages[v.page_path] = (landingPages[v.page_path] || 0) + 1; });
    const topLandingPages = Object.entries(landingPages).sort(([, a], [, b]) => b - a) as [string, number][];

    const devices: Record<string, number> = {};
    filteredNewVisitors.forEach((v: any) => { devices[v.device_type || "unknown"] = (devices[v.device_type || "unknown"] || 0) + 1; });
    const topDevices = Object.entries(devices).sort(([, a], [, b]) => b - a) as [string, number][];

    const locations: Record<string, number> = {};
    filteredNewVisitors.forEach((v: any) => {
      const loc = dedupeLocation(v.city || v.country) || "알 수 없음";
      locations[loc] = (locations[loc] || 0) + 1;
    });
    const topLocations = Object.entries(locations).sort(([, a], [, b]) => b - a) as [string, number][];

    const referrers: Record<string, number> = {};
    filteredNewVisitors.forEach((v: any) => {
      try { const ref = v.referrer ? new URL(v.referrer).hostname : "직접 방문"; referrers[ref] = (referrers[ref] || 0) + 1; } catch { referrers["기타"] = (referrers["기타"] || 0) + 1; }
    });
    const topReferrers = Object.entries(referrers).sort(([, a], [, b]) => b - a) as [string, number][];

    const browsers: Record<string, number> = {};
    filteredNewVisitors.forEach((v: any) => { browsers[v.browser || "Unknown"] = (browsers[v.browser || "Unknown"] || 0) + 1; });
    const topBrowsers = Object.entries(browsers).sort(([, a], [, b]) => b - a) as [string, number][];

    return { totalNew, uniqueNewSessions, uniqueNewIPs, dailyNewArr, availableDates, topLandingPages, topDevices, topLocations, topReferrers, topBrowsers };
  })();

  return (
    <SectionGroup title="신규 방문자 분석 (3/4~)" number={10}>
      <div className="flex flex-wrap items-center gap-1.5 px-1 mb-1">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[hsl(152,57%,42%,0.1)] text-[hsl(152,57%,42%)]">
          <User className="w-3 h-3" /> 사람 접속만 표시
        </span>
        <div className="flex items-center gap-1 ml-auto overflow-x-auto">
          <button
            onClick={() => setNewVisitorDateFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
              newVisitorDateFilter === "all"
                ? "bg-[hsl(37,90%,51%)] text-white shadow-sm"
                : "bg-[hsl(40,25%,93%)] text-muted-foreground hover:bg-[hsl(40,25%,88%)]"
            }`}
          >
            전체
          </button>
          {newVisitorData.availableDates.map((date) => (
            <button
              key={date}
              onClick={() => setNewVisitorDateFilter(date === newVisitorDateFilter ? "all" : date)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                newVisitorDateFilter === date
                  ? "bg-[hsl(37,90%,51%)] text-white shadow-sm"
                  : "bg-[hsl(40,25%,93%)] text-muted-foreground hover:bg-[hsl(40,25%,88%)]"
              }`}
            >
              {new Date(date).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard icon={<Users className="w-[18px] h-[18px]" />} label="신규 방문 수" value={newVisitorData.totalNew} color="hsl(37, 90%, 51%)" tooltip={newVisitorDateFilter === "all" ? "3월 4일 이후 최초 접속한 사람 방문자의 페이지뷰 수입니다." : `${newVisitorDateFilter} 신규 방문 수`} className="bg-[hsl(40,35%,90%)]" />
        <MetricCard icon={<Globe className="w-[18px] h-[18px]" />} label="신규 세션" value={newVisitorData.uniqueNewSessions} color="hsl(152, 57%, 42%)" tooltip={newVisitorDateFilter === "all" ? "3월 4일 이후 최초 접속한 고유 세션 수입니다." : `${newVisitorDateFilter} 신규 세션 수`} className="bg-[hsl(150,25%,90%)]" />
        <MetricCard icon={<Wifi className="w-[18px] h-[18px]" />} label="고유 IP" value={newVisitorData.uniqueNewIPs} color="hsl(199, 89%, 48%)" tooltip={newVisitorDateFilter === "all" ? "3월 4일 이후 신규 방문자의 중복 제거된 고유 IP 수입니다." : `${newVisitorDateFilter} 고유 IP 수`} className="bg-[hsl(200,30%,90%)]" />
      </div>
      {newVisitorData.dailyNewArr.length > 0 && (
        <div className="bg-[hsl(40,25%,90%)] rounded-2xl border border-[hsl(220,13%,91%)] p-5 mt-3">
          <p className="text-[12px] font-semibold text-muted-foreground mb-3">일별 신규 방문자 추이</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={newVisitorData.dailyNewArr} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="newVisitorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(37, 90%, 51%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(37, 90%, 51%)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 93%)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(220, 9%, 60%)" }} axisLine={false} tickLine={false}
                interval={newVisitorData.dailyNewArr.length > 14 ? Math.floor(newVisitorData.dailyNewArr.length / 7) : 0} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 9%, 60%)" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <RechartsTooltip
                contentStyle={{ background: "white", border: "1px solid hsl(220, 13%, 91%)", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 16px hsl(0 0% 0% / 0.06)" }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              />
              <Area type="monotone" dataKey="count" name="신규 방문" stroke="hsl(37, 90%, 51%)" strokeWidth={2} fill="url(#newVisitorGrad)"
                dot={{ r: 2.5, fill: "hsl(37, 90%, 51%)", strokeWidth: 0 }} activeDot={{ r: 4, fill: "hsl(37, 90%, 51%)", strokeWidth: 2, stroke: "white" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <ChartCard title="신규 방문자 랜딩 페이지" icon={<Eye className="w-4 h-4" />} className="bg-[hsl(40,35%,90%)]">
          {newVisitorData.topLandingPages.length === 0 ? <Empty msg="신규 방문자 데이터 수집 중..." /> : newVisitorData.topLandingPages.map(([p, c], i) => <BarRow key={p} rank={i+1} label={p} value={c} max={newVisitorData.topLandingPages[0][1]} color="hsl(37, 90%, 51%)" />)}
        </ChartCard>
        <ChartCard title="신규 방문자 유입 경로" icon={<ArrowUpRight className="w-4 h-4" />} className="bg-[hsl(150,25%,90%)]">
          {newVisitorData.topReferrers.length === 0 ? <Empty /> : newVisitorData.topReferrers.map(([r, c], i) => <BarRow key={r} rank={i+1} label={r} value={c} max={newVisitorData.topReferrers[0][1]} color="hsl(152, 57%, 42%)" />)}
        </ChartCard>
        <ChartCard title="신규 방문자 지역" icon={<MapPin className="w-4 h-4" />} className="bg-[hsl(340,25%,90%)]">
          {newVisitorData.topLocations.length === 0 ? <Empty msg="위치 데이터 수집 중..." /> : newVisitorData.topLocations.map(([l, c], i) => <BarRow key={l} rank={i+1} label={l} value={c} max={newVisitorData.topLocations[0][1]} color="hsl(340, 65%, 55%)" />)}
        </ChartCard>
        <ChartCard title="신규 방문자 디바이스 · 브라우저" icon={<Smartphone className="w-4 h-4" />} className="bg-[hsl(260,25%,90%)]">
          {newVisitorData.topDevices.length === 0 ? <Empty /> : (
            <>
              {newVisitorData.topDevices.map(([d, c], i) => <BarRow key={d} rank={i+1} label={d} value={c} max={newVisitorData.topDevices[0][1]} color="hsl(262, 60%, 55%)" />)}
              <div className="border-t border-[hsl(220,13%,95%)] my-2" />
              {newVisitorData.topBrowsers.map(([b, c], i) => <BarRow key={b} rank={i+1} label={b} value={c} max={newVisitorData.topBrowsers[0][1]} color="hsl(199, 89%, 48%)" />)}
            </>
          )}
        </ChartCard>
      </div>
    </SectionGroup>
  );
}
