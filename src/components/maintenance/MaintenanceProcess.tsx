import { FileSearch, Settings, Monitor, AlertTriangle, FileText } from "lucide-react";

const steps = [
  { icon: FileSearch, title: "초기 진단", desc: "서버·코드·DB 환경을 전수 점검하고 현황 보고서를 작성합니다.", tag: "1~2주" },
  { icon: Settings, title: "환경 세팅", desc: "모니터링 도구 설치, 알림 채널 연동, 백업 정책을 수립합니다.", tag: "1주" },
  { icon: Monitor, title: "상시 모니터링", desc: "24/7 NOC 팀이 서버 상태를 실시간 감시하고 이상 징후를 탐지합니다.", tag: "상시" },
  { icon: AlertTriangle, title: "장애 대응", desc: "장애 감지 시 5분 내 초동 조치, 복구 후 RCA 보고서를 공유합니다.", tag: "5분 내" },
  { icon: FileText, title: "정기 리포트", desc: "월간 성능·보안·작업 내역 리포트를 제공하고 개선안을 제안합니다.", tag: "월 1회" },
];

export default function MaintenanceProcess() {
  return (
    <section className="py-28 bg-secondary">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">프로세스</p>
          <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">
            체계적인 유지보수<br />진행 프로세스
          </h2>
          <p className="text-muted-foreground mt-4 text-base">
            계약부터 정기 리포트까지, 투명하고 체계적으로 진행됩니다.
          </p>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />
          <div className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6 relative">
                {/* Step number circle */}
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 rounded-2xl bg-background p-6 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">STEP {i + 1}</span>
                    <span className="text-xs text-muted-foreground">{step.tag}</span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
