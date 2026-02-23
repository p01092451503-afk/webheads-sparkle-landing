import { useMemo, useState } from "react";
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
  const [dateRange, setDateRange] = useState(0);

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

  const newInquiries = filteredInquiries.filter((i) => i.status === "new");
  const uniqueSessions = new Set(filteredViews.map((v) => v.session_id)).size;
  const conversionRate = uniqueSessions > 0 ? ((filteredInquiries.length / uniqueSessions) * 100).toFixed(1) : "0.0";
  const recentInquiries = filteredInquiries.slice(0, 5);

  // Analytics summary data
  const analyticsSummary = useMemo(() => {
    const deviceCounts: Record<string, number> = {};
    const browserCounts: Record<string, number> = {};
    const topPages: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};
    let totalDwell = 0, dwellCount = 0, totalScroll = 0, scrollCount = 0, firstVisit = 0, returning = 0;

    filteredViews.forEach((v) => {
      if (v.device_type) deviceCounts[v.device_type] = (deviceCounts[v.device_type] || 0) + 1;
      if (v.browser) browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
      if (v.page_path) topPages[v.page_path] = (topPages[v.page_path] || 0) + 1;
      const loc = v.city || v.country;
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
  }, [filteredViews]);

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
    <div className="flex flex-col gap-4">
      {/* Greeting + Date Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>
            안녕하세요 👋
          </h2>
          <p className="text-[14px] text-muted-foreground mt-1">
            오늘의 현황을 확인하세요
          </p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
          {[{ value: 0, label: "오늘" }, { value: 7, label: "7일" }, { value: 14, label: "14일" }, { value: 30, label: "30일" }].map((d) => (
            <button key={d.value} onClick={() => setDateRange(d.value)}
              className="px-3 py-1.5 rounded-lg text-[12px] transition-all whitespace-nowrap"
              style={{ fontWeight: dateRange === d.value ? 600 : 500, color: dateRange === d.value ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))", background: dateRange === d.value ? "hsl(var(--foreground))" : "transparent" }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="문의" value={filteredInquiries.length} sub={`신규 ${newInquiries.length}건`} color="hsl(214, 90%, 52%)" icon={<MessageSquare className="w-5 h-5" />} />
        <MetricCard label="방문" value={filteredViews.length} sub={`${uniqueSessions} 세션`} color="hsl(150, 60%, 42%)" icon={<Eye className="w-5 h-5" />} />
        <MetricCard label="전환율" value={`${conversionRate}%`} sub="방문 → 문의" color="hsl(35, 90%, 50%)" icon={<TrendingUp className="w-5 h-5" />} />
        <MetricCard label="총 문의" value={inquiries.length} sub="전체 누적" color="hsl(260, 70%, 55%)" icon={<Building2 className="w-5 h-5" />} />
      </div>

      {/* Analytics Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="평균 체류" value={formatDuration(analyticsSummary.avgDwell)} sub="페이지당 평균" color="hsl(192, 80%, 45%)" icon={<Clock className="w-5 h-5" />} />
        <MetricCard label="평균 스크롤" value={`${analyticsSummary.avgScroll}%`} sub="콘텐츠 소비율" color="hsl(340, 65%, 55%)" icon={<ScrollText className="w-5 h-5" />} />
        <MetricCard label="모바일 비율" value={`${analyticsSummary.mobileRate}%`} sub={`모바일 ${analyticsSummary.mobileCount} · 데스크톱 ${analyticsSummary.desktopCount}`} color="hsl(260, 70%, 55%)" icon={<Smartphone className="w-5 h-5" />} />
        <MetricCard label="신규 방문자" value={analyticsSummary.firstVisit} sub={`재방문 ${analyticsSummary.returning}`} color="hsl(35, 90%, 50%)" icon={<Users className="w-5 h-5" />} />
      </div>

      {/* Analytics Mini Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Top Pages */}
        <MiniList
          title="인기 페이지"
          icon={<Eye className="w-4 h-4" />}
          items={analyticsSummary.topPagesList.map(([path, count]) => ({ label: path, value: count }))}
          emptyText="데이터 없음"
        />
        {/* Top Browsers */}
        <MiniList
          title="브라우저"
          icon={<Globe className="w-4 h-4" />}
          items={analyticsSummary.topBrowsers.map(([name, count]) => ({ label: name, value: count }))}
          emptyText="데이터 없음"
        />
        {/* Top Locations */}
        <MiniList
          title="접속 지역"
          icon={<MapPin className="w-4 h-4" />}
          items={analyticsSummary.topLocList.map(([loc, count]) => ({ label: loc, value: count }))}
          emptyText="데이터 없음"
        />
      </div>

      {/* Recent Inquiries + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Recent Inquiries */}
        <div
          className="lg:col-span-2 rounded-xl p-5"
          style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] text-foreground tracking-[-0.02em]" style={{ fontWeight: 600 }}>최근 문의</h3>
            <button onClick={() => onNavigate("inquiries")} className="flex items-center gap-1 text-[12px] text-primary transition-colors hover:underline" style={{ fontWeight: 500 }}>
              전체 보기 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {recentInquiries.length === 0 ? (
            <div className="text-center py-10 text-[13px] text-muted-foreground/50">접수된 문의가 없습니다</div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentInquiries.map((inq) => (
                <div key={inq.id} onClick={() => onNavigate("inquiries")} className="flex items-center gap-4 p-3.5 rounded-xl cursor-pointer transition-all hover:bg-muted/50">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{
                    background: inq.status === "new" ? "hsl(214, 90%, 52%)" : inq.status === "in_progress" ? "hsl(35, 90%, 50%)" : inq.status === "completed" ? "hsl(150, 60%, 42%)" : "hsl(var(--muted-foreground))",
                  }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-foreground truncate" style={{ fontWeight: 500 }}>{inq.company} · {inq.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> {inq.phone}
                      {inq.service && <span>· {inq.service}</span>}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground/60 shrink-0">{formatTime(inq.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Summary */}
        <div className="rounded-xl p-5" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
          <h3 className="text-[15px] text-foreground tracking-[-0.02em] mb-5" style={{ fontWeight: 600 }}>문의 현황</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "신규", count: inquiries.filter(i => i.status === "new").length, color: "hsl(214, 90%, 52%)" },
              { label: "진행중", count: inquiries.filter(i => i.status === "in_progress").length, color: "hsl(35, 90%, 50%)" },
              { label: "완료", count: inquiries.filter(i => i.status === "completed").length, color: "hsl(150, 60%, 42%)" },
              { label: "보관", count: inquiries.filter(i => i.status === "archived").length, color: "hsl(var(--muted-foreground))" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[13px] text-foreground" style={{ fontWeight: 500 }}>{s.label}</span>
                </div>
                <span className="text-[15px] text-foreground" style={{ fontWeight: 700 }}>{s.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid hsl(var(--border) / 0.6)" }}>
            <button onClick={() => onNavigate("analytics")} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] transition-all hover:bg-muted" style={{ fontWeight: 500, color: "hsl(var(--primary))" }}>
              <ArrowUpRight className="w-4 h-4" />
              접속 분석 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, color, icon }: {
  label: string; value: number | string; sub: string; color: string; icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15`, color }}>{icon}</div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="text-[22px] tracking-[-0.04em] text-foreground leading-none" style={{ fontWeight: 700 }}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>{label}</span>
        </div>
        <p className="text-[11px] text-muted-foreground/60 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function MiniList({ title, icon, items, emptyText }: {
  title: string; icon: React.ReactNode; items: { label: string; value: number }[]; emptyText: string;
}) {
  const max = items.length > 0 ? items[0].value : 1;
  return (
    <div className="rounded-xl p-4" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[14px] text-foreground tracking-[-0.02em]" style={{ fontWeight: 600 }}>{title}</h4>
      </div>
      {items.length === 0 ? (
        <p className="text-[12px] text-muted-foreground/50 text-center py-4">{emptyText}</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map(({ label, value }, i) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-foreground truncate max-w-[70%]" style={{ fontWeight: 500 }}>{label}</span>
                <span className="text-[12px] text-muted-foreground shrink-0" style={{ fontWeight: 600 }}>{value.toLocaleString()}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "hsl(var(--muted))" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.max((value / max) * 100, 4)}%`, background: "hsl(192, 80%, 55%)" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
