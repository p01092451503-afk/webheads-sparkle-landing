import React, { useState, useMemo, useRef } from "react";
import {
  Eye, Globe, Smartphone, Monitor, RefreshCw, ArrowUpRight,
  TrendingUp, BarChart3, Calendar, Wifi, Clock, MapPin,
  MousePointerClick, Users, ScrollText, Link2, LogOut,
  Route, Languages, MonitorSmartphone, Grid3X3, Bot, User, BrainCircuit, ChevronDown
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
    if (dateRange === 0) {
      since.setHours(0, 0, 0, 0);
    } else {
      since.setDate(since.getDate() - dateRange);
    }
    return pageViews.filter((v) => new Date(v.created_at) >= since);
  }, [pageViews, dateRange]);

  const filteredClicks = useMemo(() => {
    const since = new Date();
    if (dateRange === 0) {
      since.setHours(0, 0, 0, 0);
    } else {
      since.setDate(since.getDate() - dateRange);
    }
    return clickEvents.filter((v) => new Date(v.created_at) >= since);
  }, [clickEvents, dateRange]);

  const totalViews = filteredViews.length;
  const uniqueSessions = new Set(filteredViews.map((v) => v.session_id)).size;

  // Visitor type classification (DB value or frontend fallback)
  const visitorTypeCounts = useMemo(() => {
    const botPatterns = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|msnbot|ia_archiver|archive\.org|sogou|exabot|facebot|facebookexternalhit|twitterbot|linkedinbot|pinterestbot|semrushbot|ahrefsbot|dotbot|petalbot|megaindex|serpstatbot|dataforseo|screaming frog|sitebulb|mj12bot|blexbot|rogerbot|seznambot|applebot/i;
    const aiPatterns = /gptbot|chatgpt|openai|claude|anthropic|bytespider|ccbot|cohere|perplexity|youbot|google-extended|meta-externalagent|amazonbot|claudebot|ai2bot/i;
    let human = 0, bot = 0, ai = 0;
    filteredViews.forEach((v) => {
      const type = v.visitor_type || (() => {
        const ua = (v.user_agent || "").toLowerCase();
        if (aiPatterns.test(ua)) return "ai";
        if (botPatterns.test(ua)) return "bot";
        return "human";
      })();
      if (type === "ai") ai++;
      else if (type === "bot") bot++;
      else human++;
    });
    return { human, bot, ai, total: human + bot + ai };
  }, [filteredViews]);

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
    const ipMap: Record<string, { count: number; city: string | null; country: string | null; lastVisit: string | null }> = {};
    filteredViews.forEach((v) => {
      const ip = v.ip_address || "알 수 없음";
      if (!ipMap[ip]) ipMap[ip] = { count: 0, city: null, country: null, lastVisit: null };
      ipMap[ip].count++;
      if (v.city) ipMap[ip].city = v.city;
      if (v.country) ipMap[ip].country = v.country;
      if (!ipMap[ip].lastVisit || v.created_at > ipMap[ip].lastVisit!) ipMap[ip].lastVisit = v.created_at;
    });
    return Object.entries(ipMap)
      .map(([ip, d]) => ({ ip, count: d.count, location: d.city || d.country || null, lastVisit: d.lastVisit }))
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
            {[{ value: 0, label: "오늘" }, { value: 7, label: "7일" }, { value: 14, label: "14일" }, { value: 30, label: "30일" }].map((d) => (
              <button key={d.value} onClick={() => setDateRange(d.value)}
                className="px-3.5 py-1.5 rounded-lg text-[12px] transition-all whitespace-nowrap"
                style={{ fontWeight: dateRange === d.value ? 600 : 500, color: dateRange === d.value ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))", background: dateRange === d.value ? "hsl(var(--foreground))" : "transparent" }}
              >
                {d.label}
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

      <SectionGroup title="주요 지표 요약" number={1}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <MetricCard icon={<Eye className="w-5 h-5" />} label="페이지뷰" value={totalViews} color="hsl(214, 90%, 52%)" tooltip="선택한 기간 동안 사이트의 모든 페이지가 조회된 총 횟수입니다. 한 사용자가 여러 페이지를 보면 각각 1회로 집계됩니다." />
          <MetricCard icon={<Globe className="w-5 h-5" />} label="고유 세션" value={uniqueSessions} color="hsl(150, 60%, 42%)" tooltip="브라우저 탭을 열고 사이트를 방문한 고유 세션 수입니다. 같은 사용자도 새 탭이나 다른 시간에 방문하면 별도 세션으로 집계됩니다." />
          <MetricCard icon={<Clock className="w-5 h-5" />} label="평균 체류" value={formatDuration(overallAvgDwell)} color="hsl(192, 80%, 45%)" tooltip="방문자가 한 페이지에 머문 평균 시간입니다. 체류시간이 길수록 콘텐츠에 관심이 높다는 의미입니다. 최대 30분까지만 집계합니다." />
          <MetricCard icon={<MousePointerClick className="w-5 h-5" />} label="CTA 클릭" value={filteredClicks.length} color="hsl(340, 65%, 55%)" tooltip="'상담 신청', '데모 요청', '문의하기' 등 전환 유도 버튼(CTA)이 클릭된 총 횟수입니다. 마케팅 효과를 측정하는 핵심 지표입니다." />
          <MetricCard icon={<Users className="w-5 h-5" />} label="신규 방문" value={visitStats.first} color="hsl(35, 90%, 50%)" sub={`재방문 ${visitStats.returning}`} tooltip="처음 사이트를 방문한 사용자 수입니다. 재방문 수와 비교하여 신규 유입과 리텐션(재방문율)을 파악할 수 있습니다." />
          <MetricCard icon={<Smartphone className="w-5 h-5" />} label="모바일" value={deviceCounts.mobile || 0} color="hsl(260, 70%, 55%)" tooltip="모바일 기기(스마트폰)로 접속한 방문 횟수입니다. 모바일 비율이 높으면 모바일 최적화가 특히 중요합니다." />
          <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="전환율" value={`${conversionRate}%`} color="hsl(0, 84%, 60%)" sub={`문의 ${filteredInquiries.length}건`} tooltip="전체 세션 중 실제 문의를 제출한 비율입니다. (문의 수 ÷ 고유 세션 × 100) 마케팅 ROI를 판단하는 가장 중요한 지표입니다." />
          <MetricCard icon={<Link2 className="w-5 h-5" />} label="UTM 유입" value={utmSourceCounts.reduce((s, [, c]) => s + c, 0)} color="hsl(170, 70%, 40%)" tooltip="UTM 파라미터가 포함된 URL로 유입된 방문 수입니다. 광고, SNS, 이메일 등 마케팅 캠페인의 성과를 추적합니다." />
        </div>
      </SectionGroup>

      <SectionGroup title="방문자 유형 분석" number={2}>
        <div className="grid grid-cols-3 gap-4">
          <MetricCard icon={<User className="w-5 h-5" />} label="사람" value={visitorTypeCounts.human} color="hsl(214, 90%, 52%)" sub={visitorTypeCounts.total > 0 ? `${Math.round((visitorTypeCounts.human / visitorTypeCounts.total) * 100)}%` : "0%"} tooltip="실제 사용자(사람)의 방문 횟수입니다. 검색엔진 봇이나 AI 크롤러를 제외한 순수 방문자입니다." />
          <MetricCard icon={<Bot className="w-5 h-5" />} label="검색엔진 봇" value={visitorTypeCounts.bot} color="hsl(35, 90%, 50%)" sub={visitorTypeCounts.total > 0 ? `${Math.round((visitorTypeCounts.bot / visitorTypeCounts.total) * 100)}%` : "0%"} tooltip="Google, Bing, Naver 등 검색엔진 크롤러의 방문입니다. SEO 최적화 상태를 파악하는 데 유용합니다." />
          <MetricCard icon={<BrainCircuit className="w-5 h-5" />} label="AI 봇" value={visitorTypeCounts.ai} color="hsl(260, 70%, 55%)" sub={visitorTypeCounts.total > 0 ? `${Math.round((visitorTypeCounts.ai / visitorTypeCounts.total) * 100)}%` : "0%"} tooltip="ChatGPT, Claude, Perplexity 등 AI 서비스의 크롤러 방문입니다. AI 검색에 노출되고 있는지 확인할 수 있습니다." />
        </div>
      </SectionGroup>


      <SectionGroup title="일별 방문 추이" number={3}>
        <div className="rounded-2xl p-6" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
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
      </SectionGroup>



      <SectionGroup title="방문자 · 페이지 상세" number={4}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="인기 페이지" icon={<Eye className="w-4 h-4" />} tooltip="가장 많이 조회된 페이지 순위입니다. 어떤 서비스·콘텐츠에 방문자의 관심이 집중되는지 파악하여 마케팅 전략에 활용합니다.">
            {topPages.length === 0 ? <Empty /> : topPages.map(([path, count], i) => (
              <BarRow key={path} rank={i + 1} label={path} value={count as number} max={topPages[0][1] as number} color="hsl(214, 90%, 52%)" />
            ))}
          </ChartCard>
          <ChartCard title="방문 지역" icon={<MapPin className="w-4 h-4" />} tooltip="방문자의 IP 주소 기반 접속 지역입니다. 주요 고객이 어느 지역에 분포하는지 파악하여 지역 타겟 마케팅에 활용할 수 있습니다.">
            {topLocations.length === 0 ? <Empty msg="위치 데이터 수집 중..." /> : topLocations.map(([loc, count], i) => (
              <BarRow key={loc} rank={i + 1} label={loc} value={count as number} max={topLocations[0][1] as number} color="hsl(340, 65%, 55%)" />
            ))}
          </ChartCard>
          <ChartCard title="방문자 IP" icon={<Wifi className="w-4 h-4" />} tooltip="접속한 IP 주소별 방문 횟수입니다. 동일 IP에서 반복 방문이 많으면 해당 기업/기관의 높은 관심을 의미할 수 있습니다.">
            {ipWithLocation.length === 0 ? <Empty /> : ipWithLocation.map((d, i) => {
              const timeStr = d.lastVisit ? (() => {
                const dt = new Date(d.lastVisit);
                const m = String(dt.getMonth() + 1).padStart(2, "0");
                const day = String(dt.getDate()).padStart(2, "0");
                const h = String(dt.getHours()).padStart(2, "0");
                const min = String(dt.getMinutes()).padStart(2, "0");
                return `${m}/${day} ${h}:${min}`;
              })() : "";
              const suffix = [d.location, timeStr].filter(Boolean).join("  ·  ");
              return <BarRow key={d.ip} rank={i + 1} label={suffix ? `${d.ip}  ·  ${suffix}` : d.ip} value={d.count} max={ipWithLocation[0].count} color="hsl(192, 80%, 45%)" />;
            })}
          </ChartCard>
          <ChartCard title="유입 경로" icon={<ArrowUpRight className="w-4 h-4" />} tooltip="방문자가 어디에서 링크를 클릭하여 사이트에 왔는지 보여줍니다. '직접 방문'은 URL을 직접 입력하거나 북마크로 접속한 경우입니다.">
            {topReferrers.length === 0 ? <Empty /> : topReferrers.map(([ref, count], i) => (
              <BarRow key={ref} rank={i + 1} label={ref} value={count as number} max={topReferrers[0][1] as number} color="hsl(150, 60%, 42%)" />
            ))}
          </ChartCard>
          <ChartCard title="브라우저" icon={<Globe className="w-4 h-4" />} tooltip="방문자가 사용한 웹 브라우저 분포입니다. 특정 브라우저에서 문제가 발생하면 해당 브라우저 점유율을 확인하여 대응 우선순위를 정할 수 있습니다.">
            {topBrowsers.length === 0 ? <Empty /> : topBrowsers.map(([name, count], i) => (
              <BarRow key={name} rank={i + 1} label={name} value={count as number} max={topBrowsers[0][1] as number} color="hsl(35, 90%, 50%)" />
            ))}
          </ChartCard>
          <ChartCard title="운영체제" icon={<Monitor className="w-4 h-4" />} tooltip="방문자의 운영체제(Windows, macOS, iOS, Android 등) 분포입니다. 주요 사용자의 환경을 파악하여 호환성 테스트 우선순위를 정합니다.">
            {topOS.length === 0 ? <Empty /> : topOS.map(([name, count], i) => (
              <BarRow key={name} rank={i + 1} label={name} value={count as number} max={topOS[0][1] as number} color="hsl(260, 70%, 55%)" />
            ))}
          </ChartCard>
        </div>
      </SectionGroup>

      <SectionGroup title="전환 · 트래픽 패턴" number={5}>
        <SectionCard title="전환 퍼널" icon={<TrendingUp className="w-4 h-4" />} tooltip="방문자가 랜딩 페이지 → 서비스 페이지 → 문의 페이지 → 문의 제출까지 단계별로 얼마나 이탈하는지 보여줍니다. 각 단계의 이탈률(빨간 %)이 높은 구간을 개선하면 전환율을 높일 수 있습니다.">
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
        </SectionCard>

        <SectionCard title="시간대별 트래픽 히트맵" icon={<Grid3X3 className="w-4 h-4" />} tooltip="요일(세로)과 시간(가로)별 방문량을 색상 농도로 표현합니다. 색이 진할수록 방문이 많은 시간대입니다. 광고 집행이나 콘텐츠 발행의 최적 시간을 파악하는 데 활용하세요.">
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="flex mb-1 ml-8">
                {Array.from({ length: 24 }, (_, h) => (
                  <span key={h} className="flex-1 text-center text-[9px] text-muted-foreground/50" style={{ fontWeight: 500 }}>{h}</span>
                ))}
              </div>
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
        </SectionCard>
      </SectionGroup>

      <SectionGroup title="이탈 · 환경 분석" number={6}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="이탈 페이지" icon={<LogOut className="w-4 h-4" />} tooltip="방문자가 사이트를 떠나기 직전에 마지막으로 본 페이지입니다. 이탈이 많은 페이지는 콘텐츠 개선이나 CTA 추가를 고려해보세요.">
            {exitPages.length === 0 ? <Empty msg="이탈 데이터 수집 중..." /> : exitPages.map(([path, count], i) => (
              <BarRow key={path} rank={i + 1} label={path} value={count} max={exitPages[0][1]} color="hsl(0, 84%, 60%)" />
            ))}
          </ChartCard>
          <ChartCard title="페이지 이동 경로" icon={<Route className="w-4 h-4" />} tooltip="방문자가 한 페이지에서 다음 페이지로 이동한 경로입니다. 주요 동선을 파악하여 네비게이션을 최적화하고 전환 경로를 설계할 수 있습니다.">
            {pageFlows.length === 0 ? <Empty msg="이동 경로 데이터 수집 중..." /> : pageFlows.map(([flow, count], i) => (
              <BarRow key={flow} rank={i + 1} label={flow} value={count} max={pageFlows[0][1]} color="hsl(260, 70%, 55%)" />
            ))}
          </ChartCard>
          <ChartCard title="화면 해상도 분포" icon={<MonitorSmartphone className="w-4 h-4" />} tooltip="방문자 기기의 화면 해상도 분포입니다. 가장 많이 사용되는 해상도에 맞춰 반응형 디자인을 최적화하는 데 참고합니다.">
            {resolutionCounts.length === 0 ? <Empty /> : resolutionCounts.map(([res, count], i) => (
              <BarRow key={res} rank={i + 1} label={res} value={count} max={resolutionCounts[0][1]} color="hsl(192, 80%, 45%)" />
            ))}
          </ChartCard>
          <ChartCard title="브라우저 언어" icon={<Languages className="w-4 h-4" />} tooltip="방문자의 브라우저 언어 설정 분포입니다. 다국어 페이지 제작 시 우선순위를 결정하거나, 해외 유입 비율을 파악하는 데 활용합니다.">
            {languageCounts.length === 0 ? <Empty /> : languageCounts.map(([lang, count], i) => (
              <BarRow key={lang} rank={i + 1} label={lang} value={count} max={languageCounts[0][1]} color="hsl(170, 70%, 40%)" />
            ))}
          </ChartCard>
        </div>
      </SectionGroup>

      <SectionGroup title="마케팅 · UTM · CTA" number={7}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="UTM 소스별 유입" icon={<Link2 className="w-4 h-4" />} tooltip="URL에 포함된 utm_source 파라미터 값별 유입 수입니다. Google, Naver, Facebook 등 어떤 채널에서 방문자가 유입되었는지 확인할 수 있습니다.">
            {utmSourceCounts.length === 0 ? <Empty msg="UTM 데이터 수집 중..." /> : utmSourceCounts.map(([name, count], i) => (
              <BarRow key={name} rank={i + 1} label={name} value={count} max={utmSourceCounts[0][1]} color="hsl(170, 70%, 40%)" />
            ))}
          </ChartCard>
          <ChartCard title="UTM 캠페인" icon={<BarChart3 className="w-4 h-4" />} tooltip="utm_campaign 파라미터로 추적되는 마케팅 캠페인별 유입 수입니다. 광고 캠페인의 성과를 비교·분석할 때 활용합니다.">
            {utmCampaignCounts.length === 0 ? <Empty msg="캠페인 데이터 수집 중..." /> : utmCampaignCounts.map(([name, count], i) => (
              <BarRow key={name} rank={i + 1} label={name} value={count} max={utmCampaignCounts[0][1]} color="hsl(200, 70%, 50%)" />
            ))}
          </ChartCard>
          <ChartCard title="CTA 클릭 이벤트" icon={<MousePointerClick className="w-4 h-4" />} tooltip="'상담 신청', '데모 요청' 등 전환 유도 버튼(CTA)의 클릭 수를 버튼 텍스트별로 집계합니다. 어떤 CTA가 가장 효과적인지 파악할 수 있습니다.">
            {ctaClickCounts.length === 0 ? <Empty msg="CTA 클릭 데이터 수집 중..." /> : ctaClickCounts.map(([name, count], i) => (
              <BarRow key={name} rank={i + 1} label={name} value={count} max={ctaClickCounts[0][1]} color="hsl(340, 65%, 55%)" />
            ))}
          </ChartCard>
          <ChartCard title="CTA 클릭 - 페이지별" icon={<MousePointerClick className="w-4 h-4" />} tooltip="어느 페이지에서 CTA 버튼이 가장 많이 클릭되었는지 보여줍니다. 전환이 잘 일어나는 페이지와 개선이 필요한 페이지를 구분할 수 있습니다.">
            {ctaByPage.length === 0 ? <Empty msg="CTA 클릭 데이터 수집 중..." /> : ctaByPage.map(([path, count], i) => (
              <BarRow key={path} rank={i + 1} label={path} value={count} max={ctaByPage[0][1]} color="hsl(280, 60%, 55%)" />
            ))}
          </ChartCard>
        </div>
      </SectionGroup>

      <SectionGroup title="콘텐츠 소비 분석">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="페이지별 스크롤 깊이" icon={<ScrollText className="w-4 h-4" />} tooltip="방문자가 각 페이지에서 평균적으로 몇 %까지 스크롤했는지 보여줍니다. 100%에 가까울수록 콘텐츠를 끝까지 읽은 것이며, 낮으면 상단에서 이탈한 것입니다.">
            {scrollDepthStats.length === 0 ? <Empty msg="스크롤 데이터 수집 중..." /> : scrollDepthStats.map((d, i) => (
              <BarRow key={d.path} rank={i + 1} label={d.path} value={d.avg} max={100} color="hsl(35, 90%, 50%)" suffix="%" />
            ))}
          </ChartCard>
          <ChartCard title="페이지별 평균 체류시간" icon={<Clock className="w-4 h-4" />} tooltip="각 페이지에 방문자가 머문 평균 시간입니다. 체류시간이 긴 페이지는 콘텐츠 관심도가 높고, 짧은 페이지는 내용 개선이 필요할 수 있습니다.">
            {pageDwellTimes.length === 0 ? <Empty msg="체류시간 데이터 수집 중..." /> : pageDwellTimes.map((d, i) => (
              <DwellRow key={d.path} rank={i + 1} label={d.path} avgSeconds={d.avg} count={d.count} max={pageDwellTimes[0].avg} />
            ))}
          </ChartCard>
        </div>
      </SectionGroup>
    </div>
  );
}

function HelpTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 transition-all hover:opacity-80"
        style={{ fontWeight: 700, color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
      >
        ?
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[240px] rounded-xl p-3 text-[11px] leading-relaxed shadow-lg animate-in fade-in zoom-in-95 duration-150"
          style={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", color: "hsl(var(--popover-foreground))", fontWeight: 400 }}>
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 rotate-45"
            style={{ background: "hsl(var(--popover))", borderRight: "1px solid hsl(var(--border))", borderBottom: "1px solid hsl(var(--border))" }} />
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, color, sub, tooltip }: {
  icon: React.ReactNode; label: string; value: number | string; color: string; sub?: string; tooltip?: string;
}) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}10`, color }}>{icon}</div>
        {tooltip && <HelpTooltip text={tooltip} />}
      </div>
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

function ChartCard({ title, icon, children, tooltip, maxItems = 10 }: { title: string; icon: React.ReactNode; children: React.ReactNode; tooltip?: string; maxItems?: number }) {
  const [expanded, setExpanded] = useState(false);
  const childArray = React.Children.toArray(children);
  const hasMore = childArray.length > maxItems;
  const visibleChildren = expanded ? childArray : childArray.slice(0, maxItems);
  return (
    <div className="rounded-2xl p-5" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[14px] text-foreground tracking-[-0.02em] flex-1" style={{ fontWeight: 600 }}>{title}</h4>
        {tooltip && <HelpTooltip text={tooltip} />}
      </div>
      <div className="flex flex-col gap-3">{visibleChildren}</div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 pt-3 flex items-center justify-center gap-1 text-[12px] transition-all hover:opacity-70"
          style={{ fontWeight: 500, color: "hsl(var(--primary))", borderTop: "1px solid hsl(var(--border) / 0.5)" }}
        >
          {expanded ? "접기" : `더보기 (+${childArray.length - maxItems})`}
        </button>
      )}
    </div>
  );
}

function SectionGroup({ title, children, number }: { title: string; children: React.ReactNode; number?: number }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <button className="flex items-center gap-2 w-full text-left px-1" onClick={() => setCollapsed(!collapsed)}>
        {number !== undefined && (
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[12px] shrink-0"
            style={{ fontWeight: 700, background: "hsl(214 90% 52% / 0.1)", color: "hsl(214, 90%, 52%)" }}>{number}</span>
        )}
        <h3 className="text-[15px] text-foreground tracking-[-0.02em] flex-1" style={{ fontWeight: 700 }}>{title}</h3>
        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }} />
      </button>
      {!collapsed && children}
    </div>
  );
}

function SectionCard({ title, icon, children, tooltip }: { title: string; icon: React.ReactNode; children: React.ReactNode; tooltip?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="rounded-2xl" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
      <button className="flex items-center gap-2 w-full text-left p-6" onClick={() => setCollapsed(!collapsed)} style={{ paddingBottom: collapsed ? undefined : "0" }}>
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[14px] text-foreground tracking-[-0.02em] flex-1" style={{ fontWeight: 600 }}>{title}</h4>
        {tooltip && <HelpTooltip text={tooltip} />}
        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }} />
      </button>
      {!collapsed && <div className="px-6 pb-6 pt-4">{children}</div>}
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
