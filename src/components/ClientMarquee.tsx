import { useTranslation } from "react-i18next";

export default function ClientMarquee() {
  const { t } = useTranslation();
  const clients = t("lms.clients", { returnObjects: true }) as string[];

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
    <section className="py-4 -mt-6 overflow-hidden relative z-10" style={{ background: "var(--lms-page-bg)" }}>
      <div className="flex w-max marquee-track">
        <div className="flex shrink-0">{renderList()}</div>
        <div className="flex shrink-0">{renderList()}</div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 45s linear infinite;
        }
      `}</style>
    </section>
  );
}
