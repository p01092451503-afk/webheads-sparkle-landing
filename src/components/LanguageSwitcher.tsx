import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { SUPPORTED_LOCALES } from "@/i18n/index";

interface LanguageSwitcherProps {
  scrolled?: boolean;
}

export default function LanguageSwitcher({ scrolled = true }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = SUPPORTED_LOCALES.find((l) => l.code === i18n.language) || SUPPORTED_LOCALES[0];

  const switchLanguage = async (code: string) => {
    setOpen(false);
    if (code === i18n.language) return;
    const { loadLocale } = await import("@/i18n/index");
    const data = await loadLocale(code);
    i18n.addResourceBundle(code, "translation", data, true, true);
    i18n.changeLanguage(code);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 h-9 px-2.5 rounded-full transition-colors duration-200 ${
          scrolled
            ? "text-foreground hover:bg-muted"
            : "text-white hover:bg-white/10"
        }`}
        aria-label="Change language"
      >
        <Globe className="w-[1.1rem] h-[1.1rem]" strokeWidth={2} />
        <span className="text-xs font-bold tracking-wide">{currentLocale.short}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border border-border bg-background shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {SUPPORTED_LOCALES.map((locale) => (
            <button
              key={locale.code}
              onClick={() => switchLanguage(locale.code)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                locale.code === i18n.language
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="font-mono text-xs w-6 text-center opacity-60">{locale.short}</span>
              <span>{locale.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
