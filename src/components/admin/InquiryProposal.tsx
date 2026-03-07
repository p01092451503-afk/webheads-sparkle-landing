import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileText, Download, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ProposalSection {
  heading: string;
  content: string;
}

interface Proposal {
  title: string;
  summary: string;
  sections: ProposalSection[];
}

type ProposalState = "idle" | "loading" | "done" | "error";

interface Props {
  inquiry: any;
}

export default function InquiryProposal({ inquiry }: Props) {
  const [state, setState] = useState<ProposalState>("idle");
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [fontSize, setFontSize] = useState(13);
  const containerRef = useRef<HTMLDivElement>(null);
  const [companyInfo, setCompanyInfo] = useState({
    name: "WEBHEADS", address: "서울시 마포구 월드컵로114, 3층",
    phone: "02-540-4337", website: "www.webheads.co.kr",
  });

  useEffect(() => {
    supabase.from("admin_settings").select("value").eq("key", "company_info").maybeSingle()
      .then(({ data }) => { if (data?.value) setCompanyInfo(data.value as any); });
  }, []);

  const generate = useCallback(async () => {
    setState("loading");
    setError("");
    try {
      // Fetch pro analysis if exists
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
          ai_basic_analysis: inquiry.ai_analysis || null,
          pro_analysis: proAnalysis,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      if (!data?.proposal) throw new Error("제안서 데이터가 없습니다");

      setProposal(data.proposal);
      setState("done");
    } catch (e: any) {
      setError(e.message || "제안서 생성에 실패했습니다");
      setState("error");
    }
  }, [inquiry]);

  const exportPDF = useCallback(async () => {
    if (!proposal || !containerRef.current) return;

    const contentEl = containerRef.current.querySelector("[data-proposal-content]") as HTMLElement;
    if (!contentEl) return;

    try {
      const canvas = await html2canvas(contentEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

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
    // Simple markdown rendering
    return content.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h4 key={i} className="font-semibold mt-3 mb-1 text-foreground">{line.slice(4)}</h4>;
      if (line.startsWith("## ")) return <h3 key={i} className="font-bold mt-4 mb-1.5 text-foreground">{line.slice(3)}</h3>;
      if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-foreground/90">{renderInline(line.slice(2))}</li>;
      if (line.startsWith("|")) {
        // Table row
        const cells = line.split("|").filter(Boolean).map(c => c.trim());
        if (cells.every(c => /^[-:]+$/.test(c))) return null; // separator
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
    // Bold
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
    );
  };

  if (state === "idle") {
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
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-[12px] font-bold text-foreground tracking-wide"
        >
          <FileText className="w-4 h-4 text-[hsl(152,57%,42%)]" />
          제안서
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[hsl(220,14%,96%)] rounded-lg px-2 py-1">
            <button onClick={() => setFontSize(Math.max(10, fontSize - 1))} className="text-[11px] text-muted-foreground px-1 hover:text-foreground">A-</button>
            <span className="text-[10px] text-muted-foreground">{fontSize}</span>
            <button onClick={() => setFontSize(Math.min(18, fontSize + 1))} className="text-[11px] text-muted-foreground px-1 hover:text-foreground">A+</button>
          </div>
          <button onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[hsl(152,57%,42%)] bg-[hsl(152,57%,42%,0.08)] hover:bg-[hsl(152,57%,42%,0.14)] transition-all">
            <Download className="w-3 h-3" /> PDF
          </button>
          <button onClick={generate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-muted-foreground bg-[hsl(220,14%,96%)] hover:bg-[hsl(220,14%,93%)] transition-all">
            <RefreshCw className="w-3 h-3" /> 재생성
          </button>
        </div>
      </div>

      {expanded && (
        <div data-proposal-content className="bg-white rounded-xl border border-[hsl(220,13%,93%)] p-5 sm:p-6" style={{ fontSize: `${fontSize}px` }}>
          {/* Title */}
          <h2 className="text-[1.2em] font-bold text-foreground tracking-[-0.02em] mb-2">{proposal.title}</h2>
          <p className="text-[0.85em] text-muted-foreground mb-6 leading-relaxed">{proposal.summary}</p>

          {/* Sections */}
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

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-[hsl(220,13%,93%)] text-center">
            <p className="text-[1.05em] text-muted-foreground">
              {companyInfo.name} | {companyInfo.address} | {companyInfo.phone} | {companyInfo.website}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
