import { useState } from "react";
import { Phone, Mail, Send, CheckCircle } from "lucide-react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: "", name: "", phone: "", email: "", service: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="feature-badge mb-4">CONTACT US</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-4">
            전문 컨설턴트와 <span className="text-primary">무료 상담</span>하세요
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            도입 문의부터 맞춤 견적까지, 웹헤즈 전문가가 친절하게 안내드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Phone, title: "전화 상담", value: "02-540-4337", sub: "평일 09:00 ~ 18:00" },
              { icon: Mail, title: "이메일 문의", value: "34bus@webheads.co.kr", sub: "24시간 접수 가능" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50">
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs font-medium mb-1">{item.title}</div>
                  <div className="text-gray-800 font-bold text-sm">{item.value}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 border border-gray-100 rounded-2xl bg-gray-50">
                <CheckCircle className="w-14 h-14 text-primary mb-4" />
                <h3 className="text-gray-800 text-xl font-bold mb-2">상담 신청 완료!</h3>
                <p className="text-gray-500 text-sm">영업일 기준 1~2일 이내에 연락드리겠습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-gray-100 rounded-2xl bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">회사명 *</label>
                    <input
                      required type="text" placeholder="(주)OO기업"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-primary transition-colors"
                      value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">담당자명 *</label>
                    <input
                      required type="text" placeholder="홍길동"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-primary transition-colors"
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">연락처 *</label>
                    <input
                      required type="tel" placeholder="010-XXXX-XXXX"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-primary transition-colors"
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-1.5">이메일</label>
                    <input
                      type="email" placeholder="email@company.com"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-primary transition-colors"
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 text-xs font-medium mb-1.5">관심 서비스</label>
                  <select
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-primary transition-colors"
                    value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                  >
                    <option value="">서비스를 선택하세요</option>
                    <option value="lms">LMS (이러닝솔루션)</option>
                    <option value="hosting">이러닝 호스팅</option>
                    <option value="chatbot">AI 챗봇 개발</option>
                    <option value="app">APP 개발</option>
                    <option value="content">콘텐츠 개발</option>
                    <option value="drm">DRM 솔루션</option>
                    <option value="channel">채널톡 / SMS</option>
                    <option value="pg">PG 결제 연동</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-xs font-medium mb-1.5">문의 내용</label>
                  <textarea
                    rows={3} placeholder="문의하실 내용을 자유롭게 작성해주세요."
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
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
