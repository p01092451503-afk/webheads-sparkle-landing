/**
 * LMS-exclusive animated hero overlay — concentric arcs radiating from bottom-left
 * plus a secondary arc cluster from top-right, matching the premium reference design.
 * Completely unique compared to other service pages.
 */
export default function LmsHeroOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes lms-arc-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes lms-dot-drift {
          0% { transform: translate(0, 0); opacity: 0.7; }
          50% { transform: translate(8px, -12px); opacity: 0.3; }
          100% { transform: translate(0, 0); opacity: 0.7; }
        }
      `}</style>

      {/* ── Primary concentric arcs from bottom-left ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 700"
        preserveAspectRatio="xMinYMax slice"
        fill="none"
      >
        <defs>
          <linearGradient id="lms-arc-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsla(230, 80%, 75%, 0.35)" />
            <stop offset="100%" stopColor="hsla(250, 70%, 65%, 0.08)" />
          </linearGradient>
        </defs>

        {/* Bottom-left arcs — 8 concentric circles */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle
            key={`bl-${i}`}
            cx={-80}
            cy={780}
            r={200 + i * 120}
            stroke="url(#lms-arc-grad)"
            strokeWidth={1.2 - i * 0.06}
            fill="none"
            opacity={0.5 - i * 0.04}
            style={{
              animation: `lms-arc-pulse ${6 + i * 0.8}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </svg>

      {/* ── Secondary arcs from top-right ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 700"
        preserveAspectRatio="xMaxYMin slice"
        fill="none"
      >
        <defs>
          <linearGradient id="lms-arc-grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsla(220, 85%, 70%, 0.25)" />
            <stop offset="100%" stopColor="hsla(260, 60%, 60%, 0.05)" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle
            key={`tr-${i}`}
            cx={1520}
            cy={-80}
            r={180 + i * 110}
            stroke="url(#lms-arc-grad2)"
            strokeWidth={1.0 - i * 0.08}
            fill="none"
            opacity={0.35 - i * 0.04}
            style={{
              animation: `lms-arc-pulse ${7 + i * 0.6}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </svg>

      {/* ── Subtle floating dots ── */}
      {[
        { x: "65%", y: "75%", size: 3, delay: "0s", dur: "5s" },
        { x: "80%", y: "60%", size: 2, delay: "1.5s", dur: "6s" },
        { x: "45%", y: "85%", size: 2.5, delay: "0.8s", dur: "4.5s" },
      ].map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: d.size,
            height: d.size,
            left: d.x,
            top: d.y,
            background: "hsla(0, 0%, 100%, 0.5)",
            animation: `lms-dot-drift ${d.dur} ease-in-out infinite`,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}
