import { useTranslation } from "react-i18next";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const serviceConfig = [
  { key: "hosting", emoji: "🏗️", path: "/hosting", accent: "hsl(215, 75%, 52%)" },
  { key: "content", emoji: "🎬", path: "/content", accent: "hsl(35, 85%, 50%)" },
  { key: "drm", emoji: "🔒", path: "/drm", accent: "hsl(0, 65%, 52%)" },
  { key: "chatbot", emoji: "🤖", path: "/chatbot", accent: "hsl(260, 65%, 55%)" },
  { key: "app", emoji: "📱", path: "/app-dev", accent: "hsl(170, 60%, 40%)" },
  { key: "pg", emoji: "💳", path: "/pg", accent: "hsl(245, 60%, 55%)" },
  { key: "channel", emoji: "💬", path: "/channel", accent: "hsl(195, 80%, 42%)" },
  { key: "maintenance", emoji: "🛠️", path: "/maintenance", accent: "hsl(150, 55%, 40%)" },
];

export default function LmsEcosystemDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const services = t("lms.ecosystem.services", { returnObjects: true }) as { name: string; emoji: string; problem: string; solution: string }[];
  const steps = t("lms.ecosystem.steps", { returnObjects: true }) as { emoji: string; text: string }[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] max-h-[88vh] overflow-y-auto p-0 rounded-3xl border-0 shadow-2xl gap-0">

        {/* Hero header — Toss-style large text */}
        <div className="px-8 pt-10 pb-6">
          <DialogHeader className="gap-0">
            <DialogTitle className="text-[1.7rem] font-extrabold leading-[1.25] tracking-tight text-foreground" style={{ wordBreak: "keep-all" }}>
              {t("lms.ecosystem.title")}
            </DialogTitle>
            <DialogDescription className="text-[0.95rem] text-muted-foreground leading-relaxed mt-3" style={{ wordBreak: "keep-all" }}>
              {t("lms.ecosystem.desc")}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Visual analogy — Toss-style storytelling card */}
        <div className="px-8 pb-6">
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(245, 50%, 96%) 0%, hsl(215, 60%, 95%) 100%)" }}
          >
            <p className="text-4xl mb-3">{t("lms.ecosystem.analogyEmoji")}</p>
            <p className="text-[0.925rem] font-semibold text-foreground leading-[1.7]" style={{ wordBreak: "keep-all" }}>
              {t("lms.ecosystem.analogy")}
            </p>
          </div>
        </div>

        {/* Step flow — Toss-style 3-step */}
        <div className="px-8 pb-5">
          <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-4">{t("lms.ecosystem.stepsTitle")}</p>
          <div className="flex flex-col gap-2.5">
            {steps?.map((step, i) => (
              <div key={i} className="flex items-center gap-3.5 bg-secondary/60 rounded-xl px-4 py-3">
                <span className="text-xl shrink-0">{step.emoji}</span>
                <p className="text-sm font-medium text-foreground leading-snug" style={{ wordBreak: "keep-all" }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-8 border-t border-border" />

        {/* Service cards — Toss-style problem → solution */}
        <div className="px-8 pt-6 pb-2">
          <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-4">{t("lms.ecosystem.servicesTitle")}</p>
          <div className="flex flex-col gap-3">
            {serviceConfig.map((svc, i) => {
              const data = services?.[i];
              if (!data) return null;
              return (
                <button
                  key={svc.key}
                  onClick={() => { onOpenChange(false); navigate(svc.path); }}
                  className="text-left rounded-2xl p-5 bg-background border border-border/60 hover:border-border hover:shadow-md transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="text-2xl mt-0.5 shrink-0">{data.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="font-extrabold text-[0.95rem] text-foreground">{data.name}</h4>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2" style={{ wordBreak: "keep-all" }}>
                        <span className="font-semibold text-foreground/70">{data.problem}</span>
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: svc.accent, fontWeight: 600, wordBreak: "keep-all" }}>
                        → {data.solution}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-8 pt-4 pb-8">
          <a
            href="#contact"
            onClick={() => onOpenChange(false)}
            className="block text-center py-4 rounded-2xl font-bold text-[0.95rem] text-white transition-all hover:opacity-90 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(245, 58%, 55%), hsl(215, 80%, 52%))", boxShadow: "0 4px 20px -4px hsl(245, 60%, 55%, 0.35)" }}
          >
            {t("lms.ecosystem.cta")}
          </a>
          <p className="text-center text-xs text-muted-foreground mt-3">{t("lms.ecosystem.ctaSub")}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
