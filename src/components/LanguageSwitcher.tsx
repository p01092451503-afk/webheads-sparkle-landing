import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  scrolled?: boolean;
}

export default function LanguageSwitcher({ scrolled = true }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = async () => {
    const next = i18n.language === "ko" ? "en" : "ko";
    const { loadLocale } = await import("@/i18n/index");
    const data = await loadLocale(next);
    i18n.addResourceBundle(next, "translation", data, true, true);
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200 ${
        scrolled
          ? "text-foreground hover:bg-gray-100"
          : "text-white hover:bg-white/10"
      }`}
      aria-label={i18n.language === "ko" ? "Switch to English" : "한국어로 전환"}
    >
      <Globe className="w-[1.15rem] h-[1.15rem]" strokeWidth={2} />
    </button>
  );
}
