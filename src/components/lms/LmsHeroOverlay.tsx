/**
 * LMS-exclusive animated hero overlay with floating particles, glowing orbs,
 * and subtle grid. Differentiates LMS from other service pages that use plain HeroPatternBg.
 */
export default function LmsHeroOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes lms-orb-float-1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.1)} }
        @keyframes lms-orb-float-2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,15px) scale(0.9)} }
        @keyframes lms-orb-float-3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,25px)} }
        @keyframes lms-particle-rise { 0%{transform:translateY(0) scale(1);opacity:0.6} 100%{transform:translateY(-120px) scale(0.3);opacity:0} }
        @keyframes lms-grid-pulse { 0%,100%{opacity:0.04} 50%{opacity:0.08} }
        @keyframes lms-shimmer { 0%{transform:translateX(-100%) rotate(12deg)} 100%{transform:translateX(200%) rotate(12deg)} }
      `}</style>

      {/* Animated grid lines — unique to LMS */}
      <svg className="absolute inset-0 w-full h-full" style={{ animation: "lms-grid-pulse 6s ease-in-out infinite" }}>
        <defs>
          <pattern id="lms-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lms-grid)" />
      </svg>

      {/* Glowing orbs */}
      <div
        className="absolute rounded-full"
        style={{
          width: 280, height: 280,
          top: "10%", left: "5%",
          background: "radial-gradient(circle, hsla(260, 80%, 70%, 0.15) 0%, transparent 70%)",
          animation: "lms-orb-float-1 8s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 220, height: 220,
          top: "20%", right: "8%",
          background: "radial-gradient(circle, hsla(210, 90%, 65%, 0.12) 0%, transparent 70%)",
          animation: "lms-orb-float-2 10s ease-in-out infinite",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 160, height: 160,
          bottom: "15%", left: "30%",
          background: "radial-gradient(circle, hsla(192, 80%, 60%, 0.1) 0%, transparent 70%)",
          animation: "lms-orb-float-3 7s ease-in-out infinite",
          filter: "blur(35px)",
        }}
      />

      {/* Rising particles */}
      {[
        { left: "15%", delay: "0s", dur: "4s", size: 3 },
        { left: "35%", delay: "1.2s", dur: "5s", size: 2 },
        { left: "55%", delay: "0.6s", dur: "4.5s", size: 4 },
        { left: "72%", delay: "2s", dur: "3.8s", size: 2.5 },
        { left: "88%", delay: "0.8s", dur: "5.5s", size: 3 },
        { left: "25%", delay: "3s", dur: "4.2s", size: 2 },
        { left: "65%", delay: "1.5s", dur: "4.8s", size: 3.5 },
        { left: "45%", delay: "2.5s", dur: "5.2s", size: 2 },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            bottom: "10%",
            left: p.left,
            background: "white",
            animation: `lms-particle-rise ${p.dur} ease-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Shimmer line across hero */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: 0,
            width: "40%",
            height: 1,
            background: "linear-gradient(90deg, transparent, hsla(0,0%,100%,0.2), transparent)",
            animation: "lms-shimmer 8s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
