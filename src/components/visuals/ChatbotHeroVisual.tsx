export default function ChatbotHeroVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <style>{`
        @keyframes cb-float-a { 0%,100%{transform:translateY(0px) rotate(-9deg);} 50%{transform:translateY(-13px) rotate(-9deg);} }
        @keyframes cb-float-b { 0%,100%{transform:translateY(0px) rotate(6deg);} 50%{transform:translateY(-10px) rotate(6deg);} }
        @keyframes cb-float-c { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
        @keyframes cb-float-e { 0%,100%{transform:translateY(0px) rotate(11deg);} 50%{transform:translateY(-15px) rotate(11deg);} }
        @keyframes cb-typing { 0%,100%{opacity:0.3;} 50%{opacity:1;} }
        @keyframes cb-appear { 0%{opacity:0;transform:translateY(8px);} 100%{opacity:1;transform:translateY(0);} }
      `}</style>

      <div style={{ width: 420, height: 420, position: "relative", perspective: "900px" }}>

        {/* ── Main Card: Chat Interface ── */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-52%, -48%) rotateX(10deg) rotateY(-18deg) rotateZ(4deg)",
          width: 250, height: 210,
          borderRadius: 22,
          background: "linear-gradient(145deg, hsl(192,30%,14%), hsl(192,40%,10%))",
          boxShadow: "0 28px 60px rgba(20,140,160,0.35), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}>
          {/* header */}
          <div style={{ padding: "12px 14px 8px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,hsl(192,80%,55%),hsl(192,70%,38%))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13 }}>🤖</span>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>웹헤즈 AI 챗봇</div>
              <div style={{ fontSize: 7, color: "hsl(192,80%,55%)" }}>● 응답 중</div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 7, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.07)", borderRadius: 6, padding: "2px 6px" }}>GPT-4o</div>
          </div>
          {/* messages */}
          <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
            {/* user msg */}
            <div style={{ alignSelf: "flex-end", background: "hsl(192,70%,38%)", borderRadius: "12px 12px 3px 12px", padding: "6px 10px", maxWidth: "75%" }}>
              <p style={{ fontSize: 8, color: "#fff", lineHeight: 1.4 }}>강의 진도율이 어떻게 되나요?</p>
            </div>
            {/* bot msg */}
            <div style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.08)", borderRadius: "12px 12px 12px 3px", padding: "6px 10px", maxWidth: "85%", animation: "cb-appear 0.5s ease-out" }}>
              <p style={{ fontSize: 8, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>현재 <strong style={{ color: "hsl(192,80%,65%)" }}>68%</strong> 진도를 완료하셨습니다. 목표까지 32%가 남았어요! 💪</p>
            </div>
            {/* user msg 2 */}
            <div style={{ alignSelf: "flex-end", background: "hsl(192,70%,38%)", borderRadius: "12px 12px 3px 12px", padding: "6px 10px", maxWidth: "65%" }}>
              <p style={{ fontSize: 8, color: "#fff", lineHeight: 1.4 }}>오늘 수강 가능한 강의는?</p>
            </div>
            {/* typing indicator */}
            <div style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.08)", borderRadius: "12px 12px 12px 3px", padding: "8px 12px", display: "flex", gap: 4, alignItems: "center" }}>
              {[0,0.3,0.6].map((delay, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(192,70%,55%)", animation: `cb-typing 1.2s ease-in-out infinite`, animationDelay: `${delay}s` }} />
              ))}
            </div>
          </div>
          {/* input bar */}
          <div style={{ position: "absolute", bottom: 8, left: 10, right: 10, background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "6px 10px", display: "flex", alignItems: "center", gap: 6, border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.25)", flex: 1 }}>메시지를 입력하세요...</span>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "hsl(192,70%,42%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 8, color: "#fff" }}>↑</span>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
        </div>

        {/* ── Floating: Brain/AI icon ── */}
        <div style={{ position: "absolute", left: "8%", top: "8%", animation: "cb-float-a 3.8s ease-in-out infinite", filter: "drop-shadow(0 12px 20px rgba(20,140,160,0.3))" }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <defs><linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(192,80%,60%)"/><stop offset="100%" stopColor="hsl(192,70%,35%)"/></linearGradient></defs>
            <rect width="64" height="64" rx="18" fill="url(#brainGrad)"/>
            <text x="32" y="44" textAnchor="middle" fontSize="30" fill="white">🧠</text>
          </svg>
        </div>

        {/* ── Floating: Chat bubble icon ── */}
        <div style={{ position: "absolute", right: "6%", top: "10%", animation: "cb-float-e 4.2s ease-in-out infinite", animationDelay: "0.7s", filter: "drop-shadow(0 12px 20px rgba(130,50,220,0.3))" }}>
          <svg width="62" height="62" viewBox="0 0 62 62">
            <defs><linearGradient id="chatIconGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs>
            <rect width="62" height="62" rx="16" fill="url(#chatIconGrad)"/>
            <rect x="12" y="15" width="38" height="26" rx="8" fill="rgba(255,255,255,0.9)"/>
            <polygon points="16,41 12,52 26,41" fill="rgba(255,255,255,0.9)"/>
            <rect x="18" y="22" width="22" height="3" rx="1.5" fill="#7c3aed"/>
            <rect x="18" y="29" width="16" height="3" rx="1.5" fill="#7c3aed" opacity="0.5"/>
          </svg>
        </div>

        {/* ── Floating: RAG / DB icon ── */}
        <div style={{ position: "absolute", left: "5%", bottom: "20%", animation: "cb-float-c 4.5s ease-in-out infinite", animationDelay: "1.1s", filter: "drop-shadow(0 10px 18px rgba(250,160,30,0.3))" }}>
          <svg width="58" height="58" viewBox="0 0 58 58">
            <defs><linearGradient id="ragGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fb923c"/><stop offset="100%" stopColor="#ea580c"/></linearGradient></defs>
            <rect width="58" height="58" rx="15" fill="url(#ragGrad)"/>
            <ellipse cx="29" cy="19" rx="14" ry="5" fill="rgba(255,255,255,0.85)"/>
            <rect x="15" y="19" width="28" height="10" fill="rgba(255,255,255,0.65)"/>
            <ellipse cx="29" cy="29" rx="14" ry="5" fill="rgba(255,255,255,0.85)"/>
            <rect x="15" y="29" width="28" height="10" fill="rgba(255,255,255,0.65)"/>
            <ellipse cx="29" cy="39" rx="14" ry="5" fill="rgba(255,255,255,0.85)"/>
          </svg>
        </div>

        {/* ── Badges ── */}
        <div style={{ position: "absolute", right: "4%", bottom: "28%", animation: "cb-float-b 3.6s ease-in-out infinite", animationDelay: "0.5s", background: "linear-gradient(135deg, hsl(192,80%,42%), hsl(192,70%,28%))", color: "#fff", borderRadius: 10, padding: "8px 14px", fontWeight: 800, fontSize: 14, boxShadow: "0 10px 24px rgba(20,140,160,0.38)", whiteSpace: "nowrap" }}>GPT-4o</div>
        <div style={{ position: "absolute", left: "2%", top: "36%", animation: "cb-float-a 4.1s ease-in-out infinite", background: "linear-gradient(135deg, hsl(280,75%,58%), hsl(280,80%,40%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(140,50,220,0.35)" }}>RAG</div>
        <div style={{ position: "absolute", right: "9%", top: "54%", animation: "cb-float-c 4.8s ease-in-out infinite", animationDelay: "1s", background: "linear-gradient(135deg, hsl(35,90%,55%), hsl(25,90%,45%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(220,120,30,0.35)" }}>24/7</div>
        <div style={{ position: "absolute", left: "28%", top: "3%", animation: "cb-float-e 3.4s ease-in-out infinite", animationDelay: "0.3s", background: "linear-gradient(135deg, hsl(152,70%,40%), hsl(152,80%,28%))", color: "#fff", borderRadius: 10, padding: "7px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 10px 24px rgba(30,160,90,0.35)" }}>다국어</div>
        <div style={{ position: "absolute", left: "18%", bottom: "4%", animation: "cb-float-b 4.3s ease-in-out infinite", animationDelay: "0.9s", background: "linear-gradient(135deg, hsl(0,70%,55%), hsl(0,80%,40%))", color: "#fff", borderRadius: 10, padding: "6px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 8px 20px rgba(180,30,30,0.35)" }}>80% 자동화</div>
      </div>
    </div>
  );
}
