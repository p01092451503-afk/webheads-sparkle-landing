import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer style={{ background: "hsl(0, 0%, 100%)", borderTop: "1px solid hsl(214, 20%, 88%)" }}>
      <div className="container mx-auto px-6 max-w-5xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">
          <div className="flex flex-col gap-6">
            <span style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.04em", lineHeight: 1, color: "hsl(220, 60%, 8%)" }}>
              {t("header.logo")}
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "hsl(220, 20%, 50%)" }}>{t("footer.company")}</p>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(220, 20%, 50%)" }}>{t("footer.address")}</p>
              <p className="text-xs" style={{ color: "hsl(220, 20%, 50%)" }}>{t("footer.privacy")}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "hsl(220, 20%, 50%)" }}>{t("footer.time")}</p>
              <p className="text-sm" style={{ color: "hsl(220, 20%, 50%)" }}>{t("footer.hours")}</p>
              <p className="text-sm" style={{ color: "hsl(220, 20%, 50%)" }}>{t("footer.days")}</p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-xs mb-1" style={{ color: "hsl(220, 20%, 50%)" }}>{t("footer.newInquiry")}</p>
                <a href="tel:0233364338" className="text-lg tracking-tight transition-colors" style={{ fontWeight: 900, color: "hsl(220, 60%, 8%)" }}>02.336.4338</a>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "hsl(220, 20%, 50%)" }}>{t("footer.maintenanceInquiry")}</p>
                <a href="tel:0254044337" className="text-lg tracking-tight transition-colors" style={{ fontWeight: 900, color: "hsl(220, 60%, 8%)" }}>02.540.4337</a>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "hsl(220, 20%, 50%)" }}>{t("footer.links")}</p>
            <ul className="flex flex-col gap-3 items-end">
              <li>
                <a href="https://webheads.co.kr" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-1.5 transition-colors" style={{ color: "hsl(220, 20%, 50%)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(220, 60%, 8%)")} onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(220, 20%, 50%)")}>
                  {t("footer.homepage")} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid hsl(214, 20%, 88%)" }}>
        <div className="container mx-auto px-6 max-w-5xl py-5 flex items-center justify-center">
          <p className="text-xs" style={{ color: "hsl(220, 20%, 50%)" }}>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
