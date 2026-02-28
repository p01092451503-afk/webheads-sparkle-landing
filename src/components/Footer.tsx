import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShieldCheck, ChevronRight } from "lucide-react";
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

function FooterServiceLink({ to, label, isActive, blobColor }: { to: string; label: string; isActive: boolean; blobColor: string }) {
  const [hovered, setHovered] = useState(false);
  const showBlob = isActive || hovered;
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`text-sm font-normal inline-block px-3 py-1 transition-all duration-200 ${
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
  const location = useLocation();
  const serviceLabels = t("header.services", { returnObjects: true }) as string[];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 max-w-5xl pt-16 pb-[4.4rem]">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_auto] gap-12">
          <div className="flex flex-col gap-8">
            <span className="text-foreground" style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 400, fontSize: "1.625rem", letterSpacing: "-0.04em", lineHeight: 1 }}>
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
                <p className="text-[11px] font-normal tracking-[0.15em] uppercase text-foreground/40" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>고객센터</p>
                <p className="text-[14px] font-normal text-foreground/70" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>신규도입 : 02-336-4338</p>
                <p className="text-[14px] font-normal text-foreground/70" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>장애 및 유지보수 : 02-540-4337</p>
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
                  <ShieldCheck className="w-3.5 h-3.5" /> 관리자
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-normal tracking-widest uppercase mb-5 text-foreground" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>Services</p>
            <ul className="flex flex-col gap-1.5">
              {serviceLabels.map((label, i) => {
                const isActive = location.pathname === servicePaths[i];
                const blobColor = serviceBlobColors[servicePaths[i]] || "hsl(250, 55%, 52%)";
                return (
                  <li key={servicePaths[i]}>
                    <FooterServiceLink to={servicePaths[i]} label={label} isActive={isActive} blobColor={blobColor} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ── Customer Center ── */}
        <div className="mt-14 pt-10 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>고객센터</span>
            <a
              href="#contact"
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              aria-label="문의하기"
            >
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="flex flex-col gap-2 sm:border-l sm:border-border sm:pl-8">
            <div className="flex items-baseline gap-4">
              <a href="tel:02-336-4338" className="group flex items-baseline gap-3">
                <span className="text-sm text-muted-foreground font-medium" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>신규 도입 문의</span>
                <span className="text-2xl lg:text-[2rem] font-black tracking-tight text-primary group-hover:opacity-80 transition-opacity" style={{ fontFamily: "'Noto Sans', sans-serif" }}>02.336.4338</span>
              </a>
            </div>
            <div className="flex items-baseline gap-4">
              <a href="tel:02-540-4337" className="group flex items-baseline gap-3">
                <span className="text-sm text-muted-foreground font-medium" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>장애 및 유지보수 문의</span>
                <span className="text-2xl lg:text-[2rem] font-black tracking-tight text-primary group-hover:opacity-80 transition-opacity" style={{ fontFamily: "'Noto Sans', sans-serif" }}>02.540.4337</span>
              </a>
            </div>
            <div className="flex gap-6 mt-1">
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-muted-foreground font-medium">상담시간</span>
                <span className="text-xs text-foreground/70">평일 09:00 ~ 17:00</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-muted-foreground font-medium">휴무일</span>
                <span className="text-xs text-foreground/70">토요일, 일요일, 공휴일</span>
              </div>
            </div>
          </div>
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
