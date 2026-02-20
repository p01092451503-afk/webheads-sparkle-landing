import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import heroContent from "@/assets/hero-content.jpg";
import ContactSection from "@/components/ContactSection";
import { Film, PenTool, Layers, Package, Monitor, Users, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Film, title: "동영상 강의 제작", desc: "전문 스튜디오 촬영부터 교안 기반 녹화까지, 고품질 동영상 강의를 제작합니다." },
  { icon: PenTool, title: "인터랙티브 콘텐츠", desc: "퀴즈, 시뮬레이션, 게임형 학습 등 학습자 참여를 유도하는 인터랙티브 콘텐츠를 제작합니다." },
  { icon: Layers, title: "3D 애니메이션", desc: "복잡한 개념을 시각적으로 표현하는 3D 애니메이션으로 학습 효과를 극대화합니다." },
  { icon: Package, title: "SCORM / xAPI 패키징", desc: "SCORM 1.2, SCORM 2004, xAPI(Tin Can) 등 표준 규격으로 패키징하여 LMS에 바로 탑재합니다." },
  { icon: Monitor, title: "반응형 모바일 지원", desc: "PC, 태블릿, 스마트폰 등 모든 디바이스에서 최적화된 학습 경험을 제공합니다." },
  { icon: Users, title: "법정 의무교육 콘텐츠", desc: "성희롱 예방, 개인정보보호, 산업안전 등 법정 의무교육 콘텐츠를 전문적으로 제작합니다." },
];

const contentTypes = [
  "기업 직무 교육", "법정 의무교육", "안전 보건 교육", "리더십 교육",
  "CS / 서비스 교육", "IT / 기술 교육", "외국어 교육", "대학 강의",
];

export default function ContentPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-section min-h-[70vh] flex items-center pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroContent})` }}
        />
        <div className="container mx-auto px-4 py-20 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 부가서비스 전체보기
          </Link>
          <div className="max-w-2xl">
            <span className="feature-badge mb-5" style={{ background: "hsl(25 90% 55% / 0.15)", color: "hsl(25 90% 70%)", borderColor: "hsl(25 90% 55% / 0.3)" }}>
              콘텐츠 개발
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-5 leading-tight">
              기획부터 완성까지<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, hsl(25,90%,65%), hsl(350,80%,70%))" }}>
                이러닝 콘텐츠 원스톱 제작
              </span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
              기획, 스크립트, 촬영, 편집, 품질검수까지
              이러닝 콘텐츠 제작의 전 과정을 웹헤즈가 책임집니다.
            </p>
            <div className="flex gap-3">
              <a href="#contact" className="btn-primary px-7 py-3.5 rounded-xl font-semibold">
                제작 상담 신청
              </a>
              <a href="#types" className="px-7 py-3.5 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
                콘텐츠 유형 보기
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
            <h2 className="text-3xl font-bold mt-4">콘텐츠 개발 핵심 역량</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="service-card p-7">
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Types */}
      <section id="types" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="feature-badge mb-4">콘텐츠 유형</span>
            <h2 className="text-3xl font-bold mt-4">다양한 분야의 콘텐츠 제작 경험</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              기업 교육부터 법정 의무교육, 대학 강의까지 수백 개 이상의 제작 레퍼런스를 보유하고 있습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto mb-16">
            {contentTypes.map((type) => (
              <span key={type} className="px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-default">
                {type}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            {[
              { value: "500+", label: "제작 완료 강좌", sub: "다양한 업종 경험" },
              { value: "15년+", label: "콘텐츠 제작 경력", sub: "검증된 전문성" },
              { value: "100%", label: "SCORM 호환", sub: "모든 LMS 탑재 가능" },
            ].map((stat) => (
              <div key={stat.label} className="p-8 rounded-2xl border border-border bg-card">
                <div className="text-4xl font-black text-primary mb-2">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-muted-foreground text-sm">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
