import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ContactSection from "@/components/ContactSection";
import { Film, PenTool, Layers, Package, Monitor, Users, Mic, Palette, ClipboardCheck } from "lucide-react";

const features = [
  {
    icon: Film,
    title: "동영상 강의 제작",
    desc: "전문 스튜디오 멀티캠 촬영, 화면 녹화(캡처), 교안 기반 슬라이드 제작 등 다양한 촬영 방식을 지원합니다. 4K 해상도 촬영과 전문 조명·음향 장비로 방송 수준의 강의 영상을 제공합니다.",
    tags: ["4K 촬영", "멀티캠", "화면 녹화", "전문 편집"],
  },
  {
    icon: PenTool,
    title: "인터랙티브 콘텐츠",
    desc: "H5P, Adobe Captivate, Articulate Storyline 등 전문 저작 도구를 활용하여 분기형 시나리오, 드래그앤드롭, 퀴즈, 시뮬레이션, 게임형 학습 등 학습 몰입도를 극대화하는 인터랙티브 콘텐츠를 제작합니다.",
    tags: ["H5P", "Storyline", "Captivate", "시뮬레이션"],
  },
  {
    icon: Layers,
    title: "2D / 3D 애니메이션",
    desc: "복잡한 개념, 추상적 원리, 내부 구조 등을 2D 모션그래픽과 3D 애니메이션으로 직관적으로 시각화합니다. After Effects, Blender, Cinema 4D를 활용한 고품질 영상으로 학습 효과를 극대화합니다.",
    tags: ["After Effects", "Blender", "모션그래픽", "3D 시각화"],
  },
  {
    icon: Package,
    title: "SCORM / xAPI 패키징",
    desc: "SCORM 1.2, SCORM 2004, xAPI(Tin Can) 국제 표준 규격으로 정밀 패키징합니다. 학습 진도율, 완료 여부, 퀴즈 점수, 학습 시간 등 상세 데이터를 LMS에 실시간 전송하여 정확한 학습 이력 관리를 지원합니다.",
    tags: ["SCORM 1.2/2004", "xAPI", "Tin Can", "LMS 호환"],
  },
  {
    icon: Monitor,
    title: "반응형 멀티디바이스 지원",
    desc: "HTML5 기반으로 제작하여 PC, 태블릿, 스마트폰 등 모든 디바이스와 OS(iOS·Android·Windows)에서 레이아웃이 자동 최적화됩니다. 오프라인 재생과 앱 내 임베딩도 지원합니다.",
    tags: ["HTML5", "반응형", "iOS·Android", "오프라인 재생"],
  },
  {
    icon: Users,
    title: "법정 의무교육 콘텐츠",
    desc: "직장 내 성희롱 예방, 개인정보보호, 산업안전보건, 장애인 인식개선, 직장 내 괴롭힘 방지 등 5대 법정 의무교육을 관련 법령 최신 개정안에 맞춰 정기적으로 업데이트하여 제공합니다.",
    tags: ["5대 법정교육", "법령 최신화", "정기 업데이트", "연간 라이선스"],
  },
  {
    icon: Mic,
    title: "AI 보이스 & 전문 성우 내레이션",
    desc: "자연스러운 억양의 AI 음성합성(TTS) 기술과 전문 성우 녹음 서비스를 모두 제공합니다. 한국어·영어·중국어 등 다국어 내레이션 제작이 가능하며, 자막 파일(SRT, VTT)도 함께 생성합니다.",
    tags: ["AI TTS", "전문 성우", "다국어", "SRT 자막"],
  },
  {
    icon: Palette,
    title: "기업 BI 반영 맞춤 디자인",
    desc: "기업의 CI/BI(로고, 컬러, 폰트)를 강의 템플릿에 반영하여 브랜드 일관성을 유지합니다. 표준 템플릿 제공으로 대량 콘텐츠 제작 시 제작 기간과 비용을 최대 40% 단축합니다.",
    tags: ["CI/BI 반영", "맞춤 템플릿", "브랜딩", "대량 제작"],
  },
  {
    icon: ClipboardCheck,
    title: "품질 검수 & 접근성 준수",
    desc: "제작 완료 후 교육공학 전문가의 3단계 품질 검수(교수설계·미디어·기술)를 거칩니다. 웹 접근성 지침(WCAG 2.1 AA)을 준수하여 장애인 학습자도 차별 없이 콘텐츠를 이용할 수 있도록 제작합니다.",
    tags: ["3단계 검수", "WCAG 2.1", "접근성", "교수설계"],
  },
];

const contentTypes = [
  "기업 직무 교육", "법정 의무교육", "안전 보건 교육", "리더십 교육",
  "CS / 서비스 교육", "IT / 기술 교육", "외국어 교육", "대학 강의",
  "의료·보건 교육", "금융·보험 교육",
];

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="hero-section min-h-[60vh] flex items-center pt-20">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 부가서비스 전체보기
          </Link>
          <div className="max-w-2xl">
            <span className="feature-badge mb-5">콘텐츠 개발</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-5 leading-tight">
              기획부터 완성까지<br />
              <span className="text-primary">이러닝 콘텐츠 원스톱 제작</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl">
              기획, 스크립트, 촬영, 편집, 품질검수까지 이러닝 콘텐츠 제작의 전 과정을 웹헤즈가 책임집니다.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#contact" className="btn-primary px-7 py-3.5 rounded-xl font-semibold">제작 상담 신청</a>
              <a href="#types" className="px-7 py-3.5 rounded-xl font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">콘텐츠 유형 보기</a>
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
              <div key={f.title} className="service-card p-7 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{f.desc}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {f.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary font-medium border border-primary/15">
                      {tag}
                    </span>
                  ))}
                </div>
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
