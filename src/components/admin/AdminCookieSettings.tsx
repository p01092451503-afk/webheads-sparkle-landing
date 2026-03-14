import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Cookie, ToggleLeft, ToggleRight, Loader2, Save, Trash2, BarChart3, Edit3, Eye, Check, RefreshCw, Languages } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Props {
  isSuperAdmin: boolean;
  logActivity: (action: string, targetType?: string, targetId?: string, details?: any) => void;
}

interface ConsentLog {
  id: string;
  session_id: string | null;
  visitor_id: string | null;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  action: string;
  language: string | null;
  created_at: string;
}

export default function AdminCookieSettings({ isSuperAdmin, logActivity }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [bannerTextKo, setBannerTextKo] = useState("당사는 웹사이트 운영, 더 나은 브라우징 경험 제공, 웹사이트 트래픽 분석을 위해 쿠키 및 관련 기술을 사용합니다.");
  const [bannerTextEn, setBannerTextEn] = useState("We use cookies to enhance your browsing experience and analyze website traffic.");
  const [bannerTextJa, setBannerTextJa] = useState("当社はウェブサイトの運営、ブラウジング体験の向上、トラフィック分析のためにCookieを使用しています。");
  const [translating, setTranslating] = useState(false);

  // Logs
  const [logs, setLogs] = useState<ConsentLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<"stats" | "settings" | "logs">("stats");

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from("admin_settings")
      .select("key, value")
      .in("key", ["cookie_banner_enabled", "cookie_banner_text"]);

    if (data) {
      for (const row of data) {
        if (row.key === "cookie_banner_enabled") {
          setBannerEnabled((row.value as any)?.enabled !== false);
        }
        if (row.key === "cookie_banner_text") {
          const v = row.value as any;
          if (v?.ko) setBannerTextKo(v.ko);
          if (v?.en) setBannerTextEn(v.en);
          if (v?.ja) setBannerTextJa(v.ja);
        }
      }
    }
    setLoading(false);
  }, []);

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    const { data } = await supabase
      .from("cookie_consent_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    setLogs((data as ConsentLog[]) || []);
    setLogsLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, [fetchSettings, fetchLogs]);

  // Statistics
  const stats = useMemo(() => {
    const total = logs.length;
    const acceptAll = logs.filter(l => l.action === "accept_all").length;
    const custom = logs.filter(l => l.action === "custom").length;
    const analyticsAccepted = logs.filter(l => l.analytics).length;
    const marketingAccepted = logs.filter(l => l.marketing).length;

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = logs.filter(l => new Date(l.created_at) >= sevenDaysAgo);

    return {
      total,
      acceptAll,
      custom,
      acceptAllRate: total > 0 ? Math.round((acceptAll / total) * 100) : 0,
      analyticsRate: total > 0 ? Math.round((analyticsAccepted / total) * 100) : 0,
      marketingRate: total > 0 ? Math.round((marketingAccepted / total) * 100) : 0,
      recentCount: recent.length,
    };
  }, [logs]);

  const handleSaveSettings = async () => {
    if (!isSuperAdmin) return;
    setSaving(true);

    const userId = (await supabase.auth.getUser()).data.user?.id;

    // Upsert banner enabled
    await supabase.from("admin_settings").upsert(
      { key: "cookie_banner_enabled", value: { enabled: bannerEnabled } as any, updated_by: userId },
      { onConflict: "key" }
    );

    // Upsert banner text
    await supabase.from("admin_settings").upsert(
      { key: "cookie_banner_text", value: { ko: bannerTextKo, en: bannerTextEn, ja: bannerTextJa } as any, updated_by: userId },
      { onConflict: "key" }
    );

    await logActivity("cookie_settings_updated", "cookie_settings", undefined, { bannerEnabled });
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleClearLogs = async () => {
    if (!isSuperAdmin) return;
    if (!confirm("모든 쿠키 동의 로그를 삭제하시겠습니까?")) return;

    await supabase.from("cookie_consent_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await logActivity("cookie_logs_cleared", "cookie_consent_logs");
    setLogs([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex items-center gap-2">
        {[
          { key: "stats" as const, label: "통계", icon: BarChart3 },
          { key: "settings" as const, label: "배너 설정", icon: Edit3 },
          { key: "logs" as const, label: "동의 로그", icon: Eye },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setActiveSection(s.key);
              if (s.key === "logs" && logs.length === 0) fetchLogs();
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
              activeSection === s.key
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <s.icon className="w-4 h-4" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Statistics */}
      {activeSection === "stats" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "전체 동의 건수", value: stats.total, sub: `최근 7일: ${stats.recentCount}건` },
              { label: "모두 수락 비율", value: `${stats.acceptAllRate}%`, sub: `${stats.acceptAll}건` },
              { label: "분석 쿠키 동의율", value: `${stats.analyticsRate}%`, sub: "Analytics" },
              { label: "마케팅 쿠키 동의율", value: `${stats.marketingRate}%`, sub: "Marketing" },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-border">
                <p className="text-[12px] text-muted-foreground font-medium mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Breakdown chart - simple bar */}
          <div className="bg-white rounded-2xl p-6 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">카테고리별 동의 현황</h3>
            <div className="space-y-3">
              {[
                { label: "필수 쿠키", rate: 100, color: "hsl(220, 9%, 46%)" },
                { label: "분석 쿠키", rate: stats.analyticsRate, color: "hsl(221, 83%, 53%)" },
                { label: "마케팅 쿠키", rate: stats.marketingRate, color: "hsl(25, 95%, 53%)" },
              ].map((bar, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[13px] text-muted-foreground w-24 shrink-0">{bar.label}</span>
                  <div className="flex-1 h-7 rounded-lg bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(bar.rate, 3)}%`, background: bar.color }}
                    >
                      <span className="text-[11px] font-bold text-white">{bar.rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Banner Settings */}
      {activeSection === "settings" && (
        <div className="space-y-5">
          {/* On/Off Toggle */}
          <div className="bg-white rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">쿠키 배너 표시</h3>
                <p className="text-[12px] text-muted-foreground mt-0.5">비활성화하면 방문자에게 쿠키 동의 배너가 표시되지 않습니다.</p>
              </div>
              <Switch
                checked={bannerEnabled}
                onCheckedChange={setBannerEnabled}
                disabled={!isSuperAdmin}
              />
            </div>
          </div>

          {/* Banner Text Edit */}
          <div className="bg-white rounded-2xl p-6 border border-border space-y-4">
            <h3 className="text-sm font-semibold text-foreground">배너 문구 편집</h3>

            {[
              { label: "한국어", value: bannerTextKo, setter: setBannerTextKo },
              { label: "English", value: bannerTextEn, setter: setBannerTextEn },
              { label: "日本語", value: bannerTextJa, setter: setBannerTextJa },
            ].map((lang) => (
              <div key={lang.label}>
                <label className="text-[12px] font-medium text-muted-foreground mb-1 block">{lang.label}</label>
                <textarea
                  value={lang.value}
                  onChange={(e) => lang.setter(e.target.value)}
                  disabled={!isSuperAdmin}
                  rows={2}
                  className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50"
                />
              </div>
            ))}

            {isSuperAdmin && (
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saveSuccess ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saveSuccess ? "저장 완료" : "저장"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Consent Logs */}
      {activeSection === "logs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-muted-foreground">
              최근 동의 기록 ({logs.length}건)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchLogs}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                새로고침
              </button>
              {isSuperAdmin && logs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  전체 삭제
                </button>
              )}
            </div>
          </div>

          {logsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              아직 기록된 동의 로그가 없습니다.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">일시</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">유형</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">필수</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">분석</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">마케팅</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">언어</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            log.action === "accept_all"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {log.action === "accept_all" ? "모두 수락" : "사용자 설정"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-emerald-600">✓</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {log.analytics ? <span className="text-emerald-600">✓</span> : <span className="text-muted-foreground">✗</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {log.marketing ? <span className="text-emerald-600">✓</span> : <span className="text-muted-foreground">✗</span>}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground uppercase">
                          {log.language || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
