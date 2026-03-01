import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
  Server, Video, ShieldCheck, Bot, Smartphone, CreditCard,
  MessageSquareMore, Wrench, GraduationCap, ArrowRight,
  BookOpen, Award, Target, Monitor, Cloud, Settings,
  Wifi, ChevronRight, Zap, BarChart3
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const serviceConfig: { key: string; path: string; accent: string; icon: LucideIcon }[] = [
  { key: "hosting", path: "/hosting", accent: "hsl(215, 75%, 52%)", icon: Server },
  { key: "content", path: "/content", accent: "hsl(35, 85%, 50%)", icon: Video },
  { key: "drm", path: "/drm", accent: "hsl(0, 65%, 52%)", icon: ShieldCheck },
  { key: "chatbot", path: "/chatbot", accent: "hsl(260, 65%, 55%)", icon: Bot },
  { key: "app", path: "/app-dev", accent: "hsl(170, 60%, 40%)", icon: Smartphone },
  { key: "pg", path: "/pg", accent: "hsl(245, 60%, 55%)", icon: CreditCard },
  { key: "channel", path: "/channel", accent: "hsl(195, 80%, 42%)", icon: MessageSquareMore },
  { key: "maintenance", path: "/maintenance", accent: "hsl(150, 55%, 40%)", icon: Wrench },
];

// Scattered positions for a wide landscape layout (viewBox 900x500)
// LMS center at 450, 250
const VIEWBOX = { w: 900, h: 500 };
const LMS_CENTER = { x: 450, y: 250 };

// Service node positions - scattered organically around the center
const scatteredPositions = [
  { x: 450, y: 52 },   // hosting - top center
  { x: 760, y: 80 },   // content - top right
  { x: 820, y: 270 },  // drm - right
  { x: 700, y: 420 },  // chatbot - bottom right
  { x: 450, y: 450 },  // app - bottom center
  { x: 200, y: 420 },  // pg - bottom left
  { x: 80, y: 270 },   // channel - left
  { x: 140, y: 80 },   // maintenance - top left
];

// Decorative icon positions (small ambient icons like in the reference)
const decoIcons: { Icon: LucideIcon; x: number; y: number; size: number; opacity: number; rotate?: number }[] = [
  { Icon: BookOpen, x: 100, y: 170, size: 18, opacity: 0.15 },
  { Icon: Award, x: 780, y: 170, size: 20, opacity: 0.15 },
  { Icon: Target, x: 310, y: 60, size: 16, opacity: 0.12 },
  { Icon: Monitor, x: 600, y: 450, size: 18, opacity: 0.12 },
  { Icon: Cloud, x: 320, y: 430, size: 16, opacity: 0.12 },
  { Icon: Settings, x: 580, y: 60, size: 18, opacity: 0.15, rotate: 15 },
  { Icon: Wifi, x: 50, y: 400, size: 14, opacity: 0.1 },
  { Icon: BarChart3, x: 850, y: 400, size: 16, opacity: 0.1 },
  { Icon: Zap, x: 250, y: 180, size: 14, opacity: 0.1 },
  { Icon: ChevronRight, x: 650, y: 180, size: 14, opacity: 0.1, rotate: -45 },
];

// Dashed grid-line segments for ambient decoration
const gridLines = [
  // Horizontal segments
  "M 60 120 L 280 120", "M 620 120 L 840 120",
  "M 60 380 L 280 380", "M 620 380 L 840 380",
  "M 200 200 L 340 200", "M 560 200 L 700 200",
  "M 200 300 L 340 300", "M 560 300 L 700 300",
  // Vertical segments
  "M 200 60 L 200 160", "M 700 60 L 700 160",
  "M 200 340 L 200 440", "M 700 340 L 700 440",
  "M 350 100 L 350 190", "M 550 100 L 550 190",
  "M 350 310 L 350 400", "M 550 310 L 550 400",
  // Diagonal accents
  "M 130 130 L 170 90", "M 730 130 L 770 90",
  "M 130 370 L 170 410", "M 730 370 L 770 410",
];

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
      const t = setTimeout(() => setPhase(1), 500);
      return () => clearTimeout(t);
    }
    if (phase >= 1 && phase <= 8) {
      const t = setTimeout(() => setPhase((p) => p + 1), 280);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleMouseEnter = useCallback((i: number) => setHoveredIdx(i), []);
  const handleMouseLeave = useCallback(() => setHoveredIdx(null), []);

  const services = t("lms.ecosystem.services", { returnObjects: true }) as {
    name: string; emoji: string; problem: string; solution: string;
  }[];

  return (
    <section className="py-20" style={{ background: "var(--lms-section-alt)" }}>
      <div className="container mx-auto px-6 max-w-6xl">
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

        {/* Desktop - Scattered infographic layout */}
        <div className="hidden md:block" ref={containerRef}>
          <div className="relative mx-auto w-full" style={{ maxWidth: 900, aspectRatio: "900 / 500" }}>
            <svg
              viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none" }}
            >
              {/* Ambient grid lines (dashed, very subtle) */}
              <g opacity={allInstalled ? 0.25 : 0.15} style={{ transition: "opacity 1s ease" }}>
                {gridLines.map((d, i) => (
                  <path
                    key={`grid-${i}`}
                    d={d}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    strokeDasharray="6 6"
                    fill="none"
                  />
                ))}
              </g>

              {/* Decorative small dots at intersections */}
              {[
                [200, 120], [700, 120], [200, 380], [700, 380],
                [350, 200], [550, 200], [350, 300], [550, 300],
              ].map(([cx, cy], i) => (
                <circle
                  key={`dot-${i}`}
                  cx={cx} cy={cy} r={2.5}
                  fill="hsl(var(--border))"
                  opacity={allInstalled ? 0.4 : 0.2}
                  style={{ transition: "opacity 1s ease" }}
                />
              ))}

              {/* Connection lines from LMS center to each service */}
              {scatteredPositions.map((pos, i) => {
                const isInstalled = installedSet.has(i);
                const isHovered = hoveredIdx === i && isInstalled;
                if (!isInstalled) return null;

                const dx = pos.x - LMS_CENTER.x;
                const dy = pos.y - LMS_CENTER.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const ux = dx / len;
                const uy = dy / len;
                const x1 = LMS_CENTER.x + ux * 58;
                const y1 = LMS_CENTER.y + uy * 58;
                const x2 = pos.x - ux * 42;
                const y2 = pos.y - uy * 42;

                return (
                  <line
                    key={`line-${i}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isHovered ? serviceConfig[i].accent : serviceConfig[i].accent}
                    strokeWidth={isHovered ? 2 : 1.2}
                    strokeDasharray="8 5"
                    opacity={isHovered ? 0.8 : 0.3}
                    style={{ transition: "opacity 0.3s ease, stroke-width 0.3s ease" }}
                  />
                );
              })}

              {/* Small arrow markers at line ends */}
              <defs>
                {serviceConfig.map((svc, i) => (
                  <marker
                    key={`arr-${i}`}
                    id={`arr-${i}`}
                    viewBox="0 0 8 6"
                    refX="8" refY="3"
                    markerWidth="6" markerHeight="5"
                    orient="auto"
                  >
                    <path d="M0,0 L8,3 L0,6 Z" fill={svc.accent} opacity="0.5" />
                  </marker>
                ))}
              </defs>
            </svg>

            {/* Decorative ambient icons */}
            <svg
              viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none" }}
            >
              {decoIcons.map((d, i) => {
                const Icon = d.Icon;
                return (
                  <foreignObject
                    key={`deco-${i}`}
                    x={d.x - d.size / 2}
                    y={d.y - d.size / 2}
                    width={d.size}
                    height={d.size}
                    opacity={allInstalled ? d.opacity * 1.5 : d.opacity}
                    style={{ transition: "opacity 1s ease" }}
                  >
                    <div style={{ transform: d.rotate ? `rotate(${d.rotate}deg)` : undefined }}>
                      <Icon
                        width={d.size}
                        height={d.size}
                        strokeWidth={1.5}
                        className="text-muted-foreground"
                      />
                    </div>
                  </foreignObject>
                );
              })}
            </svg>

            {/* Center LMS hub */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                width: "11.5%",
                aspectRatio: "1",
                left: `${(LMS_CENTER.x / VIEWBOX.w) * 100 - 5.75}%`,
                top: `${(LMS_CENTER.y / VIEWBOX.h) * 100 - 5.75 * (VIEWBOX.w / VIEWBOX.h)}%`,
                zIndex: 20,
                opacity: phase >= 0 ? 1 : 0,
                transform: phase >= 0 ? "scale(1)" : "scale(0.7)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <div
                className="w-full h-full rounded-full flex flex-col items-center justify-center shadow-xl"
                style={{
                  background: "linear-gradient(135deg, hsl(245, 65%, 50%), hsl(245, 75%, 38%))",
                  boxShadow: allInstalled
                    ? "0 0 30px 6px hsl(245, 65%, 55% / 0.25)"
                    : "0 4px 16px -4px hsl(245, 65%, 40% / 0.3)",
                  transition: "box-shadow 0.8s ease",
                }}
              >
                <GraduationCap className="w-8 h-8 lg:w-10 lg:h-10 text-white mb-0.5" strokeWidth={2} />
                <span className="text-xs lg:text-sm font-extrabold text-white tracking-wider">LMS</span>
              </div>
            </div>

            {/* Service nodes - scattered with icon + label */}
            {serviceConfig.map((svc, i) => {
              const pos = scatteredPositions[i];
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
                    left: `${(pos.x / VIEWBOX.w) * 100}%`,
                    top: `${(pos.y / VIEWBOX.h) * 100}%`,
                    transform: `translate(-50%, -50%) ${isInstalled ? "scale(1)" : "scale(0.6)"}`,
                    zIndex: isHovered ? 90 : 10,
                    opacity: isInstalled ? 1 : 0,
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Icon container with accent-tinted background */}
                  <div
                    className="flex items-center justify-center rounded-xl mb-2"
                    style={{
                      width: 56,
                      height: 56,
                      background: isHovered
                        ? `${svc.accent.replace(")", " / 0.15)")}`
                        : `${svc.accent.replace(")", " / 0.08)")}`,
                      border: `1.5px solid ${svc.accent.replace(")", " / 0.25)")}`,
                      transform: isHovered ? "scale(1.12)" : "scale(1)",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <Icon
                      className="w-7 h-7 lg:w-8 lg:h-8"
                      style={{ color: svc.accent }}
                      strokeWidth={2}
                    />
                  </div>
                  <span
                    className="text-[11px] lg:text-xs font-bold text-foreground text-center leading-tight whitespace-nowrap"
                  >
                    {data.name}
                  </span>

                  {/* Tooltip on hover */}
                  {isHovered && (() => {
                    const isTop = pos.y < LMS_CENTER.y;
                    const isLeft = pos.x < LMS_CENTER.x;
                    const tooltipStyle: React.CSSProperties = {
                      position: "absolute",
                      zIndex: 100,
                      width: 240,
                      animation: "eco-tooltip-in 0.18s ease-out",
                    };
                    // Position tooltip away from center
                    if (isTop) {
                      tooltipStyle.top = "100%";
                      tooltipStyle.marginTop = 8;
                    } else {
                      tooltipStyle.bottom = "100%";
                      tooltipStyle.marginBottom = 8;
                    }
                    if (isLeft) {
                      tooltipStyle.left = "50%";
                      tooltipStyle.transform = "translateX(-30%)";
                    } else {
                      tooltipStyle.right = "50%";
                      tooltipStyle.transform = "translateX(30%)";
                    }

                    return (
                      <div
                        className="rounded-2xl p-4 shadow-2xl border border-border/50 bg-background"
                        style={tooltipStyle}
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
              <button
                key={svc.key}
                onClick={() => {}}
                className="text-left rounded-2xl p-5 bg-background border border-border/50 hover:shadow-lg transition-all duration-200 flex flex-col gap-3"
              >
                <Icon className="w-7 h-7" style={{ color: svc.accent }} strokeWidth={2} />
                <h4 className="font-bold text-sm text-foreground leading-snug">{data.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed" style={{ wordBreak: "keep-all" }}>
                  {data.problem}
                </p>
              </button>
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
