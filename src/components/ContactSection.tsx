import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: "", name: "", phone: "", email: "", service: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-navy-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="feature-badge mb-4" style={{ background: "hsl(192 90% 55% / 0.1)", color: "hsl(192 90% 65%)", borderColor: "hsl(192 90% 55% / 0.3)" }}>
            CONTACT US
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mt-4 mb-4">
            전문 컨설턴트와 <span className="text-brand-cyan">무료 상담</span>하세요
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">
            도입 문의부터 맞춤 견적까지, 웹헤즈 전문가가 친절하게 안내드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* 전화번호 크게 표시 */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex items-stretch gap-0">
                <div className="flex-1 min-w-0 pr-6">
                  <div className="text-white/50 text-sm mb-2">신규 도입 문의</div>
                  <a href="tel:023364338" className="text-white font-bold text-2xl hover:text-brand-cyan transition-colors block">
                    02.336.4338
                  </a>
                </div>
                <div className="w-px bg-white/20 shrink-0" />
                <div className="flex-1 min-w-0 pl-6">
                  <div className="text-white/50 text-sm mb-2 whitespace-nowrap overflow-hidden text-ellipsis">장애 및 유지보수 문의</div>
                  <a href="tel:025404337" className="text-white font-bold text-2xl hover:text-brand-cyan transition-colors block">
                    02.540.4337
                  </a>
                </div>
              </div>
            </div>

            {/* 이메일 */}
            <div className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-primary-gradient flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white/40 text-xs font-medium mb-1">이메일 문의</div>
                <div className="text-white font-semibold text-sm">34bus@webheads.co.kr</div>
                <div className="text-white/40 text-xs mt-0.5">24시간 접수 가능</div>
              </div>
            </div>
          </div>
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 border border-white/10 rounded-2xl bg-white/5">
                <CheckCircle className="w-14 h-14 text-brand-cyan mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">상담 신청 완료!</h3>
                <p className="text-white/50 text-sm">영업일 기준 1~2일 이내에 연락드리겠습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs font-medium mb-1.5">회사명 *</label>
                    <input
                      required
                      type="text"
                      placeholder="(주)OO기업"
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-blue transition-colors"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs font-medium mb-1.5">담당자명 *</label>
                    <input
                      required
                      type="text"
                      placeholder="홍길동"
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-blue transition-colors"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs font-medium mb-1.5">연락처 *</label>
                    <input
                      required
                      type="tel"
                      placeholder="010-XXXX-XXXX"
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-blue transition-colors"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs font-medium mb-1.5">이메일</label>
                    <input
                      type="email"
                      placeholder="email@company.com"
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-blue transition-colors"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">관심 서비스</label>
                  <select
                    className="w-full px-3 py-2.5 bg-navy-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-blue transition-colors"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                  >
                    <option value="">서비스를 선택하세요</option>
                    <option value="lms">LMS (이러닝솔루션)</option>
                    <option value="hosting">이러닝 호스팅</option>
                    <option value="chatbot">AI 챗봇 개발</option>
                    <option value="app">APP 개발</option>
                    <option value="content">콘텐츠 개발</option>
                    <option value="drm">DRM 솔루션</option>
                    <option value="channel">채널톡 / SMS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">문의 내용</label>
                  <textarea
                    rows={3}
                    placeholder="문의하실 내용을 자유롭게 작성해주세요."
                    className="w-full px-3 py-2.5 bg-white/10 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-blue transition-colors resize-none"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold">
                  <Send className="w-4 h-4" />
                  무료 상담 신청하기
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
