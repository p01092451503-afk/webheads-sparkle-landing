import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function AnimatedNumber({ target, duration = 2000, suffix = "", pause = 2500 }: { target: number; duration?: number; suffix?: string; pause?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const runAnimation = () => {
      const start = performance.now();
      const animate = (now: number) => {
        if (cancelled) return;
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => {
            if (!cancelled) {
              setValue(0);
              setTimeout(() => { if (!cancelled) runAnimation(); }, 400);
            }
          }, pause);
        }
      };
      requestAnimationFrame(animate);
    };
    runAnimation();
    return () => { cancelled = true; };
  }, [target, duration, pause]);

  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{value.toLocaleString()}{suffix}</span>;
}

export default function LmsHeroVisual() {
  const { t } = useTranslation();
  const courses = t("visuals.lms.courses", { returnObjects: true }) as string[];
  const lmsStats = t("visuals.lms.stats", { returnObjects: true }) as string[][];

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <style>{`
        @keyframes lms2-float-a { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-16px) rotate(-3deg)} }
        @keyframes lms2-float-b { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-12px) rotate(2deg)} }
        @keyframes lms2-float-c { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes lms2-float-d { 0%,100%{transform:translateY(0) rotate(5deg)} 50%{transform:translateY(-10px) rotate(5deg)} }
        @keyframes lms2-glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes lms2-progress { 0%{width:0%} 35%{width:var(--target)} 75%{width:var(--target)} 85%{width:0%} 100%{width:0%} }
        @keyframes lms2-orbit { 0%{transform:rotate(0deg) translateX(180px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(180px) rotate(-360deg)} }
        @keyframes lms2-ring { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes lms2-dot-pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
      `}</style>

      <div style={{ width: 460, height: 460, position: "relative", perspective: "1000px" }}>

        {/* ══ Background orbit ring ══ */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: 360, height: 360,
          marginLeft: -180, marginTop: -180,
          borderRadius: "50%",
          border: "1px solid hsl(255, 60%, 50%, 0.12)",
          animation: "lms2-ring 30s linear infinite",
        }}>
          {[0, 90, 180, 270].map((deg) => (
            <div key={deg} style={{
              position: "absolute", left: "50%", top: "50%",
              width: 6, height: 6, borderRadius: "50%",
              background: `hsl(${255 + deg * 0.2}, 70%, 60%)`,
              boxShadow: `0 0 8px hsl(${255 + deg * 0.2}, 70%, 60%, 0.5)`,
              transform: `rotate(${deg}deg) translateX(180px)`,
              animation: `lms2-dot-pulse 2s ease-in-out infinite`,
              animationDelay: `${deg * 10}ms`,
            }} />
          ))}
        </div>

        {/* ══ Main Card: LMS Dashboard (Glass) ══ */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-52%, -48%) rotateX(8deg) rotateY(-15deg) rotateZ(3deg)",
          width: 290, height: 220, borderRadius: 24,
          background: "linear-gradient(145deg, hsl(255, 60%, 18%, 0.95) 0%, hsl(250, 70%, 12%, 0.98) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 32px 64px rgba(100,50,200,0.35), 0 0 80px rgba(120,60,255,0.08), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
          overflow: "hidden",
          border: "1px solid hsl(255, 50%, 30%, 0.4)",
        }}>
          {/* Top bar */}
          <div style={{ padding: "12px 16px 8px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid hsl(255, 40%, 25%, 0.3)" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
            <div style={{ marginLeft: "auto", fontSize: 8, color: "hsl(255, 60%, 70%, 0.6)", fontFamily: "monospace", letterSpacing: "0.1em" }}>ATOM LMS</div>
          </div>

          {/* Course rows */}
          {[
            { label: courses[0], progress: 85, color: "hsl(270, 80%, 70%)" },
            { label: courses[1], progress: 62, color: "hsl(220, 90%, 70%)" },
            { label: courses[2], progress: 94, color: "hsl(160, 70%, 60%)" },
          ].map((course, i) => (
            <div key={i} style={{ padding: "6px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 8,
                background: `linear-gradient(135deg, ${course.color}30, ${course.color}10)`,
                border: `1px solid ${course.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800, color: course.color,
              }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", marginBottom: 3, fontWeight: 500 }}>{course.label}</div>
                <div style={{ width: "100%", height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    background: `linear-gradient(90deg, ${course.color}, ${course.color}cc)`,
                    boxShadow: `0 0 8px ${course.color}40`,
                    "--target": `${course.progress}%`,
                    animation: `lms2-progress ${3.5 + i * 0.5}s cubic-bezier(0.22, 1, 0.36, 1) infinite`,
                  } as React.CSSProperties} />
                </div>
              </div>
              <span style={{ fontSize: 10, color: course.color, fontWeight: 800, minWidth: 32, textAlign: "right" }}>{course.progress}%</span>
            </div>
          ))}

          {/* Stats row */}
          <div style={{ padding: "10px 16px 8px", display: "flex", gap: 8, marginTop: 2 }}>
            {[
              { label: lmsStats[0][0], value: 1240, suffix: lmsStats[0][1], color: "hsl(270, 80%, 70%)" },
              { label: lmsStats[1][0], value: 56, suffix: lmsStats[1][1], color: "hsl(220, 90%, 70%)" },
              { label: lmsStats[2][0], value: 89, suffix: lmsStats[2][1], color: "hsl(160, 70%, 60%)" },
            ].map((stat) => (
              <div key={stat.label} style={{ flex: 1, textAlign: "center", background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "6px 4px" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", marginTop: 3, fontWeight: 600, letterSpacing: "0.05em" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Glass overlay */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)", pointerEvents: "none" }} />
        </div>

        {/* ══ Floating Card: AI Tutor ══ */}
        <div style={{
          position: "absolute", right: "2%", top: "8%",
          animation: "lms2-float-a 4.2s ease-in-out infinite",
          animationDelay: "0.3s",
        }}>
          <div style={{
            background: "linear-gradient(135deg, hsl(255, 80%, 55%), hsl(280, 75%, 45%))",
            borderRadius: 14, padding: "10px 16px",
            boxShadow: "0 12px 28px rgba(120,60,220,0.4), 0 0 20px rgba(140,80,255,0.15)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <path d="M7 10l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>AI Tutor</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Auto Grading</div>
            </div>
          </div>
        </div>

        {/* ══ Floating Card: Graduation Cap ══ */}
        <div style={{
          position: "absolute", left: "4%", top: "4%",
          animation: "lms2-float-b 3.8s ease-in-out infinite",
          filter: "drop-shadow(0 14px 24px rgba(120,60,220,0.3))",
        }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="capGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(255, 80%, 70%)" />
                <stop offset="100%" stopColor="hsl(270, 75%, 45%)" />
              </linearGradient>
            </defs>
            <polygon points="32,10 58,26 32,42 6,26" fill="url(#capGrad2)" />
            <polygon points="32,42 58,26 58,34 32,50 6,34 6,26" fill="hsl(270, 65%, 35%)" opacity="0.5" />
            <line x1="50" y1="30" x2="50" y2="48" stroke="hsl(45, 90%, 65%)" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="3" fill="hsl(45, 90%, 65%)" style={{ animation: "lms2-glow 2s ease-in-out infinite" }} />
          </svg>
        </div>

        {/* ══ Floating: Play/Video ══ */}
        <div style={{
          position: "absolute", right: "8%", bottom: "28%",
          animation: "lms2-float-d 4.5s ease-in-out infinite",
          animationDelay: "0.8s",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: "linear-gradient(135deg, hsl(220, 90%, 55%), hsl(200, 85%, 45%))",
            boxShadow: "0 12px 28px rgba(40,100,220,0.4), 0 0 16px rgba(60,120,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <polygon points="6,3 6,17 18,10" fill="rgba(255,255,255,0.9)" />
            </svg>
          </div>
        </div>

        {/* ══ Floating: Language Badge ══ */}
        <div style={{
          position: "absolute", left: "12%", bottom: "8%",
          animation: "lms2-float-c 4s ease-in-out infinite",
          animationDelay: "1.2s",
        }}>
          <div style={{
            background: "linear-gradient(135deg, hsl(214, 85%, 50%), hsl(200, 80%, 40%))",
            borderRadius: 12, padding: "8px 14px",
            boxShadow: "0 10px 24px rgba(30,80,200,0.35), 0 0 16px rgba(40,100,255,0.1)",
            fontSize: 12, fontWeight: 800, color: "#fff",
            letterSpacing: "-0.01em",
          }}>
            🌐 11 Languages
          </div>
        </div>

        {/* ══ Floating: DRM Shield ══ */}
        <div style={{
          position: "absolute", left: "2%", bottom: "32%",
          animation: "lms2-float-a 3.6s ease-in-out infinite",
          animationDelay: "0.6s",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg, hsl(160, 70%, 45%), hsl(145, 75%, 35%))",
            boxShadow: "0 10px 24px rgba(30,160,90,0.35), 0 0 12px rgba(40,180,100,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V5l7-3z" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <path d="M7 10l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* ══ Floating: 300+ badge ══ */}
        <div style={{
          position: "absolute", right: "4%", bottom: "8%",
          animation: "lms2-float-b 4.3s ease-in-out infinite",
          animationDelay: "1s",
        }}>
          <div style={{
            background: "linear-gradient(135deg, hsl(35, 90%, 55%), hsl(25, 85%, 45%))",
            borderRadius: 12, padding: "8px 14px",
            boxShadow: "0 10px 24px rgba(220,120,30,0.35)",
            fontSize: 14, fontWeight: 800, color: "#fff",
          }}>
            300+ <span style={{ fontSize: 9, fontWeight: 500, opacity: 0.7 }}>{t("visuals.lms.badges.openDays")}</span>
          </div>
        </div>

        {/* ══ Ambient glow behind main card ══ */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: 320, height: 250,
          marginLeft: -160, marginTop: -125,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, hsl(255, 75%, 50%, 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "lms2-glow 4s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}
