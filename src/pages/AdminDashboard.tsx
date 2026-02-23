import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut, MessageSquare, BarChart3, Eye, Smartphone, Monitor, Tablet,
  Globe, Clock, ArrowUpRight, ChevronDown, Check, X, Loader2, RefreshCw
} from "lucide-react";

type Tab = "inquiries" | "analytics";
type InquiryStatus = "new" | "in_progress" | "completed" | "archived";

const statusLabels: Record<InquiryStatus, string> = {
  new: "신규",
  in_progress: "진행중",
  completed: "완료",
  archived: "보관",
};

const statusColors: Record<InquiryStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-500",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("inquiries");
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState(7);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (tab === "inquiries") fetchInquiries();
    else fetchPageViews();
  }, [tab, dateRange]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/admin/login", { replace: true }); return; }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
    if (!data) { await supabase.auth.signOut(); navigate("/admin/login", { replace: true }); }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    const { data } = await supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }).limit(200);
    setInquiries(data || []);
    setLoading(false);
  };

  const fetchPageViews = async () => {
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - dateRange);
    const { data } = await supabase.from("page_views").select("*").gte("created_at", since.toISOString()).order("created_at", { ascending: false }).limit(1000);
    setPageViews(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: InquiryStatus) => {
    await supabase.from("contact_inquiries").update({ status }).eq("id", id);
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    if (selectedInquiry?.id === id) setSelectedInquiry({ ...selectedInquiry, status });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  // Analytics computations
  const totalViews = pageViews.length;
  const uniqueSessions = new Set(pageViews.map((v) => v.session_id)).size;

  const pageCounts = pageViews.reduce((acc, v) => {
    acc[v.page_path] = (acc[v.page_path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topPages = Object.entries(pageCounts).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 10);

  const browserCounts = pageViews.reduce((acc, v) => {
    acc[v.browser || "Unknown"] = (acc[v.browser || "Unknown"] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topBrowsers = Object.entries(browserCounts).sort(([, a], [, b]) => (b as number) - (a as number));

  const deviceCounts = pageViews.reduce((acc, v) => {
    acc[v.device_type || "unknown"] = (acc[v.device_type || "unknown"] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const osCounts = pageViews.reduce((acc, v) => {
    acc[v.os || "Unknown"] = (acc[v.os || "Unknown"] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topOS = Object.entries(osCounts).sort(([, a], [, b]) => (b as number) - (a as number));

  const referrerCounts = pageViews.reduce((acc, v) => {
    const ref = v.referrer ? new URL(v.referrer).hostname : "직접 방문";
    acc[ref] = (acc[ref] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topReferrers = Object.entries(referrerCounts).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 10);

  const DeviceIcon = ({ type }: { type: string }) => {
    if (type === "mobile") return <Smartphone className="w-4 h-4" />;
    if (type === "tablet") return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">관리자 대시보드</h1>
            <p className="text-sm text-muted-foreground">문의 관리 및 접속 분석</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors">
            <LogOut className="w-4 h-4" /> 로그아웃
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted mb-6 w-fit">
          <button onClick={() => setTab("inquiries")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "inquiries" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
            <MessageSquare className="w-4 h-4" /> 문의 관리
          </button>
          <button onClick={() => setTab("analytics")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "analytics" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
            <BarChart3 className="w-4 h-4" /> 접속 분석
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : tab === "inquiries" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inquiry List */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-foreground">전체 {inquiries.length}건</p>
                <button onClick={fetchInquiries} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> 새로고침
                </button>
              </div>
              {inquiries.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm">접수된 문의가 없습니다.</div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${selectedInquiry?.id === inq.id ? "border-primary bg-primary/5" : "border-border bg-card"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${statusColors[inq.status as InquiryStatus]}`}>
                            {statusLabels[inq.status as InquiryStatus] || inq.status}
                          </span>
                          <span className="text-[0.65rem] text-muted-foreground">{inq.inquiry_type === "demo" ? "데모" : "상담"}</span>
                        </div>
                        <p className="font-bold text-sm text-foreground truncate">{inq.company} · {inq.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{inq.phone} {inq.email ? `· ${inq.email}` : ""}</p>
                      </div>
                      <span className="text-[0.6rem] text-muted-foreground shrink-0 mt-1">
                        {new Date(inq.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Inquiry Detail */}
            <div className="lg:col-span-1">
              {selectedInquiry ? (
                <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground">문의 상세</h3>
                    <button onClick={() => setSelectedInquiry(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-col gap-3 text-sm">
                    <div><span className="text-muted-foreground text-xs font-bold block mb-0.5">회사명</span><span className="text-foreground font-medium">{selectedInquiry.company}</span></div>
                    <div><span className="text-muted-foreground text-xs font-bold block mb-0.5">담당자</span><span className="text-foreground font-medium">{selectedInquiry.name}</span></div>
                    <div><span className="text-muted-foreground text-xs font-bold block mb-0.5">연락처</span><span className="text-foreground font-medium">{selectedInquiry.phone}</span></div>
                    {selectedInquiry.email && <div><span className="text-muted-foreground text-xs font-bold block mb-0.5">이메일</span><span className="text-foreground font-medium">{selectedInquiry.email}</span></div>}
                    {selectedInquiry.service && <div><span className="text-muted-foreground text-xs font-bold block mb-0.5">관심 서비스</span><span className="text-foreground font-medium">{selectedInquiry.service}</span></div>}
                    {selectedInquiry.message && (
                      <div><span className="text-muted-foreground text-xs font-bold block mb-0.5">문의 내용</span><p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed bg-muted rounded-lg p-3">{selectedInquiry.message}</p></div>
                    )}
                    <div className="pt-2 border-t border-border">
                      <span className="text-muted-foreground text-xs font-bold block mb-2">상태 변경</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(Object.keys(statusLabels) as InquiryStatus[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(selectedInquiry.id, s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedInquiry.status === s ? statusColors[s] + " ring-2 ring-offset-1 ring-current/20" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                          >
                            {statusLabels[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[0.65rem] text-muted-foreground pt-2">
                      접수일: {new Date(selectedInquiry.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/50 border border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
                  좌측에서 문의를 선택하세요
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Analytics Tab */
          <div className="flex flex-col gap-6">
            {/* Date range + summary */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-2">
                {[7, 14, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDateRange(d)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${dateRange === d ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                  >
                    {d}일
                  </button>
                ))}
              </div>
              <button onClick={fetchPageViews} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> 새로고침
              </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard icon={<Eye className="w-5 h-5" />} label="총 페이지뷰" value={totalViews} />
              <SummaryCard icon={<Globe className="w-5 h-5" />} label="고유 세션" value={uniqueSessions} />
              <SummaryCard icon={<Smartphone className="w-5 h-5" />} label="모바일" value={deviceCounts.mobile || 0} />
              <SummaryCard icon={<Monitor className="w-5 h-5" />} label="데스크톱" value={deviceCounts.desktop || 0} />
            </div>

            {/* Charts area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Pages */}
              <AnalyticsCard title="인기 페이지">
                {topPages.map(([path, count]) => (
                  <BarRow key={path} label={path} value={count as number} max={topPages[0]?.[1] as number} />
                ))}
              </AnalyticsCard>

              {/* Referrers */}
              <AnalyticsCard title="유입 경로">
                {topReferrers.length === 0 ? <p className="text-sm text-muted-foreground">데이터 없음</p> : topReferrers.map(([ref, count]) => (
                  <BarRow key={ref} label={ref} value={count as number} max={topReferrers[0]?.[1] as number} />
                ))}
              </AnalyticsCard>

              {/* Browsers */}
              <AnalyticsCard title="브라우저">
                {topBrowsers.map(([name, count]) => (
                  <BarRow key={name} label={name} value={count as number} max={topBrowsers[0]?.[1] as number} />
                ))}
              </AnalyticsCard>

              {/* OS */}
              <AnalyticsCard title="운영체제">
                {topOS.map(([name, count]) => (
                  <BarRow key={name} label={name} value={count as number} max={topOS[0]?.[1] as number} />
                ))}
              </AnalyticsCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-2">
      <div className="text-muted-foreground">{icon}</div>
      <p className="text-2xl font-black text-foreground tracking-tight">{value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

function AnalyticsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h4 className="font-bold text-sm text-foreground mb-4">{title}</h4>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-foreground font-medium w-28 truncate shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground font-bold w-10 text-right">{value}</span>
    </div>
  );
}
