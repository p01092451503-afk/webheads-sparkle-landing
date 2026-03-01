import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Monitor, Tablet, Smartphone, Check } from "lucide-react";

const devices = [
  { icon: Monitor, label: "PC", delay: 0 },
  { icon: Tablet, label: "Tablet", delay: 150 },
  { icon: Smartphone, label: "Mobile", delay: 300 },
];

export default function DeviceFriendlySection() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const features = t("lms.deviceSection.features", { returnObjects: true, defaultValue: [] }) as string[][];

  return (
    <section className="py-20 md:py-28" style={{ background: "var(--lms-section-alt)" }}>
      <div className="container mx-auto px-5 md:px-6 max-w-5xl" ref={ref}>
        <div className="mb-12 md:mb-16">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4"
            style={{ color: "hsl(var(--lms-primary))" }}
          >
            {t("lms.deviceSection.sub")}
          </p>
          <h2 className="font-bold leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line text-foreground">
            {t("lms.deviceSection.title")}
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
            {t("lms.deviceSection.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {devices.map(({ icon: Icon, label }, i) => {
            const isHovered = hoveredIdx === i;
            const deviceFeatures = Array.isArray(features) && features[i] ? features[i] : [];

            return (
              <div
                key={label}
                className="rounded-2xl p-6 md:p-7 flex flex-col items-center text-center bg-background cursor-default"
                style={{
                  border: isHovered
                    ? "1.5px solid hsl(var(--lms-primary) / 0.4)"
                    : "1px solid hsl(var(--lms-card-border))",
                  boxShadow: isHovered
                    ? "0 8px 32px -8px hsl(var(--lms-primary) / 0.15)"
                    : "0 2px 12px -4px hsl(var(--foreground) / 0.04)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s, border 0.3s ease, box-shadow 0.3s ease`,
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Animated Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative overflow-hidden"
                  style={{
                    background: isHovered
                      ? "hsl(var(--lms-primary) / 0.12)"
                      : "var(--lms-gradient-subtle)",
                    transition: "background 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <Icon
                    className="w-7 h-7 relative z-10"
                    style={{
                      color: "hsl(var(--lms-primary))",
                      transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      transform: isHovered ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                  {/* Pulse ring on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      border: "2px solid hsl(var(--lms-primary) / 0.2)",
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? "scale(1.15)" : "scale(0.8)",
                      transition: "opacity 0.3s ease, transform 0.4s ease",
                    }}
                  />
                </div>

                <h3 className="font-bold text-lg text-foreground mb-2">{label}</h3>
                <p
                  className="text-sm leading-relaxed text-muted-foreground mb-4"
                  style={{ wordBreak: "keep-all" }}
                >
                  {t(`lms.deviceSection.${label.toLowerCase()}`)}
                </p>

                {/* Feature chips */}
                {deviceFeatures.length > 0 && (
                  <div
                    className="flex flex-wrap justify-center gap-1.5 mt-auto"
                    style={{
                      opacity: visible ? 1 : 0,
                      transition: `opacity 0.5s ease ${i * 0.15 + 0.3}s`,
                    }}
                  >
                    {deviceFeatures.map((feat: string, fi: number) => (
                      <span
                        key={fi}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: "hsl(var(--lms-primary) / 0.08)",
                          color: "hsl(var(--lms-primary))",
                        }}
                      >
                        <Check className="w-3 h-3" />
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
