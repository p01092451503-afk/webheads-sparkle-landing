/**
 * LMS-exclusive hero background + pattern.
 * Does NOT use the shared HeroPatternBg — fully custom gradient + animated radar ripples.
 * Other pages use concentric arcs / wave lines / grid diamonds via HeroPatternBg.
 * LMS uses expanding radar rings + glowing sweep + hexagonal nodes for a tech-forward feel.
 */
export default function LmsHeroOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* ── Custom gradient background (replaces HeroPatternBg) ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 30% 100%, hsl(235, 75%, 55%) 0%, hsl(245, 70%, 48%) 40%, hsl(250, 68%, 42%) 70%, hsl(240, 72%, 38%) 100%)",
        }}
      />

      <style>{`
        @keyframes lms-ripple-expand {
          0% { r: 80; opacity: 0.28; }
          100% { r: 900; opacity: 0; }
        }
        @keyframes lms-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes lms-node-pulse {
          0%, 100% { opacity: 0.4; r: 2.5; }
          50% { opacity: 0.8; r: 4; }
        }
      `}</style>

      {/* ── Expanding radar ripples from bottom-left ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <radialGradient id="lms-rg" cx="0%" cy="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.06" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <rect width="1440" height="700" fill="url(#lms-rg)" />

        {/* Static concentric rings — bottom-left origin */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <circle
            key={`static-${i}`}
            cx={-60}
            cy={760}
            r={140 + i * 100}
            stroke="white"
            strokeWidth={1.2 - i * 0.06}
            fill="none"
            opacity={0.22 - i * 0.015}
          />
        ))}

        {/* Animated expanding ripples — bottom-left */}
        {[0, 1, 2].map((i) => (
          <circle
            key={`ripple-${i}`}
            cx={-60}
            cy={760}
            r={80}
            stroke="white"
            strokeWidth={1}
            fill="none"
            style={{
              animation: "lms-ripple-expand 6s ease-out infinite",
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}

        {/* Secondary static arcs — top-right origin */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle
            key={`tr-${i}`}
            cx={1500}
            cy={-60}
            r={160 + i * 95}
            stroke="white"
            strokeWidth={0.8}
            fill="none"
            opacity={0.12 - i * 0.015}
          />
        ))}

        {/* Radar sweep line from bottom-left */}
        <g
          style={{
            transformOrigin: "-60px 760px",
            animation: "lms-sweep 12s linear infinite",
          }}
        >
          <line
            x1={-60}
            y1={760}
            x2={-60 + 1000}
            y2={760 - 600}
            stroke="white"
            strokeWidth={0.6}
            opacity={0.08}
          />
          <line
            x1={-60}
            y1={760}
            x2={-60 + 900}
            y2={760 - 700}
            stroke="white"
            strokeWidth={1.5}
            opacity={0.04}
          />
        </g>

        {/* Scattered hexagonal nodes — tech network feel */}
        {[
          [320, 120], [580, 280], [780, 100], [1050, 220],
          [420, 450], [900, 380], [1200, 150], [680, 520],
          [200, 300], [1100, 480], [500, 180], [1300, 350],
          [150, 520], [850, 180], [1000, 560], [350, 350],
        ].map(([cx, cy], i) => (
          <circle
            key={`node-${i}`}
            cx={cx}
            cy={cy}
            r={2.5}
            fill="white"
            style={{
              animation: `lms-node-pulse ${3 + (i % 4) * 0.8}s ease-in-out infinite`,
              animationDelay: `${(i * 0.4) % 3}s`,
            }}
          />
        ))}

        {/* Connecting lines between some nodes */}
        <g opacity="0.06" stroke="white" strokeWidth="0.8">
          <line x1={320} y1={120} x2={580} y2={280} />
          <line x1={580} y1={280} x2={780} y2={100} />
          <line x1={780} y1={100} x2={1050} y2={220} />
          <line x1={900} y1={380} x2={1050} y2={220} />
          <line x1={420} y1={450} x2={680} y2={520} />
          <line x1={200} y1={300} x2={350} y2={350} />
          <line x1={350} y1={350} x2={500} y2={180} />
          <line x1={1100} y1={480} x2={1200} y2={150} />
          <line x1={850} y1={180} x2={1000} y2={560} />
        </g>
      </svg>
    </div>
  );
}
