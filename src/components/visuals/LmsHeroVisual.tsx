import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function AnimatedNumber({ target, duration = 1800, suffix = "", pause = 2000 }: { target: number; duration?: number; suffix?: string; pause?: number }) {
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
              setTimeout(() => { if (!cancelled) runAnimation(); }, 300);
            }
          }, pause);
        }
      };
      requestAnimationFrame(animate);
    };
    runAnimation();
    return () => { cancelled = true; };
  }, [target, duration, pause]);

  return <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value.toLocaleString()}{suffix}</div>;
}

export default function LmsHeroVisual() {
  const { t } = useTranslation();
  const courses = t("visuals.lms.courses", { returnObjects: true }) as string[];
  const lmsStats = t("visuals.lms.stats", { returnObjects: true }) as string[][];

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none" style={{ transform: "scale(1.02)", transformOrigin: "center center" }}>
      <style>{`
        @keyframes lms-float-a { 0%,100%{transform:translateY(0px) rotate(-6deg);} 50%{transform:translateY(-14px) rotate(-6deg);} }
        @keyframes lms-float-b { 0%,100%{transform:translateY(0px) rotate(5deg);} 50%{transform:translateY(-10px) rotate(5deg);} }
        @keyframes lms-float-c { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
        @keyframes lms-float-d { 0%,100%{transform:translateY(0px) rotate(8deg);} 50%{transform:translateY(-9px) rotate(8deg);} }
        @keyframes lms-float-e { 0%,100%{transform:translateY(0px) rotate(-4deg);} 50%{transform:translateY(-16px) rotate(-4deg);} }
        @keyframes lms-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(0.8);} }
        @keyframes lms-progress { 0%{width:0%} 40%{width:100%} 80%{width:100%} 85%{width:0%} 100%{width:0%} }
      `}</style>

      <div style={{ width: 340, height: 340, position: "relative", perspective: "900px" }}>

        {/* ══ Main Card: LMS Dashboard ══ */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-52%, -48%) rotateX(10deg) rotateY(-18deg) rotateZ(4deg)",
          width: 270, height: 200, borderRadius: 22,
          background: "linear-gradient(135deg, hsl(260,70%,22%) 0%, hsl(250,80%,15%) 100%)",
          boxShadow: "0 28px 60px rgba(80,40,160,0.38), 0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
            <div style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>LMS DASHBOARD</div>
          </div>

          {[
            { label: courses[0], progress: 85, color: "#a78bfa" },
            { label: courses[1], progress: 62, color: "#60a5fa" },
            { label: courses[2], progress: 94, color: "#34d399" },
          ].map((course, i) => (
            <div key={i} style={{ padding: "5px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `${course.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: course.color }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>{course.label}</div>
                <div style={{ width: "100%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div style={{ width: `${course.progress}%`, height: "100%", borderRadius: 2, background: course.color, animation: `lms-progress ${3.5 + i * 0.4}s cubic-bezier(0.22, 1, 0.36, 1) infinite`, transformOrigin: "left" }} />
                </div>
              </div>
              <span style={{ fontSize: 10, color: course.color, fontWeight: 700, minWidth: 30, textAlign: "right" }}>{course.progress}%</span>
            </div>
          ))}

          <div style={{ padding: "10px 16px 8px", display: "flex", gap: 12 }}>
            {[
              { label: lmsStats[0][0], value: 1240, suffix: lmsStats[0][1] },
              { label: lmsStats[1][0], value: 56, suffix: lmsStats[1][1] },
              { label: lmsStats[2][0], value: 89, suffix: lmsStats[2][1] },
            ].map((stat) => (
              <div key={stat.label} style={{ flex: 1, textAlign: "center" }}>
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />
        </div>

        {/* ══ Floating: Graduation Cap ══ */}
        <div style={{ position: "absolute", left: "8%", top: "4%", animation: "lms-float-a 3.8s ease-in-out infinite", filter: "drop-shadow(0 12px 20px rgba(120,60,220,0.28))" }}>
          <svg width="68" height="68" viewBox="0 0 68 68">
            <defs><linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(260,80%,65%)"/><stop offset="100%" stopColor="hsl(260,80%,40%)"/></linearGradient></defs>
            <polygon points="34,12 60,28 34,44 8,28" fill="url(#capGrad)"/>
            <polygon points="34,44 60,28 60,36 34,52 8,36 8,28" fill="hsl(260,70%,35%)" opacity="0.6"/>
            <line x1="52" y1="32" x2="52" y2="50" stroke="hsl(260,80%,65%)" strokeWidth="2"/>
            <circle cx="52" cy="52" r="3" fill="hsl(45,90%,60%)"/>
          </svg>
        </div>

        {/* ══ Floating: Play Button ══ */}
        <div style={{ position: "absolute", right: "4%", top: "6%", animation: "lms-float-e 4.2s ease-in-out infinite", animationDelay: "0.7s", filter: "drop-shadow(0 14px 22px rgba(60,130,220,0.3))" }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <defs><linearGradient id="playGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(214,90%,60%)"/><stop offset="100%" stopColor="hsl(214,80%,38%)"/></linearGradient></defs>
            <rect x="4" y="8" width="52" height="36" rx="8" fill="url(#playGrad)"/>
            <polygon points="24,18 24,38 40,28" fill="rgba(255,255,255,0.9)"/>
            <rect x="10" y="48" width="40" height="4" rx="2" fill="hsl(214,60%,70%)" opacity="0.5"/>
            <rect x="10" y="48" width="24" height="4" rx="2" fill="hsl(214,90%,60%)"/>
          </svg>
        </div>

        {/* ══ Floating: Book ══ */}
        <div style={{ position: "absolute", left: "2%", bottom: "14%", animation: "lms-float-c 4.5s ease-in-out infinite", animationDelay: "1.2s", filter: "drop-shadow(0 16px 24px rgba(100,60,200,0.28))" }}>
          <svg width="56" height="64" viewBox="0 0 56 64">
            <defs><linearGradient id="bookGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(45,90%,65%)"/><stop offset="100%" stopColor="hsl(35,90%,50%)"/></linearGradient></defs>
            <rect x="8" y="4" width="40" height="52" rx="4" fill="url(#bookGrad)"/>
            <rect x="6" y="6" width="4" height="48" rx="2" fill="hsl(35,80%,40%)"/>
            <rect x="16" y="14" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.6)"/>
            <rect x="16" y="21" width="18" height="3" rx="1.5" fill="rgba(255,255,255,0.4)"/>
            <rect x="16" y="28" width="22" height="3" rx="1.5" fill="rgba(255,255,255,0.4)"/>
            <circle cx="28" cy="42" r="6" fill="rgba(255,255,255,0.3)"/>
            <polyline points="25,42 27,44 32,39" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* ══ Badges ══ */}
        <div style={{ position: "absolute", right: "0%", bottom: "22%", animation: "lms-float-b 3.6s ease-in-out infinite", animationDelay: "0.5s", background: "linear-gradient(135deg, hsl(260,80%,60%), hsl(260,70%,42%))", color: "#fff", borderRadius: 10, padding: "8px 14px", fontWeight: 800, fontSize: 14, boxShadow: "0 10px 24px rgba(120,60,220,0.35)", whiteSpace: "nowrap" }}>AI <span style={{ fontSize: 9, fontWeight: 500, opacity: 0.8 }}>Tutor</span></div>
        <div style={{ position: "absolute", left: "-2%", top: "34%", animation: "lms-float-d 4.1s ease-in-out infinite", background: "linear-gradient(135deg, hsl(152,70%,45%), hsl(152,80%,30%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 14, boxShadow: "0 10px 24px rgba(30,160,90,0.35)" }}>300+</div>
        <div style={{ position: "absolute", right: "6%", top: "52%", animation: "lms-float-a 4.8s ease-in-out infinite", animationDelay: "1s", background: "linear-gradient(135deg, hsl(35,90%,55%), hsl(25,90%,45%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 13, boxShadow: "0 10px 24px rgba(220,120,30,0.35)" }}>{t("visuals.lms.badges.openDays")}</div>
        <div style={{ position: "absolute", left: "24%", top: "-2%", animation: "lms-float-d 3.4s ease-in-out infinite", animationDelay: "0.3s", background: "linear-gradient(135deg, hsl(214,90%,52%), hsl(214,80%,38%))", color: "#fff", borderRadius: 10, padding: "7px 13px", fontWeight: 800, fontSize: 12, boxShadow: "0 10px 24px rgba(30,80,200,0.35)" }}>11 Languages</div>
        <div style={{ position: "absolute", left: "16%", bottom: "-2%", animation: "lms-float-b 4.3s ease-in-out infinite", animationDelay: "0.9s", background: "linear-gradient(135deg, hsl(0,70%,55%), hsl(0,80%,40%))", color: "#fff", borderRadius: 10, padding: "6px 12px", fontWeight: 800, fontSize: 12, boxShadow: "0 8px 20px rgba(180,30,30,0.35)" }}>DRM</div>
      </div>
    </div>
  );
}
