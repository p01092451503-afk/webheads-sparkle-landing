import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Loader2, RefreshCw, Clock } from "lucide-react";

const actionLabels: Record<string, string> = {
  login: "로그인",
  logout: "로그아웃",
  status_change: "상태 변경",
  note_update: "메모 수정",
  export_csv: "CSV 내보내기",
  delete: "삭제",
};

const actionColors: Record<string, string> = {
  login: "hsl(221, 83%, 53%)",
  logout: "hsl(220, 9%, 46%)",
  status_change: "hsl(37, 90%, 51%)",
  note_update: "hsl(152, 57%, 42%)",
  export_csv: "hsl(262, 60%, 55%)",
  delete: "hsl(0, 84%, 60%)",
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
    <div className="flex flex-col gap-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground">활동 로그</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">관리자 활동 기록</p>
        </div>
        <button onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-muted-foreground bg-white border border-[hsl(220,13%,91%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> 새로고침
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
            <p className="text-[13px] text-muted-foreground/50 font-medium">기록된 활동이 없습니다</p>
          </div>
        ) : (
          <div>
            {logs.map((log, idx) => {
              const color = actionColors[log.action] || "hsl(220, 9%, 46%)";
              return (
                <div key={log.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[hsl(220,14%,97%)] transition-colors"
                  style={{ borderBottom: idx < logs.length - 1 ? "1px solid hsl(220, 13%, 95%)" : "none" }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}12`, color }}
                  >
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground">
                      {actionLabels[log.action] || log.action}
                      {log.details?.status && (
                        <span className="text-muted-foreground font-normal"> → {log.details.status}</span>
                      )}
                      {log.details?.count !== undefined && (
                        <span className="text-muted-foreground font-normal"> ({log.details.count}건)</span>
                      )}
                    </p>
                    {log.target_type && (
                      <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                        {log.target_type}: {log.target_id?.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground/50 shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatTime(log.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
