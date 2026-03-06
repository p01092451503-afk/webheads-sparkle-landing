import { useState, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  MessageSquare, RefreshCw, Search, X, Phone, Mail,
  Building2, User, FileText, Calendar, ChevronRight, Download, Save, Loader2, Trash2
} from "lucide-react";
import InquiryVisitorStats from "./InquiryVisitorStats";
import InquiryAIAnalysis from "./InquiryAIAnalysis";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type InquiryStatus = "new" | "in_progress" | "completed" | "archived";

const statusConfig: Record<InquiryStatus, { label: string; color: string }> = {
  new: { label: "신규", color: "hsl(221, 83%, 53%)" },
  in_progress: { label: "진행중", color: "hsl(37, 90%, 51%)" },
  completed: { label: "완료", color: "hsl(152, 57%, 42%)" },
  archived: { label: "보관", color: "hsl(220, 9%, 46%)" },
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
  const itemRefs = useRef<Record<string, HTMLDivElement>>({});

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

  const deleteInquiry = async (id: string) => {
    await supabase.from("contact_inquiries").delete().eq("id", id);
    setInquiries((prev: any[]) => prev.filter((i) => i.id !== id));
    if (selectedInquiry?.id === id) setSelectedInquiry(null);
    logActivity("delete", "inquiry", id);
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
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground">문의 관리</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">총 {inquiries.length}건</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium text-foreground bg-white border border-[hsl(220,13%,91%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={onRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium text-muted-foreground bg-white border border-[hsl(220,13%,91%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색..."
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-[13px] outline-none text-foreground placeholder:text-muted-foreground/30 bg-white border border-[hsl(220,13%,91%)] focus:border-[hsl(221,83%,53%)] focus:ring-2 focus:ring-[hsl(221,83%,53%,0.08)] transition-all"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {(["all", "new", "in_progress", "completed", "archived"] as const).map((s) => {
            const cfg = s === "all" ? { label: "전체", color: "hsl(221, 83%, 53%)" } : statusConfig[s];
            const isActive = statusFilter === s;
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium transition-all whitespace-nowrap shrink-0"
                style={{
                  color: isActive ? "white" : "hsl(220, 9%, 46%)",
                  background: isActive ? cfg.color : "white",
                  border: isActive ? `1px solid ${cfg.color}` : "1px solid hsl(220, 13%, 91%)",
                }}
              >
                {cfg.label}
                <span className="text-[11px]" style={{ opacity: isActive ? 0.8 : 0.5 }}>{statusCounts[s] || 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] py-20 text-center">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
            <p className="text-[13px] text-muted-foreground/50">{searchQuery || statusFilter !== "all" ? "조건에 맞는 문의가 없습니다" : "접수된 문의가 없습니다"}</p>
          </div>
        ) : filteredInquiries.map((inq) => {
          const sc = statusConfig[inq.status as InquiryStatus] || statusConfig.new;
          const isSelected = selectedInquiry?.id === inq.id;
          return (
            <div key={inq.id} ref={(el) => { if (el) itemRefs.current[inq.id] = el; }}
              className="bg-white rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                scrollMarginTop: "120px",
                borderLeft: `3px solid ${sc.color}`,
                border: isSelected ? `1.5px solid hsl(221, 83%, 53%)` : `1px solid hsl(220, 13%, 91%)`,
                borderLeftWidth: "3px",
                borderLeftColor: sc.color,
                boxShadow: isSelected ? "0 0 0 3px hsl(221 83% 53% / 0.06)" : "none",
              }}
            >
              {/* Summary */}
              <div
                onClick={() => {
                  if (isSelected) { setSelectedInquiry(null); }
                  else {
                    setSelectedInquiry(inq); setNoteText(inq.notes || "");
                    setTimeout(() => { itemRefs.current[inq.id]?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
                  }
                }}
                className="group p-4 sm:p-5 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
                        style={{ background: sc.color }}
                      >
                        {sc.label}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md text-muted-foreground bg-[hsl(220,14%,96%)]">
                        {inq.inquiry_type === "demo" ? "데모" : "상담"}
                      </span>
                      {inq.notes && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md text-[hsl(37,90%,51%)] bg-[hsl(37,90%,51%,0.08)]">📝 메모</span>
                      )}
                    </div>
                    <p className="text-[14px] font-semibold text-foreground tracking-[-0.02em]">
                      {inq.company}<span className="font-normal text-muted-foreground"> · {inq.name}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Phone className="w-3 h-3" />{inq.phone}</span>
                      {inq.email && <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Mail className="w-3 h-3" />{inq.email}</span>}
                      {inq.service && <span className="text-[12px] text-muted-foreground/60">· {inq.service}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11px] text-muted-foreground/50">{formatDate(inq.created_at)}</span>
                    <ChevronRight
                      className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-all mt-1"
                      style={{ transform: isSelected ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  </div>
                </div>
              </div>

              {/* Detail */}
              {isSelected && (
                <div className="px-4 sm:px-5 pb-5 pt-0">
                  <div className="rounded-xl p-5 bg-[hsl(220,14%,97%)] border border-[hsl(220,13%,93%)]">
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
                        <p className="text-[11px] font-semibold text-muted-foreground mb-2 tracking-wide">문의 내용</p>
                        <div className="bg-white rounded-xl p-4 text-[13px] leading-relaxed text-foreground whitespace-pre-wrap border border-[hsl(220,13%,93%)]">
                          {selectedInquiry.message}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold text-muted-foreground mb-2 tracking-wide">내부 메모</p>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={3}
                        placeholder="메모를 입력하세요..."
                        className="w-full bg-white rounded-xl p-3.5 text-[13px] outline-none text-foreground placeholder:text-muted-foreground/30 resize-none border border-[hsl(220,13%,93%)] focus:border-[hsl(221,83%,53%)] focus:ring-2 focus:ring-[hsl(221,83%,53%,0.08)] transition-all"
                      />
                      <button onClick={saveNote} disabled={savingNote}
                        className="mt-2 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold text-[hsl(221,83%,53%)] bg-[hsl(221,83%,53%,0.08)] hover:bg-[hsl(221,83%,53%,0.12)] transition-all active:scale-[0.96] disabled:opacity-50"
                      >
                        {savingNote ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        메모 저장
                      </button>
                    </div>

                    {/* Status */}
                    <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
                      <p className="text-[11px] font-semibold text-muted-foreground mb-3 tracking-wide">상태 변경</p>
                      <div className="grid grid-cols-4 gap-2">
                        {(Object.keys(statusConfig) as InquiryStatus[]).map((s) => {
                          const cfg = statusConfig[s];
                          const isActive = selectedInquiry.status === s;
                          return (
                            <button key={s} onClick={() => updateStatus(selectedInquiry.id, s)}
                              className="py-2.5 rounded-xl text-[12px] font-medium transition-all duration-200 active:scale-[0.96]"
                              style={{
                                color: isActive ? "white" : "hsl(220, 9%, 46%)",
                                background: isActive ? cfg.color : "white",
                                border: isActive ? `1.5px solid ${cfg.color}` : "1.5px solid hsl(220, 13%, 91%)",
                              }}
                            >
                              {cfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Visitor Stats */}
                    <InquiryVisitorStats sessionId={selectedInquiry.session_id} />

                    {/* Delete */}
                    <div className="mt-4 pt-4 border-t border-[hsl(220,13%,93%)]">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold text-[hsl(0,84%,60%)] bg-[hsl(0,84%,60%,0.06)] hover:bg-[hsl(0,84%,60%,0.1)] transition-all active:scale-[0.96]">
                            <Trash2 className="w-3 h-3" /> 문의 삭제
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>문의를 삭제하시겠습니까?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {selectedInquiry.company} · {selectedInquiry.name} 문의가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteInquiry(selectedInquiry.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-[hsl(220,14%,93%)]">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        {isLink && href ? (
          <a href={href} className="text-[14px] font-medium text-[hsl(221,83%,53%)] hover:underline">{value}</a>
        ) : (
          <p className="text-[14px] font-medium text-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}
