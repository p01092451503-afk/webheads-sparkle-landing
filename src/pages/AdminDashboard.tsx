import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut, MessageSquare, BarChart3, Loader2, Bell, Settings, ExternalLink, Wrench, Zap, Target
} from "lucide-react";

const AdminInquiries = lazy(() => import("@/components/admin/AdminInquiries"));
const AdminAnalytics = lazy(() => import("@/components/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("@/components/admin/AdminSettings"));
const AdminActivityLog = lazy(() => import("@/components/admin/AdminActivityLog"));
const AdminServiceRequests = lazy(() => import("@/components/admin/AdminServiceRequests"));
const AIUsageDashboard = lazy(() => import("@/components/admin/AIUsageDashboard"));
const SalesPriorityDashboard = lazy(() => import("@/components/admin/SalesPriorityDashboard"));

type Tab = "inquiries" | "service_requests" | "analytics" | "ai_usage" | "sales_priority" | "activity" | "settings";
type UserRole = "super_admin" | "admin" | "user";

const TabLoader = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("inquiries");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [clickEvents, setClickEvents] = useState<any[]>([]);
  const [newInquiryAlert, setNewInquiryAlert] = useState(false);
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin/login", { replace: true }); return; }
      // Check role - prefer super_admin
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      if (!roles || roles.length === 0) { await supabase.auth.signOut(); navigate("/admin/login", { replace: true }); return; }
      const hasAdmin = roles.some((r: any) => r.role === "admin" || r.role === "super_admin");
      if (!hasAdmin) { await supabase.auth.signOut(); navigate("/admin/login", { replace: true }); return; }
      const isSuperAdmin = roles.some((r: any) => r.role === "super_admin");
      setUserRole(isSuperAdmin ? "super_admin" : "admin");
      setUserId(session.user.id);
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Initial data
  useEffect(() => {
    const since7d = new Date();
    since7d.setDate(since7d.getDate() - 7);

    Promise.all([
      supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("service_requests").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("page_views").select("*").gte("created_at", since7d.toISOString()).order("created_at", { ascending: false }).limit(1000),
      supabase.from("inquiry_analyses").select("inquiry_id, analysis_status, is_frozen").limit(500),
    ]).then(([inqRes, srRes, pvRes, analysesRes]) => {
      const analyses = analysesRes.data || [];
      const analysisMap = new Map(analyses.map((a: any) => [a.inquiry_id, a]));
      const enriched = (inqRes.data || []).map((inq: any) => {
        const a = analysisMap.get(inq.id);
        return { ...inq, _pro_status: a?.analysis_status || null, _is_frozen: a?.is_frozen || false };
      });
      setInquiries(enriched);
      setServiceRequests(srRes.data || []);
      setPageViews(pvRes.data || []);
    });
  }, []);

  const fetchFullAnalytics = useCallback(async (days: number) => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceISO = since.toISOString();

    const fetchAll = async (table: "page_views" | "click_events") => {
      const allData: any[] = [];
      let offset = 0;
      let hasMore = true;
      while (hasMore) {
        const { data } = await supabase
          .from(table).select("*")
          .gte("created_at", sinceISO)
          .order("created_at", { ascending: false })
          .range(offset, offset + 999);
        if (!data || data.length === 0) { hasMore = false; }
        else { allData.push(...data); offset += 1000; hasMore = data.length === 1000; }
      }
      return allData;
    };

    const [pv, ce] = await Promise.all([fetchAll("page_views"), fetchAll("click_events")]);
    setPageViews(pv);
    setClickEvents(ce);
    setAnalyticsLoaded(true);
  }, []);

  useEffect(() => {
    if (tab === "analytics" && !analyticsLoaded) {
      fetchFullAnalytics(30);
    }
  }, [tab, analyticsLoaded, fetchFullAnalytics]);

  // Realtime
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

  const fetchInquiries = useCallback(async () => {
    const [{ data: inqData }, { data: analysesData }] = await Promise.all([
      supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("inquiry_analyses").select("inquiry_id, analysis_status, is_frozen").limit(500),
    ]);
    const analysisMap = new Map((analysesData || []).map((a: any) => [a.inquiry_id, a]));
    const enriched = (inqData || []).map((inq: any) => {
      const a = analysisMap.get(inq.id);
      return { ...inq, _pro_status: a?.analysis_status || null, _is_frozen: a?.is_frozen || false };
    });
    setInquiries(enriched);
  }, []);

  const fetchServiceRequests = useCallback(async () => {
    const { data } = await supabase.from("service_requests").select("*").order("created_at", { ascending: false }).limit(500);
    setServiceRequests(data || []);
  }, []);

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

  const isSuperAdmin = userRole === "super_admin";

  const tabs: { key: Tab; icon: any; label: string }[] = [
    { key: "inquiries", icon: MessageSquare, label: "문의" },
    { key: "sales_priority", icon: Target, label: "영업" },
    { key: "analytics", icon: BarChart3, label: "분석" },
    { key: "ai_usage", icon: Zap, label: "AI" },
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
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 700, fontStyle: "italic", fontSize: "1.375rem", letterSpacing: "-0.03em" }} className="text-foreground">WEBHEADS.</span>
              {!isSuperAdmin && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[hsl(220,14%,93%)] text-muted-foreground">읽기 전용</span>
              )}
            </div>
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
        <Suspense fallback={<TabLoader />}>
          {tab === "inquiries" && (
            <AdminInquiries inquiries={inquiries} setInquiries={setInquiries} onRefresh={fetchInquiries} logActivity={logActivity} isSuperAdmin={isSuperAdmin} />
          )}
          {tab === "service_requests" && (
            <AdminServiceRequests requests={serviceRequests} setRequests={setServiceRequests} onRefresh={fetchServiceRequests} logActivity={logActivity} isSuperAdmin={isSuperAdmin} />
          )}
          {tab === "analytics" && (
            <AdminAnalytics pageViews={pageViews} inquiries={inquiries} clickEvents={clickEvents} onRefresh={(days: number) => fetchFullAnalytics(days)} />
          )}
          {tab === "ai_usage" && <AIUsageDashboard />}
          {tab === "sales_priority" && (
            <SalesPriorityDashboard onSelectInquiry={(id) => {
              setTab("inquiries");
              // The AdminInquiries component will handle selecting by id
            }} />
          )}
          {tab === "activity" && <AdminActivityLog />}
          {tab === "settings" && <AdminSettings isSuperAdmin={isSuperAdmin} logActivity={logActivity} />}
        </Suspense>
      </div>
    </div>
  );
}
