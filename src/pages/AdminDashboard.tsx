import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut, MessageSquare, BarChart3, Eye, Smartphone, Monitor, Tablet,
  Globe, Clock, X, Loader2, RefreshCw, ChevronRight, Phone,
  Mail, Building2, User, FileText, Calendar, ArrowUpRight, Search, Filter
} from "lucide-react";

type Tab = "inquiries" | "analytics";
type InquiryStatus = "new" | "in_progress" | "completed" | "archived";

const statusConfig: Record<InquiryStatus, { label: string; color: string; bg: string; dot: string }> = {
  new: { label: "신규", color: "hsl(214, 90%, 52%)", bg: "hsl(214 90% 52% / 0.08)", dot: "hsl(214, 90%, 52%)" },
  in_progress: { label: "진행중", color: "hsl(35, 90%, 50%)", bg: "hsl(35 90% 50% / 0.08)", dot: "hsl(35, 90%, 50%)" },
  completed: { label: "완료", color: "hsl(150, 60%, 42%)", bg: "hsl(150 60% 42% / 0.08)", dot: "hsl(150, 60%, 42%)" },
  archived: { label: "보관", color: "hsl(var(--muted-foreground))", bg: "hsl(var(--muted))", dot: "hsl(var(--muted-foreground))" },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("inquiries");
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState(7);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { checkAuth(); }, []);
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

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (statusFilter !== "all" && inq.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          inq.company?.toLowerCase().includes(q) ||
          inq.name?.toLowerCase().includes(q) ||
          inq.phone?.includes(q) ||
          inq.email?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inquiries, statusFilter, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: inquiries.length };
    inquiries.forEach((inq) => { counts[inq.status] = (counts[inq.status] || 0) + 1; });
    return counts;
  }, [inquiries]);

  // Analytics
  const totalViews = pageViews.length;
  const uniqueSessions = new Set(pageViews.map((v) => v.session_id)).size;
  const pageCounts = pageViews.reduce((acc, v) => { acc[v.page_path] = (acc[v.page_path] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topPages = Object.entries(pageCounts).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 8);
  const browserCounts = pageViews.reduce((acc, v) => { acc[v.browser || "Unknown"] = (acc[v.browser || "Unknown"] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topBrowsers = Object.entries(browserCounts).sort(([, a], [, b]) => (b as number) - (a as number));
  const deviceCounts = pageViews.reduce((acc, v) => { acc[v.device_type || "unknown"] = (acc[v.device_type || "unknown"] || 0) + 1; return acc; }, {} as Record<string, number>);
  const osCounts = pageViews.reduce((acc, v) => { acc[v.os || "Unknown"] = (acc[v.os || "Unknown"] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topOS = Object.entries(osCounts).sort(([, a], [, b]) => (b as number) - (a as number));
  const referrerCounts = pageViews.reduce((acc, v) => {
    try { const ref = v.referrer ? new URL(v.referrer).hostname : "직접 방문"; acc[ref] = (acc[ref] || 0) + 1; } catch { acc["기타"] = (acc["기타"] || 0) + 1; }
    return acc;
  }, {} as Record<string, number>);
  const topReferrers = Object.entries(referrerCounts).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 8);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);
    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHr < 24) return `${diffHr}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--muted))" }}>
      {/* Top Navigation Bar */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "hsl(var(--background) / 0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderColor: "hsl(var(--border) / 0.6)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-[17px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>
              WEBHEADS
            </h1>
            <div className="h-5 w-px bg-border" />
            <div className="flex gap-1">
              {[
                { key: "inquiries" as Tab, icon: MessageSquare, label: "문의 관리" },
                { key: "analytics" as Tab, icon: BarChart3, label: "접속 분석" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] transition-all duration-200"
                  style={{
                    fontWeight: tab === t.key ? 600 : 500,
                    color: tab === t.key ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                    background: tab === t.key ? "hsl(var(--muted))" : "transparent",
                  }}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                  {t.key === "inquiries" && statusCounts.new > 0 && (
                    <span
                      className="ml-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[11px]"
                      style={{
                        fontWeight: 700,
                        background: "hsl(0 84% 60%)",
                        color: "white",
                        padding: "0 5px",
                      }}
                    >
                      {statusCounts.new}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] transition-all hover:bg-muted"
            style={{ fontWeight: 500, color: "hsl(var(--muted-foreground))" }}
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : tab === "inquiries" ? (
          <div className="flex flex-col gap-6">
            {/* Inquiry Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>
                  문의 관리
                </h2>
                <p className="text-[14px] text-muted-foreground mt-1" style={{ letterSpacing: "-0.01em" }}>
                  총 {inquiries.length}건의 문의가 있습니다
                </p>
              </div>
              <button
                onClick={fetchInquiries}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] transition-all hover:bg-card"
                style={{
                  fontWeight: 500,
                  color: "hsl(var(--muted-foreground))",
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                새로고침
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[240px] max-w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="회사명, 이름, 연락처로 검색..."
                  className="w-full rounded-xl pl-11 pr-4 py-2.5 text-[13px] outline-none transition-all text-foreground placeholder:text-muted-foreground/40"
                  style={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--primary))"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(var(--primary) / 0.06)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <div className="flex gap-1.5">
                {(["all", "new", "in_progress", "completed", "archived"] as const).map((s) => {
                  const cfg = s === "all" ? { label: "전체", color: "hsl(var(--foreground))", bg: "hsl(var(--foreground) / 0.06)" } : statusConfig[s];
                  const isActive = statusFilter === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] transition-all"
                      style={{
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? cfg.color : "hsl(var(--muted-foreground))",
                        background: isActive ? cfg.bg : "transparent",
                        border: isActive ? "none" : "none",
                      }}
                    >
                      {s !== "all" && (
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: (cfg as any).dot || cfg.color }} />
                      )}
                      {cfg.label}
                      <span className="text-[11px]" style={{ opacity: 0.6 }}>
                        {statusCounts[s] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inquiry List + Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* List */}
              <div className="lg:col-span-3 flex flex-col gap-2">
                {filteredInquiries.length === 0 ? (
                  <div
                    className="rounded-2xl py-20 text-center"
                    style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                  >
                    <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-[14px] text-muted-foreground">
                      {searchQuery || statusFilter !== "all" ? "조건에 맞는 문의가 없습니다" : "접수된 문의가 없습니다"}
                    </p>
                  </div>
                ) : (
                  filteredInquiries.map((inq) => {
                    const sc = statusConfig[inq.status as InquiryStatus] || statusConfig.new;
                    const isSelected = selectedInquiry?.id === inq.id;
                    return (
                      <div
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className="group rounded-2xl p-5 cursor-pointer transition-all duration-200"
                        style={{
                          background: isSelected ? "hsl(var(--background))" : "hsl(var(--background))",
                          border: isSelected
                            ? "1.5px solid hsl(var(--primary))"
                            : "1px solid hsl(var(--border) / 0.8)",
                          boxShadow: isSelected
                            ? "0 0 0 3px hsl(var(--primary) / 0.06), 0 2px 8px hsl(var(--primary) / 0.08)"
                            : "0 1px 3px hsl(0 0% 0% / 0.02)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.boxShadow = "0 2px 12px hsl(0 0% 0% / 0.06)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.boxShadow = "0 1px 3px hsl(0 0% 0% / 0.02)";
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg"
                                style={{ fontWeight: 600, color: sc.color, background: sc.bg }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                                {sc.label}
                              </span>
                              <span
                                className="text-[11px] px-2 py-0.5 rounded-md"
                                style={{
                                  fontWeight: 500,
                                  color: "hsl(var(--muted-foreground))",
                                  background: "hsl(var(--muted))",
                                }}
                              >
                                {inq.inquiry_type === "demo" ? "데모" : "상담"}
                              </span>
                            </div>
                            <p className="text-[15px] text-foreground tracking-[-0.02em]" style={{ fontWeight: 600 }}>
                              {inq.company}
                              <span className="text-muted-foreground" style={{ fontWeight: 400 }}> · {inq.name}</span>
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {inq.phone}
                              </span>
                              {inq.email && (
                                <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                                  <Mail className="w-3 h-3" />
                                  {inq.email}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-[11px] text-muted-foreground/70">
                              {formatDate(inq.created_at)}
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors mt-2" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Detail Panel */}
              <div className="lg:col-span-2">
                {selectedInquiry ? (
                  <div
                    className="rounded-2xl p-6 sticky top-24"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[16px] text-foreground tracking-[-0.03em]" style={{ fontWeight: 700 }}>
                        문의 상세
                      </h3>
                      <button
                        onClick={() => setSelectedInquiry(null)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-muted"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      <DetailRow icon={Building2} label="회사명" value={selectedInquiry.company} />
                      <DetailRow icon={User} label="담당자" value={selectedInquiry.name} />
                      <DetailRow icon={Phone} label="연락처" value={selectedInquiry.phone} isLink href={`tel:${selectedInquiry.phone}`} />
                      {selectedInquiry.email && (
                        <DetailRow icon={Mail} label="이메일" value={selectedInquiry.email} isLink href={`mailto:${selectedInquiry.email}`} />
                      )}
                      {selectedInquiry.service && (
                        <DetailRow icon={FileText} label="관심 서비스" value={selectedInquiry.service} />
                      )}
                      <DetailRow icon={Calendar} label="접수일" value={new Date(selectedInquiry.created_at).toLocaleString("ko-KR")} />

                      {selectedInquiry.message && (
                        <div className="mt-1">
                          <p className="text-[11px] text-muted-foreground mb-2" style={{ fontWeight: 600, letterSpacing: "0.02em" }}>
                            문의 내용
                          </p>
                          <div
                            className="rounded-xl p-4 text-[13px] leading-relaxed text-foreground whitespace-pre-wrap"
                            style={{
                              background: "hsl(var(--muted))",
                              border: "1px solid hsl(var(--border) / 0.5)",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {selectedInquiry.message}
                          </div>
                        </div>
                      )}

                      {/* Status Control */}
                      <div className="mt-2 pt-4" style={{ borderTop: "1px solid hsl(var(--border) / 0.6)" }}>
                        <p className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 600, letterSpacing: "0.02em" }}>
                          상태 변경
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {(Object.keys(statusConfig) as InquiryStatus[]).map((s) => {
                            const cfg = statusConfig[s];
                            const isActive = selectedInquiry.status === s;
                            return (
                              <button
                                key={s}
                                onClick={() => updateStatus(selectedInquiry.id, s)}
                                className="py-2.5 rounded-xl text-[12px] transition-all duration-200 active:scale-[0.96]"
                                style={{
                                  fontWeight: isActive ? 600 : 500,
                                  color: isActive ? cfg.color : "hsl(var(--muted-foreground))",
                                  background: isActive ? cfg.bg : "hsl(var(--muted))",
                                  border: isActive ? `1.5px solid ${cfg.color}30` : "1.5px solid transparent",
                                }}
                              >
                                {cfg.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl py-20 text-center"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px dashed hsl(var(--border))",
                    }}
                  >
                    <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
                    <p className="text-[14px] text-muted-foreground/60" style={{ fontWeight: 500 }}>
                      좌측에서 문의를 선택하세요
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Analytics Tab */
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>
                  접속 분석
                </h2>
                <p className="text-[14px] text-muted-foreground mt-1">
                  최근 {dateRange}일간의 방문 데이터
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
                  {[7, 14, 30].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDateRange(d)}
                      className="px-3.5 py-1.5 rounded-lg text-[12px] transition-all"
                      style={{
                        fontWeight: dateRange === d ? 600 : 500,
                        color: dateRange === d ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                        background: dateRange === d ? "hsl(var(--foreground))" : "transparent",
                      }}
                    >
                      {d}일
                    </button>
                  ))}
                </div>
                <button
                  onClick={fetchPageViews}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] transition-all hover:bg-card"
                  style={{
                    fontWeight: 500,
                    color: "hsl(var(--muted-foreground))",
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <RefreshCw className="w-3 h-3" />
                  새로고침
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard icon={<Eye className="w-5 h-5" />} label="페이지뷰" value={totalViews} color="hsl(214, 90%, 52%)" />
              <MetricCard icon={<Globe className="w-5 h-5" />} label="고유 세션" value={uniqueSessions} color="hsl(150, 60%, 42%)" />
              <MetricCard icon={<Smartphone className="w-5 h-5" />} label="모바일" value={deviceCounts.mobile || 0} color="hsl(35, 90%, 50%)" />
              <MetricCard icon={<Monitor className="w-5 h-5" />} label="데스크톱" value={deviceCounts.desktop || 0} color="hsl(260, 70%, 55%)" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChartCard title="인기 페이지" icon={<Eye className="w-4 h-4" />}>
                {topPages.length === 0 ? <EmptyChart /> : topPages.map(([path, count], i) => (
                  <TossBarRow key={path} rank={i + 1} label={path} value={count as number} max={topPages[0]?.[1] as number} color="hsl(214, 90%, 52%)" />
                ))}
              </ChartCard>
              <ChartCard title="유입 경로" icon={<ArrowUpRight className="w-4 h-4" />}>
                {topReferrers.length === 0 ? <EmptyChart /> : topReferrers.map(([ref, count], i) => (
                  <TossBarRow key={ref} rank={i + 1} label={ref} value={count as number} max={topReferrers[0]?.[1] as number} color="hsl(150, 60%, 42%)" />
                ))}
              </ChartCard>
              <ChartCard title="브라우저" icon={<Globe className="w-4 h-4" />}>
                {topBrowsers.map(([name, count], i) => (
                  <TossBarRow key={name} rank={i + 1} label={name} value={count as number} max={topBrowsers[0]?.[1] as number} color="hsl(35, 90%, 50%)" />
                ))}
              </ChartCard>
              <ChartCard title="운영체제" icon={<Monitor className="w-4 h-4" />}>
                {topOS.map(([name, count], i) => (
                  <TossBarRow key={name} rank={i + 1} label={name} value={count as number} max={topOS[0]?.[1] as number} color="hsl(260, 70%, 55%)" />
                ))}
              </ChartCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Sub Components ─── */

function DetailRow({ icon: Icon, label, value, isLink, href }: {
  icon: any; label: string; value: string; isLink?: boolean; href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: "hsl(var(--muted))" }}
      >
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>{label}</p>
        {isLink && href ? (
          <a href={href} className="text-[14px] text-primary hover:underline" style={{ fontWeight: 500, letterSpacing: "-0.01em" }}>
            {value}
          </a>
        ) : (
          <p className="text-[14px] text-foreground" style={{ fontWeight: 500, letterSpacing: "-0.01em" }}>{value}</p>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: number; color: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}10`, color }}>
        {icon}
      </div>
      <div>
        <p className="text-[28px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>
          {value.toLocaleString()}
        </p>
        <p className="text-[12px] text-muted-foreground mt-0.5" style={{ fontWeight: 500 }}>{label}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[14px] text-foreground tracking-[-0.02em]" style={{ fontWeight: 600 }}>{title}</h4>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function TossBarRow({ rank, label, value, max, color }: {
  rank: number; label: string; value: number; max: number; color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] w-5 text-center text-muted-foreground/50" style={{ fontWeight: 600 }}>
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] text-foreground truncate" style={{ fontWeight: 500, letterSpacing: "-0.01em" }}>
            {label}
          </span>
          <span className="text-[12px] text-foreground shrink-0 ml-2" style={{ fontWeight: 600 }}>
            {value}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${color}10` }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <p className="text-[13px] text-muted-foreground/50 text-center py-6" style={{ fontWeight: 500 }}>
      데이터가 없습니다
    </p>
  );
}
