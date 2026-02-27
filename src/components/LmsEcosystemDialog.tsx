import { useTranslation } from "react-i18next";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── Mini SVG illustrations per service ── */
const HostingIcon = ({ color }: { color: string }) => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="8" y="8" width="28" height="10" rx="4" fill={color} opacity="0.15" />
    <rect x="8" y="26" width="28" height="10" rx="4" fill={color} opacity="0.10" />
    <circle cx="14" cy="13" r="2" fill={color} />
    <circle cx="14" cy="31" r="2" fill={color} opacity="0.5" />
    <rect x="20" y="12" width="10" height="2" rx="1" fill={color} opacity="0.4" />
    <rect x="20" y="30" width="8" height="2" rx="1" fill={color} opacity="0.3" />
    <rect x="21" y="18" width="2" height="8" rx="1" fill={color} opacity="0.25" />
    <path d="M18 22 L26 22" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" opacity="0.3" />
  </svg>
);

const ContentIcon = ({ color }: { color: string }) => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="6" y="10" width="32" height="20" rx="4" fill={color} opacity="0.13" />
    <polygon points="19,16 19,26 27,21" fill={color} />
    <rect x="10" y="33" width="24" height="3" rx="1.5" fill={color} opacity="0.15" />
    <rect x="10" y="33" width="14" height="3" rx="1.5" fill={color} opacity="0.4" />
    <circle cx="35" cy="13" r="3" fill={color} opacity="0.25" />
    <text x="34" y="15" fontSize="5" fill={color} fontWeight="700" textAnchor="middle">4K</text>
  </svg>
);

const DrmIcon = ({ color }: { color: string }) => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="12" y="18" width="20" height="18" rx="4" fill={color} opacity="0.13" />
    <path d="M16 18V14C16 10.7 18.7 8 22 8C25.3 8 28 10.7 28 14V18" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="22" cy="26" r="3" fill={color} />
    <rect x="21" y="28" width="2" height="4" rx="1" fill={color} />
  </svg>
);

const ChatbotIcon = ({ color }: { color: string }) => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="6" y="8" width="24" height="16" rx="4" fill={color} opacity="0.13" />
    <path d="M12 24L8 30V24Z" fill={color} opacity="0.13" />
    <rect x="11" y="13" width="14" height="2" rx="1" fill={color} opacity="0.4" />
    <rect x="11" y="17" width="9" height="2" rx="1" fill={color} opacity="0.25" />
    <rect x="18" y="22" width="20" height="12" rx="4" fill={color} opacity="0.2" />
    <path d="M32 34L36 38V34Z" fill={color} opacity="0.2" />
    <circle cx="24" cy="27" r="1.5" fill={color} />
    <circle cx="28" cy="27" r="1.5" fill={color} />
    <circle cx="32" cy="27" r="1.5" fill={color} />
  </svg>
);

const AppIcon = ({ color }: { color: string }) => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="13" y="4" width="18" height="36" rx="4" fill={color} opacity="0.12" />
    <rect x="15" y="10" width="14" height="20" rx="2" fill={color} opacity="0.08" />
    <circle cx="22" cy="36" r="2" fill={color} opacity="0.3" />
    <rect x="19" y="6" width="6" height="2" rx="1" fill={color} opacity="0.2" />
    <rect x="17" y="13" width="5" height="5" rx="1.5" fill={color} opacity="0.35" />
    <rect x="24" y="13" width="5" height="5" rx="1.5" fill={color} opacity="0.25" />
    <rect x="17" y="21" width="5" height="5" rx="1.5" fill={color} opacity="0.2" />
    <rect x="24" y="21" width="5" height="5" rx="1.5" fill={color} opacity="0.15" />
  </svg>
);

const PgIcon = ({ color }: { color: string }) => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="6" y="12" width="32" height="22" rx="4" fill={color} opacity="0.13" />
    <rect x="6" y="18" width="32" height="4" fill={color} opacity="0.2" />
    <rect x="10" y="26" width="12" height="2" rx="1" fill={color} opacity="0.3" />
    <rect x="10" y="30" width="8" height="2" rx="1" fill={color} opacity="0.2" />
    <circle cx="33" cy="28" r="3.5" fill={color} opacity="0.25" />
    <path d="M31.5 28L32.5 29L35 27" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChannelIcon = ({ color }: { color: string }) => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <path d="M8 10H28C30.2 10 32 11.8 32 14V22C32 24.2 30.2 26 28 26H16L10 32V26H8C5.8 26 4 24.2 4 22V14C4 11.8 5.8 10 8 10Z" fill={color} opacity="0.15" />
    <rect x="10" y="15" width="18" height="2" rx="1" fill={color} opacity="0.35" />
    <rect x="10" y="19" width="12" height="2" rx="1" fill={color} opacity="0.2" />
    <circle cx="34" cy="14" r="6" fill={color} opacity="0.2" />
    <path d="M32 14L33.5 15.5L37 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 30L26 28H36C38.2 28 40 29.8 40 32V36C40 38.2 38.2 40 36 40H26C23.8 40 22 38.2 22 36V30Z" fill={color} opacity="0.1" />
    <rect x="25" y="33" width="8" height="1.5" rx="0.75" fill={color} opacity="0.25" />
    <rect x="25" y="36" width="5" height="1.5" rx="0.75" fill={color} opacity="0.15" />
  </svg>
);

const MaintenanceIcon = ({ color }: { color: string }) => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="14" fill={color} opacity="0.1" />
    <circle cx="22" cy="22" r="5" fill={color} opacity="0.25" />
    <rect x="20" y="2" width="4" height="8" rx="2" fill={color} opacity="0.2" />
    <rect x="20" y="34" width="4" height="8" rx="2" fill={color} opacity="0.2" />
    <rect x="34" y="20" width="8" height="4" rx="2" fill={color} opacity="0.2" />
    <rect x="2" y="20" width="8" height="4" rx="2" fill={color} opacity="0.2" />
    <path d="M31 11L26 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
    <path d="M13 31L18 26" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
    <path d="M22 17V22L25.5 25.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const serviceIllustrations: Record<string, React.FC<{ color: string }>> = {
  hosting: HostingIcon,
  content: ContentIcon,
  drm: DrmIcon,
  chatbot: ChatbotIcon,
  app: AppIcon,
  pg: PgIcon,
  channel: ChannelIcon,
  maintenance: MaintenanceIcon,
};

const serviceConfig = [
  { key: "hosting", path: "/hosting", accent: "hsl(215, 75%, 52%)", bg: "hsl(215, 80%, 96%)", cardBg: "hsl(215, 60%, 97%)" },
  { key: "content", path: "/content", accent: "hsl(35, 85%, 50%)", bg: "hsl(35, 85%, 95%)", cardBg: "hsl(35, 70%, 97%)" },
  { key: "drm", path: "/drm", accent: "hsl(0, 65%, 52%)", bg: "hsl(0, 60%, 96%)", cardBg: "hsl(0, 50%, 97%)" },
  { key: "chatbot", path: "/chatbot", accent: "hsl(260, 65%, 55%)", bg: "hsl(260, 60%, 96%)", cardBg: "hsl(260, 45%, 97%)" },
  { key: "app", path: "/app-dev", accent: "hsl(170, 60%, 40%)", bg: "hsl(170, 55%, 95%)", cardBg: "hsl(170, 40%, 96%)" },
  { key: "pg", path: "/pg", accent: "hsl(245, 60%, 55%)", bg: "hsl(245, 55%, 96%)", cardBg: "hsl(245, 40%, 97%)" },
  { key: "channel", path: "/channel", accent: "hsl(195, 80%, 42%)", bg: "hsl(195, 70%, 95%)", cardBg: "hsl(195, 50%, 96%)" },
  { key: "maintenance", path: "/maintenance", accent: "hsl(150, 55%, 40%)", bg: "hsl(150, 50%, 95%)", cardBg: "hsl(150, 35%, 96%)" },
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

        {/* Service cards — vertical grid layout */}
        <div className="px-8 pt-6 pb-2">
          <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-5">{t("lms.ecosystem.servicesTitle")}</p>
          <div className="grid grid-cols-2 gap-4">
            {serviceConfig.map((svc, i) => {
              const data = services?.[i];
              if (!data) return null;
              const Illustration = serviceIllustrations[svc.key];
              return (
                <button
                  key={svc.key}
                  onClick={() => { onOpenChange(false); navigate(svc.path); }}
                  className="text-left rounded-2xl p-5 bg-background border border-border/50 hover:shadow-lg transition-all duration-200 group cursor-pointer flex flex-col gap-3"
                >
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${svc.accent}18` }}
                  >
                    {Illustration && <Illustration color={svc.accent} />}
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-[0.925rem] text-foreground leading-snug">{data.name}</h4>

                  {/* Description */}
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
