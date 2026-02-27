import { useTranslation } from "react-i18next";

export default function ClientMarquee() {
  const { t } = useTranslation();
  const clients = t("lms.clients", { returnObjects: true }) as string[];

  // Duplicate for seamless loop
  const doubled = [...clients, ...clients];

  return (
    <section className="py-10 overflow-hidden" style={{ background: "var(--lms-page-bg)" }}>
      <div className="container mx-auto px-6 mb-6">
        <p
          className="text-center text-xs font-bold tracking-[0.2em] uppercase"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {title}
        </p>
      </div>

      <div className="relative">
        {/* Left/right fade masks */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
          style={{ background: `linear-gradient(to right, var(--lms-page-bg), transparent)` }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
          style={{ background: `linear-gradient(to left, var(--lms-page-bg), transparent)` }}
        />

        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((name, i) => (
            <span
              key={i}
              className="mx-5 inline-block text-sm font-semibold tracking-tight"
              style={{ color: "hsl(var(--muted-foreground) / 0.65)" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
