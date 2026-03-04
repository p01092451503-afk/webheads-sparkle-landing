/**
 * Shared abstract volumetric pattern background for hero sections.
 * Each color theme has a unique pattern style.
 */

type HeroColorTheme = "blue-purple" | "teal-cyan" | "indigo-deep" | "rose-spring";

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
  "rose-spring": {
    bg: "linear-gradient(160deg, hsl(350, 65%, 94%) 0%, hsl(340, 55%, 90%) 25%, hsl(320, 45%, 91%) 50%, hsl(280, 40%, 93%) 75%, hsl(300, 35%, 95%) 100%)",
    stroke: "hsl(340, 45%, 45%)",
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

/* ── Rose-Spring: Sacred geometry flower-of-life inspired pattern ── */
function RoseSpringPattern({ stroke }: { stroke: string }) {
  // Generate flower-of-life petal paths (6 petals around a center)
  const flowerOfLife = (cx: number, cy: number, r: number) => {
    const petals: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 * Math.PI) / 180;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      petals.push(`M ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(Math.PI / 3)} ${cy + r * Math.sin(Math.PI / 3)}`);
    }
    return petals;
  };

  // Single flower rosette: 6 overlapping circles
  const Rosette = ({ cx, cy, r, op }: { cx: number; cy: number; r: number; op: number }) => (
    <g opacity={op}>
      <circle cx={cx} cy={cy} r={r} stroke={stroke} strokeWidth={1.5} fill="none" />
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle = (i * 60 * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r={r}
            stroke={stroke}
            strokeWidth={1.2}
            fill="none"
          />
        );
      })}
    </g>
  );

  return (
    <>
      {/* Main flower-of-life clusters */}
      <Rosette cx={200} cy={280} r={70} op={0.18} />
      <Rosette cx={1280} cy={320} r={80} op={0.15} />
      <Rosette cx={720} cy={480} r={50} op={0.12} />

      {/* Smaller accent rosettes */}
      <Rosette cx={450} cy={100} r={35} op={0.14} />
      <Rosette cx={1050} cy={120} r={40} op={0.13} />
      <Rosette cx={900} cy={520} r={30} op={0.10} />
      <Rosette cx={100} cy={500} r={25} op={0.12} />
      <Rosette cx={1400} cy={150} r={28} op={0.10} />

      {/* Flowing sacred curves connecting clusters */}
      <g opacity="0.16">
        {[0, 1, 2, 3].map(i => (
          <path
            key={`curve-${i}`}
            d={`M -20 ${120 + i * 120} C ${300 + i * 50} ${80 + i * 120} ${600 - i * 30} ${160 + i * 120} ${900 + i * 40} ${120 + i * 120} S ${1200 + i * 20} ${160 + i * 120} 1460 ${130 + i * 120}`}
            stroke={stroke}
            strokeWidth={1.4}
            fill="none"
          />
        ))}
      </g>

      {/* Scattered seed-of-life dots */}
      <g opacity="0.20">
        {[
          [320, 180], [580, 300], [160, 420], [440, 500], [680, 140],
          [850, 350], [1000, 450], [1150, 220], [1350, 480], [50, 150],
          [750, 60], [1100, 550], [380, 380], [960, 180], [1220, 100],
        ].map(([cx, cy], i) => (
          <circle key={`seed-${i}`} cx={cx} cy={cy} r={3 + (i % 4)} fill={stroke} fillOpacity={0.5} />
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
        {theme === "rose-spring" && <RoseSpringPattern stroke={t.stroke} />}

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
