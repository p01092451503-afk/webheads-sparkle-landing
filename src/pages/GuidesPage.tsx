import SEO, { BASE_URL } from "@/components/SEO";
import ContactSection from "@/components/ContactSection";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Building2, GraduationCap, Video, Monitor, Layers } from "lucide-react";
import HeroPatternBg from "@/components/visuals/HeroPatternBg";

interface GuideCard {
  title: string;
  description: string;
  path: string;
  icon: typeof BookOpen;
  tag: string;
  readTime: string;
}

const guides: GuideCard[] = [
  {
    title: "LMS 구축 가이드",
    description: "클라우드·구축형·SaaS 중 어떤 LMS가 적합한지, 구축 비용과 기간, 기술 스택까지 LMS 구축의 A to Z를 안내합니다.",
    path: "/lms-development",
    icon: Layers,
    tag: "LMS",
    readTime: "15분",
  },
  {
    title: "기업 LMS 구축 전략",
    description: "기업교육 LMS 도입 전략, 직무교육·법정의무교육 자동화, HR 연동까지 기업 맞춤형 LMS 가이드입니다.",
    path: "/corporate-lms",
    icon: Building2,
    tag: "기업교육",
    readTime: "12분",
  },
  {
    title: "이러닝 플랫폼 개발",
    description: "교육 비즈니스를 위한 이러닝 플랫폼 기획·설계·개발 전 과정과 비용 가이드를 제공합니다.",
    path: "/elearning-platform-development",
    icon: GraduationCap,
    tag: "플랫폼",
    readTime: "14분",
  },
  {
    title: "사내교육 시스템 구축",
    description: "법정의무교육 자동화, 신입사원 온보딩, HR 연동까지 기업 맞춤형 사내교육 시스템 구축 가이드입니다.",
    path: "/employee-training-system",
    icon: Building2,
    tag: "사내교육",
    readTime: "13분",
  },
  {
    title: "온라인 교육 사이트 제작",
    description: "강의 판매, 수강 관리, PG 결제 연동까지 온라인 교육 사이트 제작의 모든 것을 안내합니다.",
    path: "/online-education-site",
    icon: Monitor,
    tag: "교육 사이트",
    readTime: "12분",
  },
  {
    title: "실시간 화상강의 솔루션",
    description: "WebRTC 기반 화상강의, 웨비나, 하이브리드 교육 솔루션 구축 가이드입니다.",
    path: "/live-class-solution",
    icon: Video,
    tag: "화상강의",
    readTime: "11분",
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Noto Sans KR', 'Pretendard Variable', sans-serif" }}>
      <SEO
        title="이러닝 가이드 허브 | 교육 플랫폼 구축 가이드"
        description="LMS 구축, 이러닝 플랫폼 개발, 사내교육 시스템, 화상강의 솔루션까지 — WEBHEADS(웹헤즈)의 교육 기술 전문 가이드 모음입니다."
        keywords="LMS 구축 가이드, 이러닝 플랫폼 개발, 사내교육 시스템, 화상강의 솔루션, 온라인 교육 사이트 제작, 기업교육 LMS"
        path="/guides"
        breadcrumb={[{ name: "가이드 허브", url: `${BASE_URL}/guides` }]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "이러닝 가이드 허브 — WEBHEADS(웹헤즈)",
          "description": "교육 기술 전문 가이드 모음. LMS 구축부터 화상강의까지.",
          "url": `${BASE_URL}/guides`,
          "provider": {
            "@type": "Organization",
            "name": "WEBHEADS (웹헤즈)",
            "url": BASE_URL,
          },
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": guides.map((g, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "url": `${BASE_URL}${g.path}`,
              "name": g.title,
            })),
          },
        }}
      />

      {/* Hero */}
      <section className="relative flex items-center justify-center pt-28 pb-20 overflow-hidden">
        <HeroPatternBg theme="navy-blue" />
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center max-w-3xl">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "white" }}>
            KNOWLEDGE HUB
          </span>
          <h1 className="text-4xl lg:text-[3.2rem] font-bold leading-[1.15] mb-5 tracking-tight text-white" style={{ wordBreak: "keep-all" }}>
            이러닝 가이드 허브
            <br />
            <span style={{ opacity: 0.95 }}>교육 기술의 모든 것</span>
          </h1>
          <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
            LMS 구축, 이러닝 플랫폼 개발, 사내교육 시스템까지 — 16년 경험의 교육 기술 전문가가 작성한 심층 가이드를 무료로 제공합니다.
          </p>
        </div>
      </section>

      {/* Guide Cards */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => {
              const Icon = guide.icon;
              return (
                <Link
                  key={guide.path}
                  to={guide.path}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full">{guide.tag}</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-2 tracking-tight">{guide.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{guide.readTime} 읽기</span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                      읽기 <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="py-16 bg-secondary/40">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">더 많은 인사이트가 필요하신가요?</h2>
          <p className="text-muted-foreground mb-6">100개 이상의 이러닝 기술 인사이트를 블로그에서 확인하세요.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <BookOpen className="w-4 h-4" />
            인사이트 블로그 보기
          </Link>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
