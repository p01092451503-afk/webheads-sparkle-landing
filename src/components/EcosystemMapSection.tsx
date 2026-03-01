import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
  Server, Video, ShieldCheck, Bot, Smartphone, CreditCard,
  MessageSquareMore, Wrench, GraduationCap, ArrowRight
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const serviceConfig: { key: string; accent: string; bgFrom: string; bgTo: string; icon: LucideIcon }[] = [
  { key: "hosting",     accent: "hsl(215, 75%, 52%)",  bgFrom: "hsl(215, 75%, 48%)", bgTo: "hsl(215, 65%, 36%)", icon: Server },
  { key: "content",     accent: "hsl(35, 85%, 50%)",   bgFrom: "hsl(35, 85%, 52%)",  bgTo: "hsl(35, 75%, 40%)",  icon: Video },
  { key: "drm",         accent: "hsl(0, 65%, 52%)",    bgFrom: "hsl(0, 55%, 50%)",   bgTo: "hsl(0, 50%, 38%)",   icon: ShieldCheck },
  { key: "chatbot",     accent: "hsl(260, 65%, 55%)",  bgFrom: "hsl(260, 55%, 52%)", bgTo: "hsl(260, 50%, 40%)", icon: Bot },
  { key: "app",         accent: "hsl(170, 60%, 40%)",  bgFrom: "hsl(170, 55%, 42%)", bgTo: "hsl(170, 50%, 32%)", icon: Smartphone },
  { key: "pg",          accent: "hsl(245, 60%, 55%)",  bgFrom: "hsl(245, 55%, 52%)", bgTo: "hsl(245, 50%, 40%)", icon: CreditCard },
  { key: "channel",     accent: "hsl(195, 80%, 42%)",  bgFrom: "hsl(195, 70%, 45%)", bgTo: "hsl(195, 60%, 34%)", icon: MessageSquareMore },
  { key: "maintenance", accent: "hsl(150, 55%, 40%)",  bgFrom: "hsl(150, 50%, 42%)", bgTo: "hsl(150, 45%, 32%)", icon: Wrench },
];

// Hexagon SVG path (pointy-top, centered at 0,0)
function hexPath(r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${r * Math.cos(a)},${r * Math.sin(a)}`;
  });
  return `M${pts.join("L")}Z`;
}

// Node positions on a circle (8 services)
const VB = { w: 700, h: 700 };
const CTR = { x: 350, y: 350 };
const ORBIT_R = 260;
const HEX_R = 48; // service hex radius
const HUB_R = 62; // center hex radius

const nodePositions = serviceConfig.map((_, i) => {
  const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
  return {
    x: CTR.x + ORBIT_R * Math.cos(angle),
    y: CTR.y + ORBIT_R * Math.sin(angle),
  };
});

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
          <div className="relative mx-auto" style={{ width: "100%", maxWidth: 620, aspectRatio: "1" }}>
            <svg
              viewBox={`0 0 ${VB.w} ${VB.h}`}
              className="absolute inset-0 w-full h-full"
              style={{ overflow: "visible" }}
            >
              <defs>
                {/* Gradients for each service hexagon */}
                {serviceConfig.map((svc, i) => (
                  <linearGradient key={`grad-${i}`} id={`hex-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={svc.bgFrom} />
                    <stop offset="100%" stopColor={svc.bgTo} />
                  </linearGradient>
                ))}
                {/* Center hub gradient */}
                <linearGradient id="hex-hub-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(245, 65%, 50%)" />
                  <stop offset="100%" stopColor="hsl(245, 75%, 36%)" />
                </linearGradient>
                {/* Drop shadow */}
                <filter id="hex-shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="hsl(0,0%,0%)" floodOpacity="0.12" />
                </filter>
                <filter id="hex-shadow-hover" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="hsl(0,0%,0%)" floodOpacity="0.18" />
                </filter>
              </defs>

              {/* Orbit ring */}
              <circle
                cx={CTR.x} cy={CTR.y} r={ORBIT_R}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1.2"
                opacity={allInstalled ? 0.35 : 0.2}
                style={{ transition: "opacity 0.8s ease" }}
              />

              {/* Connecting lines from hub to nodes */}
              {nodePositions.map((pos, i) => {
                const isInstalled = installedSet.has(i);
                if (!isInstalled) return null;
                const dx = pos.x - CTR.x;
                const dy = pos.y - CTR.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const ux = dx / len;
                const uy = dy / len;
                const x1 = CTR.x + ux * (HUB_R + 8);
                const y1 = CTR.y + uy * (HUB_R + 8);
                const x2 = pos.x - ux * (HEX_R + 8);
                const y2 = pos.y - uy * (HEX_R + 8);
                const isHovered = hoveredIdx === i;

                return (
                  <line
                    key={`conn-${i}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isHovered ? serviceConfig[i].accent : "hsl(var(--border))"}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={isHovered ? 0.7 : allInstalled ? 0.25 : 0.15}
                    style={{ transition: "all 0.3s ease" }}
                  />
                );
              })}

              {/* Center LMS hexagon */}
              <g
                style={{
                  opacity: phase >= 0 ? 1 : 0,
                  transform: phase >= 0 ? "scale(1)" : "scale(0.6)",
                  transformOrigin: `${CTR.x}px ${CTR.y}px`,
                  transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <g transform={`translate(${CTR.x},${CTR.y})`} filter="url(#hex-shadow)">
                  <path d={hexPath(HUB_R)} fill="url(#hex-hub-grad)" />
                  <g transform="translate(-16,-20)">
                    <foreignObject width="32" height="32">
                      <GraduationCap width={32} height={32} strokeWidth={2} color="white" />
                    </foreignObject>
                  </g>
                  <text
                    y={22}
                    textAnchor="middle"
                    fill="white"
                    fontSize="13"
                    fontWeight="800"
                    letterSpacing="1.5"
                  >
                    LMS
                  </text>
                </g>
              </g>

              {/* Service hexagon nodes */}
              {serviceConfig.map((svc, i) => {
                const pos = nodePositions[i];
                const data = services?.[i];
                if (!data) return null;
                const Icon = svc.icon;
                const isInstalled = installedSet.has(i);
                const isHovered = hoveredIdx === i && isInstalled;
                const scale = isHovered ? 1.1 : 1;

                return (
                  <g
                    key={svc.key}
                    style={{
                      opacity: isInstalled ? 1 : 0,
                      transform: `translate(${pos.x}px, ${pos.y}px) scale(${isInstalled ? scale : 0.5})`,
                      transformOrigin: `${pos.x}px ${pos.y}px`,
                      transition: "opacity 0.4s ease, transform 0.3s ease",
                      cursor: "pointer",
                      pointerEvents: isInstalled ? "auto" : "none",
                    }}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <g transform={`translate(${pos.x},${pos.y})`}>
                      {/* Hex bg */}
                      <path
                        d={hexPath(HEX_R)}
                        fill={`url(#hex-grad-${i})`}
                        filter={isHovered ? "url(#hex-shadow-hover)" : "url(#hex-shadow)"}
                      />
                      {/* Icon */}
                      <g transform="translate(-14,-14)">
                        <foreignObject width="28" height="28">
                          <Icon width={28} height={28} strokeWidth={2} color="white" />
                        </foreignObject>
                      </g>
                    </g>
                    {/* Label below hex */}
                    <text
                      x={pos.x}
                      y={pos.y + HEX_R + 20}
                      textAnchor="middle"
                      fill="currentColor"
                      className="text-foreground"
                      fontSize="13"
                      fontWeight="700"
                    >
                      {data.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip overlay (HTML, positioned absolutely) */}
            {hoveredIdx !== null && installedSet.has(hoveredIdx) && (() => {
              const i = hoveredIdx;
              const pos = nodePositions[i];
              const data = services?.[i];
              const svc = serviceConfig[i];
              if (!data) return null;

              // Position tooltip outward from center
              const dx = pos.x - CTR.x;
              const dy = pos.y - CTR.y;
              const pctX = (pos.x / VB.w) * 100;
              const pctY = (pos.y / VB.h) * 100;

              const style: React.CSSProperties = {
                position: "absolute",
                width: 220,
                zIndex: 100,
                animation: "eco-tooltip-in 0.18s ease-out",
              };

              // Place tooltip on the outward side
              if (Math.abs(dx) > Math.abs(dy)) {
                // Mostly horizontal
                style.top = `${pctY}%`;
                style.transform = "translateY(-50%)";
                if (dx > 0) {
                  style.left = `calc(${pctX}% + 60px)`;
                } else {
                  style.right = `calc(${100 - pctX}% + 60px)`;
                }
              } else {
                // Mostly vertical
                style.left = `${pctX}%`;
                style.transform = "translateX(-50%)";
                if (dy > 0) {
                  style.top = `calc(${pctY}% + 60px)`;
                } else {
                  style.bottom = `calc(${100 - pctY}% + 60px)`;
                }
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
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${svc.bgFrom}, ${svc.bgTo})` }}
                >
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
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
