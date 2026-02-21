import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";
import ChatbotHeroVisual from "@/components/visuals/ChatbotHeroVisual";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import { ArrowLeft, Bot, Brain, MessageSquare, BarChart3, Link2, Globe, Zap, ShieldCheck, RefreshCw, Settings2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const featureIcons = [Brain, MessageSquare, Zap, Globe, Link2, BarChart3, ShieldCheck, RefreshCw, Users];

export default function ChatbotPage() {
  const { t } = useTranslation();

  const features = (t("chatbot.features", { returnObjects: true }) as any[]).map((item: any, index: number) => ({
    ...item,
    icon: featureIcons[index] || Brain
  }));
  const process = t("chatbot.process", { returnObjects: true }) as any[];
  const stats = t("chatbot.stats", { returnObjects: true }) as any[];
  const faqs = t("chatbot.faqs", { returnObjects: true }) as any[];
  const testimonials = t("chatbot.testimonials", { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t("chatbot.seo.title")} description={t("chatbot.seo.description")} keywords={t("chatbot.seo.keywords")} path="/chatbot" jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": "웹헤즈 AI 챗봇", "provider": { "@type": "Organization", "name": "웹헤즈" }, "description": t("chatbot.seo.description"), "areaServed": "KR", "serviceType": "AI 챗봇 개발", "url": "https://webheads-sparkle-landing.lovable.app/chatbot" }} />

      {/* Hero */}
      <section className="relative min-h-[76vh] flex items-center pt-20 pb-14 overflow-hidden" style={{ background: "linear-gradient(160deg, hsl(210, 50%, 92%) 0%, hsl(214, 60%, 88%) 40%, hsl(220, 50%, 85%) 100%)" }}>
        <div className="absolute pointer-events-none" style={{ width: "120%", height: "120%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse 60% 50% at 65% 45%, hsla(192, 80%, 70%, 0.18) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "80%", height: "80%", bottom: "-10%", left: "-5%", background: "radial-gradient(ellipse 50% 60% at 30% 70%, hsla(152, 60%, 60%, 0.1) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ opacity: 0.85 }}>
          <div className="relative w-full h-full max-w-[900px] mx-auto hidden lg:flex items-center justify-center" style={{ transform: "translateX(40%)" }}><ChatbotHeroVisual /></div>
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10 lg:pl-[10%]">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "hsla(0, 0%, 100%, 0.85)", backdropFilter: "blur(8px)", color: "hsl(192, 80%, 35%)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>{t("chatbot.hero.badge")}</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight" style={{ color: "hsl(220, 60%, 8%)" }}>{t("chatbot.hero.title")}<br /><span style={{ color: "hsl(192, 90%, 42%)" }}>{t("chatbot.hero.titleHighlight")}</span></h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 40%)", textShadow: "0 1px 2px hsla(0, 0%, 100%, 0.6)" }}>{t("chatbot.hero.desc")}</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85" style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}>{t("chatbot.hero.cta1")}</a>
              <a href="#process" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border" style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "hsla(0, 0%, 100%, 0.8)", backdropFilter: "blur(8px)" }}>{t("chatbot.hero.cta2")}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-3 gap-0 divide-x divide-border">
            {stats.map((s: any) => (<div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center"><span className="block font-black leading-none mb-2 text-5xl md:text-6xl text-foreground tracking-tight">{s.value}</span><span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span><span className="block text-xs text-muted-foreground">{s.sub}</span></div>))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("chatbot.featuresSection.sub")}</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("chatbot.featuresSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f: any) => (<div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm"><f.icon className="w-5 h-5 text-primary" /></div><h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p><div className="flex flex-wrap gap-1.5 mt-1">{f.tags.map((tag: string) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      <ServiceMidCTA heading={t("chatbot.midCTA.heading")} description={t("chatbot.midCTA.description")} ctaText={t("chatbot.midCTA.ctaText")} />

      {/* Process */}
      <section id="process" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("chatbot.processSection.sub")}</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("chatbot.processSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p: any, i: number) => (<div key={p.step} className="relative rounded-2xl p-7 bg-background border border-border hover:border-primary/30 transition-colors flex flex-col gap-3"><span className="font-black text-5xl tracking-tight text-primary/20">{p.step}</span><h3 className="font-bold text-foreground text-base tracking-tight">{p.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{p.desc}</p><div className="pt-3 border-t border-border"><p className="text-xs text-primary font-medium">{p.detail}</p></div>{i < process.length - 1 && <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-primary/30"><ArrowLeft className="w-5 h-5 rotate-180" /></div>}</div>))}
          </div>
        </div>
      </section>

      <ServiceFAQ faqs={faqs} serviceName={t("chatbot.seo.title")} />
      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}
