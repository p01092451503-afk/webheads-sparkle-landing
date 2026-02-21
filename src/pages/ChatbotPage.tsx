import { ArrowLeft } from "lucide-react";
import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";
import ChatbotHeroVisual from "@/components/visuals/ChatbotHeroVisual";
import { Bot, Brain, MessageSquare, BarChart3, Link2, Globe, Zap, ShieldCheck, RefreshCw, Settings2, Users } from "lucide-react";

const testimonials = [
  { name: "김지현", role: "교육운영 팀장", org: "M 사이버대학교", rating: 5, date: "2024.11", period: "이용 3년차", content: "솔직히 챗봇이 얼마나 될까 싶었는데, 도입하고 2주 만에 같은 질문 반복하는 건 거의 다 챗봇이 처리해요. 상담 직원들이 진짜 여유가 생겼습니다." },
  { name: "이동훈", role: "플랫폼 매니저", org: "N 기업교육센터", rating: 4, date: "2025.01", period: "이용 5년차", content: "밤이나 주말에 질문하는 학습자가 많은데, 챗봇이 바로바로 답변해주니까 수료율이 올라간 게 체감됩니다. 엉뚱한 답변 하는 경우도 거의 없고요." },
  { name: "오수진", role: "CS 리더", org: "O 평생교육기업", rating: 3, date: "2024.09", period: "이용 2년차", content: "카카오톡이랑 홈페이지 둘 다 챗봇이 붙어 있으니까 학습자분들이 편한 데서 바로 질문하시더라고요. 이전에는 전화 아니면 이메일밖에 없어서 불편했었거든요." },
];

const features = [
  { icon: Brain, title: "LLM 기반 자연어 이해", desc: "GPT-4o, Claude 3.5 등 최신 대형 언어 모델(LLM)을 활용하여 문맥을 이해하는 정확한 응답을 생성합니다. RAG(검색 증강 생성) 기술을 접목해 기관 고유 지식을 실시간으로 참조합니다.", tags: ["GPT-4o", "Claude 3.5", "RAG", "Prompt Engineering"] },
  { icon: MessageSquare, title: "LMS 연동 맞춤 응답", desc: "REST API를 통해 LMS 데이터베이스와 실시간 연동하여 수강 현황, 과제 기한, 성적, 출석 정보를 바탕으로 학습자 개인화된 컨텍스트 응답을 제공합니다.", tags: ["REST API", "실시간 연동", "개인화", "수강 데이터"] },
  { icon: Zap, title: "FAQ 자동 학습 & 지식베이스", desc: "기존 FAQ, 운영 매뉴얼, 강의계획서 등 비정형 문서를 업로드하면 벡터 임베딩 기반으로 자동 색인하여 정확도 높은 지식베이스를 즉시 구성합니다.", tags: ["벡터 임베딩", "문서 파싱", "지식베이스", "자동 색인"] },
  { icon: Globe, title: "다국어 처리 & 번역", desc: "한국어, 영어, 중국어, 일본어 등 10개 이상의 언어를 자동 감지하고 해당 언어로 응답합니다. 글로벌 이러닝 플랫폼 운영 및 외국인 학습자 지원에 최적화되어 있습니다.", tags: ["한/영/중/일", "자동 언어 감지", "10개 이상 지원", "글로벌"] },
  { icon: Link2, title: "멀티채널 배포", desc: "카카오톡 채널, 웹사이트 채팅 위젯, 모바일 앱 내 SDK 형태로 단일 챗봇을 다채널에 동시 배포합니다. 채널별 대화 맥락을 유지하는 세션 관리 기능을 제공합니다.", tags: ["카카오톡", "웹 위젯", "모바일 SDK", "세션 관리"] },
  { icon: BarChart3, title: "운영 현황 대시보드", desc: "질문 유형 분류, 해결률, 에스컬레이션 비율, 사용자 만족도(CSAT), 평균 응답 시간 등 KPI를 실시간 대시보드로 시각화하여 챗봇 성능 최적화에 활용합니다.", tags: ["실시간 모니터링", "CSAT", "KPI", "시각화"] },
  { icon: ShieldCheck, title: "보안 & 개인정보 보호", desc: "학습자 개인정보를 암호화 전송(TLS 1.3)하고, 대화 로그는 사용자 동의 기반으로 수집합니다. 개인정보보호법 및 GDPR 가이드라인을 준수하는 안전한 챗봇 환경을 제공합니다.", tags: ["TLS 1.3", "암호화", "GDPR", "개인정보보호법"] },
  { icon: RefreshCw, title: "지속 학습 & 모델 고도화", desc: "실제 대화 데이터를 기반으로 주기적 파인튜닝(Fine-tuning)을 수행하여 시간이 지날수록 응답 정확도가 향상됩니다. 오답 피드백 루프를 통해 지속적인 품질 개선이 이루어집니다.", tags: ["Fine-tuning", "RLHF", "피드백 루프", "자동 고도화"] },
  { icon: Users, title: "상담원 에스컬레이션 & 협업", desc: "챗봇이 처리하기 어려운 복잡한 문의는 실시간으로 상담원에게 전환(Human Handoff)하며, 이전 대화 맥락을 그대로 인계하여 중복 질문 없이 매끄러운 상담이 이어집니다.", tags: ["Human Handoff", "실시간 전환", "맥락 인계", "협업"] },
];

const process = [
  { step: "01", title: "요구사항 분석 & 설계", desc: "기관 특성, 학습자 문의 패턴, 연동 시스템을 심층 분석하여 챗봇 아키텍처와 대화 시나리오를 설계합니다.", detail: "인텐트 설계 · 엔티티 정의 · 아키텍처 설계" },
  { step: "02", title: "데이터 수집 & AI 학습", desc: "FAQ, 강의 자료, 내부 규정 등 기관 보유 문서를 수집·정제하고 벡터 임베딩으로 변환합니다. LLM 파인튜닝 및 RAG 파이프라인을 구축합니다.", detail: "문서 파싱 · 벡터 DB 구축 · RAG 파이프라인" },
  { step: "03", title: "개발 & 품질 검증", desc: "챗봇 엔진 개발 및 LMS·채널 연동 작업 후 100개 이상의 엣지케이스 시나리오를 테스트하여 정확도와 폴백 처리를 검증합니다.", detail: "시나리오 테스트 · 성능 측정 · Fallback 검증" },
  { step: "04", title: "배포 & 지속 운영 지원", desc: "LMS, 카카오톡, 웹사이트 등 전 채널 배포 후 월별 성능 리포트와 정기 파인튜닝으로 챗봇 품질을 지속적으로 개선합니다.", detail: "멀티채널 배포 · 월별 리포트 · 정기 개선" },
];

const stats = [
  { value: "80%", label: "반복 문의 자동 처리", sub: "운영팀 업무 부담 감소" },
  { value: "24/7", label: "무중단 응답 서비스", sub: "학습자 만족도 향상" },
  { value: "2주", label: "평균 구축 기간", sub: "빠른 서비스 적용" },
];

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AI 챗봇"
        description="GPT-4o, Claude 3.5 기반 LMS 연동 AI 챗봇. 학습자 문의 자동 응대, FAQ 자동 학습, 다국어 지원으로 24시간 학습 지원 환경을 구축합니다."
        keywords="AI 챗봇, LMS 챗봇, 이러닝 챗봇, GPT 챗봇, 학습 챗봇, 이러닝 상담봇"
        path="/chatbot"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "웹헤즈 AI 챗봇",
          "provider": { "@type": "Organization", "name": "웹헤즈" },
          "description": "GPT-4o, Claude 3.5 기반 LMS 연동 AI 챗봇 서비스",
          "areaServed": "KR",
          "serviceType": "AI 챗봇 개발",
          "url": "https://webheads-sparkle-landing.lovable.app/chatbot"
        }}
      />
      {/* Hero */}
      <section
        className="relative min-h-[76vh] flex items-center pt-20 pb-14 overflow-hidden"
        style={{ background: "linear-gradient(160deg, hsl(210, 50%, 92%) 0%, hsl(214, 60%, 88%) 40%, hsl(220, 50%, 85%) 100%)" }}
      >
        <div className="absolute pointer-events-none" style={{ width: "120%", height: "120%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse 60% 50% at 65% 45%, hsla(192, 80%, 70%, 0.18) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "80%", height: "80%", bottom: "-10%", left: "-5%", background: "radial-gradient(ellipse 50% 60% at 30% 70%, hsla(152, 60%, 60%, 0.1) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ opacity: 0.85 }}>
          <div className="relative w-full h-full max-w-[900px] mx-auto hidden lg:flex items-center justify-center" style={{ transform: "translateX(40%)" }}>
            <ChatbotHeroVisual />
          </div>
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10 lg:pl-[10%]">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "hsla(0, 0%, 100%, 0.85)", backdropFilter: "blur(8px)", color: "hsl(192, 80%, 35%)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>AI챗봇</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight" style={{ color: "hsl(220, 60%, 8%)" }}>
              이러닝 전문<br />
              <span style={{ color: "hsl(192, 90%, 42%)" }}>AI 챗봇 솔루션</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 40%)", textShadow: "0 1px 2px hsla(0, 0%, 100%, 0.6)" }}>학습자의 질문에 24시간 즉시 응답하는 AI 챗봇으로 교육 운영 비용을 절감하고 학습자 만족도를 획기적으로 높이세요.</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85" style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}>무료 데모 신청</a>
              <a href="#process" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border" style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "hsla(0, 0%, 100%, 0.8)", backdropFilter: "blur(8px)" }}>구축 과정 보기</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-3 gap-0 divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <span className="block font-black leading-none mb-2 text-5xl md:text-6xl text-foreground tracking-tight">{s.value}</span>
                <span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">주요 기능</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">최신 AI 기술로<br />이러닝을 혁신하세요</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {f.tags.map((tag) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">구축 과정</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">체계적인<br />4단계 구축 프로세스</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p, i) => (
              <div key={p.step} className="relative rounded-2xl p-7 bg-background border border-border hover:border-primary/30 transition-colors flex flex-col gap-3">
                <span className="font-black text-5xl tracking-tight text-primary/20">{p.step}</span>
                <h3 className="font-bold text-foreground text-base tracking-tight">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{p.desc}</p>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-primary font-medium">{p.detail}</p>
                </div>
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-primary/30">
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}
