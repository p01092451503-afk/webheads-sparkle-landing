import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target) {
          const header = document.querySelector("header.fixed") as HTMLElement | null;
          const headerOffset = header ? header.getBoundingClientRect().bottom : 56;
          const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
          window.scrollTo({ top, behavior: "auto" });
        }
      });
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
