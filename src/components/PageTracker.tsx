import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getSessionId() {
  let id = sessionStorage.getItem("_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("_sid", id);
  }
  return id;
}

function parseUA(ua: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let deviceType = "desktop";

  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome/") && ua.includes("Safari/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("MSIE") || ua.includes("Trident/")) browser = "IE";

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
  if (duration < 1) return; // ignore sub-second visits
  const sessionId = getSessionId();
  
  // Use sendBeacon for reliability on page unload
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-page-duration`;
  const body = JSON.stringify({
    session_id: sessionId,
    page_path: pagePath,
    duration_seconds: duration,
  });
  
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

export default function PageTracker() {
  const location = useLocation();
  const lastPath = useRef<string>("");
  const pageStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const path = location.pathname + location.hash;
    if (path === lastPath.current) return;

    // Send duration for previous page
    if (lastPath.current) {
      sendDuration(lastPath.current.split("#")[0], pageStartTime.current);
    }

    lastPath.current = path;
    pageStartTime.current = Date.now();

    const ua = navigator.userAgent;
    const { browser, os, deviceType } = parseUA(ua);

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
