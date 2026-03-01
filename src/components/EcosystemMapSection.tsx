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

        {/* Desktop: LMS hub top + 8 services below */}
        <div className="hidden md:flex flex-col items-center gap-6">
          {/* LMS Hub */}
          <div
            className="flex flex-col items-center justify-center rounded-full shadow-lg"
            style={{
              width: 120,
              height: 120,
              background: "linear-gradient(135deg, hsl(245, 65%, 50%), hsl(245, 75%, 36%))",
              boxShadow: "0 0 28px 4px hsl(245, 65%, 55% / 0.2)",
            }}
          >
            <GraduationCap className="w-11 h-11 text-white mb-1" strokeWidth={2} />
            <span className="text-xs font-extrabold text-white tracking-wider">LMS</span>
          </div>

          {/* Connection lines visual */}
          <svg width="100%" height="32" viewBox="0 0 800 32" className="max-w-4xl" style={{ overflow: "visible" }}>
            {/* Vertical line from center */}
            <line x1="400" y1="0" x2="400" y2="16" stroke="hsl(var(--border))" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
            {/* Horizontal line */}
            <line x1="50" y1="16" x2="750" y2="16" stroke="hsl(var(--border))" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
            {/* Branch lines down to each service */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const x = 50 + (700 / 7) * i;
              return (
                <line
                  key={i}
                  x1={x} y1="16" x2={x} y2="32"
                  stroke={hoveredIdx === i ? serviceConfig[i].accent : "hsl(var(--border))"}
                  strokeWidth={hoveredIdx === i ? 2 : 1.5}
                  strokeDasharray="4 3"
                  opacity={hoveredIdx === i ? 0.7 : 0.4}
                  style={{ transition: "all 0.3s ease" }}
                />
              );
            })}
          </svg>

          {/* 8 service cards in a row */}
          <div className="grid grid-cols-8 gap-3 w-full max-w-4xl">
            {serviceConfig.map((svc, i) => {
              const data = services?.[i];
              if (!data) return null;
              const Icon = svc.icon;
              const isHovered = hoveredIdx === i;

              return (
                <div
                  key={svc.key}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className="rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center w-full py-5 px-2"
                    style={{
                      background: isHovered
                        ? svc.accent.replace(")", " / 0.08)")
                        : "hsl(var(--background) / 0.6)",
                      borderColor: isHovered
                        ? svc.accent.replace(")", " / 0.35)")
                        : "hsl(var(--border) / 0.4)",
                      boxShadow: isHovered
                        ? `0 6px 20px -4px ${svc.accent.replace(")", " / 0.15)")}`
                        : "0 1px 4px -1px hsl(0 0% 0% / 0.04)",
                      transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                    }}
                  >
                    <Icon
                      className="w-8 h-8 lg:w-9 lg:h-9 mb-2.5"
                      style={{ color: svc.accent }}
                      strokeWidth={1.8}
                    />
                    <span className="text-[11px] lg:text-xs font-bold text-foreground whitespace-nowrap leading-tight">
                      {data.name}
                    </span>
                  </div>

                  {/* Tooltip */}
                  {isHovered && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-52 rounded-2xl p-4 shadow-2xl border border-border/50 bg-background"
                      style={{
                        top: "calc(100% + 8px)",
                        zIndex: 100,
                        animation: "eco-tooltip-in 0.18s ease-out",
                      }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: svc.accent }}>
                        Problem
                      </p>
                      <p className="text-xs text-foreground leading-relaxed mb-2" style={{ wordBreak: "keep-all" }}>
                        {data.problem}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: svc.accent }}>
                        Solution
                      </p>
                      <p className="text-xs text-foreground leading-relaxed mb-2" style={{ wordBreak: "keep-all" }}>
                        {data.solution}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: svc.accent }}>
                        {t("lms.ecosystem.servicesTitle") || "자세히 보기"}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: 2-col grid */}
        <div className="md:hidden">
          <div className="flex justify-center mb-5">
            <div
              className="flex flex-col items-center justify-center rounded-full shadow-lg"
              style={{
                width: 80,
                height: 80,
                background: "linear-gradient(135deg, hsl(245, 65%, 50%), hsl(245, 75%, 36%))",
              }}
            >
              <GraduationCap className="w-8 h-8 text-white mb-0.5" strokeWidth={2} />
              <span className="text-[9px] font-extrabold text-white tracking-wider">LMS</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {serviceConfig.map((svc, i) => {
              const data = services?.[i];
              if (!data) return null;
              const Icon = svc.icon;
              return (
                <div
                  key={svc.key}
                  className="rounded-2xl p-4 bg-background border border-border/50 flex flex-col items-center gap-2 text-center"
                >
                  <Icon className="w-7 h-7" style={{ color: svc.accent }} strokeWidth={2} />
                  <h4 className="font-bold text-sm text-foreground leading-snug">{data.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed" style={{ wordBreak: "keep-all" }}>
                    {data.problem}
                  </p>
                </div>
              );
            })}
          </div>
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
