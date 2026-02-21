import { useState } from "react";
import { Send, Mail, Loader2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

export default function ContactSection() {
  const { t } = useTranslation();
  const services = t("contact.services", { returnObjects: true }) as string[];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "send-contact-email",
        { body: form }
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

  return (
    <section
      id="contact"
      style={{ background: "hsl(214, 30%, 96%)" }}
      className="py-28 border-t border-gray-200"
    >
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(214, 90%, 52%)" }}>
            {t("contact.sub")}
          </p>
          <h2
            className="leading-tight text-4xl lg:text-5xl tracking-tight"
            style={{ fontWeight: 900, color: "hsl(220, 60%, 8%)" }}
          >
            {t("contact.title")}{" "}
            <span style={{ color: "hsl(214, 90%, 52%)" }}>{t("contact.titleHighlight")}</span>
            {t("contact.titleEnd")}
          </h2>
          <p className="mt-4 text-base" style={{ color: "hsl(220, 20%, 50%)" }}>
            {t("contact.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Phone numbers */}
            <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid hsl(214, 20%, 88%)" }}>
              <div className="flex items-stretch gap-0 divide-x" style={{ borderColor: "hsl(214, 20%, 88%)" }}>
                <div className="flex-1 pr-5">
                  <p className="text-xs font-semibold mb-2" style={{ color: "hsl(220, 20%, 50%)" }}>
                    {t("contact.newInquiry")}
                  </p>
                  <a
                    href="tel:0233364338"
                    className="block text-2xl tracking-tight transition-colors"
                    style={{ fontWeight: 900, color: "hsl(220, 60%, 8%)" }}
                  >
                    02.336.4338
                  </a>
                </div>
                <div className="flex-1 pl-5">
                  <p className="text-xs font-semibold mb-2" style={{ color: "hsl(220, 20%, 50%)" }}>
                    {t("contact.maintenanceInquiry")}
                  </p>
                  <a
                    href="tel:0254044337"
                    className="block text-2xl tracking-tight transition-colors"
                    style={{ fontWeight: 900, color: "hsl(220, 60%, 8%)" }}
                  >
                    02.540.4337
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div
              className="rounded-2xl bg-white p-6 flex items-center gap-4"
              style={{ border: "1px solid hsl(214, 20%, 88%)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "hsl(214, 90%, 52%)" }}
              >
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: "hsl(220, 20%, 50%)" }}>
                  {t("contact.emailInquiry")}
                </p>
                <a
                  href="mailto:34bus@webheads.co.kr"
                  className="font-bold text-[1.17rem] leading-snug transition-colors"
                  style={{ color: "hsl(220, 60%, 8%)" }}
                >
                  34bus@webheads.co.kr
                </a>
                <p className="text-[0.845rem] mt-0.5" style={{ color: "hsl(220, 20%, 50%)" }}>
                  {t("contact.emailAvailable")}
                </p>
              </div>
            </div>

            {/* Business hours */}
            <div
              className="rounded-2xl bg-white p-6 flex items-start gap-4"
              style={{ border: "1px solid hsl(214, 20%, 88%)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "hsl(214, 90%, 52%)" }}
              >
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: "hsl(220, 20%, 50%)" }}>
                  {t("contact.businessHours")}
                </p>
                <p className="text-[1.17rem] font-bold leading-snug" style={{ color: "hsl(220, 60%, 8%)" }}>
                  {t("contact.businessHoursValue")}
                </p>
                <p className="text-[0.715rem] mt-1" style={{ color: "hsl(220, 20%, 50%)" }}>
                  {t("contact.lunchBreak")}
                </p>
                <p className="text-[0.715rem]" style={{ color: "hsl(220, 20%, 50%)" }}>
                  {t("contact.holiday")}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div
                className="rounded-3xl bg-white p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[460px]"
                style={{ border: "1px solid hsl(214, 20%, 88%)" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                  style={{ background: "hsl(214, 90%, 52%)" }}
                >
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h3
                  className="text-2xl tracking-tight"
                  style={{ fontWeight: 900, color: "hsl(220, 60%, 8%)" }}
                >
                  {t("contact.successTitle")}
                </h3>
                <p className="text-sm leading-relaxed max-w-xs whitespace-pre-line" style={{ color: "hsl(220, 20%, 50%)" }}>
                  {t("contact.successDesc")}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-3 rounded-2xl font-semibold text-sm transition-colors"
                  style={{ background: "hsl(214, 30%, 94%)", color: "hsl(220, 60%, 8%)" }}
                >
                  {t("contact.successRetry")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl bg-white p-8 flex flex-col gap-4"
                style={{ border: "1px solid hsl(214, 20%, 88%)" }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold" style={{ color: "hsl(220, 60%, 8%)" }}>
                      {t("contact.formCompany")} <span style={{ color: "hsl(214, 90%, 52%)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="(주)OO기업"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                      style={{
                        border: "1px solid hsl(214, 20%, 88%)",
                        background: "hsl(214, 30%, 96%)",
                        color: "hsl(220, 60%, 8%)",
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold" style={{ color: "hsl(220, 60%, 8%)" }}>
                      {t("contact.formName")} <span style={{ color: "hsl(214, 90%, 52%)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="홍길동"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                      style={{
                        border: "1px solid hsl(214, 20%, 88%)",
                        background: "hsl(214, 30%, 96%)",
                        color: "hsl(220, 60%, 8%)",
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold" style={{ color: "hsl(220, 60%, 8%)" }}>
                      {t("contact.formPhone")} <span style={{ color: "hsl(214, 90%, 52%)" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="010-XXXX-XXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                      style={{
                        border: "1px solid hsl(214, 20%, 88%)",
                        background: "hsl(214, 30%, 96%)",
                        color: "hsl(220, 60%, 8%)",
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold" style={{ color: "hsl(220, 60%, 8%)" }}>
                      {t("contact.formEmail")}
                    </label>
                    <input
                      type="email"
                      placeholder="email@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                      style={{
                        border: "1px solid hsl(214, 20%, 88%)",
                        background: "hsl(214, 30%, 96%)",
                        color: "hsl(220, 60%, 8%)",
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: "hsl(220, 60%, 8%)" }}>
                    {t("contact.formService")}
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all appearance-none"
                    style={{
                      border: "1px solid hsl(214, 20%, 88%)",
                      background: "hsl(214, 30%, 96%)",
                      color: "hsl(220, 60%, 8%)",
                    }}
                  >
                    <option value="">{t("contact.formServicePlaceholder")}</option>
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: "hsl(220, 60%, 8%)" }}>
                    {t("contact.formMessage")}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t("contact.formMessagePlaceholder")}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
                    style={{
                      border: "1px solid hsl(214, 20%, 88%)",
                      background: "hsl(214, 30%, 96%)",
                      color: "hsl(220, 60%, 8%)",
                    }}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 text-center rounded-xl py-2 px-4" style={{ background: "hsl(0, 100%, 97%)" }}>
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-85 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "hsl(220, 60%, 8%)", color: "#fff" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("contact.formSending")}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t("contact.formSubmit")}
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