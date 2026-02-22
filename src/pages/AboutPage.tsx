import {
  Building2, Users, Calendar, MapPin, Phone, Mail, Globe,
  Award, Server, Bot, Smartphone, Film, ShieldCheck, Wrench,
  BookOpen, MonitorSmartphone, CreditCard, MessageCircle,
  ChevronRight, Briefcase, GraduationCap, Code2, Cloud,
  Shield, BarChart3, Zap
} from "lucide-react";
import ContactSection from "@/components/ContactSection";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";
import { LucideIcon } from "lucide-react";

const overviewIcons: LucideIcon[] = [Building2, Calendar, MapPin, Server, Phone, Globe, Award, Shield, Mail];
const orgIcons: LucideIcon[] = [Briefcase, Code2, Film, Server, Users];
const bizIcons: LucideIcon[] = [BookOpen, Cloud, Bot, ShieldCheck, Film, CreditCard];

export default function AboutPage() {
  const { t } = useTranslation();

  const overview = t("about.overview", { returnObjects: true }) as any[];
  const heroStats = t("about.heroStats", { returnObjects: true }) as any[];
  const orgTeams = t("about.orgTeams", { returnObjects: true }) as any[];
  const bizAreas = t("about.bizAreas", { returnObjects: true }) as any[];
  const features = t("about.features", { returnObjects: true }) as string[];
  const majorClients = t("about.majorClients", { returnObjects: true }) as any[];
  const clientLogos = t("about.clientLogos", { returnObjects: true }) as string[];
  const support = t("about.support", { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("about.seo.title")}
        description={t("about.seo.description")}
        keywords={t("about.seo.keywords")}
        path="/about"
      />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(220,60%,8%) 0%, hsl(214,60%,18%) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(214 90% 52% / 0.2) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(192, 90%, 55%)" }}>{t("about.hero.sub")}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                {t("about.hero.title1")}<br />{t("about.hero.title2")}<span style={{ color: "hsl(192, 90%, 55%)" }}>{t("about.hero.title3")}</span>
              </h1>
              <p className="text-white/60 text-lg mt-6 max-w-lg leading-relaxed">{t("about.hero.desc")}</p>
            </div>
            <div className="flex gap-6">
              {heroStats.map((s: any) => (
                <div key={s.label} className="text-center">
                  <span className="block text-3xl md:text-4xl font-black text-white">{s.value}</span>
                  <span className="block text-sm text-white/50 mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Company Overview ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("about.overviewSub")}</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">{t("about.overviewTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {overview.map((item: any, i: number) => {
              const Icon = overviewIcons[i] || Building2;
              return (
                <div key={item.label} className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/50 border border-border">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Organization ── */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("about.orgSub")}</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">{t("about.orgTitle")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("about.orgDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {orgTeams.map((team: any, i: number) => {
              const Icon = orgIcons[i] || Users;
              return (
                <div key={team.name} className="rounded-2xl bg-background p-6 border border-border text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="block text-3xl font-black text-foreground">{team.count}</span>
                  <h3 className="font-bold text-foreground text-sm mt-2">{team.name}</h3>
                  <p className="text-muted-foreground text-xs mt-1">{team.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Business Areas ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("about.bizSub")}</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">{t("about.bizTitle")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("about.bizDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bizAreas.map((area: any, i: number) => {
              const Icon = bizIcons[i] || Server;
              return (
                <div key={area.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-base tracking-tight">{area.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">{area.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {area.tags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LMS Features ── */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("about.featuresSub")}</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">{t("about.featuresTitle")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("about.featuresDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f: string, i: number) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Major Clients ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("about.clientsSub")}</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">{t("about.clientsTitle")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("about.clientsDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {majorClients.map((client: any) => (
              <div key={client.name} className="rounded-2xl p-7 border border-border bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{client.name}</h3>
                    <p className="text-xs text-muted-foreground">{client.type}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{client.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border p-8 bg-secondary/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5 text-center">{t("about.clientLogosLabel")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {clientLogos.map((name: string) => (
                <span key={name} className="text-xs px-4 py-2 rounded-full border border-border bg-background font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Maintenance Policy ── */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("about.supportSub")}</p>
            <h2 className="font-black text-foreground text-3xl lg:text-4xl tracking-tight">{t("about.supportTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {support.map((item: any) => (
              <div key={item.title} className="rounded-2xl bg-background p-7 border border-border">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{item.tag}</span>
                <h3 className="font-bold text-foreground text-lg mt-4 mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <ContactSection />
    </div>
  );
}
