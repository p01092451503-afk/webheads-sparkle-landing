import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import {
  Server, Shield, MessageSquare, Smartphone, CreditCard, Megaphone, Wrench, Film,
  ArrowRight, Layers, BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const serviceConfig = [
  { key: "hosting", icon: Server, path: "/hosting", color: "hsl(215, 65%, 48%)", bg: "hsl(215, 70%, 94%)" },
  { key: "content", icon: Film, path: "/content", color: "hsl(35, 80%, 45%)", bg: "hsl(35, 80%, 93%)" },
  { key: "drm", icon: Shield, path: "/drm", color: "hsl(0, 65%, 50%)", bg: "hsl(0, 60%, 94%)" },
  { key: "chatbot", icon: MessageSquare, path: "/chatbot", color: "hsl(260, 60%, 50%)", bg: "hsl(260, 60%, 94%)" },
  { key: "app", icon: Smartphone, path: "/app-dev", color: "hsl(170, 55%, 38%)", bg: "hsl(170, 55%, 93%)" },
  { key: "pg", icon: CreditCard, path: "/pg", color: "hsl(245, 58%, 55%)", bg: "hsl(245, 60%, 94%)" },
  { key: "channel", icon: Megaphone, path: "/channel", color: "hsl(195, 80%, 40%)", bg: "hsl(195, 70%, 92%)" },
  { key: "maintenance", icon: Wrench, path: "/maintenance", color: "hsl(150, 50%, 38%)", bg: "hsl(150, 50%, 93%)" },
];

export default function LmsEcosystemDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const services = t("lms.ecosystem.services", { returnObjects: true }) as { name: string; why: string }[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--lms-gradient)" }}>
                <Layers className="w-4.5 h-4.5 text-white" />
              </div>
              <DialogTitle className="text-xl font-black tracking-tight text-foreground">
                {t("lms.ecosystem.title")}
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {t("lms.ecosystem.desc")}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Intro message */}
        <div className="px-6 pt-5 pb-2">
          <div className="rounded-2xl p-5 bg-secondary border border-border">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "hsl(var(--lms-primary))" }} />
              <p className="text-sm text-foreground leading-relaxed font-medium">
                {t("lms.ecosystem.intro")}
              </p>
            </div>
          </div>
        </div>

        {/* Service cards */}
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {serviceConfig.map((svc, i) => {
            const data = services?.[i];
            if (!data) return null;
            const Icon = svc.icon;
            return (
              <button
                key={svc.key}
                onClick={() => { onOpenChange(false); navigate(svc.path); }}
                className="text-left rounded-2xl p-4 border border-border bg-background hover:bg-secondary transition-colors duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: svc.bg }}>
                    <Icon className="w-4 h-4" style={{ color: svc.color }} />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{data.name}</h4>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{data.why}</p>
              </button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="px-6 pb-6">
          <a
            href="#contact"
            onClick={() => onOpenChange(false)}
            className="block text-center py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "var(--lms-gradient)", boxShadow: "var(--lms-shadow)" }}
          >
            {t("lms.ecosystem.cta")}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
