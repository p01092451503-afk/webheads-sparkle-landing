import { useTranslation } from "react-i18next";

export default function ChannelHeroVisual() {
  const { t } = useTranslation();
  const messages = t("visuals.channel.messages", { returnObjects: true }) as { type: string; msg: string }[];
  const channelStats = t("visuals.channel.stats", { returnObjects: true }) as string[][];

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <style>{`
        @keyframes ch-float-a { 0%,100%{transform:translateY(0px) rotate(-9deg);} 50%{transform:translateY(-13px) rotate(-9deg);} }
        @keyframes ch-float-b { 0%,100%{transform:translateY(0px) rotate(6deg);} 50%{transform:translateY(-10px) rotate(6deg);} }
        @keyframes ch-float-c { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
        @keyframes ch-float-e { 0%,100%{transform:translateY(0px) rotate(11deg);} 50%{transform:translateY(-15px) rotate(11deg);} }
        @keyframes ch-msg-in { 0%{opacity:0;transform:translateX(-10px);} 100%{opacity:1;transform:translateX(0);} }
        @keyframes ch-ping { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.4);opacity:0.5;} }
      `}</style>

      <div style={{ width: 420, height: 420, position: "relative", perspective: "900px" }}>

        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-52%, -48%) rotateX(10deg) rotateY(-18deg) rotateZ(4deg)",
          width: 255, height: 200, borderRadius: 22,
          background: "linear-gradient(145deg, hsl(40,30%,13%), hsl(40,35%,9%))",
          boxShadow: "0 28px 60px rgba(200,120,20,0.32), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "12px 14px 8px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
            <div style={{ marginLeft: 8, fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>{t("visuals.channel.headerTitle")}</div>
            <div style={{ marginLeft: "auto", animation: "ch-ping 1.8s ease-in-out infinite", width: 7, height: 7, borderRadius: "50%", background: "#facc15", boxShadow: "0 0 8px #facc15" }} />
          </div>
          <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { ...messages[0], time: "14:30", color: "#60a5fa" },
              { ...messages[1], time: "11:05", color: "#facc15" },
              { ...messages[2], time: "09:22", color: "#34d399" },
            ].map((m, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "6px 9px", animation: `ch-msg-in 0.4s ease-out ${i * 0.15}s both` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 6.5, fontWeight: 700, color: m.color, background: `${m.color}20`, padding: "1px 5px", borderRadius: 4 }}>{m.type}</span>
                  <span style={{ fontSize: 6.5, color: "rgba(255,255,255,0.25)", marginLeft: "auto" }}>{m.time}</span>
                </div>
                <p style={{ fontSize: 7.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>{m.msg}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "6px 12px", display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {channelStats.map(([k, v], idx) => {
              const colors = ["#34d399", "#facc15", "#60a5fa"];
              return (
                <div key={k} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: colors[idx], lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{k}</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />
        </div>

        {/* ── Floating: Bell icon ── */}
        <div style={{ position: "absolute", left: "14%", top: "12%", animation: "ch-float-a 3.8s ease-in-out infinite", filter: "drop-shadow(0 12px 20px rgba(200,120,20,0.3))" }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <defs><linearGradient id="bellGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#b45309"/></linearGradient></defs>
            <rect width="64" height="64" rx="17" fill="url(#bellGrad)"/>
            <path d="M32 12 Q44 12 44 28 L44 40 L18 40 L18 28 Q18 12 32 12 Z" fill="rgba(255,255,255,0.9)"/>
            <rect x="28" y="40" width="8" height="6" rx="3" fill="rgba(255,255,255,0.9)"/>
            <rect x="14" y="39" width="36" height="4" rx="2" fill="rgba(255,255,255,0.85)"/>
            <circle cx="46" cy="18" r="7" fill="#ef4444"/>
            <text x="46" y="22" textAnchor="middle" fontSize="8" fill="white" fontWeight="800">3</text>
          </svg>
        </div>

        {/* ── Floating: Message icon ── */}
        <div style={{ position: "absolute", right: "12%", top: "14%", animation: "ch-float-e 4.2s ease-in-out infinite", animationDelay: "0.7s", filter: "drop-shadow(0 12px 20px rgba(250,200,10,0.3))" }}>
          <svg width="62" height="62" viewBox="0 0 62 62">
            <defs><linearGradient id="msgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs>
            <rect width="62" height="62" rx="16" fill="url(#msgGrad)"/>
            <path d="M17 20h20c2.2 0 4 1.8 4 4v12c0 2.2-1.8 4-4 4h-8.5l-5.5 4.5V40H17c-2.2 0-4-1.8-4-4V24c0-2.2 1.8-4 4-4z" fill="rgba(255,255,255,0.92)"/>
            <rect x="20" y="26" width="14" height="2.2" rx="1.1" fill="#7c3aed"/>
            <rect x="20" y="30.5" width="10" height="2.2" rx="1.1" fill="#7c3aed"/>
          </svg>
        </div>

        {/* ── Floating: SMS phone ── */}
        <div style={{ position: "absolute", left: "5%", bottom: "20%", animation: "ch-float-c 4.5s ease-in-out infinite", animationDelay: "1.1s", filter: "drop-shadow(0 10px 18px rgba(30,100,220,0.28))" }}>
          <svg width="52" height="68" viewBox="0 0 52 68">
            <defs><linearGradient id="smsPhoneGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#1d4ed8"/></linearGradient></defs>
            <rect x="4" y="2" width="44" height="64" rx="10" fill="url(#smsPhoneGrad)"/>
            <rect x="8" y="8" width="36" height="50" rx="6" fill="rgba(255,255,255,0.12)"/>
            <rect x="12" y="14" width="28" height="7" rx="3.5" fill="rgba(255,255,255,0.8)"/>
            <rect x="12" y="24" width="22" height="7" rx="3.5" fill="rgba(255,255,255,0.55)"/>
            <rect x="18" y="34" width="22" height="7" rx="3.5" fill="rgba(255,255,255,0.8)"/>
            <rect x="12" y="44" width="18" height="7" rx="3.5" fill="rgba(255,255,255,0.55)"/>
            <rect x="22" y="60" width="8" height="4" rx="2" fill="rgba(255,255,255,0.5)"/>
          </svg>
        </div>

        {/* ── Badges ── */}
        <div style={{ position: "absolute", right: "4%", bottom: "28%", animation: "ch-float-b 3.6s ease-in-out infinite", animationDelay: "0.5s", background: "linear-gradient(135deg, hsl(40,85%,48%), hsl(35,90%,35%))", color: "#fff", borderRadius: 10, padding: "8px 14px", fontWeight: 800, fontSize: 14, boxShadow: "0 10px 24px rgba(200,120,20,0.38)" }}>{t("visuals.channel.badges.bulkSms")}</div>
        <div style={{ position: "absolute", left: "2%", top: "36%", animation: "ch-float-a 4.1s ease-in-out infinite", background: "linear-gradient(135deg, hsl(152,70%,40%), hsl(152,80%,28%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(30,160,90,0.35)" }}>{t("visuals.channel.badges.reach")}</div>
        <div style={{ position: "absolute", right: "9%", top: "54%", animation: "ch-float-c 4.8s ease-in-out infinite", animationDelay: "1s", background: "linear-gradient(135deg, hsl(280,75%,58%), hsl(280,80%,40%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(140,50,220,0.35)" }}>{t("visuals.channel.badges.automation")}</div>
        <div style={{ position: "absolute", left: "26%", top: "3%", animation: "ch-float-e 3.4s ease-in-out infinite", animationDelay: "0.3s", background: "linear-gradient(135deg, hsl(214,80%,52%), hsl(214,80%,35%))", color: "#fff", borderRadius: 10, padding: "7px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 10px 24px rgba(30,80,200,0.35)" }}>{t("visuals.channel.badges.channelTalk")}</div>
        <div style={{ position: "absolute", left: "18%", bottom: "4%", animation: "ch-float-b 4.3s ease-in-out infinite", animationDelay: "0.9s", background: "linear-gradient(135deg, hsl(0,70%,55%), hsl(0,80%,40%))", color: "#fff", borderRadius: 10, padding: "6px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 8px 20px rgba(180,30,30,0.35)" }}>{t("visuals.channel.badges.alimtalk")}</div>
      </div>
    </div>
  );
}
