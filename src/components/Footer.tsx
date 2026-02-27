import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const servicePaths = ["/lms", "/hosting", "/maintenance", "/chatbot", "/app-dev", "/drm", "/channel", "/pg", "/content"];

const serviceBlobColors: Record<string, string> = {
  "/lms": "hsl(250, 55%, 52%)",
  "/hosting": "hsl(250, 55%, 52%)",
  "/maintenance": "hsl(250, 55%, 52%)",
  "/chatbot": "hsl(192, 50%, 42%)",
  "/app-dev": "hsl(192, 50%, 42%)",
  "/drm": "hsl(235, 45%, 48%)",
  "/channel": "hsl(192, 50%, 42%)",
  "/pg": "hsl(235, 45%, 48%)",
  "/content": "hsl(235, 45%, 48%)",
};

function FooterServiceLink({ to, label, isLms, blobColor }: { to: string; label: string; isLms: boolean; blobColor: string }) {
  const [hovered, setHovered] = useState(false);
  const showBlob = isLms || hovered;
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`text-sm font-semibold inline-block px-3 py-1 transition-all duration-200 ${
        showBlob ? "text-white" : "text-muted-foreground"
      }`}
      style={showBlob ? {
        background: blobColor,
        borderRadius: "30% 70% 70% 30% / 60% 40% 60% 40%",
      } : undefined}
    >
      {label}
    </Link>
  );
}

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
              <p className="text-xs font-semibold tracking-widest uppercase mb-2 text-foreground">{t("footer.time")}</p>
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
                  웹헤즈 <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link to="/admin/login" className="text-sm font-medium flex items-center gap-1.5 transition-colors text-muted-foreground hover:text-foreground">
                  <ShieldCheck className="w-3.5 h-3.5" /> 관리자
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-5 text-foreground">Services</p>
            <ul className="flex flex-col gap-1.5">
              {serviceLabels.map((label, i) => {
                const isLms = servicePaths[i] === "/lms";
                const blobColor = serviceBlobColors[servicePaths[i]] || "hsl(250, 55%, 52%)";
                return (
                  <li key={servicePaths[i]}>
                    <FooterServiceLink to={servicePaths[i]} label={label} isLms={isLms} blobColor={blobColor} />
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
