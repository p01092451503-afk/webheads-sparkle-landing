import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MonitorSmartphone, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const servicePaths = ["/lms", "/hosting", "/maintenance", "/chatbot", "/app-dev", "/drm", "/channel", "/pg", "/content"];

const serviceBlobColors: Record<string, string> = {
  "/lms": "hsl(250, 55%, 52%)",
  "/hosting": "hsl(250, 55%, 52%)",
  "/maintenance": "hsl(250, 55%, 52%)",
  "/chatbot": "hsl(192, 50%, 42%)",
  "/app-dev": "hsl(192, 50%, 42%)",
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
  const { t } = useTranslation();
  const location = useLocation();
  const [privacyOpen, setPrivacyOpen] = useState(false);
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
                  className="text-[13px] font-medium text-primary underline underline-offset-2 hover:opacity-80 transition-opacity text-left"
                  style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}
                >
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
                <p className="text-[14px] font-normal text-primary" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.newPhone")}</p>
                <p className="text-[14px] font-normal text-primary" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>{t("footer.maintenancePhone")}</p>
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
              <li className="mt-3 pt-3 border-t border-border">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity duration-200"
                >
                  <BookOpen className="w-4 h-4" />
                  {t("footer.lmsInsight")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Service Request Banner — hide on /service-request */}
      {location.pathname !== "/service-request" && (
        <div className="border-t border-border">
          <div className="container mx-auto px-6 max-w-5xl py-3.5 flex items-center justify-start gap-3 flex-wrap">
            <a
              href="https://help.webheads.co.kr/login.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              SMS 충전
              <span className="text-primary-foreground/70">→</span>
            </a>
            <a
              href="https://help.webheads.co.kr/kolluscrm.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity text-white"
              style={{ backgroundColor: "hsl(192, 70%, 50%)" }}
            >
              <MonitorSmartphone className="w-4 h-4" />
              원격지원 요청
              <span className="text-white/70">→</span>
            </a>
          </div>
        </div>
      )}

      <div className="border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl py-5 flex items-center justify-center">
          <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif", fontWeight: 400 }}>{t("footer.copyright")}</p>
        </div>
      </div>
      {/* Privacy Policy Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">개인정보처리방침</DialogTitle>
          </DialogHeader>
          <div className="text-sm leading-relaxed text-foreground/80 space-y-4" style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}>
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
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
