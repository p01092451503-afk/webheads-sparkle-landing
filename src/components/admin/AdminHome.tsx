import { useMemo, useState } from "react";
import { dedupeLocation } from "@/lib/utils";
import {
  MessageSquare, Eye, TrendingUp, ArrowUpRight, ChevronRight,
  Clock, Phone, Building2, Smartphone, Globe, MousePointerClick,
  Users, ScrollText, MapPin
} from "lucide-react";

interface AdminHomeProps {
  inquiries: any[];
  pageViews: any[];
  onNavigate: (tab: any) => void;
}

export default function AdminHome({ inquiries, pageViews, onNavigate }: AdminHomeProps) {
  const [dateRange, setDateRange] = useState(7);

  const filteredInquiries = useMemo(() => {
    const since = new Date();
    if (dateRange === 0) since.setHours(0, 0, 0, 0);
    else since.setDate(since.getDate() - dateRange);
    return inquiries.filter((i) => new Date(i.created_at) >= since);
  }, [inquiries, dateRange]);

  const filteredViews = useMemo(() => {
    const since = new Date();
    if (dateRange === 0) since.setHours(0, 0, 0, 0);
    else since.setDate(since.getDate() - dateRange);
    return pageViews.filter((v) => new Date(v.created_at) >= since);
  }, [pageViews, dateRange]);

  const humanViews = useMemo(() => filteredViews.filter((v) => (v.visitor_type || "human") === "human"), [filteredViews]);

  const newInquiries = filteredInquiries.filter((i) => i.status === "new");
  const uniqueSessions = new Set(humanViews.map((v) => v.session_id)).size;
  const conversionRate = uniqueSessions > 0 ? ((filteredInquiries.length / uniqueSessions) * 100).toFixed(1) : "0.0";
  const recentInquiries = filteredInquiries.slice(0, 5);

  const analyticsSummary = useMemo(() => {
    const deviceCounts: Record<string, number> = {};
    const browserCounts: Record<string, number> = {};
    const topPages: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};
    let totalDwell = 0, dwellCount = 0, totalScroll = 0, scrollCount = 0, firstVisit = 0, returning = 0;

    humanViews.forEach((v) => {
      if (v.device_type) deviceCounts[v.device_type] = (deviceCounts[v.device_type] || 0) + 1;
      if (v.browser) browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
      if (v.page_path) topPages[v.page_path] = (topPages[v.page_path] || 0) + 1;
      const loc = dedupeLocation(v.city || v.country);
      if (loc) locationCounts[loc] = (locationCounts[loc] || 0) + 1;
      if (v.duration_seconds && v.duration_seconds > 0) { totalDwell += v.duration_seconds; dwellCount++; }
      if (v.scroll_depth && v.scroll_depth > 0) { totalScroll += v.scroll_depth; scrollCount++; }
      if (v.is_first_visit) firstVisit++; else returning++;
    });

    const topBrowsers = Object.entries(browserCounts).sort(([, a], [, b]) => b - a).slice(0, 3);
    const topPagesList = Object.entries(topPages).sort(([, a], [, b]) => b - a).slice(0, 5);
    const topLocList = Object.entries(locationCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
    const mobileCount = deviceCounts["mobile"] || 0;
    const desktopCount = deviceCounts["desktop"] || 0;
    const tabletCount = deviceCounts["tablet"] || 0;
    const total = mobileCount + desktopCount + tabletCount;
    const mobileRate = total > 0 ? Math.round((mobileCount / total) * 100) : 0;

    return { avgDwell: dwellCount > 0 ? Math.round(totalDwell / dwellCount) : 0, avgScroll: scrollCount > 0 ? Math.round(totalScroll / scrollCount) : 0, mobileRate, mobileCount, desktopCount, firstVisit, returning, topBrowsers, topPagesList, topLocList };
  }, [humanViews]);

  const formatDuration = (s: number) => {
    if (s < 60) return `${s}초`;
    return `${Math.floor(s / 60)}분 ${s % 60}초`;
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 1) return "방금 전";
    if (diff < 60) return `${diff}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    return `${Math.floor(diff / 1440)}일 전`;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Greeting + Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-bold tracking-[-0.04em] text-foreground">안녕하세요 👋</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">오늘의 현황을 확인하세요</p>
        </div>
        <div className="flex gap-0.5 p-1 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
          {[{ value: 0, label: "오늘" }, { value: 7, label: "7일" }, { value: 14, label: "14일" }, { value: 30, label: "30일" }].map((d) => (
            <button key={d.value} onClick={() => setDateRange(d.value)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap"
              style={{
                color: dateRange === d.value ? "white" : "hsl(220, 9%, 46%)",
                background: dateRange === d.value ? "hsl(221, 83%, 53%)" : "transparent",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <TossMetric label="문의" value={filteredInquiries.length} sub={`신규 ${newInquiries.length}건`} icon={<MessageSquare className="w-[18px] h-[18px]" />} color="hsl(221, 83%, 53%)" />
        <TossMetric label="방문" value={humanViews.length} sub={`${uniqueSessions} 세션`} icon={<Eye className="w-[18px] h-[18px]" />} color="hsl(152, 57%, 42%)" />
        <TossMetric label="전환율" value={`${conversionRate}%`} sub="방문 → 문의" icon={<TrendingUp className="w-[18px] h-[18px]" />} color="hsl(37, 90%, 51%)" />
        <TossMetric label="총 문의" value={inquiries.length} sub="전체 누적" icon={<Building2 className="w-[18px] h-[18px]" />} color="hsl(262, 60%, 55%)" />
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <TossMetric label="평균 체류" value={formatDuration(analyticsSummary.avgDwell)} sub="페이지당 평균" icon={<Clock className="w-[18px] h-[18px]" />} color="hsl(199, 89%, 48%)" />
        <TossMetric label="평균 스크롤" value={`${analyticsSummary.avgScroll}%`} sub="콘텐츠 소비율" icon={<ScrollText className="w-[18px] h-[18px]" />} color="hsl(340, 65%, 55%)" />
        <TossMetric label="모바일 비율" value={`${analyticsSummary.mobileRate}%`} sub={`모바일 ${analyticsSummary.mobileCount} · 데스크톱 ${analyticsSummary.desktopCount}`} icon={<Smartphone className="w-[18px] h-[18px]" />} color="hsl(262, 60%, 55%)" />
        <TossMetric label="신규 방문자" value={analyticsSummary.firstVisit} sub={`재방문 ${analyticsSummary.returning}`} icon={<Users className="w-[18px] h-[18px]" />} color="hsl(37, 90%, 51%)" />
      </div>

      {/* Mini Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <TossMiniList title="인기 페이지" icon={<Eye className="w-4 h-4" />}
          items={analyticsSummary.topPagesList.map(([path, count]) => ({ label: path, value: count }))} />
        <TossMiniList title="브라우저" icon={<Globe className="w-4 h-4" />}
          items={analyticsSummary.topBrowsers.map(([name, count]) => ({ label: name, value: count }))} />
        <TossMiniList title="접속 지역" icon={<MapPin className="w-4 h-4" />}
          items={analyticsSummary.topLocList.map(([loc, count]) => ({ label: loc, value: count }))} />
      </div>

      {/* Recent Inquiries + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-foreground tracking-[-0.02em]">최근 문의</h3>
            <button onClick={() => onNavigate("inquiries")} className="flex items-center gap-1 text-[12px] font-medium text-[hsl(221,83%,53%)] hover:underline">
              전체 보기 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {recentInquiries.length === 0 ? (
            <div className="text-center py-12 text-[13px] text-muted-foreground/40">접수된 문의가 없습니다</div>
          ) : (
            <div className="flex flex-col">
              {recentInquiries.map((inq, idx) => (
                <div key={inq.id} onClick={() => onNavigate("inquiries")}
                  className="flex items-center gap-3 px-3 py-3.5 -mx-1 rounded-xl cursor-pointer hover:bg-[hsl(220,14%,96%)] transition-colors"
                  style={{ borderBottom: idx < recentInquiries.length - 1 ? "1px solid hsl(220, 13%, 93%)" : "none" }}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{
                    background: inq.status === "new" ? "hsl(221, 83%, 53%)" : inq.status === "in_progress" ? "hsl(37, 90%, 51%)" : inq.status === "completed" ? "hsl(152, 57%, 42%)" : "hsl(220, 9%, 46%)",
                  }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-foreground truncate">{inq.company} · {inq.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> {inq.phone}
                      {inq.service && <span className="text-muted-foreground/50">· {inq.service}</span>}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground/50 shrink-0">{formatTime(inq.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Summary */}
        <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-5">
          <h3 className="text-[15px] font-semibold text-foreground tracking-[-0.02em] mb-5">문의 현황</h3>
          <div className="flex flex-col gap-4">
            {[
              { label: "신규", count: inquiries.filter(i => i.status === "new").length, color: "hsl(221, 83%, 53%)" },
              { label: "진행중", count: inquiries.filter(i => i.status === "in_progress").length, color: "hsl(37, 90%, 51%)" },
              { label: "완료", count: inquiries.filter(i => i.status === "completed").length, color: "hsl(152, 57%, 42%)" },
              { label: "보관", count: inquiries.filter(i => i.status === "archived").length, color: "hsl(220, 9%, 46%)" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-[13px] font-medium text-foreground">{s.label}</span>
                </div>
                <span className="text-[16px] font-bold text-foreground tabular-nums">{s.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[hsl(220,13%,93%)]">
            <button onClick={() => onNavigate("analytics")} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium text-[hsl(221,83%,53%)] hover:bg-[hsl(220,14%,96%)] transition-colors">
              <ArrowUpRight className="w-4 h-4" />
              접속 분석 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TossMetric({ label, value, sub, icon, color }: {
  label: string; value: number | string; sub: string; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] px-4 py-3.5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}12`, color }}>{icon}</div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="text-[20px] font-bold tracking-[-0.04em] text-foreground leading-none tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        </div>
        <p className="text-[11px] text-muted-foreground/50 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function TossMiniList({ title, icon, items }: {
  title: string; icon: React.ReactNode; items: { label: string; value: number }[];
}) {
  const max = items.length > 0 ? items[0].value : 1;
  return (
    <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[13px] font-semibold text-foreground">{title}</h4>
      </div>
      {items.length === 0 ? (
        <p className="text-[12px] text-muted-foreground/40 text-center py-4">데이터 없음</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-foreground truncate max-w-[70%]">{label}</span>
                <span className="text-[12px] font-semibold text-muted-foreground tabular-nums">{value.toLocaleString()}</span>
              </div>
              <div className="h-1 rounded-full bg-[hsl(220,14%,93%)]">
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.max((value / max) * 100, 4)}%`, background: "hsl(221, 83%, 53%)" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
