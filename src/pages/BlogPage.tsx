import { useState } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { BookOpen, TrendingUp, Lightbulb, ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  category: "guide" | "trend" | "tip";
  title: string;
  summary: string;
  content: string[];
  date: string;
  readTime: string;
  keywords: string[];
}

const categoryConfig = {
  guide: { label: "인사이트", icon: BookOpen, color: "hsl(250,55%,52%)" },
  trend: { label: "트렌드", icon: TrendingUp, color: "hsl(192,50%,42%)" },
  tip: { label: "실용 팁", icon: Lightbulb, color: "hsl(40,80%,50%)" },
};

const blogPosts: BlogPost[] = [
  {
    id: "lms-checklist-2026",
    category: "guide",
    title: "2026년 LMS 도입 전 반드시 확인해야 할 체크리스트 10가지",
    summary: "학습관리시스템(LMS)을 처음 도입하거나 교체를 고려하는 기업·기관 담당자를 위해, 도입 전 검토해야 할 핵심 항목을 정리했습니다. 커스터마이징 범위부터 DRM 연동, 모바일 지원, 관리자 권한 체계까지 놓치기 쉬운 포인트를 짚어드립니다.",
    content: [
      "LMS 도입은 단순한 소프트웨어 구매가 아닙니다. 조직의 교육 체계를 디지털로 전환하는 전략적 의사결정입니다. 도입 목적이 '사내교육 효율화'인지, '외부 수강생 대상 온라인 교육 플랫폼 운영'인지에 따라 필요한 기능과 아키텍처가 크게 달라집니다.",
      "첫째, 커스터마이징 범위를 확인하세요. 임대형(SaaS) LMS는 빠르게 도입할 수 있지만 UI/UX 변경이 제한적입니다. 반면 구축형 LMS는 브랜드 아이덴티티에 맞는 화이트라벨링과 기능 확장이 자유롭습니다. 웹헤즈 PRO는 구축형이면서도 SaaS 배포를 지원하여 두 가지 장점을 모두 제공합니다.",
      "둘째, RESTful API 연동 지원 여부를 점검하세요. HRD 시스템, 그룹웨어, ERP 등 기존 인프라와의 연동이 원활해야 실질적인 업무 효율 개선이 가능합니다. 서드파티 API 연동이 없는 LMS는 데이터 사일로(Data Silo)를 만들 수 있습니다.",
      "셋째, DRM(Digital Rights Management) 지원을 확인하세요. 유료 교육 콘텐츠를 운영한다면 카테노이드(Kollus), 존플레이어 등의 DRM 연동은 필수입니다. 불법 복제 방지뿐 아니라 수강 완료율 추적에도 DRM 플레이어 데이터가 활용됩니다.",
      "넷째, 모바일 반응형과 앱 지원을 살피세요. 2026년 현재 모바일 학습 비중이 전체의 60%를 넘어섰습니다. 단순 반응형 웹을 넘어 오프라인 학습, 푸시 알림 등을 지원하는 PWA 또는 네이티브 앱 연동이 있는지 확인하세요.",
      "그 외에 관리자 권한 체계(다중 관리자, 부서별 권한), 수료증 자동 발급, SCORM/xAPI 표준 지원, 실시간 화상 강의 연동, 학습 분석 대시보드, 데이터 마이그레이션 지원 등도 반드시 체크해야 합니다."
    ],
    date: "2026-03-04",
    readTime: "8분",
    keywords: ["LMS 도입", "학습관리시스템", "이러닝 솔루션", "LMS 구축", "체크리스트"],
  },
  {
    id: "ai-lms-trend-2026",
    category: "trend",
    title: "AI 기반 학습관리의 미래: 2026년 이러닝 트렌드 5가지",
    summary: "생성형 AI와 적응형 학습(Adaptive Learning)이 LMS 시장을 어떻게 변화시키고 있는지, 실제 기업교육 현장에서의 활용 사례와 함께 2026년 핵심 트렌드를 분석합니다.",
    content: [
      "2026년 이러닝 시장에서 가장 주목할 변화는 AI의 본격적인 교육 현장 통합입니다. 단순한 챗봇을 넘어, AI가 학습자의 진도·이해도·학습 패턴을 실시간 분석하여 맞춤형 학습 경로를 자동 생성하는 '적응형 학습(Adaptive Learning)'이 기업교육 LMS의 핵심 기능으로 자리잡고 있습니다.",
      "트렌드 1: AI 튜터링 — GPT 기반의 AI 튜터가 학습자의 질문에 24시간 즉시 응답하고, 오답 패턴을 분석하여 보충 콘텐츠를 자동 추천합니다. 웹헤즈 LMS는 AI 챗봇과 학습 데이터를 연동하여 개인화된 학습 가이드를 제공합니다.",
      "트렌드 2: 마이크로러닝의 고도화 — 5~10분 단위의 초단기 학습 모듈이 표준이 되면서, AI가 학습자별 최적 학습 시간대와 분량을 자동 조절합니다. 출퇴근 시간 모바일 학습에 최적화된 콘텐츠 포맷이 중요해졌습니다.",
      "트렌드 3: 학습 분석(Learning Analytics) 고도화 — 단순 수료율을 넘어, 학습 참여도·지식 보유율·업무 성과와의 상관관계를 분석하는 HRD 연계형 대시보드가 확산되고 있습니다.",
      "트렌드 4: 비대면 교육의 하이브리드화 — 실시간 화상 강의와 비동기 이러닝을 결합한 블렌디드 러닝이 표준 교육 방식으로 정착했습니다. LMS 내에서 Zoom, Teams 등 화상 도구와의 원클릭 연동이 필수 기능이 되었습니다.",
      "트렌드 5: 클라우드 네이티브 LMS — 온프레미스에서 클라우드로의 전환이 가속화되면서, AWS·GCP 기반의 오토스케일링 LMS가 대규모 동시접속 환경에서도 안정적인 서비스를 보장합니다."
    ],
    date: "2026-03-01",
    readTime: "7분",
    keywords: ["AI LMS", "AI 교육 솔루션", "이러닝 트렌드", "AI 기반 학습관리", "클라우드 LMS"],
  },
  {
    id: "lms-cost-guide",
    category: "tip",
    title: "LMS 도입 비용 가이드: 임대형 vs 구축형, 실제 얼마나 들까?",
    summary: "이러닝 플랫폼 도입을 검토할 때 가장 많이 받는 질문, '비용이 얼마나 드나요?'에 대한 현실적인 답변입니다. 임대형 SaaS와 맞춤형 구축 방식의 비용 구조를 항목별로 비교 분석합니다.",
    content: [
      "LMS 도입 비용은 '임대형(SaaS)'과 '구축형' 두 가지 모델에 따라 크게 달라집니다. 임대형은 초기 비용이 낮고 빠른 도입이 가능하지만, 장기적으로 월/연 구독료가 누적됩니다. 구축형은 초기 투자가 크지만 장기 운영 시 총소유비용(TCO)이 유리할 수 있습니다.",
      "임대형 LMS (예: WEBHEADS Light) — 월 이용료 기반으로 운영됩니다. 서버 호스팅, 보안 패치, 기본 기능 업데이트가 포함되어 IT 인력이 부족한 중소기업에 적합합니다. 일반적으로 사용자 수에 따라 과금되며, 50인 이하 소규모 조직부터 도입 가능합니다.",
      "구축형 LMS (예: WEBHEADS PRO) — 초기 개발비 + 연간 유지보수 계약으로 운영됩니다. 화이트라벨링, API 연동, 맞춤 기능 개발이 필요한 대기업·공공기관·교육전문 기업에 적합합니다. 초기 비용이 높지만, 3년 이상 운영 시 임대형 대비 비용 효율성이 높아집니다.",
      "숨겨진 비용 항목을 주의하세요: 콘텐츠 변환/제작 비용, DRM 라이선스, SMS/알림톡 발송 비용, 추가 스토리지, SSL 인증서, 도메인, 관리자 교육 비용 등이 초기 견적에 포함되지 않는 경우가 많습니다.",
      "비용 최적화 팁: ① 초기에는 핵심 기능만 도입하고 단계적으로 확장하세요. ② DRM은 콘텐츠 유형에 맞는 최소 사양으로 선택하세요. ③ SMS 대신 카카오 알림톡을 활용하면 건당 비용을 절감할 수 있습니다. ④ 웹헤즈처럼 호스팅·LMS·DRM을 원스톱으로 제공하는 업체를 선택하면 별도 연동 비용을 줄일 수 있습니다."
    ],
    date: "2026-02-25",
    readTime: "6분",
    keywords: ["LMS 도입 비용", "이러닝 플랫폼 추천", "LMS 솔루션 비교", "맞춤형 LMS 개발", "교육관리 솔루션"],
  },
  {
    id: "hrd-education-system",
    category: "guide",
    title: "HRD 교육시스템 구축 완벽 가이드: 기업 인재개발의 디지털 전환",
    summary: "HRD(인적자원개발) 부서가 사내교육 시스템을 디지털로 전환할 때 고려해야 할 전략적 요소와 기술적 요건을 상세히 안내합니다. 법정의무교육부터 직무교육까지 체계적 운영 방안을 제시합니다.",
    content: [
      "기업의 HRD 교육시스템 구축은 단순히 온라인 강의를 올리는 것이 아닙니다. 조직의 인재개발 전략과 연계된 체계적인 학습 생태계를 만드는 과정입니다. 법정의무교육(산업안전, 개인정보보호, 직장내 괴롭힘 방지 등)의 자동화부터, 직무역량 기반의 맞춤형 교육과정 설계까지 폭넓은 범위를 다룹니다.",
      "성공적인 HRD 시스템 구축을 위해서는 먼저 조직의 교육 니즈를 체계적으로 분석해야 합니다. 부서별·직급별 필수 교육과정을 매핑하고, 학습 이력 관리와 수료 현황 추적이 자동화되는 LMS 인프라가 필요합니다. 웹헤즈 LMS는 부서별 관리자 권한 분리, 교육과정 자동 배정, 수료증 자동 발급 등 HRD 전용 기능을 기본 제공합니다.",
      "특히 대기업과 공공기관에서는 기존 HR 시스템(SAP, Oracle HCM 등)과의 연동이 필수적입니다. REST API 기반의 양방향 데이터 동기화를 통해, 인사 정보 변경 시 교육과정이 자동으로 재배정되고, 교육 이수 결과가 인사 평가에 반영되는 통합 시스템을 구현할 수 있습니다.",
      "온프레미스와 클라우드 중 어떤 배포 방식을 선택할지도 중요합니다. 보안 규정이 엄격한 금융·공공 기관은 온프레미스 또는 프라이빗 클라우드를 선호하며, 빠른 확장성이 필요한 스타트업·중견기업은 퍼블릭 클라우드 기반의 SaaS형이 효율적입니다."
    ],
    date: "2026-02-20",
    readTime: "9분",
    keywords: ["HRD 교육시스템 구축", "사내교육 시스템", "기업교육 LMS", "직무교육 플랫폼", "온라인 교육 플랫폼"],
  },
  {
    id: "b2b-education-platform",
    category: "trend",
    title: "B2B 교육 플랫폼 시장 분석: 국내 LMS 솔루션 비교 2026",
    summary: "국내 이러닝 솔루션 시장에서 주요 LMS 제공업체들의 강점과 차이점을 분석합니다. 도입 규모별·산업별로 적합한 솔루션을 추천하고, 웹헤즈의 차별화 포인트를 객관적으로 제시합니다.",
    content: [
      "2026년 국내 LMS 시장은 약 8,500억 원 규모로 성장했으며, 코로나 이후 정착된 비대면 교육 수요와 AI 기술 도입이 시장 확대를 이끌고 있습니다. 글로벌 SaaS형 LMS(Moodle, Canvas, Docebo 등)와 국내 전문 솔루션이 경쟁하는 구도 속에서, 한국어 지원과 국내 규정 대응력이 핵심 차별점이 되고 있습니다.",
      "국내 LMS 선택 시 고려할 핵심 요소: ① 한국어 완벽 지원 및 한국식 교육 프로세스 반영 ② 내일배움카드, HRD-Net 등 정부 교육 플랫폼과의 연동 ③ 카카오 알림톡, 네이버 간편결제 등 국내 서비스 통합 ④ 국내 IDC 또는 클라우드(NHN, NCP 등)에서의 데이터 주권 보장.",
      "웹헤즈 LMS는 16년간 축적된 국내 교육 시장 노하우를 바탕으로, 구축형과 SaaS형을 모두 지원하는 유연한 아키텍처를 제공합니다. 특히 300개 이상의 기업·기관 도입 사례에서 검증된 안정성과, 카테노이드 DRM·PG 결제·SMS/알림톡 등 국내 필수 서비스의 원스톱 통합이 강점입니다.",
      "산업별 추천: 금융·공공 → 온프레미스 구축형(보안 규정 대응) | 제조·유통 → 클라우드 SaaS형(빠른 도입, 다지점 지원) | 교육·출판 → 수강생 관리 특화형(결제·수료·DRM 통합) | 스타트업 → 경량 SaaS형(최소 비용, 빠른 런칭)"
    ],
    date: "2026-02-15",
    readTime: "8분",
    keywords: ["국내 LMS", "한국 이러닝 솔루션", "B2B 교육 플랫폼", "LMS 솔루션 비교", "교육플랫폼 개발"],
  },
  {
    id: "ai-chatbot-education",
    category: "tip",
    title: "AI 챗봇을 LMS에 도입하는 실전 가이드",
    summary: "교육 현장에서 AI 챗봇을 어떻게 활용할 수 있는지, 실제 도입 시 주의할 점과 효과적인 운영 전략을 소개합니다. 학습자 문의 자동응대부터 AI 기반 퀴즈 생성까지 다양한 활용 시나리오를 다룹니다.",
    content: [
      "AI 챗봇은 더 이상 단순 FAQ 응답 도구가 아닙니다. LMS와 통합된 AI 챗봇은 학습자의 진도 확인, 과제 리마인더, 오답 해설, 맞춤 콘텐츠 추천까지 수행하는 '디지털 학습 비서'로 진화했습니다. 웹헤즈는 자체 AI 챗봇 솔루션을 LMS에 내장하여 별도 연동 없이 즉시 활용할 수 있습니다.",
      "도입 시 가장 중요한 것은 '목적 설정'입니다. ① 학습자 문의 자동응대(수강 방법, 일정 안내 등) ② 학습 진도 알림 및 독려 ③ AI 기반 퀴즈/평가 자동 생성 ④ 관리자 업무 자동화(수료증 발급, 통계 리포트 등) — 이 중 우선순위를 정하고 단계적으로 확장하는 것이 성공의 열쇠입니다.",
      "효과 측정 지표로는 학습자 문의 응답 시간 단축률(평균 85% 감소), 반복 문의 자동처리율(70% 이상 목표), 학습 완료율 변화, 관리자 업무시간 절감률 등을 추적하세요.",
      "주의할 점: AI 챗봇이 잘못된 정보를 제공하는 '할루시네이션' 문제를 방지하려면, 교육과정 데이터와 학사 규정을 기반으로 한 RAG(Retrieval-Augmented Generation) 아키텍처를 적용해야 합니다. 웹헤즈 AI 챗봇은 고객사의 교육 데이터만을 참조하여 답변하는 구조로, 정확도와 보안을 동시에 확보합니다."
    ],
    date: "2026-02-10",
    readTime: "6분",
    keywords: ["AI 챗봇", "AI 교육 솔루션", "AI LMS", "교육용 SaaS 솔루션", "AI 기반 학습관리"],
  },
];

function BlogCard({ post, isExpanded, onToggle }: { post: BlogPost; isExpanded: boolean; onToggle: () => void }) {
  const config = categoryConfig[post.category];
  const Icon = config.icon;

  return (
    <article
      className="group rounded-2xl border border-border bg-card overflow-hidden transition-shadow duration-300 hover:shadow-lg"
      itemScope
      itemType="https://schema.org/Article"
    >
      {/* Category bar */}
      <div className="h-1" style={{ backgroundColor: config.color }} />

      <div className="p-6 md:p-8">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: config.color }}
          >
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <time itemProp="datePublished" dateTime={post.date}>{post.date}</time>
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {post.readTime} 읽기
          </span>
        </div>

        {/* Title */}
        <h2
          className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-tight"
          itemProp="headline"
          style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}
        >
          {post.title}
        </h2>

        {/* Summary */}
        <p
          className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-4"
          itemProp="description"
          style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}
        >
          {post.summary}
        </p>

        {/* Expanded content */}
        {isExpanded && (
          <div className="space-y-4 mb-5 pt-4 border-t border-border">
            {post.content.map((paragraph, i) => (
              <p
                key={i}
                className="text-sm md:text-[15px] text-foreground/80 leading-[1.8]"
                style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}
                itemProp="articleBody"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Keywords */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.keywords.map((kw) => (
            <span
              key={kw}
              className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground"
              itemProp="keywords"
            >
              #{kw}
            </span>
          ))}
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-2 transition-colors"
        >
          {isExpanded ? "접기" : "자세히 읽기"}
          <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </button>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "웹헤즈 LMS 인사이트",
    description: "LMS 도입 가이드, 이러닝 트렌드, AI 교육 솔루션 인사이트를 제공하는 웹헤즈 블로그",
    url: "https://service.webheads.co.kr/blog",
    publisher: {
      "@type": "Organization",
      name: "Webheads",
      url: "https://service.webheads.co.kr",
    },
    blogPost: blogPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.summary,
      datePublished: p.date,
      keywords: p.keywords.join(", "),
      author: { "@type": "Organization", name: "Webheads" },
    })),
  };

  return (
    <>
      <SEO
        title="LMS 인사이트 | 이러닝 트렌드 · 도입 가이드 — 웹헤즈"
        description="LMS 도입 체크리스트, AI 기반 학습관리 트렌드, 이러닝 플랫폼 비용 가이드 등 기업교육 담당자를 위한 전문 인사이트를 제공합니다."
        keywords="LMS 도입, 이러닝 솔루션, AI LMS, 학습관리시스템, 기업교육 LMS, LMS 솔루션 비교, 이러닝 트렌드, AI 교육 솔루션, 교육플랫폼 개발, HRD 교육시스템 구축"
        path="/blog"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="inline-block px-4 py-1.5 mb-5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary">
            Blog & Insights
          </span>
          <h1
            className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-4"
            style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif", letterSpacing: "-0.02em" }}
          >
            LMS 인사이트
          </h1>
          <p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}
          >
            이러닝 솔루션 도입부터 AI 학습관리 트렌드까지,<br className="hidden md:block" />
            기업교육 담당자를 위한 전문 가이드를 제공합니다.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col gap-8">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                isExpanded={expandedId === post.id}
                onToggle={() => handleToggle(post.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-8 md:p-12 text-center">
            <h2
              className="text-2xl md:text-3xl font-bold text-foreground mb-3"
              style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}
            >
              LMS 도입, 어디서부터 시작해야 할지 모르겠다면?
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              16년 경험의 웹헤즈 전문 컨설턴트가 무료로 상담해드립니다.
            </p>
            <Link
              to="/lms#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
            >
              무료 상담 신청하기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
