import { useTranslation } from "react-i18next";

export default function DrmHeroVisual() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <style>{`
        @keyframes drm-float-a { 0%,100%{transform:translateY(0px) rotate(-8deg);} 50%{transform:translateY(-14px) rotate(-8deg);} }
        @keyframes drm-float-b { 0%,100%{transform:translateY(0px) rotate(7deg);} 50%{transform:translateY(-10px) rotate(7deg);} }
        @keyframes drm-float-c { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
        @keyframes drm-float-e { 0%,100%{transform:translateY(0px) rotate(11deg);} 50%{transform:translateY(-15px) rotate(11deg);} }
        @keyframes drm-scan { 0%{transform:translateY(-60px);opacity:0.7;} 100%{transform:translateY(60px);opacity:0.2;} }
        @keyframes drm-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.3;transform:scale(0.85);} }
        @keyframes drm-lock { 0%,100%{transform:rotate(-3deg);} 50%{transform:rotate(3deg);} }
      `}</style>

      <div style={{ width: 420, height: 420, position: "relative", perspective: "900px" }}>
        {/* ── Main Card ── */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-52%, -48%) rotateX(10deg) rotateY(-18deg) rotateZ(4deg)",
          width: 255, height: 185, borderRadius: 22,
          background: "linear-gradient(145deg, hsl(152,25%,12%), hsl(152,30%,8%))",
          boxShadow: "0 28px 60px rgba(20,120,70,0.35), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "12px 14px 8px", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
            <div style={{ marginLeft: "auto", fontSize: 8, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>DRM PROTECTED</div>
          </div>
          <div style={{ margin: "0 12px", borderRadius: 12, overflow: "hidden", position: "relative", height: 100, background: "linear-gradient(135deg, hsl(152,40%,18%), hsl(152,50%,10%))" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, hsl(152,80%,55%), transparent)", animation: "drm-scan 2.5s ease-in-out infinite", top: "50%" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <svg width="32" height="36" viewBox="0 0 32 36" style={{ animation: "drm-lock 3s ease-in-out infinite" }}>
                <rect x="4" y="16" width="24" height="18" rx="5" fill="hsl(152,70%,45%)" opacity="0.9"/>
                <path d="M9 16 V11 A7 7 0 0 1 23 11 V16" fill="none" stroke="hsl(152,70%,45%)" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/>
                <circle cx="16" cy="24" r="3" fill="rgba(255,255,255,0.9)"/>
              </svg>
              <span style={{ fontSize: 7, color: "hsl(152,70%,55%)", fontFamily: "monospace", letterSpacing: 1 }}>ENCRYPTED</span>
            </div>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
              {[0,1,2,3,4,5,6,7].map(i => <line key={`v${i}`} x1={`${i*14.3}%`} y1="0" x2={`${i*14.3}%`} y2="100%" stroke="hsl(152,70%,55%)" strokeWidth="0.5"/>)}
              {[0,1,2,3,4].map(i => <line key={`h${i}`} x1="0" y1={`${i*25}%`} x2="100%" y2={`${i*25}%`} stroke="hsl(152,70%,55%)" strokeWidth="0.5"/>)}
            </svg>
          </div>
          <div style={{ padding: "8px 14px", display: "flex", gap: 10 }}>
            {[["Widevine", "#34d399"], ["FairPlay", "#60a5fa"], ["PlayReady", "#f472b6"]].map(([label, color]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ animation: "drm-pulse 2s ease-in-out infinite", width: 5, height: 5, borderRadius: "50%", background: color }} />
                <span style={{ fontSize: 7, color, fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ margin: "0 12px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "5px 8px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>WM:</span>
            <span style={{ fontSize: 7, color: "hsl(152,70%,50%)", fontFamily: "monospace", letterSpacing: 0.5 }}>user_192.168.1.1_2026-02-20</span>
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />
        </div>

        {/* ── Floating: Fingerprint ── */}
        <div style={{ position: "absolute", left: "8%", top: "8%", animation: "drm-float-a 3.8s ease-in-out infinite", filter: "drop-shadow(0 12px 20px rgba(20,120,70,0.3))" }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <defs><linearGradient id="fpGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(152,80%,55%)"/><stop offset="100%" stopColor="hsl(152,70%,32%)"/></linearGradient></defs>
            <rect width="64" height="64" rx="17" fill="url(#fpGrad)"/>
            <circle cx="32" cy="32" r="6" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/>
            <path d="M22 32 a10 10 0 0 1 20 0" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 32 a15 15 0 0 1 30 0" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 32 a20 20 0 0 1 40 0" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M32 38 v6" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* ── Floating: Shield lock ── */}
        <div style={{ position: "absolute", right: "6%", top: "10%", animation: "drm-float-e 4.2s ease-in-out infinite", animationDelay: "0.7s", filter: "drop-shadow(0 12px 20px rgba(100,50,220,0.3))" }}>
          <svg width="58" height="64" viewBox="0 0 58 64">
            <defs><linearGradient id="shGrad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#6d28d9"/></linearGradient></defs>
            <path d="M29 4 L52 16 L52 34 Q52 52 29 60 Q6 52 6 34 L6 16 Z" fill="url(#shGrad2)"/>
            <path d="M29 10 L48 20 L48 34 Q48 49 29 56" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
            <rect x="20" y="28" width="18" height="14" rx="4" fill="rgba(255,255,255,0.9)"/>
            <path d="M22 28 V23 A7 7 0 0 1 36 23 V28" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="29" cy="34" r="2.5" fill="#6d28d9"/>
          </svg>
        </div>

        {/* ── Floating: Camera off ── */}
        <div style={{ position: "absolute", left: "5%", bottom: "20%", animation: "drm-float-c 4.5s ease-in-out infinite", animationDelay: "1.1s", filter: "drop-shadow(0 10px 18px rgba(220,50,50,0.28))" }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <defs><linearGradient id="camGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f87171"/><stop offset="100%" stopColor="#b91c1c"/></linearGradient></defs>
            <rect width="60" height="60" rx="16" fill="url(#camGrad)"/>
            <rect x="10" y="18" width="32" height="24" rx="5" fill="rgba(255,255,255,0.85)"/>
            <polygon points="42,22 52,16 52,44 42,38" fill="rgba(255,255,255,0.7)"/>
            <circle cx="26" cy="30" r="7" fill="#b91c1c"/>
            <line x1="10" y1="10" x2="50" y2="50" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>

        {/* ── Badges ── */}
        <div style={{ position: "absolute", right: "4%", bottom: "28%", animation: "drm-float-b 3.6s ease-in-out infinite", animationDelay: "0.5s", background: "linear-gradient(135deg, hsl(152,75%,38%), hsl(152,80%,25%))", color: "#fff", borderRadius: 10, padding: "8px 14px", fontWeight: 800, fontSize: 14, boxShadow: "0 10px 24px rgba(20,120,70,0.38)" }}>AES-128</div>
        <div style={{ position: "absolute", left: "2%", top: "36%", animation: "drm-float-a 4.1s ease-in-out infinite", background: "linear-gradient(135deg, hsl(280,75%,58%), hsl(280,80%,40%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(140,50,220,0.35)" }}>Widevine</div>
        <div style={{ position: "absolute", right: "9%", top: "54%", animation: "drm-float-c 4.8s ease-in-out infinite", animationDelay: "1s", background: "linear-gradient(135deg, hsl(35,90%,55%), hsl(25,90%,45%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(220,120,30,0.35)" }}>{t("visuals.drm.badges.block")}</div>
        <div style={{ position: "absolute", left: "26%", top: "3%", animation: "drm-float-e 3.4s ease-in-out infinite", animationDelay: "0.3s", background: "linear-gradient(135deg, hsl(214,80%,52%), hsl(214,80%,35%))", color: "#fff", borderRadius: 10, padding: "7px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 10px 24px rgba(30,80,200,0.35)" }}>FairPlay</div>
        <div style={{ position: "absolute", left: "18%", bottom: "4%", animation: "drm-float-b 4.3s ease-in-out infinite", animationDelay: "0.9s", background: "linear-gradient(135deg, hsl(0,70%,55%), hsl(0,80%,40%))", color: "#fff", borderRadius: 10, padding: "6px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 8px 20px rgba(180,30,30,0.35)" }}>{t("visuals.drm.badges.watermark")}</div>
      </div>
    </div>
  );
}
