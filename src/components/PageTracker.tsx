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

  // Browser
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome/") && ua.includes("Safari/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("MSIE") || ua.includes("Trident/")) browser = "IE";

  // OS
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  // Device
  if (/Mobi|Android|iPhone/i.test(ua)) deviceType = "mobile";
  else if (/iPad|Tablet/i.test(ua)) deviceType = "tablet";

  return { browser, os, deviceType };
}

export default function PageTracker() {
  const location = useLocation();
  const lastPath = useRef<string>("");

  useEffect(() => {
    const path = location.pathname + location.hash;
    if (path === lastPath.current) return;
    lastPath.current = path;

    const ua = navigator.userAgent;
    const { browser, os, deviceType } = parseUA(ua);

    supabase.from("page_views").insert({
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
    }).then(({ error }) => {
      if (error) console.error("Tracking error:", error);
    });
  }, [location.pathname, location.hash]);

  return null;
}
