import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, MonitorSmartphone, BookOpen, Phone, ChevronRight, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const servicePaths = ["/lms", "/hosting", "/maintenance", "/chatbot", "/app", "/drm", "/channel", "/pg", "/content"];

const serviceBlobColors: Record<string, string> = {
  "/lms": "hsl(250, 55%, 52%)",
  "/hosting": "hsl(250, 55%, 52%)",
  "/maintenance": "hsl(250, 55%, 52%)",
  "/chatbot": "hsl(192, 50%, 42%)",
  "/app": "hsl(192, 50%, 42%)",
  "/drm": "hsl(235, 45%, 48%)",
  "/channel": "hsl(192, 50%, 42%)",
  "/pg": "hsl(235, 45%, 48%)",
  "/content": "hsl(235, 45%, 48%)",
};

function FooterServiceLink({ to, label, isActive }: { to: string; label: string; isActive: boolean }) {
  return (
    <Link
      to={to}
      className={`text-sm font-normal inline-block px-3 py-1 rounded-lg transition-colors duration-200 ${
        isActive ? "text-foreground font-medium underline underline-offset-4 decoration-2" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : i18n.language?.startsWith("ja") ? "ja" : "ko";
  const location = useLocation();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const serviceLabels = t("header.services", { returnObjects: true }) as string[];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 max-w-5xl pt-16 pb-[4.4rem]">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_auto] gap-12">
          <div className="flex flex-col gap-8">
            <span className="text-foreground" style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 700, fontSize: "1.625rem", fontStyle: "italic", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {t("header.logo")}
            </span>

            <div className="flex flex-col gap-6">
              {/* Company */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-normal tracking-[0.15em] uppercase text-foreground/40" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.company")}</p>
                <p className="text-[14px] leading-[1.7] font-normal text-foreground/70" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.address")}</p>
                <p className="text-[14px] font-normal text-foreground/70" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.privacy")}</p>
                <button
                  onClick={() => setPrivacyOpen(true)}
                  className="self-start inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/5 transition-colors"
                >
                  <ShieldCheck className="w-3 h-3" />
                  {t("footer.privacyPolicy")}
                </button>
              </div>

              {/* Time */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-normal tracking-[0.15em] uppercase text-foreground/40" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.time")}</p>
                <p className="text-[14px] font-normal text-foreground/70" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.hours")}</p>
                <p className="text-[14px] font-normal text-foreground/70" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.days")}</p>
              </div>

              {/* Customer Center */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-normal tracking-[0.15em] uppercase text-foreground/40" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.customerCenter")}</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="tel:02-336-4338"
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/5 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    {t("footer.newPhone")}
                  </a>
                  <a
                    href="tel:02-540-4337"
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/5 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    {t("footer.maintenancePhone")}
                  </a>
                </div>
              </div>

            </div>
          </div>
          <div>
            <p className="text-xs font-normal tracking-widest uppercase mb-5 text-foreground" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>Services</p>
            <ul className="flex flex-col gap-1.5">
              {serviceLabels.map((label, i) => {
                const isActive = location.pathname === servicePaths[i];
                return (
                  <li key={servicePaths[i]}>
                    <FooterServiceLink to={servicePaths[i]} label={label} isActive={isActive} />
                  </li>
                );
              })}
              {location.pathname !== "/blog" && (
                <li className="mt-3 pt-3 border-t border-border">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity duration-200"
                  >
                    <BookOpen className="w-4 h-4" />
                    {t("footer.lmsInsight")}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl py-3.5 flex items-center justify-start gap-3 flex-wrap">
          <a
            href="tel:02-540-4337"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Phone className="w-4 h-4" />
            {t("footer.callLabel", "대표전화 02-540-4337")}
          </a>
          <div className="relative" onMouseEnter={() => setSupportOpen(true)} onMouseLeave={() => setSupportOpen(false)}>
            <button
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap text-foreground hover:bg-muted border border-border"
            >
              {t("header.customerSupport", "고객지원")}
              <span className="text-muted-foreground">→</span>
            </button>

            {supportOpen && (
              <div className="absolute bottom-full pb-[10px] left-0 w-[340px] z-50">
              <div className="w-full bg-card rounded-2xl overflow-hidden animate-fade-in border border-border shadow-lg">
                <a
                  href="https://help.webheads.co.kr/login.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/60"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsl(221, 83%, 53%, 0.08)" }}>
                    <Mail className="w-5 h-5" style={{ color: "hsl(221, 83%, 53%)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground tracking-[-0.02em]">SMS 충전</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">문자 발송 건수 충전 및 현황 확인</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </a>
                <div className="mx-5 h-px bg-border/60" />
                <a
                  href="https://help.webheads.co.kr/kolluscrm.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/60"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsl(152, 57%, 42%, 0.08)" }}>
                    <MonitorSmartphone className="w-5 h-5" style={{ color: "hsl(152, 57%, 42%)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground tracking-[-0.02em]">원격지원 요청</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">카테노이드 원격지원으로 빠르게 해결</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl py-5 flex items-center justify-center">
          <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif", fontWeight: 400 }}>{t("footer.copyright")}</p>
        </div>
      </div>
      {/* Privacy Policy Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {lang === "en" ? "Privacy Policy" : lang === "ja" ? "個人情報保護方針" : "개인정보처리방침"}
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm leading-relaxed text-foreground/80 space-y-4" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
            {lang === "en" ? (
              <>
                <p className="font-semibold">WEBHEADS Co., Ltd. (hereinafter "the Company") has established the following privacy policy to protect users' personal information in accordance with applicable data protection laws and to handle related grievances smoothly.</p>

                <h3 className="font-bold text-foreground mt-4">1. Items and Methods of Personal Information Collection</h3>
                <p>The Company collects the following personal information for service provision.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Required:</strong> Name, company name, phone number</li>
                  <li><strong>Optional:</strong> Email, inquiry details, preferred date/time</li>
                  <li><strong>Automatically collected:</strong> IP address, browser information, access time, visited pages</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">2. Purpose of Collection and Use</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Responding to service inquiries and consultations</li>
                  <li>Processing service requests (SMS top-up, remote support, etc.)</li>
                  <li>Analyzing service usage statistics and improving quality</li>
                  <li>Providing marketing information (only with consent)</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">3. Retention and Use Period</h3>
                <p>The Company destroys personal information without delay once the purpose of collection and use has been achieved. However, information may be retained for the period required by applicable laws.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Records related to contracts or withdrawal of offers: 5 years</li>
                  <li>Records related to consumer complaints or dispute resolution: 3 years</li>
                  <li>Website visit records: 3 months</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">4. Provision of Personal Information to Third Parties</h3>
                <p>The Company does not provide personal information to third parties without the user's consent, except when required by law.</p>

                <h3 className="font-bold text-foreground mt-4">5. Destruction Procedures and Methods</h3>
                <p>Electronic files are deleted using methods that prevent recovery. Personal information printed on paper is shredded or incinerated.</p>

                <h3 className="font-bold text-foreground mt-4">6. Privacy Officer</h3>
                <ul className="list-none space-y-1">
                  <li>Officer: Kang Seong-il</li>
                  <li>Phone: 02-540-4337</li>
                  <li>Email: elise75@webheads.co.kr</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">7. Changes to the Privacy Policy</h3>
                <p>This privacy policy is effective from March 4, 2026. Any changes will be announced through the website.</p>
              </>
            ) : lang === "ja" ? (
              <>
                <p className="font-semibold">株式会社WEBHEADS（以下「当社」）は、個人情報保護法に基づき、利用者の個人情報を保護し、関連する苦情を円滑に処理するため、以下の処理方針を定めています。</p>

                <h3 className="font-bold text-foreground mt-4">1. 個人情報の収集項目および収集方法</h3>
                <p>当社はサービス提供のために以下の個人情報を収集します。</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>必須項目：</strong>氏名、会社名、連絡先（電話番号）</li>
                  <li><strong>任意項目：</strong>メールアドレス、お問い合わせ内容、ご希望日時</li>
                  <li><strong>自動収集項目：</strong>接続IP、ブラウザ情報、接続時間、訪問ページ</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">2. 個人情報の収集および利用目的</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>サービスに関するお問い合わせ・ご相談への対応</li>
                  <li>サービスリクエスト（SMS充電、リモートサポート等）の処理</li>
                  <li>サービス利用統計の分析および品質改善</li>
                  <li>マーケティング情報の提供（同意された場合のみ）</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">3. 個人情報の保有および利用期間</h3>
                <p>当社は個人情報の収集および利用目的が達成された後、当該情報を遅滞なく破棄します。ただし、関連法令により保存が必要な場合は該当期間中保管します。</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>契約または申込撤回等に関する記録：5年</li>
                  <li>消費者の苦情または紛争処理に関する記録：3年</li>
                  <li>ウェブサイト訪問記録：3ヶ月</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">4. 個人情報の第三者提供</h3>
                <p>当社は利用者の同意なく個人情報を第三者に提供しません。ただし、法令による要請がある場合は例外とします。</p>

                <h3 className="font-bold text-foreground mt-4">5. 個人情報の破棄手続きおよび方法</h3>
                <p>電子ファイル形式の情報は復元不可能な方法で削除し、紙に印刷された個人情報はシュレッダーで裁断または焼却します。</p>

                <h3 className="font-bold text-foreground mt-4">6. 個人情報保護責任者</h3>
                <ul className="list-none space-y-1">
                  <li>責任者：姜成一（カン・ソンイル）</li>
                  <li>電話番号：02-540-4337</li>
                  <li>メール：elise75@webheads.co.kr</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">7. 個人情報処理方針の変更</h3>
                <p>この個人情報保護方針は2026年3月4日から適用されます。変更がある場合はウェブサイトを通じてお知らせします。</p>
              </>
            ) : (
              <>
                <p className="font-semibold">주식회사 웹헤즈(이하 "회사")는 개인정보 보호법에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.</p>

                <h3 className="font-bold text-foreground mt-4">1. 개인정보의 수집 항목 및 수집 방법</h3>
                <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>필수 항목:</strong> 이름, 회사명, 연락처(전화번호)</li>
                  <li><strong>선택 항목:</strong> 이메일, 문의 내용, 희망 일시</li>
                  <li><strong>자동 수집 항목:</strong> 접속 IP, 브라우저 정보, 접속 시간, 방문 페이지</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">2. 개인정보의 수집 및 이용 목적</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>서비스 문의 및 상담 응대</li>
                  <li>서비스 요청(SMS 충전, 원격지원 등) 처리</li>
                  <li>서비스 이용 통계 분석 및 품질 개선</li>
                  <li>마케팅 정보 제공(동의한 경우에 한함)</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">3. 개인정보의 보유 및 이용 기간</h3>
                <p>회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                  <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                  <li>웹사이트 방문 기록: 3개월</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">4. 개인정보의 제3자 제공</h3>
                <p>회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 의한 요청이 있는 경우에는 예외로 합니다.</p>

                <h3 className="font-bold text-foreground mt-4">5. 개인정보의 파기 절차 및 방법</h3>
                <p>전자적 파일 형태의 정보는 복구할 수 없는 방법으로 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각합니다.</p>

                <h3 className="font-bold text-foreground mt-4">6. 개인정보 보호 책임자</h3>
                <ul className="list-none space-y-1">
                  <li>책임자: 강성일</li>
                  <li>연락처: 02-540-4337</li>
                  <li>이메일: elise75@webheads.co.kr</li>
                </ul>

                <h3 className="font-bold text-foreground mt-4">7. 개인정보 처리방침의 변경</h3>
                <p>이 개인정보처리방침은 2026년 3월 4일부터 적용됩니다. 변경 사항이 있을 경우 웹사이트를 통해 공지합니다.</p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
