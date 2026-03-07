import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronDown, ChevronUp, Sparkles, Download, Plus, Minus, RefreshCw, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
  inquiry: any;
  onAnalysisSaved?: (analysis: string) => void;
  isSuperAdmin?: boolean;
}

interface AnalysisV2 {
  needs_summary: string;
  scale_estimate: string;
  recommended_plan: string;
  key_requirements: string[];
  available_features?: string[];
  custom_features?: { name: string; cost: string }[];
  limited_features?: { name: string; reason: string; alternative: string }[];
  pricing_fit: string;
  strategy_points?: string[];
  special_notes: string;
}

type AnalysisState = "idle" | "analyzing" | "done" | "error";

export default function InquiryAIAnalysis({ inquiry, onAnalysisSaved, isSuperAdmin }: Props) {
  const [state, setState] = useState<AnalysisState>(
    inquiry.ai_analysis_v2 || inquiry.ai_analysis ? "done" : "idle"
  );
  const [resultText, setResultText] = useState<string>(inquiry.ai_analysis || "");
  const [resultV2, setResultV2] = useState<AnalysisV2 | null>(
    inquiry.ai_analysis_v2 ? (inquiry.ai_analysis_v2 as AnalysisV2) : null
  );
  const [error, setError] = useState<string>("");
  const [expanded, setExpanded] = useState(true);
  const [fontSize, setFontSize] = useState(11);

  useEffect(() => {
    if (inquiry.ai_analysis_v2) {
      setResultV2(inquiry.ai_analysis_v2 as AnalysisV2);
      setState("done");
    } else if (inquiry.ai_analysis) {
      setResultText(inquiry.ai_analysis);
      setState("done");
    }
  }, [inquiry.ai_analysis, inquiry.ai_analysis_v2]);

  const analyze = async () => {
    setState("analyzing");
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-inquiry", {
        body: { inquiry },
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      const analysisV2 = data.analysis_v2 as AnalysisV2 | null;
      const analysisText = data.analysis as string;

      setResultV2(analysisV2);
      setResultText(analysisText);
      setState("done");

      // Save both text (backward compat) and v2 JSON
      const updatePayload: any = { ai_analysis: analysisText };
      if (analysisV2) updatePayload.ai_analysis_v2 = analysisV2;

      await supabase
        .from("contact_inquiries")
        .update(updatePayload)
        .eq("id", inquiry.id);
      onAnalysisSaved?.(analysisText);
    } catch (e: any) {
      setError(e.message || "분석 중 오류가 발생했습니다.");
      setState("error");
    }
  };

  if (state === "idle") {
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <button
          onClick={analyze}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-primary-foreground transition-all active:scale-[0.97] hover:opacity-90 bg-primary"
        >
          AI 기초 분석
        </button>
      </div>
    );
  }

  if (state === "analyzing") {
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-4 rounded-xl border border-primary/20 bg-primary/5">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <div>
            <p className="text-[11px] font-semibold text-primary">AI 분석 중...</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">문의 내용을 요금제와 대조하여 제안 전략을 생성하고 있습니다</p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-destructive/30 bg-destructive/5">
          <p className="text-[11px] text-destructive">{error}</p>
          <button onClick={analyze} className="text-[10px] font-semibold text-primary hover:underline">재시도</button>
        </div>
      </div>
    );
  }

  // Render structured V2 or fallback to legacy text
  return (
    <div className="mt-5 pt-4 border-t border-border">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 flex-1 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-primary-foreground bg-primary">
            <Sparkles className="w-3.5 h-3.5" /> AI 기초 분석
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold">저장됨</span>
          <div className="flex-1" />
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
        <div className="inline-flex items-center rounded-lg border border-border overflow-hidden">
          <button onClick={() => setFontSize(prev => Math.max(9, prev - 1))} disabled={fontSize <= 9} className="px-1.5 py-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
            <Minus className="w-3 h-3" />
          </button>
          <span className="px-2 py-1 text-[10px] font-semibold text-foreground border-x border-border min-w-[32px] text-center">{fontSize}px</span>
          <button onClick={() => setFontSize(prev => Math.min(16, prev + 1))} disabled={fontSize >= 16} className="px-1.5 py-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <button
          onClick={() => exportPDF(resultV2, resultText, inquiry)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity active:scale-[0.97]"
        >
          <Download className="w-3 h-3" /> PDF
        </button>
        {isSuperAdmin && state === "done" && (
          <button
            onClick={analyze}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 transition-colors active:scale-[0.97]"
          >
            <Shield className="w-3 h-3" />
            <RefreshCw className="w-3 h-3" /> 재분석
          </button>
        )}
      </div>

      {expanded && (
        resultV2 ? <V2Cards data={resultV2} fontSize={fontSize} /> : <LegacyTextView text={resultText} fontSize={fontSize} />
      )}
    </div>
  );
}

/* ── Structured V2 Card Rendering ── */
function V2Cards({ data, fontSize }: { data: AnalysisV2; fontSize: number }) {
  const planColor: Record<string, string> = {
    Starter: "bg-muted text-muted-foreground",
    Basic: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Plus: "bg-primary/10 text-primary",
    Premium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  };

  return (
    <div className="space-y-3" style={{ fontSize: `${fontSize}px` }}>
      {/* 핵심 니즈 + 규모 + 추천 플랜 */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-muted-foreground mb-1">핵심 니즈</p>
            <p className="text-foreground leading-relaxed">{data.needs_summary}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge variant="outline" className="text-[10px]">
              규모: {data.scale_estimate}
            </Badge>
            <Badge className={`text-[10px] ${planColor[data.recommended_plan] || "bg-primary/10 text-primary"}`}>
              추천: {data.recommended_plan}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <span className="text-[10px] font-semibold text-muted-foreground shrink-0">예상 비용</span>
          <span className="text-foreground font-medium">{data.pricing_fit}</span>
        </div>
      </div>

      {/* 핵심 요건 태그 */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[10px] font-semibold text-muted-foreground mb-2">핵심 요건</p>
        <div className="flex flex-wrap gap-1.5">
          {data.key_requirements.map((req, i) => (
            <Badge key={i} variant="secondary" className="text-[10px]">{req}</Badge>
          ))}
        </div>
      </div>

      {/* 기본 제공 기능 */}
      {data.available_features && data.available_features.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[10px] font-semibold text-muted-foreground mb-2">기본 제공 가능</p>
          <div className="flex flex-wrap gap-1.5">
            {data.available_features.map((f, i) => (
              <Badge key={i} variant="outline" className="text-[10px] border-green-300 text-green-700 dark:border-green-700 dark:text-green-400">{f}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* 커스터마이징 필요 */}
      {data.custom_features && data.custom_features.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[10px] font-semibold text-muted-foreground mb-2">커스터마이징 필요</p>
          <div className="space-y-1">
            {data.custom_features.map((f, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-foreground/80">
                <span>{f.name}</span>
                <span className="text-[10px] text-muted-foreground shrink-0">{f.cost}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 제한/불가 기능 */}
      {data.limited_features && data.limited_features.length > 0 && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-[10px] font-semibold text-destructive mb-2">제한/불가</p>
          <div className="space-y-1.5">
            {data.limited_features.map((f, i) => (
              <div key={i} className="text-foreground/80">
                <span className="font-medium">{f.name}</span>
                <span className="text-muted-foreground"> — {f.reason}</span>
                {f.alternative && <span className="text-primary text-[10px]"> → {f.alternative}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 영업 전략 포인트 */}
      {data.strategy_points && data.strategy_points.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-[10px] font-semibold text-primary mb-2">영업 전략 포인트</p>
          <ul className="space-y-1 text-foreground/80">
            {data.strategy_points.map((p, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-muted-foreground shrink-0">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 특이사항 */}
      {data.special_notes && (
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <p className="text-[10px] font-semibold text-muted-foreground mb-1">특이사항</p>
          <p className="text-foreground/80">{data.special_notes}</p>
        </div>
      )}
    </div>
  );
}

/* ── Legacy Text Rendering (fallback) ── */
function LegacyTextView({ text, fontSize }: { text: string; fontSize: number }) {
  const sections = parseSections(text);
  const summary = extractSummary(sections);

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th style={{ fontSize: `${fontSize}px` }} className="w-[26%] text-left font-bold text-foreground px-4 py-2.5 border-r border-b border-border">항목</th>
              <th style={{ fontSize: `${fontSize}px` }} className="text-left font-bold text-foreground px-4 py-2.5 border-b border-border">분석 내용</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, idx) => (
              <tr key={idx} className={`${idx % 2 === 1 ? "bg-muted/30" : ""} border-b border-border last:border-b-0`}>
                <td style={{ fontSize: `${fontSize}px` }} className="align-top font-semibold text-foreground px-4 py-3 border-r border-border whitespace-nowrap">{section.title}</td>
                <td style={{ fontSize: `${fontSize}px` }} className="align-top px-4 py-3 text-foreground/80 leading-[1.7]">
                  <SectionContent lines={section.lines} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {summary && (
        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold text-primary-foreground bg-primary">추천 요금제 & 커스터마이징 요약</span>
          </div>
          <div style={{ fontSize: `${fontSize}px` }} className="text-foreground/80 leading-[1.8]">
            <SectionContent lines={summary.split("\n").filter(l => l.trim())} />
          </div>
        </div>
      )}
    </>
  );
}

/* ── PDF Export ── */
async function exportPDF(v2: AnalysisV2 | null, text: string, inquiry: any) {
  const fontUrl = "https://cdn.jsdelivr.net/gh/nicholasgasior/gfonts-subset@master/files/NotoSansKR-Regular.ttf";
  const fontBoldUrl = "https://cdn.jsdelivr.net/gh/nicholasgasior/gfonts-subset@master/files/NotoSansKR-Bold.ttf";

  let fontBase64 = "", fontBoldBase64 = "";
  try {
    const [res, resBold] = await Promise.all([fetch(fontUrl), fetch(fontBoldUrl)]);
    const [buf, bufBold] = await Promise.all([res.arrayBuffer(), resBold.arrayBuffer()]);
    fontBase64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
    fontBoldBase64 = btoa(String.fromCharCode(...new Uint8Array(bufBold)));
  } catch { console.warn("Font load failed"); }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const hasFont = fontBase64.length > 0;
  if (hasFont) {
    doc.addFileToVFS("NotoSansKR-Regular.ttf", fontBase64);
    doc.addFont("NotoSansKR-Regular.ttf", "NotoSansKR", "normal");
    doc.addFileToVFS("NotoSansKR-Bold.ttf", fontBoldBase64);
    doc.addFont("NotoSansKR-Bold.ttf", "NotoSansKR", "bold");
    doc.setFont("NotoSansKR");
  }
  const ff = hasFont ? "NotoSansKR" : "helvetica";

  doc.setFont(ff, "bold"); doc.setFontSize(16); doc.setTextColor(88, 55, 163);
  doc.text("AI Analysis Report", 14, 20);
  doc.setFont(ff, "normal"); doc.setFontSize(9); doc.setTextColor(100, 100, 100);
  const info = [
    `회사: ${inquiry.company || "-"}`,
    `담당자: ${inquiry.name || "-"} / ${inquiry.phone || "-"} / ${inquiry.email || "-"}`,
    `서비스: ${inquiry.service || "-"}`,
    `날짜: ${new Date(inquiry.created_at).toLocaleDateString("ko-KR")}`,
  ];
  info.forEach((l, i) => doc.text(l, 14, 30 + i * 5));

  if (v2) {
    const rows = [
      ["핵심 니즈", v2.needs_summary],
      ["규모 추정", v2.scale_estimate],
      ["추천 플랜", v2.recommended_plan],
      ["핵심 요건", v2.key_requirements.join(", ")],
      ["예상 비용", v2.pricing_fit],
      ...(v2.available_features?.length ? [["기본 제공", v2.available_features.join(", ")]] : []),
      ...(v2.custom_features?.length ? [["커스터마이징", v2.custom_features.map(f => `${f.name}(${f.cost})`).join(", ")]] : []),
      ...(v2.limited_features?.length ? [["제한/불가", v2.limited_features.map(f => `${f.name}: ${f.reason}`).join(", ")]] : []),
      ...(v2.strategy_points?.length ? [["영업 전략", v2.strategy_points.join(" / ")]] : []),
      ...(v2.special_notes ? [["특이사항", v2.special_notes]] : []),
    ];
    autoTable(doc, {
      startY: 52, head: [["항목", "분석 내용"]], body: rows,
      styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak", font: ff },
      headStyles: { fillColor: [88, 55, 163], textColor: 255, fontStyle: "bold", font: ff },
      columnStyles: { 0: { cellWidth: 42, fontStyle: "bold" }, 1: { cellWidth: 140 } },
      theme: "grid",
    });
  } else {
    const sections = parseSections(text);
    const tableData = sections.map(s => [s.title, s.lines.map(l => stripMarkdown(l)).join("\n")]);
    autoTable(doc, {
      startY: 52, head: [["항목", "분석 내용"]], body: tableData,
      styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak", font: ff },
      headStyles: { fillColor: [88, 55, 163], textColor: 255, fontStyle: "bold", font: ff },
      columnStyles: { 0: { cellWidth: 42, fontStyle: "bold" }, 1: { cellWidth: 140 } },
      theme: "grid",
    });
  }

  doc.save(`AI_Analysis_${inquiry.company || "report"}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/* ── Utilities (legacy text parsing) ── */
function extractSummary(sections: { title: string; lines: string[] }[]): string | null {
  const planSection = sections.find(s => s.title.includes("추천 요금제") || s.title.includes("예상 비용") || s.title.includes("비용"));
  const customSection = sections.find(s => s.title.includes("커스터마이징"));
  const parts: string[] = [];
  if (planSection) parts.push(...planSection.lines.map(l => stripMarkdown(l)));
  if (customSection) {
    const costLines = customSection.lines.filter(l => /원|비용|추가/i.test(l));
    if (costLines.length > 0) { parts.push("--- 커스터마이징 항목 ---"); parts.push(...costLines.map(l => stripMarkdown(l))); }
  }
  return parts.length > 0 ? parts.join("\n") : null;
}

function parseSections(content: string): { title: string; lines: string[] }[] {
  const sections: { title: string; lines: string[] }[] = [];
  const rawLines = content.split("\n");
  let currentTitle = "", currentLines: string[] = [];
  for (const line of rawLines) {
    const headerMatch = line.match(/^#{1,3}\s+(?:\d+\.\s*)?(.+)/);
    if (headerMatch) {
      if (currentTitle || currentLines.length > 0) sections.push({ title: currentTitle || "개요", lines: currentLines });
      currentTitle = stripEmoji(headerMatch[1]).trim(); currentLines = [];
    } else if (/^---+$/.test(line.trim())) { /* skip */ } else if (line.trim() !== "") { currentLines.push(line); }
  }
  if (currentTitle || currentLines.length > 0) sections.push({ title: currentTitle || "개요", lines: currentLines });
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

function stripEmoji(t: string) { return t.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FFFF}]/gu, "").trim(); }
function stripMarkdown(t: string) { return t.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/`(.+?)`/g, "$1").replace(/^[-*]\s/, "• "); }
function inlineFormat(t: string) { return t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`(.+?)`/g, '<code class="text-[10px] px-1 py-0.5 rounded bg-muted text-foreground">$1</code>'); }
