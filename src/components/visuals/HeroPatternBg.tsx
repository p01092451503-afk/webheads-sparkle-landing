/**
 * Shared abstract volumetric pattern background for hero sections.
 * Uses 3 color themes rotated across pages.
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

export default function HeroPatternBg({ theme }: { theme: HeroColorTheme }) {
  const t = themes[theme];

  return (
    <>
      {/* Background */}
      <div className="absolute inset-0" style={{ background: t.bg }} />

      {/* SVG patterns */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Left concentric arcs */}
        <g opacity="0.18">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <circle
              key={`l-${i}`}
              cx={-80 + i * 8}
              cy={380 + i * 5}
              r={120 + i * 55}
              stroke={t.stroke}
              strokeWidth={2.5 - i * 0.15}
              fill="none"
            />
          ))}
        </g>

        {/* Right concentric arcs */}
        <g opacity="0.12">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <circle
              key={`r-${i}`}
              cx={1480 - i * 10}
              cy={480 + i * 8}
              r={100 + i * 60}
              stroke={t.stroke}
              strokeWidth={2 - i * 0.12}
              fill="none"
            />
          ))}
        </g>

        {/* Top-right flowing arcs */}
        <g opacity="0.1">
          {[0, 1, 2, 3].map(i => (
            <path
              key={`tr-${i}`}
              d={`M ${1100 + i * 40} ${-20 + i * 15} Q ${1300 + i * 20} ${100 + i * 30} 1460 ${60 + i * 50}`}
              stroke={t.stroke}
              strokeWidth={2}
              fill="none"
            />
          ))}
        </g>

        {/* Radial glow */}
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
