/**
 * Shared abstract volumetric pattern background for hero sections.
 * Each color theme has a unique pattern style.
 */

type HeroColorTheme = "blue-purple" | "teal-cyan" | "indigo-deep";

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
