import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, GraduationCap, Briefcase, Landmark, Rocket, CheckCircle2, Lightbulb, Puzzle } from "lucide-react";

const tabIcons = [Rocket, Building2, GraduationCap, Briefcase, Landmark];

const addonRouteMap: Record<string, string> = {
  "PG 결제": "/pg", "PG Payment": "/pg",
  "AI 챗봇": "/chatbot", "AI Chatbot": "/chatbot",
  "콘텐츠 제작": "/content", "Content Dev": "/content",
  "DRM 보안": "/drm", "DRM Security": "/drm",
  "SMS 알림": "/sms-kakao", "SMS Alerts": "/sms-kakao",
  "유지보수": "/maintenance", "Maintenance": "/maintenance",
  "호스팅": "/hosting", "Hosting": "/hosting",
  "채널톡": "/channel", "Channel Talk": "/channel",
  "앱 개발": "/app", "App Dev": "/app",
};

export default function IndustryScenarioTabs() {
  const { t } = useTranslation();
  const tabs = t("lms.industryTabs.tabs", { returnObjects: true }) as {
    label: string;
    title: string;
    desc: string;
    points: string[];
    addons: string[];
    case: string;
    cta: string;
  }[];
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <section className="py-16 md:py-28" style={{ background: "var(--lms-section-alt)" }}>
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        <div className="mb-8 md:mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: "hsl(var(--lms-primary))" }}>
            {t("lms.industryTabs.sub")}
          </p>
          <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line">
            {t("lms.industryTabs.title")}
          </h2>
          <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base">{t("lms.industryTabs.desc")}</p>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-6 md:mb-8">
          {tabs.map((tab, i) => {
            const Icon = tabIcons[i] || Building2;
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`inline-flex items-center gap-1.5 md:gap-2 px-3.5 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 border ${
                  isActive
                    ? "text-white border-transparent shadow-md"
                    : "bg-background text-foreground border-border hover:border-muted-foreground/40"
                }`}
                style={isActive ? { background: "hsl(var(--lms-primary))" } : undefined}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          key={active}
          className="rounded-2xl border border-border bg-background p-5 md:p-10 animate-fade-in"
        >
          <h3 className="font-bold text-foreground text-xl lg:text-2xl mb-3 tracking-tight">{current.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6" style={{ wordBreak: "keep-all" }}>{current.desc}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {current.points.map((point, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" style={{ color: "hsl(var(--lms-primary))" }} />
                <span className="text-sm text-foreground leading-snug">{point}</span>
              </div>
            ))}
          </div>

          {/* Add-ons & Case Study */}
          {/* Recommended Add-ons */}
          <div className="rounded-xl p-5 bg-secondary mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Puzzle className="w-4 h-4" style={{ color: "hsl(var(--lms-primary))" }} />
              <span className="text-xs font-bold text-foreground tracking-wide">{t("lms.industryTabs.addonsLabel")}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.addons.map((addon) => {
                const href = addonRouteMap[addon];
                return href ? (
                  <a
                    key={addon}
                    href={href}
                    className="text-xs px-3 py-1.5 rounded-full font-semibold transition-opacity hover:opacity-80"
                    style={{ background: "hsl(var(--lms-primary) / 0.1)", color: "hsl(var(--lms-primary))" }}
                  >
                    {addon}
                  </a>
                ) : (
                  <span
                    key={addon}
                    className="text-xs px-3 py-1.5 rounded-full font-semibold"
                    style={{ background: "hsl(var(--lms-primary) / 0.1)", color: "hsl(var(--lms-primary))" }}
                  >
                    {addon}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Case Study */}
          <div className="rounded-xl p-5 bg-secondary mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4" style={{ color: "hsl(35, 90%, 50%)" }} />
              <span className="text-xs font-bold text-foreground tracking-wide">{t("lms.industryTabs.caseLabel")}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed" style={{ wordBreak: "keep-all" }}>
              {current.case}
            </p>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "hsl(var(--lms-primary))" }}
          >
            {current.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
