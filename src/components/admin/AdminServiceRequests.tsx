import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  RefreshCw, Search, Trash2, MessageSquareText, MonitorSmartphone, Clock,
  Building2, User, Phone, Mail, ChevronDown, ChevronUp
} from "lucide-react";
import InquiryVisitorStats from "./InquiryVisitorStats";

type RequestStatus = "new" | "in_progress" | "completed";

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  new: { label: "신규", color: "hsl(0, 84%, 60%)", bg: "hsl(0, 84%, 95%)" },
  in_progress: { label: "처리중", color: "hsl(38, 92%, 50%)", bg: "hsl(38, 92%, 95%)" },
  completed: { label: "완료", color: "hsl(142, 71%, 45%)", bg: "hsl(142, 71%, 95%)" },
};

interface AdminServiceRequestsProps {
  requests: any[];
  setRequests: (r: any[]) => void;
  onRefresh: () => void;
  logActivity: (action: string, targetType?: string, targetId?: string, details?: any) => Promise<void>;
}

export default function AdminServiceRequests({ requests, setRequests, onRefresh, logActivity }: AdminServiceRequestsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (typeFilter !== "all" && r.request_type !== typeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          r.company?.toLowerCase().includes(q) ||
          r.name?.toLowerCase().includes(q) ||
          r.phone?.includes(q)
        );
      }
      return true;
    });
  }, [requests, statusFilter, typeFilter, searchQuery]);

  const updateStatus = async (id: string, status: RequestStatus) => {
    await supabase.from("service_requests").update({ status }).eq("id", id);
    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
    await logActivity("update_service_request_status", "service_request", id, { status });
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from("service_requests").delete().eq("id", id);
    setRequests(requests.filter((r) => r.id !== id));
    await logActivity("delete_service_request", "service_request", id);
    if (expandedId === id) setExpandedId(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 60000;
    if (diff < 60) return `${Math.floor(diff)}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const newCount = requests.filter((r) => r.status === "new").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">고객지원</h2>
          <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted">{requests.length}건</span>
        </div>
        <button onClick={onRefresh} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="회사명, 이름, 전화번호 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap">
          {[
            { key: "all", label: "전체" },
            { key: "sms_recharge", label: "SMS 충전" },
            { key: "remote_support", label: "원격지원" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="w-px bg-border mx-1" />
          {(["all", "new", "in_progress", "completed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? "전체 상태" : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">요청이 없습니다</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => {
            const isExpanded = expandedId === r.id;
            const status = (r.status || "new") as RequestStatus;
            const conf = statusConfig[status] || statusConfig.new;
            const isSms = r.request_type === "sms_recharge";

            return (
              <div
                key={r.id}
                className="rounded-xl bg-card border border-border overflow-hidden transition-all"
                style={{ borderLeftWidth: 3, borderLeftColor: conf.color }}
              >
                {/* Summary row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="shrink-0">
                    {isSms ? (
                      <MessageSquareText className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <MonitorSmartphone className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground truncate">{r.company}</span>
                      <span className="text-xs text-muted-foreground">{r.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {isSms ? `SMS 충전 · ${r.amount || "-"}` : "원격지원 요청"}
                    </div>
                  </div>
                  <span
                    className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{ color: conf.color, background: conf.bg }}
                  >
                    {conf.label}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">{formatDate(r.created_at)}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>

                {/* Detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <DetailRow icon={Building2} label="회사명" value={r.company} />
                      <DetailRow icon={User} label="담당자" value={r.name} />
                      <DetailRow icon={Phone} label="연락처" value={r.phone} />
                      <DetailRow icon={Mail} label="이메일" value={r.email || "-"} />
                      {isSms && <DetailRow icon={MessageSquareText} label="충전 금액" value={r.amount || "-"} />}
                      {!isSms && <DetailRow icon={Clock} label="희망 일시" value={r.preferred_datetime || "-"} />}
                    </div>

                    {!isSms && r.reason && (
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">지원 사유</span>
                        <p className="text-sm text-foreground mt-1 bg-muted p-3 rounded-lg whitespace-pre-wrap">{r.reason}</p>
                      </div>
                    )}

                    {/* Visitor Stats */}
                    <InquiryVisitorStats sessionId={r.session_id} />

                    {/* Status actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs font-semibold text-muted-foreground mr-1">상태:</span>
                      {(["new", "in_progress", "completed"] as RequestStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(r.id, s)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                            status === s
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {statusConfig[s].label}
                        </button>
                      ))}
                      <div className="flex-1" />
                      <button
                        onClick={() => deleteRequest(r.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-foreground truncate">{value}</span>
    </div>
  );
}
