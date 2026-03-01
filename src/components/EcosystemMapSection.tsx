import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
  Server, Video, ShieldCheck, Bot, Smartphone, CreditCard,
  MessageSquareMore, Wrench, GraduationCap, ArrowRight
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const serviceConfig: { key: string; accent: string; bg: string; icon: LucideIcon }[] = [
  { key: "hosting",     accent: "hsl(215, 75%, 52%)",  bg: "linear-gradient(135deg, hsl(215, 75%, 48%), hsl(215, 65%, 36%))", icon: Server },
  { key: "content",     accent: "hsl(35, 85%, 50%)",   bg: "linear-gradient(135deg, hsl(35, 85%, 52%), hsl(35, 75%, 40%))",   icon: Video },
  { key: "drm",         accent: "hsl(0, 65%, 52%)",    bg: "linear-gradient(135deg, hsl(0, 55%, 50%), hsl(0, 50%, 38%))",     icon: ShieldCheck },
  { key: "chatbot",     accent: "hsl(260, 65%, 55%)",  bg: "linear-gradient(135deg, hsl(260, 55%, 52%), hsl(260, 50%, 40%))", icon: Bot },
  { key: "app",         accent: "hsl(170, 60%, 40%)",  bg: "linear-gradient(135deg, hsl(170, 55%, 42%), hsl(170, 50%, 32%))", icon: Smartphone },
  { key: "pg",          accent: "hsl(245, 60%, 55%)",  bg: "linear-gradient(135deg, hsl(245, 55%, 52%), hsl(245, 50%, 40%))", icon: CreditCard },
  { key: "channel",     accent: "hsl(195, 80%, 42%)",  bg: "linear-gradient(135deg, hsl(195, 70%, 45%), hsl(195, 60%, 34%))", icon: MessageSquareMore },
  { key: "maintenance", accent: "hsl(150, 55%, 40%)",  bg: "linear-gradient(135deg, hsl(150, 50%, 42%), hsl(150, 45%, 32%))", icon: Wrench },
];

// 8 nodes on a circle
const ORBIT_R = 38; // percentage of container
const nodeAngles = serviceConfig.map((_, i) => (i * 360) / 8 - 90);

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
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasPlayed]);

  useEffect(() => {
    if (phase < 0) return;
    if (phase === 0) {
      const tm = setTimeout(() => setPhase(1), 500);
      return () => clearTimeout(tm);
    }
    if (phase >= 1 && phase <= 8) {
      const tm = setTimeout(() => setPhase((p) => p + 1), 250);
      return () => clearTimeout(tm);
    }
  }, [phase]);

  const handleMouseEnter = useCallback((i: number) => setHoveredIdx(i), []);
  const handleMouseLeave = useCallback(() => setHoveredIdx(null), []);

  const services = t("lms.ecosystem.services", { returnObjects: true }) as {
    name: string; emoji: string; problem: string; solution: string;
  }[];

  // Compute node positions as percentages
  const nodePositions = nodeAngles.map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      left: 50 + ORBIT_R * Math.cos(rad),
      top: 50 + ORBIT_R * Math.sin(rad),
    };
  });

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

        {/* Desktop – Hexagonal orbit layout */}
        <div className="hidden md:block" ref={containerRef}>
          <div className="relative mx-auto" style={{ width: "100%", maxWidth: 640, aspectRatio: "1" }}>

            {/* SVG for orbit ring + connection lines */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none", overflow: "visible" }}
            >
              {/* Orbit ring */}
              <circle
                cx="50" cy="50" r={ORBIT_R}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.2"
                opacity={allInstalled ? 0.4 : 0.2}
                style={{ transition: "opacity 0.8s ease" }}
              />
              {/* Connection lines */}
              {nodePositions.map((pos, i) => {
                const isInstalled = installedSet.has(i);
                if (!isInstalled) return null;
                const dx = pos.left - 50;
                const dy = pos.top - 50;
                const len = Math.sqrt(dx * dx + dy * dy);
                const ux = dx / len;
                const uy = dy / len;
                const x1 = 50 + ux * 9;
                const y1 = 50 + uy * 9;
                const x2 = pos.left - ux * 7;
                const y2 = pos.top - uy * 7;
                const isHovered = hoveredIdx === i;

                return (
                  <line
                    key={`conn-${i}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isHovered ? serviceConfig[i].accent : "hsl(var(--border))"}
                    strokeWidth={isHovered ? 0.35 : 0.15}
                    opacity={isHovered ? 0.7 : allInstalled ? 0.3 : 0.15}
                    style={{ transition: "all 0.3s ease" }}
                  />
                );
              })}
            </svg>

            {/* Center LMS hub (HTML) */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                width: "15%",
                aspectRatio: "1",
                left: "42.5%",
                top: "42.5%",
                zIndex: 20,
                opacity: phase >= 0 ? 1 : 0,
                transform: phase >= 0 ? "scale(1)" : "scale(0.6)",
                transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <div
                className="w-full h-full flex flex-col items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, hsl(245, 65%, 50%), hsl(245, 75%, 36%))",
                  clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                  boxShadow: allInstalled
                    ? "0 0 24px 4px hsl(245, 65%, 55% / 0.25)"
                    : "0 4px 12px -2px hsl(245, 65%, 40% / 0.3)",
                }}
              >
                <GraduationCap className="w-7 h-7 lg:w-9 lg:h-9 text-white mb-0.5" strokeWidth={2} />
                <span className="text-[9px] lg:text-[11px] font-extrabold text-white tracking-wider">LMS</span>
              </div>
            </div>

            {/* Service hexagon nodes (HTML) */}
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
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    transform: `translate(-50%, -50%) ${isHovered ? "scale(1.1)" : "scale(1)"}`,
                    zIndex: isHovered ? 90 : 10,
                    opacity: isInstalled ? 1 : 0,
                    transition: "opacity 0.4s ease, transform 0.3s ease",
                    cursor: "pointer",
                    pointerEvents: isInstalled ? "auto" : "none",
                  }}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Hexagon icon */}
                  <div
                    className="flex items-center justify-center shadow-md"
                    style={{
                      width: 64,
                      height: 64,
                      background: svc.bg,
                      clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                      transition: "box-shadow 0.3s ease",
                    }}
                  >
                    <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" strokeWidth={2} />
                  </div>
                  {/* Label */}
                  <span className="mt-2 text-[11px] lg:text-xs font-bold text-foreground text-center whitespace-nowrap">
                    {data.name}
                  </span>

                  {/* Tooltip */}
                  {isHovered && (() => {
                    const isTop = pos.top < 50;
                    const isLeft = pos.left < 50;
                    const style: React.CSSProperties = {
                      position: "absolute",
                      width: 220,
                      zIndex: 100,
                      animation: "eco-tooltip-in 0.18s ease-out",
                    };
                    if (isTop) {
                      style.top = "100%";
                      style.marginTop = 8;
                    } else {
                      style.bottom = "100%";
                      style.marginBottom = 8;
                    }
                    if (isLeft) {
                      style.left = 0;
                    } else {
                      style.right = 0;
                    }

                    return (
                      <div
                        className="rounded-2xl p-4 shadow-2xl border border-border/50 bg-background"
                        style={style}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: svc.accent }}>
                          Problem
                        </p>
                        <p className="text-xs text-foreground leading-relaxed mb-2.5" style={{ wordBreak: "keep-all" }}>
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
                className="rounded-2xl p-5 bg-background border border-border/50 flex flex-col gap-3"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  style={{
                    background: svc.bg,
                    clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                  }}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
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
