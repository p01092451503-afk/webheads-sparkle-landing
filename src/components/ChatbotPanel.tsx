import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/website-chatbot`;

const WELCOME: Record<string, string> = {
  ko: "안녕하세요, WEBHEADS(웹헤즈) 상담 어시스턴트입니다.\n\nLMS 요금제, 서비스 기능, 맞춤 비용 계산 등 무엇이든 질문해주세요.",
  en: "Hello, I'm the WEBHEADS consulting assistant.\n\nAsk me anything about our LMS plans, services, or get a custom cost estimate.",
  ja: "こんにちは、WEBHEADSの相談アシスタントです。\n\nLMSプラン、サービス機能、カスタム費用計算など、何でもご質問ください。",
};

const PLACEHOLDER: Record<string, string> = {
  ko: "질문을 입력하세요...",
  en: "Type your question...",
  ja: "ご質問を入力してください...",
};

const QUICK_QUESTIONS: Record<string, string[]> = {
  ko: ["LMS 요금제 비교", "수강생 200명 비용은?", "DRM이란?", "도입 절차"],
  en: ["Compare LMS plans", "Cost for 200 learners?", "What is DRM?", "Onboarding process"],
  ja: ["LMSプラン比較", "受講生200名の費用は？", "DRMとは？", "導入手順"],
};

async function streamChat({
  messages, lang, onDelta, onDone, onError,
}: {
  messages: Msg[]; lang: string;
  onDelta: (t: string) => void; onDone: (usage?: { total_tokens: number; cost: number }) => void; onError: (e: string) => void;
}) {
  let resp: Response;
  try {
    resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, lang }),
    });
  } catch {
    onError("네트워크 오류가 발생했습니다.");
    return;
  }

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || "오류가 발생했습니다.");
    return;
  }

  if (!resp.body) { onError("스트리밍 불가"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let usage: { total_tokens: number; cost: number } | undefined;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(usage); return; }
      try {
        const p = JSON.parse(json);
        const c = p.choices?.[0]?.delta?.content;
        if (c) onDelta(c);
        // Capture usage from final chunk
        if (p.usage) {
          usage = {
            total_tokens: p.usage.total_tokens || 0,
            cost: p.usage.cost_details?.upstream_inference_cost || p.usage.cost || 0,
          };
        }
      } catch { /* partial */ }
    }
  }
  onDone(usage);
}

function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        let html = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-primary underline">$1</a>');
        if (/^[-•]\s/.test(line)) {
          html = `<span class="ml-2">• ${html.replace(/^[-•]\s/, "")}</span>`;
        }
        if (/^\d+\.\s/.test(line)) {
          html = `<span class="ml-2">${html}</span>`;
        }
        return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>
  );
}

function getSessionId(): string {
  let sid = sessionStorage.getItem("chatbot_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("chatbot_session_id", sid);
  }
  return sid;
}

export default function ChatbotPanel() {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "ko").slice(0, 2);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conversationIdRef = useRef<string | null>(null);
  const tokensAccRef = useRef<number>(0);
  const costAccRef = useRef<number>(0);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  // Save conversation to DB
  const saveConversation = useCallback(async (msgs: Msg[], usage?: { total_tokens: number; cost: number }) => {
    if (msgs.length === 0) return;
    const sessionId = getSessionId();
    const firstUserMsg = msgs.find(m => m.role === "user")?.content || "";
    const userMsgCount = msgs.filter(m => m.role === "user").length;

    try {
      if (conversationIdRef.current) {
        const updateData: any = {
          messages: msgs as any,
          message_count: userMsgCount,
          updated_at: new Date().toISOString(),
        };
        if (usage) {
          // Accumulate tokens/cost with existing values using raw SQL increment
          updateData.total_tokens = (tokensAccRef.current || 0) + usage.total_tokens;
          updateData.total_cost = (costAccRef.current || 0) + usage.cost;
          tokensAccRef.current = updateData.total_tokens;
          costAccRef.current = updateData.total_cost;
        }
        await supabase.from("chatbot_conversations" as any).update(updateData).eq("id", conversationIdRef.current);
      } else {
        const insertData: any = {
          session_id: sessionId,
          language: lang,
          messages: msgs as any,
          message_count: userMsgCount,
          first_message: firstUserMsg.slice(0, 200),
          total_tokens: usage?.total_tokens || 0,
          total_cost: usage?.cost || 0,
        };
        const { data } = await supabase.from("chatbot_conversations" as any).insert(insertData).select("id").single();
        if (data) {
          conversationIdRef.current = (data as any).id;
          tokensAccRef.current = usage?.total_tokens || 0;
          costAccRef.current = usage?.cost || 0;
        }
      }
    } catch (e) {
      console.error("Failed to save conversation:", e);
    }
  }, [lang]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Msg = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    let assistantSoFar = "";
    let finalMessages = newMessages;
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          finalMessages = prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        } else {
          finalMessages = [...prev, { role: "assistant", content: assistantSoFar }];
        }
        return finalMessages;
      });
    };

    await streamChat({
      messages: newMessages,
      lang,
      onDelta: upsert,
      onDone: (usage) => {
        setLoading(false);
        saveConversation(finalMessages, usage);
      },
      onError: (e) => {
        const errorMessages: Msg[] = [...newMessages, { role: "assistant", content: `⚠️ ${e}` }];
        setMessages(errorMessages);
        setLoading(false);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleClear = () => {
    setMessages([]);
    conversationIdRef.current = null;
    tokensAccRef.current = 0;
    costAccRef.current = 0;
  };

  const welcome = WELCOME[lang] || WELCOME.ko;
  const placeholder = PLACEHOLDER[lang] || PLACEHOLDER.ko;
  const quickQs = QUICK_QUESTIONS[lang] || QUICK_QUESTIONS.ko;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-[160px] md:bottom-[140px] right-3 md:right-5 z-50 flex items-center justify-center gap-2 rounded-full bg-foreground text-background shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:scale-105 transition-all duration-200",
          "w-[44px] h-[44px] md:pl-4 md:pr-5 md:w-auto md:h-[48px]",
          open && "hidden"
        )}
        aria-label="AI 상담"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium whitespace-nowrap hidden md:inline">AI 챗봇</span>
      </button>

      {/* Floating chat window */}
      {open && (
        <>
          {/* Mobile overlay backdrop */}
          <div className="fixed inset-0 z-50 bg-black/20 md:bg-transparent md:pointer-events-none animate-fade-in" onClick={() => setOpen(false)} />

          <div className={cn(
            "fixed z-50 flex flex-col bg-background shadow-2xl border border-border overflow-hidden",
            // Mobile: full screen
            "inset-0 rounded-none",
            // Desktop: floating popup with origin bottom-right
            "md:inset-auto md:bottom-[200px] md:right-5 md:w-[400px] md:h-[560px] md:rounded-2xl",
            // Animation
            "animate-[scale-in_0.25s_ease-out] md:origin-bottom-right"
          )}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-primary/5 shrink-0">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground">{lang === "ko" ? "웹헤즈 AI" : "WEBHEADS AI"}</h3>
                <p className="text-xs text-muted-foreground">
                  {lang === "en" ? "Online" : lang === "ja" ? "オンライン" : "온라인"}
                </p>
              </div>
              <button
                onClick={handleClear}
                className="p-2 rounded-md hover:bg-muted text-muted-foreground active:bg-muted/80"
                title="대화 초기화"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-muted text-muted-foreground active:bg-muted/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 md:px-4 py-4 space-y-3 md:space-y-4 overscroll-contain">
              {/* Welcome */}
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[85%]">
                  <SimpleMarkdown text={welcome} />
                </div>
              </div>

              {/* Quick questions */}
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-1.5 md:gap-2 pl-9">
                  {quickQs.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs px-2.5 md:px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/5 active:bg-primary/10 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Conversation */}
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-2", m.role === "user" && "justify-end")}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-3 md:px-3.5 py-2.5 max-w-[85%]",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted rounded-tl-sm"
                    )}
                  >
                    {m.role === "assistant" ? <SimpleMarkdown text={m.content} /> : <p className="text-sm">{m.content}</p>}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-foreground/60" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading */}
              {loading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border px-3 md:px-4 py-2.5 md:py-3 pb-[calc(0.625rem+env(safe-area-inset-bottom))] md:pb-3 shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  rows={1}
                  className="flex-1 resize-none bg-muted rounded-xl px-3.5 py-2.5 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 max-h-24 overflow-y-auto"
                  disabled={loading}
                />
                <Button
                  size="icon"
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className="rounded-xl h-10 w-10 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 md:mt-1.5 text-center">
                {lang === "en" ? "AI responses may not be 100% accurate." : lang === "ja" ? "AI回答は100%正確ではない場合があります。" : "AI 응답은 100% 정확하지 않을 수 있습니다."}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
