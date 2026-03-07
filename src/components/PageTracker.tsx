import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SCROLL_DEPTH_KEY = "_scroll_depth";
const FIRST_VISIT_KEY = "_wh_visited";

function getSessionId() {
  let id = sessionStorage.getItem("_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("_sid", id);
  }
  return id;
}

function isFirstVisit(): boolean {
  const visited = localStorage.getItem(FIRST_VISIT_KEY);
  if (!visited) {
    localStorage.setItem(FIRST_VISIT_KEY, "1");
    return true;
  }
  return false;
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const UTM_STORAGE_PREFIX = "_wh_utm_";

function captureAndGetUTMParams(): Record<string, string | null> {
  const params = new URLSearchParams(window.location.search);
  
  // If URL has any UTM param, store all in sessionStorage (overwrite previous)
  const hasUtm = UTM_KEYS.some(k => params.has(k));
  if (hasUtm) {
    for (const key of UTM_KEYS) {
      const val = params.get(key);
      if (val) {
        sessionStorage.setItem(UTM_STORAGE_PREFIX + key, val);
      } else {
        sessionStorage.removeItem(UTM_STORAGE_PREFIX + key);
      }
    }
  }

  // Return stored UTM values (persisted across SPA navigations)
  const result: Record<string, string | null> = {};
  for (const key of UTM_KEYS) {
    result[key] = sessionStorage.getItem(UTM_STORAGE_PREFIX + key) || null;
  }
  return result;
}

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

function sendDuration(pagePath: string, startTime: number) {
  const duration = (Date.now() - startTime) / 1000;
  if (duration < 1) return;
  const sessionId = getSessionId();
  const scrollDepth = parseInt(sessionStorage.getItem(SCROLL_DEPTH_KEY) || "0", 10);

  const body = {
    session_id: sessionId,
    page_path: pagePath,
    duration_seconds: duration,
    scroll_depth: scrollDepth > 0 ? scrollDepth : null,
  };

  // Use supabase functions.invoke which includes proper apikey header
  // Use keepalive fetch as fallback for unload scenarios
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-page-duration`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    };
    
    // sendBeacon doesn't support custom headers, use keepalive fetch instead
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Silent fail for tracking
  }

  // Reset scroll depth for next page
  sessionStorage.setItem(SCROLL_DEPTH_KEY, "0");
}

export default function PageTracker() {
  const location = useLocation();
  const lastPath = useRef<string>("");
  const pageStartTime = useRef<number>(Date.now());

  // Track scroll depth
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

  // Track CTA clicks
  const trackClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const btn = target.closest("a[href], button") as HTMLElement | null;
    if (!btn) return;

    // Only track CTA-like elements (links to contact, demo, etc.)
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
      },
    }).catch(() => {});
  }, []);

  useEffect(() => {
    document.addEventListener("click", trackClick, true);
    return () => document.removeEventListener("click", trackClick, true);
  }, [trackClick]);

  // Track page views
  useEffect(() => {
    const path = location.pathname + location.hash;
    if (path === lastPath.current) return;

    // Send duration for previous page
    if (lastPath.current) {
      sendDuration(lastPath.current.split("#")[0], pageStartTime.current);
    }

    lastPath.current = path;
    pageStartTime.current = Date.now();
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
        ...utmParams,
      },
    }).then(({ error }) => {
      if (error) console.error("Tracking error:", error);
    });
  }, [location.pathname, location.hash]);

  // Send duration on tab close / page unload
  useEffect(() => {
    const handleUnload = () => {
      if (lastPath.current) {
        sendDuration(lastPath.current.split("#")[0], pageStartTime.current);
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && lastPath.current) {
        sendDuration(lastPath.current.split("#")[0], pageStartTime.current);
      }
    });
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return null;
}
