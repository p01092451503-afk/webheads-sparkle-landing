import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, RefreshCw, ExternalLink, ArrowUpDown, Search, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface NotFoundLog {
  id: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  session_id: string | null;
  created_at: string;
}

interface Props {
  isSuperAdmin: boolean;
}

export default function Admin404Logs({ isSuperAdmin }: Props) {
  const [logs, setLogs] = useState<NotFoundLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("not_found_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (!error && data) setLogs(data as NotFoundLog[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleDelete = async (id: string) => {
    if (!isSuperAdmin) return;
    setDeleting(id);
    await supabase.from("not_found_logs").delete().eq("id", id);
    setLogs((prev) => prev.filter((l) => l.id !== id));
    setDeleting(null);
  };

  const handleDeleteAll = async () => {
    if (!isSuperAdmin || !confirm("모든 404 로그를 삭제하시겠습니까?")) return;
    setDeleting("all");
    // Delete in batches using IDs
    const ids = logs.map((l) => l.id);
    if (ids.length > 0) {
      await supabase.from("not_found_logs").delete().in("id", ids);
    }
    setLogs([]);
    setDeleting(null);
  };

  const filtered = useMemo(() => {
    let result = logs;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.path.toLowerCase().includes(q) || l.referrer?.toLowerCase().includes(q));
    }
    if (sortAsc) result = [...result].reverse();
    return result;
  }, [logs, search, sortAsc]);

  // Group by path for summary
  const pathSummary = useMemo(() => {
    const map = new Map<string, number>();
    logs.forEach((l) => {
      map.set(l.path, (map.get(l.path) || 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [logs]);

  const getDeviceFromUA = (ua: string | null) => {
    if (!ua) return "–";
    if (/mobile/i.test(ua)) return "📱";
    if (/bot|crawl|spider|slurp/i.test(ua)) return "🤖";
    return "💻";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] font-medium text-muted-foreground mb-1">총 404 건수</p>
          <p className="text-2xl font-bold text-foreground">{logs.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] font-medium text-muted-foreground mb-1">고유 경로</p>
          <p className="text-2xl font-bold text-foreground">{new Set(logs.map((l) => l.path)).size}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] font-medium text-muted-foreground mb-1">오늘</p>
          <p className="text-2xl font-bold text-foreground">
            {logs.filter((l) => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] font-medium text-muted-foreground mb-1">봇 비율</p>
          <p className="text-2xl font-bold text-foreground">
            {logs.length > 0 ? Math.round((logs.filter((l) => /bot|crawl|spider|slurp/i.test(l.user_agent || "")).length / logs.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Top paths */}
      {pathSummary.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-[hsl(220,13%,91%)]">
          <h3 className="text-[13px] font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            자주 발생하는 404 경로 TOP {Math.min(pathSummary.length, 10)}
          </h3>
          <div className="space-y-1.5">
            {pathSummary.map(([path, count]) => (
              <div key={path} className="flex items-center justify-between text-[12px] py-1.5 px-2 rounded-lg hover:bg-[hsl(220,14%,96%)]">
                <code className="font-mono text-foreground truncate max-w-[70%]">{path}</code>
                <span className="font-semibold text-[hsl(0,84%,60%)] shrink-0">{count}회</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="경로 또는 리퍼러 검색..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-[13px] border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(221,83%,53%)]/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-white border border-[hsl(220,13%,91%)] transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortAsc ? "오래된 순" : "최신 순"}
          </button>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-white border border-[hsl(220,13%,91%)] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </button>
          {isSuperAdmin && logs.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deleting === "all"}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium text-[hsl(0,84%,60%)] hover:bg-red-50 border border-red-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              전체 삭제
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)]">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">시간</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">경로</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">리퍼러</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">기기</th>
                {isSuperAdmin && <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-12"></th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">로딩 중...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">404 로그가 없습니다</td></tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="border-b border-[hsl(220,13%,95%)] hover:bg-[hsl(220,14%,98%)] transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {format(new Date(log.created_at), "MM.dd HH:mm", { locale: ko })}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-foreground max-w-[300px] truncate">
                      {log.path}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate hidden md:table-cell">
                      {log.referrer ? (
                        <a href={log.referrer} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
                          {new URL(log.referrer).hostname}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : "–"}
                    </td>
                    <td className="px-4 py-3 text-center">{getDeviceFromUA(log.user_agent)}</td>
                    {isSuperAdmin && (
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(log.id)}
                          disabled={deleting === log.id}
                          className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-[hsl(0,84%,60%)] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-2.5 border-t border-[hsl(220,13%,91%)] text-[11px] text-muted-foreground bg-[hsl(220,14%,98%)]">
            {filtered.length}건 표시 중 (전체 {logs.length}건)
          </div>
        )}
      </div>
    </div>
  );
}
