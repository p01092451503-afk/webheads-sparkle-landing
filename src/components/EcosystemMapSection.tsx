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

// Installation order (randomised feel but deterministic)
const INSTALL_ORDER = [0, 4, 1, 5, 2, 6, 3, 7];

export default function EcosystemMapSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation phases: -1 = waiting, 0 = hub appearing, 1-8 = installing nodes, 9 = all done + sparkle
  const [phase, setPhase] = useState(-1);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Which node indices are "installed"
  const installedSet = new Set<number>();
  if (phase >= 1) {
    for (let p = 0; p < Math.min(phase, 8); p++) {
      installedSet.add(INSTALL_ORDER[p]);
    }
  }
  const allInstalled = phase >= 9;

  // Intersection observer to trigger animation
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

  // Step through phases
  useEffect(() => {
    if (phase < 0) return;
    if (phase === 0) {
      // Hub appears, then start installing nodes
      const t = setTimeout(() => setPhase(1), 700);
      return () => clearTimeout(t);
    }
    if (phase >= 1 && phase <= 8) {
      const t = setTimeout(() => setPhase((p) => p + 1), 350);
      return () => clearTimeout(t);
    }
    // phase 9+ = sparkle, stays
  }, [phase]);

  const handleMouseEnter = useCallback((i: number) => {
    setHoveredIdx(i);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIdx(null);
  }, []);

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

        {/* Desktop: SVG interactive map */}
        <div className="hidden md:block" ref={containerRef}>
          <div className="relative mx-auto" style={{ width: 500, height: 500 }}>
            {/* SVG connections */}
            <svg
              viewBox="0 0 500 500"
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none" }}
            >
              <defs>
                <filter id="eco-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Sparkle filter for completed state */}
                <filter id="eco-sparkle">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {serviceConfig.map((svc, i) => (
                  <linearGradient
                    key={`grad-${i}`}
                    id={`eco-flow-grad-${i}`}
                    gradientUnits="userSpaceOnUse"
                    x1={CENTER.x}
                    y1={CENTER.y}
                    x2={nodePositions[i].x}
                    y2={nodePositions[i].y}
                  >
                    <stop offset="0%" stopColor={svc.accent} stopOpacity="0.15" />
                    <stop offset="40%" stopColor={svc.accent} stopOpacity="1">
                      <animate attributeName="offset" values="0;1" dur="1.2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor={svc.accent} stopOpacity="1">
                      <animate attributeName="offset" values="0.1;1.1" dur="1.2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="60%" stopColor={svc.accent} stopOpacity="0.15">
                      <animate attributeName="offset" values="0.2;1.2" dur="1.2s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>
                ))}
              </defs>

              {/* Connection lines — only show for installed nodes */}
              {nodePositions.map((pos, i) => {
                const isInstalled = installedSet.has(i);
                const isHovered = hoveredIdx === i && isInstalled;
                if (!isInstalled) return null;

                return (
                  <g key={i}>
                    <line
                      x1={CENTER.x}
                      y1={CENTER.y}
                      x2={pos.x}
                      y2={pos.y}
                      stroke={isHovered ? serviceConfig[i].accent : allInstalled ? serviceConfig[i].accent : "hsl(var(--border))"}
                      strokeWidth={isHovered ? 2.5 : allInstalled ? 2 : 1.5}
                      strokeDasharray={isHovered || allInstalled ? "none" : "6 4"}
                      style={{
                        transition: "all 0.3s ease",
                        animation: `eco-line-draw 0.4s ease-out`,
                      }}
                      filter={isHovered ? "url(#eco-glow)" : undefined}
                      opacity={allInstalled ? 0.6 : 1}
                    />
                    {/* Flow animation on hover */}
                    {isHovered && (
                      <line
                        x1={CENTER.x}
                        y1={CENTER.y}
                        x2={pos.x}
                        y2={pos.y}
                        stroke={`url(#eco-flow-grad-${i})`}
                        strokeWidth={4}
                        strokeLinecap="round"
                      />
                    )}
                    {isHovered && [0, 0.4, 0.8].map((delay, di) => (
                      <circle key={di} r="3.5" fill={serviceConfig[i].accent} opacity="0.9">
                        <animateMotion
                          dur="1.4s"
                          repeatCount="indefinite"
                          begin={`${delay}s`}
                          path={`M${CENTER.x},${CENTER.y} L${pos.x},${pos.y}`}
                        />
                        <animate attributeName="opacity" values="0;0.9;0.9;0" dur="1.4s" repeatCount="indefinite" begin={`${delay}s`} />
                        <animate attributeName="r" values="2;3.5;2" dur="1.4s" repeatCount="indefinite" begin={`${delay}s`} />
                      </circle>
                    ))}
                  </g>
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
                transform: phase >= 0 ? "scale(1)" : "scale(0.5)",
                transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {/* Pulse rings */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "hsl(245, 65%, 50%)",
                  opacity: 0.15,
                  animation: phase >= 0 ? "eco-hub-pulse 2.8s ease-out infinite" : "none",
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "hsl(245, 65%, 50%)",
                  opacity: 0.1,
                  animation: phase >= 0 ? "eco-hub-pulse 2.8s ease-out infinite 0.9s" : "none",
                }}
              />

              {/* Sparkle ring — after all installed */}
              {allInstalled && (
                <>
                  <div
                    className="absolute rounded-full"
                    style={{
                      inset: -8,
                      border: "2px solid hsl(245, 65%, 60%)",
                      animation: "eco-sparkle-ring 2s ease-out infinite",
                      opacity: 0,
                    }}
                  />
                  <div
                    className="absolute rounded-full"
                    style={{
                      inset: -4,
                      border: "1.5px solid hsl(245, 65%, 70%)",
                      animation: "eco-sparkle-ring 2s ease-out infinite 0.6s",
                      opacity: 0,
                    }}
                  />
                  {/* Star sparkles */}
                  {[0, 60, 120, 180, 240, 300].map((angle, si) => {
                    const rad = (angle * Math.PI) / 180;
                    const dist = 62;
                    return (
                      <div
                        key={si}
                        className="absolute"
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "hsl(245, 80%, 70%)",
                          left: 52 + dist * Math.cos(rad) - 3,
                          top: 52 + dist * Math.sin(rad) - 3,
                          animation: `eco-star-twinkle 1.8s ease-in-out infinite ${si * 0.3}s`,
                          boxShadow: "0 0 8px 2px hsl(245, 80%, 70%)",
                        }}
                      />
                    );
                  })}
                </>
              )}

              <div
                className="absolute inset-0 rounded-full flex flex-col items-center justify-center shadow-xl"
                style={{
                  background: allInstalled
                    ? "linear-gradient(135deg, hsl(245, 70%, 55%), hsl(245, 80%, 42%))"
                    : "linear-gradient(135deg, hsl(245, 65%, 50%), hsl(245, 75%, 38%))",
                  boxShadow: allInstalled
                    ? "0 0 40px 8px hsl(245, 70%, 55% / 0.35), 0 4px 20px -4px hsl(245, 65%, 40% / 0.5)"
                    : undefined,
                  transition: "all 0.6s ease",
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
                    zIndex: isHovered ? 30 : 10,
                    opacity: isInstalled ? 1 : 0,
                    transform: isInstalled ? "scale(1)" : "scale(0.3)",
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="relative w-[88px] h-[88px] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                    style={{
                      background: isHovered ? svc.accent : "var(--background)",
                      border: `2px solid ${isHovered ? svc.accent : allInstalled ? svc.accent + "44" : "hsl(var(--border))"}`,
                      boxShadow: isHovered
                        ? `0 8px 32px -4px ${svc.accent}55`
                        : "0 2px 8px -2px hsl(var(--foreground) / 0.06)",
                      transform: isHovered ? "scale(1.12)" : "scale(1)",
                    }}
                    onClick={() => navigate(svc.path)}
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

                    {/* Install flash effect */}
                    {isInstalled && (
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                          background: `radial-gradient(circle, ${svc.accent}30 0%, transparent 70%)`,
                          animation: "eco-install-flash 0.6s ease-out forwards",
                        }}
                      />
                    )}
                  </button>

                  {/* Tooltip — only on manual hover */}
                  {hoveredIdx === i && isInstalled && (() => {
                    const dx = pos.x - CENTER.x;
                    const dy = pos.y - CENTER.y;
                    const outward = { x: dx / Math.abs(dx || 1), y: dy / Math.abs(dy || 1) };
                    const tooltipStyle: React.CSSProperties = {
                      zIndex: 50,
                      animation: "eco-tooltip-in 0.2s ease-out",
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

        {/* Mobile: Card grid fallback */}
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
          from { opacity: 0; transform: translateY(4px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes eco-hub-pulse {
          0% { transform: scale(1); opacity: 0.18; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes eco-line-draw {
          from { stroke-dashoffset: 200; stroke-dasharray: 200; }
          to { stroke-dashoffset: 0; stroke-dasharray: 200; }
        }
        @keyframes eco-install-flash {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.3); }
        }
        @keyframes eco-sparkle-ring {
          0% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.8); }
        }
        @keyframes eco-star-twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </section>
  );
}
