import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function ClientMarquee() {
  const { t } = useTranslation();
  const clients = t("lms.clients", { returnObjects: true }) as string[];
  const [visible, setVisible] = useState(true);

  const renderList = () =>
    clients.map((name, i) => (
      <span
        key={i}
        className="mx-5 shrink-0 text-sm font-semibold tracking-tight"
        style={{ color: "hsl(var(--muted-foreground) / 0.65)" }}
      >
        {name}
      </span>
    ));

  return (
    <section className="relative -mt-12 z-10" style={{ background: "var(--lms-page-bg)" }}>
      {visible && (
        <div className="py-4 overflow-hidden">
          <div className="flex w-max marquee-track">
            <div className="flex shrink-0">{renderList()}</div>
            <div className="flex shrink-0">{renderList()}</div>
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <button
          onClick={() => setVisible(!visible)}
          className="flex items-center gap-1 px-3 py-1 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          {visible ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {visible ? t("lms.clientsHide", "숨기기") : t("lms.clientsShow", "고객사 보기")}
        </button>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 65s linear infinite;
        }
      `}</style>
    </section>
  );
}
