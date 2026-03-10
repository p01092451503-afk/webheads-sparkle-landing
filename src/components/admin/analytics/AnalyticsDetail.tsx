import { Eye, MapPin, Wifi, ArrowUpRight, Globe, Monitor, Bot, User } from "lucide-react";
import { SectionGroup, ChartCard, BarRow, Empty } from "./AnalyticsShared";

interface LocationData {
  loc: string;
  human: number;
  bot: number;
  total: number;
}

interface Props {
  topPages: [string, number][];
  topLocations: LocationData[];
  ipWithLocation: { ip: string; count: number; location: string | null; lastVisit: string | null }[];
  topReferrers: [string, number][];
  topBrowsers: [string, number][];
  topOS: [string, number][];
}

function LocationRow({ data, rank, max }: { data: LocationData; rank: number; max: number }) {
  const pct = max > 0 ? (data.total / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-[12px] group">
      <span className="w-5 text-right text-muted-foreground/50 font-mono text-[11px] shrink-0">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="truncate font-medium">{data.loc}</span>
          {data.human > 0 && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-600 shrink-0">
              <User className="w-2.5 h-2.5" />{data.human}
            </span>
          )}
          {data.bot > 0 && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-50 text-amber-600 shrink-0">
              <Bot className="w-2.5 h-2.5" />{data.bot}
            </span>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "hsl(340, 65%, 55%)" }} />
        </div>
      </div>
      <span className="text-muted-foreground font-mono text-[11px] shrink-0 w-8 text-right">{data.total}</span>
    </div>
  );
}

export default function AnalyticsDetail({ topPages, topLocations, ipWithLocation, topReferrers, topBrowsers, topOS }: Props) {
  return (
    <SectionGroup title="방문자 · 페이지 상세" number={4}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="인기 페이지" icon={<Eye className="w-4 h-4" />}>
          {topPages.length === 0 ? <Empty /> : topPages.map(([p, c], i) => <BarRow key={p} rank={i+1} label={p} value={c} max={topPages[0][1]} color="hsl(221, 83%, 53%)" />)}
        </ChartCard>
        <ChartCard title="방문 지역" icon={<MapPin className="w-4 h-4" />}>
          {topLocations.length === 0 ? <Empty msg="위치 데이터 수집 중..." /> : topLocations.map((d, i) => <LocationRow key={d.loc} data={d} rank={i+1} max={topLocations[0].total} />)}
        </ChartCard>
        <ChartCard title="방문자 IP" icon={<Wifi className="w-4 h-4" />}>
          {ipWithLocation.length === 0 ? <Empty /> : ipWithLocation.map((d, i) => {
            const timeStr = d.lastVisit ? (() => { const dt = new Date(d.lastVisit); return `${String(dt.getMonth()+1).padStart(2,"0")}/${String(dt.getDate()).padStart(2,"0")} ${String(dt.getHours()).padStart(2,"0")}:${String(dt.getMinutes()).padStart(2,"0")}`; })() : "";
            const suffix = [d.location, timeStr].filter(Boolean).join("  ·  ");
            return <BarRow key={d.ip} rank={i+1} label={suffix ? `${d.ip}  ·  ${suffix}` : d.ip} value={d.count} max={ipWithLocation[0].count} color="hsl(199, 89%, 48%)" />;
          })}
        </ChartCard>
        <ChartCard title="유입 경로" icon={<ArrowUpRight className="w-4 h-4" />}>
          {topReferrers.length === 0 ? <Empty /> : topReferrers.map(([r, c], i) => <BarRow key={r} rank={i+1} label={r} value={c} max={topReferrers[0][1]} color="hsl(152, 57%, 42%)" />)}
        </ChartCard>
        <ChartCard title="브라우저" icon={<Globe className="w-4 h-4" />}>
          {topBrowsers.length === 0 ? <Empty /> : topBrowsers.map(([n, c], i) => <BarRow key={n} rank={i+1} label={n} value={c} max={topBrowsers[0][1]} color="hsl(37, 90%, 51%)" />)}
        </ChartCard>
        <ChartCard title="운영체제" icon={<Monitor className="w-4 h-4" />}>
          {topOS.length === 0 ? <Empty /> : topOS.map(([n, c], i) => <BarRow key={n} rank={i+1} label={n} value={c} max={topOS[0][1]} color="hsl(262, 60%, 55%)" />)}
        </ChartCard>
      </div>
    </SectionGroup>
  );
}
