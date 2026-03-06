import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, AlertTriangle, ChevronRight, CheckCircle } from "lucide-react";

const appleIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const androidIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.6 11.48V16a1 1 0 0 1-1 1h-1v3.5a1.5 1.5 0 0 1-3 0V17h-1v3.5a1.5 1.5 0 0 1-3 0V17h-1a1 1 0 0 1-1-1v-4.52A4.98 4.98 0 0 1 7 8h10a4.98 4.98 0 0 1 .6 3.48zM6 11.5a1.5 1.5 0 0 1-3 0v-3a1.5 1.5 0 0 1 3 0v3zm15 0a1.5 1.5 0 0 1-3 0v-3a1.5 1.5 0 0 1 3 0v3zM16.12 4.37l1.46-1.46a.5.5 0 0 0-.71-.71L15.28 3.8A5.93 5.93 0 0 0 12 3c-1.18 0-2.28.34-3.22.93L7.13 2.2a.5.5 0 0 0-.71.71l1.46 1.46A5.96 5.96 0 0 0 6 8h12a5.96 5.96 0 0 0-1.88-3.63zM10 6H9V5h1v1zm5 0h-1V5h1v1z" />
  </svg>
);

export default function StoreSubmissionSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"ios" | "android">("ios");

  const section = t("appdev.storeSubmissionSection", { returnObjects: true }) as any;
  const data = t("appdev.storeSubmission", { returnObjects: true }) as any;
  const store = data[activeTab];

  return (
    <section className="py-16 md:py-28 bg-background">
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3 md:mb-4">{section.sub}</p>
          <h2 className="font-bold text-foreground leading-tight text-2xl md:text-4xl lg:text-5xl tracking-tight whitespace-pre-line">{section.title}</h2>
          <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base">{section.desc}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("ios")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === "ios" ? "bg-foreground text-background shadow-lg" : "bg-background text-foreground border border-border hover:border-muted-foreground/40"}`}
          >
            {appleIcon}
            {data.ios.name}
          </button>
          <button
            onClick={() => setActiveTab("android")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === "android" ? "bg-foreground text-background shadow-lg" : "bg-background text-foreground border border-border hover:border-muted-foreground/40"}`}
          >
            <span className={activeTab === "android" ? "text-background" : "text-foreground"}>{androidIcon}</span>
            {data.android.name}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Process */}
          <div className="rounded-2xl bg-background border border-border p-6 md:p-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg">{store.process.title}</h3>
            </div>
            <div className="flex flex-col gap-4">
              {store.process.steps.map((step: any) => (
                <div key={step.step} className="flex gap-4 group">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">
                    {step.step}
                  </div>
                  <div className="flex-1 pb-4 border-b border-border/60 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-foreground text-sm mb-1">{step.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed" style={{ wordBreak: "keep-all" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Features + Cautions */}
          <div className="flex flex-col gap-5">
            {/* Features */}
            <div className="rounded-2xl bg-background border border-border p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-lg">{store.features.title}</h3>
              </div>
              <ul className="flex flex-col gap-2.5">
                {store.features.items.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="text-primary mt-0.5 shrink-0">✓</span>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cautions */}
            <div className="rounded-2xl bg-background border border-border p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(35, 80%, 93%)" }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: "hsl(35, 70%, 42%)" }} />
                </div>
                <h3 className="font-bold text-foreground text-lg">{store.cautions.title}</h3>
              </div>
              <div className="flex flex-col gap-3">
                {store.cautions.items.map((item: any, i: number) => (
                  <details key={i} className="group rounded-xl border border-border/60 overflow-hidden">
                    <summary className="flex items-center gap-2.5 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors text-sm font-semibold text-foreground list-none [&::-webkit-details-marker]:hidden">
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground transition-transform group-open:rotate-90 shrink-0" />
                      {item.title}
                    </summary>
                    <div className="px-4 pb-3.5 pt-0">
                      <p className="text-muted-foreground text-xs leading-relaxed pl-6" style={{ wordBreak: "keep-all" }}>{item.desc}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 rounded-xl border border-border bg-background px-6 py-5">
          <div className="text-center sm:text-left">
            <p className="text-foreground font-bold text-sm">{data.weHandle}</p>
            <p className="text-muted-foreground text-xs mt-1">{data.weHandleDesc}</p>
          </div>
          <a href="#contact" className="shrink-0 inline-flex px-5 py-2.5 rounded-2xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">{data.weHandleCta}</a>
        </div>
      </div>
    </section>
  );
}
