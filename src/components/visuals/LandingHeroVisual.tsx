export default function LandingHeroVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <style>{`
        @keyframes lh-float-a { 0%,100%{transform:translateY(0px) rotate(-7deg);} 50%{transform:translateY(-14px) rotate(-7deg);} }
        @keyframes lh-float-b { 0%,100%{transform:translateY(0px) rotate(5deg);} 50%{transform:translateY(-10px) rotate(5deg);} }
        @keyframes lh-float-c { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
        @keyframes lh-float-d { 0%,100%{transform:translateY(0px) rotate(9deg);} 50%{transform:translateY(-16px) rotate(9deg);} }
        @keyframes lh-float-e { 0%,100%{transform:translateY(0px) rotate(-4deg);} 50%{transform:translateY(-9px) rotate(-4deg);} }
        @keyframes lh-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(1.3);} }
        @keyframes lh-orbit { 0%{transform:rotate(0deg) translateX(140px) rotate(0deg);} 100%{transform:rotate(360deg) translateX(140px) rotate(-360deg);} }
      `}</style>

      <div style={{ width: 460, height: 460, position: "relative", perspective: "900px" }}>

        {/* ── Central Hub Card ── */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%) rotateX(8deg) rotateY(-12deg) rotateZ(2deg)",
          width: 200, height: 200,
          borderRadius: 32,
          background: "linear-gradient(145deg, hsl(220,60%,10%), hsl(220,55%,6%))",
          boxShadow: "0 30px 60px rgba(30,60,120,0.4), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 8,
        }}>
          {/* Logo text */}
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>웹헤즈</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>부가서비스 통합</div>
          
          {/* Connecting dots around */}
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            {["#60a5fa", "#34d399", "#a78bfa", "#f97316", "#f43f5e", "#facc15", "#06b6d4", "#ec4899"].map((c, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: c, boxShadow: `0 0 6px ${c}`,
                animation: `lh-pulse 2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
          </div>

          {/* Shine overlay */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 32, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)", pointerEvents: "none" }} />
        </div>

        {/* ── Floating Service Icons ── */}

        {/* 1. Server / Hosting */}
        <div style={{ position: "absolute", left: "8%", top: "6%", animation: "lh-float-a 3.8s ease-in-out infinite", filter: "drop-shadow(0 12px 20px rgba(30,80,200,0.3))" }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <defs><linearGradient id="lh-g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#2563eb"/></linearGradient></defs>
            <rect width="64" height="64" rx="18" fill="url(#lh-g1)"/>
            <rect x="16" y="14" width="32" height="8" rx="3" fill="rgba(255,255,255,0.85)"/>
            <rect x="16" y="26" width="32" height="8" rx="3" fill="rgba(255,255,255,0.6)"/>
            <rect x="16" y="38" width="32" height="8" rx="3" fill="rgba(255,255,255,0.4)"/>
            <circle cx="42" cy="18" r="2" fill="#22c55e"/>
            <circle cx="42" cy="30" r="2" fill="#22c55e"/>
            <circle cx="42" cy="42" r="2" fill="#facc15"/>
          </svg>
        </div>

        {/* 2. Maintenance / Wrench */}
        <div style={{ position: "absolute", left: "36%", top: "0%", animation: "lh-float-c 4.2s ease-in-out infinite", animationDelay: "0.3s", filter: "drop-shadow(0 10px 18px rgba(30,160,80,0.3))" }}>
          <svg width="56" height="56" viewBox="0 0 56 56">
            <defs><linearGradient id="lh-g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#059669"/></linearGradient></defs>
            <rect width="56" height="56" rx="16" fill="url(#lh-g2)"/>
            <path d="M35 18a9 9 0 00-12.7 6.3l-5.3 5.3a3 3 0 004.2 4.2l5.3-5.3A9 9 0 0035 18z" fill="rgba(255,255,255,0.85)" strokeLinecap="round"/>
            <circle cx="33" cy="23" r="3" fill="rgba(255,255,255,0.5)"/>
          </svg>
        </div>

        {/* 3. AI Chatbot */}
        <div style={{ position: "absolute", right: "6%", top: "8%", animation: "lh-float-d 4.5s ease-in-out infinite", animationDelay: "0.6s", filter: "drop-shadow(0 12px 20px rgba(120,60,220,0.3))" }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <defs><linearGradient id="lh-g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs>
            <rect width="64" height="64" rx="18" fill="url(#lh-g3)"/>
            <rect x="14" y="18" width="36" height="24" rx="8" fill="rgba(255,255,255,0.85)"/>
            <circle cx="26" cy="30" r="3" fill="#7c3aed"/>
            <circle cx="38" cy="30" r="3" fill="#7c3aed"/>
            <path d="M20 42l6-4h12l6 4" fill="rgba(255,255,255,0.85)"/>
          </svg>
        </div>

        {/* 4. App / Smartphone */}
        <div style={{ position: "absolute", right: "2%", top: "38%", animation: "lh-float-b 3.6s ease-in-out infinite", animationDelay: "0.9s", filter: "drop-shadow(0 10px 18px rgba(120,40,180,0.3))" }}>
          <svg width="52" height="68" viewBox="0 0 52 68">
            <defs><linearGradient id="lh-g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#c084fc"/><stop offset="100%" stopColor="#9333ea"/></linearGradient></defs>
            <rect x="4" y="2" width="44" height="64" rx="10" fill="url(#lh-g4)"/>
            <rect x="8" y="8" width="36" height="46" rx="6" fill="rgba(255,255,255,0.15)"/>
            <rect x="12" y="14" width="28" height="4" rx="2" fill="rgba(255,255,255,0.7)"/>
            <rect x="12" y="22" width="20" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>
            <rect x="12" y="30" width="24" height="16" rx="4" fill="rgba(255,255,255,0.3)"/>
            <circle cx="26" cy="60" r="3" fill="rgba(255,255,255,0.5)"/>
          </svg>
        </div>

        {/* 5. DRM / Shield */}
        <div style={{ position: "absolute", right: "8%", bottom: "10%", animation: "lh-float-e 4.1s ease-in-out infinite", animationDelay: "1.2s", filter: "drop-shadow(0 10px 18px rgba(30,160,100,0.3))" }}>
          <svg width="56" height="62" viewBox="0 0 56 62">
            <defs><linearGradient id="lh-g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#047857"/></linearGradient></defs>
            <path d="M28 4L52 14V32Q52 50 28 58Q4 50 4 32V14Z" fill="url(#lh-g5)"/>
            <polyline points="18,32 26,40 40,24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* 6. Channel/SMS */}
        <div style={{ position: "absolute", left: "2%", bottom: "14%", animation: "lh-float-c 4.4s ease-in-out infinite", animationDelay: "1.5s", filter: "drop-shadow(0 12px 20px rgba(200,120,20,0.3))" }}>
          <svg width="58" height="58" viewBox="0 0 58 58">
            <defs><linearGradient id="lh-g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#d97706"/></linearGradient></defs>
            <rect width="58" height="58" rx="16" fill="url(#lh-g6)"/>
            <path d="M14 16h24a3 3 0 013 3v14a3 3 0 01-3 3H26l-6 5v-5h-6a3 3 0 01-3-3V19a3 3 0 013-3z" fill="rgba(255,255,255,0.85)"/>
            <circle cx="21" cy="26" r="2" fill="#d97706"/>
            <circle cx="29" cy="26" r="2" fill="#d97706"/>
            <circle cx="37" cy="26" r="2" fill="#d97706"/>
          </svg>
        </div>

        {/* 7. PG / Credit Card */}
        <div style={{ position: "absolute", left: "4%", top: "40%", animation: "lh-float-a 4s ease-in-out infinite", animationDelay: "1.8s", filter: "drop-shadow(0 10px 18px rgba(6,150,140,0.3))" }}>
          <svg width="62" height="44" viewBox="0 0 62 44">
            <defs><linearGradient id="lh-g7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#0e7490"/></linearGradient></defs>
            <rect width="62" height="44" rx="10" fill="url(#lh-g7)"/>
            <rect x="0" y="10" width="62" height="8" fill="rgba(0,0,0,0.15)"/>
            <rect x="8" y="26" width="20" height="4" rx="2" fill="rgba(255,255,255,0.6)"/>
            <rect x="8" y="33" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.35)"/>
            <rect x="42" y="28" width="12" height="8" rx="3" fill="rgba(255,255,255,0.5)"/>
          </svg>
        </div>

        {/* 8. Content / Film */}
        <div style={{ position: "absolute", left: "30%", bottom: "2%", animation: "lh-float-b 3.9s ease-in-out infinite", animationDelay: "2.1s", filter: "drop-shadow(0 10px 18px rgba(220,50,80,0.3))" }}>
          <svg width="58" height="58" viewBox="0 0 58 58">
            <defs><linearGradient id="lh-g8" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f43f5e"/><stop offset="100%" stopColor="#be123c"/></linearGradient></defs>
            <rect width="58" height="58" rx="16" fill="url(#lh-g8)"/>
            {/* Film strip */}
            <rect x="10" y="14" width="38" height="30" rx="4" fill="rgba(255,255,255,0.2)"/>
            {/* Play button */}
            <polygon points="24,22 24,38 38,30" fill="rgba(255,255,255,0.85)"/>
            {/* Film holes */}
            {[14,20,26,32,38].map((y) => (
              <g key={y}>
                <rect x="12" y={y} width="4" height="3" rx="1" fill="rgba(255,255,255,0.4)"/>
                <rect x="42" y={y} width="4" height="3" rx="1" fill="rgba(255,255,255,0.4)"/>
              </g>
            ))}
          </svg>
        </div>

        {/* ── Connecting Lines (subtle) ── */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 460 460">
          <defs>
            <radialGradient id="lh-line-fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(214,90%,52%)" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="hsl(214,90%,52%)" stopOpacity="0"/>
            </radialGradient>
          </defs>
          {/* Subtle orbital ring */}
          <circle cx="230" cy="230" r="160" fill="none" stroke="hsl(214,90%,52%)" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 8"/>
          <circle cx="230" cy="230" r="120" fill="none" stroke="hsl(214,90%,52%)" strokeWidth="0.5" strokeOpacity="0.06" strokeDasharray="3 6"/>
        </svg>

      </div>
    </div>
  );
}
