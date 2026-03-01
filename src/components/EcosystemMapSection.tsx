import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Server, Video, ShieldCheck, Bot, Smartphone, CreditCard,
  MessageSquareMore, Wrench, GraduationCap, ArrowRight
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

const NODE_RADIUS = 180;
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

const HUB_RADIUS = 56;
const NODE_HALF = 58;
const INSTALL_ORDER = [0, 4, 1, 5, 2, 6, 3, 7];

export default function EcosystemMapSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // -1 = waiting, 0 = hub visible, 1-8 = nodes appearing, 9 = done
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

        {/* Desktop */}
        <div className="hidden md:block" ref={containerRef}>
          <div className="relative mx-auto" style={{ width: 500, height: 500 }}>
            {/* SVG lines */}
            <svg
              viewBox="0 0 500 500"
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none" }}
            >
              <defs>
                {serviceConfig.map((svc, i) => (
                  <marker
                    key={`arrow-${i}`}
                    id={`arrow-${i}`}
                    viewBox="0 0 10 8"
                    refX="10"
                    refY="4"
                    markerWidth="8"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="M0,0 L10,4 L0,8 Z" fill={hoveredIdx === i ? svc.accent : allInstalled ? svc.accent : "hsl(var(--border))"} opacity={hoveredIdx === i ? 1 : allInstalled ? 0.5 : 0.8} />
                  </marker>
                ))}
              </defs>
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
                    stroke={isHovered ? serviceConfig[i].accent : allInstalled ? serviceConfig[i].accent : "hsl(var(--border))"}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    strokeDasharray={allInstalled || isHovered ? "none" : "6 4"}
                    opacity={isHovered ? 1 : allInstalled ? 0.5 : 0.8}
                    markerEnd={`url(#arrow-${i})`}
                    style={{ transition: "all 0.3s ease" }}
                  />
                );
              })}
            </svg>

            {/* Center hub */}
            <div
              className="absolute flex flex-col items-center justify-center rounded-full"
              style={{
                width: 104,
                height: 104,
                left: CENTER.x - 52,
                top: CENTER.y - 52,
                zIndex: 20,
                opacity: phase >= 0 ? 1 : 0,
                transform: phase >= 0 ? "scale(1)" : "scale(0.8)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <div
                className="absolute inset-0 rounded-full flex flex-col items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, hsl(245, 65%, 50%), hsl(245, 75%, 38%))",
                  boxShadow: allInstalled
                    ? "0 0 24px 4px hsl(245, 65%, 55% / 0.3)"
                    : "0 4px 12px -2px hsl(245, 65%, 40% / 0.3)",
                  transition: "box-shadow 0.8s ease",
                }}
              >
                <GraduationCap className="w-10 h-10 text-white mb-1" strokeWidth={2} />
                <span className="text-sm font-extrabold text-white tracking-wide">LMS</span>
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
                    left: pos.x - 44,
                    top: pos.y - 44,
                    zIndex: isHovered ? 90 : 10,
                    opacity: isInstalled ? 1 : 0,
                    transform: isInstalled ? "translateY(0)" : "translateY(12px)",
                    transition: "opacity 0.35s ease, transform 0.35s ease",
                  }}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="relative w-[88px] h-[88px] rounded-2xl flex flex-col items-center justify-center cursor-pointer group"
                    style={{
                       background: isHovered ? svc.accent : "var(--background)",
                       border: `1px solid ${isHovered ? svc.accent : "hsl(var(--border))"}`,
                       boxShadow: isHovered
                         ? `0 8px 20px -4px ${svc.accent}44, 0 2px 6px -2px ${svc.accent}30`
                         : "0 4px 14px -4px hsl(var(--foreground) / 0.12), 0 1px 4px -1px hsl(var(--foreground) / 0.08)",
                       transform: isHovered ? "scale(1.08)" : "scale(1)",
                      transition: "all 0.25s ease",
                    }}
                    onClick={() => {}}
                  >
                    <Icon
                      className="w-8 h-8 mb-1"
                      style={{ color: isHovered ? "#fff" : svc.accent }}
                      strokeWidth={1.8}
                    />
                    <span
                      className="text-[11px] font-bold leading-tight text-center px-1"
                      style={{ color: isHovered ? "#fff" : "var(--foreground)" }}
                    >
                      {data.name}
                    </span>
                  </button>

                  {/* Tooltip */}
                  {hoveredIdx === i && isInstalled && (() => {
                    const dx = pos.x - CENTER.x;
                    const dy = pos.y - CENTER.y;
                    const outward = { x: dx / Math.abs(dx || 1), y: dy / Math.abs(dy || 1) };
                    const tooltipStyle: React.CSSProperties = {
                      zIndex: 100,
                      animation: "eco-tooltip-in 0.18s ease-out",
                    };
                    if (Math.abs(dx) > Math.abs(dy) * 0.5) {
                      if (outward.x > 0) tooltipStyle.left = 96;
                      else tooltipStyle.right = 96;
                    } else {
                      tooltipStyle.left = -96;
                    }
                    if (Math.abs(dy) > Math.abs(dx) * 0.5) {
                      if (outward.y > 0) tooltipStyle.top = 94;
                      else tooltipStyle.bottom = 94;
                    } else {
                      tooltipStyle.top = -20;
                    }
                    return (
                      <div
                        className="absolute w-64 rounded-2xl p-5 shadow-2xl border border-border/50 bg-background"
                        style={tooltipStyle}
                      >
                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: svc.accent }}>
                          Problem
                        </p>
                        <p className="text-sm text-foreground leading-relaxed mb-3" style={{ wordBreak: "keep-all" }}>
                          {data.problem}
                        </p>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: svc.accent }}>
                          Solution
                        </p>
                        <p className="text-sm text-foreground leading-relaxed mb-3" style={{ wordBreak: "keep-all" }}>
                          {data.solution}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: svc.accent }}>
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
                onClick={() => navigate(svc.path)}
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
