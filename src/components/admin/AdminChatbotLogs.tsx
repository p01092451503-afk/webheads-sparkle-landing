import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Loader2, Eye, EyeOff, Trash2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { ko } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface AdminChatbotLogsProps {
  isSuperAdmin: boolean;
}

interface Conversation {
  id: string;
  session_id: string | null;
  language: string;
  messages: { role: string; content: string }[];
  message_count: number;
  first_message: string | null;
  total_tokens: number | null;
  total_cost: number | null;
  created_at: string;
  updated_at: string;
}

function DailyCostChart({ conversations }: { conversations: Conversation[] }) {
  const chartData = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });
    const map = new Map<string, { cost: number; tokens: number; count: number }>();
    days.forEach(d => map.set(format(d, "yyyy-MM-dd"), { cost: 0, tokens: 0, count: 0 }));

    conversations.forEach(c => {
      const key = c.created_at.slice(0, 10);
      const entry = map.get(key);
      if (entry) {
        entry.cost += Number(c.total_cost) || 0;
        entry.tokens += c.total_tokens || 0;
        entry.count += 1;
      }
    });

    return days.map(d => {
      const key = format(d, "yyyy-MM-dd");
      const e = map.get(key)!;
      return { date: format(d, "M/d"), cost: Number(e.cost.toFixed(4)), tokens: e.tokens, count: e.count };
    });
  }, [conversations]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[hsl(220,13%,91%)]">
      <h3 className="text-sm font-bold text-foreground mb-4">일별 비용 추이 (최근 30일)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} width={50} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid hsl(220,13%,91%)" }}
            formatter={(value: number, name: string) => {
              if (name === "cost") return [`$${value.toFixed(4)} (≈${Math.round(value * 1400)}원)`, "비용"];
              return [value, name];
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Bar dataKey="cost" fill="hsl(221,83%,53%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2">
        <span className="text-[11px] text-muted-foreground">
          30일 합계: <strong className="text-foreground">${chartData.reduce((s, d) => s + d.cost, 0).toFixed(4)}</strong>
        </span>
        <span className="text-[11px] text-muted-foreground">
          30일 토큰: <strong className="text-foreground">{chartData.reduce((s, d) => s + d.tokens, 0).toLocaleString()}</strong>
        </span>
        <span className="text-[11px] text-muted-foreground">
          30일 대화: <strong className="text-foreground">{chartData.reduce((s, d) => s + d.count, 0)}</strong>
        </span>
      </div>
    </div>
  );
}

export default function AdminChatbotLogs({ isSuperAdmin }: AdminChatbotLogsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAiIds, setShowAiIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chatbot_conversations" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (!error && data) {
      setConversations(data as any);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const handleDelete = async (id: string) => {
    if (!isSuperAdmin) return;
    setDeleting(id);
    await supabase.from("chatbot_conversations" as any).delete().eq("id", id);
    setConversations(prev => prev.filter(c => c.id !== id));
    setDeleting(null);
  };

  // Stats
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = conversations.filter(c => c.created_at.slice(0, 10) === today).length;
  const totalMessages = conversations.reduce((acc, c) => acc + (c.message_count || 0), 0);
  const totalTokens = conversations.reduce((acc, c) => acc + (c.total_tokens || 0), 0);
  const totalCost = conversations.reduce((acc, c) => acc + (Number(c.total_cost) || 0), 0);
  const langStats = conversations.reduce((acc, c) => {
    acc[c.language] = (acc[c.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] text-muted-foreground font-medium">전체 대화</p>
          <p className="text-2xl font-bold text-foreground mt-1">{conversations.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] text-muted-foreground font-medium">오늘 대화</p>
          <p className="text-2xl font-bold text-foreground mt-1">{todayCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] text-muted-foreground font-medium">총 질문 수</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalMessages}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] text-muted-foreground font-medium">총 토큰</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalTokens.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] text-muted-foreground font-medium">총 비용</p>
          <p className="text-2xl font-bold text-foreground mt-1">${totalCost.toFixed(4)}</p>
          <p className="text-[10px] text-muted-foreground">≈ {Math.round(totalCost * 1400).toLocaleString()}원</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] text-muted-foreground font-medium">토큰당 비용</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {totalTokens > 0 ? `$${(totalCost / totalTokens * 1000).toFixed(4)}` : "-"}
          </p>
          <p className="text-[10px] text-muted-foreground">per 1K tokens</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] text-muted-foreground font-medium">대화당 평균</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {conversations.length > 0 ? `$${(totalCost / conversations.length).toFixed(4)}` : "-"}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {conversations.length > 0 ? `≈ ${Math.round((totalCost / conversations.length) * 1400)}원` : ""}
          </p>
        </div>
      </div>

      {/* Daily Cost Chart */}
      {conversations.length > 0 && <DailyCostChart conversations={conversations} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          챗봇 대화 내역
        </h2>
        <button
          onClick={fetchConversations}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-[hsl(220,14%,93%)] transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          새로고침
        </button>
      </div>

      {/* Conversation List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          아직 챗봇 대화 기록이 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const isExpanded = expandedId === conv.id;
            return (
              <div key={conv.id} className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] overflow-hidden">
                {/* Summary row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : conv.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[hsl(220,14%,98%)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {conv.first_message || "(빈 대화)"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">
                        {format(new Date(conv.created_at), "M/d HH:mm", { locale: ko })}
                      </span>
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <span className="text-[11px] text-muted-foreground">
                        {conv.message_count}개 질문
                      </span>
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[hsl(220,14%,96%)] text-muted-foreground">
                        {conv.language?.toUpperCase()}
                      </span>
                      {(conv.total_tokens || 0) > 0 && (
                        <>
                          <span className="text-[11px] text-muted-foreground">·</span>
                          <span className="text-[11px] text-muted-foreground">
                            {(conv.total_tokens || 0).toLocaleString()} 토큰
                          </span>
                          <span className="text-[11px] text-muted-foreground">·</span>
                          <span className="text-[11px] font-semibold text-primary">
                            ${(Number(conv.total_cost) || 0).toFixed(4)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {/* Expanded messages */}
                {isExpanded && (
                  <div className="border-t border-[hsl(220,13%,91%)] px-4 py-3 space-y-3 bg-[hsl(220,14%,98%)]">
                    <div className="flex justify-between items-center mb-2">
                      <button
                        onClick={() => setShowAiIds(prev => {
                          const next = new Set(prev);
                          if (next.has(conv.id)) next.delete(conv.id);
                          else next.add(conv.id);
                          return next;
                        })}
                        className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-[hsl(220,14%,93%)]"
                      >
                        {showAiIds.has(conv.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {showAiIds.has(conv.id) ? "AI 답변 숨기기" : "AI 답변 보기"}
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDelete(conv.id)}
                          disabled={deleting === conv.id}
                          className="flex items-center gap-1 text-[12px] text-red-500 hover:text-red-700 transition-colors"
                        >
                          {deleting === conv.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          삭제
                        </button>
                      )}
                    </div>
                    {(conv.messages || [])
                      .filter(m => m.role === "user" || showAiIds.has(conv.id))
                      .map((m, i) => (
                      <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                        <div
                          className={`rounded-xl px-3 py-2 max-w-[85%] text-sm ${
                            m.role === "user"
                              ? "bg-primary/10 text-foreground"
                              : "bg-white border border-[hsl(220,13%,91%)] text-foreground"
                          }`}
                        >
                          <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                            {m.role === "user" ? "사용자" : "AI"}
                          </p>
                          <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{m.content}</p>
                        </div>
                      </div>
                    ))}
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
