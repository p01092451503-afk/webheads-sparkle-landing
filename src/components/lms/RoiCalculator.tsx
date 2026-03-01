import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calculator, TrendingUp, ArrowRight, Bot, Shield, MessageSquare, Info, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Self-build cost model (annual, in KRW):
 * - Server/infra: base 6M + scale factor
 * - Developer: base 24M + scale factor  
 * - Maintenance/security: base 4.8M + scale factor
 * - Licenses/SSL/misc: base 3.6M + scale factor
 * Total scales with student count to reflect realistic TCO.
 */
function calcSelfBuildAnnual(students: number) {
  // Scale multiplier: 1.0x at 200, up to ~2.5x at 5000
  const scale = 1 + Math.max(0, students - 200) / 2400;

  const server = Math.round(6000000 * scale);
  const developer = Math.round(24000000 * scale);
  const maintenance = Math.round(4800000 * scale);
  const license = Math.round(3600000 * scale);
  const total = server + developer + maintenance + license;

  return { server, developer, maintenance, license, total };
}

export default function RoiCalculator() {
  const { t } = useTranslation();
  const [students, setStudents] = useState(500);
  const [fee, setFee] = useState(100000);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const monthlyRevenue = students * fee;
  const selfBuild = calcSelfBuildAnnual(students);
  const selfBuildMonthly = Math.round(selfBuild.total / 12);
  const webheadsMonthlyCost = students <= 200 ? 500000 : students <= 500 ? 700000 : students <= 1000 ? 1000000 : students <= 2000 ? 1500000 : students <= 3000 ? 2000000 : 2500000;
  const savingsMonthly = selfBuildMonthly - webheadsMonthlyCost;
  const savingsPercent = Math.round((savingsMonthly / selfBuildMonthly) * 100);
  const annualSavings = savingsMonthly * 12;

  const formatNumber = (n: number) => n.toLocaleString("ko-KR");

  const breakdownItems = [
    { label: t("lms.roiCalc.breakdownServer"), value: selfBuild.server },
    { label: t("lms.roiCalc.breakdownDev"), value: selfBuild.developer },
    { label: t("lms.roiCalc.breakdownMaint"), value: selfBuild.maintenance },
    { label: t("lms.roiCalc.breakdownLicense"), value: selfBuild.license },
  ];

  const addonItems = [
    { icon: Bot, label: t("lms.roiCalc.addonChatbot"), value: t("lms.roiCalc.chatbotSaving"), basis: t("lms.roiCalc.chatbotBasis"), color: "hsl(245, 58%, 55%)" },
    { icon: Shield, label: t("lms.roiCalc.addonDrm"), value: t("lms.roiCalc.drmSaving"), basis: t("lms.roiCalc.drmBasis"), color: "hsl(340, 65%, 50%)" },
    { icon: MessageSquare, label: t("lms.roiCalc.addonSms"), value: t("lms.roiCalc.smsSaving"), basis: t("lms.roiCalc.smsBasis"), color: "hsl(170, 55%, 38%)" },
  ];

  return (
    <section className="py-16 md:py-28">
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        <div className="mb-8 md:mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: "hsl(var(--lms-primary))" }}>
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
                <Calculator className="w-5 h-5" style={{ color: "hsl(var(--lms-primary))" }} />
              </div>
              <h3 className="font-bold text-foreground text-lg">{t("lms.roiCalc.inputTitle")}</h3>
            </div>

            {/* Students slider */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <label className="text-sm font-semibold text-foreground">{t("lms.roiCalc.studentsLabel")}</label>
                <span className="text-lg font-bold" style={{ color: "hsl(var(--lms-primary))" }}>{formatNumber(students)}{t("lms.roiCalc.studentsUnit")}</span>
              </div>
              <input
                type="range" min={50} max={5000} step={50} value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, hsl(var(--lms-primary)) ${((students - 50) / 4950) * 100}%, hsl(var(--border)) ${((students - 50) / 4950) * 100}%)` }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5"><span>50</span><span>5,000</span></div>
            </div>

            {/* Fee slider */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="text-sm font-semibold text-foreground">{t("lms.roiCalc.feeLabel")}</label>
                <span className="text-lg font-bold" style={{ color: "hsl(var(--lms-primary))" }}>{formatNumber(fee)}{t("lms.roiCalc.feeUnit")}</span>
              </div>
              <input
                type="range" min={10000} max={500000} step={10000} value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, hsl(var(--lms-primary)) ${((fee - 10000) / 490000) * 100}%, hsl(var(--border)) ${((fee - 10000) / 490000) * 100}%)` }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5"><span>10,000</span><span>500,000</span></div>
            </div>
          </div>

          {/* Result */}
          <div className="rounded-2xl border border-border bg-background p-5 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(145, 70%, 93%)" }}>
                <TrendingUp className="w-5 h-5" style={{ color: "hsl(145, 60%, 38%)" }} />
              </div>
              <h3 className="font-bold text-foreground text-lg">{t("lms.roiCalc.resultTitle")}</h3>
            </div>

            <div className="space-y-5 flex-1">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">{t("lms.roiCalc.monthlyRevenue")}</span>
                <span className="font-bold text-foreground text-lg">{formatNumber(monthlyRevenue)}{t("lms.roiCalc.feeUnit")}</span>
              </div>

              {/* Self-build cost with expandable breakdown */}
              <div className="border-b border-border pb-3">
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full flex justify-between items-center py-3 group cursor-pointer"
                >
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    {t("lms.roiCalc.selfBuildCost")}
                    {showBreakdown
                      ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/60" />
                      : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60" />
                    }
                  </span>
                  <span className="font-bold text-muted-foreground text-lg">{formatNumber(selfBuildMonthly)}{t("lms.roiCalc.feeUnit")}</span>
                </button>

                {showBreakdown && (
                  <div className="mt-1 rounded-xl p-4 space-y-2.5" style={{ background: "hsl(var(--muted) / 0.5)" }}>
                    <p className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase mb-2">
                      {t("lms.roiCalc.breakdownTitle")}
                    </p>
                    {breakdownItems.map((item) => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className="text-xs font-semibold text-foreground">{formatNumber(Math.round(item.value / 12))}{t("lms.roiCalc.feeUnit")}/월</span>
                      </div>
                    ))}
                    <div className="border-t border-border/60 pt-2 mt-2">
                      <p className="text-[10px] text-muted-foreground/70 leading-relaxed flex items-start gap-1">
                        <Info className="w-3 h-3 shrink-0 mt-0.5" />
                        <span style={{ wordBreak: "keep-all" }}>{t("lms.roiCalc.breakdownNote")}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">{t("lms.roiCalc.webheadsCost")}</span>
                <span className="font-bold text-lg" style={{ color: "hsl(var(--lms-primary))" }}>{formatNumber(webheadsMonthlyCost)}{t("lms.roiCalc.feeUnit")}</span>
              </div>
              <div className="rounded-xl p-4 md:p-5" style={{ background: "hsl(145, 70%, 93%)" }}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                  <span className="text-xs md:text-sm font-semibold" style={{ color: "hsl(145, 60%, 28%)" }}>{t("lms.roiCalc.annualSavings")}</span>
                  <span className="font-bold text-xl md:text-2xl" style={{ color: "hsl(145, 60%, 28%)" }}>{formatNumber(annualSavings)}{t("lms.roiCalc.feeUnit")}</span>
                </div>
                <p className="text-[11px] md:text-xs mt-1" style={{ color: "hsl(145, 60%, 38%)" }}>
                  {t("lms.roiCalc.savingsNote", { percent: savingsPercent > 0 ? savingsPercent : 0 })}
                </p>
              </div>
            </div>

            <a
              href="#contact"
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 w-full"
              style={{ background: "hsl(var(--lms-primary))" }}
            >
              {t("lms.roiCalc.cta")}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

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
