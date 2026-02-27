import { useTranslation } from "react-i18next";

interface ServiceMidCTAProps {
  heading: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function ServiceMidCTA({ heading, description, ctaText, ctaHref = "#contact" }: ServiceMidCTAProps) {
  const { t } = useTranslation();
  const buttonText = ctaText || t("contact.formSubmit");
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h3 className="font-bold text-primary-foreground text-2xl lg:text-3xl tracking-tight mb-3">{heading}</h3>
        <p className="text-primary-foreground/70 text-base mb-8 max-w-lg mx-auto">{description}</p>
        <a href={ctaHref} className="inline-flex px-8 py-3.5 rounded-2xl font-bold text-sm bg-white text-primary hover:bg-white/90 transition-colors">{buttonText}</a>
      </div>
    </section>
  );
}
