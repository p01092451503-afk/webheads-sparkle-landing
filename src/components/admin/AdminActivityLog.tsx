import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Loader2, RefreshCw, Clock } from "lucide-react";

const actionLabels: Record<string, string> = {
  login: "로그인",
  logout: "로그아웃",
  status_change: "상태 변경",
  note_update: "메모 수정",
  export_csv: "CSV 내보내기",
};

export default function AdminActivityLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("admin_activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setLogs(data || []);
    setLoading(false);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("ko-KR", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>활동 로그</h2>
          <p className="text-[14px] text-muted-foreground mt-1">관리자 활동 기록</p>
        </div>
        <button onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] transition-all hover:bg-card"
          style={{ fontWeight: 500, color: "hsl(var(--muted-foreground))", background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
        >
          <RefreshCw className="w-3 h-3" /> 새로고침
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
            <p className="text-[14px] text-muted-foreground/60" style={{ fontWeight: 500 }}>기록된 활동이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "hsl(var(--border) / 0.5)" }}>
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "hsl(var(--muted))" }}
                >
                  <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-foreground" style={{ fontWeight: 500 }}>
                    {actionLabels[log.action] || log.action}
                    {log.details?.status && (
                      <span className="text-muted-foreground"> → {log.details.status}</span>
                    )}
                    {log.details?.count !== undefined && (
                      <span className="text-muted-foreground"> ({log.details.count}건)</span>
                    )}
                  </p>
                  {log.target_type && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {log.target_type}: {log.target_id?.slice(0, 8)}...
                    </p>
                  )}
                </div>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60 shrink-0">
                  <Clock className="w-3 h-3" />
                  {formatTime(log.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
