import { Link } from "react-router-dom";
import { Check, Gift, Shield, Settings, Clock, ArrowRight, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";

const benefits = [
  {
    icon: Gift,
    title: "웹헤즈 Light LMS 2개월 무료",
    desc: "웹헤즈 Light 버전을 2개월간 무료로 체험하세요. 기본 LMS 기능을 모두 포함하여 교육 운영을 바로 시작할 수 있습니다.",
    value: "약 60만원 상당",
  },
  {
    icon: Shield,
    title: "SSL 인증서 2년 무료 지원",
    desc: "보안 통신을 위한 SSL 인증서를 2년간 무료로 제공합니다. 수강생의 개인정보를 안전하게 보호하세요.",
    value: "약 20만원 상당",
  },
  {
    icon: Settings,
    title: "LMS 초기 세팅 무료",
    desc: "전문 엔지니어가 LMS 초기 환경 구성을 무료로 진행합니다. 도메인 연결, 기본 디자인, 카테고리 구성 등을 포함합니다.",
    value: "30만원 상당",
  },
];

const steps = [
  { step: "01", title: "이벤트 신청", desc: "아래 신청 버튼을 클릭하여 상담을 신청하세요." },
  { step: "02", title: "담당자 상담", desc: "전문 담당자가 연락드려 요구사항을 확인합니다." },
  { step: "03", title: "계약 체결", desc: "LMS 1년 이용 계약을 체결합니다." },
  { step: "04", title: "혜택 적용", desc: "계약 즉시 모든 프로모션 혜택이 적용됩니다." },
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
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28 overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground mb-8">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">~2026.3.31 마감</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-primary-foreground leading-tight mb-6">
            3월 신청시<br />
            LMS 2개월 무료 이용권 증정!
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            막막한 교육플랫폼 구축, 웹헤즈와 함께 시작하세요.<br />
            1년 이용 계약 시 <strong className="text-primary-foreground">총 110만원 상당</strong>의 혜택을 드립니다.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
          >
            지금 바로 신청하기
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
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
                className="relative rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-shadow"
              >
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {b.value}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-16 lg:py-20 bg-muted">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground mb-8">
            지원 조건
          </h2>
          <div className="bg-card rounded-2xl border border-border p-8 lg:p-10 text-left space-y-4">
            {[
              "LMS 1년 이용 계약 체결 (신규 계약 고객 대상)",
              "2026년 3월 31일까지 신청 완료",
              "웹헤즈 Light 버전 기준 적용",
              "타 프로모션과 중복 적용 불가",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground text-center mb-12">
            참여 방법
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-4 text-lg font-black">
                  {s.step}
                </div>
                <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-muted">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground text-center mb-10">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-bold text-foreground mb-2">Q. {f.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-foreground">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <CalendarDays className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl lg:text-3xl font-black text-primary-foreground mb-4">
            지금 신청하고 110만원 상당 혜택 받으세요
          </h2>
          <p className="text-primary-foreground/60 mb-8">
            프로모션은 2026년 3월 31일에 종료됩니다. 서둘러 신청하세요!
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
          >
            무료 상담 신청
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
}
