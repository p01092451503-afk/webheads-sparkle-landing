import React, { Component, ErrorInfo } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Throttle: max 1 Slack alert per 5 minutes
let lastSlackAlert = 0;
const THROTTLE_MS = 5 * 60 * 1000;

async function sendErrorToSlack(error: string, source: string, extra?: Record<string, string>) {
  const now = Date.now();
  if (now - lastSlackAlert < THROTTLE_MS) return;
  lastSlackAlert = now;

  try {
    await supabase.functions.invoke("send-slack-notification", {
      body: {
        type: "site_error",
        title: "사이트 오류 감지",
        urgency: "high",
        details: {
          "오류": error.slice(0, 300),
          "발생 위치": source,
          "페이지": window.location.pathname,
          "시간": new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
          "User-Agent": navigator.userAgent.slice(0, 100),
          ...extra,
        },
      },
    });
  } catch {
    // Silent fail – don't cascade errors
  }
}

// Global unhandled error listener
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    sendErrorToSlack(
      event.message || String(event.error),
      event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : "global",
    );
  });

  window.addEventListener("unhandledrejection", (event) => {
    const msg = event.reason instanceof Error ? event.reason.message : String(event.reason);
    sendErrorToSlack(msg, "unhandledrejection");
  });
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    sendErrorToSlack(error.message, "React ErrorBoundary", {
      "컴포넌트 스택": (errorInfo.componentStack || "").slice(0, 200),
    });
  }

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || "알 수 없는 오류";
      const errorStack = this.state.error?.stack || "";
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="text-center max-w-lg">
            <h1 className="text-2xl font-bold text-foreground mb-4">오류가 발생했습니다</h1>
            <p className="text-muted-foreground mb-4">
              일시적인 오류가 발생했습니다. 페이지를 새로고침해 주세요.
            </p>
            <details className="text-left mb-4 p-3 rounded-lg bg-muted text-[12px] text-muted-foreground">
              <summary className="cursor-pointer font-medium">오류 상세</summary>
              <p className="mt-2 font-mono break-all">{errorMsg}</p>
              <pre className="mt-1 text-[10px] overflow-auto max-h-40 whitespace-pre-wrap">{errorStack}</pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
