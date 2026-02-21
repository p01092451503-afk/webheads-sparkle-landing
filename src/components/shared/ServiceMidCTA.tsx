interface ServiceMidCTAProps {
  heading: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function ServiceMidCTA({ heading, description, ctaText = "무료 상담 신청하기", ctaHref = "#contact" }: ServiceMidCTAProps) {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h3 className="font-black text-primary-foreground text-2xl lg:text-3xl tracking-tight mb-3">{heading}</h3>
        <p className="text-primary-foreground/70 text-base mb-8 max-w-lg mx-auto">{description}</p>
        <a href={ctaHref} className="inline-flex px-8 py-3.5 rounded-2xl font-bold text-sm bg-background text-foreground hover:bg-background/90 transition-colors">{ctaText}</a>
      </div>
    </section>
  );
}
