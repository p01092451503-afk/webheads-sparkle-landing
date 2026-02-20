import { useState } from "react";
import { Send, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const services = [
  "이러닝 호스팅",
  "AI 챗봇 개발",
  "APP 개발",
  "콘텐츠 개발",
  "DRM 솔루션",
  "채널톡 / SMS",
  "PG 결제 연동",
];

export default function ContactSection() {
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
      setError(err.message || "이메일 발송 중 오류가 발생했습니다. 다시 시도해주세요.");
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
            CONTACT US
          </p>
          <h2
            className="leading-tight text-4xl lg:text-5xl tracking-tight"
            style={{ fontWeight: 900, color: "hsl(220, 60%, 8%)" }}
          >
            전문 컨설턴트와{" "}
            <span style={{ color: "hsl(214, 90%, 52%)" }}>무료 상담</span>하세요
          </h2>
          <p className="mt-4 text-base" style={{ color: "hsl(220, 20%, 50%)" }}>
            도입 문의부터 맞춤 견적까지, 웹헤즈 전문가가 친절하게 안내드립니다.
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
                    신규 도입 문의
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
                    장애 및 유지보수 문의
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
                  이메일 문의
                </p>
                <a
                  href="mailto:34bus@webheads.co.kr"
                  className="font-bold text-sm transition-colors"
                  style={{ color: "hsl(220, 60%, 8%)" }}
                >
                  34bus@webheads.co.kr
                </a>
                <p className="text-xs mt-0.5" style={{ color: "hsl(220, 20%, 50%)" }}>
                  24시간 접수 가능
                </p>
              </div>
            </div>

            {/* Business hours */}
            <div
              className="rounded-2xl bg-white p-6"
              style={{ border: "1px solid hsl(214, 20%, 88%)" }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: "hsl(220, 20%, 50%)" }}>
                운영 시간
              </p>
              <p className="text-sm font-medium" style={{ color: "hsl(220, 60%, 8%)" }}>
                평일 10:00 – 18:00
              </p>
              <p className="text-xs mt-1" style={{ color: "hsl(220, 20%, 50%)" }}>
                점심시간 12:00–13:00 · 주 5일 근무
              </p>
              <p className="text-xs" style={{ color: "hsl(220, 20%, 50%)" }}>
                토/일/공휴일 휴무
              </p>
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
                  상담 신청이 완료되었습니다
                </h3>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: "hsl(220, 20%, 50%)" }}>
                  빠른 시일 내에 담당자가 연락드리겠습니다.
                  <br />
                  평일 10:00–18:00 운영 기준으로 응대합니다.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-3 rounded-2xl font-semibold text-sm transition-colors"
                  style={{ background: "hsl(214, 30%, 94%)", color: "hsl(220, 60%, 8%)" }}
                >
                  다시 문의하기
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
                      회사명 <span style={{ color: "hsl(214, 90%, 52%)" }}>*</span>
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
                      담당자명 <span style={{ color: "hsl(214, 90%, 52%)" }}>*</span>
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
                      연락처 <span style={{ color: "hsl(214, 90%, 52%)" }}>*</span>
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
                      이메일
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
                    관심 서비스
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
                    <option value="">서비스를 선택하세요</option>
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: "hsl(220, 60%, 8%)" }}>
                    문의 내용
                  </label>
                  <textarea
                    rows={4}
                    placeholder="문의하실 내용을 자유롭게 작성해주세요."
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
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      무료 상담 신청하기
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
