import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut, MessageSquare, BarChart3, Home, Loader2, Bell, Settings, Shield, ExternalLink
} from "lucide-react";
import AdminHome from "@/components/admin/AdminHome";
import AdminInquiries from "@/components/admin/AdminInquiries";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminActivityLog from "@/components/admin/AdminActivityLog";

type Tab = "home" | "inquiries" | "analytics" | "activity" | "settings";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("home");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [clickEvents, setClickEvents] = useState<any[]>([]);
  const [newInquiryAlert, setNewInquiryAlert] = useState(false);

  useEffect(() => { checkAuth(); }, []);

  useEffect(() => {
    fetchInquiries();
    fetchPageViews(30);
    fetchClickEvents(30);
  }, []);

  // Realtime subscription for new inquiries
  useEffect(() => {
    const channel = supabase
      .channel('inquiries-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'contact_inquiries',
      }, (payload) => {
        setInquiries((prev) => [payload.new as any, ...prev]);
        setNewInquiryAlert(true);
        setTimeout(() => setNewInquiryAlert(false), 5000);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/admin/login", { replace: true }); return; }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
    if (!data) { await supabase.auth.signOut(); navigate("/admin/login", { replace: true }); return; }
    setUserId(session.user.id);
    setLoading(false);
  };

  const fetchInquiries = async () => {
    const { data } = await supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }).limit(500);
    setInquiries(data || []);
  };

  const fetchPageViews = async (days: number) => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data } = await supabase.from("page_views").select("*").gte("created_at", since.toISOString()).order("created_at", { ascending: false }).limit(1000);
    setPageViews(data || []);
  };

  const fetchClickEvents = async (days: number) => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data } = await supabase.from("click_events").select("*").gte("created_at", since.toISOString()).order("created_at", { ascending: false }).limit(1000);
    setClickEvents(data || []);
  };

  const logActivity = useCallback(async (action: string, targetType?: string, targetId?: string, details?: any) => {
    if (!userId) return;
    await supabase.from("admin_activity_logs").insert({
      user_id: userId,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
    });
  }, [userId]);

  const handleLogout = async () => {
    await logActivity("logout");
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const tabs: { key: Tab; icon: any; label: string }[] = [
    { key: "home", icon: Home, label: "홈" },
    { key: "inquiries", icon: MessageSquare, label: "문의 관리" },
    { key: "analytics", icon: BarChart3, label: "접속 분석" },
    { key: "activity", icon: Shield, label: "활동 로그" },
    { key: "settings", icon: Settings, label: "설정" },
  ];

  const newCount = useMemo(() => inquiries.filter((i) => i.status === "new").length, [inquiries]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--muted))" }}>
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--muted))" }}>
      {/* Realtime Alert Banner */}
      {newInquiryAlert && (
        <div
          className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center py-3 text-[13px] animate-in slide-in-from-top duration-300"
          style={{
            background: "hsl(214 90% 52%)",
            color: "white",
            fontWeight: 600,
          }}
        >
          <Bell className="w-4 h-4 mr-2 animate-bounce" />
          새로운 문의가 접수되었습니다!
          <button
            onClick={() => { setNewInquiryAlert(false); setTab("inquiries"); }}
            className="ml-4 px-3 py-1 rounded-lg text-[12px] transition-all"
            style={{ background: "hsla(0,0%,100%,0.2)", fontWeight: 600 }}
          >
            확인하기
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "hsl(var(--background) / 0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderColor: "hsl(var(--border) / 0.6)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Top row: logo + right actions */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            <h1 className="text-[20px] sm:text-[22px] tracking-[-0.04em] text-foreground shrink-0" style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 800 }}>
              웹헤즈
            </h1>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate("/lms")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] transition-all hover:bg-muted"
                style={{ fontWeight: 500, color: "hsl(var(--muted-foreground))" }}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">LMS 페이지</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] transition-all hover:bg-muted"
                style={{ fontWeight: 500, color: "hsl(var(--muted-foreground))" }}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          </div>
          {/* Bottom row: tabs (scrollable on mobile) */}
          <div className="-mb-px flex gap-0.5 overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="relative flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-[13px] transition-all duration-200 shrink-0"
                style={{
                  fontWeight: tab === t.key ? 600 : 500,
                  color: tab === t.key ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                  background: tab === t.key ? "hsl(var(--muted))" : "transparent",
                }}
              >
                <t.icon className="w-4 h-4" />
                <span>{t.label}</span>
                {t.key === "inquiries" && newCount > 0 && (
                  <span
                    className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px]"
                    style={{ fontWeight: 700, background: "hsl(0 84% 60%)", color: "white", padding: "0 5px" }}
                  >
                    {newCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {tab === "home" && (
          <AdminHome
            inquiries={inquiries}
            pageViews={pageViews}
            onNavigate={setTab}
          />
        )}
        {tab === "inquiries" && (
          <AdminInquiries
            inquiries={inquiries}
            setInquiries={setInquiries}
            onRefresh={fetchInquiries}
            logActivity={logActivity}
          />
        )}
        {tab === "analytics" && (
          <AdminAnalytics
            pageViews={pageViews}
            inquiries={inquiries}
            clickEvents={clickEvents}
            onRefresh={(days: number) => { fetchPageViews(days); fetchClickEvents(days); }}
          />
        )}
        {tab === "activity" && <AdminActivityLog />}
        {tab === "settings" && <AdminSettings />}
      </div>
    </div>
  );
}
