import {
  Code2, Paintbrush, LayoutDashboard, MonitorSmartphone, Puzzle, Layers,
} from "lucide-react";

const devFeatures = [
  {
    icon: Code2,
    title: "신규 기능 개발",
    desc: "기존 LMS에 없는 기능을 새롭게 개발하여 추가합니다. 출석 관리, 퀴즈 엔진, 수강권 시스템, 결제 연동 등 다양한 기능을 맞춤 개발합니다.",
    tags: ["맞춤 기능 개발", "API 연동", "LMS 확장"],
  },
  {
    icon: Paintbrush,
    title: "UI/UX 디자인 개선",
    desc: "노후화된 화면을 최신 트렌드에 맞게 리뉴얼합니다. 학습자 경험을 중심으로 직관적인 화면 구조와 세련된 시각 디자인을 적용합니다.",
    tags: ["화면 리뉴얼", "UX 개선", "반응형 디자인"],
  },
  {
    icon: LayoutDashboard,
    title: "관리자 화면 고도화",
    desc: "관리자가 필요로 하는 통계 대시보드, 대량 회원 관리, 콘텐츠 일괄 처리 등 운영 효율을 높이는 관리 기능을 추가로 개발합니다.",
    tags: ["대시보드", "대량 처리", "운영 자동화"],
  },
  {
    icon: MonitorSmartphone,
    title: "모바일 최적화",
    desc: "PC 중심으로 개발된 LMS를 모바일·태블릿 환경에서도 완벽하게 동작하도록 반응형으로 개선합니다.",
    tags: ["반응형 웹", "모바일 UX", "크로스 디바이스"],
  },
  {
    icon: Puzzle,
    title: "외부 서비스 연동",
    desc: "카카오톡 알림톡, PG 결제, HR·ERP 시스템, SSO, 외부 API 등 다양한 서드파티 서비스와 LMS를 연동합니다.",
    tags: ["카카오 알림톡", "PG 결제", "SSO 연동"],
  },
  {
    icon: Layers,
    title: "기존 콘텐츠 마이그레이션",
    desc: "타사 LMS나 구형 시스템에서 학습 데이터, 회원 정보, 동영상 콘텐츠를 안전하게 이전합니다. 무중단 전환을 지원합니다.",
    tags: ["데이터 이전", "무중단 전환", "콘텐츠 마이그레이션"],
  },
];

export default function MaintenanceDevFeatures() {
  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">추가 개발</p>
          <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">
            유지보수를 넘어<br />기능 개발까지
          </h2>
          <p className="text-muted-foreground mt-4 text-base">
            단순 관리를 넘어, LMS의 성장을 함께 설계하고 개발합니다.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {devFeatures.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-7 bg-secondary hover:bg-muted transition-colors duration-200 flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background shadow-sm">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-base tracking-tight">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">{f.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {f.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
