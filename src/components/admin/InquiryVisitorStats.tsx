import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Globe, Monitor, MapPin, ArrowRight, Clock, Eye, Loader2, UserCheck, Smartphone, Laptop
} from "lucide-react";

interface Props {
  sessionId: string | null;
}

function maskIp(ip: string) {
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
  return ip;
}

export default function InquiryVisitorStats({ sessionId }: Props) {
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState<any[]>([]);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("page_views")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      setViews(data || []);
      setLoading(false);
    };
    fetch();
  }, [sessionId]);

  if (!sessionId) return null;
  if (loading) {
    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground py-4">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> 방문자 정보 로딩 중...
        </div>
      </div>
    );
  }
  if (views.length === 0) return null;

  const first = views[0];
  const ip = first.ip_address ? maskIp(first.ip_address) : null;
  const location = [first.city, first.country].filter(Boolean).join(", ");
  const isFirstVisit = first.is_first_visit;
  const referrer = first.referrer || "직접 방문";
  const browser = first.browser || "알 수 없음";
  const os = first.os || "알 수 없음";
  const deviceType = first.device_type || "desktop";
  const language = first.language || null;
  const screenSize = first.screen_width && first.screen_height
    ? `${first.screen_width}×${first.screen_height}` : null;

  // Page flow
  const pageFlow = views.map((v) => v.page_path);

  // Visited pages with dwell time
  const pagesWithTime = views.map((v, i) => {
    const next = views[i + 1];
    const dwell = next
      ? Math.round((new Date(next.created_at).getTime() - new Date(v.created_at).getTime()) / 1000)
      : v.duration_seconds || null;
    return { path: v.page_path, dwell };
  });

  const DeviceIcon = deviceType === "mobile" ? Smartphone : deviceType === "tablet" ? Smartphone : Laptop;

  const formatDwell = (s: number | null) => {
    if (!s || s < 1) return null;
    if (s < 60) return `${s}초`;
    return `${Math.floor(s / 60)}분 ${s % 60}초`;
  };

  const pageNameMap: Record<string, string> = {
    "/": "홈",
    "/lms": "LMS",
    "/channel": "채널",
    "/chatbot": "챗봇",
    "/hosting": "호스팅",
    "/drm": "DRM",
    "/app-dev": "앱 개발",
    "/maintenance": "유지보수",
    "/content": "콘텐츠",
    "/pg": "PG",
    "/pricing": "요금",
    "/blog": "인사이트",
    "/support": "고객지원",
    "/event": "이벤트",
    "/sms-kakao": "SMS/카카오",
  };

  return (
    <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
      <p className="text-[11px] font-semibold text-muted-foreground mb-3 tracking-wide flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5" /> 방문자 정보
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ip && (
          <StatItem icon={Globe} label="IP" value={ip} />
        )}
        {location && (
          <StatItem icon={MapPin} label="지역" value={location} />
        )}
        <StatItem
          icon={UserCheck}
          label="방문 유형"
          value={isFirstVisit ? "신규 방문" : "재방문"}
          highlight={isFirstVisit}
        />
        <StatItem icon={Monitor} label="브라우저" value={browser} />
        <StatItem icon={DeviceIcon} label="기기/OS" value={`${deviceType === "mobile" ? "모바일" : deviceType === "tablet" ? "태블릿" : "데스크톱"} · ${os}`} />
        {screenSize && (
          <StatItem icon={Monitor} label="화면 크기" value={screenSize} />
        )}
        {language && (
          <StatItem icon={Globe} label="언어" value={language} />
        )}
        <StatItem
          icon={Globe}
          label="유입 경로"
          value={
            referrer === "직접 방문"
              ? "직접 방문"
              : referrer.replace(/^https?:\/\//, "").replace(/\/$/, "").slice(0, 40)
          }
        />
      </div>

      {/* Page Flow */}
      <div className="mt-4">
        <p className="text-[11px] font-semibold text-muted-foreground mb-2 tracking-wide">페이지 이동 경로</p>
        <div className="bg-white rounded-xl p-3 border border-[hsl(220,13%,93%)]">
          <div className="flex flex-wrap items-center gap-1">
            {pagesWithTime.map((p, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-[hsl(221,83%,53%,0.06)] text-[hsl(221,83%,53%)]">
                  {pageNameMap[p.path] || p.path}
                  {p.dwell && p.dwell > 0 && (
                    <span className="text-[10px] text-muted-foreground/60 ml-0.5">
                      {formatDwell(p.dwell)}
                    </span>
                  )}
                </span>
                {i < pagesWithTime.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
                )}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground/50 mt-2">
            총 {views.length}페이지 방문
          </p>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, highlight }: {
  icon: any; label: string; value: string; highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-[hsl(220,14%,93%)]">
        <Icon className="w-3 h-3 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className={`text-[12px] font-medium truncate ${highlight ? "text-[hsl(221,83%,53%)]" : "text-foreground"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
