import { useTranslation } from "react-i18next";

export default function MaintenanceHeroVisual() {
  const { t } = useTranslation();
  const statuses = t("visuals.maintenance.statuses", { returnObjects: true }) as string[];
  const stats = t("visuals.maintenance.stats", { returnObjects: true }) as string[][];

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <style>{`
        @keyframes mnt-float-a { 0%,100%{transform:translateY(0px) rotate(-8deg);} 50%{transform:translateY(-14px) rotate(-8deg);} }
        @keyframes mnt-float-b { 0%,100%{transform:translateY(0px) rotate(6deg);} 50%{transform:translateY(-10px) rotate(6deg);} }
        @keyframes mnt-float-c { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
        @keyframes mnt-float-d { 0%,100%{transform:translateY(0px) rotate(-4deg);} 50%{transform:translateY(-8px) rotate(-4deg);} }
        @keyframes mnt-float-e { 0%,100%{transform:translateY(0px) rotate(10deg);} 50%{transform:translateY(-16px) rotate(10deg);} }
        @keyframes mnt-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(0.8);} }
        @keyframes mnt-scan { 0%{transform:translateY(-100%);opacity:0;} 30%{opacity:1;} 70%{opacity:1;} 100%{transform:translateY(200%);opacity:0;} }
        @keyframes mnt-bar { 0%,100%{height:6px;} 50%{height:18px;} }
        @keyframes mnt-rotate { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }
        @keyframes mnt-tick { 0%,100%{stroke-dashoffset:30;} 50%{stroke-dashoffset:0;} }
      `}</style>

      <div style={{ width: 420, height: 420, position: "relative", perspective: "900px" }}>

        {/* ══ Main Card ══ */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-52%, -48%) rotateX(10deg) rotateY(-18deg) rotateZ(4deg)",
          width: 268, height: 196, borderRadius: 22,
          background: "linear-gradient(135deg, hsl(220,70%,18%) 0%, hsl(220,80%,12%) 100%)",
          boxShadow: "0 28px 60px rgba(30,50,120,0.40), 0 4px 16px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "13px 16px 8px", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
            <div style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>NOC MONITOR</div>
          </div>

          <div style={{ padding: "0 16px 8px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ animation: "mnt-pulse 1.8s ease-in-out infinite", width: 8, height: 8, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399" }} />
            <span style={{ fontSize: 11, color: "#34d399", fontWeight: 700, letterSpacing: 1 }}>ALL SYSTEMS NORMAL</span>
          </div>

          {[
            { label: "Web Server", status: statuses[0], bar: 92, color: "#34d399" },
            { label: "Database", status: statuses[1], bar: 78, color: "#60a5fa" },
            { label: "Security Scan", status: statuses[2], bar: 55, color: "#818cf8" },
          ].map((item, i) => (
            <div key={i} style={{ padding: "4px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 16, borderRadius: 4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", display: "flex", alignItems: "center", padding: "0 4px" }}>
                <div style={{ width: "100%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)" }}>
                  <div style={{ width: `${item.bar}%`, height: "100%", borderRadius: 2, background: item.color, transition: "width 0.5s" }} />
                </div>
              </div>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: 9, color: item.color, fontWeight: 700 }}>{item.status}</span>
            </div>
          ))}

          <div style={{ padding: "8px 16px 4px", display: "flex", alignItems: "flex-end", gap: 3, height: 38 }}>
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginRight: 4, alignSelf: "center" }}>{t("visuals.maintenance.responseSpeed")}</span>
            {[12, 18, 10, 22, 14, 8, 16, 20, 11, 17, 9, 13].map((h, i) => (
              <div key={i} style={{ flex: 1, height: h, borderRadius: 2, background: i === 9 ? "linear-gradient(180deg,#60a5fa,#818cf8)" : "rgba(96,165,250,0.3)", animation: `mnt-bar ${1.5 + i * 0.15}s ease-in-out infinite`, animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>

          <div style={{ padding: "4px 16px 10px", display: "flex", gap: 12 }}>
            {stats.map(([k, v]) => (
              <div key={k} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{k}</div>
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />
        </div>

        {/* ══ Floating Object 1: Wrench ══ */}
        <div style={{ position: "absolute", left: "18%", top: "12%", animation: "mnt-float-a 3.8s ease-in-out infinite", filter: "drop-shadow(0 12px 20px rgba(60,100,220,0.30))" }}>
          <svg width="66" height="66" viewBox="0 0 66 66">
            <defs><radialGradient id="wrenchGrad" cx="35%" cy="30%"><stop offset="0%" stopColor="hsl(220,75%,72%)"/><stop offset="100%" stopColor="hsl(220,75%,42%)"/></radialGradient></defs>
            <circle cx="33" cy="33" r="28" fill="url(#wrenchGrad)"/>
            <g transform="translate(33,33) rotate(-45)">
              <rect x="-4" y="-14" width="8" height="28" rx="3" fill="rgba(255,255,255,0.9)"/>
              <circle cx="0" cy="-14" r="7" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="3"/>
              <circle cx="0" cy="14" r="5" fill="rgba(255,255,255,0.6)"/>
            </g>
            <circle cx="24" cy="22" r="5" fill="rgba(255,255,255,0.18)"/>
          </svg>
        </div>

        {/* ══ Floating Object 2: Shield Check ══ */}
        <div style={{ position: "absolute", right: "12%", top: "14%", animation: "mnt-float-e 4.2s ease-in-out infinite", animationDelay: "0.7s", filter: "drop-shadow(0 14px 22px rgba(30,180,100,0.32))" }}>
          <svg width="62" height="68" viewBox="0 0 62 68">
            <defs><linearGradient id="mntShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(152,76%,52%)"/><stop offset="100%" stopColor="hsl(152,70%,30%)"/></linearGradient></defs>
            <path d="M31 4 L56 16 L56 36 Q56 55 31 64 Q6 55 6 36 L6 16 Z" fill="url(#mntShieldGrad)"/>
            <path d="M31 10 L50 20 L50 36 Q50 51 31 59" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
            <polyline points="20,34 28,42 43,26" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* ══ Floating Object 3: Gear ══ */}
        <div style={{ position: "absolute", left: "5%", bottom: "16%", animation: "mnt-float-c 4.5s ease-in-out infinite", animationDelay: "1.2s", filter: "drop-shadow(0 16px 24px rgba(130,80,220,0.30))" }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <defs><linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(260,70%,68%)"/><stop offset="100%" stopColor="hsl(260,70%,42%)"/></linearGradient></defs>
            <g transform="translate(30,30)">
              {Array.from({ length: 8 }).map((_, i) => (
                <rect key={i} x="-4" y="-26" width="8" height="10" rx="2" fill="url(#gearGrad)" transform={`rotate(${i * 45})`}/>
              ))}
              <circle r="18" fill="url(#gearGrad)"/>
              <circle r="7" fill="hsl(220,30%,20%)"/>
              <circle r="3" fill="rgba(255,255,255,0.7)" cx="0" cy="-11" style={{ animation: "mnt-rotate 3s linear infinite", transformOrigin: "0 0" }}/>
            </g>
            <circle cx="20" cy="18" r="5" fill="rgba(255,255,255,0.15)"/>
          </svg>
        </div>

        {/* ══ Badges ══ */}
        <div style={{ position: "absolute", right: "4%", bottom: "26%", animation: "mnt-float-b 3.6s ease-in-out infinite", animationDelay: "0.5s", background: "linear-gradient(135deg, hsl(220,85%,52%), hsl(220,80%,36%))", color: "#fff", borderRadius: 10, padding: "8px 14px", fontWeight: 800, fontSize: 15, letterSpacing: -0.5, boxShadow: "0 10px 24px rgba(30,60,200,0.38)", whiteSpace: "nowrap" }}>24/7 <span style={{ fontSize: 9, fontWeight: 500, opacity: 0.8 }}>{t("visuals.maintenance.badges.support")}</span></div>
        <div style={{ position: "absolute", left: "1%", top: "33%", animation: "mnt-float-a 4.1s ease-in-out infinite", animationDelay: "0.2s", background: "linear-gradient(135deg, hsl(35,88%,55%), hsl(25,88%,42%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(200,110,30,0.38)" }}>RCA</div>
        <div style={{ position: "absolute", right: "9%", top: "53%", animation: "mnt-float-c 4.8s ease-in-out infinite", animationDelay: "1s", background: "linear-gradient(135deg, hsl(152,70%,38%), hsl(152,78%,26%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(30,160,80,0.38)", whiteSpace: "nowrap" }}>99.9% <span style={{ fontSize: 9, fontWeight: 500, opacity: 0.8 }}>SLA</span></div>
        <div style={{ position: "absolute", left: "27%", top: "3%", animation: "mnt-float-d 3.4s ease-in-out infinite", animationDelay: "0.3s", background: "linear-gradient(135deg, hsl(260,72%,58%), hsl(260,78%,40%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(120,60,220,0.38)" }}>NOC</div>
        <div style={{ position: "absolute", left: "18%", bottom: "3%", animation: "mnt-float-b 4.3s ease-in-out infinite", animationDelay: "0.9s", background: "linear-gradient(135deg, hsl(0,68%,54%), hsl(0,76%,38%))", color: "#fff", borderRadius: 10, padding: "6px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 8px 20px rgba(180,30,30,0.38)", whiteSpace: "nowrap" }}>{t("visuals.maintenance.badges.initial")}</div>
      </div>
    </div>
  );
}
