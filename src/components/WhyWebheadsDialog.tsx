import { useTranslation } from "react-i18next";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { CheckCircle, TrendingUp, Shield, Clock, Users, Headphones } from "lucide-react";

const reasons = [
  { icon: Clock, accentColor: "hsl(215, 75%, 52%)", bgColor: "hsl(215, 80%, 96%)" },
  { icon: TrendingUp, accentColor: "hsl(150, 55%, 40%)", bgColor: "hsl(150, 50%, 95%)" },
  { icon: Shield, accentColor: "hsl(245, 60%, 55%)", bgColor: "hsl(245, 55%, 96%)" },
  { icon: Users, accentColor: "hsl(35, 85%, 50%)", bgColor: "hsl(35, 85%, 95%)" },
  { icon: CheckCircle, accentColor: "hsl(195, 80%, 42%)", bgColor: "hsl(195, 70%, 95%)" },
  { icon: Headphones, accentColor: "hsl(0, 65%, 52%)", bgColor: "hsl(0, 60%, 96%)" },
];

export default function WhyWebheadsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useTranslation();
  const items = t("lms.whyWebheads.reasons", { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] max-h-[88vh] overflow-y-auto p-0 rounded-3xl border-0 shadow-2xl gap-0">
        {/* Header */}
        <div className="px-8 pt-10 pb-6">
          <DialogHeader className="gap-0">
            <DialogTitle className="text-[1.7rem] font-extrabold leading-[1.25] tracking-tight text-foreground" style={{ wordBreak: "keep-all" }}>
              {t("lms.whyWebheads.title")}
            </DialogTitle>
            <DialogDescription className="text-[0.95rem] text-muted-foreground leading-relaxed mt-3" style={{ wordBreak: "keep-all" }}>
              {t("lms.whyWebheads.desc")}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Highlight stat bar */}
        <div className="px-8 pb-6">
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "linear-gradient(135deg, hsl(245, 50%, 96%) 0%, hsl(215, 60%, 95%) 100%)" }}
          >
            <span className="text-3xl">🏆</span>
            <p className="text-[0.925rem] font-semibold text-foreground leading-[1.7]" style={{ wordBreak: "keep-all" }}>
              {t("lms.whyWebheads.highlight")}
            </p>
          </div>
        </div>

        <div className="mx-8 border-t border-border" />

        {/* Reason cards */}
        <div className="px-8 pt-6 pb-2">
          <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-4">{t("lms.whyWebheads.reasonsTitle")}</p>
          <div className="flex flex-col gap-3">
            {items?.map((item, i) => {
              const config = reasons[i] || reasons[0];
              const Icon = config.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-5 bg-background border border-border/60"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-[44px] h-[44px] rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: config.bgColor }}
                    >
                      <Icon className="w-5 h-5" style={{ color: config.accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-[0.95rem] text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed" style={{ wordBreak: "keep-all" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
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
            {t("lms.whyWebheads.cta")}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
