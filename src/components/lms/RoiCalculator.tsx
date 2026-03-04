import { useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Calculator, TrendingUp, ArrowRight, Bot, Shield, MessageSquare, Info, ChevronDown, ChevronUp, Download, BookOpen, Users, BarChart3, BarChart2, Sparkles, Building2, Wrench, Server } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

/* ══════════════════════════════════════════════
 * NEW COST MODEL
 * 
 * ■ 자체 구축
 *   - 초기 개발비: 5,000만원 (1회성, 별도 표시)
 *   - 월 유지보수비: 200만원 (연 2,400만원)
 *   - 월 서버/인프라비: 100만원 (연 1,200만원)
 *   - 인건비(운영자): 양쪽 동일하므로 비교에서 제외
 *
 * ■ 웹헤즈 LMS (Plus 요금제)
 *   - 월 이용료: 70만원 (연 840만원)
 *   - 초기 개발비: 0원
 *   - 전송량/저장공간 초과 시 추과 과금
 * ══════════════════════════════════════════════ */

const SELF_BUILD_INIT_DEV = 50_000_000;       // 초기 개발비 (1회)
const SELF_BUILD_MONTHLY_MAINT = 2_000_000;   // 월 유지보수비
const SELF_BUILD_MONTHLY_SERVER = 1_000_000;  // 월 서버/인프라비

function calcSelfBuildCosts() {
  const annualMaint = SELF_BUILD_MONTHLY_MAINT * 12;
  const annualServer = SELF_BUILD_MONTHLY_SERVER * 12;
  const annualOps = annualMaint + annualServer; // 연간 운영비
  return { initDev: SELF_BUILD_INIT_DEV, annualMaint, annualServer, annualOps };
}

/**
 * 웹헤즈 LMS 비용 (연간) — Plus 요금제(월 700,000원) 기준
 * 기본량: 전송 1,500GB/월, 저장 200GB
 * 초과 단가: 전송 400원/GB, 저장 800원/GB
 */
function calcWebheadsAnnual(students: number, courses: number) {
  const baseFee = 700_000 * 12;
  const INCLUDED_TRANSFER_GB = 1500;
  const INCLUDED_STORAGE_GB = 200;
  const TRANSFER_OVERAGE_PER_GB = 400;
  const STORAGE_OVERAGE_PER_GB = 800;
  const GB_PER_STUDENT = 1.5;
  const GB_PER_COURSE = 2.0;

  const monthlyTransferGB = students * GB_PER_STUDENT;
  const storageGB = courses * GB_PER_COURSE;

  const transferOverageGB = Math.max(0, monthlyTransferGB - INCLUDED_TRANSFER_GB);
  const storageOverageGB = Math.max(0, storageGB - INCLUDED_STORAGE_GB);

  const transferOverageCost = transferOverageGB * TRANSFER_OVERAGE_PER_GB * 12;
  const storageOverageCost = storageOverageGB * STORAGE_OVERAGE_PER_GB;

  return {
    baseFee,
    transferOverageCost: Math.round(transferOverageCost),
    storageOverageCost: Math.round(storageOverageCost),
    total: Math.round(baseFee + transferOverageCost + storageOverageCost),
  };
}

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#EDE9FE";
const PURPLE_BG = "#F8F7FF";
const TEXT_DARK = "#1E1B4B";
const GREEN_BG = "hsl(145, 70%, 93%)";
const GREEN_TEXT = "hsl(145, 60%, 28%)";
const GREEN_ACCENT = "hsl(145, 60%, 38%)";

export default function RoiCalculator() {
  const { t } = useTranslation();
  const [students, setStudents] = useState(500);
  const [fee, setFee] = useState(100000);
  const [courses, setCourses] = useState(10);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showWhBreakdown, setShowWhBreakdown] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const monthlyRevenue = students * fee;
  const annualRevenue = monthlyRevenue * 12;

  const selfBuild = useMemo(() => calcSelfBuildCosts(), []);
  const webheadsResult = useMemo(() => calcWebheadsAnnual(students, courses), [students, courses]);
  const webheadsAnnual = webheadsResult.total;
  const webheadsMonthly = Math.round(webheadsAnnual / 12);

  const hasTransferOverage = webheadsResult.transferOverageCost > 0;
  const hasStorageOverage = webheadsResult.storageOverageCost > 0;
  const hasOverage = hasTransferOverage || hasStorageOverage;
  const monthlyTransferUsed = Math.round(students * 1.5);
  const storageUsed = Math.round(courses * 2);
  const transferUsagePercent = Math.min(100, Math.round((monthlyTransferUsed / 1500) * 100));
  const storageUsagePercent = Math.min(100, Math.round((storageUsed / 200) * 100));

  // 비교: 연간 운영비 기준 (초기 개발비 별도)
  const savingsAmount = selfBuild.annualOps - webheadsAnnual;
  const savingsPercent = selfBuild.annualOps > 0 ? ((savingsAmount / selfBuild.annualOps) * 100).toFixed(1) : "0";
  const lmsCostRatio = annualRevenue > 0 ? Math.min(100, Math.round((webheadsAnnual / annualRevenue) * 100)) : 0;

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  // Chart data
  const comparisonData = useMemo(() => [
    { name: "유지보수비", self: SELF_BUILD_MONTHLY_MAINT, wh: 0 },
    { name: "서버/인프라", self: SELF_BUILD_MONTHLY_SERVER, wh: 0 },
    { name: "웹헤즈 LMS", self: 0, wh: webheadsMonthly },
  ], [webheadsMonthly]);

  const projectionData = useMemo(() => {
    const selfAnnualOps = selfBuild.annualOps;
    const whAnnual = webheadsAnnual;
    return Array.from({ length: 5 }, (_, i) => {
      const year = i + 1;
      // 자체구축: 초기 개발비 + 누적 운영비 (연 5% 증가)
      const selfCum = SELF_BUILD_INIT_DEV + Array.from({ length: year }, (_, y) => Math.round(selfAnnualOps * Math.pow(1.05, y))).reduce((a, b) => a + b, 0);
      const whCum = whAnnual * year;
      return { name: t("lms.roiCalc.year", { n: year }), selfBuild: selfCum, webheads: whCum, savings: selfCum - whCum };
    });
  }, [selfBuild.annualOps, webheadsAnnual, t]);

  const addonItems = [
    { icon: Bot, label: t("lms.roiCalc.addonChatbot"), value: t("lms.roiCalc.chatbotSaving"), basis: t("lms.roiCalc.chatbotBasis"), color: "#7C3AED" },
    { icon: Shield, label: t("lms.roiCalc.addonDrm"), value: t("lms.roiCalc.drmSaving"), basis: t("lms.roiCalc.drmBasis"), color: "#EC4899" },
    { icon: MessageSquare, label: t("lms.roiCalc.addonSms"), value: t("lms.roiCalc.smsSaving"), basis: t("lms.roiCalc.smsBasis"), color: "#10B981" },
  ];

  const handlePdfExport = useCallback(() => {
    const now = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
    const lines = [
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `  ${t("lms.roiCalc.pdfTitle")}`,
      `  ${t("lms.roiCalc.pdfGenerated")}: ${now}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `■ ${t("lms.roiCalc.pdfConditions")}`,
      `  • ${t("lms.roiCalc.studentsLabel")}: ${fmt(students)}${t("lms.roiCalc.studentsUnit")}`,
      `  • ${t("lms.roiCalc.coursesLabel")}: ${fmt(courses)}${t("lms.roiCalc.coursesUnit")}`,
      `  • ${t("lms.roiCalc.feeLabel")}: ${fmt(fee)}${t("lms.roiCalc.feeUnit")}`,
      ``,
      `■ ${t("lms.roiCalc.annualRevenue")}`,
      `  • ${fmt(annualRevenue)}${t("lms.roiCalc.feeUnit")}`,
      ``,
      `■ 자체 구축 비용`,
      `  • 초기 개발비 (1회): ${fmt(SELF_BUILD_INIT_DEV)}원`,
      `  • 연간 운영비: ${fmt(selfBuild.annualOps)}원`,
      `    - 유지보수비: ${fmt(selfBuild.annualMaint)}원/년`,
      `    - 서버/인프라: ${fmt(selfBuild.annualServer)}원/년`,
      `  • ※ 인건비(운영자)는 양쪽 동일하여 비교에서 제외`,
      ``,
      `■ 웹헤즈 LMS 비용`,
      `  • 연간 이용료: ${fmt(webheadsAnnual)}원`,
      `  • 초기 개발비: 0원`,
      ``,
      `■ ${t("lms.roiCalc.annualSavings")} (연간 운영비 기준)`,
      `  • ${fmt(savingsAmount)}${t("lms.roiCalc.feeUnit")} (${savingsPercent}%)`,
      ``,
      `■ ${t("lms.roiCalc.pdfProjection")} (초기 개발비 포함)`,
      ...projectionData.map(d => `  • ${d.name}: ${fmt(d.savings)}${t("lms.roiCalc.feeUnit")}`),
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      t("lms.roiCalc.pdfDisclaimer"),
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WEBHEADS_ROI_Report_${students}students.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [students, courses, fee, annualRevenue, selfBuild, webheadsAnnual, savingsAmount, savingsPercent, projectionData, t]);

  const chartTooltipFormatter = (value: number) => `${fmt(value)}원`;

  /* ── Slider component ── */
  const SliderInput = ({ label, unit, value, min, max, step, onChange, icon: Icon }: {
    label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; icon: any;
  }) => (
    <div className="mb-7 last:mb-0">
      <div className="flex justify-between items-end mb-3">
        <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: TEXT_DARK }}>
          <Icon className="w-4 h-4" style={{ color: PURPLE }} />
          {label}
        </label>
        <div className="text-right">
          <span className="text-xl font-bold" style={{ color: PURPLE }}>{fmt(value)}</span>
          <span className="text-xs ml-0.5" style={{ color: PURPLE }}>{unit}</span>
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${PURPLE} ${((value - min) / (max - min)) * 100}%, #E5E7EB ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
      <div className="flex justify-between text-[11px] mt-1.5" style={{ color: "#9CA3AF" }}>
        <span>{fmt(min)}</span>
        <span>{fmt(max)}</span>
      </div>
    </div>
  );

  return (
    <section className="py-16 md:py-28" ref={reportRef} id="roi-calculator" style={{ background: PURPLE_BG }}>
      <div className="container mx-auto px-5 md:px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: PURPLE }}>
            {t("lms.roiCalc.sub")}
          </p>
          <h2 className="font-bold leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line" style={{ color: TEXT_DARK }}>
            {t("lms.roiCalc.title")}
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base" style={{ color: "#6B7280" }}>{t("lms.roiCalc.desc")}</p>
        </div>

        {/* Main 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 md:gap-6 items-start">

          {/* ── LEFT: Input Panel (40%) ── */}
          <div className="lg:col-span-2 rounded-[20px] bg-white border border-gray-100 shadow-sm px-6 py-8 md:px-8 md:py-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: PURPLE_LIGHT }}>
                <Calculator className="w-5 h-5" style={{ color: PURPLE }} />
              </div>
              <h3 className="font-bold text-lg" style={{ color: TEXT_DARK }}>{t("lms.roiCalc.inputTitle")}</h3>
            </div>

            <SliderInput label={t("lms.roiCalc.studentsLabel")} unit={t("lms.roiCalc.studentsUnit")} value={students} min={50} max={5000} step={50} onChange={setStudents} icon={Users} />
            <SliderInput label={t("lms.roiCalc.feeLabel")} unit={t("lms.roiCalc.feeUnit")} value={fee} min={10000} max={500000} step={5000} onChange={setFee} icon={TrendingUp} />
            <SliderInput label={t("lms.roiCalc.coursesLabel")} unit={t("lms.roiCalc.coursesUnit")} value={courses} min={1} max={100} step={1} onChange={setCourses} icon={BookOpen} />

            {/* 인건비 제외 안내 */}
            <div className="mt-4 p-3 rounded-xl text-[11px] leading-relaxed" style={{ background: PURPLE_LIGHT, color: "#6B7280" }}>
              💡 운영 인건비는 자체 구축과 웹헤즈 모두 동일하게 발생하므로 비교에서 제외했습니다.
            </div>
          </div>

          {/* ── RIGHT: Result Panel (60%) ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Result header */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: PURPLE_LIGHT }}>
                <TrendingUp className="w-5 h-5" style={{ color: PURPLE }} />
              </div>
              <h3 className="font-bold text-lg" style={{ color: TEXT_DARK }}>{t("lms.roiCalc.resultTitle", "예상 절감 효과")}</h3>
            </div>

            {/* ── 초기 투자비 비교 배너 ── */}
            <div className="rounded-[16px] p-5 md:p-6 bg-white border border-gray-200 shadow-sm">
              <p className="text-xs font-bold mb-4" style={{ color: TEXT_DARK }}>초기 투자비 비교</p>
              <div className="grid grid-cols-2 gap-4 relative">
                {/* 자체구축 카드 */}
                <div
                  className="rounded-xl p-4 relative transition-colors duration-300"
                  style={{
                    background: selfBuild.annualOps > 40_000_000 ? "#FFEBEE" : "#FFF1F1",
                    border: "1px solid #FFCDD2",
                  }}
                >
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-bold text-white" style={{ background: "#E53935" }}>
                    ❌ 고비용
                  </div>
                  <p className="text-[10px] font-medium mb-1" style={{ color: "#6B7280" }}>자체 구축</p>
                  <p className="font-bold text-lg" style={{ color: "#E53935" }}>
                    {fmt(SELF_BUILD_INIT_DEV)}<span className="text-xs font-normal">원</span>
                  </p>
                  <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: "#9CA3AF" }}>
                    ⏱ 개발 기간 약 6~12개월 소요
                  </p>
                </div>

                {/* VS 뱃지 */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-white"
                  style={{ border: "1px solid #E5E7EB", color: "#9CA3AF" }}
                >
                  VS
                </div>

                {/* 웹헤즈 LMS 카드 */}
                <div
                  className="rounded-xl relative animate-scale-in"
                  style={{
                    padding: "1.25rem 1.25rem 1.5rem",
                    background: "linear-gradient(135deg, #EDE9FE, #F3E8FF)",
                    border: `2px solid ${PURPLE}`,
                    boxShadow: "0 4px 20px rgba(124,58,237,0.15)",
                  }}
                >
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: PURPLE }}>
                    즉시 도입 가능
                  </div>
                  <p className="text-[10px] font-medium mb-2" style={{ color: "#6B7280" }}>웹헤즈 LMS</p>
                  <p className="font-bold flex items-center gap-1" style={{ color: PURPLE, fontSize: "2.25rem", lineHeight: 1 }}>
                    ✅ 0<span className="text-sm font-normal">원</span>
                  </p>
                  <p className="text-[11px] mt-2 font-medium" style={{ color: PURPLE, opacity: 0.8 }}>
                    ⚡ 도입 기간 0일
                  </p>
                </div>
              </div>
            </div>

            {/* ── 연간 운영비 비교 카드 ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Self-build card */}
              <div className="rounded-[16px] p-5 md:p-6 border" style={{ background: "#F3F4F6", borderColor: "#9CA3AF" }}>
                <p className="text-xs font-medium mb-3" style={{ color: "#6B7280" }}>
                  자체 구축 운영비 (연간)
                </p>
                <p className="font-bold text-xl md:text-2xl" style={{ color: "#4B5563" }}>
                  {fmt(selfBuild.annualOps)}<span className="text-sm font-normal ml-0.5">원</span>
                </p>
                <p className="text-[11px] mt-1" style={{ color: "#9CA3AF" }}>
                  월 {fmt(SELF_BUILD_MONTHLY_MAINT + SELF_BUILD_MONTHLY_SERVER)}원
                </p>
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="mt-3 text-[11px] md:text-xs flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ color: "#9CA3AF" }}
                >
                  산출 근거 보기
                  {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showBreakdown && (
                  <div className="mt-3 pt-3 space-y-2.5 border-t" style={{ borderColor: "#E5E7EB" }}>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] flex items-center gap-1" style={{ color: "#6B7280" }}>
                        <Wrench className="w-3 h-3" /> 유지보수비
                      </span>
                      <span className="text-[11px] font-semibold" style={{ color: "#4B5563" }}>
                        월 {fmt(SELF_BUILD_MONTHLY_MAINT)}원 × 12 = {fmt(selfBuild.annualMaint)}원
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] flex items-center gap-1" style={{ color: "#6B7280" }}>
                        <Server className="w-3 h-3" /> 서버/인프라
                      </span>
                      <span className="text-[11px] font-semibold" style={{ color: "#4B5563" }}>
                        월 {fmt(SELF_BUILD_MONTHLY_SERVER)}원 × 12 = {fmt(selfBuild.annualServer)}원
                      </span>
                    </div>
                    <div className="pt-2 mt-1 border-t flex justify-between items-center" style={{ borderColor: "#E5E7EB" }}>
                      <span className="text-[11px] font-bold" style={{ color: "#4B5563" }}>연간 합계</span>
                      <span className="text-[11px] font-bold" style={{ color: "#4B5563" }}>{fmt(selfBuild.annualOps)}원</span>
                    </div>
                    <p className="text-[9px] leading-relaxed rounded-lg p-2" style={{ color: "#6B7280", background: "#F9FAFB" }}>
                      ※ 초기 개발비 {fmt(SELF_BUILD_INIT_DEV)}원은 1회성 비용으로 별도 표기됩니다. 운영 인건비는 양쪽 동일하여 제외했습니다.
                    </p>
                  </div>
                )}
              </div>

              {/* Webheads card */}
              <div className="rounded-[16px] p-5 md:p-6 bg-white shadow-md relative" style={{ border: `2px solid ${PURPLE}` }}>
                <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: PURPLE }}>
                  {t("lms.roiCalc.recommended", "추천")}
                </div>
                <p className="text-xs font-medium mb-3" style={{ color: PURPLE }}>
                  웹헤즈 LMS (연간)
                </p>
                <p className="font-bold text-xl md:text-2xl" style={{ color: PURPLE }}>
                  {fmt(webheadsResult.baseFee)}<span className="text-sm font-normal ml-0.5">원</span>
                </p>
                <p className="text-[11px] mt-1" style={{ color: PURPLE, opacity: 0.6 }}>
                  기본료 월 700,000원 × 12개월
                </p>
                {hasOverage && (
                  <div className="mt-2 pt-2 border-t" style={{ borderColor: PURPLE_LIGHT }}>
                    <p className="text-[11px] font-medium" style={{ color: "#EF4444" }}>
                      + 초과 비용 {fmt(webheadsResult.transferOverageCost + webheadsResult.storageOverageCost)}원
                    </p>
                    <p className="text-[11px] font-bold mt-1" style={{ color: PURPLE }}>
                      합계: {fmt(webheadsAnnual)}원 <span className="font-normal opacity-60">(월 {fmt(webheadsMonthly)}원)</span>
                    </p>
                  </div>
                )}

                {/* Infra usage indicators */}
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-medium" style={{ color: "#6B7280" }}>월 전송량</span>
                      <span className="text-[10px] font-semibold" style={{ color: hasTransferOverage ? "#EF4444" : PURPLE }}>
                        {fmt(monthlyTransferUsed)}GB / 1,500GB
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "#E5E7EB" }}>
                      <div className="h-1.5 rounded-full transition-all duration-500" style={{
                        width: `${Math.min(transferUsagePercent, 100)}%`,
                        background: hasTransferOverage ? "linear-gradient(90deg, #7C3AED, #EF4444)" : `linear-gradient(90deg, ${PURPLE}, #A855F7)`,
                      }} />
                    </div>
                    {hasTransferOverage && (
                      <p className="text-[9px] mt-0.5 font-medium" style={{ color: "#EF4444" }}>
                        ⚠ 기본량 초과 +{fmt(monthlyTransferUsed - 1500)}GB → 연 +{fmt(webheadsResult.transferOverageCost)}원
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-medium" style={{ color: "#6B7280" }}>저장공간</span>
                      <span className="text-[10px] font-semibold" style={{ color: hasStorageOverage ? "#EF4444" : PURPLE }}>
                        {fmt(storageUsed)}GB / 200GB
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "#E5E7EB" }}>
                      <div className="h-1.5 rounded-full transition-all duration-500" style={{
                        width: `${Math.min(storageUsagePercent, 100)}%`,
                        background: hasStorageOverage ? "linear-gradient(90deg, #7C3AED, #EF4444)" : `linear-gradient(90deg, ${PURPLE}, #A855F7)`,
                      }} />
                    </div>
                    {hasStorageOverage && (
                      <p className="text-[9px] mt-0.5 font-medium" style={{ color: "#EF4444" }}>
                        ⚠ 기본량 초과 +{fmt(storageUsed - 200)}GB → 연 +{fmt(webheadsResult.storageOverageCost)}원
                      </p>
                    )}
                  </div>
                </div>

                {/* Breakdown toggle */}
                <button
                  onClick={() => setShowWhBreakdown(!showWhBreakdown)}
                  className="mt-3 text-[11px] md:text-xs flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ color: PURPLE, opacity: 0.6 }}
                >
                  산출 근거 보기
                  {showWhBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showWhBreakdown && (
                  <div className="mt-3 pt-3 space-y-2 border-t" style={{ borderColor: PURPLE_LIGHT }}>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px]" style={{ color: "#6B7280" }}>기본료 (월 700,000 × 12)</span>
                      <span className="text-[11px] font-semibold" style={{ color: PURPLE }}>{fmt(webheadsResult.baseFee)}원</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px]" style={{ color: "#6B7280" }}>전송량 초과 비용</span>
                      <span className="text-[11px] font-semibold" style={{ color: hasTransferOverage ? "#EF4444" : PURPLE }}>
                        {hasTransferOverage ? `+${fmt(webheadsResult.transferOverageCost)}원` : "포함"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px]" style={{ color: "#6B7280" }}>저장공간 초과 비용</span>
                      <span className="text-[11px] font-semibold" style={{ color: hasStorageOverage ? "#EF4444" : PURPLE }}>
                        {hasStorageOverage ? `+${fmt(webheadsResult.storageOverageCost)}원` : "포함"}
                      </span>
                    </div>
                    <div className="pt-2 mt-1 border-t flex justify-between items-center" style={{ borderColor: PURPLE_LIGHT }}>
                      <span className="text-[11px] font-bold" style={{ color: PURPLE }}>연간 합계</span>
                      <span className="text-[11px] font-bold" style={{ color: PURPLE }}>{fmt(webheadsAnnual)}원</span>
                    </div>
                    {hasOverage && (
                      <p className="text-[9px] mt-1 leading-relaxed rounded-lg p-2" style={{ color: "#6B7280", background: PURPLE_LIGHT }}>
                        💡 수강생 수와 콘텐츠가 늘어나면 전송량·저장공간 사용이 증가하여 Plus 요금제 기본량을 초과할 수 있습니다. 초과분은 전송량 400원/GB, 저장공간 800원/GB 단가로 과금됩니다.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Savings banner — 연간 운영비 기준 */}
            <div
              className="rounded-[16px] p-6 md:p-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
              style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
            >
              <div className="text-center sm:text-right">
                <p className="text-white/70 text-xs mb-1">연간 운영비 절감</p>
                <p className="text-white font-extrabold text-5xl md:text-6xl leading-none">{savingsPercent}%</p>
              </div>
              <div className="hidden sm:block w-px h-16 bg-white/20" />
              <div className="text-center sm:text-left">
                <p className="text-white font-bold text-2xl md:text-3xl">{fmt(savingsAmount)}<span className="text-base font-normal ml-0.5">원</span></p>
                <p className="text-white/60 text-[11px] md:text-xs mt-1">
                  초기 개발비 {fmt(SELF_BUILD_INIT_DEV)}원 추가 절감 (1회성)
                </p>
              </div>
            </div>

            {/* Annual revenue bar */}
            <div className="rounded-[16px] p-4 md:p-5 bg-white border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm" style={{ color: "#6B7280" }}>{t("lms.roiCalc.annualRevenue")}</span>
                <span className="font-bold text-sm md:text-base" style={{ color: TEXT_DARK }}>{fmt(annualRevenue)}{t("lms.roiCalc.feeUnit")}</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: "#E5E7EB" }}>
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ width: `${lmsCostRatio}%`, background: `linear-gradient(90deg, ${PURPLE}, #A855F7)` }}
                />
              </div>
              <p className="text-[10px] mt-1.5" style={{ color: "#9CA3AF" }}>
                {t("lms.roiCalc.costRatio", { ratio: lmsCostRatio, defaultValue: `매출 대비 LMS 비용 비율: ${lmsCostRatio}%` })}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 mt-1">
              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white transition-all hover:opacity-90 shadow-lg"
                style={{ background: PURPLE }}
              >
                {t("lms.roiCalc.cta")}
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={handlePdfExport}
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all hover:bg-purple-50"
                style={{ border: `2px solid ${PURPLE}`, color: PURPLE }}
              >
                <Download className="w-4 h-4" />
                {t("lms.roiCalc.pdfExport", "결과 다운로드")}
              </button>
            </div>
          </div>
        </div>

        {/* ── Collapsible Charts Section ── */}
        <Collapsible open={showCharts} onOpenChange={setShowCharts}>
          <CollapsibleTrigger asChild>
            <button className="w-full mt-5 md:mt-8 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl border border-gray-200 bg-white font-semibold text-sm hover:bg-gray-50 transition-all group cursor-pointer" style={{ color: TEXT_DARK }}>
              <BarChart2 className="w-4.5 h-4.5" style={{ color: "#9CA3AF" }} />
              <span>{showCharts ? t("lms.roiCalc.hideCharts", "상세 비용 비교 & 장기 절감 시뮬레이션 닫기") : t("lms.roiCalc.showCharts", "상세 비용 비교 & 장기 절감 시뮬레이션 보기")}</span>
              {showCharts ? <ChevronUp className="w-4 h-4" style={{ color: "#9CA3AF" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "#9CA3AF" }} />}
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 overflow-hidden">
            {/* Cost Comparison Bar Chart */}
            <div className="mt-5 md:mt-8 rounded-[20px] border border-gray-100 bg-white p-5 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: PURPLE_LIGHT }}>
                  <BarChart3 className="w-5 h-5" style={{ color: PURPLE }} />
                </div>
                <div>
                  <h4 className="font-bold text-base" style={{ color: TEXT_DARK }}>월 운영비 항목별 비교</h4>
                  <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>자체 구축 vs 웹헤즈 LMS (인건비 제외)</p>
                </div>
              </div>
              <div className="h-[200px] md:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <Tooltip formatter={(v: number) => `${fmt(v)}원`} contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} />
                    <Bar dataKey="self" name="자체 구축" fill="#F87171" radius={[0, 6, 6, 0]} />
                    <Bar dataKey="wh" name="웹헤즈 LMS" fill={PURPLE} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 5-Year Projection Chart (includes initial dev cost) */}
            <div className="mt-5 md:mt-8 rounded-[20px] border border-gray-100 bg-white p-5 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                  <TrendingUp className="w-5 h-5" style={{ color: GREEN_ACCENT }} />
                </div>
                <div>
                  <h4 className="font-bold text-base" style={{ color: TEXT_DARK }}>5년 누적 비용 비교</h4>
                  <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>자체 구축은 초기 개발비 + 누적 운영비 (연 5% 상승 가정)</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 my-6">
                {[0, 2, 4].map((idx) => {
                  const d = projectionData[idx];
                  return (
                    <div key={idx} className="rounded-xl p-3 md:p-4 text-center" style={{ background: idx === 4 ? GREEN_BG : "#F3F4F6" }}>
                      <p className="text-[11px] md:text-xs font-medium" style={{ color: "#6B7280" }}>{d.name}</p>
                      <p className="font-bold text-sm md:text-lg mt-1" style={{ color: idx === 4 ? GREEN_TEXT : TEXT_DARK }}>
                        {fmt(d.savings)}
                        <span className="text-[10px] md:text-xs font-normal">원</span>
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="h-[280px] md:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="selfGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F87171" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="whGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={PURPLE} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                    <YAxis tickFormatter={(v) => `${(v / 100000000).toFixed(1)}억`} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <Tooltip formatter={chartTooltipFormatter} contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="selfBuild" name="자체 구축 (초기투자+운영)" stroke="#F87171" fill="url(#selfGrad)" strokeWidth={2} dot={{ r: 4, fill: "#F87171" }} />
                    <Area type="monotone" dataKey="webheads" name="웹헤즈 LMS" stroke={PURPLE} fill="url(#whGrad)" strokeWidth={2} dot={{ r: 4, fill: PURPLE }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Add-on Savings */}
        <div className="mt-5 md:mt-8 rounded-[20px] border border-gray-100 bg-white p-5 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-sm md:text-base" style={{ color: TEXT_DARK }}>{t("lms.roiCalc.addonsTitle")}</h4>
          </div>
          <p className="flex items-center gap-1.5 text-xs mb-5" style={{ color: "#9CA3AF" }}>
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>{t("lms.roiCalc.addonsSource")}</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {addonItems.map((item) => (
              <div key={item.label} className="rounded-xl p-5 flex flex-col gap-3" style={{ background: "#F9FAFB" }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.color}15` }}>
                    <item.icon className="w-4.5 h-4.5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs leading-relaxed mb-1" style={{ color: "#6B7280", wordBreak: "keep-all" }}>{item.label}</p>
                    <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed pl-0.5 border-t pt-2.5" style={{ color: "#9CA3AF", borderColor: "#E5E7EB", wordBreak: "keep-all" }}>
                  * {item.basis}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}