import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import heroChannel from "@/assets/hero-channel.jpg";
import ContactSection from "@/components/ContactSection";
import { MessageCircle, Smartphone, Bell, UserCheck, BarChart3, Settings, CheckCircle2 } from "lucide-react";

const features = [
  { icon: MessageCircle, title: "채널톡 연동", desc: "채널톡(Channel.io)을 LMS와 연동하여 학습자에게 실시간 채팅 상담 기능을 제공합니다." },
  { icon: Smartphone, title: "SMS 대량 발송", desc: "공지사항, 수강 안내, 수료 축하 등 맞춤형 SMS를 학습자에게 효율적으로 발송합니다." },
  { icon: Bell, title: "학습 독려 메시지", desc: "미수강자, 마감 임박 학습자에게 자동으로 독려 SMS/채팅 메시지를 발송합니다." },
  { icon: UserCheck, title: "CRM 연동", desc: "LMS 학습자 데이터와 연동하여 세그먼트별 맞춤 메시지를 발송합니다." },
  { icon: BarChart3, title: "발송 통계 분석", desc: "메시지 발송 수, 열람율, 클릭율 등 상세 통계를 통해 커뮤니케이션 효과를 분석합니다." },
  { icon: Settings, title: "자동화 시나리오", desc: "수강 신청, 학습 완료, 수료증 발급 등 이벤트 기반 자동 메시지 발송 시나리오를 설정합니다." },
];

const useCases = [
  { title: "수강 안내 발송", desc: "신규 수강생 등록 시 자동으로 접속 방법, 학습 일정 안내 SMS를 발송합니다." },
  { title: "학습 독려 알림", desc: "학습 진도가 일정 기준 이하인 학습자에게 맞춤형 독려 메시지를 발송합니다." },
  { title: "수료 축하 메시지", desc: "과정 수료 시 자동으로 축하 메시지와 수료증 발급 안내를 발송합니다." },
  { title: "실시간 채팅 상담", desc: "채널톡을 통해 학습 중 발생하는 질문에 실시간으로 응대합니다." },
  { title: "공지사항 일괄 발송", desc: "중요 공지사항을 전체 학습자 또는 특정 그룹에 일괄 SMS로 발송합니다." },
  { title: "만족도 조사 링크 발송", desc: "과정 종료 후 자동으로 학습 만족도 조사 링크를 SMS로 발송합니다." },
];

export default function ChannelPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-section min-h-[70vh] flex items-center pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroChannel})` }}
        />
        <div className="container mx-auto px-4 py-20 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 부가서비스 전체보기
          </Link>
          <div className="max-w-2xl">
            <span className="feature-badge mb-5" style={{ background: "hsl(40 90% 55% / 0.15)", color: "hsl(40 90% 70%)", borderColor: "hsl(40 90% 55% / 0.3)" }}>
              채널톡 / SMS
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-5 leading-tight">
              학습자와의 소통을<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, hsl(40,90%,65%), hsl(25,90%,65%))" }}>
                자동화로 효율화
              </span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
              채널톡과 SMS를 LMS와 연동하여 학습 독려부터 수료 안내까지
              학습자와의 모든 커뮤니케이션을 자동화하세요.
            </p>
            <div className="flex gap-3">
              <a href="#contact" className="btn-primary px-7 py-3.5 rounded-xl font-semibold">
                도입 상담 신청
              </a>
              <a href="#usecases" className="px-7 py-3.5 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
                활용 사례 보기
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
            <h2 className="text-3xl font-bold mt-4">채널톡 / SMS 핵심 기능</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="service-card p-7">
                <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="usecases" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">활용 사례</span>
            <h2 className="text-3xl font-bold mt-4">이런 상황에 활용하세요</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              학습 여정의 모든 단계에서 자동화된 커뮤니케이션으로 학습자 경험을 향상시킵니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {useCases.map((uc, i) => (
              <div key={uc.title} className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{uc.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: "98%", label: "SMS 도달률", sub: "안정적인 메시지 전송" },
              { value: "40%↑", label: "학습 완료율 향상", sub: "독려 메시지 효과" },
              { value: "즉시", label: "LMS 연동", sub: "빠른 서비스 적용" },
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
