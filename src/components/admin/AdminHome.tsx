import { useMemo } from "react";
import {
  MessageSquare, Eye, TrendingUp, ArrowUpRight, ChevronRight,
  Clock, Phone, Building2
} from "lucide-react";

interface AdminHomeProps {
  inquiries: any[];
  pageViews: any[];
  onNavigate: (tab: any) => void;
}

export default function AdminHome({ inquiries, pageViews, onNavigate }: AdminHomeProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayInquiries = inquiries.filter((i) => new Date(i.created_at) >= today);
  const newInquiries = inquiries.filter((i) => i.status === "new");
  const todayViews = pageViews.filter((v) => new Date(v.created_at) >= today);
  const todaySessions = new Set(todayViews.map((v) => v.session_id)).size;

  // Conversion rate: inquiries / unique sessions (30 days)
  const totalSessions30d = new Set(pageViews.map((v) => v.session_id)).size;
  const conversionRate = totalSessions30d > 0 ? ((inquiries.length / totalSessions30d) * 100).toFixed(1) : "0.0";

  // Recent 5 inquiries
  const recentInquiries = inquiries.slice(0, 5);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 1) return "방금 전";
    if (diff < 60) return `${diff}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    return `${Math.floor(diff / 1440)}일 전`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <h2 className="text-[24px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>
          안녕하세요 👋
        </h2>
        <p className="text-[14px] text-muted-foreground mt-1">
          오늘의 현황을 확인하세요
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="오늘 문의"
          value={todayInquiries.length}
          sub={`신규 ${newInquiries.length}건`}
          color="hsl(214, 90%, 52%)"
          icon={<MessageSquare className="w-5 h-5" />}
        />
        <MetricCard
          label="오늘 방문"
          value={todayViews.length}
          sub={`${todaySessions} 세션`}
          color="hsl(150, 60%, 42%)"
          icon={<Eye className="w-5 h-5" />}
        />
        <MetricCard
          label="전환율"
          value={`${conversionRate}%`}
          sub="방문 → 문의"
          color="hsl(35, 90%, 50%)"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          label="총 문의"
          value={inquiries.length}
          sub="전체 누적"
          color="hsl(260, 70%, 55%)"
          icon={<Building2 className="w-5 h-5" />}
        />
      </div>

      {/* Recent Inquiries + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Inquiries */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] text-foreground tracking-[-0.02em]" style={{ fontWeight: 600 }}>
              최근 문의
            </h3>
            <button
              onClick={() => onNavigate("inquiries")}
              className="flex items-center gap-1 text-[12px] text-primary transition-colors hover:underline"
              style={{ fontWeight: 500 }}
            >
              전체 보기 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {recentInquiries.length === 0 ? (
            <div className="text-center py-10 text-[13px] text-muted-foreground/50">접수된 문의가 없습니다</div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => onNavigate("inquiries")}
                  className="flex items-center gap-4 p-3.5 rounded-xl cursor-pointer transition-all hover:bg-muted/50"
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: inq.status === "new" ? "hsl(214, 90%, 52%)"
                        : inq.status === "in_progress" ? "hsl(35, 90%, 50%)"
                        : inq.status === "completed" ? "hsl(150, 60%, 42%)"
                        : "hsl(var(--muted-foreground))",
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-foreground truncate" style={{ fontWeight: 500 }}>
                      {inq.company} · {inq.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> {inq.phone}
                      {inq.service && <span>· {inq.service}</span>}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground/60 shrink-0">{formatTime(inq.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Summary */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
        >
          <h3 className="text-[15px] text-foreground tracking-[-0.02em] mb-5" style={{ fontWeight: 600 }}>
            문의 현황
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "신규", count: inquiries.filter(i => i.status === "new").length, color: "hsl(214, 90%, 52%)" },
              { label: "진행중", count: inquiries.filter(i => i.status === "in_progress").length, color: "hsl(35, 90%, 50%)" },
              { label: "완료", count: inquiries.filter(i => i.status === "completed").length, color: "hsl(150, 60%, 42%)" },
              { label: "보관", count: inquiries.filter(i => i.status === "archived").length, color: "hsl(var(--muted-foreground))" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[13px] text-foreground" style={{ fontWeight: 500 }}>{s.label}</span>
                </div>
                <span className="text-[15px] text-foreground" style={{ fontWeight: 700 }}>{s.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid hsl(var(--border) / 0.6)" }}>
            <button
              onClick={() => onNavigate("analytics")}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] transition-all hover:bg-muted"
              style={{ fontWeight: 500, color: "hsl(var(--primary))" }}
            >
              <ArrowUpRight className="w-4 h-4" />
              접속 분석 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, color, icon }: {
  label: string; value: number | string; sub: string; color: string; icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}10`, color }}>
        {icon}
      </div>
      <div>
        <p className="text-[28px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-[12px] text-muted-foreground mt-0.5" style={{ fontWeight: 500 }}>{label}</p>
        <p className="text-[11px] text-muted-foreground/60 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}
