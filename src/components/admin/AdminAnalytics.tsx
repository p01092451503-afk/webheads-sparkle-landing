import { useState, useMemo } from "react";
import {
  Eye, Globe, Smartphone, Monitor, RefreshCw, ArrowUpRight,
  TrendingUp, BarChart3, Calendar, Wifi, Clock, MapPin,
  MousePointerClick, Users, ScrollText, Link2, LogOut,
  Route, Languages, MonitorSmartphone, Grid3X3
} from "lucide-react";

interface AdminAnalyticsProps {
  pageViews: any[];
  inquiries: any[];
  clickEvents: any[];
  onRefresh: (days: number) => void;
}

export default function AdminAnalytics({ pageViews, inquiries, clickEvents, onRefresh }: AdminAnalyticsProps) {
  const [dateRange, setDateRange] = useState(7);

  const filteredViews = useMemo(() => {
    const since = new Date();
    since.setDate(since.getDate() - dateRange);
    return pageViews.filter((v) => new Date(v.created_at) >= since);
  }, [pageViews, dateRange]);

  const filteredClicks = useMemo(() => {
    const since = new Date();
    since.setDate(since.getDate() - dateRange);
    return clickEvents.filter((v) => new Date(v.created_at) >= since);
  }, [clickEvents, dateRange]);

  const totalViews = filteredViews.length;
  const uniqueSessions = new Set(filteredViews.map((v) => v.session_id)).size;

  const deviceCounts = filteredViews.reduce((acc, v) => {
    acc[v.device_type || "unknown"] = (acc[v.device_type || "unknown"] || 0) + 1; return acc;
  }, {} as Record<string, number>);

  const pageCounts = filteredViews.reduce((acc, v) => { acc[v.page_path] = (acc[v.page_path] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topPages = Object.entries(pageCounts).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 8);

  const browserCounts = filteredViews.reduce((acc, v) => { acc[v.browser || "Unknown"] = (acc[v.browser || "Unknown"] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topBrowsers = Object.entries(browserCounts).sort(([, a], [, b]) => (b as number) - (a as number));

  const osCounts = filteredViews.reduce((acc, v) => { acc[v.os || "Unknown"] = (acc[v.os || "Unknown"] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topOS = Object.entries(osCounts).sort(([, a], [, b]) => (b as number) - (a as number));

  const referrerCounts = filteredViews.reduce((acc, v) => {
    try { const ref = v.referrer ? new URL(v.referrer).hostname : "직접 방문"; acc[ref] = (acc[ref] || 0) + 1; } catch { acc["기타"] = (acc["기타"] || 0) + 1; }
    return acc;
  }, {} as Record<string, number>);
  const topReferrers = Object.entries(referrerCounts).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 8);

  // IP with location
  const ipWithLocation = useMemo(() => {
    const ipMap: Record<string, { count: number; city: string | null; country: string | null }> = {};
    filteredViews.forEach((v) => {
      const ip = v.ip_address || "알 수 없음";
      if (!ipMap[ip]) ipMap[ip] = { count: 0, city: null, country: null };
      ipMap[ip].count++;
      if (v.city) ipMap[ip].city = v.city;
      if (v.country) ipMap[ip].country = v.country;
    });
    return Object.entries(ipMap)
      .map(([ip, d]) => ({ ip, count: d.count, location: d.city || d.country || null }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredViews]);

  // Location stats
  const topLocations = useMemo(() => {
    const locationCounts = filteredViews.reduce((acc, v) => {
      const loc = v.city || v.country || "알 수 없음";
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(locationCounts).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 10);
  }, [filteredViews]);

  // Dwell time
  const pageDwellTimes = useMemo(() => {
    const acc: Record<string, { total: number; count: number }> = {};
    filteredViews.forEach((v) => {
      if (v.duration_seconds && v.duration_seconds > 0) {
        if (!acc[v.page_path]) acc[v.page_path] = { total: 0, count: 0 };
        acc[v.page_path].total += v.duration_seconds;
        acc[v.page_path].count++;
      }
    });
    return Object.entries(acc)
      .map(([path, d]) => ({ path, avg: Math.round(d.total / d.count), count: d.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10);
  }, [filteredViews]);

  const overallAvgDwell = useMemo(() => {
    const withDuration = filteredViews.filter((v) => v.duration_seconds && v.duration_seconds > 0);
    if (withDuration.length === 0) return 0;
    return Math.round(withDuration.reduce((s, v) => s + v.duration_seconds, 0) / withDuration.length);
  }, [filteredViews]);

  // Daily traffic
  const dailyData = useMemo(() => {
    const days: Record<string, { views: number; sessions: Set<string> }> = {};
    const since = new Date();
    since.setDate(since.getDate() - dateRange);
    for (let i = 0; i < dateRange; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i + 1);
      const key = d.toISOString().slice(0, 10);
      days[key] = { views: 0, sessions: new Set() };
    }
    filteredViews.forEach((v) => {
      const key = v.created_at.slice(0, 10);
      if (days[key]) { days[key].views++; if (v.session_id) days[key].sessions.add(v.session_id); }
    });
    return Object.entries(days).map(([date, d]) => ({
      date,
      label: new Date(date).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
      views: d.views,
      sessions: d.sessions.size,
    }));
  }, [filteredViews, dateRange]);

  const maxDailyViews = Math.max(...dailyData.map((d) => d.views), 1);

  // Conversion rate
  const filteredInquiries = useMemo(() => {
    const since = new Date();
    since.setDate(since.getDate() - dateRange);
    return inquiries.filter((i) => new Date(i.created_at) >= since);
  }, [inquiries, dateRange]);

  const conversionRate = uniqueSessions > 0 ? ((filteredInquiries.length / uniqueSessions) * 100).toFixed(1) : "0.0";

  // ========== NEW: UTM Stats ==========
  const utmSourceCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredViews.forEach((v) => {
      if (v.utm_source) acc[v.utm_source] = (acc[v.utm_source] || 0) + 1;
    });
    return Object.entries(acc).sort(([, a], [, b]) => b - a).slice(0, 10);
  }, [filteredViews]);

  const utmCampaignCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredViews.forEach((v) => {
      if (v.utm_campaign) acc[v.utm_campaign] = (acc[v.utm_campaign] || 0) + 1;
    });
    return Object.entries(acc).sort(([, a], [, b]) => b - a).slice(0, 10);
  }, [filteredViews]);

  const utmMediumCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredViews.forEach((v) => {
      if (v.utm_medium) acc[v.utm_medium] = (acc[v.utm_medium] || 0) + 1;
    });
    return Object.entries(acc).sort(([, a], [, b]) => b - a).slice(0, 10);
  }, [filteredViews]);

  // ========== NEW: CTA Click Stats ==========
  const ctaClickCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredClicks.forEach((c) => {
      const label = c.element_text || c.element_id || "Unknown";
      acc[label] = (acc[label] || 0) + 1;
    });
    return Object.entries(acc).sort(([, a], [, b]) => b - a).slice(0, 10);
  }, [filteredClicks]);

  const ctaByPage = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredClicks.forEach((c) => { acc[c.page_path] = (acc[c.page_path] || 0) + 1; });
    return Object.entries(acc).sort(([, a], [, b]) => b - a).slice(0, 10);
  }, [filteredClicks]);

  // ========== NEW: Scroll Depth Stats ==========
  const scrollDepthStats = useMemo(() => {
    const acc: Record<string, { total: number; count: number }> = {};
    filteredViews.forEach((v) => {
      if (typeof v.scroll_depth === "number" && v.scroll_depth > 0) {
        if (!acc[v.page_path]) acc[v.page_path] = { total: 0, count: 0 };
        acc[v.page_path].total += v.scroll_depth;
        acc[v.page_path].count++;
      }
    });
    return Object.entries(acc)
      .map(([path, d]) => ({ path, avg: Math.round(d.total / d.count), count: d.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10);
  }, [filteredViews]);

  // ========== NEW: First Visit vs Return ==========
  const visitStats = useMemo(() => {
    const first = filteredViews.filter((v) => v.is_first_visit === true).length;
    const returning = filteredViews.length - first;
    return { first, returning };
  }, [filteredViews]);

  // ========== Exit Pages (last page per session) ==========
  const exitPages = useMemo(() => {
    const sessionPages: Record<string, { path: string; time: string }> = {};
    filteredViews.forEach((v) => {
      if (!v.session_id) return;
      if (!sessionPages[v.session_id] || v.created_at > sessionPages[v.session_id].time) {
        sessionPages[v.session_id] = { path: v.page_path, time: v.created_at };
      }
    });
    const acc: Record<string, number> = {};
    Object.values(sessionPages).forEach((s) => { acc[s.path] = (acc[s.path] || 0) + 1; });
    return Object.entries(acc).sort(([, a], [, b]) => b - a).slice(0, 10);
  }, [filteredViews]);

  // ========== Conversion Funnel ==========
  const funnelData = useMemo(() => {
    const sessions = new Set(filteredViews.map((v) => v.session_id).filter(Boolean));
    const landingSessions = new Set<string>();
    const serviceSessions = new Set<string>();
    const contactSessions = new Set<string>();

    const servicePages = ["/lms", "/hosting", "/drm", "/content", "/chatbot", "/channel", "/maintenance", "/app-dev", "/pg"];
    
    filteredViews.forEach((v) => {
      if (!v.session_id) return;
      if (v.page_path === "/") landingSessions.add(v.session_id);
      if (servicePages.some((p) => v.page_path.startsWith(p))) serviceSessions.add(v.session_id);
      if (v.page_path === "/about" || v.page_path.includes("contact")) contactSessions.add(v.session_id);
    });

    // Also count sessions that submitted an inquiry
    const inquirySessions = new Set(filteredInquiries.map((i: any) => i.session_id).filter(Boolean));

    return [
      { label: "전체 방문", count: sessions.size },
      { label: "랜딩 페이지", count: landingSessions.size },
      { label: "서비스 페이지", count: serviceSessions.size },
      { label: "문의/소개 페이지", count: contactSessions.size },
      { label: "문의 제출", count: filteredInquiries.length },
    ];
  }, [filteredViews, filteredInquiries]);

  // ========== Hourly Traffic Heatmap ==========
  const hourlyData = useMemo(() => {
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    filteredViews.forEach((v) => {
      const d = new Date(v.created_at);
      grid[d.getDay()][d.getHours()]++;
    });
    return { grid, dayNames };
  }, [filteredViews]);

  const maxHourly = useMemo(() => Math.max(...hourlyData.grid.flat(), 1), [hourlyData]);

  // ========== Page Flow (A → B transitions) ==========
  const pageFlows = useMemo(() => {
    const sessionViews: Record<string, { path: string; time: string }[]> = {};
    filteredViews.forEach((v) => {
      if (!v.session_id) return;
      if (!sessionViews[v.session_id]) sessionViews[v.session_id] = [];
      sessionViews[v.session_id].push({ path: v.page_path, time: v.created_at });
    });

    const flows: Record<string, number> = {};
    Object.values(sessionViews).forEach((views) => {
      views.sort((a, b) => a.time.localeCompare(b.time));
      for (let i = 0; i < views.length - 1; i++) {
        if (views[i].path !== views[i + 1].path) {
          const key = `${views[i].path} → ${views[i + 1].path}`;
          flows[key] = (flows[key] || 0) + 1;
        }
      }
    });
    return Object.entries(flows).sort(([, a], [, b]) => b - a).slice(0, 10);
  }, [filteredViews]);

  // ========== Screen Resolution ==========
  const resolutionCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredViews.forEach((v) => {
      if (v.screen_width && v.screen_height) {
        const res = `${v.screen_width}×${v.screen_height}`;
        acc[res] = (acc[res] || 0) + 1;
      }
    });
    return Object.entries(acc).sort(([, a], [, b]) => b - a).slice(0, 10);
  }, [filteredViews]);

  // ========== Language Distribution ==========
  const languageCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredViews.forEach((v) => {
      const lang = v.language || "Unknown";
      acc[lang] = (acc[lang] || 0) + 1;
    });
    return Object.entries(acc).sort(([, a], [, b]) => b - a).slice(0, 10);
  }, [filteredViews]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>접속 분석</h2>
          <p className="text-[14px] text-muted-foreground mt-1">최근 {dateRange}일간의 방문 데이터</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
            {[7, 14, 30].map((d) => (
              <button key={d} onClick={() => setDateRange(d)}
                className="px-3.5 py-1.5 rounded-lg text-[12px] transition-all whitespace-nowrap"
                style={{ fontWeight: dateRange === d ? 600 : 500, color: dateRange === d ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))", background: dateRange === d ? "hsl(var(--foreground))" : "transparent" }}
              >
                {d}일
              </button>
            ))}
          </div>
          <button onClick={() => onRefresh(30)} title="새로고침"
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:bg-card shrink-0"
            style={{ color: "hsl(var(--muted-foreground))", background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <MetricCard icon={<Eye className="w-5 h-5" />} label="페이지뷰" value={totalViews} color="hsl(214, 90%, 52%)" />
        <MetricCard icon={<Globe className="w-5 h-5" />} label="고유 세션" value={uniqueSessions} color="hsl(150, 60%, 42%)" />
        <MetricCard icon={<Clock className="w-5 h-5" />} label="평균 체류" value={formatDuration(overallAvgDwell)} color="hsl(192, 80%, 45%)" />
        <MetricCard icon={<MousePointerClick className="w-5 h-5" />} label="CTA 클릭" value={filteredClicks.length} color="hsl(340, 65%, 55%)" />
        <MetricCard icon={<Users className="w-5 h-5" />} label="신규 방문" value={visitStats.first} color="hsl(35, 90%, 50%)" sub={`재방문 ${visitStats.returning}`} />
        <MetricCard icon={<Smartphone className="w-5 h-5" />} label="모바일" value={deviceCounts.mobile || 0} color="hsl(260, 70%, 55%)" />
        <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="전환율" value={`${conversionRate}%`} color="hsl(0, 84%, 60%)" sub={`문의 ${filteredInquiries.length}건`} />
        <MetricCard icon={<Link2 className="w-5 h-5" />} label="UTM 유입" value={utmSourceCounts.reduce((s, [, c]) => s + c, 0)} color="hsl(170, 70%, 40%)" />
      </div>

      {/* Daily Traffic Chart */}
      <div className="rounded-2xl p-6" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-[14px] text-foreground tracking-[-0.02em]" style={{ fontWeight: 600 }}>일별 방문 추이</h4>
        </div>
        <div className="flex items-end gap-1.5 h-[160px]">
          {dailyData.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
              <span className="text-[10px] text-muted-foreground" style={{ fontWeight: 600 }}>{d.views}</span>
              <div className="w-full flex flex-col gap-0.5" style={{ height: `${Math.max((d.views / maxDailyViews) * 120, 4)}px` }}>
                <div className="w-full flex-1 rounded-t-md transition-all duration-300" style={{ background: "hsl(214, 90%, 52%)", minHeight: "2px" }} />
              </div>
              <span className="text-[9px] text-muted-foreground/60 truncate w-full text-center">{d.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: "1px solid hsl(var(--border) / 0.5)" }}>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(214, 90%, 52%)" }} />
            <span className="text-[11px] text-muted-foreground">페이지뷰</span>
          </div>
        </div>
      </div>

      {/* UTM & CTA Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="UTM 소스별 유입" icon={<Link2 className="w-4 h-4" />}>
          {utmSourceCounts.length === 0 ? <Empty msg="UTM 데이터 수집 중..." /> : utmSourceCounts.map(([name, count], i) => (
            <BarRow key={name} rank={i + 1} label={name} value={count} max={utmSourceCounts[0][1]} color="hsl(170, 70%, 40%)" />
          ))}
        </ChartCard>
        <ChartCard title="UTM 캠페인" icon={<BarChart3 className="w-4 h-4" />}>
          {utmCampaignCounts.length === 0 ? <Empty msg="캠페인 데이터 수집 중..." /> : utmCampaignCounts.map(([name, count], i) => (
            <BarRow key={name} rank={i + 1} label={name} value={count} max={utmCampaignCounts[0][1]} color="hsl(200, 70%, 50%)" />
          ))}
        </ChartCard>
        <ChartCard title="CTA 클릭 이벤트" icon={<MousePointerClick className="w-4 h-4" />}>
          {ctaClickCounts.length === 0 ? <Empty msg="CTA 클릭 데이터 수집 중..." /> : ctaClickCounts.map(([name, count], i) => (
            <BarRow key={name} rank={i + 1} label={name} value={count} max={ctaClickCounts[0][1]} color="hsl(340, 65%, 55%)" />
          ))}
        </ChartCard>
        <ChartCard title="CTA 클릭 - 페이지별" icon={<MousePointerClick className="w-4 h-4" />}>
          {ctaByPage.length === 0 ? <Empty msg="CTA 클릭 데이터 수집 중..." /> : ctaByPage.map(([path, count], i) => (
            <BarRow key={path} rank={i + 1} label={path} value={count} max={ctaByPage[0][1]} color="hsl(280, 60%, 55%)" />
          ))}
        </ChartCard>
      </div>

      {/* Scroll & Dwell Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="페이지별 스크롤 깊이" icon={<ScrollText className="w-4 h-4" />}>
          {scrollDepthStats.length === 0 ? <Empty msg="스크롤 데이터 수집 중..." /> : scrollDepthStats.map((d, i) => (
            <BarRow key={d.path} rank={i + 1} label={d.path} value={d.avg} max={100} color="hsl(35, 90%, 50%)" suffix="%" />
          ))}
        </ChartCard>
        <ChartCard title="페이지별 평균 체류시간" icon={<Clock className="w-4 h-4" />}>
          {pageDwellTimes.length === 0 ? <Empty msg="체류시간 데이터 수집 중..." /> : pageDwellTimes.map((d, i) => (
            <DwellRow key={d.path} rank={i + 1} label={d.path} avgSeconds={d.avg} count={d.count} max={pageDwellTimes[0].avg} />
          ))}
        </ChartCard>
      </div>

      {/* Detail Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="인기 페이지" icon={<Eye className="w-4 h-4" />}>
          {topPages.length === 0 ? <Empty /> : topPages.map(([path, count], i) => (
            <BarRow key={path} rank={i + 1} label={path} value={count as number} max={topPages[0][1] as number} color="hsl(214, 90%, 52%)" />
          ))}
        </ChartCard>
        <ChartCard title="방문 지역" icon={<MapPin className="w-4 h-4" />}>
          {topLocations.length === 0 ? <Empty msg="위치 데이터 수집 중..." /> : topLocations.map(([loc, count], i) => (
            <BarRow key={loc} rank={i + 1} label={loc} value={count as number} max={topLocations[0][1] as number} color="hsl(340, 65%, 55%)" />
          ))}
        </ChartCard>
        <ChartCard title="방문자 IP" icon={<Wifi className="w-4 h-4" />}>
          {ipWithLocation.length === 0 ? <Empty /> : ipWithLocation.map((d, i) => (
            <BarRow key={d.ip} rank={i + 1} label={d.location ? `${d.ip}  ·  ${d.location}` : d.ip} value={d.count} max={ipWithLocation[0].count} color="hsl(192, 80%, 45%)" />
          ))}
        </ChartCard>
        <ChartCard title="유입 경로" icon={<ArrowUpRight className="w-4 h-4" />}>
          {topReferrers.length === 0 ? <Empty /> : topReferrers.map(([ref, count], i) => (
            <BarRow key={ref} rank={i + 1} label={ref} value={count as number} max={topReferrers[0][1] as number} color="hsl(150, 60%, 42%)" />
          ))}
        </ChartCard>
        <ChartCard title="브라우저" icon={<Globe className="w-4 h-4" />}>
          {topBrowsers.length === 0 ? <Empty /> : topBrowsers.map(([name, count], i) => (
            <BarRow key={name} rank={i + 1} label={name} value={count as number} max={topBrowsers[0][1] as number} color="hsl(35, 90%, 50%)" />
          ))}
        </ChartCard>
        <ChartCard title="운영체제" icon={<Monitor className="w-4 h-4" />}>
          {topOS.length === 0 ? <Empty /> : topOS.map(([name, count], i) => (
            <BarRow key={name} rank={i + 1} label={name} value={count as number} max={topOS[0][1] as number} color="hsl(260, 70%, 55%)" />
          ))}
        </ChartCard>
      </div>

      {/* Conversion Funnel */}
      <div className="rounded-2xl p-6" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-[14px] text-foreground tracking-[-0.02em]" style={{ fontWeight: 600 }}>전환 퍼널</h4>
        </div>
        <div className="flex flex-col gap-3">
          {funnelData.map((step, i) => {
            const pct = funnelData[0].count > 0 ? (step.count / funnelData[0].count) * 100 : 0;
            const dropOff = i > 0 && funnelData[i - 1].count > 0
              ? ((1 - step.count / funnelData[i - 1].count) * 100).toFixed(1)
              : null;
            return (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px]"
                      style={{ fontWeight: 700, background: "hsl(214 90% 52% / 0.1)", color: "hsl(214, 90%, 52%)" }}>{i + 1}</span>
                    <span className="text-[13px] text-foreground" style={{ fontWeight: 500 }}>{step.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-foreground" style={{ fontWeight: 600 }}>{step.count.toLocaleString()}</span>
                    {dropOff && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md" style={{ color: "hsl(0, 84%, 60%)", background: "hsl(0 84% 60% / 0.08)", fontWeight: 600 }}>
                        -{dropOff}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(214 90% 52% / 0.08)" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "hsl(214, 90%, 52%)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Traffic Heatmap */}
      <div className="rounded-2xl p-6" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-2 mb-6">
          <Grid3X3 className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-[14px] text-foreground tracking-[-0.02em]" style={{ fontWeight: 600 }}>시간대별 트래픽 히트맵</h4>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex mb-1 ml-8">
              {Array.from({ length: 24 }, (_, h) => (
                <span key={h} className="flex-1 text-center text-[9px] text-muted-foreground/50" style={{ fontWeight: 500 }}>{h}</span>
              ))}
            </div>
            {/* Grid rows */}
            {hourlyData.dayNames.map((day, dayIdx) => (
              <div key={day} className="flex items-center gap-1 mb-1">
                <span className="w-7 text-[11px] text-muted-foreground text-right shrink-0" style={{ fontWeight: 500 }}>{day}</span>
                <div className="flex flex-1 gap-0.5">
                  {hourlyData.grid[dayIdx].map((count, hour) => {
                    const intensity = maxHourly > 0 ? count / maxHourly : 0;
                    return (
                      <div
                        key={hour}
                        className="flex-1 rounded-sm transition-all"
                        style={{
                          height: "20px",
                          background: count === 0
                            ? "hsl(var(--muted))"
                            : `hsl(214 90% 52% / ${0.15 + intensity * 0.85})`,
                        }}
                        title={`${day} ${hour}시: ${count}건`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-3">
              <span className="text-[10px] text-muted-foreground/50">적음</span>
              <div className="flex gap-0.5">
                {[0.15, 0.35, 0.55, 0.75, 1].map((op, i) => (
                  <div key={i} className="w-4 h-3 rounded-sm" style={{ background: `hsl(214 90% 52% / ${op})` }} />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground/50">많음</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Pages, Page Flows, Resolution, Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="이탈 페이지" icon={<LogOut className="w-4 h-4" />}>
          {exitPages.length === 0 ? <Empty msg="이탈 데이터 수집 중..." /> : exitPages.map(([path, count], i) => (
            <BarRow key={path} rank={i + 1} label={path} value={count} max={exitPages[0][1]} color="hsl(0, 84%, 60%)" />
          ))}
        </ChartCard>
        <ChartCard title="페이지 이동 경로" icon={<Route className="w-4 h-4" />}>
          {pageFlows.length === 0 ? <Empty msg="이동 경로 데이터 수집 중..." /> : pageFlows.map(([flow, count], i) => (
            <BarRow key={flow} rank={i + 1} label={flow} value={count} max={pageFlows[0][1]} color="hsl(260, 70%, 55%)" />
          ))}
        </ChartCard>
        <ChartCard title="화면 해상도 분포" icon={<MonitorSmartphone className="w-4 h-4" />}>
          {resolutionCounts.length === 0 ? <Empty /> : resolutionCounts.map(([res, count], i) => (
            <BarRow key={res} rank={i + 1} label={res} value={count} max={resolutionCounts[0][1]} color="hsl(192, 80%, 45%)" />
          ))}
        </ChartCard>
        <ChartCard title="브라우저 언어" icon={<Languages className="w-4 h-4" />}>
          {languageCounts.length === 0 ? <Empty /> : languageCounts.map(([lang, count], i) => (
            <BarRow key={lang} rank={i + 1} label={lang} value={count} max={languageCounts[0][1]} color="hsl(170, 70%, 40%)" />
          ))}
        </ChartCard>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color, sub }: {
  icon: React.ReactNode; label: string; value: number | string; color: string; sub?: string;
}) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}10`, color }}>{icon}</div>
      <div>
        <p className="text-[24px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-[12px] text-muted-foreground mt-0.5" style={{ fontWeight: 500 }}>{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground/60">{sub}</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[14px] text-foreground tracking-[-0.02em]" style={{ fontWeight: 600 }}>{title}</h4>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function BarRow({ rank, label, value, max, color, suffix }: { rank: number; label: string; value: number; max: number; color: string; suffix?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] w-5 text-center text-muted-foreground/50" style={{ fontWeight: 600 }}>{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] text-foreground truncate" style={{ fontWeight: 500 }}>{label}</span>
          <span className="text-[12px] text-foreground shrink-0 ml-2" style={{ fontWeight: 600 }}>{value}{suffix || ""}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${color}10` }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

function Empty({ msg }: { msg?: string } = {}) {
  return <p className="text-[13px] text-muted-foreground/50 text-center py-6" style={{ fontWeight: 500 }}>{msg || "데이터가 없습니다"}</p>;
}

function formatDuration(seconds: number): string {
  if (seconds < 1) return "0초";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}분 ${s}초`;
  return `${s}초`;
}

function DwellRow({ rank, label, avgSeconds, count, max }: { rank: number; label: string; avgSeconds: number; count: number; max: number }) {
  const pct = max > 0 ? (avgSeconds / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] w-5 text-center text-muted-foreground/50" style={{ fontWeight: 600 }}>{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] text-foreground truncate" style={{ fontWeight: 500 }}>{label}</span>
          <span className="text-[12px] text-foreground shrink-0 ml-2" style={{ fontWeight: 600 }}>{formatDuration(avgSeconds)}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(192, 80%, 45%, 0.1)" }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "hsl(192, 80%, 45%)" }} />
        </div>
        <span className="text-[10px] text-muted-foreground/50 mt-0.5" style={{ fontWeight: 500 }}>{count}회 방문</span>
      </div>
    </div>
  );
}
