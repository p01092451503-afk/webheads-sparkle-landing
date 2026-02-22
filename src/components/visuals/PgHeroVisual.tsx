import { useTranslation } from "react-i18next";

export default function PgHeroVisual() {
  const { t } = useTranslation();
  const transactions = t("visuals.pg.transactions", { returnObjects: true }) as string[][];

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <style>{`
        @keyframes pg-float-a { 0%,100%{transform:translateY(0px) rotate(-9deg);} 50%{transform:translateY(-14px) rotate(-9deg);} }
        @keyframes pg-float-b { 0%,100%{transform:translateY(0px) rotate(7deg);} 50%{transform:translateY(-10px) rotate(7deg);} }
        @keyframes pg-float-c { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
        @keyframes pg-float-e { 0%,100%{transform:translateY(0px) rotate(11deg);} 50%{transform:translateY(-15px) rotate(11deg);} }
        @keyframes pg-shimmer { 0%{left:-60%;} 100%{left:140%;} }
        @keyframes pg-count { 0%,100%{opacity:1;} 50%{opacity:0.6;} }
      `}</style>

      <div style={{ width: 420, height: 420, position: "relative", perspective: "900px" }}>

        {/* ── Main Card: Credit Card ── */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-52%, -48%) rotateX(10deg) rotateY(-18deg) rotateZ(4deg)",
          width: 255, height: 155, borderRadius: 22,
          background: "linear-gradient(135deg, hsl(152,60%,20%), hsl(152,70%,12%))",
          boxShadow: "0 28px 60px rgba(20,140,80,0.35), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", animation: "pg-shimmer 2.8s ease-in-out infinite", left: "-60%" }} />
          <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", right: -10, top: -50, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ padding: "18px 20px" }}>
            <div style={{ width: 34, height: 26, borderRadius: 5, background: "linear-gradient(135deg, #facc15, #b45309)", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 24, height: 16, borderRadius: 3, border: "1px solid rgba(0,0,0,0.15)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                {[0,1,2,3].map(i => <div key={i} style={{ background: "rgba(0,0,0,0.08)", borderRadius: 1 }} />)}
              </div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.85)", letterSpacing: 3, marginBottom: 14 }}>
              •••• •••• •••• 4521
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>{t("visuals.pg.paymentMethod")}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>{t("visuals.pg.providerName")}</div>
              </div>
              <div style={{ display: "flex", gap: -8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#ef4444", opacity: 0.9 }} />
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#facc15", marginLeft: -12, opacity: 0.9 }} />
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        </div>

        {/* ── Secondary card: Transaction ── */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-28%, -28%) rotateX(12deg) rotateY(-22deg) rotateZ(6deg)",
          width: 180, height: 110, borderRadius: 18,
          background: "rgba(20,20,40,0.85)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{t("visuals.pg.recentPayments")}</div>
            {transactions.map(([label, amount], i) => {
              const colors = ["#34d399", "#60a5fa", "#f87171"];
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: colors[i] }} />
                    <span style={{ fontSize: 7.5, color: "rgba(255,255,255,0.6)" }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 8, color: colors[i], fontWeight: 700 }}>{amount}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Floating: Globe ── */}
        <div style={{ position: "absolute", left: "8%", top: "8%", animation: "pg-float-a 3.8s ease-in-out infinite", filter: "drop-shadow(0 12px 20px rgba(20,140,80,0.3))" }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <defs><radialGradient id="pgGlobeGrad" cx="38%" cy="32%"><stop offset="0%" stopColor="hsl(152,80%,65%)"/><stop offset="100%" stopColor="hsl(152,70%,35%)"/></radialGradient></defs>
            <circle cx="32" cy="32" r="28" fill="url(#pgGlobeGrad)"/>
            <ellipse cx="32" cy="32" rx="12" ry="28" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/>
            <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/>
            <line x1="4" y1="32" x2="60" y2="32" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <circle cx="26" cy="22" r="5" fill="rgba(255,255,255,0.2)"/>
          </svg>
        </div>

        {/* ── Floating: PayPal-style icon ── */}
        <div style={{ position: "absolute", right: "6%", top: "10%", animation: "pg-float-e 4.2s ease-in-out infinite", animationDelay: "0.7s", filter: "drop-shadow(0 12px 20px rgba(30,80,200,0.3))" }}>
          <svg width="62" height="62" viewBox="0 0 62 62">
            <defs><linearGradient id="ppGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#1e40af"/></linearGradient></defs>
            <rect width="62" height="62" rx="16" fill="url(#ppGrad)"/>
            <text x="31" y="42" textAnchor="middle" fontSize="28" fill="white">💳</text>
          </svg>
        </div>

        {/* ── Floating: Stripe/Toss ── */}
        <div style={{ position: "absolute", left: "5%", bottom: "20%", animation: "pg-float-c 4.5s ease-in-out infinite", animationDelay: "1.1s", filter: "drop-shadow(0 10px 18px rgba(100,50,220,0.28))" }}>
          <svg width="58" height="58" viewBox="0 0 58 58">
            <defs><linearGradient id="stripeGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#4338ca"/></linearGradient></defs>
            <rect width="58" height="58" rx="15" fill="url(#stripeGrad)"/>
            <rect x="10" y="22" width="38" height="6" rx="3" fill="rgba(255,255,255,0.9)"/>
            <rect x="10" y="32" width="24" height="5" rx="2.5" fill="rgba(255,255,255,0.55)"/>
            <rect x="10" y="40" width="18" height="5" rx="2.5" fill="rgba(255,255,255,0.35)"/>
          </svg>
        </div>

        {/* ── Badges ── */}
        <div style={{ position: "absolute", right: "4%", bottom: "28%", animation: "pg-float-b 3.6s ease-in-out infinite", animationDelay: "0.5s", background: "linear-gradient(135deg, hsl(152,70%,38%), hsl(152,80%,25%))", color: "#fff", borderRadius: 10, padding: "8px 14px", fontWeight: 800, fontSize: 14, boxShadow: "0 10px 24px rgba(20,140,80,0.38)" }}>{t("visuals.pg.badges.provider")}</div>
        <div style={{ position: "absolute", left: "2%", top: "36%", animation: "pg-float-a 4.1s ease-in-out infinite", background: "linear-gradient(135deg, hsl(35,90%,55%), hsl(25,90%,45%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(220,120,30,0.35)" }}>Stripe</div>
        <div style={{ position: "absolute", right: "9%", top: "54%", animation: "pg-float-c 4.8s ease-in-out infinite", animationDelay: "1s", background: "linear-gradient(135deg, hsl(214,80%,52%), hsl(214,80%,35%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(30,80,200,0.35)" }}>{t("visuals.pg.badges.countries")}</div>
        <div style={{ position: "absolute", left: "26%", top: "3%", animation: "pg-float-e 3.4s ease-in-out infinite", animationDelay: "0.3s", background: "linear-gradient(135deg, hsl(0,70%,55%), hsl(0,80%,40%))", color: "#fff", borderRadius: 10, padding: "7px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 10px 24px rgba(180,30,30,0.35)" }}>{t("visuals.pg.badges.recurring")}</div>
        <div style={{ position: "absolute", left: "18%", bottom: "4%", animation: "pg-float-b 4.3s ease-in-out infinite", animationDelay: "0.9s", background: "linear-gradient(135deg, hsl(280,75%,58%), hsl(280,80%,40%))", color: "#fff", borderRadius: 10, padding: "6px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 8px 20px rgba(140,50,220,0.35)" }}>{t("visuals.pg.badges.methods")}</div>
      </div>
    </div>
  );
}
