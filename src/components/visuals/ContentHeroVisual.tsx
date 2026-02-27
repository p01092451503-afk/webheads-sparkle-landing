import { useTranslation } from "react-i18next";

export default function ContentHeroVisual() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <style>{`
        @keyframes ct-float-a { 0%,100%{transform:translateY(0px) rotate(-9deg);} 50%{transform:translateY(-13px) rotate(-9deg);} }
        @keyframes ct-float-b { 0%,100%{transform:translateY(0px) rotate(7deg);} 50%{transform:translateY(-10px) rotate(7deg);} }
        @keyframes ct-float-c { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
        @keyframes ct-float-e { 0%,100%{transform:translateY(0px) rotate(11deg);} 50%{transform:translateY(-15px) rotate(11deg);} }
        @keyframes ct-play-pulse { 0%,100%{transform:scale(1);opacity:0.9;} 50%{transform:scale(1.1);opacity:1;} }
        @keyframes ct-bar { 0%,100%{transform:scaleY(0.4);} 50%{transform:scaleY(1);} }
      `}</style>

      <div style={{ width: 269, height: 269, position: "relative", perspective: "900px" }}>

        {/* ── Main Card: Video Player ── */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-52%, -48%) rotateX(10deg) rotateY(-18deg) rotateZ(4deg)",
          width: 260, height: 185,
          borderRadius: 22,
          background: "hsl(220,15%,96%)",
          boxShadow: "0 28px 60px rgba(200,100,20,0.28), 0 4px 16px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,1)",
          overflow: "hidden",
        }}>
          {/* top bar */}
          <div style={{ padding: "10px 14px 8px", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
            <div style={{ flex: 1, margin: "0 8px", height: 5, background: "hsl(220,15%,88%)", borderRadius: 3 }} />
          </div>
          {/* video area */}
          <div style={{ margin: "0 12px 0", borderRadius: 14, overflow: "hidden", height: 108, position: "relative", background: "linear-gradient(135deg, hsl(25,90%,55%), hsl(35,90%,60%), hsl(15,85%,48%))" }}>
            {/* play button */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ animation: "ct-play-pulse 2s ease-in-out infinite", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
                <svg width="16" height="18" viewBox="0 0 16 18"><polygon points="2,1 14,9 2,17" fill="hsl(25,90%,50%)"/></svg>
              </div>
            </div>
            {/* title overlay bottom */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 10px 8px", background: "linear-gradient(0deg, rgba(0,0,0,0.5), transparent)" }}>
              <span style={{ fontSize: 8, color: "#fff", fontWeight: 600 }}>{t("visuals.content.videoTitle")}</span>
            </div>
            {/* 4K badge on video */}
            <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.55)", borderRadius: 5, padding: "2px 6px", fontSize: 7.5, color: "#fff", fontWeight: 800 }}>4K</div>
          </div>
          {/* controls */}
          <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            {/* audio bars */}
            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 16 }}>
              {[0.6, 1, 0.4, 0.8, 0.5, 1, 0.3, 0.7].map((h, i) => (
                <div key={i} style={{ width: 3, height: `${h * 100}%`, background: "hsl(25,80%,52%)", borderRadius: 1.5, animation: `ct-bar 1.${i}s ease-in-out infinite`, animationDelay: `${i * 0.1}s`, transformOrigin: "bottom" }} />
              ))}
            </div>
            {/* timeline */}
            <div style={{ flex: 1, height: 4, background: "hsl(220,15%,88%)", borderRadius: 2 }}>
              <div style={{ width: "42%", height: "100%", background: "hsl(25,85%,52%)", borderRadius: 2, position: "relative" }}>
                <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 9, height: 9, borderRadius: "50%", background: "hsl(25,85%,52%)", boxShadow: "0 1px 4px rgba(200,80,0,0.4)" }} />
              </div>
            </div>
            <span style={{ fontSize: 8, color: "hsl(220,10%,50%)", fontFamily: "monospace", whiteSpace: "nowrap" }}>12:34 / 28:10</span>
          </div>
          {/* tag row */}
          <div style={{ padding: "0 12px 8px", display: "flex", gap: 4, flexWrap: "wrap" }}>
            {(t("visuals.content.tags", { returnObjects: true }) as string[]).map(tag => (
              <span key={tag} style={{ fontSize: 7, background: "hsl(25,90%,93%)", color: "hsl(25,80%,40%)", padding: "2px 7px", borderRadius: 5, fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%)", pointerEvents: "none" }} />
        </div>

        {/* ── Floating: Clapperboard ── */}
        <div style={{ position: "absolute", left: "8%", top: "8%", animation: "ct-float-a 3.8s ease-in-out infinite", filter: "drop-shadow(0 12px 20px rgba(30,30,30,0.3))" }}>
          <svg width="64" height="60" viewBox="0 0 64 60">
            <rect x="2" y="18" width="60" height="40" rx="7" fill="hsl(220,15%,94%)" stroke="hsl(220,15%,80%)" strokeWidth="1"/>
            <rect x="2" y="6" width="60" height="16" rx="5" fill="hsl(220,20%,22%)"/>
            {[0,1,2,3,4,5].map(i => (
              <line key={i} x1={10+i*8} y1="6" x2={6+i*8} y2="22" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
            ))}
            <circle cx="16" cy="40" r="6" fill="hsl(25,85%,52%)" opacity="0.7"/>
            <rect x="28" y="36" width="28" height="4" rx="2" fill="hsl(220,15%,80%)"/>
            <rect x="28" y="44" width="20" height="4" rx="2" fill="hsl(220,15%,80%)"/>
          </svg>
        </div>

        {/* ── Floating: Microphone ── */}
        <div style={{ position: "absolute", right: "6%", top: "10%", animation: "ct-float-e 4.2s ease-in-out infinite", animationDelay: "0.7s", filter: "drop-shadow(0 12px 20px rgba(100,50,220,0.28))" }}>
          <svg width="52" height="72" viewBox="0 0 52 72">
            <defs><linearGradient id="micGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(220,15%,65%)"/><stop offset="100%" stopColor="hsl(220,15%,40%)"/></linearGradient></defs>
            <rect x="14" y="4" width="24" height="36" rx="12" fill="url(#micGrad)"/>
            {[0,1,2,3,4].map(i => <line key={i} x1="14" y1={14+i*5} x2="38" y2={14+i*5} stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>)}
            <path d="M8 30 Q8 52 26 52 Q44 52 44 30" fill="none" stroke="hsl(220,15%,55%)" strokeWidth="3" strokeLinecap="round"/>
            <line x1="26" y1="52" x2="26" y2="64" stroke="hsl(220,15%,55%)" strokeWidth="3" strokeLinecap="round"/>
            <line x1="16" y1="64" x2="36" y2="64" stroke="hsl(220,15%,55%)" strokeWidth="3" strokeLinecap="round"/>
            <rect x="18" y="8" width="6" height="16" rx="3" fill="rgba(255,255,255,0.2)"/>
          </svg>
        </div>

        {/* ── Floating: 3D box ── */}
        <div style={{ position: "absolute", left: "5%", bottom: "20%", animation: "ct-float-c 4.5s ease-in-out infinite", animationDelay: "1.1s", filter: "drop-shadow(0 10px 18px rgba(200,80,20,0.28))" }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <defs>
              <linearGradient id="box3dTop" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(25,90%,70%)"/><stop offset="100%" stopColor="hsl(25,85%,55%)"/></linearGradient>
              <linearGradient id="box3dLeft" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(25,80%,50%)"/><stop offset="100%" stopColor="hsl(25,75%,38%)"/></linearGradient>
              <linearGradient id="box3dRight" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(25,85%,45%)"/><stop offset="100%" stopColor="hsl(25,80%,32%)"/></linearGradient>
            </defs>
            <polygon points="30,8 54,20 30,32 6,20" fill="url(#box3dTop)"/>
            <polygon points="6,20 30,32 30,52 6,40" fill="url(#box3dLeft)"/>
            <polygon points="54,20 30,32 30,52 54,40" fill="url(#box3dRight)"/>
            <line x1="30" y1="8" x2="30" y2="52" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          </svg>
        </div>

        {/* ── Badges ── */}
        <div style={{ position: "absolute", right: "4%", bottom: "28%", animation: "ct-float-b 3.6s ease-in-out infinite", animationDelay: "0.5s", background: "linear-gradient(135deg, hsl(25,90%,52%), hsl(20,90%,38%))", color: "#fff", borderRadius: 10, padding: "8px 14px", fontWeight: 800, fontSize: 15, boxShadow: "0 10px 24px rgba(200,80,20,0.38)" }}>4K</div>
        <div style={{ position: "absolute", left: "2%", top: "36%", animation: "ct-float-a 4.1s ease-in-out infinite", background: "linear-gradient(135deg, hsl(0,75%,52%), hsl(0,80%,38%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 14, boxShadow: "0 10px 24px rgba(180,30,30,0.35)" }}>HD</div>
        <div style={{ position: "absolute", right: "9%", top: "54%", animation: "ct-float-c 4.8s ease-in-out infinite", animationDelay: "1s", background: "linear-gradient(135deg, hsl(280,75%,58%), hsl(280,80%,40%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(140,50,220,0.35)" }}>{t("visuals.content.badges.courses")}</div>
        <div style={{ position: "absolute", left: "26%", top: "3%", animation: "ct-float-e 3.4s ease-in-out infinite", animationDelay: "0.3s", background: "linear-gradient(135deg, hsl(152,70%,40%), hsl(152,80%,28%))", color: "#fff", borderRadius: 10, padding: "7px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 10px 24px rgba(30,160,90,0.35)" }}>{t("visuals.content.badges.aiTts")}</div>
        <div style={{ position: "absolute", left: "18%", bottom: "4%", animation: "ct-float-b 4.3s ease-in-out infinite", animationDelay: "0.9s", background: "linear-gradient(135deg, hsl(214,80%,52%), hsl(214,80%,35%))", color: "#fff", borderRadius: 10, padding: "6px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 8px 20px rgba(30,80,200,0.35)" }}>{t("visuals.content.badges.review")}</div>
      </div>
    </div>
  );
}
