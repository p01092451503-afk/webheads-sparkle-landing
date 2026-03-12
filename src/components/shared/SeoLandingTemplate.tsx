import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, ChevronRight } from "lucide-react";
import SEO, { BASE_URL } from "@/components/SEO";
import ContactSection from "@/components/ContactSection";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";

interface ContentSection {
  id: string;
  title: string;
  content: string;
  bullets?: string[];
  subsections?: { title: string; content: string; bullets?: string[] }[];
}

interface HowToStep {
  name: string;
  text: string;
}

interface RelatedLink {
  label: string;
  path: string;
  description: string;
}

interface CaseRef {
  org: string;
  industry: string;
  summary: string;
  metrics: { label: string; value: string }[];
}

interface SeoLandingProps {
  path: string;
  badge: string;
  h1: string;
  h1Highlight?: string;
  heroDescription: string;
  ctaText?: string;
  breadcrumbName: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  sections: ContentSection[];
  faqs: { q: string; a: string }[];
  howToSteps?: HowToStep[];
  howToName?: string;
  howToDescription?: string;
  relatedServices: RelatedLink[];
  relatedArticles?: RelatedLink[];
  caseStudies?: CaseRef[];
  heroTheme?: string;
  jsonLdExtra?: object;
}

export default function SeoLandingTemplate({
  path, badge, h1, h1Highlight, heroDescription, ctaText = "무료 상담 신청",
  breadcrumbName, seoTitle, seoDescription, seoKeywords,
  sections, faqs, howToSteps, howToName, howToDescription,
  relatedServices, relatedArticles, caseStudies, heroTheme = "indigo-deep",
  jsonLdExtra,
}: SeoLandingProps) {

  const howToSchema = howToSteps && howToName ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howToName,
    "description": howToDescription || howToName,
    "step": howToSteps.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.name,
      "text": step.text,
    })),
    "totalTime": "PT30D",
  } : null;

  const keywordsList = seoKeywords.split(",").map(k => k.trim()).filter(Boolean);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": seoTitle,
    "provider": {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "WEBHEADS (웹헤즈)",
    },
    "description": seoDescription,
    "areaServed": "KR",
    "serviceType": seoTitle,
    "url": `${BASE_URL}${path}`,
    "keywords": keywordsList.join(", "),
    "about": keywordsList.slice(0, 5).map(k => ({
      "@type": "Thing",
      "name": k,
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "300",
      "bestRating": "5",
      "worstRating": "1",
    },
    ...(jsonLdExtra || {}),
  };

  const combinedJsonLd = howToSchema
    ? { "@context": "https://schema.org", "@graph": [serviceSchema, howToSchema] }
    : serviceSchema;

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Noto Sans KR', 'Pretendard Variable', sans-serif" }}>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        path={path}
        breadcrumb={[{ name: breadcrumbName, url: `${BASE_URL}${path}` }]}
        jsonLd={combinedJsonLd}
        faqJsonLd={faqs}
      />

      {/* Hero */}
      <section className="relative flex items-center justify-center pt-28 pb-20 overflow-hidden">
        <HeroPatternBg theme={heroTheme as any} />
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center max-w-4xl">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "white" }}>{badge}</span>
          <h1 className="text-3xl sm:text-4xl lg:text-[3.2rem] font-bold leading-[1.2] sm:leading-[1.18] mb-5 tracking-tight text-white" style={{ wordBreak: "keep-all", overflowWrap: "break-word" }}>
            {h1}
            {h1Highlight && <><br /><span style={{ opacity: 0.95 }}>{h1Highlight}</span></>}
          </h1>
          <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>{heroDescription}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <a href="#contact" className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] bg-white text-primary">{ctaText}</a>
            <a href="#toc" className="px-6 py-3 rounded-xl font-bold text-sm transition-colors border border-white/30 text-white hover:bg-white/10">목차 보기</a>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section id="toc" className="py-16 bg-secondary/40">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">목차</h2>
          <nav className="space-y-0">
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-center gap-4 text-[17px] text-muted-foreground hover:text-foreground transition-colors py-4 border-b border-border/60 last:border-b-0"
              >
                <span className="text-xs font-semibold text-muted-foreground/50 tabular-nums w-6 text-right">{String(i + 1).padStart(2, '0')}</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200 font-medium">{s.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Main Content Sections */}
      {sections.map((section, idx) => (
        <section key={section.id} id={section.id} className={`py-20 ${idx % 2 === 0 ? "bg-background" : "bg-secondary/30"}`}>
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 tracking-tight" style={{ wordBreak: "keep-all" }}>{section.title}</h2>
            <div className="prose prose-lg max-w-none text-foreground/85 leading-relaxed space-y-4">
              {section.content.split("\n\n").map((p, i) => (
                <p key={i} className="text-[15px] leading-[1.85]">{p}</p>
              ))}
            </div>
            {section.bullets && (
              <ul className="mt-6 space-y-2.5">
                {section.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px] text-foreground/85">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.subsections?.map((sub, si) => (
              <div key={si} className="mt-10">
                <h3 className="text-xl font-bold text-foreground mb-4">{sub.title}</h3>
                <div className="space-y-3">
                  {sub.content.split("\n\n").map((p, i) => (
                    <p key={i} className="text-[15px] text-foreground/85 leading-[1.85]">{p}</p>
                  ))}
                </div>
                {sub.bullets && (
                  <ul className="mt-4 space-y-2">
                    {sub.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px] text-foreground/85">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* HowTo Steps */}
      {howToSteps && howToName && (
        <section className="py-20 bg-secondary/40">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 tracking-tight">{howToName}</h2>
            <p className="text-muted-foreground text-[15px] mb-12">단계별로 진행되는 체계적인 프로세스를 확인하세요.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {howToSteps.map((step, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-background shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-bold text-foreground text-lg tracking-tight">{step.name}</h3>
                  </div>
                  <p className="text-[15px] text-muted-foreground leading-relaxed pl-11">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies Reference */}
      {caseStudies && caseStudies.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 tracking-tight">도입 사례</h2>
            <p className="text-muted-foreground mb-12 text-[15px]">다양한 산업 분야의 성공적인 도입 사례를 확인하세요.</p>
            <div className="space-y-0">
              {caseStudies.map((c, idx) => (
                <div key={c.org} className={`py-8 ${idx < caseStudies.length - 1 ? "border-b border-border/50" : ""}`}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] font-medium text-primary/70 mb-2 block">{c.industry}</span>
                      <h3 className="font-bold text-foreground text-xl mb-2 tracking-tight">{c.org}</h3>
                      <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg">{c.summary}</p>
                    </div>
                    <div className="flex gap-8 flex-shrink-0">
                      {c.metrics.map((m) => (
                        <div key={m.label} className="text-center min-w-[72px]">
                          <span className="block font-bold text-2xl text-foreground tracking-tight">{m.value}</span>
                          <span className="block text-xs text-muted-foreground mt-1">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mid CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h3 className="font-bold text-primary-foreground text-2xl lg:text-3xl tracking-tight mb-3">지금 무료 상담을 신청하세요</h3>
          <p className="text-primary-foreground/70 text-sm sm:text-base mb-8 max-w-2xl mx-auto">전문 컨설턴트가 귀사의 요구사항에 맞는 최적의 솔루션을 제안해드립니다.</p>
          <a href="#contact" className="inline-flex px-8 py-3.5 rounded-2xl font-bold text-sm bg-white text-primary hover:bg-white/90 transition-colors">{ctaText}</a>
        </div>
      </section>

      {/* Related Services & Articles */}
      <section className="py-20 bg-secondary/60">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">함께 보면 좋은 서비스</h2>
          <p className="text-sm text-muted-foreground mb-10">관련 서비스와 가이드를 확인해보세요.</p>
          <div className="flex flex-wrap gap-3">
            {relatedServices.map((s) => (
              <Link
                key={s.path}
                to={s.path}
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border bg-background hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              >
                <span className="font-semibold text-sm text-foreground">{s.label}</span>
                <span className="hidden sm:inline text-xs text-muted-foreground">·</span>
                <span className="hidden sm:inline text-xs text-muted-foreground">{s.description}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            ))}
            {relatedArticles?.map((a) => (
              <Link
                key={a.path}
                to={a.path}
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-dashed border-border bg-background hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              >
                <span className="font-semibold text-sm text-foreground">{a.label}</span>
                <span className="hidden sm:inline text-xs text-muted-foreground">·</span>
                <span className="hidden sm:inline text-xs text-muted-foreground">{a.description}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <ServiceFAQ faqs={faqs} />

      {/* Contact */}
      <ContactSection />
    </div>
  );
}
