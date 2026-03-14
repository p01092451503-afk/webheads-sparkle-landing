import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SimulationProposal from "@/components/lms/SimulationProposal";
import { Eye, EyeOff, Download, Send, Edit3, Save, X, Loader2, CheckCircle, Mail } from "lucide-react";

interface Props {
  inquiry: any;
  logActivity: (action: string, targetType?: string, targetId?: string, details?: any) => void;
}

export default function AdminSimulationProposal({ inquiry, logActivity }: Props) {
  const rawProposalData = inquiry.proposal_data;

  // Fallback: parse from message if proposal_data is null
  const parsedFromMessage = !rawProposalData && inquiry.message ? (() => {
    try {
      const m = inquiry.message as string;
      const get = (key: string) => {
        const match = m.match(new RegExp(`${key}:\\s*([^/]+)`));
        return match ? match[1].trim() : "";
      };
      const planName = get("Plan");
      const monthly = parseInt(get("Monthly").replace(/,/g, "")) || 0;
      const learners = parseInt(get("Learners").replace(/,/g, "")) || 0;
      const storage = parseInt(get("Storage").replace(/GB/g, "").replace(/,/g, "")) || 0;
      const completion = parseInt(get("Completion").replace(/%/g, "")) || 70;
      const drm = get("DRM") === "Y";
      const dedicated = get("Dedicated") === "Y";
      const annual = get("Annual") === "Y";
      if (!planName) return null;
      return {
        planName, solutionType: "SaaS", monthlyPrice: monthly, basePrice: monthly,
        cdnIncluded: 0, storageIncluded: 0, overageCdn: 0, overageStorage: 0,
        learners, storageInput: storage, completionRate: completion,
        needsCdn: true, needsSecurePlayer: drm, needsDedicatedServer: dedicated,
        isAnnual: annual, cdnGB: 0, storageGB: storage, savingsAmount: 0,
        companyName: inquiry.company || undefined,
      };
    } catch { return null; }
  })() : null;

  const proposalData = rawProposalData || parsedFromMessage;

  const [showPreview, setShowPreview] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const proposalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (proposalData) setEditData({ ...proposalData });
  }, [proposalData]);

  const currentData = editing ? editData : proposalData;

  const handleDownloadPdf = useCallback(async () => {
    if (!proposalRef.current) return;
    setPdfLoading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const filename = `웹헤즈_LMS_견적서_${currentData?.planName}_${inquiry.company}_${new Date().toISOString().slice(0, 10)}.pdf`;
      await (html2pdf() as any).set({
        margin: 0, filename,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(proposalRef.current).save();
    } catch {
      alert("PDF 생성 오류");
    } finally {
      setPdfLoading(false);
    }
  }, [currentData, inquiry.company]);

  if (!proposalData) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("contact_inquiries")
        .update({ proposal_data: editData })
        .eq("id", inquiry.id);
      if (error) throw error;
      inquiry.proposal_data = editData;
      setEditing(false);
      logActivity("proposal_edited", "inquiry", inquiry.id, { planName: editData.planName });
    } catch {
      alert("저장 실패");
    } finally {
      setSaving(false);
    }
  };


  const handleSendEmail = async () => {
    if (!inquiry.email) {
      alert("고객 이메일 주소가 없습니다.");
      return;
    }
    if (!confirm(`${inquiry.email}로 제안서를 발송하시겠습니까?`)) return;
    setSending(true);
    try {
      // Generate PDF blob
      if (!proposalRef.current) throw new Error("Proposal not rendered");
      const html2pdf = (await import("html2pdf.js")).default;
      const pdfBlob: Blob = await (html2pdf() as any).set({
        margin: 0,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(proposalRef.current).outputPdf("blob");

      // Convert to base64
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(pdfBlob);
      });

      const { error } = await supabase.functions.invoke("send-proposal-email", {
        body: {
          to: inquiry.email,
          company: inquiry.company,
          name: inquiry.name,
          planName: currentData.planName,
          monthlyPrice: currentData.monthlyPrice,
          pdfBase64: base64,
        },
      });
      if (error) throw error;

      setSent(true);
      logActivity("proposal_sent", "inquiry", inquiry.id, { email: inquiry.email, planName: currentData.planName });

      // Update inquiry status
      await supabase.from("contact_inquiries").update({ status: "in_progress" }).eq("id", inquiry.id);
    } catch (err: any) {
      alert(`발송 실패: ${err.message || "알 수 없는 오류"}`);
    } finally {
      setSending(false);
    }
  };

  const fmt = (n: number) => n?.toLocaleString("ko-KR") || "0";

  return (
    <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold text-muted-foreground tracking-wide">📋 시뮬레이션 제안서</p>
        {sent && (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "hsl(152, 57%, 95%)", color: "hsl(152, 57%, 35%)" }}>
            <CheckCircle className="w-3 h-3" /> 발송완료
          </span>
        )}
      </div>

      {/* Summary */}
      <div className="rounded-xl p-3 mb-3" style={{ background: "hsl(255, 75%, 97%)", border: "1px solid hsl(255, 75%, 90%)" }}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "hsl(255, 75%, 58%)" }}>추천</span>
            <span className="text-sm font-extrabold ml-1.5">{currentData.planName}</span>
          </div>
          <span className="text-sm font-extrabold" style={{ color: "hsl(255, 75%, 58%)" }}>{fmt(currentData.monthlyPrice)}원/월</span>
        </div>
        <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
          <span>수강생 {fmt(currentData.learners)}명</span>
          <span>저장공간 {fmt(currentData.storageInput)}GB</span>
          <span>CDN {fmt(currentData.cdnGB)}GB</span>
          {currentData.isAnnual && <span className="font-semibold" style={{ color: "hsl(152, 57%, 42%)" }}>연간할인 적용</span>}
        </div>
      </div>

      {/* Edit Mode */}
      {editing && editData && (
        <div className="rounded-xl p-3 mb-3 space-y-2 bg-white border border-[hsl(220,13%,91%)]">
          <p className="text-[11px] font-semibold text-muted-foreground">제안서 내용 수정</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground">플랜명</label>
              <select value={editData.planName} onChange={e => setEditData({ ...editData, planName: e.target.value })}
                className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-[hsl(220,13%,91%)] outline-none">
                <option>Starter</option><option>Basic</option><option>Plus</option><option>Premium</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground">월 요금 (원)</label>
              <input type="number" value={editData.monthlyPrice} onChange={e => setEditData({ ...editData, monthlyPrice: Number(e.target.value) })}
                className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-[hsl(220,13%,91%)] outline-none tabular-nums" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground">기본 요금 (원)</label>
              <input type="number" value={editData.basePrice} onChange={e => setEditData({ ...editData, basePrice: Number(e.target.value) })}
                className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-[hsl(220,13%,91%)] outline-none tabular-nums" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground">수강생 수</label>
              <input type="number" value={editData.learners} onChange={e => setEditData({ ...editData, learners: Number(e.target.value) })}
                className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-[hsl(220,13%,91%)] outline-none tabular-nums" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground">저장공간 (GB)</label>
              <input type="number" value={editData.storageInput} onChange={e => setEditData({ ...editData, storageInput: Number(e.target.value) })}
                className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-[hsl(220,13%,91%)] outline-none tabular-nums" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground">절감 금액 (원)</label>
              <input type="number" value={editData.savingsAmount} onChange={e => setEditData({ ...editData, savingsAmount: Number(e.target.value) })}
                className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-[hsl(220,13%,91%)] outline-none tabular-nums" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <label className="flex items-center gap-1.5 text-[11px]">
              <input type="checkbox" checked={editData.needsSecurePlayer} onChange={e => setEditData({ ...editData, needsSecurePlayer: e.target.checked })} /> DRM
            </label>
            <label className="flex items-center gap-1.5 text-[11px]">
              <input type="checkbox" checked={editData.needsDedicatedServer} onChange={e => setEditData({ ...editData, needsDedicatedServer: e.target.checked })} /> 단독서버
            </label>
            <label className="flex items-center gap-1.5 text-[11px]">
              <input type="checkbox" checked={editData.isAnnual} onChange={e => setEditData({ ...editData, isAnnual: e.target.checked })} /> 연간할인
            </label>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-[0.96]"
          style={{ color: "hsl(255, 75%, 58%)", background: "hsl(255, 75%, 97%)", border: "1px solid hsl(255, 75%, 90%)" }}
        >
          {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showPreview ? "닫기" : "미리보기"}
        </button>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-muted-foreground bg-white border border-[hsl(220,13%,91%)] hover:bg-[hsl(220,14%,96%)] transition-all active:scale-[0.96]"
          >
            <Edit3 className="w-3 h-3" /> 수정
          </button>
        ) : (
          <>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-white transition-all active:scale-[0.96] disabled:opacity-50"
              style={{ background: "hsl(255, 75%, 58%)" }}
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} 저장
            </button>
            <button onClick={() => { setEditing(false); setEditData({ ...proposalData }); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-muted-foreground bg-white border border-[hsl(220,13%,91%)] hover:bg-[hsl(220,14%,96%)] transition-all"
            >
              <X className="w-3 h-3" /> 취소
            </button>
          </>
        )}

        <button
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-white transition-all active:scale-[0.96] disabled:opacity-50"
          style={{ background: "hsl(220, 9%, 46%)" }}
        >
          {pdfLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />} PDF
        </button>

        <button
          onClick={handleSendEmail}
          disabled={sending || !inquiry.email}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-white transition-all active:scale-[0.96] disabled:opacity-50"
          style={{ background: sent ? "hsl(152, 57%, 42%)" : "hsl(37, 90%, 51%)" }}
        >
          {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : sent ? <CheckCircle className="w-3 h-3" /> : <Send className="w-3 h-3" />}
          {sending ? "발송 중..." : sent ? "발송완료" : "이메일 발송"}
        </button>
        {!inquiry.email && <span className="text-[10px] text-muted-foreground self-center">이메일 없음</span>}
      </div>

      {/* Preview */}
      {showPreview && currentData && (
        <div className="mt-4 rounded-2xl border-2 overflow-hidden shadow-lg" style={{ borderColor: "hsl(255, 75%, 90%)" }}>
          <SimulationProposal ref={proposalRef} data={currentData} />
        </div>
      )}

      {/* Hidden for PDF */}
      {!showPreview && currentData && (
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <SimulationProposal ref={proposalRef} data={currentData} />
        </div>
      )}
    </div>
  );
}
