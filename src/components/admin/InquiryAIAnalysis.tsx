import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronDown, ChevronUp, Sparkles, Download, Plus, Minus } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [fontSize, setFontSize] = useState(11);

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

  const exportPDF = useCallback(async () => {
    const sections = parseSections(result);
    const summary = extractSummary(sections);

    // Load Noto Sans KR font for Korean support
    const fontUrl = "https://cdn.jsdelivr.net/gh/nicholasgasior/gfonts-subset@master/files/NotoSansKR-Regular.ttf";
    const fontBoldUrl = "https://cdn.jsdelivr.net/gh/nicholasgasior/gfonts-subset@master/files/NotoSansKR-Bold.ttf";

    let fontBase64 = "";
    let fontBoldBase64 = "";
    try {
      const [res, resBold] = await Promise.all([fetch(fontUrl), fetch(fontBoldUrl)]);
      const [buf, bufBold] = await Promise.all([res.arrayBuffer(), resBold.arrayBuffer()]);
      fontBase64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      fontBoldBase64 = btoa(String.fromCharCode(...new Uint8Array(bufBold)));
    } catch {
      console.warn("Font load failed, falling back to helvetica");
    }

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const hasKoreanFont = fontBase64.length > 0;
    if (hasKoreanFont) {
      doc.addFileToVFS("NotoSansKR-Regular.ttf", fontBase64);
      doc.addFont("NotoSansKR-Regular.ttf", "NotoSansKR", "normal");
      doc.addFileToVFS("NotoSansKR-Bold.ttf", fontBoldBase64);
      doc.addFont("NotoSansKR-Bold.ttf", "NotoSansKR", "bold");
      doc.setFont("NotoSansKR");
    } else {
      doc.setFont("helvetica");
    }

    const fontFamily = hasKoreanFont ? "NotoSansKR" : "helvetica";

    // Title
    doc.setFont(fontFamily, "bold");
    doc.setFontSize(16);
    doc.setTextColor(88, 55, 163);
    doc.text("AI Analysis Report", 14, 20);

    // Inquiry info
    doc.setFont(fontFamily, "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const infoLines = [
      `회사: ${inquiry.company || "-"}`,
      `담당자: ${inquiry.name || "-"} / ${inquiry.phone || "-"} / ${inquiry.email || "-"}`,
      `서비스: ${inquiry.service || "-"}`,
      `유형: ${inquiry.inquiry_type === "demo" ? "데모 요청" : "상담 요청"}`,
      `날짜: ${new Date(inquiry.created_at).toLocaleDateString("ko-KR")}`,
    ];
    infoLines.forEach((line, i) => doc.text(line, 14, 30 + i * 5));

    // Analysis table
    const tableData = sections.map((s) => [
      s.title,
      s.lines.map((l) => stripMarkdown(l)).join("\n"),
    ]);

    autoTable(doc, {
      startY: 56,
      head: [["항목", "분석 내용"]],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak", font: fontFamily },
      headStyles: { fillColor: [88, 55, 163], textColor: 255, fontStyle: "bold", font: fontFamily },
      columnStyles: { 0: { cellWidth: 42, fontStyle: "bold" }, 1: { cellWidth: 140 } },
      theme: "grid",
    });

    // Summary box
    if (summary) {
      const finalY = (doc as any).lastAutoTable?.finalY || 200;
      const boxY = finalY + 8;
      const summaryText = doc.splitTextToSize(summary, 170);
      const boxHeight = Math.max(30, summaryText.length * 4 + 16);
      doc.setDrawColor(88, 55, 163);
      doc.setFillColor(248, 245, 255);
      doc.roundedRect(14, boxY, 182, boxHeight, 3, 3, "FD");
      doc.setFont(fontFamily, "bold");
      doc.setFontSize(10);
      doc.setTextColor(88, 55, 163);
      doc.text("추천 요금제 & 커스터마이징 요약", 20, boxY + 7);
      doc.setFont(fontFamily, "normal");
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.text(summaryText, 20, boxY + 14);
    }

    doc.save(`AI_Analysis_${inquiry.company || "report"}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }, [result, inquiry]);

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

  const sections = parseSections(result);
  const summary = extractSummary(sections);

  return (
    <div className="mt-5 pt-4 border-t border-[hsl(220,13%,91%)]">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 flex-1 text-left"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[hsl(262,83%,58%)]">
            <Sparkles className="w-3.5 h-3.5" /> AI 제안 전략
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(152,57%,42%,0.1)] text-[hsl(152,57%,42%)] font-semibold">저장됨</span>
          <div className="flex-1" />
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
        <div className="inline-flex items-center rounded-lg border border-[hsl(220,13%,88%)] overflow-hidden">
          <button
            onClick={() => setFontSize(prev => Math.max(9, prev - 1))}
            disabled={fontSize <= 9}
            className="px-1.5 py-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="px-2 py-1 text-[10px] font-semibold text-foreground border-x border-[hsl(220,13%,88%)] min-w-[32px] text-center">{fontSize}px</span>
          <button
            onClick={() => setFontSize(prev => Math.min(16, prev + 1))}
            disabled={fontSize >= 16}
            className="px-1.5 py-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <button
          onClick={exportPDF}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-white bg-[hsl(221,83%,53%)] hover:opacity-90 transition-opacity active:scale-[0.97]"
        >
          <Download className="w-3 h-3" /> PDF
        </button>
      </div>

      {expanded && (
        <>
          <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th style={{ fontSize: `${fontSize}px` }} className="w-[26%] text-left font-bold text-foreground px-4 py-2.5 border-r border-b border-[hsl(220,13%,91%)]">항목</th>
                  <th style={{ fontSize: `${fontSize}px` }} className="text-left font-bold text-foreground px-4 py-2.5 border-b border-[hsl(220,13%,91%)]">분석 내용</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section, idx) => (
                  <tr key={idx} className={`${idx % 2 === 1 ? "bg-muted/30" : ""} border-b border-[hsl(220,13%,91%)] last:border-b-0`}>
                    <td style={{ fontSize: `${fontSize}px` }} className="align-top font-semibold text-foreground px-4 py-3 border-r border-[hsl(220,13%,91%)] whitespace-nowrap">
                      {section.title}
                    </td>
                    <td style={{ fontSize: `${fontSize}px` }} className="align-top px-4 py-3 text-foreground/80 leading-[1.7]">
                      <SectionContent lines={section.lines} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary: Recommended plan + customization */}
          {summary && (
            <div className="mt-3 rounded-xl border border-[hsl(262,60%,85%)] bg-[hsl(262,60%,97%)] px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold text-white bg-[hsl(262,83%,58%)]">
                  추천 요금제 & 커스터마이징 요약
                </span>
              </div>
              <div style={{ fontSize: `${fontSize}px` }} className="text-foreground/80 leading-[1.8]">
                <SectionContent lines={summary.split("\n").filter(l => l.trim())} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Extract the recommended plan + customization cost lines from sections */
function extractSummary(sections: { title: string; lines: string[] }[]): string | null {
  const planSection = sections.find(s =>
    s.title.includes("추천 요금제") || s.title.includes("예상 비용") || s.title.includes("비용")
  );
  const customSection = sections.find(s =>
    s.title.includes("커스터마이징")
  );

  const parts: string[] = [];
  if (planSection) {
    parts.push(...planSection.lines.map(l => stripMarkdown(l)));
  }
  if (customSection) {
    // Add a condensed version: only lines with costs
    const costLines = customSection.lines.filter(l => /원|비용|추가/i.test(l));
    if (costLines.length > 0) {
      parts.push("--- 커스터마이징 항목 ---");
      parts.push(...costLines.map(l => stripMarkdown(l)));
    }
  }

  return parts.length > 0 ? parts.join("\n") : null;
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

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^[-*]\s/, "• ");
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="text-[10px] px-1 py-0.5 rounded bg-muted text-foreground">$1</code>');
}
