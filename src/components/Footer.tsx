import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

const servicePaths = ["/lms", "/hosting", "/maintenance", "/chatbot", "/app-dev", "/drm", "/channel", "/pg", "/content"];

export default function Footer() {
  const { t } = useTranslation();
  const serviceLabels = t("header.services", { returnObjects: true }) as string[];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 max-w-5xl pt-16 pb-[4.4rem]">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_auto] gap-12">
          <div className="flex flex-col gap-6">
            <span className="text-foreground" style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 800, fontSize: "1.625rem", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {t("header.logo")}
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold tracking-widest uppercase mb-2 text-foreground">{t("footer.company")}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{t("footer.address")}</p>
              <p className="text-xs text-muted-foreground">{t("footer.privacy")}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold tracking-widest uppercase mb-2 text-muted-foreground">{t("footer.time")}</p>
              <p className="text-sm text-muted-foreground">{t("footer.hours")}</p>
              <p className="text-sm text-muted-foreground">{t("footer.days")}</p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-xs mb-1 text-muted-foreground">{t("footer.newInquiry")}</p>
                <a href="tel:0233364338" className="text-lg tracking-tight transition-colors text-foreground hover:text-primary" style={{ fontWeight: 900 }}>02.336.4338</a>
              </div>
              <div>
                <p className="text-xs mb-1 text-muted-foreground">{t("footer.maintenanceInquiry")}</p>
                <a href="tel:0254044337" className="text-lg tracking-tight transition-colors text-foreground hover:text-primary" style={{ fontWeight: 900 }}>02.540.4337</a>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-5 text-foreground">{t("footer.links")}</p>
            <ul className="flex flex-col gap-1.5">
              <li>
                <a href="https://webheads.co.kr" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-1.5 transition-colors text-muted-foreground hover:text-foreground">
                  {t("footer.homepage")} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-5 text-foreground">Services</p>
            <ul className="flex flex-col gap-1.5">
              {serviceLabels.map((label, i) => {
                const isLms = servicePaths[i] === "/lms";
                return (
                  <li key={servicePaths[i]}>
                    <Link
                      to={servicePaths[i]}
                      className={`text-sm font-medium transition-colors ${
                        isLms ? "text-white font-semibold inline-block px-3 py-1" : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={isLms ? {
                        background: "hsl(250, 55%, 52%)",
                        borderRadius: "30% 70% 70% 30% / 60% 40% 60% 40%",
                      } : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl py-5 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
