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
      user_id: userId, action, target_type: targetType, target_id: targetId, details,
    });
  }, [userId]);

  const handleLogout = async () => {
    await logActivity("logout");
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const tabs: { key: Tab; icon: any; label: string }[] = [
    { key: "home", icon: Home, label: "홈" },
    { key: "inquiries", icon: MessageSquare, label: "문의" },
    { key: "analytics", icon: BarChart3, label: "분석" },
    { key: "activity", icon: Shield, label: "활동" },
    { key: "settings", icon: Settings, label: "설정" },
  ];

  const newCount = useMemo(() => inquiries.filter((i) => i.status === "new").length, [inquiries]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220,14%,96%)]">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,14%,96%)]">
      {/* Realtime Alert */}
      {newInquiryAlert && (
        <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center py-3 text-[13px] font-semibold text-white animate-in slide-in-from-top duration-300 bg-[hsl(221,83%,53%)]">
          <Bell className="w-4 h-4 mr-2 animate-bounce" />
          새로운 문의가 접수되었습니다
          <button
            onClick={() => { setNewInquiryAlert(false); setTab("inquiries"); }}
            className="ml-4 px-3 py-1 rounded-full text-[12px] font-semibold bg-white/20 hover:bg-white/30 transition-colors"
          >
            확인
          </button>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[hsl(220,13%,91%)]">
        <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <span className="text-[18px] font-extrabold tracking-[-0.03em] text-foreground">웹헤즈</span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => navigate("/lms")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-[hsl(220,14%,96%)] transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">사이트</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-[hsl(220,14%,96%)] transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
            {tabs.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="relative flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium transition-all shrink-0"
                  style={{
                    color: isActive ? "hsl(221, 83%, 53%)" : "hsl(220, 9%, 46%)",
                  }}
                >
                  <t.icon className="w-4 h-4" />
                  <span>{t.label}</span>
                  {t.key === "inquiries" && newCount > 0 && (
                    <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold bg-[hsl(0,84%,60%)] text-white px-1">
                      {newCount}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[hsl(221,83%,53%)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="max-w-[1120px] mx-auto px-5 sm:px-6 py-6">
        {tab === "home" && (
          <AdminHome inquiries={inquiries} pageViews={pageViews} onNavigate={setTab} />
        )}
        {tab === "inquiries" && (
          <AdminInquiries inquiries={inquiries} setInquiries={setInquiries} onRefresh={fetchInquiries} logActivity={logActivity} />
        )}
        {tab === "analytics" && (
          <AdminAnalytics pageViews={pageViews} inquiries={inquiries} clickEvents={clickEvents} onRefresh={(days: number) => { fetchPageViews(days); fetchClickEvents(days); }} />
        )}
        {tab === "activity" && <AdminActivityLog />}
        {tab === "settings" && <AdminSettings />}
      </div>
    </div>
  );
}
