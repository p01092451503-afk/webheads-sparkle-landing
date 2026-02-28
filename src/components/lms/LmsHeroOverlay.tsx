/**
 * LMS-exclusive hero overlay — 3D perspective grid with depth layers,
 * animated neural-network nodes, and volumetric light beams.
 * Completely different from the flat SVG patterns used on other service pages.
 */
export default function LmsHeroOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes lms-grid-scroll { 0%{transform:perspective(600px) rotateX(55deg) translateY(0)} 100%{transform:perspective(600px) rotateX(55deg) translateY(80px)} }
        @keyframes lms-node-pulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.6)} }
        @keyframes lms-beam-sweep { 0%{opacity:0;transform:translateX(-120%) scaleX(0.6) rotate(-8deg)} 40%{opacity:0.25} 100%{opacity:0;transform:translateX(220%) scaleX(0.6) rotate(-8deg)} }
        @keyframes lms-ring-expand { 0%{transform:translate(-50%,-50%) scale(0.3);opacity:0.5} 100%{transform:translate(-50%,-50%) scale(1.8);opacity:0} }
        @keyframes lms-orb-drift-1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(40px,-25px)} 66%{transform:translate(-20px,15px)} }
        @keyframes lms-orb-drift-2 { 0%,100%{transform:translate(0,0)} 40%{transform:translate(-35px,20px)} 70%{transform:translate(25px,-10px)} }
        @keyframes lms-line-draw { 0%{stroke-dashoffset:200} 50%{stroke-dashoffset:0} 100%{stroke-dashoffset:-200} }
        @keyframes lms-hex-rotate { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>

      {/* ═══ Layer 1: 3D Perspective Grid — scrolling into the horizon ═══ */}
      <div
        className="absolute w-[200%] h-[200%]"
        style={{
          bottom: "-60%",
          left: "-50%",
          transformOrigin: "center top",
          animation: "lms-grid-scroll 4s linear infinite",
        }}
      >
        <svg width="100%" height="100%" style={{ opacity: 0.12 }}>
          <defs>
            <pattern id="lms-3d-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lms-3d-grid)" />
        </svg>
      </div>

      {/* ═══ Layer 2: Neural network constellation ═══ */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="lms-node-glow">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connection lines with animated dash */}
        {[
          { x1: 120, y1: 140, x2: 340, y2: 90 },
          { x1: 340, y1: 90, x2: 520, y2: 200 },
          { x1: 520, y1: 200, x2: 780, y2: 120 },
          { x1: 780, y1: 120, x2: 1020, y2: 180 },
          { x1: 1020, y1: 180, x2: 1280, y2: 80 },
          { x1: 1280, y1: 80, x2: 1400, y2: 160 },
          { x1: 200, y1: 450, x2: 440, y2: 500 },
          { x1: 440, y1: 500, x2: 680, y2: 420 },
          { x1: 680, y1: 420, x2: 920, y2: 480 },
          { x1: 920, y1: 480, x2: 1200, y2: 440 },
          { x1: 340, y1: 90, x2: 440, y2: 500 },
          { x1: 780, y1: 120, x2: 680, y2: 420 },
          { x1: 1020, y1: 180, x2: 920, y2: 480 },
        ].map((l, i) => (
          <line
            key={`line-${i}`}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="white"
            strokeWidth="0.6"
            opacity="0.15"
            strokeDasharray="6 8"
            style={{
              animation: `lms-line-draw ${3 + (i % 3)}s linear infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* Nodes with pulse */}
        {[
          { cx: 120, cy: 140, r: 3, delay: 0 },
          { cx: 340, cy: 90, r: 4, delay: 0.5 },
          { cx: 520, cy: 200, r: 3, delay: 1.0 },
          { cx: 780, cy: 120, r: 5, delay: 0.3 },
          { cx: 1020, cy: 180, r: 3.5, delay: 0.8 },
          { cx: 1280, cy: 80, r: 4, delay: 1.2 },
          { cx: 1400, cy: 160, r: 3, delay: 0.6 },
          { cx: 200, cy: 450, r: 3, delay: 1.5 },
          { cx: 440, cy: 500, r: 4, delay: 0.2 },
          { cx: 680, cy: 420, r: 5, delay: 0.9 },
          { cx: 920, cy: 480, r: 3.5, delay: 1.1 },
          { cx: 1200, cy: 440, r: 4, delay: 0.4 },
        ].map((n, i) => (
          <g key={`node-${i}`}>
            <circle cx={n.cx} cy={n.cy} r={n.r * 4} fill="url(#lms-node-glow)" opacity="0.3"
              style={{ animation: `lms-node-pulse ${2.5 + (i % 3) * 0.5}s ease-in-out infinite`, animationDelay: `${n.delay}s`, transformOrigin: `${n.cx}px ${n.cy}px` }}
            />
            <circle cx={n.cx} cy={n.cy} r={n.r} fill="white" opacity="0.7"
              style={{ animation: `lms-node-pulse ${2.5 + (i % 3) * 0.5}s ease-in-out infinite`, animationDelay: `${n.delay}s`, transformOrigin: `${n.cx}px ${n.cy}px` }}
            />
          </g>
        ))}
      </svg>

      {/* ═══ Layer 3: Expanding rings — center focal point ═══ */}
      {[0, 1, 2].map(i => (
        <div
          key={`ring-${i}`}
          className="absolute rounded-full"
          style={{
            top: "45%", left: "50%",
            width: 300, height: 300,
            border: "1px solid rgba(255,255,255,0.08)",
            animation: `lms-ring-expand ${4 + i}s ease-out infinite`,
            animationDelay: `${i * 1.3}s`,
          }}
        />
      ))}

      {/* ═══ Layer 4: Volumetric light beam ═══ */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "15%", left: 0,
            width: "35%", height: "70%",
            background: "linear-gradient(90deg, transparent 0%, hsla(255,80%,80%,0.06) 30%, hsla(210,90%,70%,0.08) 50%, hsla(255,80%,80%,0.06) 70%, transparent 100%)",
            animation: "lms-beam-sweep 10s ease-in-out infinite",
            filter: "blur(20px)",
          }}
        />
      </div>

      {/* ═══ Layer 5: Floating orbs with depth ═══ */}
      <div className="absolute rounded-full" style={{
        width: 200, height: 200, top: "5%", left: "8%",
        background: "radial-gradient(circle, hsla(260,85%,70%,0.12) 0%, transparent 65%)",
        animation: "lms-orb-drift-1 12s ease-in-out infinite", filter: "blur(30px)",
      }} />
      <div className="absolute rounded-full" style={{
        width: 260, height: 260, top: "15%", right: "5%",
        background: "radial-gradient(circle, hsla(210,90%,68%,0.1) 0%, transparent 65%)",
        animation: "lms-orb-drift-2 15s ease-in-out infinite", filter: "blur(45px)",
      }} />
      <div className="absolute rounded-full" style={{
        width: 180, height: 180, bottom: "10%", left: "25%",
        background: "radial-gradient(circle, hsla(192,80%,60%,0.08) 0%, transparent 65%)",
        animation: "lms-orb-drift-1 10s ease-in-out infinite", animationDelay: "3s", filter: "blur(35px)",
      }} />

      {/* ═══ Layer 6: Rotating hexagonal wireframe accents ═══ */}
      <svg className="absolute" style={{ top: "8%", right: "12%", width: 80, height: 80, opacity: 0.08, animation: "lms-hex-rotate 20s linear infinite" }} viewBox="0 0 80 80">
        <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="none" stroke="white" strokeWidth="1" />
        <polygon points="40,14 62,26 62,54 40,66 18,54 18,26" fill="none" stroke="white" strokeWidth="0.6" />
      </svg>
      <svg className="absolute" style={{ bottom: "12%", left: "10%", width: 60, height: 60, opacity: 0.06, animation: "lms-hex-rotate 25s linear infinite reverse" }} viewBox="0 0 80 80">
        <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="none" stroke="white" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
