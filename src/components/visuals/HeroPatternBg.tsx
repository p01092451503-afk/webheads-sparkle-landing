/**
 * Shared abstract volumetric pattern background for hero sections.
 * Each color theme has a unique pattern style.
 */

type HeroColorTheme = "blue-purple" | "teal-cyan" | "indigo-deep" | "emerald-green" | "slate-orange";

const themes: Record<HeroColorTheme, { bg: string; stroke: string }> = {
  "blue-purple": {
    bg: "linear-gradient(135deg, hsl(245, 70%, 52%) 0%, hsl(225, 80%, 50%) 50%, hsl(245, 65%, 48%) 100%)",
    stroke: "white",
  },
  "teal-cyan": {
    bg: "linear-gradient(135deg, hsl(185, 65%, 42%) 0%, hsl(195, 75%, 38%) 50%, hsl(190, 70%, 35%) 100%)",
    stroke: "white",
  },
  "indigo-deep": {
    bg: "linear-gradient(135deg, hsl(230, 65%, 48%) 0%, hsl(240, 70%, 42%) 50%, hsl(235, 60%, 38%) 100%)",
    stroke: "white",
  },
  "emerald-green": {
    bg: "linear-gradient(135deg, hsl(160, 60%, 38%) 0%, hsl(170, 55%, 32%) 50%, hsl(155, 65%, 28%) 100%)",
    stroke: "white",
  },
  "slate-orange": {
    bg: "linear-gradient(135deg, hsl(220, 25%, 38%) 0%, hsl(215, 30%, 32%) 50%, hsl(225, 20%, 28%) 100%)",
    stroke: "white",
  },
};

/* ── Blue-Purple: Concentric arcs (left-bottom & right-bottom) ── */
function BluePurplePattern({ stroke }: { stroke: string }) {
  return (
    <>
      {/* Left concentric arcs */}
      <g opacity="0.18">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <circle key={`l-${i}`} cx={-80 + i * 8} cy={380 + i * 5} r={120 + i * 55} stroke={stroke} strokeWidth={2.5 - i * 0.15} fill="none" />
        ))}
      </g>
      {/* Right concentric arcs */}
      <g opacity="0.12">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <circle key={`r-${i}`} cx={1480 - i * 10} cy={480 + i * 8} r={100 + i * 60} stroke={stroke} strokeWidth={2 - i * 0.12} fill="none" />
        ))}
      </g>
      {/* Top-right flowing arcs */}
      <g opacity="0.1">
        {[0, 1, 2, 3].map(i => (
          <path key={`tr-${i}`} d={`M ${1100 + i * 40} ${-20 + i * 15} Q ${1300 + i * 20} ${100 + i * 30} 1460 ${60 + i * 50}`} stroke={stroke} strokeWidth={2} fill="none" />
        ))}
      </g>
    </>
  );
}

/* ── Teal-Cyan: Diagonal wave lines + floating dots ── */
function TealCyanPattern({ stroke }: { stroke: string }) {
  return (
    <>
      {/* Flowing diagonal wave lines across the hero */}
      <g opacity="0.15">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <path
            key={`wave-${i}`}
            d={`M -50 ${80 + i * 70} Q 360 ${40 + i * 70 + (i % 2 === 0 ? 30 : -30)} 720 ${80 + i * 70} T 1490 ${80 + i * 70}`}
            stroke={stroke}
            strokeWidth={1.8 - i * 0.1}
            fill="none"
          />
        ))}
      </g>
      {/* Scattered dots cluster – top-right */}
      <g opacity="0.12">
        {[
          [1200, 80], [1260, 120], [1320, 60], [1340, 150], [1100, 140],
          [1180, 180], [1280, 200], [1380, 100], [1150, 50], [1050, 110],
        ].map(([cx, cy], i) => (
          <circle key={`dot-${i}`} cx={cx} cy={cy} r={3 + (i % 3)} fill={stroke} />
        ))}
      </g>
      {/* Scattered dots cluster – bottom-left */}
      <g opacity="0.1">
        {[
          [80, 420], [140, 460], [60, 500], [200, 440], [160, 520],
          [100, 540], [240, 480], [40, 470], [180, 560], [280, 500],
        ].map(([cx, cy], i) => (
          <circle key={`dot2-${i}`} cx={cx} cy={cy} r={2.5 + (i % 3)} fill={stroke} />
        ))}
      </g>
    </>
  );
}

/* ── Indigo-Deep: Geometric grid mesh + diamond shapes ── */
function IndigoDeepPattern({ stroke }: { stroke: string }) {
  return (
    <>
      {/* Angled grid lines – left side */}
      <g opacity="0.12">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line key={`gl-${i}`} x1={-40 + i * 80} y1={0} x2={-40 + i * 80 + 200} y2={600} stroke={stroke} strokeWidth={1.2} />
        ))}
        {[0, 1, 2, 3].map(i => (
          <line key={`gh-${i}`} x1={0} y1={100 + i * 150} x2={500} y2={100 + i * 150} stroke={stroke} strokeWidth={0.8} />
        ))}
      </g>
      {/* Diamond shapes – right side */}
      <g opacity="0.14">
        {[
          { cx: 1200, cy: 150, s: 50 },
          { cx: 1300, cy: 300, s: 70 },
          { cx: 1100, cy: 400, s: 40 },
          { cx: 1350, cy: 480, s: 55 },
          { cx: 1050, cy: 200, s: 35 },
        ].map(({ cx, cy, s }, i) => (
          <polygon
            key={`diamond-${i}`}
            points={`${cx},${cy - s} ${cx + s * 0.6},${cy} ${cx},${cy + s} ${cx - s * 0.6},${cy}`}
            stroke={stroke}
            strokeWidth={1.5}
            fill="none"
          />
        ))}
      </g>
      {/* Horizontal accent lines – bottom */}
      <g opacity="0.08">
        {[0, 1, 2, 3, 4].map(i => (
          <line key={`hl-${i}`} x1={900} y1={480 + i * 20} x2={1440} y2={480 + i * 20} stroke={stroke} strokeWidth={1} />
        ))}
      </g>
    </>
  );
}

/* ── Emerald-Green: Hexagonal network + uptime pulses ── */
function EmeraldGreenPattern({ stroke }: { stroke: string }) {
  return (
    <>
      {/* Hexagonal grid pattern */}
      <g opacity="0.14">
        {[
          { cx: 200, cy: 120 }, { cx: 320, cy: 80 }, { cx: 440, cy: 140 },
          { cx: 160, cy: 260 }, { cx: 280, cy: 220 }, { cx: 400, cy: 280 },
          { cx: 1100, cy: 100 }, { cx: 1220, cy: 160 }, { cx: 1340, cy: 120 },
          { cx: 1060, cy: 240 }, { cx: 1180, cy: 300 }, { cx: 1300, cy: 260 },
        ].map(({ cx, cy }, i) => {
          const s = 28 + (i % 3) * 8;
          const pts = Array.from({ length: 6 }, (_, j) => {
            const a = (Math.PI / 3) * j - Math.PI / 6;
            return `${cx + s * Math.cos(a)},${cy + s * Math.sin(a)}`;
          }).join(" ");
          return <polygon key={i} points={pts} stroke={stroke} strokeWidth={1.2} fill="none" />;
        })}
      </g>
      {/* Connecting lines between hexagons */}
      <g opacity="0.08">
        {[
          [200, 120, 320, 80], [320, 80, 440, 140], [160, 260, 280, 220],
          [1100, 100, 1220, 160], [1220, 160, 1340, 120], [1060, 240, 1180, 300],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={1} strokeDasharray="4 4" />
        ))}
      </g>
      {/* Pulse rings – bottom center */}
      <g opacity="0.1">
        {[80, 140, 200, 260].map((r, i) => (
          <circle key={i} cx={720} cy={500} r={r} stroke={stroke} strokeWidth={1.5 - i * 0.2} fill="none" />
        ))}
      </g>
    </>
  );
}

/* ── Slate-Orange: Tool/gear shapes + dashed circuits ── */
function SlateOrangePattern({ stroke }: { stroke: string }) {
  const orangeAccent = "hsl(25, 85%, 60%)";
  return (
    <>
      {/* Dashed circuit lines */}
      <g opacity="0.12">
        {[0, 1, 2, 3, 4].map(i => (
          <path
            key={`circuit-${i}`}
            d={`M ${-20 + i * 60} 0 L ${-20 + i * 60} ${200 + i * 40} L ${180 + i * 60} ${200 + i * 40}`}
            stroke={stroke}
            strokeWidth={1}
            strokeDasharray="6 4"
            fill="none"
          />
        ))}
      </g>
      {/* Right-side angled circuits */}
      <g opacity="0.1">
        {[0, 1, 2, 3].map(i => (
          <path
            key={`rcircuit-${i}`}
            d={`M 1460 ${80 + i * 120} L ${1260 - i * 30} ${80 + i * 120} L ${1260 - i * 30} ${180 + i * 120}`}
            stroke={stroke}
            strokeWidth={1}
            strokeDasharray="6 4"
            fill="none"
          />
        ))}
      </g>
      {/* Gear-like circles with spokes */}
      <g opacity="0.15">
        {[
          { cx: 180, cy: 420, r: 35 },
          { cx: 1280, cy: 380, r: 28 },
          { cx: 1100, cy: 140, r: 22 },
        ].map(({ cx, cy, r }, i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} stroke={stroke} strokeWidth={1.5} fill="none" />
            <circle cx={cx} cy={cy} r={r * 0.5} stroke={stroke} strokeWidth={1} fill="none" />
            {[0, 45, 90, 135].map(deg => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line key={deg}
                  x1={cx + r * 0.5 * Math.cos(rad)} y1={cy + r * 0.5 * Math.sin(rad)}
                  x2={cx + r * Math.cos(rad)} y2={cy + r * Math.sin(rad)}
                  stroke={stroke} strokeWidth={1.2}
                />
              );
            })}
          </g>
        ))}
      </g>
      {/* Orange accent dots at circuit junctions */}
      <g opacity="0.25">
        {[
          [40, 200], [100, 240], [160, 280], [220, 320],
          [1260, 80], [1230, 200], [1200, 320], [1170, 440],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={3} fill={orangeAccent} />
        ))}
      </g>
    </>
  );
}

export default function HeroPatternBg({ theme }: { theme: HeroColorTheme }) {
  const t = themes[theme];

  return (
    <>
      <div className="absolute inset-0" style={{ background: t.bg }} />
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {theme === "blue-purple" && <BluePurplePattern stroke={t.stroke} />}
        {theme === "teal-cyan" && <TealCyanPattern stroke={t.stroke} />}
        {theme === "indigo-deep" && <IndigoDeepPattern stroke={t.stroke} />}
        {theme === "emerald-green" && <EmeraldGreenPattern stroke={t.stroke} />}
        {theme === "slate-orange" && <SlateOrangePattern stroke={t.stroke} />}

        <defs>
          <radialGradient id={`hero-glow-${theme}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.06" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="600" fill={`url(#hero-glow-${theme})`} />
      </svg>
    </>
  );
}

export type { HeroColorTheme };
