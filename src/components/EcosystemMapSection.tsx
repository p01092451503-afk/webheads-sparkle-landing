import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
  Server, Video, ShieldCheck, Bot, Smartphone, CreditCard,
  MessageSquareMore, Wrench, GraduationCap, ArrowRight
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const serviceConfig: { key: string; path: string; accent: string; icon: LucideIcon }[] = [
  { key: "hosting", path: "/hosting", accent: "hsl(215, 65%, 55%)", icon: Server },
  { key: "content", path: "/content", accent: "hsl(35, 70%, 50%)", icon: Video },
  { key: "drm", path: "/drm", accent: "hsl(0, 55%, 52%)", icon: ShieldCheck },
  { key: "chatbot", path: "/chatbot", accent: "hsl(260, 55%, 55%)", icon: Bot },
  { key: "app", path: "/app-dev", accent: "hsl(170, 50%, 42%)", icon: Smartphone },
  { key: "pg", path: "/pg", accent: "hsl(245, 50%, 55%)", icon: CreditCard },
  { key: "channel", path: "/channel", accent: "hsl(195, 65%, 45%)", icon: MessageSquareMore },
  { key: "maintenance", path: "/maintenance", accent: "hsl(150, 45%, 42%)", icon: Wrench },
];

const NODE_RADIUS = 170;
const CENTER = { x: 250, y: 250 };
const nodePositions = serviceConfig.map((_, i) => {
  const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
  return {
    x: CENTER.x + NODE_RADIUS * Math.cos(angle),
    y: CENTER.y + NODE_RADIUS * Math.sin(angle),
  };
});

function shortenLine(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  startInset: number,
  endInset: number
) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: p1.x + ux * startInset,
    y1: p1.y + uy * startInset,
    x2: p2.x - ux * endInset,
    y2: p2.y - uy * endInset,
  };
}

const HUB_RADIUS = 50;
const NODE_HALF = 32;
const INSTALL_ORDER = [0, 4, 1, 5, 2, 6, 3, 7];

export default function EcosystemMapSection() {
  const { t } = useTranslation();
  
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState(-1);
  const [hasPlayed, setHasPlayed] = useState(false);

  const installedSet = new Set<number>();
  if (phase >= 1) {
    for (let p = 0; p < Math.min(phase, 8); p++) {
      installedSet.add(INSTALL_ORDER[p]);
    }
  }
  const allInstalled = phase >= 9;

  useEffect(() => {
    if (hasPlayed) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase(0);
          setHasPlayed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasPlayed]);

  useEffect(() => {
    if (phase < 0) return;
    if (phase === 0) {
      const t = setTimeout(() => setPhase(1), 400);
      return () => clearTimeout(t);
    }
    if (phase >= 1 && phase <= 8) {
      const t = setTimeout(() => setPhase((p) => p + 1), 220);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleMouseEnter = useCallback((i: number) => setHoveredIdx(i), []);
  const handleMouseLeave = useCallback(() => setHoveredIdx(null), []);

  const services = t("lms.ecosystem.services", { returnObjects: true }) as {
    name: string; emoji: string; problem: string; solution: string;
  }[];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-14">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: "hsl(var(--lms-primary))" }}
          >
            ECOSYSTEM
          </p>
          <h2
            className="font-bold leading-tight text-3xl lg:text-4xl tracking-tight whitespace-pre-line text-foreground"
            style={{ wordBreak: "keep-all" }}
          >
            {t("lms.ecosystem.title")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto" style={{ wordBreak: "keep-all" }}>
            {t("lms.ecosystem.desc")}
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden md:block" ref={containerRef}>
          <div className="relative mx-auto" style={{ width: 500, height: 500 }}>
            {/* SVG lines */}
            <svg
              viewBox="0 0 500 500"
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none" }}
            >
              {nodePositions.map((pos, i) => {
                const isInstalled = installedSet.has(i);
                const isHovered = hoveredIdx === i && isInstalled;
                if (!isInstalled) return null;
                const sl = shortenLine(CENTER, pos, HUB_RADIUS, NODE_HALF);

                return (
                  <line
                    key={i}
                    x1={sl.x1}
                    y1={sl.y1}
                    x2={sl.x2}
                    y2={sl.y2}
                    stroke={isHovered ? serviceConfig[i].accent : "hsl(var(--border))"}
                    strokeWidth={isHovered ? 1.5 : 1}
                    strokeDasharray={isHovered ? "none" : "4 3"}
                    opacity={isHovered ? 0.8 : 0.5}
                    strokeDashoffset={isInstalled ? 0 : 200}
                    style={{
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                );
              })}
            </svg>

            {/* Center hub */}
            <div
              className="absolute flex flex-col items-center justify-center"
              style={{
                width: 96,
                height: 96,
                left: CENTER.x - 48,
                top: CENTER.y - 48,
                zIndex: 20,
                opacity: phase >= 0 ? 1 : 0,
                transform: phase >= 0 ? "scale(1)" : "scale(0.85)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <div
                className="absolute inset-0 rounded-full flex flex-col items-center justify-center"
                style={{
                  background: "hsl(245, 55%, 48%)",
                  boxShadow: "0 2px 16px -4px hsl(245, 55%, 48% / 0.25)",
                }}
              >
                <GraduationCap className="w-8 h-8 text-white mb-0.5" strokeWidth={1.8} />
                <span className="text-[11px] font-bold text-white/90 tracking-wide">LMS</span>
              </div>
            </div>

            {/* Service nodes */}
            {serviceConfig.map((svc, i) => {
              const pos = nodePositions[i];
              const data = services?.[i];
              if (!data) return null;
              const Icon = svc.icon;
              const isInstalled = installedSet.has(i);
              const isHovered = hoveredIdx === i && isInstalled;

              return (
                <div
                  key={svc.key}
                  style={{
                    position: "absolute",
                    left: pos.x - 40,
                    top: pos.y - 40,
                    zIndex: isHovered ? 90 : 10,
                    opacity: isInstalled ? 1 : 0,
                    transform: isInstalled
                      ? isHovered ? "scale(1.1)" : "scale(1)"
                      : "scale(0.8)",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="relative flex flex-col items-center justify-center cursor-pointer w-20 h-20">
                    {/* Tinted circle background */}
                    <div
                      className="absolute inset-1 rounded-full"
                      style={{
                        background: `${svc.accent}10`,
                        border: `1px solid ${isHovered ? svc.accent + "40" : "transparent"}`,
                        transition: "border-color 0.25s ease",
                      }}
                    />
                    <Icon
                      className="w-6 h-6 mb-1 relative z-10"
                      style={{ color: svc.accent }}
                      strokeWidth={1.8}
                    />
                    <span
                      className="text-[10px] font-semibold leading-tight text-center relative z-10 text-foreground/80"
                    >
                      {data.name}
                    </span>
                  </div>

                  {/* Tooltip */}
                  {hoveredIdx === i && isInstalled && (() => {
                    const dx = pos.x - CENTER.x;
                    const dy = pos.y - CENTER.y;
                    const outward = { x: dx / Math.abs(dx || 1), y: dy / Math.abs(dy || 1) };
                    const tooltipStyle: React.CSSProperties = {
                      zIndex: 100,
                      animation: "eco-tooltip-in 0.15s ease-out",
                    };
                    if (Math.abs(dx) > Math.abs(dy) * 0.5) {
                      if (outward.x > 0) tooltipStyle.left = 88;
                      else tooltipStyle.right = 88;
                    } else {
                      tooltipStyle.left = -88;
                    }
                    if (Math.abs(dy) > Math.abs(dx) * 0.5) {
                      if (outward.y > 0) tooltipStyle.top = 84;
                      else tooltipStyle.bottom = 84;
                    } else {
                      tooltipStyle.top = -16;
                    }
                    return (
                      <div
                        className="absolute w-56 rounded-xl p-4 bg-background border border-border/60"
                        style={{
                          ...tooltipStyle,
                          boxShadow: "0 4px 24px -4px hsl(var(--foreground) / 0.08), 0 1px 4px -1px hsl(var(--foreground) / 0.04)",
                        }}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                          Problem
                        </p>
                        <p className="text-xs text-foreground leading-relaxed mb-2.5" style={{ wordBreak: "keep-all" }}>
                          {data.problem}
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                          Solution
                        </p>
                        <p className="text-xs text-foreground leading-relaxed mb-2.5" style={{ wordBreak: "keep-all" }}>
                          {data.solution}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: svc.accent }}>
                          {t("lms.ecosystem.servicesTitle") || "자세히 보기"}
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
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
                className="rounded-xl p-4 bg-background border border-border/40 flex flex-col gap-2.5"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: `${svc.accent}10` }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: svc.accent }} strokeWidth={1.8} />
                </div>
                <h4 className="font-semibold text-sm text-foreground leading-snug">{data.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed" style={{ wordBreak: "keep-all" }}>
                  {data.problem}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90"
            style={{ background: "hsl(var(--lms-primary))" }}
          >
            {t("lms.ecosystem.cta")}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <p className="text-xs text-muted-foreground mt-2.5">{t("lms.ecosystem.ctaSub")}</p>
        </div>
      </div>

      <style>{`
        @keyframes eco-tooltip-in {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
