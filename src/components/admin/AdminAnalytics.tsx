import React, { useState, useMemo, useRef } from "react";
import {
  Eye, Globe, Smartphone, Monitor, RefreshCw, ArrowUpRight,
  TrendingUp, BarChart3, Calendar, Wifi, Clock, MapPin,
  MousePointerClick, Users, ScrollText, Link2, LogOut,
  Route, Languages, MonitorSmartphone, Grid3X3, Bot, User, BrainCircuit, ChevronDown, ShieldAlert
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer
} from "recharts";

interface AdminAnalyticsProps {
  pageViews: any[];
  inquiries: any[];
  clickEvents: any[];
  onRefresh: (days: number) => void;
}

export default function AdminAnalytics({ pageViews, inquiries, clickEvents, onRefresh }: AdminAnalyticsProps) {
  const [dateRange, setDateRange] = useState(0);

  const filteredViews = useMemo(() => {
    const since = new Date();
    if (dateRange === 0) since.setHours(0, 0, 0, 0);
    else since.setDate(since.getDate() - dateRange);
    return pageViews.filter((v) => new Date(v.created_at) >= since);
  }, [pageViews, dateRange]);

  const filteredClicks = useMemo(() => {
    const since = new Date();
    if (dateRange === 0) since.setHours(0, 0, 0, 0);
    else since.setDate(since.getDate() - dateRange);
    return clickEvents.filter((v) => new Date(v.created_at) >= since);
  }, [clickEvents, dateRange]);

  const totalViews = filteredViews.length;
  const uniqueSessions = new Set(filteredViews.map((v) => v.session_id)).size;

  const visitorTypeCounts = useMemo(() => {
    // Display name maps for granular visitor_type from DB
    const aiNames: Record<string, string> = {
      ai_openai: "OpenAI (GPTBot)", ai_anthropic: "Anthropic (Claude)",
      ai_bytedance: "ByteDance", ai_commoncrawl: "Common Crawl",
      ai_cohere: "Cohere", ai_perplexity: "Perplexity",
      ai_you: "You.com", ai_google: "Google AI",
      ai_meta: "Meta AI", ai_amazon: "Amazon", ai_ai2: "AI2 (Allen)",
    };
    const searchNames: Record<string, string> = {
      search_bot_google: "Google", search_bot_bing: "Bing", search_bot_yandex: "Yandex",
      search_bot_baidu: "Baidu", search_bot_duckduckgo: "DuckDuckGo", search_bot_yahoo: "Yahoo",
      search_bot_naver: "Naver", search_bot_apple: "Apple", search_bot_sogou: "Sogou",
      search_bot_facebook: "Facebook", search_bot_twitter: "Twitter/X",
      search_bot_linkedin: "LinkedIn", search_bot_pinterest: "Pinterest",
      search_bot_seznam: "Seznam", search_bot_msn: "MSN",
    };
    const scraperNames: Record<string, string> = {
      scraper_seo_semrush: "SEMrush", scraper_seo_ahrefs: "Ahrefs", scraper_seo_moz: "Moz",
      scraper_seo_serpstat: "Serpstat", scraper_seo_dataforseo: "DataForSEO",
      scraper_seo_screamingfrog: "Screaming Frog", scraper_seo_sitebulb: "Sitebulb",
      scraper_seo_majestic: "Majestic", scraper_seo_megaindex: "MegaIndex",
      scraper_archive: "Internet Archive",
      scraper_other_petalbot: "PetalBot (Huawei)", scraper_other_blexbot: "BLEXBot",
      scraper_other_rogerbot: "RogerBot", scraper_other_exabot: "Exabot",
      scraper_cf: "CF 프록시", scraper_repeated: "반복접속",
      scraper_unknown: "기타 스크래퍼",
    };

    let human = 0, searchBot = 0, scraper = 0, ai = 0;
    const scraperSubCounts: Record<string, number> = {};
    const searchBotSubCounts: Record<string, number> = {};
    const aiBotSubCounts: Record<string, number> = {};
    const aiBotPageMap: Record<string, Record<string, number>> = {};

    filteredViews.forEach((v) => {
      const type = v.visitor_type || "human";

      if (type.startsWith("ai")) {
        ai++;
        const name = aiNames[type] || "기타";
        aiBotSubCounts[name] = (aiBotSubCounts[name] || 0) + 1;
        if (!aiBotPageMap[name]) aiBotPageMap[name] = {};
        aiBotPageMap[name][v.page_path] = (aiBotPageMap[name][v.page_path] || 0) + 1;
      } else if (type.startsWith("search_bot")) {
        searchBot++;
        const name = searchNames[type] || "기타";
        searchBotSubCounts[name] = (searchBotSubCounts[name] || 0) + 1;
      } else if (type.startsWith("scraper")) {
        scraper++;
        const name = scraperNames[type] || "기타 스크래퍼";
        scraperSubCounts[name] = (scraperSubCounts[name] || 0) + 1;
      } else {
        human++;
      }
    });

    const scraperSubs = Object.entries(scraperSubCounts).sort(([, a], [, b]) => b - a);
    const searchBotSubs = Object.entries(searchBotSubCounts).sort(([, a], [, b]) => b - a);
    const aiBotSubs = Object.entries(aiBotSubCounts).sort(([, a], [, b]) => b - a);
    const aiBotPages: { bot: string; pages: [string, number][] }[] = Object.entries(aiBotPageMap)
      .map(([bot, pages]) => ({ bot, pages: Object.entries(pages).sort(([, a], [, b]) => b - a) }))
      .sort((a, b) => b.pages.reduce((s, [, c]) => s + c, 0) - a.pages.reduce((s, [, c]) => s + c, 0));
    return { human, searchBot, scraper, ai, total: human + searchBot + scraper + ai, scraperSubs, searchBotSubs, aiBotSubs, aiBotPages };
  }, [filteredViews]);

  const deviceCounts = filteredViews.reduce((acc, v) => {
    acc[v.device_type || "unknown"] = (acc[v.device_type || "unknown"] || 0) + 1; return acc;
  }, {} as Record<string, number>);

  const pageCounts = filteredViews.reduce((acc, v) => { acc[v.page_path] = (acc[v.page_path] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topPages = Object.entries(pageCounts).sort(([, a], [, b]) => (b as number) - (a as number));

  const browserCounts = filteredViews.reduce((acc, v) => { acc[v.browser || "Unknown"] = (acc[v.browser || "Unknown"] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topBrowsers = Object.entries(browserCounts).sort(([, a], [, b]) => (b as number) - (a as number));

  const osCounts = filteredViews.reduce((acc, v) => { acc[v.os || "Unknown"] = (acc[v.os || "Unknown"] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topOS = Object.entries(osCounts).sort(([, a], [, b]) => (b as number) - (a as number));

  const referrerCounts = filteredViews.reduce((acc, v) => {
    try { const ref = v.referrer ? new URL(v.referrer).hostname : "직접 방문"; acc[ref] = (acc[ref] || 0) + 1; } catch { acc["기타"] = (acc["기타"] || 0) + 1; }
    return acc;
  }, {} as Record<string, number>);
  const topReferrers = Object.entries(referrerCounts).sort(([, a], [, b]) => (b as number) - (a as number));

  const maskIp = (ip: string) => {
    if (ip === "알 수 없음") return ip;
    const parts = ip.split(".");
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
    return ip.replace(/:[\da-f]{1,4}$/i, ":***");
  };

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
      .map(([ip, d]) => ({ ip: maskIp(ip), count: d.count, location: d.city || d.country || null, lastVisit: d.lastVisit }))
      .sort((a, b) => b.count - a.count);
  }, [filteredViews]);

  const topLocations = useMemo(() => {
    const locationCounts = filteredViews.reduce((acc, v) => {
      const loc = v.city || v.country || "알 수 없음";
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(locationCounts).sort(([, a], [, b]) => (b as number) - (a as number));
  }, [filteredViews]);

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
      .sort((a, b) => b.avg - a.avg);
  }, [filteredViews]);

  const overallAvgDwell = useMemo(() => {
    const withDuration = filteredViews.filter((v) => v.duration_seconds && v.duration_seconds > 0);
    if (withDuration.length === 0) return 0;
    return Math.round(withDuration.reduce((s, v) => s + v.duration_seconds, 0) / withDuration.length);
  }, [filteredViews]);

  const toLocalDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isToday = dateRange === 0;

  const dailyData = useMemo(() => {
    if (isToday) {
      const hours: Record<number, { views: number; sessions: Set<string> }> = {};
      for (let h = 0; h < 24; h++) hours[h] = { views: 0, sessions: new Set() };
      filteredViews.forEach((v) => {
        const d = new Date(v.created_at);
        const h = d.getHours();
        hours[h].views++;
        if (v.session_id) hours[h].sessions.add(v.session_id);
      });
      return Object.entries(hours).map(([h, d]) => ({
        date: h, label: `${String(h).padStart(2, "0")}시`, views: d.views, sessions: d.sessions.size,
      }));
    }
    const days: Record<string, { views: number; sessions: Set<string> }> = {};
    const today = new Date();
    for (let i = dateRange - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = toLocalDateKey(d);
      days[key] = { views: 0, sessions: new Set() };
    }
    filteredViews.forEach((v) => {
      const key = toLocalDateKey(new Date(v.created_at));
      if (days[key]) { days[key].views++; if (v.session_id) days[key].sessions.add(v.session_id); }
    });
    return Object.entries(days).map(([date, d]) => ({
      date, label: new Date(date).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }), views: d.views, sessions: d.sessions.size,
    }));
  }, [filteredViews, dateRange, isToday]);

  const filteredInquiries = useMemo(() => {
    const since = new Date();
    if (dateRange === 0) {
      since.setHours(0, 0, 0, 0);
    } else {
      since.setDate(since.getDate() - dateRange);
    }
    return inquiries.filter((i) => new Date(i.created_at) >= since);
  }, [inquiries, dateRange]);

  const conversionRate = uniqueSessions > 0 ? ((filteredInquiries.length / uniqueSessions) * 100).toFixed(1) : "0.0";

  const utmSourceCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredViews.forEach((v) => { if (v.utm_source) acc[v.utm_source] = (acc[v.utm_source] || 0) + 1; });
    return Object.entries(acc).sort(([, a], [, b]) => b - a);
  }, [filteredViews]);

  const utmCampaignCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredViews.forEach((v) => { if (v.utm_campaign) acc[v.utm_campaign] = (acc[v.utm_campaign] || 0) + 1; });
    return Object.entries(acc).sort(([, a], [, b]) => b - a);
  }, [filteredViews]);

  const utmMediumCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredViews.forEach((v) => { if (v.utm_medium) acc[v.utm_medium] = (acc[v.utm_medium] || 0) + 1; });
    return Object.entries(acc).sort(([, a], [, b]) => b - a);
  }, [filteredViews]);

  const ctaClickCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredClicks.forEach((c) => { const label = c.element_text || c.element_id || "Unknown"; acc[label] = (acc[label] || 0) + 1; });
    return Object.entries(acc).sort(([, a], [, b]) => b - a);
  }, [filteredClicks]);

  const ctaByPage = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredClicks.forEach((c) => { acc[c.page_path] = (acc[c.page_path] || 0) + 1; });
    return Object.entries(acc).sort(([, a], [, b]) => b - a);
  }, [filteredClicks]);

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
      .sort((a, b) => b.avg - a.avg);
  }, [filteredViews]);

  const visitStats = useMemo(() => {
    const first = filteredViews.filter((v) => v.is_first_visit === true).length;
    return { first, returning: filteredViews.length - first };
  }, [filteredViews]);

  const exitPages = useMemo(() => {
    const sessionPages: Record<string, { path: string; time: string }> = {};
    filteredViews.forEach((v) => {
      if (!v.session_id) return;
      if (!sessionPages[v.session_id] || v.created_at > sessionPages[v.session_id].time)
        sessionPages[v.session_id] = { path: v.page_path, time: v.created_at };
    });
    const acc: Record<string, number> = {};
    Object.values(sessionPages).forEach((s) => { acc[s.path] = (acc[s.path] || 0) + 1; });
    return Object.entries(acc).sort(([, a], [, b]) => b - a);
  }, [filteredViews]);

  const funnelData = useMemo(() => {
    const sessions = new Set(filteredViews.map((v) => v.session_id).filter(Boolean));
    const landingSessions = new Set<string>();
    const serviceSessions = new Set<string>();
    const servicePages = ["/lms", "/hosting", "/drm", "/content", "/chatbot", "/channel", "/maintenance", "/app-dev", "/pg"];
    filteredViews.forEach((v) => {
      if (!v.session_id) return;
      if (v.page_path === "/") landingSessions.add(v.session_id);
      if (servicePages.some((p) => v.page_path.startsWith(p))) serviceSessions.add(v.session_id);
    });
    const ctaSessions = new Set(filteredClicks.filter((c) => c.session_id).map((c) => c.session_id!));
    return [
      { label: "전체 방문", count: sessions.size },
      { label: "랜딩 페이지", count: landingSessions.size },
      { label: "서비스 페이지", count: serviceSessions.size },
      { label: "CTA 클릭", count: ctaSessions.size },
      { label: "문의 제출", count: filteredInquiries.length },
    ];
  }, [filteredViews, filteredInquiries, filteredClicks]);

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
    return Object.entries(flows).sort(([, a], [, b]) => b - a);
  }, [filteredViews]);

  const resolutionCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredViews.forEach((v) => {
      if (v.screen_width && v.screen_height) {
        const res = `${v.screen_width}×${v.screen_height}`;
        acc[res] = (acc[res] || 0) + 1;
      }
    });
    return Object.entries(acc).sort(([, a], [, b]) => b - a);
  }, [filteredViews]);

  const languageCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredViews.forEach((v) => {
      const lang = v.language || "Unknown";
      acc[lang] = (acc[lang] || 0) + 1;
    });
    return Object.entries(acc).sort(([, a], [, b]) => b - a);
  }, [filteredViews]);

  // 신규 방문자 분석: 3/4 이전에 한 번이라도 접속한 IP/session은 제외
  const newVisitorCutoff = new Date("2026-03-04T00:00:00");

  const newVisitorData = useMemo(() => {
    // 3월 3일까지의 모든 기존 방문자 식별자(IP + session_id) 수집
    const oldVisitorIds = new Set<string>();
    pageViews.forEach((v) => {
      if (new Date(v.created_at) < newVisitorCutoff) {
        if (v.ip_address) oldVisitorIds.add(`ip:${v.ip_address}`);
        if (v.session_id) oldVisitorIds.add(`sid:${v.session_id}`);
      }
    });

    // 3/4 이후 접속 중, 기존 방문자가 아닌 것 + 사람만 필터
    const newVisitors = pageViews.filter((v) => {
      if (new Date(v.created_at) < newVisitorCutoff) return false;
      if (v.visitor_type && v.visitor_type !== "human") return false;
      const ipKey = v.ip_address ? `ip:${v.ip_address}` : null;
      const sidKey = v.session_id ? `sid:${v.session_id}` : null;
      // IP 또는 session_id가 기존에 존재하면 제외
      if (ipKey && oldVisitorIds.has(ipKey)) return false;
      if (sidKey && oldVisitorIds.has(sidKey)) return false;
      return true;
    });

    const totalNew = newVisitors.length;
    const uniqueNewSessions = new Set(newVisitors.map((v) => v.session_id)).size;
    const uniqueNewIPs = new Set(newVisitors.filter((v) => v.ip_address).map((v) => v.ip_address)).size;

    // 일별 추이
    const dailyNew: Record<string, number> = {};
    newVisitors.forEach((v) => {
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

    // 랜딩 페이지
    const landingPages: Record<string, number> = {};
    newVisitors.forEach((v) => { landingPages[v.page_path] = (landingPages[v.page_path] || 0) + 1; });
    const topLandingPages = Object.entries(landingPages).sort(([, a], [, b]) => b - a);

    // 디바이스
    const devices: Record<string, number> = {};
    newVisitors.forEach((v) => { devices[v.device_type || "unknown"] = (devices[v.device_type || "unknown"] || 0) + 1; });
    const topDevices = Object.entries(devices).sort(([, a], [, b]) => b - a);

    // 지역
    const locations: Record<string, number> = {};
    newVisitors.forEach((v) => {
      const loc = v.city || v.country || "알 수 없음";
      locations[loc] = (locations[loc] || 0) + 1;
    });
    const topLocations = Object.entries(locations).sort(([, a], [, b]) => b - a);

    // 유입 경로
    const referrers: Record<string, number> = {};
    newVisitors.forEach((v) => {
      try { const ref = v.referrer ? new URL(v.referrer).hostname : "직접 방문"; referrers[ref] = (referrers[ref] || 0) + 1; } catch { referrers["기타"] = (referrers["기타"] || 0) + 1; }
    });
    const topReferrers = Object.entries(referrers).sort(([, a], [, b]) => b - a);

    // 브라우저
    const browsers: Record<string, number> = {};
    newVisitors.forEach((v) => { browsers[v.browser || "Unknown"] = (browsers[v.browser || "Unknown"] || 0) + 1; });
    const topBrowsers = Object.entries(browsers).sort(([, a], [, b]) => b - a);

    return { totalNew, uniqueNewSessions, uniqueNewIPs, dailyNewArr, topLandingPages, topDevices, topLocations, topReferrers, topBrowsers };
  }, [pageViews]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground">접속 분석</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {isToday ? "오늘" : `최근 ${dateRange}일`}의 방문 데이터
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <button onClick={() => onRefresh(Math.max(dateRange, 1))}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[hsl(220,13%,91%)] text-muted-foreground hover:bg-[hsl(220,14%,96%)] transition-colors active:animate-spin"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <SectionGroup title="주요 지표 요약" number={1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard icon={<Eye className="w-[18px] h-[18px]" />} label="페이지뷰" value={totalViews} color="hsl(221, 83%, 53%)" tooltip="선택한 기간 동안 사이트의 모든 페이지가 조회된 총 횟수입니다." />
          <MetricCard icon={<Globe className="w-[18px] h-[18px]" />} label="고유 세션" value={uniqueSessions} color="hsl(152, 57%, 42%)" tooltip="고유 세션 수입니다." />
          <MetricCard icon={<Clock className="w-[18px] h-[18px]" />} label="평균 체류" value={formatDuration(overallAvgDwell)} color="hsl(199, 89%, 48%)" tooltip="한 페이지에 머문 평균 시간입니다." />
          <MetricCard icon={<MousePointerClick className="w-[18px] h-[18px]" />} label="CTA 클릭" value={filteredClicks.length} color="hsl(340, 65%, 55%)" tooltip="CTA 버튼 클릭 총 횟수입니다." />
          <MetricCard icon={<Users className="w-[18px] h-[18px]" />} label="신규 방문" value={visitStats.first} color="hsl(37, 90%, 51%)" sub={`재방문 ${visitStats.returning}`} tooltip="신규 방문자 수입니다." />
          <MetricCard icon={<Smartphone className="w-[18px] h-[18px]" />} label="모바일" value={deviceCounts.mobile || 0} color="hsl(262, 60%, 55%)" tooltip="모바일 접속 수입니다." />
          <MetricCard icon={<TrendingUp className="w-[18px] h-[18px]" />} label="전환율" value={`${conversionRate}%`} color="hsl(0, 84%, 60%)" sub={`문의 ${filteredInquiries.length}건`} tooltip="방문 대비 문의 전환율입니다." />
          <MetricCard icon={<Link2 className="w-[18px] h-[18px]" />} label="UTM 유입" value={utmSourceCounts.reduce((s, [, c]) => s + c, 0)} color="hsl(170, 70%, 40%)" tooltip="UTM 파라미터 유입 수입니다." />
        </div>
      </SectionGroup>

      <SectionGroup title="방문자 유형 분석" number={2}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <User className="w-4 h-4" />, label: "사람", value: visitorTypeCounts.human, color: "hsl(221, 83%, 53%)", pct: visitorTypeCounts.total > 0 ? Math.round((visitorTypeCounts.human / visitorTypeCounts.total) * 100) : 0 },
            { icon: <Bot className="w-4 h-4" />, label: "검색엔진 봇", value: visitorTypeCounts.searchBot, color: "hsl(37, 90%, 51%)", pct: visitorTypeCounts.total > 0 ? Math.round((visitorTypeCounts.searchBot / visitorTypeCounts.total) * 100) : 0 },
            { icon: <ShieldAlert className="w-4 h-4" />, label: "스크래퍼", value: visitorTypeCounts.scraper, color: "hsl(0, 70%, 55%)", pct: visitorTypeCounts.total > 0 ? Math.round((visitorTypeCounts.scraper / visitorTypeCounts.total) * 100) : 0 },
            { icon: <BrainCircuit className="w-4 h-4" />, label: "AI 봇", value: visitorTypeCounts.ai, color: "hsl(262, 60%, 55%)", pct: visitorTypeCounts.total > 0 ? Math.round((visitorTypeCounts.ai / visitorTypeCounts.total) * 100) : 0 },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}12`, color: item.color }}>{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[20px] font-bold tracking-[-0.04em] text-foreground tabular-nums">{item.value.toLocaleString()}</p>
                  <p className="text-[12px] font-bold" style={{ color: item.color }}>{item.pct}%</p>
                </div>
                <p className="text-[12px] font-medium text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
        {[
          { subs: visitorTypeCounts.searchBotSubs, label: "검색엔진 봇 종류별 상세", color: "hsl(37, 90%, 51%)", total: visitorTypeCounts.searchBot },
          { subs: visitorTypeCounts.aiBotSubs, label: "AI 봇 종류별 상세", color: "hsl(262, 60%, 55%)", total: visitorTypeCounts.ai },
          { subs: visitorTypeCounts.scraperSubs, label: "스크래퍼 종류별 상세", color: "hsl(0, 70%, 55%)", total: visitorTypeCounts.scraper },
        ].map((group) => (
          <div key={group.label} className="mt-3 bg-white rounded-2xl border border-[hsl(220,13%,91%)] px-4 py-3">
            <p className="text-[12px] font-semibold text-muted-foreground mb-2">{group.label}</p>
            {group.subs.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {group.subs.map(([name, count]) => (
                  <div key={name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px]" style={{ background: `${group.color}08`, border: `1px solid ${group.color}15` }}>
                    <span className="font-semibold text-foreground">{name}</span>
                    <span className="font-bold" style={{ color: group.color }}>{count.toLocaleString()}</span>
                    <span className="text-muted-foreground">({group.total > 0 ? Math.round((count / group.total) * 100) : 0}%)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground/40 py-1">해당 기간에 감지된 데이터가 없습니다</p>
            )}
          </div>
        ))}
        {visitorTypeCounts.aiBotPages.length > 0 && (
          <div className="mt-3 bg-white rounded-2xl border border-[hsl(220,13%,91%)] px-4 py-3">
            <p className="text-[12px] font-semibold text-muted-foreground mb-3">🤖 AI 봇별 크롤링 페이지 분석</p>
            <div className="flex flex-col gap-3">
              {visitorTypeCounts.aiBotPages.map(({ bot, pages }) => {
                const botTotal = pages.reduce((s, [, c]) => s + c, 0);
                return (
                  <div key={bot}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[12px] font-bold text-foreground">{bot}</span>
                      <span className="text-[11px] text-muted-foreground">총 {botTotal}회</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {pages.slice(0, 8).map(([path, count]) => (
                        <div key={path} className="flex items-center gap-2">
                          <div className="flex-1 h-5 rounded overflow-hidden relative bg-[hsl(220,14%,96%)]">
                            <div className="h-full rounded" style={{ width: `${Math.max((count / pages[0][1]) * 100, 4)}%`, background: "hsl(262, 60%, 55%, 0.15)" }} />
                            <span className="absolute left-2 top-0 h-full flex items-center text-[10px] font-medium text-foreground">{path}</span>
                          </div>
                          <span className="text-[10px] font-bold shrink-0" style={{ color: "hsl(262, 60%, 55%)" }}>{count}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0">({Math.round((count / botTotal) * 100)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </SectionGroup>

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

      <SectionGroup title="방문자 · 페이지 상세" number={4}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ChartCard title="인기 페이지" icon={<Eye className="w-4 h-4" />}>
            {topPages.length === 0 ? <Empty /> : topPages.map(([p, c], i) => <BarRow key={p} rank={i+1} label={p} value={c as number} max={topPages[0][1] as number} color="hsl(221, 83%, 53%)" />)}
          </ChartCard>
          <ChartCard title="방문 지역" icon={<MapPin className="w-4 h-4" />}>
            {topLocations.length === 0 ? <Empty msg="위치 데이터 수집 중..." /> : topLocations.map(([l, c], i) => <BarRow key={l} rank={i+1} label={l} value={c as number} max={topLocations[0][1] as number} color="hsl(340, 65%, 55%)" />)}
          </ChartCard>
          <ChartCard title="방문자 IP" icon={<Wifi className="w-4 h-4" />}>
            {ipWithLocation.length === 0 ? <Empty /> : ipWithLocation.map((d, i) => {
              const timeStr = d.lastVisit ? (() => { const dt = new Date(d.lastVisit); return `${String(dt.getMonth()+1).padStart(2,"0")}/${String(dt.getDate()).padStart(2,"0")} ${String(dt.getHours()).padStart(2,"0")}:${String(dt.getMinutes()).padStart(2,"0")}`; })() : "";
              const suffix = [d.location, timeStr].filter(Boolean).join("  ·  ");
              return <BarRow key={d.ip} rank={i+1} label={suffix ? `${d.ip}  ·  ${suffix}` : d.ip} value={d.count} max={ipWithLocation[0].count} color="hsl(199, 89%, 48%)" />;
            })}
          </ChartCard>
          <ChartCard title="유입 경로" icon={<ArrowUpRight className="w-4 h-4" />}>
            {topReferrers.length === 0 ? <Empty /> : topReferrers.map(([r, c], i) => <BarRow key={r} rank={i+1} label={r} value={c as number} max={topReferrers[0][1] as number} color="hsl(152, 57%, 42%)" />)}
          </ChartCard>
          <ChartCard title="브라우저" icon={<Globe className="w-4 h-4" />}>
            {topBrowsers.length === 0 ? <Empty /> : topBrowsers.map(([n, c], i) => <BarRow key={n} rank={i+1} label={n} value={c as number} max={topBrowsers[0][1] as number} color="hsl(37, 90%, 51%)" />)}
          </ChartCard>
          <ChartCard title="운영체제" icon={<Monitor className="w-4 h-4" />}>
            {topOS.length === 0 ? <Empty /> : topOS.map(([n, c], i) => <BarRow key={n} rank={i+1} label={n} value={c as number} max={topOS[0][1] as number} color="hsl(262, 60%, 55%)" />)}
          </ChartCard>
        </div>
      </SectionGroup>

      <SectionGroup title="전환 · 트래픽 패턴" number={5}>
        <SectionCard title="전환 퍼널" icon={<TrendingUp className="w-4 h-4" />}>
          <div className="flex flex-col gap-3">
            {funnelData.map((step, i) => {
              const pct = funnelData[0].count > 0 ? (step.count / funnelData[0].count) * 100 : 0;
              const dropOff = i > 0 && funnelData[i-1].count > 0 ? ((1 - step.count / funnelData[i-1].count) * 100).toFixed(1) : null;
              return (
                <div key={step.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold bg-[hsl(221,83%,53%,0.1)] text-[hsl(221,83%,53%)]">{i+1}</span>
                      <span className="text-[13px] font-medium text-foreground">{step.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-foreground tabular-nums">{step.count.toLocaleString()}</span>
                      {dropOff && <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md text-[hsl(0,84%,60%)] bg-[hsl(0,84%,60%,0.06)]">-{dropOff}%</span>}
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-[hsl(221,83%,53%,0.06)]">
                    <div className="h-full rounded-full transition-all duration-500 bg-[hsl(221,83%,53%)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
        <SectionCard title="시간대별 트래픽 히트맵" icon={<Grid3X3 className="w-4 h-4" />}>
          {dateRange < 7 ? (
            <div className="flex items-center justify-center py-8 text-[13px] text-muted-foreground">
              7일 이상 선택 시 히트맵이 표시됩니다
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="flex mb-1 ml-8">
                  {Array.from({ length: 24 }, (_, h) => (
                    <span key={h} className="flex-1 text-center text-[9px] font-medium text-muted-foreground/40">{h}</span>
                  ))}
                </div>
                {hourlyData.dayNames.map((day, dayIdx) => (
                  <div key={day} className="flex items-center gap-1 mb-1">
                    <span className="w-7 text-[11px] font-medium text-muted-foreground text-right shrink-0">{day}</span>
                    <div className="flex flex-1 gap-0.5">
                      {hourlyData.grid[dayIdx].map((count, hour) => {
                        const intensity = maxHourly > 0 ? count / maxHourly : 0;
                        return (
                          <div key={hour} className="flex-1 rounded-sm transition-all"
                            style={{ height: "20px", background: count === 0 ? "hsl(220, 14%, 95%)" : `hsl(221 83% 53% / ${0.12 + intensity * 0.88})` }}
                            title={`${day} ${hour}시: ${count}건`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-end gap-2 mt-3">
                  <span className="text-[10px] text-muted-foreground/40">적음</span>
                  <div className="flex gap-0.5">
                    {[0.12, 0.3, 0.5, 0.7, 1].map((op, i) => (
                      <div key={i} className="w-4 h-3 rounded-sm" style={{ background: `hsl(221 83% 53% / ${op})` }} />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground/40">많음</span>
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      </SectionGroup>

      <SectionGroup title="이탈 · 환경 분석" number={6}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ChartCard title="이탈 페이지" icon={<LogOut className="w-4 h-4" />}>
            {exitPages.length === 0 ? <Empty msg="이탈 데이터 수집 중..." /> : exitPages.map(([p, c], i) => <BarRow key={p} rank={i+1} label={p} value={c} max={exitPages[0][1]} color="hsl(0, 84%, 60%)" />)}
          </ChartCard>
          <ChartCard title="페이지 이동 경로" icon={<Route className="w-4 h-4" />}>
            {pageFlows.length === 0 ? <Empty msg="이동 경로 데이터 수집 중..." /> : pageFlows.map(([f, c], i) => <BarRow key={f} rank={i+1} label={f} value={c} max={pageFlows[0][1]} color="hsl(262, 60%, 55%)" />)}
          </ChartCard>
          <ChartCard title="화면 해상도" icon={<MonitorSmartphone className="w-4 h-4" />}>
            {resolutionCounts.length === 0 ? <Empty /> : resolutionCounts.map(([r, c], i) => <BarRow key={r} rank={i+1} label={r} value={c} max={resolutionCounts[0][1]} color="hsl(199, 89%, 48%)" />)}
          </ChartCard>
          <ChartCard title="브라우저 언어" icon={<Languages className="w-4 h-4" />}>
            {languageCounts.length === 0 ? <Empty /> : languageCounts.map(([l, c], i) => <BarRow key={l} rank={i+1} label={l} value={c} max={languageCounts[0][1]} color="hsl(170, 70%, 40%)" />)}
          </ChartCard>
        </div>
      </SectionGroup>

      <SectionGroup title="마케팅 · UTM · CTA" number={7}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ChartCard title="UTM 소스별 유입" icon={<Link2 className="w-4 h-4" />}>
            {utmSourceCounts.length === 0 ? <Empty msg="UTM 데이터 수집 중..." /> : utmSourceCounts.map(([n, c], i) => <BarRow key={n} rank={i+1} label={n} value={c} max={utmSourceCounts[0][1]} color="hsl(170, 70%, 40%)" />)}
          </ChartCard>
          <ChartCard title="UTM 캠페인" icon={<BarChart3 className="w-4 h-4" />}>
            {utmCampaignCounts.length === 0 ? <Empty msg="캠페인 데이터 수집 중..." /> : utmCampaignCounts.map(([n, c], i) => <BarRow key={n} rank={i+1} label={n} value={c} max={utmCampaignCounts[0][1]} color="hsl(199, 89%, 48%)" />)}
          </ChartCard>
          <ChartCard title="CTA 클릭 이벤트" icon={<MousePointerClick className="w-4 h-4" />}>
            {ctaClickCounts.length === 0 ? <Empty msg="CTA 클릭 데이터 수집 중..." /> : ctaClickCounts.map(([n, c], i) => <BarRow key={n} rank={i+1} label={n} value={c} max={ctaClickCounts[0][1]} color="hsl(340, 65%, 55%)" />)}
          </ChartCard>
          <ChartCard title="CTA 클릭 - 페이지별" icon={<MousePointerClick className="w-4 h-4" />}>
            {ctaByPage.length === 0 ? <Empty msg="CTA 클릭 데이터 수집 중..." /> : ctaByPage.map(([p, c], i) => <BarRow key={p} rank={i+1} label={p} value={c} max={ctaByPage[0][1]} color="hsl(262, 60%, 55%)" />)}
          </ChartCard>
        </div>
      </SectionGroup>

      <SectionGroup title="콘텐츠 소비 분석" number={8}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ChartCard title="페이지별 스크롤 깊이" icon={<ScrollText className="w-4 h-4" />}>
            {scrollDepthStats.length === 0 ? <Empty msg="스크롤 데이터 수집 중..." /> : scrollDepthStats.map((d, i) => <BarRow key={d.path} rank={i+1} label={d.path} value={d.avg} max={100} color="hsl(37, 90%, 51%)" suffix="%" />)}
          </ChartCard>
          <ChartCard title="페이지별 평균 체류시간" icon={<Clock className="w-4 h-4" />}>
            {pageDwellTimes.length === 0 ? <Empty msg="체류시간 데이터 수집 중..." /> : pageDwellTimes.map((d, i) => <DwellRow key={d.path} rank={i+1} label={d.path} avgSeconds={d.avg} count={d.count} max={pageDwellTimes[0].avg} />)}
          </ChartCard>
        </div>
      </SectionGroup>

      <SectionGroup title="신규 방문자 분석 (3/4~)" number={9}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard icon={<Users className="w-[18px] h-[18px]" />} label="신규 방문 수" value={newVisitorData.totalNew} color="hsl(37, 90%, 51%)" tooltip="3월 4일 이후 최초 접속한 방문자의 페이지뷰 수입니다." />
          <MetricCard icon={<Globe className="w-[18px] h-[18px]" />} label="신규 세션" value={newVisitorData.uniqueNewSessions} color="hsl(152, 57%, 42%)" tooltip="3월 4일 이후 최초 접속한 고유 세션 수입니다." />
          <MetricCard icon={<Wifi className="w-[18px] h-[18px]" />} label="고유 IP" value={newVisitorData.uniqueNewIPs} color="hsl(199, 89%, 48%)" tooltip="3월 4일 이후 신규 방문자의 중복 제거된 고유 IP 수입니다." />
        </div>
        {newVisitorData.dailyNewArr.length > 0 && (
          <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-5 mt-3">
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
          <ChartCard title="신규 방문자 랜딩 페이지" icon={<Eye className="w-4 h-4" />} className="bg-[hsl(40,30%,96%)]">
            {newVisitorData.topLandingPages.length === 0 ? <Empty msg="신규 방문자 데이터 수집 중..." /> : newVisitorData.topLandingPages.map(([p, c], i) => <BarRow key={p} rank={i+1} label={p} value={c} max={newVisitorData.topLandingPages[0][1]} color="hsl(37, 90%, 51%)" />)}
          </ChartCard>
          <ChartCard title="신규 방문자 유입 경로" icon={<ArrowUpRight className="w-4 h-4" />} className="bg-[hsl(150,20%,96%)]">
            {newVisitorData.topReferrers.length === 0 ? <Empty /> : newVisitorData.topReferrers.map(([r, c], i) => <BarRow key={r} rank={i+1} label={r} value={c} max={newVisitorData.topReferrers[0][1]} color="hsl(152, 57%, 42%)" />)}
          </ChartCard>
          <ChartCard title="신규 방문자 지역" icon={<MapPin className="w-4 h-4" />} className="bg-[hsl(340,20%,96%)]">
            {newVisitorData.topLocations.length === 0 ? <Empty msg="위치 데이터 수집 중..." /> : newVisitorData.topLocations.map(([l, c], i) => <BarRow key={l} rank={i+1} label={l} value={c} max={newVisitorData.topLocations[0][1]} color="hsl(340, 65%, 55%)" />)}
          </ChartCard>
          <ChartCard title="신규 방문자 디바이스 · 브라우저" icon={<Smartphone className="w-4 h-4" />} className="bg-[hsl(260,20%,96%)]">
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
    </div>
  );
}

function HelpTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative inline-flex" ref={ref}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 text-muted-foreground bg-[hsl(220,14%,93%)] border border-[hsl(220,13%,91%)] hover:opacity-80 transition-all"
      >?</button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[220px] rounded-xl p-3 text-[11px] leading-relaxed shadow-lg animate-in fade-in zoom-in-95 duration-150 bg-white border border-[hsl(220,13%,91%)] text-foreground">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 rotate-45 bg-white border-r border-b border-[hsl(220,13%,91%)]" />
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, color, sub, tooltip }: {
  icon: React.ReactNode; label: string; value: number | string; color: string; sub?: string; tooltip?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] px-4 py-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}12`, color }}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="text-[20px] font-bold tracking-[-0.04em] text-foreground leading-none tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        </div>
        {sub && <p className="text-[11px] text-muted-foreground/50 mt-0.5">{sub}</p>}
      </div>
      {tooltip && <HelpTooltip text={tooltip} />}
    </div>
  );
}

function ChartCard({ title, icon, children, maxItems = 10, className }: { title: string; icon: React.ReactNode; children: React.ReactNode; maxItems?: number; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const childArray = React.Children.toArray(children);
  const hasMore = childArray.length > maxItems;
  const visibleChildren = expanded ? childArray : childArray.slice(0, maxItems);
  return (
    <div className={`rounded-2xl border border-[hsl(220,13%,91%)] p-4 ${className || "bg-white"}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[13px] font-semibold text-foreground flex-1">{title}</h4>
      </div>
      <div className="flex flex-col gap-2.5">{visibleChildren}</div>
      {hasMore && (
        <button onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 pt-3 flex items-center justify-center gap-1 text-[12px] font-medium text-[hsl(221,83%,53%)] border-t border-[hsl(220,13%,95%)] hover:opacity-70 transition-all"
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
    <div className="flex flex-col gap-3">
      <button className="flex items-center gap-2 w-full text-left px-1" onClick={() => setCollapsed(!collapsed)}>
        {number !== undefined && (
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0 bg-[hsl(221,83%,53%,0.08)] text-[hsl(221,83%,53%)]">{number}</span>
        )}
        <h3 className="text-[15px] font-bold text-foreground tracking-[-0.02em] flex-1">{title}</h3>
        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }} />
      </button>
      {!collapsed && children}
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)]">
      <button className="flex items-center gap-2 w-full text-left p-5" onClick={() => setCollapsed(!collapsed)} style={{ paddingBottom: collapsed ? undefined : "0" }}>
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[13px] font-semibold text-foreground flex-1">{title}</h4>
        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }} />
      </button>
      {!collapsed && <div className="px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
}

function BarRow({ rank, label, value, max, color, suffix }: { rank: number; label: string; value: number; max: number; color: string; suffix?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] w-5 text-center text-muted-foreground/40 font-semibold tabular-nums">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-medium text-foreground truncate">{label}</span>
          <span className="text-[12px] font-semibold text-foreground shrink-0 ml-2 tabular-nums">{value}{suffix || ""}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden bg-[hsl(220,14%,95%)]">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

function Empty({ msg }: { msg?: string } = {}) {
  return <p className="text-[12px] text-muted-foreground/40 text-center py-6 font-medium">{msg || "데이터가 없습니다"}</p>;
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
      <span className="text-[11px] w-5 text-center text-muted-foreground/40 font-semibold tabular-nums">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-medium text-foreground truncate">{label}</span>
          <span className="text-[12px] font-semibold text-foreground shrink-0 ml-2 tabular-nums">{formatDuration(avgSeconds)}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden bg-[hsl(199,89%,48%,0.08)]">
          <div className="h-full rounded-full transition-all duration-500 bg-[hsl(199,89%,48%)]" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-muted-foreground/40 mt-0.5 font-medium">{count}회 방문</span>
      </div>
    </div>
  );
}
