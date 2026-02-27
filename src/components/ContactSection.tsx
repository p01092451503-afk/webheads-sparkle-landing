import { useState } from "react";
import { Send, Mail, Loader2, Clock, Phone, ChevronDown, Monitor } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

type InquiryType = "consultation" | "demo";

export default function ContactSection({ showDemo = false }: { showDemo?: boolean }) {
  const { t } = useTranslation();
  const services = t("contact.services", { returnObjects: true }) as string[];

  const [inquiryType, setInquiryType] = useState<InquiryType>("consultation");
  const [form, setForm] = useState({
    company: "",
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "send-contact-email",
        { body: { ...form, inquiryType } }
      );

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || t("contact.formError"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/50";

  const inputStyle = (field: string) => ({
    border:
      focusedField === field
        ? "1.5px solid hsl(var(--primary))"
        : "1px solid hsl(var(--border))",
    background:
      focusedField === field ? "hsl(var(--background))" : "hsl(var(--muted))",
    color: "hsl(var(--foreground))",
    boxShadow:
      focusedField === field
        ? "0 0 0 3px hsl(var(--primary) / 0.08)"
        : "none",
  });

  return (
    <section
      id="contact"
      className="py-20 border-t border-border"
      style={{ background: "var(--contact-bg)" }}
    >
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header — compact */}
        <div className="mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 text-primary">
            {t("contact.sub")}
          </p>
          <h2
            className="leading-tight text-3xl lg:text-4xl tracking-tight text-foreground"
            style={{ fontWeight: 900 }}
          >
            {t("contact.title")}{" "}
            <span className="text-primary">{t("contact.titleHighlight")}</span>
            {t("contact.titleEnd")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("contact.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Left: Contact Info — compact single column */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* Phone numbers — inline compact */}
            <div className="p-5 bg-card border border-border hover:border-primary/20 transition-all">
              <div className="flex items-stretch gap-0 divide-x divide-border">
                <div className="flex-1 pr-4 min-w-0">
                  <p className="text-[0.6rem] font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">
                    {t("contact.newInquiry")}
                  </p>
                  <a
                    href="tel:0233364338"
                    className="block text-[1.2rem] tracking-tight text-foreground hover:text-primary transition-colors"
                    style={{ fontWeight: 800 }}
                  >
                    02.336.4338
                  </a>
                </div>
                <div className="flex-1 pl-4 min-w-0">
                  <p className="text-[0.6rem] font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">
                    {t("contact.maintenanceInquiry")}
                  </p>
                  <a
                    href="tel:0254044337"
                    className="block text-[1.2rem] tracking-tight text-foreground hover:text-primary transition-colors"
                    style={{ fontWeight: 800 }}
                  >
                    02.540.4337
                  </a>
                </div>
              </div>
            </div>

            {/* Email — compact */}
            <div className="p-5 flex items-center gap-4 bg-card border border-border hover:border-primary/20 transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                <Mail className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.6rem] font-semibold mb-0.5 uppercase tracking-wider text-muted-foreground">
                  {t("contact.emailInquiry")}
                </p>
                <a
                  href="mailto:34bus@webheads.co.kr"
                  className="font-bold text-sm leading-snug text-foreground hover:text-primary transition-colors"
                >
                  34bus@webheads.co.kr
                </a>
                <p className="text-[0.7rem] mt-0.5 text-primary font-medium">
                  {t("contact.emailAvailable")}
                </p>
              </div>
            </div>

            {/* Business hours — compact */}
            <div className="rounded-xl p-5 flex items-center gap-4 bg-card border border-border hover:border-primary/20 transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                <Clock className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.6rem] font-semibold mb-0.5 uppercase tracking-wider text-muted-foreground">
                  {t("contact.businessHours")}
                </p>
                <p className="text-sm font-bold leading-snug text-foreground">
                  {t("contact.businessHoursValue")}
                </p>
                <p className="text-[0.7rem] text-muted-foreground mt-0.5">
                  {t("contact.lunchBreak")} · {t("contact.holiday")}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form — compact */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3 min-h-[420px] bg-card border border-border shadow-sm">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-1"
                  style={{
                    background: "hsl(var(--primary))",
                    boxShadow: "0 6px 20px hsl(var(--primary) / 0.25)",
                  }}
                >
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl tracking-tight text-foreground" style={{ fontWeight: 900 }}>
                  {t("contact.successTitle")}
                </h3>
                <p className="text-sm leading-relaxed max-w-xs whitespace-pre-line text-muted-foreground">
                  {t("contact.successDesc")}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-80 bg-secondary text-foreground"
                >
                  {t("contact.successRetry")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-6 lg:p-8 flex flex-col gap-4 bg-card border border-border shadow-sm"
              >
                {showDemo && (
                  <div className="flex rounded-lg p-1 gap-1 bg-muted">
                    <button
                      type="button"
                      onClick={() => setInquiryType("consultation")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-bold transition-all duration-200 ${
                        inquiryType === "consultation"
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      {t("contact.tabConsultation")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType("demo")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-bold transition-all duration-200 ${
                        inquiryType === "demo"
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      {t("contact.tabDemo")}
                    </button>
                  </div>
                )}

                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold tracking-wide text-foreground">
                      {t("contact.formCompany")} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("contact.formCompanyPlaceholder")}
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      onFocus={() => setFocusedField("company")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass}
                      style={inputStyle("company")}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold tracking-wide text-foreground">
                      {t("contact.formName")} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("contact.formNamePlaceholder")}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass}
                      style={inputStyle("name")}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold tracking-wide text-foreground">
                      {t("contact.formPhone")} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={t("contact.formPhonePlaceholder")}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass}
                      style={inputStyle("phone")}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold tracking-wide text-foreground">
                      {t("contact.formEmail")}
                    </label>
                    <input
                      type="email"
                      placeholder={t("contact.formEmailPlaceholder")}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass}
                      style={inputStyle("email")}
                    />
                  </div>
                </div>

                {/* Service */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold tracking-wide text-foreground">
                    {t("contact.formService")}
                  </label>
                  <div className="relative">
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      onFocus={() => setFocusedField("service")}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                      style={inputStyle("service")}
                    >
                      <option value="">{t("contact.formServicePlaceholder")}</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold tracking-wide text-foreground">
                    {t("contact.formMessage")}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={inquiryType === "demo" ? t("contact.formMessagePlaceholderDemo") : t("contact.formMessagePlaceholder")}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClass} resize-none`}
                    style={inputStyle("message")}
                  />
                </div>

                {error && (
                  <p className="text-sm text-center rounded-lg py-2 px-3 font-medium bg-destructive/10 text-destructive border border-destructive/20">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  style={{
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    boxShadow: "0 4px 14px hsl(var(--primary) / 0.25)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("contact.formSending")}
                    </>
                  ) : (
                    <>
                      {inquiryType === "demo" ? <Monitor className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      {inquiryType === "demo" ? t("contact.formSubmitDemo") : t("contact.formSubmit")}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
