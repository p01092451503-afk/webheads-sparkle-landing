import { useState } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { BookOpen, TrendingUp, Lightbulb, ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost, blogPostsKo, blogPostsEn, categoryConfigKo, categoryConfigEn } from "@/data/blogPosts";

const categoryIcons = {
  guide: BookOpen,
  trend: TrendingUp,
  tip: Lightbulb,
};

const categoryColors = {
  guide: "hsl(250,55%,52%)",
  trend: "hsl(192,50%,42%)",
  tip: "hsl(40,80%,50%)",
};

function BlogCard({ post, isExpanded, onToggle, lang }: { post: BlogPost; isExpanded: boolean; onToggle: () => void; lang: string }) {
  const catConfig = lang === "en" ? categoryConfigEn : categoryConfigKo;
  const label = catConfig[post.category].label;
  const Icon = categoryIcons[post.category];
  const color = categoryColors[post.category];

  return (
    <article className="group rounded-2xl border border-border bg-card overflow-hidden transition-shadow duration-300 hover:shadow-lg" itemScope itemType="https://schema.org/Article">
      <div className="h-1" style={{ backgroundColor: color }} />
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: color }}>
            <Icon className="w-3.5 h-3.5" />{label}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" /><time itemProp="datePublished" dateTime={post.date}>{post.date}</time>
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />{post.readTime} {lang === "en" ? "read" : "읽기"}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-tight" itemProp="headline" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{post.title}</h2>
        <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-4" itemProp="description" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{post.summary}</p>
        {isExpanded && (
          <div className="space-y-4 mb-5 pt-4 border-t border-border">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-sm md:text-[15px] text-foreground/80 leading-[1.8]" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }} itemProp="articleBody">{paragraph}</p>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.keywords.map((kw) => (
            <span key={kw} className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground" itemProp="keywords">#{kw}</span>
          ))}
        </div>
        <button onClick={onToggle} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-2 transition-colors">
          {isExpanded ? (lang === "en" ? "Collapse" : "접기") : (lang === "en" ? "Read more" : "자세히 읽기")}
          <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </button>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const lang = i18n.language?.startsWith("en") ? "en" : "ko";
  const blogPosts = lang === "en" ? blogPostsEn : blogPostsKo;

  const handleToggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: lang === "en" ? "WEBHEADS LMS Insights" : "웹헤즈 LMS 인사이트",
    description: lang === "en" ? "LMS adoption guides, e-learning trends, and AI education insights from WEBHEADS" : "LMS 도입 가이드, 이러닝 트렌드, AI 교육 솔루션 인사이트를 제공하는 웹헤즈 블로그",
    url: "https://service.webheads.co.kr/blog",
    publisher: { "@type": "Organization", name: "Webheads", url: "https://service.webheads.co.kr" },
    blogPost: blogPosts.map((p) => ({
      "@type": "BlogPosting", headline: p.title, description: p.summary, datePublished: p.date, keywords: p.keywords.join(", "), author: { "@type": "Organization", name: "Webheads" },
    })),
  };

  return (
    <>
      <SEO
        title={lang === "en" ? "LMS Insights | E-Learning Trends & Guides — WEBHEADS" : "LMS 인사이트 | 이러닝 트렌드 · 도입 가이드 — 웹헤즈"}
        description={lang === "en" ? "LMS adoption checklists, AI-based learning trends, e-learning platform cost guides and more professional insights for corporate training managers." : "LMS 도입 체크리스트, AI 기반 학습관리 트렌드, 이러닝 플랫폼 비용 가이드 등 기업교육 담당자를 위한 전문 인사이트를 제공합니다."}
        keywords="LMS, e-learning, AI LMS, learning management system, education platform"
        path="/blog"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative pt-24 pb-12 md:pt-28 md:pb-14 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-5 rounded-full text-xs font-semibold tracking-wider uppercase bg-foreground text-background">Blog & Insights</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-4" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif", letterSpacing: "-0.02em" }}>
            {lang === "en" ? "LMS Insights" : "LMS 인사이트"}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
            {lang === "en" ? (<>From e-learning adoption to AI learning trends,<br className="hidden md:block" />professional guides for corporate training managers.</>)
              : (<>이러닝 솔루션 도입부터 AI 학습관리 트렌드까지,<br className="hidden md:block" />기업교육 담당자를 위한 전문 가이드를 제공합니다.</>)}
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} isExpanded={expandedId === post.id} onToggle={() => handleToggle(post.id)} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
              {lang === "en" ? "Not sure where to start with LMS adoption?" : "LMS 도입, 어디서부터 시작해야 할지 모르겠다면?"}
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {lang === "en" ? "Get a free consultation from WEBHEADS experts with 16 years of experience." : "16년 경험의 웹헤즈 전문 컨설턴트가 무료로 상담해드립니다."}
            </p>
            <Link to="/lms#contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-md">
              {lang === "en" ? "Request Free Consultation" : "무료 상담 신청하기"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
