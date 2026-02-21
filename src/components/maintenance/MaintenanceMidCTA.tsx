export default function MaintenanceMidCTA() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h3 className="font-black text-primary-foreground text-2xl lg:text-3xl tracking-tight mb-3">
          우리 서비스에 맞는 유지보수가 궁금하신가요?
        </h3>
        <p className="text-primary-foreground/70 text-base mb-8 max-w-lg mx-auto">
          현재 운영 환경을 분석하고, 최적의 유지보수 방안을 무료로 제안드립니다.
        </p>
        <a
          href="#contact"
          className="inline-flex px-8 py-3.5 rounded-2xl font-bold text-sm bg-background text-foreground hover:bg-background/90 transition-colors"
        >
          무료 상담 신청하기
        </a>
      </div>
    </section>
  );
}
