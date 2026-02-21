import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";
import SEO from "@/components/SEO";
import ContentHeroVisual from "@/components/visuals/ContentHeroVisual";
import ServiceMidCTA from "@/components/shared/ServiceMidCTA";
import ServiceFAQ from "@/components/shared/ServiceFAQ";
import { Film, PenTool, Layers, Monitor, Users, Mic, Palette, ClipboardCheck, Gamepad2, BookOpen, Building2, Stethoscope, GraduationCap, Globe } from "lucide-react";

const testimonials = [
  { name: "송민아", role: "HRD 매니저", org: "P 대기업", rating: 4, date: "2024.10", period: "이용 4년차", content: "영상 퀄리티가 확실히 다릅니다. 직원들이 '이거 외부 교육 영상이냐'고 물어볼 정도예요." },
  { name: "윤재혁", role: "교수설계자", org: "Q 공공교육기관", rating: 5, date: "2024.12", period: "이용 7년차", content: "인터랙티브 콘텐츠 넣고 나서 학습자 반응이 확 달라졌어요. 시나리오 분기형이 효과가 좋습니다." },
  { name: "강다은", role: "교육팀", org: "R 의료기관", rating: 3, date: "2025.02", period: "이용 2년차", content: "의료 술기 같은 건 글로 설명하기 어려운데, 3D 애니메이션으로 만들어주시니까 이해가 빠르다고 해요." },
];

const features = [
  { icon: Film, title: "동영상 강의 제작", desc: "전문 스튜디오 멀티캠 촬영, 화면 녹화, 교안 기반 슬라이드 제작 등 다양한 방식을 지원합니다.", tags: ["4K 촬영", "멀티캠", "화면 녹화", "전문 편집"] },
  { icon: PenTool, title: "인터랙티브 콘텐츠", desc: "H5P, Adobe Captivate, Articulate Storyline 등으로 분기형 시나리오, 퀴즈, 시뮬레이션 등을 제작합니다.", tags: ["H5P", "Storyline", "Captivate", "시뮬레이션"] },
  { icon: Layers, title: "2D / 3D 애니메이션", desc: "복잡한 개념을 2D 모션그래픽과 3D 애니메이션으로 직관적으로 시각화합니다.", tags: ["After Effects", "Blender", "모션그래픽", "3D 시각화"] },
  { icon: Gamepad2, title: "게이미피케이션 콘텐츠", desc: "포인트·배지·리더보드·미션 시스템을 콘텐츠에 내재화하여 학습자의 지속적인 참여를 유도합니다.", tags: ["포인트·배지", "리더보드", "시나리오 학습", "몰입형"] },
  { icon: Monitor, title: "반응형 멀티디바이스 지원", desc: "HTML5 기반으로 모든 디바이스에서 레이아웃이 자동 최적화됩니다.", tags: ["HTML5", "반응형", "iOS·Android", "오프라인 재생"] },
  { icon: Users, title: "법정 의무교육 콘텐츠", desc: "5대 법정 의무교육을 관련 법령 최신 개정안에 맞춰 정기적으로 업데이트합니다.", tags: ["5대 법정교육", "법령 최신화", "정기 업데이트", "연간 라이선스"] },
  { icon: Mic, title: "AI 보이스 & 전문 성우 내레이션", desc: "AI 음성합성(TTS)과 전문 성우 녹음 서비스를 모두 제공합니다.", tags: ["AI TTS", "전문 성우", "다국어", "SRT 자막"] },
  { icon: Palette, title: "기업 BI 반영 맞춤 디자인", desc: "기업의 CI/BI를 강의 템플릿에 반영하여 브랜드 일관성을 유지합니다.", tags: ["CI/BI 반영", "맞춤 템플릿", "브랜딩", "대량 제작"] },
  { icon: ClipboardCheck, title: "품질 검수 & 접근성 준수", desc: "교육공학 전문가의 3단계 품질 검수를 거치며, WCAG 2.1 AA를 준수합니다.", tags: ["3단계 검수", "WCAG 2.1", "접근성", "교수설계"] },
];

const contentTypes = [
  { icon: Building2, label: "기업 직무 교육", desc: "입문부터 심화까지, 직무역량 강화 맞춤 콘텐츠" },
  { icon: Users, label: "법정 의무교육", desc: "성희롱·안전·개인정보보호 등 5대 법정교육" },
  { icon: Stethoscope, label: "의료·보건 교육", desc: "임상 시뮬레이션, 환자 안전, 감염 예방 교육" },
  { icon: GraduationCap, label: "대학·HRD 교육", desc: "학점 인정, 역량 중심 대학 이러닝 강좌" },
  { icon: Gamepad2, label: "게이미피케이션 학습", desc: "몰입형 시나리오·미션 기반 학습 경험 설계" },
  { icon: Globe, label: "외국어 교육", desc: "영어·중국어·일본어 등 다국어 강의 제작" },
  { icon: BookOpen, label: "리더십·조직문화", desc: "변화관리, 소통, 리더십 역량 개발 콘텐츠" },
  { icon: Film, label: "금융·보험 교육", desc: "준법·윤리·상품 교육 콘텐츠 전문 제작" },
];

const stats = [
  { value: "500+", label: "제작 강좌", sub: "검증된 레퍼런스" },
  { value: "4K", label: "촬영 해상도", sub: "방송 수준 품질" },
  { value: "9가지+", label: "콘텐츠 유형", sub: "목적별 최적 포맷" },
  { value: "3단계", label: "품질 검수", sub: "교수설계·미디어·기술" },
];

const faqs = [
  { q: "콘텐츠 제작 기간은 얼마나 걸리나요?", a: "단순 촬영 편집은 2~3주, 인터랙티브·애니메이션 콘텐츠는 4~6주가 소요됩니다. 대량 제작 시 병렬 작업으로 기간을 단축할 수 있습니다." },
  { q: "기존 교안(PPT)으로도 콘텐츠를 만들 수 있나요?", a: "네, 기존 PPT 교안을 기반으로 슬라이드형 강의, 화면 녹화형 강의, 인터랙티브 콘텐츠 등으로 변환 제작할 수 있습니다." },
  { q: "법정 의무교육 콘텐츠는 법령 변경 시 업데이트되나요?", a: "연간 라이선스 계약 시 법령 개정에 따른 콘텐츠 업데이트를 무상으로 제공합니다. 개정 사항 발생 시 30일 이내 반영합니다." },
  { q: "내레이션은 AI 보이스와 전문 성우 중 어떤 것이 좋은가요?", a: "대량 제작·빠른 납기에는 AI TTS가, 고품질·감성 전달이 중요한 경우 전문 성우를 추천합니다. 두 가지를 혼합하는 것도 가능합니다." },
  { q: "WCAG 접근성 기준을 반드시 준수해야 하나요?", a: "공공기관·대학 등은 법적으로 웹 접근성을 준수해야 합니다. 민간기업도 장애인 학습자 지원을 위해 적용을 권장하며, 기본 제작 시 WCAG 2.1 AA를 준수합니다." },
];

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="콘텐츠 개발" description="동영상 강의, 인터랙티브 콘텐츠, 2D/3D 애니메이션, 게이미피케이션까지 다양한 이러닝 콘텐츠를 전문 제작합니다." keywords="이러닝 콘텐츠 제작, 동영상 강의, 인터랙티브 콘텐츠, 게이미피케이션, 법정 의무교육" path="/content" jsonLd={{ "@context": "https://schema.org", "@type": "Service", "name": "웹헤즈 콘텐츠 개발", "provider": { "@type": "Organization", "name": "웹헤즈" }, "description": "다양한 유형의 이러닝 콘텐츠 전문 제작", "areaServed": "KR", "serviceType": "이러닝 콘텐츠 제작", "url": "https://webheads-sparkle-landing.lovable.app/content" }} />

      {/* Hero */}
      <section className="relative min-h-[76vh] flex items-center pt-20 pb-14 overflow-hidden" style={{ background: "linear-gradient(160deg, hsl(210, 50%, 92%) 0%, hsl(214, 60%, 88%) 40%, hsl(220, 50%, 85%) 100%)" }}>
        <div className="absolute pointer-events-none" style={{ width: "120%", height: "120%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse 60% 50% at 65% 45%, hsla(25, 80%, 70%, 0.18) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ width: "80%", height: "80%", bottom: "-10%", left: "-5%", background: "radial-gradient(ellipse 50% 60% at 30% 70%, hsla(152, 60%, 60%, 0.1) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center" style={{ opacity: 0.85 }}>
          <div className="relative w-full h-full max-w-[900px] mx-auto hidden lg:flex items-center justify-center" style={{ transform: "translateX(40%)" }}><ContentHeroVisual /></div>
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10 lg:pl-[10%]">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "hsla(0, 0%, 100%, 0.85)", backdropFilter: "blur(8px)", color: "hsl(25, 80%, 40%)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>콘텐츠</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight" style={{ color: "hsl(220, 60%, 8%)" }}>어떤 교육이든<br /><span style={{ color: "hsl(25, 90%, 50%)" }}>최적의 콘텐츠로 제작합니다</span></h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 40%)", textShadow: "0 1px 2px hsla(0, 0%, 100%, 0.6)" }}>동영상·인터랙티브·게이미피케이션·애니메이션 등 학습 목적에 맞는 콘텐츠를 전문가가 설계하고 제작합니다.</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85" style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}>제작 상담 신청</a>
              <a href="#types" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border" style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "hsla(0, 0%, 100%, 0.8)", backdropFilter: "blur(8px)" }}>콘텐츠 유형 보기</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s) => (<div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center"><span className="block font-black leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span><span className="block text-sm font-semibold text-foreground mb-0.5">{s.label}</span><span className="block text-xs text-muted-foreground">{s.sub}</span></div>))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">주요 역량</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">콘텐츠 제작의<br />모든 과정을 책임집니다</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (<div key={f.title} className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm"><f.icon className="w-5 h-5 text-primary" /></div><h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p><div className="flex flex-wrap gap-1.5 mt-1">{f.tags.map((tag) => (<span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">{tag}</span>))}</div></div>))}
          </div>
        </div>
      </section>

      <ServiceMidCTA heading="어떤 콘텐츠가 필요한지 고민되시나요?" description="교육 목적과 대상에 맞는 최적의 콘텐츠 유형을 무료로 제안드립니다." ctaText="제작 상담 신청하기" />

      {/* Content Types */}
      <section id="types" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">콘텐츠 유형</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">어떤 분야든<br />맞춤 제작합니다</h2>
            <p className="text-muted-foreground mt-4 text-base">기업 교육부터 법정 의무교육, 의료·금융·대학 강의까지 수백 개 이상의 제작 레퍼런스를 보유하고 있습니다.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contentTypes.map((type) => (<div key={type.label} className="rounded-2xl p-6 bg-background border border-border hover:border-primary/30 hover:shadow-sm transition-all flex flex-col gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(25, 90%, 95%)" }}><type.icon className="w-5 h-5" style={{ color: "hsl(25, 80%, 40%)" }} /></div><h3 className="font-bold text-foreground text-sm tracking-tight">{type.label}</h3><p className="text-muted-foreground text-xs leading-relaxed">{type.desc}</p></div>))}
          </div>
        </div>
      </section>

      <ServiceFAQ faqs={faqs} serviceName="콘텐츠 제작 서비스" />
      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
    </div>
  );
}
