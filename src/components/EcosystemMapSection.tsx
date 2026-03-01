import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
  Server, Video, ShieldCheck, Bot, Smartphone, CreditCard,
  MessageSquareMore, Wrench, GraduationCap, ArrowRight
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const serviceConfig: { key: string; accent: string; icon: LucideIcon }[] = [
  { key: "hosting",     accent: "hsl(215, 75%, 52%)",  icon: Server },
  { key: "content",     accent: "hsl(35, 85%, 50%)",   icon: Video },
  { key: "drm",         accent: "hsl(0, 65%, 52%)",    icon: ShieldCheck },
  { key: "chatbot",     accent: "hsl(260, 65%, 55%)",  icon: Bot },
  { key: "app",         accent: "hsl(170, 60%, 40%)",  icon: Smartphone },
  { key: "pg",          accent: "hsl(245, 60%, 55%)",  icon: CreditCard },
  { key: "channel",     accent: "hsl(195, 80%, 42%)",  icon: MessageSquareMore },
  { key: "maintenance", accent: "hsl(150, 55%, 40%)",  icon: Wrench },
];

export default function EcosystemMapSection() {
  const { t } = useTranslation();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleMouseEnter = useCallback((i: number) => setHoveredIdx(i), []);
  const handleMouseLeave = useCallback(() => setHoveredIdx(null), []);

  const services = t("lms.ecosystem.services", { returnObjects: true }) as {
    name: string; emoji: string; problem: string; solution: string;
  }[];

  // Split into two rows: top 4, bottom 4
  const topRow = serviceConfig.slice(0, 4);
  const bottomRow = serviceConfig.slice(4, 8);

  return (
    <section className="py-20" style={{ background: "var(--lms-section-alt)" }}>
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-10">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: "hsl(var(--lms-primary))" }}
          >
            ECOSYSTEM
          </p>
          <h2
            className="font-bold leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line text-foreground"
            style={{ wordBreak: "keep-all" }}
          >
            {t("lms.ecosystem.title")}
          </h2>
          <p className="mt-4 text-base text-muted-foreground" style={{ wordBreak: "keep-all" }}>
            {t("lms.ecosystem.desc")}
          </p>
        </div>

        {/* Desktop: Hub-spoke compact grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-0 gap-y-5">

            {/* Top row: 4 services spanning full width */}
            <div className="col-span-3 grid grid-cols-4 gap-3 mb-2">
              {topRow.map((svc, idx) => {
                const i = idx;
                const data = services?.[i];
                if (!data) return null;
                const Icon = svc.icon;
                const isHovered = hoveredIdx === i;
                return (
                  <ServiceCard
                    key={svc.key}
                    icon={Icon}
                    accent={svc.accent}
                    name={data.name}
                    problem={data.problem}
                    solution={data.solution}
                    isHovered={isHovered}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                    t={t}
                  />
                );
              })}
            </div>

            {/* Middle row: left 2 | LMS hub | right 2 (not used, we use single center row) */}

            {/* Center hub row */}
            <div className="col-span-3 flex items-center justify-center gap-3 my-2">
              {/* Left 2 services */}
              <div className="flex gap-3 flex-1 justify-end">
                {[6, 7].map((i) => {
                  const svc = serviceConfig[i];
                  const data = services?.[i];
                  if (!data) return null;
                  const Icon = svc.icon;
                  const isHovered = hoveredIdx === i;
                  return (
                    <ServiceCard
                      key={svc.key}
                      icon={Icon}
                      accent={svc.accent}
                      name={data.name}
                      problem={data.problem}
                      solution={data.solution}
                      isHovered={isHovered}
                      onMouseEnter={() => handleMouseEnter(i)}
                      onMouseLeave={handleMouseLeave}
                      compact
                      t={t}
                    />
                  );
                })}
              </div>

              {/* Center LMS Hub */}
              <div
                className="shrink-0 flex flex-col items-center justify-center rounded-full shadow-lg"
                style={{
                  width: 100,
                  height: 100,
                  background: "linear-gradient(135deg, hsl(245, 65%, 50%), hsl(245, 75%, 36%))",
                  boxShadow: "0 0 24px 4px hsl(245, 65%, 55% / 0.2)",
                }}
              >
                <GraduationCap className="w-8 h-8 text-white mb-0.5" strokeWidth={2} />
                <span className="text-[10px] font-extrabold text-white tracking-wider">LMS</span>
              </div>

              {/* Right 2 services */}
              <div className="flex gap-3 flex-1 justify-start">
                {[4, 5].map((i) => {
                  const svc = serviceConfig[i];
                  const data = services?.[i];
                  if (!data) return null;
                  const Icon = svc.icon;
                  const isHovered = hoveredIdx === i;
                  return (
                    <ServiceCard
                      key={svc.key}
                      icon={Icon}
                      accent={svc.accent}
                      name={data.name}
                      problem={data.problem}
                      solution={data.solution}
                      isHovered={isHovered}
                      onMouseEnter={() => handleMouseEnter(i)}
                      onMouseLeave={handleMouseLeave}
                      compact
                      t={t}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {serviceConfig.map((svc, i) => {
            const data = services?.[i];
            if (!data) return null;
            const Icon = svc.icon;
            return (
              <div
                key={svc.key}
                className="rounded-2xl p-4 bg-background border border-border/50 flex flex-col gap-2.5"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: svc.accent.replace(")", " / 0.1)"),
                    border: `1.5px solid ${svc.accent.replace(")", " / 0.25)")}`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: svc.accent }} strokeWidth={2} />
                </div>
                <h4 className="font-bold text-sm text-foreground leading-snug">{data.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed" style={{ wordBreak: "keep-all" }}>
                  {data.problem}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
            style={{ background: "hsl(var(--lms-primary))" }}
          >
            {t("lms.ecosystem.cta")}
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-xs text-muted-foreground mt-3">{t("lms.ecosystem.ctaSub")}</p>
        </div>
      </div>

      <style>{`
        @keyframes eco-tooltip-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

/* ── Service Card Component ── */
function ServiceCard({
  icon: Icon,
  accent,
  name,
  problem,
  solution,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  compact,
  t,
}: {
  icon: LucideIcon;
  accent: string;
  name: string;
  problem: string;
  solution: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  compact?: boolean;
  t: (key: string) => string;
}) {
  return (
    <div
      className="relative group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center ${
          compact ? "p-4 w-[140px]" : "p-5"
        }`}
        style={{
          background: isHovered
            ? accent.replace(")", " / 0.08)")
            : "hsl(var(--background) / 0.6)",
          borderColor: isHovered
            ? accent.replace(")", " / 0.35)")
            : "hsl(var(--border) / 0.4)",
          boxShadow: isHovered
            ? `0 6px 20px -4px ${accent.replace(")", " / 0.15)")}`
            : "0 1px 4px -1px hsl(0 0% 0% / 0.04)",
          transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-2"
          style={{
            background: accent.replace(")", " / 0.1)"),
            border: `1.5px solid ${accent.replace(")", " / 0.2)")}`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} strokeWidth={2} />
        </div>
        <span className="text-xs font-bold text-foreground whitespace-nowrap">{name}</span>
      </div>

      {/* Tooltip */}
      {isHovered && (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-56 rounded-2xl p-4 shadow-2xl border border-border/50 bg-background"
          style={{
            bottom: "calc(100% + 8px)",
            zIndex: 100,
            animation: "eco-tooltip-in 0.18s ease-out",
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: accent }}>
            Problem
          </p>
          <p className="text-xs text-foreground leading-relaxed mb-2" style={{ wordBreak: "keep-all" }}>
            {problem}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: accent }}>
            Solution
          </p>
          <p className="text-xs text-foreground leading-relaxed mb-2" style={{ wordBreak: "keep-all" }}>
            {solution}
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: accent }}>
            {t("lms.ecosystem.servicesTitle") || "자세히 보기"}
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      )}
    </div>
  );
}
