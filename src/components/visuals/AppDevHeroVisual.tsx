export default function AppDevHeroVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <style>{`
        @keyframes app-float-a { 0%,100%{transform:translateY(0px) rotate(-10deg);} 50%{transform:translateY(-14px) rotate(-10deg);} }
        @keyframes app-float-b { 0%,100%{transform:translateY(0px) rotate(7deg);} 50%{transform:translateY(-11px) rotate(7deg);} }
        @keyframes app-float-c { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-13px);} }
        @keyframes app-float-d { 0%,100%{transform:translateY(0px) rotate(-5deg);} 50%{transform:translateY(-9px) rotate(-5deg);} }
        @keyframes app-float-e { 0%,100%{transform:translateY(0px) rotate(12deg);} 50%{transform:translateY(-15px) rotate(12deg);} }
        @keyframes app-pulse { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
        @keyframes app-bar { 0%{width:20%;} 50%{width:75%;} 100%{width:20%;} }
      `}</style>

      <div style={{ width: 420, height: 420, position: "relative", perspective: "900px" }}>

        {/* ── Main Card: Phone mockup ── */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -48%) rotateX(8deg) rotateY(-16deg) rotateZ(3deg)",
          width: 150, height: 280,
          borderRadius: 28,
          background: "linear-gradient(160deg, hsl(245,20%,96%) 0%, hsl(245,15%,88%) 100%)",
          boxShadow: "0 32px 70px rgba(80,50,200,0.32), 0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
          overflow: "hidden",
        }}>
          {/* notch */}
          <div style={{ width: 56, height: 12, background: "hsl(245,15%,82%)", borderRadius: "0 0 12px 12px", margin: "0 auto" }} />
          {/* screen */}
          <div style={{ margin: "8px 10px 0", borderRadius: 16, overflow: "hidden", background: "linear-gradient(145deg, hsl(245,80%,18%), hsl(245,90%,12%))", height: 220 }}>
            {/* App header */}
            <div style={{ padding: "10px 12px 6px", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,hsl(245,80%,65%),hsl(245,70%,50%))" }} />
              <div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>LMS App</div>
                <div style={{ fontSize: 6, color: "rgba(255,255,255,0.4)" }}>학습 현황</div>
              </div>
              <div style={{ marginLeft: "auto", width: 18, height: 10, borderRadius: 4, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ animation: "app-pulse 1.5s ease-in-out infinite", width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
              </div>
            </div>
            {/* progress card */}
            <div style={{ margin: "4px 8px", background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 10px" }}>
              <div style={{ fontSize: 7, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>이번 주 학습 진도</div>
              <div style={{ fontSize: 16, color: "#fff", fontWeight: 800, lineHeight: 1 }}>68%</div>
              <div style={{ marginTop: 6, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)" }}>
                <div style={{ width: "68%", height: "100%", borderRadius: 2, background: "linear-gradient(90deg, hsl(245,80%,65%), hsl(280,70%,65%))" }} />
              </div>
            </div>
            {/* course list */}
            {[["React 기초", "92%", "#818cf8"], ["알고리즘", "45%", "#60a5fa"], ["디자인", "71%", "#f472b6"]].map(([name, pct, color], i) => (
              <div key={i} style={{ margin: "4px 8px", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                <span style={{ fontSize: 7, color: "rgba(255,255,255,0.6)", flex: 1 }}>{name}</span>
                <span style={{ fontSize: 7, color, fontWeight: 700 }}>{pct}</span>
              </div>
            ))}
            {/* push notification */}
            <div style={{ margin: "8px 8px 0", background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px 8px", display: "flex", gap: 5, alignItems: "flex-start" }}>
              <div style={{ fontSize: 10 }}>🔔</div>
              <div>
                <div style={{ fontSize: 6.5, color: "#fff", fontWeight: 700 }}>학습 독려 알림</div>
                <div style={{ fontSize: 6, color: "rgba(255,255,255,0.4)" }}>오늘 목표 달성까지 32%!</div>
              </div>
            </div>
            {/* bottom nav */}
            <div style={{ position: "absolute", bottom: 8, left: 10, right: 10, display: "flex", justifyContent: "space-around", background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "5px 0" }}>
              {["🏠", "📚", "📊", "👤"].map((ic, i) => (
                <div key={i} style={{ fontSize: 10, opacity: i === 1 ? 1 : 0.4 }} />
              ))}
              {["홈", "강의", "통계", "MY"].map((lbl, i) => (
                <div key={i} style={{ fontSize: 5.5, color: i === 0 ? "hsl(245,80%,70%)" : "rgba(255,255,255,0.3)", textAlign: "center" }}>{lbl}</div>
              ))}
            </div>
          </div>
          {/* home bar */}
          <div style={{ width: 48, height: 4, background: "hsl(245,15%,70%)", borderRadius: 2, margin: "8px auto 0" }} />
        </div>

        {/* ── Floating: iOS icon ── */}
        <div style={{ position: "absolute", left: "8%", top: "10%", animation: "app-float-a 3.8s ease-in-out infinite", filter: "drop-shadow(0 12px 20px rgba(80,50,200,0.3))" }}>
          <svg width="62" height="62" viewBox="0 0 62 62">
            <defs><linearGradient id="iosGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs>
            <rect width="62" height="62" rx="16" fill="url(#iosGrad)"/>
            <text x="31" y="42" textAnchor="middle" fontSize="28" fill="white"></text>
          </svg>
        </div>

        {/* ── Floating: Android icon ── */}
        <div style={{ position: "absolute", right: "6%", top: "8%", animation: "app-float-e 4.2s ease-in-out infinite", animationDelay: "0.8s", filter: "drop-shadow(0 12px 20px rgba(60,180,80,0.3))" }}>
          <svg width="60" height="62" viewBox="0 0 60 62">
            <defs><linearGradient id="aosGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4ade80"/><stop offset="100%" stopColor="#16a34a"/></linearGradient></defs>
            <rect width="60" height="62" rx="16" fill="url(#aosGrad)"/>
            {/* Android robot */}
            <circle cx="30" cy="22" r="10" fill="rgba(255,255,255,0.9)"/>
            <circle cx="26" cy="20" r="1.5" fill="#16a34a"/>
            <circle cx="34" cy="20" r="1.5" fill="#16a34a"/>
            <line x1="23" y1="14" x2="20" y2="10" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="37" y1="14" x2="40" y2="10" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round"/>
            <rect x="18" y="30" width="24" height="18" rx="4" fill="rgba(255,255,255,0.85)"/>
            <rect x="14" y="31" width="5" height="12" rx="2.5" fill="rgba(255,255,255,0.7)"/>
            <rect x="41" y="31" width="5" height="12" rx="2.5" fill="rgba(255,255,255,0.7)"/>
            <rect x="24" y="50" width="5" height="8" rx="2.5" fill="rgba(255,255,255,0.7)"/>
            <rect x="31" y="50" width="5" height="8" rx="2.5" fill="rgba(255,255,255,0.7)"/>
          </svg>
        </div>

        {/* ── Floating: React Native badge ── */}
        <div style={{ position: "absolute", left: "4%", bottom: "20%", animation: "app-float-c 4.5s ease-in-out infinite", animationDelay: "1.2s", filter: "drop-shadow(0 10px 18px rgba(80,160,220,0.3))" }}>
          <svg width="58" height="58" viewBox="0 0 58 58">
            <defs><linearGradient id="rnGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#0284c7"/></linearGradient></defs>
            <rect width="58" height="58" rx="15" fill="url(#rnGrad)"/>
            <ellipse cx="29" cy="29" rx="16" ry="7" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5"/>
            <ellipse cx="29" cy="29" rx="16" ry="7" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" transform="rotate(60 29 29)"/>
            <ellipse cx="29" cy="29" rx="16" ry="7" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" transform="rotate(-60 29 29)"/>
            <circle cx="29" cy="29" r="4" fill="rgba(255,255,255,0.95)"/>
          </svg>
        </div>

        {/* ── Badges ── */}
        <div style={{ position: "absolute", right: "5%", bottom: "26%", animation: "app-float-b 3.6s ease-in-out infinite", animationDelay: "0.4s", background: "linear-gradient(135deg, hsl(245,80%,55%), hsl(245,70%,40%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 14, boxShadow: "0 10px 24px rgba(80,50,200,0.38)", whiteSpace: "nowrap" }}>iOS + AOS</div>
        <div style={{ position: "absolute", left: "2%", top: "38%", animation: "app-float-d 4.1s ease-in-out infinite", background: "linear-gradient(135deg, hsl(200,80%,50%), hsl(200,80%,35%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 12, boxShadow: "0 10px 24px rgba(30,130,220,0.35)" }}>Flutter</div>
        <div style={{ position: "absolute", right: "8%", top: "52%", animation: "app-float-a 4.8s ease-in-out infinite", animationDelay: "1s", background: "linear-gradient(135deg, hsl(280,75%,58%), hsl(280,80%,40%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 12, boxShadow: "0 10px 24px rgba(140,50,220,0.35)" }}>PUSH 알림</div>
        <div style={{ position: "absolute", left: "26%", top: "3%", animation: "app-float-e 3.4s ease-in-out infinite", animationDelay: "0.3s", background: "linear-gradient(135deg, hsl(35,90%,55%), hsl(25,90%,45%))", color: "#fff", borderRadius: 10, padding: "7px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 10px 24px rgba(220,120,30,0.35)" }}>4주 MVP</div>
        <div style={{ position: "absolute", left: "18%", bottom: "4%", animation: "app-float-b 4.3s ease-in-out infinite", animationDelay: "0.9s", background: "linear-gradient(135deg, hsl(152,70%,40%), hsl(152,80%,28%))", color: "#fff", borderRadius: 10, padding: "6px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 8px 20px rgba(30,160,90,0.35)" }}>LMS 연동</div>
      </div>
    </div>
  );
}
