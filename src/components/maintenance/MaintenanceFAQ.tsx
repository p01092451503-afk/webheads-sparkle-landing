import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "유지보수 계약 중에 추가 개발 요청도 가능한가요?",
    a: "네, 가능합니다. Standard 이상 플랜에서는 월 일정 건수의 소규모 기능 개선이 포함되어 있으며, 대규모 개발이 필요한 경우 별도 견적을 안내드립니다. 기존 시스템을 가장 잘 아는 전담 엔지니어가 개발하므로 외부 업체 대비 빠르고 안정적입니다.",
  },
  {
    q: "장애가 발생하면 어떤 프로세스로 대응하나요?",
    a: "NOC 팀이 24/7 모니터링하다가 장애를 감지하면 즉시 담당 엔지니어에게 알림이 전달됩니다. 평균 5분 이내 초동 조치를 시작하며, 복구 후에는 RCA(Root Cause Analysis) 보고서를 작성하여 원인 분석과 재발 방지 대책을 공유합니다.",
  },
  {
    q: "현재 다른 업체에서 운영 중인데, 전환이 가능한가요?",
    a: "가능합니다. 기존 서버 환경과 소스코드를 분석한 후 무중단 전환 계획을 수립합니다. 인수인계 기간 동안 기존 업체와 병행 운영하여 서비스 중단 없이 안전하게 이관합니다.",
  },
  {
    q: "월간 리포트에는 어떤 내용이 포함되나요?",
    a: "서버 가동률, 트래픽 분석, 장애 발생·처리 이력, 보안 점검 결과, 성능 지표(응답 시간·DB 상태), 작업 내역 요약이 포함됩니다. Premium 플랜은 주간 리포트도 추가로 제공됩니다.",
  },
  {
    q: "계약 기간과 해지 조건은 어떻게 되나요?",
    a: "최소 계약 기간은 3개월이며, 이후 월 단위로 연장됩니다. 해지는 1개월 전 서면 통보로 가능하며, 해지 시 모든 관리 문서와 접근 권한을 인수인계합니다.",
  },
  {
    q: "보안 패치는 얼마나 자주 적용되나요?",
    a: "긴급 보안 패치(CVE 등급 Critical)는 발표 후 24시간 이내 적용하며, 일반 패치는 월 1~2회 정기 점검 시 일괄 적용합니다. 패치 전후 테스트를 거쳐 서비스 안정성을 확보합니다.",
  },
];

export default function MaintenanceFAQ() {
  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">FAQ</p>
          <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">
            자주 묻는 질문
          </h2>
          <p className="text-muted-foreground mt-4 text-base">
            유지보수 서비스에 대해 궁금한 점을 확인하세요.
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-2xl px-6 bg-secondary/50 data-[state=open]:bg-secondary"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground text-base py-5 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
