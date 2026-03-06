import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  inquiry: any;
  onAnalysisSaved?: (analysis: string) => void;
}

type AnalysisState = "idle" | "analyzing" | "done" | "error";

export default function InquiryAIAnalysis({ inquiry, onAnalysisSaved }: Props) {
  const [state, setState] = useState<AnalysisState>(inquiry.ai_analysis ? "done" : "idle");
  const [result, setResult] = useState<string>(inquiry.ai_analysis || "");
  const [error, setError] = useState<string>("");
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (inquiry.ai_analysis) {
      setResult(inquiry.ai_analysis);
      setState("done");
    }
  }, [inquiry.ai_analysis]);

  const analyze = async () => {
    setState("analyzing");
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-inquiry", {
        body: { inquiry },
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      const analysis = data.analysis;
      setResult(analysis);
      setState("done");

      // Save to DB
      await supabase
        .from("contact_inquiries")
        .update({ ai_analysis: analysis } as any)
        .eq("id", inquiry.id);
      onAnalysisSaved?.(analysis);
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
          AI 제안 전략 분석
        </button>
      </div>
    );
  }

  if (state === "analyzing") {
    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <div className="flex items-center gap-3 px-4 py-4 rounded-xl border border-[hsl(262,60%,90%)] bg-[hsl(262,60%,97%)]">
          <Loader2 className="w-4 h-4 animate-spin text-[hsl(262,83%,58%)]" />
          <div>
            <p className="text-[11px] font-semibold text-[hsl(262,83%,58%)]">AI 분석 중...</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">문의 내용을 요금제와 대조하여 제안 전략을 생성하고 있습니다</p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[hsl(0,84%,90%)] bg-[hsl(0,84%,97%)]">
          <p className="text-[11px] text-[hsl(0,84%,50%)]">{error}</p>
          <button onClick={analyze} className="text-[10px] font-semibold text-[hsl(221,83%,53%)] hover:underline">재시도</button>
        </div>
      </div>
    );
  }

  // Parse sections from markdown
  const sections = parseSections(result);

  return (
    <div className="mt-5 pt-4 border-t-2 border-[hsl(220,13%,88%)]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left mb-3"
      >
        <span className="text-[11px] font-semibold text-muted-foreground tracking-wide">AI 제안 전략</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(152,57%,42%,0.1)] text-[hsl(152,57%,42%)] font-semibold">저장됨</span>
        <div className="flex-1" />
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="bg-white rounded-xl border-2 border-[hsl(220,13%,87%)] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="w-[26%] text-left text-[13px] font-bold text-foreground px-4 py-2.5 border-r-2 border-b-2 border-[hsl(220,13%,87%)]">항목</th>
                <th className="text-left text-[13px] font-bold text-foreground px-4 py-2.5 border-b-2 border-[hsl(220,13%,87%)]">분석 내용</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, idx) => (
                <tr key={idx} className={`${idx % 2 === 1 ? "bg-muted/30" : ""} border-b-2 border-[hsl(220,13%,87%)] last:border-b-0`}>
                  <td className="align-top text-[13px] font-semibold text-foreground px-4 py-3 border-r-2 border-[hsl(220,13%,87%)] whitespace-nowrap">
                    {section.title}
                  </td>
                  <td className="align-top px-4 py-3 text-[13px] text-foreground/80 leading-[1.7]">
                    <SectionContent lines={section.lines} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Parse markdown into sections split by ### headers
function parseSections(content: string): { title: string; lines: string[] }[] {
  const sections: { title: string; lines: string[] }[] = [];
  const rawLines = content.split("\n");
  let currentTitle = "";
  let currentLines: string[] = [];

  for (const line of rawLines) {
    const headerMatch = line.match(/^#{1,3}\s+(?:\d+\.\s*)?(.+)/);
    if (headerMatch) {
      if (currentTitle || currentLines.length > 0) {
        sections.push({ title: currentTitle || "개요", lines: currentLines });
      }
      currentTitle = stripEmoji(headerMatch[1]).trim();
      currentLines = [];
    } else if (/^---+$/.test(line.trim())) {
      // skip dividers
    } else if (line.trim() !== "") {
      currentLines.push(line);
    }
  }
  if (currentTitle || currentLines.length > 0) {
    sections.push({ title: currentTitle || "개요", lines: currentLines });
  }
  return sections;
}

function SectionContent({ lines }: { lines: string[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      {lines.map((line, i) => {
        const isBullet = /^[-*]\s/.test(line);
        const isOrdered = /^\d+\.\s/.test(line);
        const text = isBullet ? line.slice(2) : isOrdered ? line.replace(/^\d+\.\s/, "") : line;
        return (
          <div key={i} className={isBullet || isOrdered ? "flex gap-1.5" : ""}>
            {isBullet && <span className="text-muted-foreground shrink-0">·</span>}
            {isOrdered && <span className="text-muted-foreground shrink-0">{line.match(/^\d+/)?.[0]}.</span>}
            <span dangerouslySetInnerHTML={{ __html: inlineFormat(text) }} />
          </div>
        );
      })}
    </div>
  );
}

function stripEmoji(text: string): string {
  return text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FFFF}]/gu, "").trim();
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="text-[10px] px-1 py-0.5 rounded bg-muted text-foreground">$1</code>');
}
