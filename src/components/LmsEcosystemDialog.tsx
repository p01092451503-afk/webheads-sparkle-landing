import { useTranslation } from "react-i18next";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Server, Video, ShieldCheck, Bot, Smartphone, CreditCard, MessageSquareMore, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

const serviceConfig: { key: string; path: string; accent: string; icon: LucideIcon }[] = [
  { key: "hosting", path: "/hosting", accent: "hsl(215, 75%, 52%)", icon: Server },
  { key: "content", path: "/content", accent: "hsl(35, 85%, 50%)", icon: Video },
  { key: "drm", path: "/drm", accent: "hsl(0, 65%, 52%)", icon: ShieldCheck },
  { key: "chatbot", path: "/chatbot", accent: "hsl(260, 65%, 55%)", icon: Bot },
  { key: "app", path: "/app-dev", accent: "hsl(170, 60%, 40%)", icon: Smartphone },
  { key: "pg", path: "/pg", accent: "hsl(245, 60%, 55%)", icon: CreditCard },
  { key: "channel", path: "/channel", accent: "hsl(195, 80%, 42%)", icon: MessageSquareMore },
  { key: "maintenance", path: "/maintenance", accent: "hsl(150, 55%, 40%)", icon: Wrench },
];

export default function LmsEcosystemDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const services = t("lms.ecosystem.services", { returnObjects: true }) as { name: string; emoji: string; problem: string; solution: string; detail?: string }[];
  const steps = t("lms.ecosystem.steps", { returnObjects: true }) as { emoji: string; text: string }[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[88vh] overflow-y-auto p-0 rounded-3xl border-0 shadow-2xl gap-0">

        {/* Hero header */}
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

        {/* Visual analogy */}
        <div className="px-8 pb-6">
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(245, 50%, 96%) 0%, hsl(215, 60%, 95%) 100%)" }}
          >
            <p className="text-[0.925rem] font-semibold text-foreground leading-[1.7]" style={{ wordBreak: "keep-all" }}>
              {t("lms.ecosystem.analogy")}
            </p>
          </div>
        </div>

        {/* Step flow */}
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

        <div className="mx-8 border-t border-border" />

        {/* Service cards — vertical grid layout with solid icons */}
        <div className="px-8 pt-6 pb-2">
          <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-5">{t("lms.ecosystem.servicesTitle")}</p>
          <div className="grid grid-cols-2 gap-4">
            {serviceConfig.map((svc, i) => {
              const data = services?.[i];
              if (!data) return null;
              const Icon = svc.icon;
              return (
                <button
                  key={svc.key}
                  onClick={() => { onOpenChange(false); navigate(svc.path); }}
                  className="text-left rounded-2xl p-5 bg-background border border-border/50 hover:shadow-lg transition-all duration-200 group cursor-pointer flex flex-col gap-3"
                >
                  <Icon className="w-7 h-7" style={{ color: svc.accent }} strokeWidth={2} />
                  <h4 className="font-bold text-[0.925rem] text-foreground leading-snug">{data.name}</h4>
                  <p className="text-[0.8rem] text-muted-foreground leading-relaxed" style={{ wordBreak: "keep-all" }}>
                    {data.problem}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA — minimal style */}
        <div className="px-8 pt-8 pb-10">
          <h3 className="font-bold text-[1.15rem] text-foreground leading-snug mb-2" style={{ wordBreak: "keep-all" }}>
            {t("lms.ecosystem.cta")}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5" style={{ wordBreak: "keep-all" }}>
            {t("lms.ecosystem.ctaSub")}
          </p>
          <a
            href="#contact"
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center px-5 py-2.5 rounded-2xl font-bold text-[0.875rem] text-white bg-foreground hover:opacity-90 transition-opacity"
          >
            {t("lms.ecosystem.cta")}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
