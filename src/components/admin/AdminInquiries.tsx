import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  MessageSquare, RefreshCw, Search, X, Phone, Mail,
  Building2, User, FileText, Calendar, ChevronRight, Download, Save, Loader2
} from "lucide-react";

type InquiryStatus = "new" | "in_progress" | "completed" | "archived";

const statusConfig: Record<InquiryStatus, { label: string; color: string; bg: string; dot: string }> = {
  new: { label: "신규", color: "hsl(214, 90%, 52%)", bg: "hsl(214 90% 52% / 0.08)", dot: "hsl(214, 90%, 52%)" },
  in_progress: { label: "진행중", color: "hsl(35, 90%, 50%)", bg: "hsl(35 90% 50% / 0.08)", dot: "hsl(35, 90%, 50%)" },
  completed: { label: "완료", color: "hsl(150, 60%, 42%)", bg: "hsl(150 60% 42% / 0.08)", dot: "hsl(150, 60%, 42%)" },
  archived: { label: "보관", color: "hsl(var(--muted-foreground))", bg: "hsl(var(--muted))", dot: "hsl(var(--muted-foreground))" },
};

interface AdminInquiriesProps {
  inquiries: any[];
  setInquiries: (fn: any) => void;
  onRefresh: () => void;
  logActivity: (action: string, targetType?: string, targetId?: string, details?: any) => void;
}

export default function AdminInquiries({ inquiries, setInquiries, onRefresh, logActivity }: AdminInquiriesProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (statusFilter !== "all" && inq.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return inq.company?.toLowerCase().includes(q) || inq.name?.toLowerCase().includes(q) ||
          inq.phone?.includes(q) || inq.email?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [inquiries, statusFilter, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: inquiries.length };
    inquiries.forEach((inq) => { counts[inq.status] = (counts[inq.status] || 0) + 1; });
    return counts;
  }, [inquiries]);

  const updateStatus = async (id: string, status: InquiryStatus) => {
    await supabase.from("contact_inquiries").update({ status }).eq("id", id);
    setInquiries((prev: any[]) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    if (selectedInquiry?.id === id) setSelectedInquiry({ ...selectedInquiry, status });
    logActivity("status_change", "inquiry", id, { status });
  };

  const saveNote = async () => {
    if (!selectedInquiry) return;
    setSavingNote(true);
    await supabase.from("contact_inquiries").update({ notes: noteText }).eq("id", selectedInquiry.id);
    setInquiries((prev: any[]) => prev.map((i) => (i.id === selectedInquiry.id ? { ...i, notes: noteText } : i)));
    setSelectedInquiry({ ...selectedInquiry, notes: noteText });
    logActivity("note_update", "inquiry", selectedInquiry.id);
    setSavingNote(false);
  };

  const exportCSV = () => {
    const headers = ["접수일", "상태", "유형", "회사명", "담당자", "연락처", "이메일", "관심서비스", "문의내용", "메모"];
    const rows = filteredInquiries.map((inq) => [
      new Date(inq.created_at).toLocaleString("ko-KR"),
      statusConfig[inq.status as InquiryStatus]?.label || inq.status,
      inq.inquiry_type === "demo" ? "데모" : "상담",
      inq.company, inq.name, inq.phone, inq.email || "", inq.service || "",
      (inq.message || "").replace(/\n/g, " "), (inq.notes || "").replace(/\n/g, " "),
    ]);

    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `문의목록_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    logActivity("export_csv", "inquiry", undefined, { count: filteredInquiries.length });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 1) return "방금 전";
    if (diff < 60) return `${diff}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    if (diff < 10080) return `${Math.floor(diff / 1440)}일 전`;
    return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] tracking-[-0.04em] text-foreground" style={{ fontWeight: 700 }}>문의 관리</h2>
          <p className="text-[14px] text-muted-foreground mt-1">총 {inquiries.length}건의 문의</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] transition-all hover:shadow-sm"
            style={{ fontWeight: 500, color: "hsl(var(--foreground))", background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
          >
            <Download className="w-3.5 h-3.5" /> CSV 다운로드
          </button>
          <button onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] transition-all hover:shadow-sm"
            style={{ fontWeight: 500, color: "hsl(var(--muted-foreground))", background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
          >
            <RefreshCw className="w-3.5 h-3.5" /> 새로고침
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="회사명, 이름, 연락처로 검색..."
            className="w-full rounded-xl pl-11 pr-4 py-2.5 text-[13px] outline-none transition-all text-foreground placeholder:text-muted-foreground/40"
            style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--primary))"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(var(--primary) / 0.06)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "new", "in_progress", "completed", "archived"] as const).map((s) => {
            const cfg = s === "all" ? { label: "전체", color: "hsl(var(--foreground))", bg: "hsl(var(--foreground) / 0.06)", dot: "" } : statusConfig[s];
            const isActive = statusFilter === s;
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] transition-all"
                style={{ fontWeight: isActive ? 600 : 500, color: isActive ? cfg.color : "hsl(var(--muted-foreground))", background: isActive ? cfg.bg : "transparent" }}
              >
                {s !== "all" && <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />}
                {cfg.label}
                <span className="text-[11px]" style={{ opacity: 0.6 }}>{statusCounts[s] || 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List with inline detail */}
      <div className="flex flex-col gap-2">
        {filteredInquiries.length === 0 ? (
          <div className="rounded-2xl py-20 text-center" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-[14px] text-muted-foreground">{searchQuery || statusFilter !== "all" ? "조건에 맞는 문의가 없습니다" : "접수된 문의가 없습니다"}</p>
          </div>
        ) : filteredInquiries.map((inq) => {
          const sc = statusConfig[inq.status as InquiryStatus] || statusConfig.new;
          const isSelected = selectedInquiry?.id === inq.id;
          return (
            <div key={inq.id} className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background: "hsl(var(--background))",
                border: isSelected ? "1.5px solid hsl(var(--primary))" : "1px solid hsl(var(--border) / 0.8)",
                boxShadow: isSelected ? "0 0 0 3px hsl(var(--primary) / 0.06), 0 2px 8px hsl(var(--primary) / 0.08)" : "0 1px 3px hsl(0 0% 0% / 0.02)",
              }}
            >
              {/* Summary row */}
              <div
                onClick={() => {
                  if (isSelected) { setSelectedInquiry(null); }
                  else { setSelectedInquiry(inq); setNoteText(inq.notes || ""); }
                }}
                className="group p-5 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg"
                        style={{ fontWeight: 600, color: sc.color, background: sc.bg }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                        {sc.label}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md"
                        style={{ fontWeight: 500, color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted))" }}
                      >
                        {inq.inquiry_type === "demo" ? "데모" : "상담"}
                      </span>
                      {inq.notes && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md"
                          style={{ fontWeight: 500, color: "hsl(35, 90%, 50%)", background: "hsl(35 90% 50% / 0.08)" }}
                        >
                          📝 메모
                        </span>
                      )}
                    </div>
                    <p className="text-[15px] text-foreground tracking-[-0.02em]" style={{ fontWeight: 600 }}>
                      {inq.company}<span className="text-muted-foreground" style={{ fontWeight: 400 }}> · {inq.name}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Phone className="w-3 h-3" />{inq.phone}</span>
                      {inq.email && <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Mail className="w-3 h-3" />{inq.email}</span>}
                      {inq.service && <span className="text-[12px] text-muted-foreground">· {inq.service}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11px] text-muted-foreground/70">{formatDate(inq.created_at)}</span>
                    <ChevronRight
                      className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-all mt-2"
                      style={{ transform: isSelected ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  </div>
                </div>
              </div>

              {/* Inline detail panel */}
              {isSelected && (
                <div className="px-5 pb-5 pt-0">
                  <div className="rounded-xl p-5" style={{ background: "hsl(var(--muted) / 0.5)", border: "1px solid hsl(var(--border) / 0.5)" }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DetailRow icon={Building2} label="회사명" value={selectedInquiry.company} />
                      <DetailRow icon={User} label="담당자" value={selectedInquiry.name} />
                      <DetailRow icon={Phone} label="연락처" value={selectedInquiry.phone} isLink href={`tel:${selectedInquiry.phone}`} />
                      {selectedInquiry.email && <DetailRow icon={Mail} label="이메일" value={selectedInquiry.email} isLink href={`mailto:${selectedInquiry.email}`} />}
                      {selectedInquiry.service && <DetailRow icon={FileText} label="관심 서비스" value={selectedInquiry.service} />}
                      <DetailRow icon={Calendar} label="접수일" value={new Date(selectedInquiry.created_at).toLocaleString("ko-KR")} />
                    </div>

                    {selectedInquiry.message && (
                      <div className="mt-4">
                        <p className="text-[11px] text-muted-foreground mb-2" style={{ fontWeight: 600, letterSpacing: "0.02em" }}>문의 내용</p>
                        <div className="rounded-xl p-4 text-[13px] leading-relaxed text-foreground whitespace-pre-wrap"
                          style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border) / 0.5)" }}>
                          {selectedInquiry.message}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <div className="mt-4">
                      <p className="text-[11px] text-muted-foreground mb-2" style={{ fontWeight: 600, letterSpacing: "0.02em" }}>내부 메모</p>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={3}
                        placeholder="이 문의에 대한 내부 메모를 남겨보세요..."
                        className="w-full rounded-xl p-3.5 text-[13px] outline-none transition-all text-foreground placeholder:text-muted-foreground/40 resize-none"
                        style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border) / 0.5)" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--primary))"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(var(--primary) / 0.06)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(var(--border) / 0.5)"; e.currentTarget.style.boxShadow = "none"; }}
                      />
                      <button onClick={saveNote} disabled={savingNote}
                        className="mt-2 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] transition-all active:scale-[0.96] disabled:opacity-50"
                        style={{ fontWeight: 600, color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.08)" }}
                      >
                        {savingNote ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        메모 저장
                      </button>
                    </div>

                    {/* Status */}
                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid hsl(var(--border) / 0.6)" }}>
                      <p className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 600, letterSpacing: "0.02em" }}>상태 변경</p>
                      <div className="grid grid-cols-4 gap-2">
                        {(Object.keys(statusConfig) as InquiryStatus[]).map((s) => {
                          const cfg = statusConfig[s];
                          const isActive = selectedInquiry.status === s;
                          return (
                            <button key={s} onClick={() => updateStatus(selectedInquiry.id, s)}
                              className="py-2.5 rounded-xl text-[12px] transition-all duration-200 active:scale-[0.96]"
                              style={{ fontWeight: isActive ? 600 : 500, color: isActive ? cfg.color : "hsl(var(--muted-foreground))", background: isActive ? cfg.bg : "hsl(var(--muted))", border: isActive ? `1.5px solid ${cfg.color}30` : "1.5px solid transparent" }}
                            >
                              {cfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, isLink, href }: {
  icon: any; label: string; value: string; isLink?: boolean; href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "hsl(var(--muted))" }}>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>{label}</p>
        {isLink && href ? (
          <a href={href} className="text-[14px] text-primary hover:underline" style={{ fontWeight: 500 }}>{value}</a>
        ) : (
          <p className="text-[14px] text-foreground" style={{ fontWeight: 500 }}>{value}</p>
        )}
      </div>
    </div>
  );
}
