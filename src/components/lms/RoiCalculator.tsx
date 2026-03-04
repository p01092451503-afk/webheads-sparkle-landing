import { useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Calculator, TrendingUp, ArrowRight, Bot, Shield, MessageSquare, Info, ChevronDown, ChevronUp, Download, BookOpen, Users, BarChart3, BarChart2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from "recharts";

/**
 * Self-build cost model (annual, in KRW):
 * Scales with student count, courses, and instructors for more accurate TCO.
 */
function calcSelfBuildAnnual(students: number, courses: number, instructors: number) {
  const scale = 1 + Math.max(0, students - 200) / 2400;
  const courseScale = 1 + Math.max(0, courses - 5) / 30;
  const staffScale = 1 + Math.max(0, instructors - 3) / 15;

  const server = Math.round(6000000 * scale * courseScale);
  const developer = Math.round(24000000 * scale);
  const maintenance = Math.round(4800000 * scale * courseScale);
  const license = Math.round(3600000 * scale);
  const staffCost = Math.round(2400000 * staffScale * (instructors > 5 ? 1.3 : 1));
  const total = server + developer + maintenance + license + staffCost;

  return { server, developer, maintenance, license, staffCost, total };
}

function getWebheadsMonthlyCost(students: number): number {
  if (students <= 200) return 500000;
  if (students <= 500) return 700000;
  if (students <= 1000) return 1000000;
  if (students <= 2000) return 1500000;
  if (students <= 3000) return 2000000;
  return 2500000;
}

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
  const selfBuild = useMemo(() => calcSelfBuildAnnual(students, courses, instructors), [students, courses, instructors]);
  const selfBuildMonthly = Math.round(selfBuild.total / 12);
  const webheadsMonthlyCost = getWebheadsMonthlyCost(students);
  const savingsMonthly = selfBuildMonthly - webheadsMonthlyCost;
  const savingsPercent = selfBuildMonthly > 0 ? Math.round((savingsMonthly / selfBuildMonthly) * 100) : 0;
  const annualSavings = savingsMonthly * 12;

  const formatNumber = (n: number) => n.toLocaleString("ko-KR");

  // 5-year projection data
  const projectionData = useMemo(() => {
    const selfAnnual = selfBuild.total;
    const whAnnual = webheadsMonthlyCost * 12;
    return Array.from({ length: 5 }, (_, i) => {
      const year = i + 1;
      // Self-build has ~5% annual increase (inflation, scaling)
      const selfCum = Array.from({ length: year }, (_, y) => Math.round(selfAnnual * Math.pow(1.05, y))).reduce((a, b) => a + b, 0);
      // Webheads stays relatively stable
      const whCum = whAnnual * year;
      return {
        name: t("lms.roiCalc.year", { n: year }),
        selfBuild: selfCum,
        webheads: whCum,
        savings: selfCum - whCum,
      };
    });
  }, [selfBuild.total, webheadsMonthlyCost, t]);

  // Bar chart data for cost comparison
  const comparisonData = useMemo(() => [
    { name: t("lms.roiCalc.breakdownServer"), self: Math.round(selfBuild.server / 12), wh: 0 },
    { name: t("lms.roiCalc.breakdownDev"), self: Math.round(selfBuild.developer / 12), wh: 0 },
    { name: t("lms.roiCalc.breakdownMaint"), self: Math.round(selfBuild.maintenance / 12), wh: 0 },
    { name: t("lms.roiCalc.breakdownLicense"), self: Math.round(selfBuild.license / 12), wh: 0 },
    { name: t("lms.roiCalc.breakdownStaff"), self: Math.round(selfBuild.staffCost / 12), wh: 0 },
    { name: t("lms.roiCalc.webheadsCost"), self: 0, wh: webheadsMonthlyCost },
  ], [selfBuild, webheadsMonthlyCost, t]);

  const breakdownItems = [
    { label: t("lms.roiCalc.breakdownServer"), value: selfBuild.server },
    { label: t("lms.roiCalc.breakdownDev"), value: selfBuild.developer },
    { label: t("lms.roiCalc.breakdownMaint"), value: selfBuild.maintenance },
    { label: t("lms.roiCalc.breakdownLicense"), value: selfBuild.license },
    { label: t("lms.roiCalc.breakdownStaff"), value: selfBuild.staffCost },
  ];

  const addonItems = [
    { icon: Bot, label: t("lms.roiCalc.addonChatbot"), value: t("lms.roiCalc.chatbotSaving"), basis: t("lms.roiCalc.chatbotBasis"), color: "hsl(245, 58%, 55%)" },
    { icon: Shield, label: t("lms.roiCalc.addonDrm"), value: t("lms.roiCalc.drmSaving"), basis: t("lms.roiCalc.drmBasis"), color: "hsl(340, 65%, 50%)" },
    { icon: MessageSquare, label: t("lms.roiCalc.addonSms"), value: t("lms.roiCalc.smsSaving"), basis: t("lms.roiCalc.smsBasis"), color: "hsl(170, 55%, 38%)" },
  ];

  // PDF export
  const handlePdfExport = useCallback(() => {
    const now = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
    const lines = [
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `  ${t("lms.roiCalc.pdfTitle")}`,
      `  ${t("lms.roiCalc.pdfGenerated")}: ${now}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `■ ${t("lms.roiCalc.pdfConditions")}`,
      `  • ${t("lms.roiCalc.studentsLabel")}: ${formatNumber(students)}${t("lms.roiCalc.studentsUnit")}`,
      `  • ${t("lms.roiCalc.coursesLabel")}: ${formatNumber(courses)}${t("lms.roiCalc.coursesUnit")}`,
      `  • ${t("lms.roiCalc.instructorsLabel")}: ${formatNumber(instructors)}${t("lms.roiCalc.instructorsUnit")}`,
      `  • ${t("lms.roiCalc.feeLabel")}: ${formatNumber(fee)}${t("lms.roiCalc.feeUnit")}`,
      ``,
      `■ ${t("lms.roiCalc.annualRevenue")}`,
      `  • ${t("lms.roiCalc.annualRevenue")}: ${formatNumber(monthlyRevenue * 12)}${t("lms.roiCalc.feeUnit")} (${t("lms.roiCalc.perMonth", { cost: formatNumber(monthlyRevenue) })})`,
      ``,
      `■ ${t("lms.roiCalc.annualComparison")}`,
      `  • ${t("lms.roiCalc.selfBuildAnnual")}: ${formatNumber(selfBuild.total)}${t("lms.roiCalc.feeUnit")} (${t("lms.roiCalc.perMonth", { cost: formatNumber(selfBuildMonthly) })})`,
      ``,
      `    [${t("lms.roiCalc.breakdownTitle")}]`,
      ...breakdownItems.map(i => `    - ${i.label}: ${formatNumber(Math.round(i.value / 12))}${t("lms.roiCalc.feeUnit")}`),
      ``,
      `  • ${t("lms.roiCalc.webheadsAnnual")}: ${formatNumber(webheadsMonthlyCost * 12)}${t("lms.roiCalc.feeUnit")} (${t("lms.roiCalc.perMonth", { cost: formatNumber(webheadsMonthlyCost) })})`,
      ``,
      `■ ${t("lms.roiCalc.annualSavings")}`,
      `  • ${formatNumber(annualSavings)}${t("lms.roiCalc.feeUnit")}`,
      `  • ${t("lms.roiCalc.savingsNote", { percent: Math.max(0, savingsPercent) })}`,
      ``,
      `■ ${t("lms.roiCalc.pdfProjection")}`,
      ...projectionData.map(d => `  • ${d.name}: ${t("lms.roiCalc.cumulativeSavings")} ${formatNumber(d.savings)}${t("lms.roiCalc.feeUnit")}`),
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
  }, [students, courses, instructors, fee, monthlyRevenue, selfBuildMonthly, webheadsMonthlyCost, annualSavings, savingsPercent, breakdownItems, projectionData, t]);

  const SliderInput = ({ label, unit, value, min, max, step, onChange, icon: Icon }: {
    label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; icon: any;
  }) => (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-end mb-2.5">
        <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          {label}
        </label>
        <span className="text-lg font-bold" style={{ color: LMS_PRIMARY }}>{formatNumber(value)}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${LMS_PRIMARY} ${((value - min) / (max - min)) * 100}%, hsl(var(--border)) ${((value - min) / (max - min)) * 100}%)` }}
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>{formatNumber(min)}</span><span>{formatNumber(max)}</span></div>
    </div>
  );

  const chartTooltipFormatter = (value: number) => `${formatNumber(value)}원`;

  return (
    <section className="py-16 md:py-28" ref={reportRef} id="roi-calculator">
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        <div className="mb-8 md:mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: LMS_PRIMARY }}>
            {t("lms.roiCalc.sub")}
          </p>
          <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line">
            {t("lms.roiCalc.title")}
          </h2>
          <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base">{t("lms.roiCalc.desc")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
          {/* Input */}
          <div className="rounded-2xl border border-border bg-background p-5 md:p-8 self-start">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(245, 60%, 95%)" }}>
                <Calculator className="w-5 h-5" style={{ color: LMS_PRIMARY }} />
              </div>
              <h3 className="font-bold text-foreground text-lg">{t("lms.roiCalc.inputTitle")}</h3>
            </div>

            <SliderInput label={t("lms.roiCalc.studentsLabel")} unit={t("lms.roiCalc.studentsUnit")} value={students} min={50} max={5000} step={50} onChange={setStudents} icon={Users} />
            <SliderInput label={t("lms.roiCalc.feeLabel")} unit={t("lms.roiCalc.feeUnit")} value={fee} min={10000} max={500000} step={10000} onChange={setFee} icon={TrendingUp} />
            <SliderInput label={t("lms.roiCalc.coursesLabel")} unit={t("lms.roiCalc.coursesUnit")} value={courses} min={1} max={100} step={1} onChange={setCourses} icon={BookOpen} />
            <SliderInput label={t("lms.roiCalc.instructorsLabel")} unit={t("lms.roiCalc.instructorsUnit")} value={instructors} min={1} max={30} step={1} onChange={setInstructors} icon={Users} />
          </div>

          {/* Result */}
          <div className="rounded-2xl border border-border bg-background p-5 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--lms-primary) / 0.08)" }}>
                <TrendingUp className="w-5 h-5" style={{ color: LMS_PRIMARY }} />
              </div>
              <h3 className="font-bold text-foreground text-lg">{t("lms.roiCalc.resultTitle")}</h3>
            </div>

            <div className="space-y-3 flex-1">
              {/* 1. 예상 연 매출 */}
              <div className="rounded-xl p-4 md:p-5 bg-secondary/70 border border-border/50">
                <h4 className="font-bold text-foreground text-sm md:text-base mb-3"><span className="text-muted-foreground mr-1.5">A.</span>{t("lms.roiCalc.annualRevenue")}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm text-muted-foreground">{t("lms.roiCalc.annualRevenue")}</span>
                  <div className="text-right">
                    <span className="font-bold text-foreground text-lg md:text-xl">{formatNumber(monthlyRevenue * 12)}{t("lms.roiCalc.feeUnit")}</span>
                    <p className="text-[11px] text-muted-foreground/60">{t("lms.roiCalc.perMonth", { cost: formatNumber(monthlyRevenue) })}</p>
                  </div>
                </div>
              </div>

              {/* 2. 연간 비용 비교 */}
              <div className="rounded-xl p-4 md:p-5 bg-secondary/70 border border-border/50">
                <h4 className="font-bold text-foreground text-sm md:text-base mb-3"><span className="text-muted-foreground mr-1.5">B.</span>{t("lms.roiCalc.annualComparison")}</h4>
                <div className="space-y-3">
                  <div>
                    <button
                      onClick={() => setShowBreakdown(!showBreakdown)}
                      className="w-full flex justify-between items-center group cursor-pointer"
                    >
                      <span className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5">
                        {t("lms.roiCalc.selfBuildAnnual")}
                        {showBreakdown ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/60" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60" />}
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-muted-foreground text-lg md:text-xl">{formatNumber(selfBuild.total)}{t("lms.roiCalc.feeUnit")}</span>
                        <p className="text-[11px] text-muted-foreground/60">{t("lms.roiCalc.perMonth", { cost: formatNumber(selfBuildMonthly) })}</p>
                      </div>
                    </button>
                    {showBreakdown && (
                      <div className="mt-3 rounded-lg p-3 space-y-2 bg-background/80 border border-border/40">
                        {breakdownItems.map((item) => (
                          <div key={item.label} className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                            <span className="text-xs font-semibold text-foreground">{formatNumber(Math.round(item.value / 12))}{t("lms.roiCalc.feeUnit")}/월</span>
                          </div>
                        ))}
                        <div className="border-t border-border/60 pt-2 mt-1">
                          <p className="text-[10px] text-muted-foreground/70 leading-relaxed flex items-start gap-1">
                            <Info className="w-3 h-3 shrink-0 mt-0.5" />
                            <span style={{ wordBreak: "keep-all" }}>{t("lms.roiCalc.breakdownNote")}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-border/40 pt-3 flex justify-between items-center">
                    <span className="text-xs md:text-sm text-muted-foreground">{t("lms.roiCalc.webheadsAnnual")}</span>
                    <div className="text-right">
                      <span className="font-bold text-lg md:text-xl" style={{ color: LMS_PRIMARY }}>{formatNumber(webheadsMonthlyCost * 12)}{t("lms.roiCalc.feeUnit")}</span>
                      <p className="text-[11px] text-muted-foreground/60">{t("lms.roiCalc.perMonth", { cost: formatNumber(webheadsMonthlyCost) })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. 연간 절감액 */}
              <div className="rounded-xl p-4 md:p-5 bg-secondary/70 border border-border/50">
                <h4 className="font-bold text-foreground text-sm md:text-base mb-3"><span className="text-muted-foreground mr-1.5">C.</span>{t("lms.roiCalc.annualSavings")}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {t("lms.roiCalc.savingsNote", { percent: savingsPercent > 0 ? savingsPercent : 0 })}
                  </span>
                  <span className="font-bold text-lg md:text-xl whitespace-nowrap text-foreground">{formatNumber(annualSavings)}{t("lms.roiCalc.feeUnit")}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <a
                href="#contact"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                style={{ background: LMS_PRIMARY }}
              >
                {t("lms.roiCalc.cta")}
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={handlePdfExport}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                title={t("lms.roiCalc.pdfExport")}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Charts Section */}
        <Collapsible open={showCharts} onOpenChange={setShowCharts}>
          <CollapsibleTrigger asChild>
            <button className="w-full mt-5 md:mt-8 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl border border-border bg-background font-semibold text-sm text-foreground hover:bg-secondary transition-all group cursor-pointer">
              <BarChart2 className="w-4.5 h-4.5 text-muted-foreground" />
              <span>{showCharts ? t("lms.roiCalc.hideCharts", "상세 비용 비교 & 장기 절감 시뮬레이션 닫기") : t("lms.roiCalc.showCharts", "상세 비용 비교 & 장기 절감 시뮬레이션 보기")}</span>
              {showCharts ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 overflow-hidden">
            {/* Cost Comparison Bar Chart */}
            <div className="mt-5 md:mt-8 rounded-2xl border border-border bg-background p-5 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(245, 60%, 95%)" }}>
                  <BarChart3 className="w-5 h-5" style={{ color: LMS_PRIMARY }} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">{t("lms.roiCalc.pdfCostComparison")}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("lms.roiCalc.selfBuildCost")} vs {t("lms.roiCalc.webheadsCost")}</p>
                </div>
              </div>
              <div className="h-[260px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip formatter={(v: number) => `${formatNumber(v)}원`} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                    <Bar dataKey="self" name={t("lms.roiCalc.selfBuildCost")} fill="hsl(0, 70%, 65%)" radius={[0, 6, 6, 0]} />
                    <Bar dataKey="wh" name={t("lms.roiCalc.webheadsCost")} fill="hsl(245, 58%, 55%)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 5-Year Projection Chart */}
            <div className="mt-5 md:mt-8 rounded-2xl border border-border bg-background p-5 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                  <TrendingUp className="w-5 h-5" style={{ color: GREEN_ACCENT }} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">{t("lms.roiCalc.scenarioTitle")}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("lms.roiCalc.scenarioDesc")}</p>
                </div>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3 my-6">
                {[0, 2, 4].map((idx) => {
                  const d = projectionData[idx];
                  return (
                    <div key={idx} className="rounded-xl p-3 md:p-4 text-center" style={{ background: idx === 4 ? GREEN_BG : "hsl(var(--muted) / 0.5)" }}>
                      <p className="text-[11px] md:text-xs text-muted-foreground font-medium">{d.name}</p>
                      <p className="font-bold text-sm md:text-lg mt-1" style={{ color: idx === 4 ? GREEN_TEXT : "hsl(var(--foreground))" }}>
                        {formatNumber(d.savings)}
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
                        <stop offset="5%" stopColor="hsl(0, 70%, 65%)" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(0, 70%, 65%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="whGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(245, 58%, 55%)" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(245, 58%, 55%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickFormatter={(v) => `${(v / 100000000).toFixed(1)}억`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip formatter={chartTooltipFormatter} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="selfBuild" name={t("lms.roiCalc.chartSelfBuild")} stroke="hsl(0, 70%, 65%)" fill="url(#selfGrad)" strokeWidth={2} dot={{ r: 4, fill: "hsl(0, 70%, 65%)" }} />
                    <Area type="monotone" dataKey="webheads" name={t("lms.roiCalc.chartWebheads")} stroke="hsl(245, 58%, 55%)" fill="url(#whGrad)" strokeWidth={2} dot={{ r: 4, fill: "hsl(245, 58%, 55%)" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Add-on Savings */}
        <div className="mt-5 md:mt-8 rounded-2xl border border-border bg-background p-5 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-foreground text-sm md:text-base">{t("lms.roiCalc.addonsTitle")}</h4>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>{t("lms.roiCalc.addonsSource")}</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {addonItems.map((item) => (
              <div key={item.label} className="rounded-xl p-5 bg-secondary flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.color}15` }}>
                    <item.icon className="w-4.5 h-4.5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-1" style={{ wordBreak: "keep-all" }}>{item.label}</p>
                    <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground/70 leading-relaxed pl-0.5 border-t border-border/50 pt-2.5" style={{ wordBreak: "keep-all" }}>
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
