import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const shouldReserveBannerSpace = () => {
      try {
        const dismissed = localStorage.getItem("promo_banner_dismissed");
        if (dismissed) {
          const dismissedAt = new Date(dismissed).getTime();
          const oneDay = 24 * 60 * 60 * 1000;
          if (Date.now() - dismissedAt < oneDay) return false;
        }
      } catch {
        return false;
      }
      return new Date() <= new Date("2026-03-31T23:59:59+09:00");
    };

    if (hash) {
      const id = hash.replace("#", "");
      const scrollToTarget = (headerOffset: number) => {
        requestAnimationFrame(() => {
          const target = document.getElementById(id);
          if (!target) return;
          const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top, behavior: "instant" });
        });
      };

      const reserveBannerSpace = shouldReserveBannerSpace();
      scrollToTarget(reserveBannerSpace ? 100 : 56);

      if (reserveBannerSpace) {
        const timer = window.setTimeout(() => scrollToTarget(100), 2100);
        return () => window.clearTimeout(timer);
      }
      return;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
