import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileText, Download, ChevronDown, ChevronUp, RefreshCw, Lock, CheckCircle2, Edit3, Save, X, History, Clock } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import webheadsLogo from "@/assets/webheads-logo.png";

interface ProposalSection {
  heading: string;
  content: string;
}

interface Proposal {
  title: string;
  summary: string;
  sections: ProposalSection[];
}

interface EditLog {
  id: string;
  editor_email: string;
  edit_summary: string | null;
  created_at: string;
}

type ProposalState = "idle" | "loading" | "done" | "error";

interface Props {
  inquiry: any;
  onFreeze?: () => void;
  isSuperAdmin?: boolean;
}

export default function InquiryProposal({ inquiry, onFreeze, isSuperAdmin }: Props) {
  const [state, setState] = useState<ProposalState>("idle");
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [fontSize, setFontSize] = useState(13);
  const [frozen, setFrozen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const attemptedRestoreRef = useRef(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: "WEBHEADS", address: "서울시 마포구 월드컵로114, 3층",
    phone: "02-540-4337", website: "www.webheads.co.kr",
  });

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editSections, setEditSections] = useState<ProposalSection[]>([]);
  const [saving, setSaving] = useState(false);

  // Edit logs
  const [editLogs, setEditLogs] = useState<EditLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Load company info + frozen/proposal state for current inquiry
  useEffect(() => {
    setState("idle");
    setProposal(null);
    setError("");
    setFrozen(false);
    setEditing(false);
    attemptedRestoreRef.current = false;

    supabase.from("admin_settings").select("value").eq("key", "company_info").maybeSingle()
      .then(({ data }) => { if (data?.value) setCompanyInfo(data.value as any); });

    Promise.all([
      supabase.from("inquiry_analyses").select("is_frozen").eq("inquiry_id", inquiry.id).maybeSingle(),
      supabase.from("contact_inquiries").select("proposal_data").eq("id", inquiry.id).maybeSingle(),
    ]).then(([frozenResult, proposalResult]) => {
      const isFrozen = !!frozenResult.data?.is_frozen;
      const savedProposal = proposalResult.data?.proposal_data as unknown as Proposal | null;

      setFrozen(isFrozen);
      if (savedProposal) {
        setProposal(savedProposal);
        setState("done");
      }
    });

    loadEditLogs();
  }, [inquiry.id]);

  const loadEditLogs = useCallback(async () => {
    const { data } = await supabase
      .from("proposal_edit_logs" as any)
      .select("id, editor_email, edit_summary, created_at")
      .eq("inquiry_id", inquiry.id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setEditLogs(data as any);
  }, [inquiry.id]);

  const generate = useCallback(async () => {
    setState("loading");
    setError("");
    try {
      let proAnalysis = null;
      const { data: analysisData } = await supabase
        .from("inquiry_analyses")
        .select("*")
        .eq("inquiry_id", inquiry.id)
        .maybeSingle();
      if (analysisData) {
        proAnalysis = {
          customer_profile: analysisData.customer_profile,
          feature_mapping: analysisData.feature_mapping,
          cost_scenarios: analysisData.cost_scenarios,
          risk_flags: analysisData.risk_flags,
          strategic_score: analysisData.strategic_score,
          recommended_plan: analysisData.recommended_plan,
          meeting_agenda: analysisData.meeting_agenda,
        };
      }

      const { data, error: fnError } = await supabase.functions.invoke("generate-proposal", {
        body: {
          inquiry,
          ai_basic_analysis: inquiry.ai_analysis_v2 || inquiry.ai_analysis || null,
          pro_analysis: proAnalysis,
          company_info: companyInfo,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      if (!data?.proposal) throw new Error("제안서 데이터가 없습니다");

      setProposal(data.proposal);
      setState("done");

      await supabase
        .from("contact_inquiries" as any)
        .update({ proposal_data: data.proposal } as any)
        .eq("id", inquiry.id);
    } catch (e: any) {
      setError(e.message || "제안서 생성에 실패했습니다");
      setState("error");
    }
  }, [inquiry, companyInfo]);

  useEffect(() => {
    if (frozen && !proposal && state === "idle" && !attemptedRestoreRef.current) {
      attemptedRestoreRef.current = true;
      generate();
    }
  }, [frozen, proposal, state, generate]);

  const startEditing = useCallback(() => {
    if (!proposal) return;
    setEditTitle(proposal.title);
    setEditSummary(proposal.summary);
    setEditSections(proposal.sections.map(s => ({ ...s })));
    setEditing(true);
  }, [proposal]);

  const cancelEditing = useCallback(() => {
    setEditing(false);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!proposal) return;
    setSaving(true);
    try {
      const newProposal: Proposal = {
        title: editTitle,
        summary: editSummary,
        sections: editSections,
      };

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("인증 정보가 없습니다");

      // Save to DB
      await supabase
        .from("contact_inquiries" as any)
        .update({ proposal_data: newProposal } as any)
        .eq("id", inquiry.id);

      // Log the edit
      await supabase
        .from("proposal_edit_logs" as any)
        .insert({
          inquiry_id: inquiry.id,
          editor_email: user.email || "unknown",
          editor_id: user.id,
          edit_summary: "제안서 수동 수정",
          previous_data: proposal,
          new_data: newProposal,
        } as any);

      setProposal(newProposal);
      setEditing(false);
      loadEditLogs();
    } catch (e: any) {
      console.error("Save edit error:", e);
    } finally {
      setSaving(false);
    }
  }, [proposal, editTitle, editSummary, editSections, inquiry.id, loadEditLogs]);

  const updateSectionHeading = (idx: number, heading: string) => {
    setEditSections(prev => prev.map((s, i) => i === idx ? { ...s, heading } : s));
  };

  const updateSectionContent = (idx: number, content: string) => {
    setEditSections(prev => prev.map((s, i) => i === idx ? { ...s, content } : s));
  };

  const exportPDF = useCallback(async () => {
    if (!proposal || !containerRef.current) return;
    const contentEl = containerRef.current.querySelector("[data-proposal-content]") as HTMLElement;
    if (!contentEl) return;

    try {
      const originalFontSize = contentEl.style.fontSize;
      const originalWidth = contentEl.style.width;
      const originalMaxWidth = contentEl.style.maxWidth;
      const originalPadding = contentEl.style.padding;

      contentEl.style.fontSize = "18px";
      contentEl.style.width = "1200px";
      contentEl.style.maxWidth = "1200px";
      contentEl.style.padding = "48px";

      const canvas = await html2canvas(contentEl, {
        scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff", width: 1200,
      });

      contentEl.style.fontSize = originalFontSize;
      contentEl.style.width = originalWidth;
      contentEl.style.maxWidth = originalMaxWidth;
      contentEl.style.padding = originalPadding;

      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const imgWidth = 190;
      const pageHeight = 277;
      const margin = 10;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/png");

      let heightLeft = imgHeight;
      let position = margin;
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${inquiry.company}_제안서.pdf`);
    } catch (e) {
      console.error("PDF export error:", e);
    }
  }, [proposal, inquiry.company]);

  const renderMarkdown = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h4 key={i} className="font-semibold mt-3 mb-1 text-foreground">{line.slice(4)}</h4>;
      if (line.startsWith("## ")) return <h3 key={i} className="font-bold mt-4 mb-1.5 text-foreground">{line.slice(3)}</h3>;
      if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-foreground/90">{renderInline(line.slice(2))}</li>;
      if (line.startsWith("|")) {
        const cells = line.split("|").filter(Boolean).map(c => c.trim());
        if (cells.every(c => /^[-:]+$/.test(c))) return null;
        return (
          <div key={i} className="grid gap-2 py-1 border-b border-[hsl(220,13%,93%)]" style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
            {cells.map((c, j) => <span key={j} className="text-foreground/90">{renderInline(c)}</span>)}
          </div>
        );
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="text-foreground/90 leading-relaxed">{renderInline(line)}</p>;
    });
  };

  const renderInline = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
    );
  };

  const handleFreeze = useCallback(async () => {
    setFrozen(true);
    onFreeze?.();
    await supabase
      .from("inquiry_analyses" as any)
      .update({ is_frozen: true } as any)
      .eq("inquiry_id", inquiry.id);
  }, [inquiry.id, onFreeze]);

  // --- Early returns for non-done states ---
  if (state === "idle" && !frozen) {
    const hasAnalysis = !!inquiry.ai_analysis;
    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <button
          onClick={generate}
          disabled={!hasAnalysis}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all active:scale-[0.97] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg, hsl(152, 57%, 42%), hsl(160, 60%, 38%))" }}
        >
          <FileText className="w-4 h-4" />
          제안서 생성
        </button>
        {!hasAnalysis && (
          <p className="text-[11px] text-muted-foreground/50 mt-1.5">AI 기초 분석을 먼저 실행해주세요</p>
        )}
      </div>
    );
  }

  if (state === "idle" && frozen) {
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-[13px] text-muted-foreground">확정된 제안서를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <div className="flex items-center gap-3 py-8 justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-[hsl(152,57%,42%)]" />
          <span className="text-[13px] text-muted-foreground">제안서를 생성하고 있습니다...</span>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
        <div className="bg-[hsl(0,84%,60%,0.06)] rounded-xl p-4">
          <p className="text-[13px] text-[hsl(0,84%,50%)]">{error}</p>
          <button onClick={generate} className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-[hsl(0,84%,60%)] hover:underline">
            <RefreshCw className="w-3 h-3" /> 다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!proposal) return null;

  return (
    <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]" ref={containerRef}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 flex-1 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white" style={{ background: frozen ? "linear-gradient(135deg, hsl(152, 50%, 38%), hsl(160, 55%, 42%))" : "linear-gradient(135deg, hsl(152, 57%, 42%), hsl(160, 60%, 38%))" }}>
            {frozen ? <Lock className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />} 제안서
          </span>
          {frozen && (
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold text-white bg-[hsl(152,50%,40%)] flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> 확정
            </span>
          )}
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
        <div className="flex items-center gap-2">
          {!editing && (
            <>
              <div className="flex items-center gap-1 bg-[hsl(220,14%,96%)] rounded-lg px-2 py-1">
                <button onClick={() => setFontSize(Math.max(10, fontSize - 1))} className="text-[11px] text-muted-foreground px-1 hover:text-foreground">A-</button>
                <span className="text-[10px] text-muted-foreground">{fontSize}</span>
                <button onClick={() => setFontSize(Math.min(18, fontSize + 1))} className="text-[11px] text-muted-foreground px-1 hover:text-foreground">A+</button>
              </div>
              <button onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[hsl(152,57%,42%)] bg-[hsl(152,57%,42%,0.08)] hover:bg-[hsl(152,57%,42%,0.14)] transition-all">
                <Download className="w-3 h-3" /> PDF
              </button>
              {frozen && (
                <button onClick={startEditing} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[hsl(221,83%,53%)] bg-[hsl(221,83%,53%,0.08)] hover:bg-[hsl(221,83%,53%,0.14)] transition-all">
                  <Edit3 className="w-3 h-3" /> 수정
                </button>
              )}
              {editLogs.length > 0 && (
                <button onClick={() => setShowLogs(!showLogs)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-muted-foreground bg-[hsl(220,14%,96%)] hover:bg-[hsl(220,14%,93%)] transition-all">
                  <History className="w-3 h-3" /> 수정 이력 ({editLogs.length})
                </button>
              )}
            </>
          )}
          {editing && (
            <>
              <button onClick={saveEdit} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-[hsl(152,57%,42%)] hover:bg-[hsl(152,57%,38%)] transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} 저장
              </button>
              <button onClick={cancelEditing} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-muted-foreground bg-[hsl(220,14%,96%)] hover:bg-[hsl(220,14%,93%)] transition-all">
                <X className="w-3 h-3" /> 취소
              </button>
            </>
          )}
          {!frozen && !editing && (
            <>
              <button onClick={handleFreeze} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,48%)] transition-all">
                <CheckCircle2 className="w-3 h-3" /> 확정
              </button>
              <button onClick={generate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-muted-foreground bg-[hsl(220,14%,96%)] hover:bg-[hsl(220,14%,93%)] transition-all">
                <RefreshCw className="w-3 h-3" /> 재생성
              </button>
            </>
          )}
        </div>
      </div>

      {/* Edit Logs */}
      {showLogs && editLogs.length > 0 && (
        <div className="mb-3 bg-[hsl(220,14%,96%)] rounded-xl p-3">
          <h4 className="text-[11px] font-bold text-foreground mb-2 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> 수정 이력
          </h4>
          <div className="space-y-1.5">
            {editLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-2 text-[11px]">
                <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  {new Date(log.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="text-foreground font-medium">{log.editor_email}</span>
                {log.edit_summary && <span className="text-muted-foreground">— {log.edit_summary}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {expanded && !editing && (
        <div data-proposal-content className="bg-white rounded-xl border border-[hsl(220,13%,93%)] p-5 sm:p-6" style={{ fontSize: `${fontSize}px` }}>
          <h2 className="text-[1.2em] font-bold text-foreground tracking-[-0.02em] mb-2">{proposal.title}</h2>
          <p className="text-[0.85em] text-muted-foreground mb-6 leading-relaxed">{proposal.summary}</p>

          {proposal.sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-[0.95em] font-bold text-foreground border-l-[3px] border-[hsl(152,57%,42%)] pl-3 mb-3">
                {section.heading}
              </h3>
              <div className="text-[0.9em] leading-relaxed pl-1">
                {renderMarkdown(section.content)}
              </div>
            </div>
          ))}

          <div className="mt-8 pt-4 border-t border-[hsl(220,13%,93%)] text-center">
            <p className="text-[0.9em] text-foreground">
              {companyInfo.name} | {companyInfo.address} | {companyInfo.phone} | {companyInfo.website}
            </p>
          </div>
        </div>
      )}

      {expanded && editing && (
        <div className="bg-white rounded-xl border-2 border-[hsl(221,83%,53%,0.3)] p-5 sm:p-6 space-y-4">
          <div className="bg-[hsl(221,83%,53%,0.06)] rounded-lg px-3 py-2 text-[11px] text-[hsl(221,83%,53%)] font-semibold flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5" /> 편집 모드 — 내용을 직접 수정할 수 있습니다
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-bold text-muted-foreground mb-1 block">제목</label>
            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[hsl(220,13%,90%)] text-[14px] font-bold text-foreground focus:outline-none focus:border-[hsl(221,83%,53%)] transition-colors"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="text-[11px] font-bold text-muted-foreground mb-1 block">요약</label>
            <textarea
              value={editSummary}
              onChange={e => setEditSummary(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-[hsl(220,13%,90%)] text-[13px] text-foreground resize-y focus:outline-none focus:border-[hsl(221,83%,53%)] transition-colors"
            />
          </div>

          {/* Sections */}
          {editSections.map((section, idx) => (
            <div key={idx} className="border border-[hsl(220,13%,93%)] rounded-xl p-4 space-y-2">
              <input
                value={section.heading}
                onChange={e => updateSectionHeading(idx, e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[hsl(220,13%,90%)] text-[13px] font-bold text-foreground focus:outline-none focus:border-[hsl(221,83%,53%)] transition-colors"
                placeholder="섹션 제목"
              />
              <textarea
                value={section.content}
                onChange={e => updateSectionContent(idx, e.target.value)}
                rows={Math.max(4, section.content.split("\n").length + 1)}
                className="w-full px-3 py-2 rounded-lg border border-[hsl(220,13%,90%)] text-[12px] text-foreground font-mono resize-y focus:outline-none focus:border-[hsl(221,83%,53%)] transition-colors leading-relaxed"
                placeholder="마크다운 형식으로 내용을 작성하세요"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
