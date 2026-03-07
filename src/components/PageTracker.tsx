import { useEffect, useRef, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// ─── Constants ───
const SCROLL_DEPTH_KEY = "_scroll_depth";
const FIRST_VISIT_KEY = "_wh_visited";
const SESSION_LAST_ACTIVE_KEY = "_wh_last_active";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes (GA4 style)
const VISITOR_ID_KEY = "_wh_vid";
const VISITOR_VISIT_COUNT_KEY = "_wh_vc";
const VISITOR_LAST_VISIT_KEY = "_wh_lv";

// ─── 1. Session management with 30-min inactivity timeout ───
function getSessionId(): string {
  const now = Date.now();
  const lastActive = parseInt(sessionStorage.getItem(SESSION_LAST_ACTIVE_KEY) || "0", 10);
  let id = sessionStorage.getItem("_sid");

  // Session expired after 30min inactivity → new session
  if (id && lastActive > 0 && (now - lastActive) > SESSION_TIMEOUT_MS) {
    id = null; // force new session
  }

  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("_sid", id);
    // Increment visit count for returning visitor tracking
    const count = parseInt(localStorage.getItem(VISITOR_VISIT_COUNT_KEY) || "0", 10);
    localStorage.setItem(VISITOR_VISIT_COUNT_KEY, String(count + 1));
    localStorage.setItem(VISITOR_LAST_VISIT_KEY, String(now));
  }

  sessionStorage.setItem(SESSION_LAST_ACTIVE_KEY, String(now));
  return id;
}

function touchSession() {
  sessionStorage.setItem(SESSION_LAST_ACTIVE_KEY, String(Date.now()));
}

// ─── 3. Visitor ID for cross-session identification (no fingerprinting) ───
function getVisitorId(): string {
  let vid = localStorage.getItem(VISITOR_ID_KEY);
  if (!vid) {
    vid = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, vid);
  }
  return vid;
}

function getVisitCount(): number {
  return parseInt(localStorage.getItem(VISITOR_VISIT_COUNT_KEY) || "1", 10);
}

function isFirstVisit(): boolean {
  const visited = localStorage.getItem(FIRST_VISIT_KEY);
  if (!visited) {
    localStorage.setItem(FIRST_VISIT_KEY, "1");
    return true;
  }
  return false;
}

// ─── UTM tracking ───
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const UTM_STORAGE_PREFIX = "_wh_utm_";

function captureAndGetUTMParams(): Record<string, string | null> {
  const params = new URLSearchParams(window.location.search);
  const hasUtm = UTM_KEYS.some(k => params.has(k));
  if (hasUtm) {
    for (const key of UTM_KEYS) {
      const val = params.get(key);
      if (val) sessionStorage.setItem(UTM_STORAGE_PREFIX + key, val);
      else sessionStorage.removeItem(UTM_STORAGE_PREFIX + key);
    }
  }
  const result: Record<string, string | null> = {};
  for (const key of UTM_KEYS) {
    result[key] = sessionStorage.getItem(UTM_STORAGE_PREFIX + key) || null;
  }
  return result;
}

// ─── UA parsing ───
function parseUA(ua: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let deviceType = "desktop";

  if (ua.includes("Firefox/") || ua.includes("FxiOS/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("CriOS/")) browser = "Chrome";
  else if (ua.includes("Chrome/") && ua.includes("Safari/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("MSIE") || ua.includes("Trident/")) browser = "IE";
  else if (ua.includes("Mobile/") && ua.includes("AppleWebKit")) browser = "Safari (In-App)";

  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  if (/Mobi|Android|iPhone/i.test(ua)) deviceType = "mobile";
  else if (/iPad|Tablet/i.test(ua)) deviceType = "tablet";

  return { browser, os, deviceType };
}

// ─── 5. Active dwell time tracking (excludes tab-hidden time) ───
let activeStartTime = Date.now();
let accumulatedActiveTime = 0;
let isTabActive = true;
let durationSentForPath: string | null = null;

function onVisibilityChange() {
  if (document.visibilityState === "hidden") {
    if (isTabActive) {
      accumulatedActiveTime += Date.now() - activeStartTime;
      isTabActive = false;
    }
  } else {
    activeStartTime = Date.now();
    isTabActive = true;
    // Also touch session on tab re-focus
    touchSession();
  }
}

function getActiveDuration(): number {
  let total = accumulatedActiveTime;
  if (isTabActive) {
    total += Date.now() - activeStartTime;
  }
  return total / 1000; // seconds
}

function resetActiveTimer() {
  activeStartTime = Date.now();
  accumulatedActiveTime = 0;
  isTabActive = !document.hidden;
  durationSentForPath = null;
}

function sendDuration(pagePath: string) {
  const duration = getActiveDuration();
  if (duration < 1) return;
  // Prevent duplicate sends for the same page navigation
  if (durationSentForPath === pagePath) return;
  durationSentForPath = pagePath;

  const sessionId = getSessionId();
  const scrollDepth = parseInt(sessionStorage.getItem(SCROLL_DEPTH_KEY) || "0", 10);

  const body = {
    session_id: sessionId,
    page_path: pagePath,
    duration_seconds: duration,
    scroll_depth: scrollDepth > 0 ? scrollDepth : null,
  };

  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-page-duration`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    };
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Silent fail
  }

  sessionStorage.setItem(SCROLL_DEPTH_KEY, "0");
}

// ─── Component ───
export default function PageTracker() {
  const location = useLocation();
  const lastPath = useRef<string>("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is an authenticated admin — skip all tracking if so
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" });
        setIsAdmin(!!data);
      }
    };
    checkAdmin();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data } = await supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" });
        setIsAdmin(!!data);
      } else {
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Global visibility listener (active dwell time)
  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // Keep session alive on user activity
  useEffect(() => {
    const onActivity = () => touchSession();
    const events = ["mousemove", "keydown", "touchstart", "click", "scroll"] as const;
    events.forEach(e => window.addEventListener(e, onActivity, { passive: true }));
    return () => { events.forEach(e => window.removeEventListener(e, onActivity)); };
  }, []);

  // Scroll depth tracking
  useEffect(() => {
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);
      if (pct > maxScroll) {
        maxScroll = pct;
        sessionStorage.setItem(SCROLL_DEPTH_KEY, String(maxScroll));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // ─── 4. CTA click tracking with session context ───
  const trackClick = useCallback((e: MouseEvent) => {
    if (isAdmin) return;
    const target = e.target as HTMLElement;
    const btn = target.closest("a[href], button") as HTMLElement | null;
    if (!btn) return;

    const text = (btn.textContent || "").trim();
    const href = btn.getAttribute("href") || "";
    const id = btn.getAttribute("id") || btn.getAttribute("data-track") || "";

    const isCTA =
      /상담|문의|데모|신청|체험|견적|연락|시작|contact|demo|trial|pricing/i.test(text + href + id) ||
      btn.hasAttribute("data-track");

    if (!isCTA) return;

    const ua = navigator.userAgent;
    const { browser, deviceType } = parseUA(ua);

    supabase.functions.invoke("track-click-event", {
      body: {
        session_id: getSessionId(),
        page_path: window.location.pathname,
        element_type: btn.tagName.toLowerCase(),
        element_text: text.slice(0, 100),
        element_id: id || null,
        device_type: deviceType,
        browser,
        visitor_id: getVisitorId(),
      },
    }).catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    document.addEventListener("click", trackClick, true);
    return () => document.removeEventListener("click", trackClick, true);
  }, [trackClick]);

  // ─── Page view tracking ───
  useEffect(() => {
    if (isAdmin) return;
    const path = location.pathname + location.hash;
    if (path === lastPath.current) return;

    // Send active duration for previous page
    if (lastPath.current) {
      sendDuration(lastPath.current.split("#")[0]);
    }

    lastPath.current = path;
    resetActiveTimer();
    sessionStorage.setItem(SCROLL_DEPTH_KEY, "0");

    const ua = navigator.userAgent;
    const { browser, os, deviceType } = parseUA(ua);
    const utmParams = captureAndGetUTMParams();

    supabase.functions.invoke("track-page-view", {
      body: {
        page_path: location.pathname,
        referrer: document.referrer || null,
        user_agent: ua,
        device_type: deviceType,
        browser,
        os,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        language: navigator.language,
        session_id: getSessionId(),
        is_first_visit: isFirstVisit(),
        visitor_id: getVisitorId(),
        visit_count: getVisitCount(),
        ...utmParams,
      },
    }).then(({ error }) => {
      if (error) console.error("Tracking error:", error);
    });
  }, [location.pathname, location.hash, isAdmin]);

  // Send duration on tab close (once, no duplicate)
  useEffect(() => {
    if (isAdmin) return;
    const handleUnload = () => {
      if (lastPath.current) {
        sendDuration(lastPath.current.split("#")[0]);
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return null;
}
