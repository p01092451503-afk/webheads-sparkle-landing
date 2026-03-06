import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  inquiry: any;
}

type AnalysisState = "idle" | "analyzing" | "done" | "error";

export default function InquiryAIAnalysis({ inquiry }: Props) {
  const [state, setState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [expanded, setExpanded] = useState(true);

  const analyze = async () => {
    setState("analyzing");
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-inquiry", {
        body: { inquiry },
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      setResult(data.analysis);
      setState("done");
    } catch (e: any) {
      setError(e.message || "분석 중 오류가 발생했습니다.");
      setState("error");
    }
  };

  if (state === "idle") {
    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <button
          onClick={analyze}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all active:scale-[0.97] hover:opacity-90"
          style={{ background: "linear-gradient(135deg, hsl(262, 83%, 58%), hsl(221, 83%, 53%))" }}
        >
          <Sparkles className="w-4 h-4" />
          AI 제안 전략 분석
        </button>
      </div>
    );
  }

  if (state === "analyzing") {
    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <div className="flex items-center gap-3 px-4 py-4 rounded-xl border border-[hsl(262,60%,90%)] bg-[hsl(262,60%,97%)]">
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[hsl(262,83%,58%)]" />
            <Loader2 className="w-3 h-3 animate-spin text-[hsl(262,83%,58%)] absolute -bottom-0.5 -right-0.5" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[hsl(262,83%,58%)]">AI 분석 중...</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">문의 내용을 요금제와 대조하여 제안 전략을 생성하고 있습니다</p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[hsl(0,84%,90%)] bg-[hsl(0,84%,97%)]">
          <p className="text-[13px] text-[hsl(0,84%,50%)]">❌ {error}</p>
          <button onClick={analyze} className="text-[12px] font-semibold text-[hsl(221,83%,53%)] hover:underline">재시도</button>
        </div>
      </div>
    );
  }

  // done
  return (
    <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left mb-3"
      >
        <Sparkles className="w-4 h-4 text-[hsl(262,83%,58%)]" />
        <span className="text-[12px] font-bold text-[hsl(262,83%,58%)] tracking-wide">AI 제안 전략</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(152,57%,42%,0.1)] text-[hsl(152,57%,42%)] font-semibold">분석 완료</span>
        <div className="flex-1" />
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="bg-white rounded-xl p-5 border border-[hsl(220,13%,93%)] prose prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
          prose-h3:text-[20px] prose-h3:mt-6 prose-h3:mb-2 prose-h3:pb-1.5 prose-h3:border-b prose-h3:border-[hsl(220,13%,93%)]
          prose-p:text-[15px] prose-p:text-foreground/80 prose-p:leading-[1.7] prose-p:my-1
          prose-li:text-[15px] prose-li:text-foreground/80 prose-li:leading-[1.7] prose-li:my-0.5
          prose-strong:text-foreground prose-strong:font-semibold
          prose-ul:my-1.5 prose-ol:my-1.5 prose-ul:pl-4 prose-ol:pl-4
          prose-hr:my-4 prose-hr:border-[hsl(220,13%,93%)]
          prose-code:text-[15px]
        ">
          <MarkdownRenderer content={result} />
          <div className="mt-4 pt-3 border-t border-[hsl(220,13%,93%)] flex items-center gap-2">
            <button
              onClick={analyze}
              className="text-[11px] font-semibold text-[hsl(221,83%,53%)] hover:underline"
            >
              다시 분석
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple markdown renderer (no external dependency needed)
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const Tag = listType;
      elements.push(
        <Tag key={`list-${elements.length}`}>
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
          ))}
        </Tag>
      );
      listItems = [];
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headers
    if (line.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(4)) }} />);
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(<h3 key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(3)) }} />);
    } else if (line.startsWith("# ")) {
      flushList();
      elements.push(<h3 key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(2)) }} />);
    }
    // Unordered list
    else if (/^[-*] /.test(line)) {
      if (listType !== "ul") { flushList(); listType = "ul"; }
      listItems.push(line.slice(2));
    }
    // Ordered list
    else if (/^\d+\. /.test(line)) {
      if (listType !== "ol") { flushList(); listType = "ol"; }
      listItems.push(line.replace(/^\d+\. /, ""));
    }
    // Horizontal rule
    else if (/^---+$/.test(line.trim())) {
      flushList();
      elements.push(<hr key={i} />);
    }
    // Empty line
    else if (line.trim() === "") {
      flushList();
    }
    // Paragraph
    else {
      flushList();
      elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />);
    }
  }
  flushList();

  return <>{elements}</>;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="text-[10px] px-1 py-0.5 rounded bg-muted text-foreground">$1</code>');
}
