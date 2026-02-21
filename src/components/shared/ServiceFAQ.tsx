import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

interface FAQ { q: string; a: string; }
interface ServiceFAQProps { faqs: FAQ[]; serviceName?: string; }

export default function ServiceFAQ({ faqs, serviceName }: ServiceFAQProps) {
  const { t } = useTranslation();
  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">{t("faq.sub")}</p>
          <h2 className="font-black text-foreground leading-tight text-4xl lg:text-5xl tracking-tight">{t("faq.title")}</h2>
          <p className="text-muted-foreground mt-4 text-base">{serviceName ? `${serviceName}${t("faq.desc")}` : t("faq.descDefault")}</p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-2xl px-6 bg-secondary/50 data-[state=open]:bg-secondary">
              <AccordionTrigger className="text-left font-semibold text-foreground text-base py-5 hover:no-underline">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
