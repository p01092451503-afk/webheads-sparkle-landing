import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShieldCheck } from "lucide-react";
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

function FooterServiceLink({ to, label, isActive }: { to: string; label: string; isActive: boolean }) {
  return (
    <Link
      to={to}
      className={`text-sm font-normal inline-block px-3 py-1 rounded-lg transition-colors duration-200 ${
        isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const serviceLabels = t("header.services", { returnObjects: true }) as string[];

  const fontStyle = { fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" };

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-6 max-w-5xl pt-14 pb-[4.4rem]">
        {/* Top: Logo + Customer Center */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
          <div className="flex flex-col gap-3">
            <span className="text-foreground" style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 700, fontSize: "1.625rem", fontStyle: "italic", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {t("header.logo")}
            </span>
            <p className="text-[13px] leading-[1.7] text-muted-foreground" style={fontStyle}>{t("footer.address")}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground/60 mb-1" style={fontStyle}>{t("footer.customerCenter")}</p>
            <p className="text-lg font-black text-primary" style={{ ...fontStyle, fontWeight: 900 }}>{t("footer.newPhone")}</p>
            <p className="text-lg font-black text-primary" style={{ ...fontStyle, fontWeight: 900 }}>{t("footer.maintenancePhone")}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-10" />

        {/* Bottom grid: Info columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground/60 mb-1" style={fontStyle}>{t("footer.company")}</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed" style={fontStyle}>{t("footer.privacy")}</p>
          </div>

          {/* Business Hours */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground/60 mb-1" style={fontStyle}>{t("footer.time")}</p>
            <p className="text-[13px] text-muted-foreground" style={fontStyle}>{t("footer.hours")}</p>
            <p className="text-[13px] text-muted-foreground" style={fontStyle}>{t("footer.days")}</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground/60 mb-1" style={fontStyle}>{t("footer.links")}</p>
            <a href="https://webheads.co.kr" target="_blank" rel="noopener noreferrer" className="text-[13px] flex items-center gap-1.5 transition-colors text-muted-foreground hover:text-foreground" style={fontStyle}>
              <Home className="w-3.5 h-3.5" /> HOME
            </a>
            <Link to="/admin/login" className="text-[13px] flex items-center gap-1.5 transition-colors text-muted-foreground hover:text-foreground" style={fontStyle}>
              <ShieldCheck className="w-3.5 h-3.5" /> {t("footer.admin")}
            </Link>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground/60 mb-1" style={fontStyle}>Services</p>
            <ul className="flex flex-col gap-1">
              {serviceLabels.map((label, i) => {
                const isActive = location.pathname === servicePaths[i];
                return (
                  <li key={servicePaths[i]}>
                    <FooterServiceLink to={servicePaths[i]} label={label} isActive={isActive} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl py-5 flex items-center justify-center">
          <p className="text-xs text-muted-foreground" style={{ ...fontStyle, fontWeight: 400 }}>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
