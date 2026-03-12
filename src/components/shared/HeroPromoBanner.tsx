import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Promotional banner displayed below hero sections on service pages.
 * Links to the /event page. Remove this component after the promotion ends.
 */
export default function HeroPromoBanner() {
  const { t } = useTranslation();
  const deadline = new Date("2026-03-31T23:59:59+09:00");
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const dDay = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  if (dDay <= 0) return null;

  return (
    <section className="py-3 border-b border-border" style={{ background: "hsl(245, 30%, 96%)" }}>
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        <Link
          to="/event"
          className="flex items-center justify-center gap-3 md:gap-4 text-xs md:text-sm font-medium group transition-opacity hover:opacity-80"
        >
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 shrink-0" fill="hsl(45, 100%, 50%)" style={{ color: "hsl(45, 100%, 50%)" }} />
            <span className="font-bold" style={{ color: "hsl(245, 60%, 50%)" }}>{t("promoBanner.title")}</span>
            <span className="text-muted-foreground hidden sm:inline">—</span>
            <span className="hidden sm:inline text-foreground">{t("promoBanner.desc")}</span>
          </span>
          <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: "hsl(245, 60%, 50%, 0.08)", color: "hsl(245, 60%, 50%)" }}>
            D-{dDay}
          </span>
        </Link>
      </div>
    </section>
  );
}
