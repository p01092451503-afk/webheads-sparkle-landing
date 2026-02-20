import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import heroChatbot from "@/assets/hero-chatbot.jpg";
import ContactSection from "@/components/ContactSection";
import { Bot, Brain, MessageSquare, BarChart3, Link2, Globe, CheckCircle2, Zap } from "lucide-react";

const features = [
  { icon: Brain, title: "LLM 기반 자연어 이해", desc: "GPT, Claude 등 최신 대형 언어 모델을 활용하여 복잡한 질문에도 정확하게 응답합니다." },
  { icon: MessageSquare, title: "LMS 연동 맞춤 응답", desc: "수강 현황, 과제, 성적 등 LMS 데이터와 연동하여 학습자별 개인화된 답변을 제공합니다." },
  { icon: Zap, title: "FAQ 자동 학습", desc: "기존 FAQ 데이터를 업로드하면 자동으로 학습하여 즉시 운영 가능한 챗봇을 구성합니다." },
  { icon: Globe, title: "다국어 지원", desc: "한국어, 영어, 중국어 등 다양한 언어를 지원하여 글로벌 이러닝 플랫폼 운영이 가능합니다." },
  { icon: Link2, title: "카카오톡 / 웹 채팅 연동", desc: "카카오톡 채널, 웹사이트 채팅 위젯 등 다양한 채널에 챗봇을 배포합니다." },
  { icon: BarChart3, title: "운영 현황 대시보드", desc: "질문 유형, 해결률, 사용자 만족도 등 챗봇 운영 현황을 실시간으로 모니터링합니다." },
];

const process = [
  { step: "01", title: "요구사항 분석", desc: "기관 특성과 학습자 패턴을 분석하여 최적의 챗봇 구성을 설계합니다." },
  { step: "02", title: "데이터 수집 & 학습", desc: "FAQ, 강의 자료, 규정 등 기관 데이터를 기반으로 AI 모델을 학습시킵니다." },
  { step: "03", title: "개발 & 테스트", desc: "챗봇 개발 후 다양한 시나리오를 테스트하여 품질을 검증합니다." },
  { step: "04", title: "배포 & 운영 지원", desc: "LMS 및 기타 채널에 배포하고, 지속적인 성능 개선을 지원합니다." },
];

export default function ChatbotPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-section min-h-[70vh] flex items-center pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${heroChatbot})` }}
        />
        <div className="container mx-auto px-4 py-20 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 부가서비스 전체보기
          </Link>
          <div className="max-w-2xl">
            <span className="feature-badge mb-5" style={{ background: "hsl(192 90% 55% / 0.1)", color: "hsl(192 90% 65%)", borderColor: "hsl(192 90% 55% / 0.3)" }}>
              AI 챗봇 개발
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-5 leading-tight">
              이러닝 전문<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, hsl(192,90%,55%), hsl(210,95%,70%))" }}>
                AI 챗봇 솔루션
              </span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
              학습자의 질문에 24시간 즉시 응답하는 AI 챗봇으로 교육 운영 비용을 절감하고
              학습자 만족도를 획기적으로 높이세요.
            </p>
            <div className="flex gap-3">
              <a href="#contact" className="btn-primary px-7 py-3.5 rounded-xl font-semibold">
                무료 데모 신청
              </a>
              <a href="#process" className="px-7 py-3.5 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
                구축 과정 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">주요 기능</span>
            <h2 className="text-3xl font-bold mt-4">AI 챗봇 핵심 기능</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="service-card p-7">
                <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">구축 과정</span>
            <h2 className="text-3xl font-bold mt-4">체계적인 4단계 구축 프로세스</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {process.map((p, i) => (
              <div key={p.step} className="relative text-center p-6 rounded-2xl border border-border bg-card">
                <div className="text-5xl font-black text-primary/8 mb-3">{p.step}</div>
                <h3 className="font-bold text-base mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
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

      {/* Benefits */}
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: "80%", label: "반복 문의 자동 처리", sub: "운영팀 업무 부담 감소" },
              { value: "24/7", label: "무중단 응답 서비스", sub: "학습자 만족도 향상" },
              { value: "2주", label: "평균 구축 기간", sub: "빠른 서비스 적용" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-black text-brand-cyan mb-2">{stat.value}</div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-white/40 text-sm">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
