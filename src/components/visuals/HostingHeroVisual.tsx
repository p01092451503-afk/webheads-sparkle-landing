export default function HostingHeroVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes float-a { 0%,100%{transform:translateY(0px) rotate(-8deg);} 50%{transform:translateY(-14px) rotate(-8deg);} }
        @keyframes float-b { 0%,100%{transform:translateY(0px) rotate(6deg);} 50%{transform:translateY(-10px) rotate(6deg);} }
        @keyframes float-c { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
        @keyframes float-d { 0%,100%{transform:translateY(0px) rotate(-4deg);} 50%{transform:translateY(-8px) rotate(-4deg);} }
        @keyframes float-e { 0%,100%{transform:translateY(0px) rotate(10deg);} 50%{transform:translateY(-16px) rotate(10deg);} }
        @keyframes float-badge1 { 0%,100%{transform:translateY(0px) rotate(-6deg);} 50%{transform:translateY(-10px) rotate(-6deg);} }
        @keyframes float-badge2 { 0%,100%{transform:translateY(0px) rotate(5deg);} 50%{transform:translateY(-8px) rotate(5deg);} }
        @keyframes float-badge3 { 0%,100%{transform:translateY(0px) rotate(-3deg);} 50%{transform:translateY(-12px) rotate(-3deg);} }
        @keyframes float-badge4 { 0%,100%{transform:translateY(0px) rotate(8deg);} 50%{transform:translateY(-9px) rotate(8deg);} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(0.8);} }
        @keyframes flow-line { 0%{stroke-dashoffset:60;} 100%{stroke-dashoffset:0;} }
      `}</style>

      {/* ── Container (perspective tilt) ── */}
      <div style={{ width: 420, height: 420, position: "relative", perspective: "900px" }}>

        {/* ══ Main Card: Server Dashboard ══ */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: "translate(-52%, -48%) rotateX(10deg) rotateY(-18deg) rotateZ(4deg)",
          width: 260, height: 190,
          borderRadius: 22,
          background: "linear-gradient(135deg, hsl(214,80%,22%) 0%, hsl(214,90%,15%) 100%)",
          boxShadow: "0 28px 60px rgba(30,60,120,0.38), 0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}>
          {/* Card top bar */}
          <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
            <div style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>SERVER MONITOR</div>
          </div>

          {/* Uptime indicator */}
          <div style={{ padding: "0 16px 8px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ animation: "pulse-dot 2s ease-in-out infinite", width: 8, height: 8, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399" }} />
            <span style={{ fontSize: 11, color: "#34d399", fontWeight: 700, letterSpacing: 1 }}>UPTIME 99.9%</span>
          </div>

          {/* Server rack items */}
          {[
            { label: "CDN Edge Node", load: 32, color: "#60a5fa" },
            { label: "AWS EC2 Auto Scale", load: 67, color: "#818cf8" },
            { label: "IDC Backup Server", load: 15, color: "#34d399" },
          ].map((srv, i) => (
            <div key={i} style={{ padding: "5px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              {/* mini server unit */}
              <div style={{
                width: 28, height: 16, borderRadius: 4,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ width: 14, height: 3, borderRadius: 2, background: `${srv.color}60` }}>
                  <div style={{ width: `${srv.load}%`, height: "100%", borderRadius: 2, background: srv.color }} />
                </div>
              </div>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", flex: 1 }}>{srv.label}</span>
              <span style={{ fontSize: 9, color: srv.color, fontWeight: 700 }}>{srv.load}%</span>
            </div>
          ))}

          {/* Network flow line SVG */}
          <div style={{ padding: "8px 16px 0" }}>
            <svg width="100%" height="28" viewBox="0 0 228 28">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                  <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <polyline points="0,14 30,8 60,18 90,6 120,16 150,4 180,14 228,10"
                fill="none" stroke="url(#lineGrad)" strokeWidth="1.5"
                strokeDasharray="60" style={{ animation: "flow-line 2s linear infinite" }} />
              {[30,90,150].map((x,i)=>(
                <circle key={i} cx={x} cy={[8,6,4][i]} r="2.5" fill="#60a5fa" style={{ animation: `pulse-dot ${1.5+i*0.3}s ease-in-out infinite`, animationDelay: `${i*0.4}s` }} />
              ))}
            </svg>
          </div>

          {/* Bottom stat row */}
          <div style={{ padding: "4px 16px", display: "flex", gap: 12 }}>
            {[["NOC", "24/7"], ["Nodes", "50+"], ["SLA", "99.9%"]].map(([k,v])=>(
              <div key={k} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{k}</div>
              </div>
            ))}
          </div>

          {/* Card shine overlay */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 22,
            background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />
        </div>

        {/* ══ Floating Object 1: Globe / CDN ══ */}
        <div style={{
          position: "absolute", left: "18%", top: "12%",
          animation: "float-a 3.8s ease-in-out infinite",
          filter: "drop-shadow(0 12px 20px rgba(30,80,200,0.28))",
        }}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <defs>
              <radialGradient id="globeGrad" cx="38%" cy="32%">
                <stop offset="0%" stopColor="hsl(214,90%,75%)" />
                <stop offset="100%" stopColor="hsl(214,90%,40%)" />
              </radialGradient>
            </defs>
            <circle cx="36" cy="36" r="30" fill="url(#globeGrad)" />
            <ellipse cx="36" cy="36" rx="14" ry="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            <ellipse cx="36" cy="36" rx="30" ry="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            <line x1="6" y1="36" x2="66" y2="36" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="36" y1="6" x2="36" y2="66" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            {/* highlight */}
            <circle cx="28" cy="24" r="6" fill="rgba(255,255,255,0.18)" />
          </svg>
        </div>

        {/* ══ Floating Object 2: Shield ══ */}
        <div style={{
          position: "absolute", right: "12%", top: "14%",
          animation: "float-e 4.2s ease-in-out infinite",
          animationDelay: "0.7s",
          filter: "drop-shadow(0 14px 22px rgba(30,180,100,0.3))",
        }}>
          <svg width="62" height="68" viewBox="0 0 62 68">
            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(152,80%,55%)" />
                <stop offset="100%" stopColor="hsl(152,70%,32%)" />
              </linearGradient>
            </defs>
            <path d="M31 4 L56 16 L56 36 Q56 55 31 64 Q6 55 6 36 L6 16 Z"
              fill="url(#shieldGrad)"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
            {/* inner highlight */}
            <path d="M31 10 L50 20 L50 36 Q50 51 31 59" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            {/* checkmark */}
            <polyline points="20,34 28,42 43,26" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* ══ Floating Object 3: Server Rack ══ */}
        <div style={{
          position: "absolute", left: "10%", bottom: "22%",
          animation: "float-c 4.5s ease-in-out infinite",
          animationDelay: "1.2s",
          filter: "drop-shadow(0 16px 24px rgba(100,100,200,0.28))",
        }}>
          <svg width="58" height="72" viewBox="0 0 58 72">
            <defs>
              <linearGradient id="rackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(220,15%,95%)" />
                <stop offset="100%" stopColor="hsl(220,15%,80%)" />
              </linearGradient>
            </defs>
            {/* rack body */}
            <rect x="4" y="4" width="50" height="64" rx="6" fill="url(#rackGrad)"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))" }} />
            {/* rack units */}
            {[14, 28, 42, 56].map((y, i) => (
              <g key={i}>
                <rect x="10" y={y} width="38" height="10" rx="3" fill="hsl(220,15%,88%)" />
                <circle cx="46" cy={y+5} r="2.5" fill={["#34d399","#60a5fa","#34d399","#facc15"][i]} style={{ animation: `pulse-dot ${1.8+i*0.3}s ease-in-out infinite`, animationDelay:`${i*0.3}s` }} />
                <rect x="13" y={y+3} width={[18,22,16,20][i]} height="4" rx="2" fill="hsl(220,15%,78%)" />
              </g>
            ))}
            {/* top highlight */}
            <rect x="4" y="4" width="50" height="14" rx="6" fill="rgba(255,255,255,0.4)" />
          </svg>
        </div>

        {/* ══ Badge Chips ══ */}

        {/* 99.9% badge */}
        <div style={{
          position: "absolute", right: "8%", bottom: "30%",
          animation: "float-badge2 3.6s ease-in-out infinite",
          animationDelay: "0.5s",
          background: "linear-gradient(135deg, hsl(214,90%,52%), hsl(214,80%,38%))",
          color: "#fff",
          borderRadius: 10,
          padding: "8px 14px",
          fontWeight: 800, fontSize: 15,
          letterSpacing: -0.5,
          boxShadow: "0 10px 24px rgba(30,80,200,0.35)",
          whiteSpace: "nowrap",
        }}>99.9% <span style={{ fontSize: 9, fontWeight: 500, opacity: 0.8 }}>SLA</span></div>

        {/* CDN badge */}
        <div style={{
          position: "absolute", left: "6%", top: "36%",
          animation: "float-badge1 4.1s ease-in-out infinite",
          background: "linear-gradient(135deg, hsl(260,75%,60%), hsl(260,80%,42%))",
          color: "#fff",
          borderRadius: 10,
          padding: "7px 13px",
          fontWeight: 800, fontSize: 14,
          boxShadow: "0 10px 24px rgba(120,60,220,0.35)",
        }}>CDN</div>

        {/* AWS badge */}
        <div style={{
          position: "absolute", right: "14%", top: "56%",
          animation: "float-badge3 4.8s ease-in-out infinite",
          animationDelay: "1s",
          background: "linear-gradient(135deg, hsl(35,90%,55%), hsl(25,90%,45%))",
          color: "#fff",
          borderRadius: 10,
          padding: "7px 13px",
          fontWeight: 800, fontSize: 13,
          boxShadow: "0 10px 24px rgba(220,120,30,0.35)",
        }}>AWS</div>

        {/* 24/7 badge */}
        <div style={{
          position: "absolute", left: "30%", top: "6%",
          animation: "float-badge4 3.4s ease-in-out infinite",
          animationDelay: "0.3s",
          background: "linear-gradient(135deg, hsl(152,70%,40%), hsl(152,80%,28%))",
          color: "#fff",
          borderRadius: 10,
          padding: "7px 13px",
          fontWeight: 800, fontSize: 13,
          boxShadow: "0 10px 24px rgba(30,160,90,0.35)",
        }}>24/7</div>

        {/* IDC badge */}
        <div style={{
          position: "absolute", left: "20%", bottom: "4%",
          animation: "float-b 4.3s ease-in-out infinite",
          animationDelay: "0.9s",
          background: "linear-gradient(135deg, hsl(0,70%,55%), hsl(0,80%,40%))",
          color: "#fff",
          borderRadius: 10,
          padding: "6px 12px",
          fontWeight: 800, fontSize: 12,
          boxShadow: "0 8px 20px rgba(180,30,30,0.35)",
        }}>IDC</div>

      </div>
    </div>
  );
}
