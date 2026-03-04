import { Link } from "react-router-dom";
import { Check, Gift, Shield, Settings, Clock, ArrowRight, CalendarDays, MessageSquare, FileCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";

const benefits = [
  {
    icon: Gift,
    title: "웹헤즈 Light LMS 2개월 무료",
    desc: "웹헤즈 Light 버전을 2개월간 무료로 체험하세요. 기본 LMS 기능을 모두 포함하여 교육 운영을 바로 시작할 수 있습니다.",
    value: "약 60만원 상당",
    accent: "hsl(340, 55%, 50%)",
    accentBg: "hsl(340, 60%, 94%)",
  },
  {
    icon: Shield,
    title: "SSL 인증서 2년 무료 지원",
    desc: "보안 통신을 위한 SSL 인증서를 2년간 무료로 제공합니다. 수강생의 개인정보를 안전하게 보호하세요.",
    value: "약 20만원 상당",
    accent: "hsl(280, 45%, 50%)",
    accentBg: "hsl(280, 50%, 94%)",
  },
  {
    icon: Settings,
    title: "LMS 초기 세팅 무료",
    desc: "전문 엔지니어가 LMS 초기 환경 구성을 무료로 진행합니다. 도메인 연결, 기본 디자인, 카테고리 구성 등을 포함합니다.",
    value: "30만원 상당",
    accent: "hsl(320, 50%, 48%)",
    accentBg: "hsl(320, 55%, 94%)",
  },
];

const steps = [
  { step: "01", title: "이벤트 신청", desc: "아래 신청 버튼을 클릭하여 상담을 신청하세요.", icon: MessageSquare },
  { step: "02", title: "담당자 상담", desc: "전문 담당자가 연락드려 요구사항을 확인합니다.", icon: MessageSquare },
  { step: "03", title: "계약 체결", desc: "LMS 1년 이용 계약을 체결합니다.", icon: FileCheck },
  { step: "04", title: "혜택 적용", desc: "계약 즉시 모든 프로모션 혜택이 적용됩니다.", icon: Sparkles },
];

const faqs = [
  {
    q: "웹헤즈 Light 버전에는 어떤 기능이 포함되나요?",
    a: "웹헤즈 Light는 학습 관리, 수강생 관리, 콘텐츠 업로드, 진도 추적, 수료증 발급 등 LMS 운영에 필요한 핵심 기능을 모두 포함합니다.",
  },
  {
    q: "2개월 무료 이용 후 자동으로 유료 전환되나요?",
    a: "네, 1년 이용 계약 기준으로 처음 2개월은 무료이며, 3개월차부터 정상 요금이 부과됩니다.",
  },
  {
    q: "이벤트 신청 후 LMS 세팅까지 얼마나 걸리나요?",
    a: "계약 체결 후 평균 3~5영업일 내에 초기 세팅이 완료됩니다.",
  },
  {
    q: "기존에 웹헤즈를 이용 중인 고객도 신청 가능한가요?",
    a: "본 프로모션은 신규 계약 고객 대상입니다. 기존 고객은 별도 혜택을 문의해 주세요.",
  },
];

export default function EventPage() {
  return (
    <>
      <SEO
        title="3월 프로모션 | LMS 2개월 무료 이용권 증정 - WEBHEADS"
        description="웹헤즈 Light LMS 2개월 무료, SSL 2년 무료, 초기 세팅 무료! 3월 한정 프로모션. 1년 이용 계약 시 총 110만원 상당 혜택."
      />

      {/* Hero */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28 overflow-hidden" style={{ background: "linear-gradient(160deg, hsl(350, 65%, 94%) 0%, hsl(340, 55%, 90%) 25%, hsl(320, 45%, 91%) 50%, hsl(280, 40%, 93%) 75%, hsl(300, 35%, 95%) 100%)" }}>
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-40" style={{ background: "hsl(350, 70%, 88%)" }} />
          <div className="absolute bottom-[5%] right-[10%] w-[400px] h-[400px] rounded-full blur-[130px] opacity-30" style={{ background: "hsl(280, 50%, 90%)" }} />
          <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full blur-[120px] opacity-25" style={{ background: "hsl(30, 70%, 92%)" }} />
        </div>
        {/* Subtle decorative circles */}
        <div className="absolute top-20 right-[15%] w-24 h-24 rounded-full border-2 opacity-[0.08]" style={{ borderColor: "hsl(340, 50%, 50%)" }} />
        <div className="absolute bottom-16 left-[10%] w-16 h-16 rounded-full border opacity-[0.06]" style={{ borderColor: "hsl(320, 40%, 50%)" }} />
        <div className="absolute top-32 left-[8%] w-8 h-8 rounded-full opacity-[0.1]" style={{ background: "hsl(340, 60%, 80%)" }} />

        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 text-sm font-bold backdrop-blur-sm" style={{ background: "hsl(340, 70%, 85%)", color: "hsl(340, 55%, 25%)" }}>
            <Clock className="w-4 h-4" />
            ~2026.3.31 마감
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-6" style={{ color: "hsl(340, 35%, 18%)" }}>
            3월 신청시<br />
            <span style={{ color: "hsl(340, 55%, 42%)" }}>LMS 2개월 무료</span> 이용권 증정!
          </h1>
          <p className="text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "hsl(340, 15%, 40%)" }}>
            막막한 교육플랫폼 구축, 웹헤즈와 함께 시작하세요.<br />
            1년 이용 계약 시 <strong style={{ color: "hsl(340, 40%, 25%)" }}>총 110만원 상당</strong>의 혜택을 드립니다.
          </p>
          <Link
            to="/lms#contact"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-lg transition-all text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, hsl(340, 55%, 48%) 0%, hsl(320, 50%, 45%) 100%)" }}
          >
            지금 바로 신청하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <p className="text-sm font-bold tracking-widest uppercase text-center mb-3" style={{ color: "hsl(340, 50%, 55%)" }}>
            BENEFITS
          </p>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground text-center mb-4">
            혜택 한눈에 보기
          </h2>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            3월 프로모션 신청 시 아래 혜택을 모두 제공합니다.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group relative rounded-2xl border border-border bg-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: b.accent }} />
                <div className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: b.accentBg, color: b.accent }}>
                  {b.value}
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: b.accentBg }}>
                  <b.icon className="w-6 h-6" style={{ color: b.accent }} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions — compact inline */}
      <section className="py-6 border-y border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center text-sm text-muted-foreground">
            <span className="font-semibold text-foreground mr-1">지원 조건</span>
            {[
              "LMS 1년 이용 계약 (신규 고객)",
              "2026.3.31까지 신청",
              "Light 버전 기준",
              "타 프로모션 중복 불가",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(340, 50%, 50%)" }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <p className="text-sm font-bold tracking-widest uppercase text-center mb-3" style={{ color: "hsl(340, 50%, 55%)" }}>
            HOW TO
          </p>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground text-center mb-14">
            참여 방법
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px" style={{ background: "linear-gradient(90deg, hsl(340, 50%, 80%), hsl(280, 40%, 80%))" }} />
            {steps.map((s, i) => (
              <div key={s.step} className="text-center relative">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-black text-lg relative z-10 shadow-md"
                  style={{ background: `hsl(${340 - i * 20}, ${50 + i * 3}%, ${48 + i * 2}%)` }}
                >
                  {s.step}
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-sm font-bold tracking-widest uppercase text-center mb-3" style={{ color: "hsl(340, 50%, 55%)" }}>
            FAQ
          </p>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground text-center mb-10">
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.q} className="bg-muted/60 rounded-xl p-6 hover:bg-muted transition-colors">
                <h3 className="font-bold text-foreground mb-2 flex items-start gap-2">
                  <span className="shrink-0 text-sm font-black mt-0.5" style={{ color: "hsl(340, 50%, 50%)" }}>Q.</span>
                  {f.q}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed pl-6">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(340, 50%, 92%) 0%, hsl(320, 45%, 90%) 50%, hsl(280, 40%, 93%) 100%)" }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-[100px] opacity-30" style={{ background: "hsl(340, 60%, 85%)" }} />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full blur-[80px] opacity-20" style={{ background: "hsl(280, 50%, 88%)" }} />
        </div>
        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <CalendarDays className="w-10 h-10 mx-auto mb-4" style={{ color: "hsl(340, 50%, 45%)" }} />
          <h2 className="text-2xl lg:text-3xl font-black mb-4" style={{ color: "hsl(340, 40%, 20%)" }}>
            지금 신청하고 110만원 상당 혜택 받으세요
          </h2>
          <p className="mb-8" style={{ color: "hsl(340, 20%, 40%)" }}>
            프로모션은 2026년 3월 31일에 종료됩니다. 서둘러 신청하세요!
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-lg transition-all text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, hsl(340, 55%, 48%) 0%, hsl(320, 50%, 45%) 100%)" }}
          >
            무료 상담 신청
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
}
