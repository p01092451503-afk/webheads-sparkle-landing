import ContactSection from "@/components/ContactSection";

import TestimonialSection from "@/components/TestimonialSection";
import SEO, { BASE_URL } from "@/components/SEO";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceProcess from "@/components/shared/ServiceProcess";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import { Film, PenTool, Layers, Monitor, Users, Mic, Palette, ClipboardCheck, Gamepad2, BookOpen, Building2, Stethoscope, GraduationCap, Globe, ClipboardList, FileText, Camera, Code, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const featureIcons = [Film, PenTool, Layers, Gamepad2, Monitor, Users, Mic, Palette, ClipboardCheck];
const contentTypeIcons = [Building2, Users, Stethoscope, GraduationCap, Gamepad2, Globe, BookOpen, Film];
const processIcons = [ClipboardList, FileText, Camera, Code, CheckCircle];

export default function ContentPage() {
  const { t } = useTranslation();

  const features = (t("content.features", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: featureIcons[i] || Film }));
  const contentTypes = (t("content.contentTypes", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: contentTypeIcons[i] || Building2 }));
  const stats = t("content.stats", { returnObjects: true }) as any[];
  const faqs = t("content.faqs", { returnObjects: true }) as any[];
  const testimonials = t("content.testimonials", { returnObjects: true }) as any[];
  const processSteps = (t("content.process", { returnObjects: true }) as any[]).map((item: any, i: number) => ({ ...item, icon: processIcons[i] || ClipboardList }));

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t("content.seo.title")} description={t("content.seo.description")} keywords={t("content.seo.keywords")} path="/content" jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": `${t("content.seo.title")} - Webheads`, "provider": { "@type": "Organization", "name": "Webheads (웹헤즈)" }, "description": t("content.seo.description"), "areaServed": "KR", "serviceType": t("content.seo.title"), "url": `${BASE_URL}/content` }} faqJsonLd={faqs} />

      {/* Hero */}
      <section className="relative flex items-center justify-center pt-28 pb-20 overflow-hidden">
        <HeroPatternBg theme="indigo-deep" />
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "white" }}>{t("content.hero.badge")}</span>
          <h1 className="text-4xl lg:text-[3.2rem] font-bold leading-[1.15] mb-5 tracking-tight text-white" style={{ wordBreak: "keep-all" }}>{t("content.hero.title")}<br /><span style={{ opacity: 0.95 }}>{t("content.hero.titleHighlight")}</span></h1>
          <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>{t("content.hero.desc")}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <a href="#contact" className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02]" style={{ background: "white", color: "hsl(235, 65%, 45%)" }}>{t("content.hero.cta1")}</a>
            <a href="#types" className="px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border border-white/30 text-white hover:bg-white/10">{t("content.hero.cta2")}</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-[4.8rem] bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s: any) => (<div key={s.label} className="flex flex-col items-center justify-center py-6 px-4 text-center"><span className="block font-bold leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span><span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span><span className="block text-xs text-muted-foreground">{s.sub}</span></div>))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("content.featuresSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("content.featuresSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f: any) => (<div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm"><f.icon className="w-5 h-5 text-primary" /></div><h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p><div className="flex flex-wrap gap-1.5 mt-1">{f.tags.map((tag: string) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      <ServiceMidCTA heading={t("content.midCTA.heading")} description={t("content.midCTA.description")} ctaText={t("content.midCTA.ctaText")} />

      {/* Content Types */}
      <section id="types" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("content.contentTypesSection.sub")}</p>
            <h2 className="font-bold text-foreground leading-tight text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{t("content.contentTypesSection.title")}</h2>
            <p className="text-muted-foreground mt-4 text-base">{t("content.contentTypesSection.desc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contentTypes.map((type: any) => (<div key={type.label} className="rounded-2xl p-6 bg-background border border-border hover:border-primary/30 hover:shadow-sm transition-all flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(25, 90%, 95%)" }}><type.icon className="w-5 h-5" style={{ color: "hsl(25, 80%, 40%)" }} /></div><h3 className="font-bold text-foreground text-sm tracking-tight">{type.label}</h3><p className="text-muted-foreground text-xs leading-relaxed">{type.desc}</p></div>))}
          </div>
        </div>
      </section>

      <ServiceProcess steps={processSteps} heading={t("content.processSection.title")} subheading={t("content.processSection.sub")} description={t("content.processSection.desc")} />


      <ServiceFAQ faqs={faqs} serviceName={t("content.seo.title")} />
      <TestimonialSection testimonials={testimonials} />
      <RelatedServices items={[
        { emoji: "📚", title: "LMS", desc: "300+ 기업이 선택한 검증된 학습 관리 시스템", path: "/lms" },
        { emoji: "🔒", title: "DRM 솔루션", desc: "동영상 불법 복제 완전 차단", path: "/drm" },
        { emoji: "🖥️", title: "이러닝 호스팅", desc: "99.9% SLA, CDN·AWS·IDC 지원", path: "/hosting" },
        { emoji: "📱", title: "앱 개발", desc: "LMS 완벽 연동 iOS·Android 앱", path: "/app-dev" },
      ]} />
      <ContactSection />
    </div>
  );
}
