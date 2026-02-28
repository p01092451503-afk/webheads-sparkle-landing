/**
 * Premium animated pattern overlay exclusive to the LMS hero section.
 * Features: pulsing radar rings, flowing neural network lines, and particle dots.
 */
export default function LmsHeroOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <style>{`
        @keyframes lms-radar-ping {
          0% { transform: scale(0.3); opacity: 0.6; }
          70% { opacity: 0.15; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes lms-radar-ping2 {
          0% { transform: scale(0.2); opacity: 0.5; }
          70% { opacity: 0.1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes lms-neural-flow {
          0% { stroke-dashoffset: 800; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes lms-neural-flow-rev {
          0% { stroke-dashoffset: -600; }
          100% { stroke-dashoffset: 200; }
        }
        @keyframes lms-particle-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-18px) scale(1.3); opacity: 0.9; }
        }
        @keyframes lms-glow-pulse {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.18; }
        }
        @keyframes lms-orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 700"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ── Radar rings from center ── */}
        <g opacity="0.35">
          {[0, 1, 2, 3].map(i => (
            <circle
              key={`radar-${i}`}
              cx="720" cy="350"
              r={120 + i * 90}
              stroke="white"
              strokeWidth={1.2 - i * 0.2}
              fill="none"
              style={{
                transformOrigin: "720px 350px",
                animation: `lms-radar-ping ${3.5 + i * 0.8}s ease-out infinite`,
                animationDelay: `${i * 0.9}s`,
              }}
            />
          ))}
        </g>

        {/* ── Secondary radar from bottom-left ── */}
        <g opacity="0.2">
          {[0, 1, 2].map(i => (
            <circle
              key={`radar2-${i}`}
              cx="180" cy="580"
              r={80 + i * 70}
              stroke="hsl(210, 100%, 80%)"
              strokeWidth={0.8}
              fill="none"
              style={{
                transformOrigin: "180px 580px",
                animation: `lms-radar-ping2 ${4 + i * 1}s ease-out infinite`,
                animationDelay: `${i * 1.2}s`,
              }}
            />
          ))}
        </g>

        {/* ── Neural network flowing curves ── */}
        <g opacity="0.18">
          {[
            "M -20 200 Q 300 100, 600 250 T 1200 180 T 1500 300",
            "M -40 400 Q 250 320, 520 420 T 1000 350 T 1460 450",
            "M 100 600 Q 400 500, 720 550 T 1100 480 T 1480 560",
            "M -30 80 Q 360 180, 700 120 T 1150 220 T 1500 150",
          ].map((d, i) => (
            <path
              key={`neural-${i}`}
              d={d}
              stroke={i % 2 === 0 ? "hsl(230, 100%, 85%)" : "hsl(260, 80%, 80%)"}
              strokeWidth={1.5 - i * 0.15}
              fill="none"
              strokeDasharray="12 8"
              style={{
                animation: `${i % 2 === 0 ? "lms-neural-flow" : "lms-neural-flow-rev"} ${8 + i * 2}s linear infinite`,
              }}
            />
          ))}
        </g>

        {/* ── Orbiting ring ── */}
        <g style={{ transformOrigin: "720px 350px", animation: "lms-orbit 30s linear infinite" }} opacity="0.12">
          <ellipse cx="720" cy="350" rx="380" ry="160" stroke="white" strokeWidth="0.8" fill="none" strokeDasharray="6 10" />
        </g>
        <g style={{ transformOrigin: "720px 350px", animation: "lms-orbit 45s linear infinite reverse" }} opacity="0.08">
          <ellipse cx="720" cy="350" rx="500" ry="200" stroke="hsl(250, 80%, 75%)" strokeWidth="0.6" fill="none" strokeDasharray="4 12" />
        </g>

        {/* ── Floating particle dots ── */}
        {[
          { cx: 200, cy: 150, r: 2.5, delay: 0 },
          { cx: 450, cy: 100, r: 2, delay: 0.5 },
          { cx: 680, cy: 200, r: 3, delay: 1 },
          { cx: 900, cy: 120, r: 2, delay: 1.5 },
          { cx: 1100, cy: 180, r: 2.5, delay: 0.8 },
          { cx: 1300, cy: 250, r: 2, delay: 1.2 },
          { cx: 350, cy: 500, r: 2.5, delay: 0.3 },
          { cx: 600, cy: 550, r: 2, delay: 1.8 },
          { cx: 850, cy: 480, r: 3, delay: 0.6 },
          { cx: 1050, cy: 520, r: 2, delay: 1.4 },
          { cx: 1250, cy: 450, r: 2.5, delay: 2 },
          { cx: 150, cy: 350, r: 2, delay: 0.9 },
          { cx: 1350, cy: 380, r: 2.5, delay: 1.6 },
          { cx: 500, cy: 320, r: 1.8, delay: 2.2 },
          { cx: 980, cy: 300, r: 2.2, delay: 0.4 },
        ].map((p, i) => (
          <circle
            key={`particle-${i}`}
            cx={p.cx} cy={p.cy} r={p.r}
            fill="white"
            style={{
              animation: `lms-particle-float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* ── Central glow ── */}
        <defs>
          <radialGradient id="lms-center-glow" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stopColor="hsl(250, 80%, 70%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="700" fill="url(#lms-center-glow)" style={{ animation: "lms-glow-pulse 5s ease-in-out infinite" }} />
      </svg>
    </div>
  );
}
