import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShieldCheck, MessageSquareText, MonitorSmartphone } from "lucide-react";
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
        isActive ? "text-foreground font-medium underline underline-offset-4 decoration-2" : "text-muted-foreground hover:text-foreground"
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

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 max-w-5xl pt-16 pb-[4.4rem]">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_auto] gap-12">
          <div className="flex flex-col gap-8">
            <span className="text-foreground" style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 700, fontSize: "1.625rem", fontStyle: "italic", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {t("header.logo")}
            </span>

            <div className="flex flex-col gap-6">
              {/* Company */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-normal tracking-[0.15em] uppercase text-foreground/40" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.company")}</p>
                <p className="text-[14px] leading-[1.7] font-normal text-foreground/70" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.address")}</p>
                <p className="text-[14px] font-normal text-foreground/70" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.privacy")}</p>
                
              </div>

              {/* Time */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-normal tracking-[0.15em] uppercase text-foreground/40" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.time")}</p>
                <p className="text-[14px] font-normal text-foreground/70" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.hours")}</p>
                <p className="text-[14px] font-normal text-foreground/70" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.days")}</p>
              </div>

              {/* Customer Center */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-normal tracking-[0.15em] uppercase text-foreground/40" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.customerCenter")}</p>
                <p className="text-[14px] font-normal text-primary" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.newPhone")}</p>
                <p className="text-[14px] font-normal text-primary" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.maintenancePhone")}</p>
              </div>

            </div>
          </div>
          <div>
            <p className="text-xs font-normal tracking-widest uppercase mb-5 text-foreground" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.links")}</p>
            <ul className="flex flex-col gap-1.5">
              <li>
                <a href="https://webheads.co.kr" target="_blank" rel="noopener noreferrer" className="text-sm font-normal flex items-center gap-1.5 transition-colors text-muted-foreground hover:text-foreground" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
                  <Home className="w-3.5 h-3.5" /> HOME
                </a>
              </li>
              <li>
                <Link to="/admin/login" className="text-sm font-normal flex items-center gap-1.5 transition-colors text-muted-foreground hover:text-foreground" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
                  <ShieldCheck className="w-3.5 h-3.5" /> {t("footer.admin")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-normal tracking-widest uppercase mb-5 text-foreground" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>Services</p>
            <ul className="flex flex-col gap-1.5">
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

      {/* Service Request Banner */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl py-5 flex items-center justify-start">
          <Link
            to="/service-request"
            className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
          >
            <MessageSquareText className="w-4 h-4" />
            SMS 충전 · 원격지원 요청
            <span className="text-primary-foreground/70">→</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl py-5 flex items-center justify-center">
          <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif", fontWeight: 400 }}>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
