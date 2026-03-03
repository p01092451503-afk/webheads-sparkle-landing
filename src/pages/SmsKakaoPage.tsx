import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MessageSquareText, Bell, ArrowRight, Info } from "lucide-react";
import ContactSection from "@/components/ContactSection";

type TabType = "sms" | "kakao";

const SMS_TABLE = {
  counts: ["500건", "1,000건", "5,000건", "10,000건", "50,000건", "100,000건"],
  perUnit: ["25원", "23원", "20원", "19원", "17원", "15원"],
  total: ["12,500원", "23,000원", "100,000원", "190,000원", "850,000원", "1,500,000원"],
};

const KAKAO_TABLE = {
  counts: ["1,000건", "3,000건", "5,000건", "10,000건", "50,000건"],
  perUnit: ["12원", "11원", "10원", "9원", "8원"],
  total: ["12,000원", "33,000원", "50,000원", "90,000원", "400,000원"],
};

export default function SmsKakaoPage() {
  const [tab, setTab] = useState<TabType>("sms");

  return (
    <>
      <Helmet>
        <title>SMS / 알림톡 — 웹헤즈</title>
        <meta name="description" content="웹헤즈 LMS 솔루션에서 SMS 문자 발송 및 카카오 알림톡 서비스를 이용하세요. 건별 요금 안내 및 충전 방법을 확인할 수 있습니다." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden text-primary-foreground" style={{ background: "linear-gradient(135deg, hsl(220 30% 18%), hsl(225 35% 24%), hsl(220 25% 20%))" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/8" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            SMS / 알림톡(카카오)
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/70">
            솔루션에서 자동으로 문자 발송 및 알림톡 전송을 할 수 있습니다
          </p>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Tab Switch */}
          <div className="flex rounded-xl p-1 gap-1 bg-muted max-w-md mx-auto mb-14">
            <button
              onClick={() => setTab("sms")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                tab === "sms"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              문자(SMS)
            </button>
            <button
              onClick={() => setTab("kakao")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                tab === "kakao"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bell className="w-4 h-4" />
              알림톡(카카오)
            </button>
          </div>

          {tab === "sms" ? <SmsContent /> : <KakaoContent />}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight">
            서비스 요청이 필요하신가요?
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            SMS 충전 또는 카테노이드 원격지원이 필요하신 경우 아래 양식을 작성해주세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              to="/service-request?type=sms"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              <MessageSquareText className="w-4 h-4" />
              SMS 충전 요청
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/service-request?type=remote"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              <Bell className="w-4 h-4" />
              원격지원 요청
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}

function SmsContent() {
  return (
    <div className="flex flex-col gap-12">
      {/* Description */}
      <div className="max-w-3xl">
        <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">
          SMS 발송 서비스(SMS/LMS)
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          솔루션에서 자동으로 문자 발송 및 개별로 문자발송을 할 수 있습니다.
          SMS(단문), LMS(장문)으로 선택하여 사용자의 편리함을 제공하며,
          포인트 차감 방식으로 충전/차감이 되는걸 바로 확인할 수 있습니다.
          (최고 25원 ~ 최저 15원)
        </p>
      </div>

      {/* Price Table */}
      <div>
        <h3 className="text-xl font-black text-foreground tracking-tight mb-5">
          SMS 호스팅 전송요금
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="bg-foreground text-primary-foreground">
                <th colSpan={7} className="text-center px-5 py-3.5 font-bold text-base">
                  건별 요금안내
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border bg-muted/40">
                <td className="px-5 py-3.5 font-bold text-foreground w-[140px]">SMS 전송건수</td>
                {SMS_TABLE.counts.map((c) => (
                  <td key={c} className="text-center px-3 py-3.5 font-semibold text-foreground">{c}</td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="px-5 py-3.5 font-bold text-foreground">건당요금</td>
                {SMS_TABLE.perUnit.map((p, i) => (
                  <td key={i} className="text-center px-3 py-3.5 text-foreground">{p}</td>
                ))}
              </tr>
              <tr className="border-b border-border bg-muted/40">
                <td className="px-5 py-3.5 font-bold text-foreground">
                  이용금액
                  <span className="block text-xs font-normal text-muted-foreground">(VAT 별도)</span>
                </td>
                {SMS_TABLE.total.map((t, i) => (
                  <td key={i} className="text-center px-3 py-3.5 font-semibold text-primary">{t}</td>
                ))}
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-foreground">포인트차감</td>
                <td colSpan={3} className="text-center px-3 py-3.5 text-foreground">
                  <span className="font-semibold">SMS</span> 건당 <span className="font-bold text-primary">1포인트</span>
                </td>
                <td colSpan={3} className="text-center px-3 py-3.5 text-foreground">
                  <span className="font-semibold">LMS</span> 건당 <span className="font-bold text-primary">3포인트</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SMS/LMS Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">SMS</span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            텍스트만 입력할 수 있으며 <strong className="text-foreground">80byte(한글 40자)</strong>까지 전송가능<br />
            <span className="text-xs">(Short Message Service)</span>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-3">LMS</span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            텍스트만 입력할 수 있으며 최대 <strong className="text-foreground">2,000byte(한글 1,000자)</strong>까지 전송가능<br />
            <span className="text-xs">(Long Message Service)</span>
          </p>
        </div>
      </div>

      {/* Pre-registration Notice */}
      <div className="rounded-2xl border border-border bg-muted/30 p-6 lg:p-8">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <h3 className="text-lg font-black text-foreground tracking-tight">
            SMS 호스팅 신청 전 꼭 해야 할 일!
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          SMS 호스팅을 신청하기 전, <strong className="text-foreground">발신번호 사전등록</strong>을 해야 정상적으로 이용이 가능합니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="rounded-xl bg-card border border-border p-5">
            <h4 className="text-sm font-bold text-foreground mb-2">발신번호 사전등록이란?</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              전기통신사업법 제84조 의거, 거짓으로 표시된 전화번호로 인한 이용자 피해 예방을 위해
              문자 전송 시 인증된 발신번호로만 사용할 수 있도록 등록하는 제도입니다.
              인증을 통해 등록된 발신번호가 없다면 문자발송을 할 수 없습니다.
            </p>
          </div>
          <div className="rounded-xl bg-card border border-border p-5">
            <h4 className="text-sm font-bold text-foreground mb-2">등록방법</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              유지보수 신청 게시판에 사용할 대표번호/업체명을 남겨주시면
              사전등록 절차를 도와드립니다.
            </p>
            <Link
              to="/service-request?type=remote"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-primary hover:underline"
            >
              원격지원 요청하기
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function KakaoContent() {
  return (
    <div className="flex flex-col gap-12">
      {/* Description */}
      <div className="max-w-3xl">
        <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">
          알림톡(카카오) 서비스
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          솔루션에서 자동으로 발송할 수 있는 서비스입니다.
          친구추가 없이 고객의 카카오톡으로 바로 전송하며, 포인트 차감 방식으로 편리하게 이용할 수 있습니다.
          개인별로 보낼 수는 없으며, 승인된 문구만 전송이 가능합니다.
          (문구는 별도로 카카오에 승인을 진행해야 합니다.)
        </p>
      </div>

      {/* Price Table */}
      <div>
        <h3 className="text-xl font-black text-foreground tracking-tight mb-5">
          알림톡 전송요금
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="bg-foreground text-primary-foreground">
                <th colSpan={6} className="text-center px-5 py-3.5 font-bold text-base">
                  건별 요금안내
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border bg-muted/40">
                <td className="px-5 py-3.5 font-bold text-foreground w-[140px]">전송건수</td>
                {KAKAO_TABLE.counts.map((c) => (
                  <td key={c} className="text-center px-3 py-3.5 font-semibold text-foreground">{c}</td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="px-5 py-3.5 font-bold text-foreground">건당요금</td>
                {KAKAO_TABLE.perUnit.map((p, i) => (
                  <td key={i} className="text-center px-3 py-3.5 text-foreground">{p}</td>
                ))}
              </tr>
              <tr className="border-b border-border bg-muted/40">
                <td className="px-5 py-3.5 font-bold text-foreground">
                  이용금액
                  <span className="block text-xs font-normal text-muted-foreground">(VAT 별도)</span>
                </td>
                {KAKAO_TABLE.total.map((t, i) => (
                  <td key={i} className="text-center px-3 py-3.5 font-semibold text-primary">{t}</td>
                ))}
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-foreground">포인트차감</td>
                <td colSpan={5} className="text-center px-3 py-3.5 text-foreground">
                  알림톡 건당 <span className="font-bold text-primary">1포인트</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Kakao Info */}
      <div className="rounded-2xl border border-border bg-muted/30 p-6 lg:p-8">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <h3 className="text-lg font-black text-foreground tracking-tight">
            알림톡 이용 안내
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          카카오톡 비즈니스 채널 가입 후 프로필 등록, 템플릿 관리를 진행해야 합니다.
          알림톡은 승인된 템플릿 문구만 전송할 수 있으며, 개인별 발송은 지원되지 않습니다.
          템플릿 승인 및 관리에 대한 자세한 내용은 담당자에게 문의해주세요.
        </p>
      </div>
    </div>
  );
}
