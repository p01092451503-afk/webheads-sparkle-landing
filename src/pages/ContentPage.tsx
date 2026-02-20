import heroContent from "@/assets/hero-content-toss.png";
import ContactSection from "@/components/ContactSection";
import SEO from "@/components/SEO";
import { Film, PenTool, Layers, Monitor, Users, Mic, Palette, ClipboardCheck, Gamepad2, BookOpen, Building2, Stethoscope, GraduationCap, Globe } from "lucide-react";

const features = [
  { icon: Film, title: "동영상 강의 제작", desc: "전문 스튜디오 멀티캠 촬영, 화면 녹화(캡처), 교안 기반 슬라이드 제작 등 다양한 촬영 방식을 지원합니다. 4K 해상도 촬영과 전문 조명·음향 장비로 방송 수준의 강의 영상을 제공합니다.", tags: ["4K 촬영", "멀티캠", "화면 녹화", "전문 편집"] },
  { icon: PenTool, title: "인터랙티브 콘텐츠", desc: "H5P, Adobe Captivate, Articulate Storyline 등 전문 저작 도구를 활용하여 분기형 시나리오, 드래그앤드롭, 퀴즈, 시뮬레이션 등 학습 몰입도를 극대화하는 인터랙티브 콘텐츠를 제작합니다.", tags: ["H5P", "Storyline", "Captivate", "시뮬레이션"] },
  { icon: Layers, title: "2D / 3D 애니메이션", desc: "복잡한 개념, 추상적 원리, 내부 구조 등을 2D 모션그래픽과 3D 애니메이션으로 직관적으로 시각화합니다. After Effects, Blender, Cinema 4D를 활용한 고품질 영상으로 학습 효과를 극대화합니다.", tags: ["After Effects", "Blender", "모션그래픽", "3D 시각화"] },
  { icon: Gamepad2, title: "게이미피케이션 콘텐츠", desc: "포인트·배지·리더보드·미션 시스템을 콘텐츠에 내재화하여 학습자의 지속적인 참여를 유도합니다. 스토리텔링 기반 시나리오 학습으로 실무 적용 능력을 강화합니다.", tags: ["포인트·배지", "리더보드", "시나리오 학습", "몰입형"] },
  { icon: Monitor, title: "반응형 멀티디바이스 지원", desc: "HTML5 기반으로 제작하여 PC, 태블릿, 스마트폰 등 모든 디바이스와 OS(iOS·Android·Windows)에서 레이아웃이 자동 최적화됩니다. 오프라인 재생과 앱 내 임베딩도 지원합니다.", tags: ["HTML5", "반응형", "iOS·Android", "오프라인 재생"] },
  { icon: Users, title: "법정 의무교육 콘텐츠", desc: "직장 내 성희롱 예방, 개인정보보호, 산업안전보건, 장애인 인식개선, 직장 내 괴롭힘 방지 등 5대 법정 의무교육을 관련 법령 최신 개정안에 맞춰 정기적으로 업데이트하여 제공합니다.", tags: ["5대 법정교육", "법령 최신화", "정기 업데이트", "연간 라이선스"] },
  { icon: Mic, title: "AI 보이스 & 전문 성우 내레이션", desc: "자연스러운 억양의 AI 음성합성(TTS) 기술과 전문 성우 녹음 서비스를 모두 제공합니다. 한국어·영어·중국어 등 다국어 내레이션 제작이 가능하며, 자막 파일(SRT, VTT)도 함께 생성합니다.", tags: ["AI TTS", "전문 성우", "다국어", "SRT 자막"] },
  { icon: Palette, title: "기업 BI 반영 맞춤 디자인", desc: "기업의 CI/BI(로고, 컬러, 폰트)를 강의 템플릿에 반영하여 브랜드 일관성을 유지합니다. 표준 템플릿 제공으로 대량 콘텐츠 제작 시 제작 기간과 비용을 최대 40% 단축합니다.", tags: ["CI/BI 반영", "맞춤 템플릿", "브랜딩", "대량 제작"] },
  { icon: ClipboardCheck, title: "품질 검수 & 접근성 준수", desc: "제작 완료 후 교육공학 전문가의 3단계 품질 검수(교수설계·미디어·기술)를 거칩니다. WCAG 2.1 AA를 준수하여 장애인 학습자도 차별 없이 콘텐츠를 이용할 수 있도록 제작합니다.", tags: ["3단계 검수", "WCAG 2.1", "접근성", "교수설계"] },
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
  { value: "다양한", label: "콘텐츠 유형", sub: "목적별 최적 포맷" },
  { value: "3단계", label: "품질 검수", sub: "교수설계·미디어·기술" },
];

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="콘텐츠 개발"
        description="동영상 강의, 인터랙티브 콘텐츠, 2D/3D 애니메이션, 게이미피케이션까지 다양한 유형의 이러닝 콘텐츠를 전문 제작합니다. 기업 교육부터 법정 의무교육까지."
        keywords="이러닝 콘텐츠 제작, 동영상 강의, 인터랙티브 콘텐츠, 게이미피케이션, 법정 의무교육, 이러닝 영상 제작"
        path="/content"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "웹헤즈 콘텐츠 개발",
          "provider": { "@type": "Organization", "name": "웹헤즈" },
          "description": "동영상·인터랙티브·게이미피케이션 등 다양한 유형의 이러닝 콘텐츠 전문 제작",
          "areaServed": "KR",
          "serviceType": "이러닝 콘텐츠 제작",
          "url": "https://webheads-sparkle-landing.lovable.app/content"
        }}
      />
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden"
        style={{ background: "hsl(210, 50%, 90%)" }}
      >
        <div
          className="absolute right-0 top-0 h-full w-[55%] pointer-events-none select-none hidden lg:block"
        >
          <img src={heroContent} alt="" fetchPriority="high" className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[65%] object-contain animate-float" style={{ filter: "drop-shadow(0 40px 80px rgba(30,60,120,0.22)) drop-shadow(0 12px 28px rgba(30,60,120,0.14))" }} />
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6" style={{ background: "#fff", color: "hsl(25, 80%, 40%)", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}>콘텐츠</span>
            <h1 className="text-4xl lg:text-[3.2rem] font-black leading-tight mb-5 tracking-tight" style={{ color: "hsl(220, 60%, 8%)" }}>
              어떤 교육이든<br />
              <span style={{ color: "hsl(25, 90%, 50%)" }}>최적의 콘텐츠로 제작합니다</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "hsl(220, 20%, 45%)" }}>동영상·인터랙티브·게이미피케이션·애니메이션 등 학습 목적과 대상에 꼭 맞는 콘텐츠 유형을 전문가가 설계하고 제작합니다.</p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-85" style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}>제작 상담 신청</a>
              <a href="#types" className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-colors border" style={{ borderColor: "hsl(214, 20%, 85%)", color: "hsl(220, 60%, 8%)", background: "#fff" }}>콘텐츠 유형 보기</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <span className="block font-black leading-none mb-2 text-4xl md:text-5xl text-foreground tracking-tight">{s.value}</span>
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
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">주요 역량</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">콘텐츠 제작의<br />모든 과정을 책임집니다</h2>
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

      {/* Content Types */}
      <section id="types" className="py-28 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">콘텐츠 유형</p>
            <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">어떤 분야든<br />맞춤 제작합니다</h2>
            <p className="text-muted-foreground mt-4 text-base">기업 교육부터 법정 의무교육, 의료·금융·대학 강의까지 수백 개 이상의 제작 레퍼런스를 보유하고 있습니다.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contentTypes.map((type) => (
              <div key={type.label} className="rounded-2xl p-6 bg-background border border-border hover:border-primary/30 hover:shadow-sm transition-all flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(25, 90%, 95%)" }}>
                  <type.icon className="w-5 h-5" style={{ color: "hsl(25, 80%, 40%)" }} />
                </div>
                <h3 className="font-bold text-foreground text-sm tracking-tight">{type.label}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}

