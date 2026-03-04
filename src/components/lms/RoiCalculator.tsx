import { useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Calculator, TrendingUp, ArrowRight, Bot, Shield, MessageSquare, Info, ChevronDown, ChevronUp, Download, BookOpen, Users, BarChart3, BarChart2, Sparkles } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

/* ── New cost model per spec ── */
function calcSelfBuildAnnual(students: number, courses: number, instructors: number) {
  const devCost = (students * 8000 + courses * 500000); // one-time, amortized 12mo
  const serverCost = students * 500 * 12;
  const maintCost = devCost * 0.2;
  const staffCost = instructors * 3500000 * 12;
  const subtotal = devCost + serverCost + maintCost + staffCost;
  const miscCost = Math.round(subtotal * 0.1);
  const total = subtotal + miscCost;
  return { devCost, serverCost, maintCost, staffCost, miscCost, total };
}

function calcWebheadsAnnual(students: number, courses: number) {
  const baseFee = 300000 * 12;
  const studentFee = students * 200 * 12;
  const courseFee = courses * 10000 * 12;
  return baseFee + studentFee + courseFee;
}

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#EDE9FE";
const PURPLE_BG = "#F8F7FF";
const TEXT_DARK = "#1E1B4B";
const LMS_PRIMARY = "hsl(var(--lms-primary))";
const GREEN_BG = "hsl(145, 70%, 93%)";
const GREEN_TEXT = "hsl(145, 60%, 28%)";
const GREEN_ACCENT = "hsl(145, 60%, 38%)";

export default function RoiCalculator() {
  const { t } = useTranslation();
  const [students, setStudents] = useState(500);
  const [fee, setFee] = useState(100000);
  const [courses, setCourses] = useState(10);
  const [instructors, setInstructors] = useState(5);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const monthlyRevenue = students * fee;
  const annualRevenue = monthlyRevenue * 12;
  const selfBuild = useMemo(() => calcSelfBuildAnnual(students, courses, instructors), [students, courses, instructors]);
  const selfBuildMonthly = Math.round(selfBuild.total / 12);
  const webheadsAnnual = useMemo(() => calcWebheadsAnnual(students, courses), [students, courses]);
  const webheadsMonthly = Math.round(webheadsAnnual / 12);
  const savingsAmount = selfBuild.total - webheadsAnnual;
  const savingsPercent = selfBuild.total > 0 ? ((savingsAmount / selfBuild.total) * 100).toFixed(1) : "0";
  const lmsCostRatio = annualRevenue > 0 ? Math.min(100, Math.round((webheadsAnnual / annualRevenue) * 100)) : 0;

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  // Chart data (kept for collapsible charts)
  const comparisonData = useMemo(() => [
    { name: t("lms.roiCalc.breakdownDev", "개발비"), self: Math.round(selfBuild.devCost / 12), wh: 0 },
    { name: t("lms.roiCalc.breakdownServer", "서버/인프라"), self: Math.round(selfBuild.serverCost / 12), wh: 0 },
    { name: t("lms.roiCalc.breakdownMaint", "유지보수"), self: Math.round(selfBuild.maintCost / 12), wh: 0 },
    { name: t("lms.roiCalc.breakdownStaff", "인건비"), self: Math.round(selfBuild.staffCost / 12), wh: 0 },
    { name: t("lms.roiCalc.breakdownMisc", "기타운영비"), self: Math.round(selfBuild.miscCost / 12), wh: 0 },
    { name: t("lms.roiCalc.webheadsCost", "웹헤즈 LMS"), self: 0, wh: webheadsMonthly },
  ], [selfBuild, webheadsMonthly, t]);

  const projectionData = useMemo(() => {
    const selfAnnual = selfBuild.total;
    const whAnnual = webheadsAnnual;
    return Array.from({ length: 5 }, (_, i) => {
      const year = i + 1;
      const selfCum = Array.from({ length: year }, (_, y) => Math.round(selfAnnual * Math.pow(1.05, y))).reduce((a, b) => a + b, 0);
      const whCum = whAnnual * year;
      return { name: t("lms.roiCalc.year", { n: year }), selfBuild: selfCum, webheads: whCum, savings: selfCum - whCum };
    });
  }, [selfBuild.total, webheadsAnnual, t]);

  const breakdownItems = [
    { label: t("lms.roiCalc.breakdownDev", "개발비"), value: selfBuild.devCost },
    { label: t("lms.roiCalc.breakdownServer", "서버/인프라"), value: selfBuild.serverCost },
    { label: t("lms.roiCalc.breakdownMaint", "유지보수"), value: selfBuild.maintCost },
    { label: t("lms.roiCalc.breakdownStaff", "인건비"), value: selfBuild.staffCost },
    { label: t("lms.roiCalc.breakdownMisc", "기타운영비"), value: selfBuild.miscCost },
  ];

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
      `  • ${t("lms.roiCalc.instructorsLabel")}: ${fmt(instructors)}${t("lms.roiCalc.instructorsUnit")}`,
      `  • ${t("lms.roiCalc.feeLabel")}: ${fmt(fee)}${t("lms.roiCalc.feeUnit")}`,
      ``,
      `■ ${t("lms.roiCalc.annualRevenue")}`,
      `  • ${fmt(annualRevenue)}${t("lms.roiCalc.feeUnit")}`,
      ``,
      `■ ${t("lms.roiCalc.annualComparison")}`,
      `  • ${t("lms.roiCalc.selfBuildAnnual")}: ${fmt(selfBuild.total)}${t("lms.roiCalc.feeUnit")}`,
      ...breakdownItems.map(i => `    - ${i.label}: ${fmt(i.value)}${t("lms.roiCalc.feeUnit")}`),
      `  • ${t("lms.roiCalc.webheadsAnnual")}: ${fmt(webheadsAnnual)}${t("lms.roiCalc.feeUnit")}`,
      ``,
      `■ ${t("lms.roiCalc.annualSavings")}`,
      `  • ${fmt(savingsAmount)}${t("lms.roiCalc.feeUnit")} (${savingsPercent}%)`,
      ``,
      `■ ${t("lms.roiCalc.pdfProjection")}`,
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
  }, [students, courses, instructors, fee, annualRevenue, selfBuild, webheadsAnnual, savingsAmount, savingsPercent, breakdownItems, projectionData, t]);

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
            <SliderInput label={t("lms.roiCalc.instructorsLabel")} unit={t("lms.roiCalc.instructorsUnit")} value={instructors} min={1} max={30} step={1} onChange={setInstructors} icon={Users} />
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

            {/* Cost comparison cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Self-build card */}
              <div className="rounded-[16px] p-5 md:p-6" style={{ background: "#F3F4F6" }}>
                <p className="text-xs font-medium mb-3" style={{ color: "#6B7280" }}>
                  {t("lms.roiCalc.selfBuildAnnual")} ({t("lms.roiCalc.annualLabel")})
                </p>
                <p className="font-bold text-xl md:text-2xl" style={{ color: "#4B5563" }}>
                  {fmt(selfBuild.total)}<span className="text-sm font-normal ml-0.5">{t("lms.roiCalc.feeUnit")}</span>
                </p>
                <p className="text-[11px] mt-1" style={{ color: "#9CA3AF" }}>
                  {t("lms.roiCalc.perMonth", { cost: fmt(selfBuildMonthly) })}
                </p>
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="mt-3 text-[11px] md:text-xs flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ color: "#9CA3AF" }}
                >
                  {t("lms.roiCalc.breakdownTitle", "산출 근거 보기")}
                  {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showBreakdown && (
                  <div className="mt-3 pt-3 space-y-2 border-t" style={{ borderColor: "#E5E7EB" }}>
                    {breakdownItems.map((item) => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-[11px]" style={{ color: "#6B7280" }}>{item.label}</span>
                        <span className="text-[11px] font-semibold" style={{ color: "#4B5563" }}>{fmt(item.value)}{t("lms.roiCalc.feeUnit")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Webheads card */}
              <div className="rounded-[16px] p-5 md:p-6 bg-white shadow-md relative" style={{ border: `2px solid ${PURPLE}` }}>
                <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: PURPLE }}>
                  {t("lms.roiCalc.recommended", "추천")}
                </div>
                <p className="text-xs font-medium mb-3" style={{ color: PURPLE }}>
                  {t("lms.roiCalc.webheadsAnnual")} ({t("lms.roiCalc.annualLabel")})
                </p>
                <p className="font-bold text-xl md:text-2xl" style={{ color: PURPLE }}>
                  {fmt(webheadsAnnual)}<span className="text-sm font-normal ml-0.5">{t("lms.roiCalc.feeUnit")}</span>
                </p>
                <p className="text-[11px] mt-1" style={{ color: PURPLE, opacity: 0.6 }}>
                  {t("lms.roiCalc.perMonth", { cost: fmt(webheadsMonthly) })}
                </p>
              </div>
            </div>

            {/* Savings banner */}
            <div
              className="rounded-[16px] p-6 md:p-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
              style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
            >
              <div className="text-center sm:text-right">
                <p className="text-white/70 text-xs mb-1">{t("lms.roiCalc.annualSavings")}</p>
                <p className="text-white font-extrabold text-5xl md:text-6xl leading-none">{savingsPercent}%</p>
              </div>
              <div className="hidden sm:block w-px h-16 bg-white/20" />
              <div className="text-center sm:text-left">
                <p className="text-white font-bold text-2xl md:text-3xl">{fmt(savingsAmount)}<span className="text-base font-normal ml-0.5">{t("lms.roiCalc.feeUnit")}</span></p>
                <p className="text-white/60 text-[11px] md:text-xs mt-1">
                  {t("lms.roiCalc.savingsNote", { percent: savingsPercent })}
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
                {t("lms.roiCalc.costRatio", `매출 대비 LMS 비용 비율: ${lmsCostRatio}%`)}
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

        {/* ── Collapsible Charts Section (preserved) ── */}
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
                  <h4 className="font-bold text-base" style={{ color: TEXT_DARK }}>{t("lms.roiCalc.pdfCostComparison")}</h4>
                  <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{t("lms.roiCalc.selfBuildCost")} vs {t("lms.roiCalc.webheadsCost")}</p>
                </div>
              </div>
              <div className="h-[260px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <Tooltip formatter={(v: number) => `${fmt(v)}원`} contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} />
                    <Bar dataKey="self" name={t("lms.roiCalc.selfBuildCost")} fill="#F87171" radius={[0, 6, 6, 0]} />
                    <Bar dataKey="wh" name={t("lms.roiCalc.webheadsCost")} fill={PURPLE} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 5-Year Projection Chart */}
            <div className="mt-5 md:mt-8 rounded-[20px] border border-gray-100 bg-white p-5 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                  <TrendingUp className="w-5 h-5" style={{ color: GREEN_ACCENT }} />
                </div>
                <div>
                  <h4 className="font-bold text-base" style={{ color: TEXT_DARK }}>{t("lms.roiCalc.scenarioTitle")}</h4>
                  <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{t("lms.roiCalc.scenarioDesc")}</p>
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
                        <span className="text-[10px] md:text-xs font-normal">{t("lms.roiCalc.feeUnit")}</span>
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
                    <Area type="monotone" dataKey="selfBuild" name={t("lms.roiCalc.chartSelfBuild")} stroke="#F87171" fill="url(#selfGrad)" strokeWidth={2} dot={{ r: 4, fill: "#F87171" }} />
                    <Area type="monotone" dataKey="webheads" name={t("lms.roiCalc.chartWebheads")} stroke={PURPLE} fill="url(#whGrad)" strokeWidth={2} dot={{ r: 4, fill: PURPLE }} />
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
