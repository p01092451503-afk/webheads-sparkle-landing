import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Loader2, Eye, Trash2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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

export default function AdminChatbotLogs({ isSuperAdmin }: AdminChatbotLogsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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
  const langStats = conversations.reduce((acc, c) => {
    acc[c.language] = (acc[c.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
          <p className="text-[11px] text-muted-foreground font-medium">언어 분포</p>
          <div className="flex gap-2 mt-1">
            {Object.entries(langStats).map(([l, c]) => (
              <span key={l} className="text-xs font-semibold text-muted-foreground">
                {l.toUpperCase()}: {c as number}
              </span>
            ))}
          </div>
        </div>
      </div>

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
                    <div className="flex items-center gap-2 mt-0.5">
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
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {/* Expanded messages */}
                {isExpanded && (
                  <div className="border-t border-[hsl(220,13%,91%)] px-4 py-3 space-y-3 bg-[hsl(220,14%,98%)]">
                    {(conv.messages || []).map((m, i) => (
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
                    {isSuperAdmin && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleDelete(conv.id)}
                          disabled={deleting === conv.id}
                          className="flex items-center gap-1 text-[12px] text-red-500 hover:text-red-700 transition-colors"
                        >
                          {deleting === conv.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          삭제
                        </button>
                      </div>
                    )}
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
