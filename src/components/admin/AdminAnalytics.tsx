import { useState, useMemo } from "react";
import { dedupeLocation } from "@/lib/utils";
import {
  Eye, Globe, Smartphone, Clock, MousePointerClick, Users, Link2, LogOut, TrendingUp, RefreshCw
} from "lucide-react";
import { SectionGroup, MetricCard, formatDuration } from "./analytics/AnalyticsShared";
import AnalyticsVisitorTypes from "./analytics/AnalyticsVisitorTypes";
import AnalyticsTrend from "./analytics/AnalyticsTrend";
import AnalyticsDetail from "./analytics/AnalyticsDetail";
import AnalyticsConversion from "./analytics/AnalyticsConversion";
import AnalyticsExit from "./analytics/AnalyticsExit";
import AnalyticsMarketing from "./analytics/AnalyticsMarketing";
import AnalyticsBounce from "./analytics/AnalyticsBounce";
import AnalyticsContent from "./analytics/AnalyticsContent";
import AnalyticsNewVisitors from "./analytics/AnalyticsNewVisitors";

interface AdminAnalyticsProps {
  pageViews: any[];
  inquiries: any[];
  clickEvents: any[];
  onRefresh: (days: number) => void;
}

export default function AdminAnalytics({ pageViews, inquiries, clickEvents, onRefresh }: AdminAnalyticsProps) {
  const [dateRange, setDateRange] = useState(0);

  // ─── Filtered data ───
  const filteredViews = useMemo(() => {
    const since = new Date();
    if (dateRange === 0) since.setHours(0, 0, 0, 0);
    else since.setDate(since.getDate() - dateRange);
    return pageViews.filter((v) => new Date(v.created_at) >= since);
  }, [pageViews, dateRange]);

  const humanViews = useMemo(() => filteredViews.filter((v) => (v.visitor_type || "human") === "human"), [filteredViews]);

  const filteredClicks = useMemo(() => {
    const since = new Date();
    if (dateRange === 0) since.setHours(0, 0, 0, 0);
    else since.setDate(since.getDate() - dateRange);
    return clickEvents.filter((v) => new Date(v.created_at) >= since && (v.visitor_type || "human") === "human");
  }, [clickEvents, dateRange]);

  // ─── Key metrics ───
  const totalViews = humanViews.length;
  const uniqueSessions = new Set(humanViews.map((v) => v.session_id)).size;

  const bounceRate = useMemo(() => {
    const sessionPageCounts: Record<string, number> = {};
    humanViews.forEach((v) => { if (v.session_id) sessionPageCounts[v.session_id] = (sessionPageCounts[v.session_id] || 0) + 1; });
    const sessions = Object.values(sessionPageCounts);
    if (sessions.length === 0) return 0;
    return Math.round((sessions.filter((c) => c === 1).length / sessions.length) * 100);
  }, [humanViews]);

  const bounceByPage = useMemo(() => {
    const sessionData: Record<string, { landing: string; pageCount: number; firstTime: string }> = {};
    humanViews.forEach((v) => {
      if (!v.session_id) return;
      if (!sessionData[v.session_id]) sessionData[v.session_id] = { landing: v.page_path, pageCount: 0, firstTime: v.created_at };
      sessionData[v.session_id].pageCount++;
      if (v.created_at < sessionData[v.session_id].firstTime) { sessionData[v.session_id].landing = v.page_path; sessionData[v.session_id].firstTime = v.created_at; }
    });
    const pageStats: Record<string, { total: number; bounced: number }> = {};
    Object.values(sessionData).forEach((s) => {
      if (!pageStats[s.landing]) pageStats[s.landing] = { total: 0, bounced: 0 };
      pageStats[s.landing].total++;
      if (s.pageCount === 1) pageStats[s.landing].bounced++;
    });
    return Object.entries(pageStats)
      .map(([path, d]) => ({ path, rate: d.total > 0 ? Math.round((d.bounced / d.total) * 100) : 0, total: d.total, bounced: d.bounced }))
      .filter((d) => d.total >= 2)
      .sort((a, b) => b.rate - a.rate);
  }, [humanViews]);

  const visitorFrequency = useMemo(() => {
    const vidSessions: Record<string, Set<string>> = {};
    humanViews.forEach((v) => {
      const vid = (v as any).visitor_id;
      if (!vid || !v.session_id) return;
      if (!vidSessions[vid]) vidSessions[vid] = new Set();
      vidSessions[vid].add(v.session_id);
    });
    const freq: Record<string, number> = { "1회": 0, "2회": 0, "3~5회": 0, "6~10회": 0, "11회+": 0 };
    Object.values(vidSessions).forEach((sessions) => {
      const c = sessions.size;
      if (c === 1) freq["1회"]++; else if (c === 2) freq["2회"]++; else if (c <= 5) freq["3~5회"]++; else if (c <= 10) freq["6~10회"]++; else freq["11회+"]++;
    });
    return { freq: Object.entries(freq).filter(([, v]) => v > 0) as [string, number][], totalVisitors: Object.values(vidSessions).length };
  }, [humanViews]);

  const ctaAttribution = useMemo(() => {
    const sessionPages: Record<string, { path: string; time: string }[]> = {};
    humanViews.forEach((v) => { if (!v.session_id) return; if (!sessionPages[v.session_id]) sessionPages[v.session_id] = []; sessionPages[v.session_id].push({ path: v.page_path, time: v.created_at }); });
    const ctaSessionPages: Record<string, string> = {};
    filteredClicks.forEach((c) => { if (c.session_id) ctaSessionPages[c.session_id] = c.page_path; });
    const inquirySessionIds = new Set(inquiries.filter((i: any) => i.session_id).map((i: any) => i.session_id));
    const flowCounts: Record<string, { total: number; converted: number }> = {};
    Object.entries(ctaSessionPages).forEach(([sid, ctaPage]) => {
      const pages = sessionPages[sid];
      if (!pages) return;
      const sorted = [...pages].sort((a, b) => a.time.localeCompare(b.time));
      const uniquePages = [...new Set(sorted.map((p) => p.path))];
      const flow = uniquePages.length <= 3 ? uniquePages.join(" → ") + " → [CTA]" : `${uniquePages[0]} → ... → ${ctaPage} → [CTA]`;
      if (!flowCounts[flow]) flowCounts[flow] = { total: 0, converted: 0 };
      flowCounts[flow].total++;
      if (inquirySessionIds.has(sid)) flowCounts[flow].converted++;
    });
    return Object.entries(flowCounts).map(([flow, d]) => ({ flow, ...d })).sort((a, b) => b.total - a.total);
  }, [humanViews, filteredClicks, inquiries]);

  // ─── Visitor type counts ───
  const visitorTypeCounts = useMemo(() => {
    const aiNames: Record<string, string> = { ai_openai: "OpenAI (GPTBot)", ai_anthropic: "Anthropic (Claude)", ai_bytedance: "ByteDance", ai_commoncrawl: "Common Crawl", ai_cohere: "Cohere", ai_perplexity: "Perplexity", ai_you: "You.com", ai_google: "Google AI", ai_meta: "Meta AI", ai_amazon: "Amazon", ai_ai2: "AI2 (Allen)" };
    const searchNames: Record<string, string> = { search_bot_google: "Google", search_bot_bing: "Bing", search_bot_yandex: "Yandex", search_bot_baidu: "Baidu", search_bot_duckduckgo: "DuckDuckGo", search_bot_yahoo: "Yahoo", search_bot_naver: "Naver", search_bot_apple: "Apple", search_bot_sogou: "Sogou", search_bot_facebook: "Facebook", search_bot_twitter: "Twitter/X", search_bot_linkedin: "LinkedIn", search_bot_pinterest: "Pinterest", search_bot_seznam: "Seznam", search_bot_msn: "MSN" };
    const scraperNames: Record<string, string> = { scraper_seo_semrush: "SEMrush", scraper_seo_ahrefs: "Ahrefs", scraper_seo_moz: "Moz", scraper_seo_serpstat: "Serpstat", scraper_seo_dataforseo: "DataForSEO", scraper_seo_screamingfrog: "Screaming Frog", scraper_seo_sitebulb: "Sitebulb", scraper_seo_majestic: "Majestic", scraper_seo_megaindex: "MegaIndex", scraper_archive: "Internet Archive", scraper_other_petalbot: "PetalBot (Huawei)", scraper_other_blexbot: "BLEXBot", scraper_other_rogerbot: "RogerBot", scraper_other_exabot: "Exabot", scraper_cf: "CF 프록시", scraper_repeated: "반복접속", scraper_unknown: "기타 스크래퍼" };
    let human = 0, searchBot = 0, scraper = 0, ai = 0;
    const scraperSubCounts: Record<string, number> = {};
    const searchBotSubCounts: Record<string, number> = {};
    const aiBotSubCounts: Record<string, number> = {};
    const aiBotPageMap: Record<string, Record<string, number>> = {};
    const searchBotPageMap: Record<string, Record<string, number>> = {};
    filteredViews.forEach((v) => {
      const type = v.visitor_type || "human";
      if (type.startsWith("ai")) { ai++; const name = aiNames[type] || "기타"; aiBotSubCounts[name] = (aiBotSubCounts[name] || 0) + 1; if (!aiBotPageMap[name]) aiBotPageMap[name] = {}; aiBotPageMap[name][v.page_path] = (aiBotPageMap[name][v.page_path] || 0) + 1; }
      else if (type.startsWith("search_bot")) { searchBot++; const name = searchNames[type] || "기타"; searchBotSubCounts[name] = (searchBotSubCounts[name] || 0) + 1; if (!searchBotPageMap[name]) searchBotPageMap[name] = {}; searchBotPageMap[name][v.page_path] = (searchBotPageMap[name][v.page_path] || 0) + 1; }
      else if (type.startsWith("scraper")) { scraper++; const name = scraperNames[type] || "기타 스크래퍼"; scraperSubCounts[name] = (scraperSubCounts[name] || 0) + 1; }
      else { human++; }
    });
    const scraperSubs = Object.entries(scraperSubCounts).sort(([, a], [, b]) => b - a) as [string, number][];
    const searchBotSubs = Object.entries(searchBotSubCounts).sort(([, a], [, b]) => b - a) as [string, number][];
    const aiBotSubs = Object.entries(aiBotSubCounts).sort(([, a], [, b]) => b - a) as [string, number][];
    const aiBotPages = Object.entries(aiBotPageMap).map(([bot, pages]) => ({ bot, pages: Object.entries(pages).sort(([, a], [, b]) => b - a) as [string, number][] })).sort((a, b) => b.pages.reduce((s, [, c]) => s + c, 0) - a.pages.reduce((s, [, c]) => s + c, 0));
    const searchBotPages = Object.entries(searchBotPageMap).map(([bot, pages]) => ({ bot, pages: Object.entries(pages).sort(([, a], [, b]) => b - a) as [string, number][] })).sort((a, b) => b.pages.reduce((s, [, c]) => s + c, 0) - a.pages.reduce((s, [, c]) => s + c, 0));
    return { human, searchBot, scraper, ai, total: human + searchBot + scraper + ai, scraperSubs, searchBotSubs, aiBotSubs, aiBotPages, searchBotPages };
  }, [filteredViews]);

  // ─── Page/visitor data ───
  const deviceCounts = humanViews.reduce((acc, v) => { acc[v.device_type || "unknown"] = (acc[v.device_type || "unknown"] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topPages = useMemo(() => { const acc: Record<string, number> = {}; humanViews.forEach((v) => { acc[v.page_path] = (acc[v.page_path] || 0) + 1; }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [humanViews]);
  const topBrowsers = useMemo(() => { const acc: Record<string, number> = {}; humanViews.forEach((v) => { acc[v.browser || "Unknown"] = (acc[v.browser || "Unknown"] || 0) + 1; }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [humanViews]);
  const topOS = useMemo(() => { const acc: Record<string, number> = {}; humanViews.forEach((v) => { acc[v.os || "Unknown"] = (acc[v.os || "Unknown"] || 0) + 1; }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [humanViews]);
  const topReferrers = useMemo(() => { const acc: Record<string, number> = {}; humanViews.forEach((v) => { try { const ref = v.referrer ? new URL(v.referrer).hostname : "직접 방문"; acc[ref] = (acc[ref] || 0) + 1; } catch { acc["기타"] = (acc["기타"] || 0) + 1; } }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [humanViews]);

  const maskIp = (ip: string) => { if (ip === "알 수 없음") return ip; const parts = ip.split("."); if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.***`; return ip.replace(/:[\da-f]{1,4}$/i, ":***"); };

  const ipWithLocation = useMemo(() => {
    const ipMap: Record<string, { count: number; city: string | null; country: string | null; lastVisit: string | null }> = {};
    humanViews.forEach((v) => { const ip = v.ip_address || "알 수 없음"; if (!ipMap[ip]) ipMap[ip] = { count: 0, city: null, country: null, lastVisit: null }; ipMap[ip].count++; if (v.city) ipMap[ip].city = v.city; if (v.country) ipMap[ip].country = v.country; if (!ipMap[ip].lastVisit || v.created_at > ipMap[ip].lastVisit!) ipMap[ip].lastVisit = v.created_at; });
    return Object.entries(ipMap).map(([ip, d]) => ({ ip: maskIp(ip), count: d.count, location: dedupeLocation(d.city || d.country || null), lastVisit: d.lastVisit })).sort((a, b) => b.count - a.count);
  }, [humanViews]);

  const topLocations = useMemo(() => { const acc: Record<string, number> = {}; humanViews.forEach((v) => { const loc = dedupeLocation(v.city || v.country) || "알 수 없음"; acc[loc] = (acc[loc] || 0) + 1; }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [humanViews]);

  // ─── Dwell / scroll ───
  const pageDwellTimes = useMemo(() => { const acc: Record<string, { total: number; count: number }> = {}; humanViews.forEach((v) => { if (v.duration_seconds && v.duration_seconds > 0) { if (!acc[v.page_path]) acc[v.page_path] = { total: 0, count: 0 }; acc[v.page_path].total += v.duration_seconds; acc[v.page_path].count++; } }); return Object.entries(acc).map(([path, d]) => ({ path, avg: Math.round(d.total / d.count), count: d.count })).sort((a, b) => b.avg - a.avg); }, [humanViews]);
  const overallAvgDwell = useMemo(() => { const w = humanViews.filter((v) => v.duration_seconds && v.duration_seconds > 0); if (w.length === 0) return 0; return Math.round(w.reduce((s, v) => s + v.duration_seconds, 0) / w.length); }, [humanViews]);
  const scrollDepthStats = useMemo(() => { const acc: Record<string, { total: number; count: number }> = {}; humanViews.forEach((v) => { if (typeof v.scroll_depth === "number" && v.scroll_depth > 0) { if (!acc[v.page_path]) acc[v.page_path] = { total: 0, count: 0 }; acc[v.page_path].total += v.scroll_depth; acc[v.page_path].count++; } }); return Object.entries(acc).map(([path, d]) => ({ path, avg: Math.round(d.total / d.count), count: d.count })).sort((a, b) => b.avg - a.avg); }, [humanViews]);

  // ─── Trend data ───
  const toLocalDateKey = (date: Date) => { const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0'); return `${y}-${m}-${d}`; };
  const isToday = dateRange === 0;

  const dailyData = useMemo(() => {
    if (isToday) {
      const hours: Record<number, { views: number; sessions: Set<string> }> = {};
      for (let h = 0; h < 24; h++) hours[h] = { views: 0, sessions: new Set() };
      humanViews.forEach((v) => { const h = new Date(v.created_at).getHours(); hours[h].views++; if (v.session_id) hours[h].sessions.add(v.session_id); });
      return Object.entries(hours).map(([h, d]) => ({ date: h, label: `${String(h).padStart(2, "0")}시`, views: d.views, sessions: d.sessions.size }));
    }
    const days: Record<string, { views: number; sessions: Set<string> }> = {};
    const today = new Date();
    for (let i = dateRange - 1; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate() - i); days[toLocalDateKey(d)] = { views: 0, sessions: new Set() }; }
    humanViews.forEach((v) => { const key = toLocalDateKey(new Date(v.created_at)); if (days[key]) { days[key].views++; if (v.session_id) days[key].sessions.add(v.session_id); } });
    return Object.entries(days).map(([date, d]) => ({ date, label: new Date(date).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }), views: d.views, sessions: d.sessions.size }));
  }, [humanViews, dateRange, isToday]);

  // ─── Inquiries / conversion ───
  const filteredInquiries = useMemo(() => { const since = new Date(); if (dateRange === 0) since.setHours(0, 0, 0, 0); else since.setDate(since.getDate() - dateRange); return inquiries.filter((i) => new Date(i.created_at) >= since); }, [inquiries, dateRange]);
  const conversionRate = uniqueSessions > 0 ? ((filteredInquiries.length / uniqueSessions) * 100).toFixed(1) : "0.0";
  const visitStats = useMemo(() => { const first = humanViews.filter((v) => v.is_first_visit === true).length; return { first, returning: humanViews.length - first }; }, [humanViews]);

  // ─── UTM / CTA ───
  const utmSourceCounts = useMemo(() => { const acc: Record<string, number> = {}; humanViews.forEach((v) => { if (v.utm_source) acc[v.utm_source] = (acc[v.utm_source] || 0) + 1; }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [humanViews]);
  const utmCampaignCounts = useMemo(() => { const acc: Record<string, number> = {}; humanViews.forEach((v) => { if (v.utm_campaign) acc[v.utm_campaign] = (acc[v.utm_campaign] || 0) + 1; }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [humanViews]);
  const ctaClickCounts = useMemo(() => { const acc: Record<string, number> = {}; filteredClicks.forEach((c) => { const label = c.element_text || c.element_id || "Unknown"; acc[label] = (acc[label] || 0) + 1; }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [filteredClicks]);
  const ctaByPage = useMemo(() => { const acc: Record<string, number> = {}; filteredClicks.forEach((c) => { acc[c.page_path] = (acc[c.page_path] || 0) + 1; }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [filteredClicks]);

  // ─── Funnel / heatmap ───
  const funnelData = useMemo(() => {
    const sessions = new Set(humanViews.map((v) => v.session_id).filter(Boolean));
    const landingSessions = new Set<string>(); const serviceSessions = new Set<string>();
    const servicePages = ["/lms", "/hosting", "/drm", "/content", "/chatbot", "/channel", "/maintenance", "/app", "/pg"];
    humanViews.forEach((v) => { if (!v.session_id) return; if (v.page_path === "/") landingSessions.add(v.session_id); if (servicePages.some((p) => v.page_path.startsWith(p))) serviceSessions.add(v.session_id); });
    const ctaSessions = new Set(filteredClicks.filter((c) => c.session_id).map((c) => c.session_id!));
    return [{ label: "전체 방문", count: sessions.size }, { label: "랜딩 페이지", count: landingSessions.size }, { label: "서비스 페이지", count: serviceSessions.size }, { label: "CTA 클릭", count: ctaSessions.size }, { label: "문의 제출", count: filteredInquiries.length }];
  }, [humanViews, filteredInquiries, filteredClicks]);

  const hourlyData = useMemo(() => { const dayNames = ["일", "월", "화", "수", "목", "금", "토"]; const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0)); humanViews.forEach((v) => { const d = new Date(v.created_at); grid[d.getDay()][d.getHours()]++; }); return { grid, dayNames }; }, [humanViews]);
  const maxHourly = useMemo(() => Math.max(...hourlyData.grid.flat(), 1), [hourlyData]);

  // ─── Exit / flow ───
  const exitPages = useMemo(() => { const sp: Record<string, { path: string; time: string }> = {}; humanViews.forEach((v) => { if (!v.session_id) return; if (!sp[v.session_id] || v.created_at > sp[v.session_id].time) sp[v.session_id] = { path: v.page_path, time: v.created_at }; }); const acc: Record<string, number> = {}; Object.values(sp).forEach((s) => { acc[s.path] = (acc[s.path] || 0) + 1; }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [humanViews]);
  const pageFlows = useMemo(() => { const sv: Record<string, { path: string; time: string }[]> = {}; humanViews.forEach((v) => { if (!v.session_id) return; if (!sv[v.session_id]) sv[v.session_id] = []; sv[v.session_id].push({ path: v.page_path, time: v.created_at }); }); const flows: Record<string, number> = {}; Object.values(sv).forEach((views) => { views.sort((a, b) => a.time.localeCompare(b.time)); for (let i = 0; i < views.length - 1; i++) { if (views[i].path !== views[i + 1].path) { const key = `${views[i].path} → ${views[i + 1].path}`; flows[key] = (flows[key] || 0) + 1; } } }); return Object.entries(flows).sort(([, a], [, b]) => b - a) as [string, number][]; }, [humanViews]);
  const resolutionCounts = useMemo(() => { const acc: Record<string, number> = {}; humanViews.forEach((v) => { if (v.screen_width && v.screen_height) { const res = `${v.screen_width}×${v.screen_height}`; acc[res] = (acc[res] || 0) + 1; } }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [humanViews]);
  const languageCounts = useMemo(() => { const acc: Record<string, number> = {}; humanViews.forEach((v) => { const lang = v.language || "Unknown"; acc[lang] = (acc[lang] || 0) + 1; }); return Object.entries(acc).sort(([, a], [, b]) => b - a) as [string, number][]; }, [humanViews]);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground">접속 분석</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">{isToday ? "오늘" : `최근 ${dateRange}일`}의 방문 데이터</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 p-1 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
            {[{ value: 0, label: "오늘" }, { value: 7, label: "7일" }, { value: 14, label: "14일" }, { value: 30, label: "30일" }].map((d) => (
              <button key={d.value} onClick={() => setDateRange(d.value)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap"
                style={{ color: dateRange === d.value ? "white" : "hsl(220, 9%, 46%)", background: dateRange === d.value ? "hsl(221, 83%, 53%)" : "transparent" }}
              >{d.label}</button>
            ))}
          </div>
          <button onClick={() => onRefresh(Math.max(dateRange, 1))}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[hsl(220,13%,91%)] text-muted-foreground hover:bg-[hsl(220,14%,96%)] transition-colors active:animate-spin"
          ><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* 1. Key Metrics */}
      <SectionGroup title="주요 지표 요약" number={1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard icon={<Eye className="w-[18px] h-[18px]" />} label="페이지뷰" value={totalViews} color="hsl(221, 83%, 53%)" tooltip="선택한 기간 동안 사이트의 모든 페이지가 조회된 총 횟수입니다." />
          <MetricCard icon={<Globe className="w-[18px] h-[18px]" />} label="고유 세션" value={uniqueSessions} color="hsl(152, 57%, 42%)" tooltip="고유 세션 수입니다." />
          <MetricCard icon={<Clock className="w-[18px] h-[18px]" />} label="평균 체류" value={formatDuration(overallAvgDwell)} color="hsl(199, 89%, 48%)" tooltip="한 페이지에 머문 평균 시간입니다." />
          <MetricCard icon={<MousePointerClick className="w-[18px] h-[18px]" />} label="CTA 클릭" value={filteredClicks.length} color="hsl(340, 65%, 55%)" tooltip="CTA 버튼 클릭 총 횟수입니다." />
          <MetricCard icon={<Users className="w-[18px] h-[18px]" />} label="신규 방문" value={visitStats.first} color="hsl(37, 90%, 51%)" sub={`재방문 ${visitStats.returning}`} tooltip="신규 방문자 수입니다." />
          <MetricCard icon={<Smartphone className="w-[18px] h-[18px]" />} label="모바일" value={deviceCounts.mobile || 0} color="hsl(262, 60%, 55%)" tooltip="모바일 접속 수입니다." />
          <MetricCard icon={<TrendingUp className="w-[18px] h-[18px]" />} label="전환율" value={`${conversionRate}%`} color="hsl(0, 84%, 60%)" sub={`문의 ${filteredInquiries.length}건`} tooltip="방문 대비 문의 전환율입니다." />
          <MetricCard icon={<LogOut className="w-[18px] h-[18px]" />} label="이탈률" value={`${bounceRate}%`} color="hsl(25, 95%, 53%)" tooltip="1개 페이지만 보고 떠난 세션의 비율입니다." />
          <MetricCard icon={<Link2 className="w-[18px] h-[18px]" />} label="UTM 유입" value={utmSourceCounts.reduce((s, [, c]) => s + c, 0)} color="hsl(170, 70%, 40%)" tooltip="UTM 파라미터 유입 수입니다." />
        </div>
      </SectionGroup>

      {/* 2. Visitor Types */}
      <AnalyticsVisitorTypes visitorTypeCounts={visitorTypeCounts} />

      {/* 3. Trend */}
      <AnalyticsTrend isToday={isToday} dailyData={dailyData} />

      {/* 4. Detail */}
      <AnalyticsDetail topPages={topPages} topLocations={topLocations} ipWithLocation={ipWithLocation} topReferrers={topReferrers} topBrowsers={topBrowsers} topOS={topOS} />

      {/* 5. Conversion */}
      <AnalyticsConversion funnelData={funnelData} hourlyData={hourlyData} maxHourly={maxHourly} dateRange={dateRange} />

      {/* 6. Exit */}
      <AnalyticsExit exitPages={exitPages} pageFlows={pageFlows} resolutionCounts={resolutionCounts} languageCounts={languageCounts} />

      {/* 7. Marketing */}
      <AnalyticsMarketing utmSourceCounts={utmSourceCounts} utmCampaignCounts={utmCampaignCounts} ctaClickCounts={ctaClickCounts} ctaByPage={ctaByPage} ctaAttribution={ctaAttribution} />

      {/* 8. Bounce / Revisit */}
      <AnalyticsBounce bounceByPage={bounceByPage} visitorFrequency={visitorFrequency} />

      {/* 9. Content */}
      <AnalyticsContent scrollDepthStats={scrollDepthStats} pageDwellTimes={pageDwellTimes} />

      {/* 10. New Visitors */}
      <AnalyticsNewVisitors pageViews={pageViews} toLocalDateKey={toLocalDateKey} />
    </div>
  );
}
