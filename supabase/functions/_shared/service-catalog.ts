/**
 * Webheads 서비스별 핵심 정보 카탈로그
 * AI 분석 프롬프트에 문의의 service 필드 기반으로 동적 주입
 */

export const SERVICE_CATALOG: Record<string, string> = {
  LMS: `## LMS (이러닝 플랫폼) 서비스 정보
- 플랜: Starter(월30만원, CDN미사용/YouTube연동), Basic(월50만원, CDN 500GB, 저장100GB), Plus(월70만원, CDN 1,500GB, 저장200GB, 가장 인기), Premium(월100만원, CDN 2,000GB, 저장250GB)
- 공통 기능: 회원수 무제한, 관리자 무제한, 전담 담당자, 순차학습, 객관식 Quiz, 수료증 발급, 관리자 대시보드, 모바일 반응형, 한/영 다국어, 소셜 로그인(구글/카카오/네이버), Zoom 연동, SMS/카카오 알림톡 연동, AI 학습 독려, 검색엔진 최적화, 디자인 템플릿
- 초과 사용 요금: 전송량(Basic 500원/GB, Plus 400원/GB, Premium 300원/GB), 저장공간(Basic 1,000원/GB, Plus 800원/GB, Premium 500원/GB), 트랜스코딩(Basic 2,200원/GB, Plus/Premium 2,000원/GB)
- 보안 플레이어(DRM): 월 300,000원 추가
- 솔루션 유형: Light(임대형), PRO(구축형/On-premise)
- 커스터마이징: STEP 잠금/해제 로직(500~800만원), 시나리오 Quiz(500~1,000만원), 대리점별 권한 세분화(300~600만원), 대리점 그룹 리포트(400~700만원), 추가 언어 지원(별도 견적), 외부 시스템 연동 ERP/CRM(별도 견적)
- 불가/제한: Native 앱 개발 불가(웹뷰 앱 가능), 복잡한 상호작용형 Quiz 직접 지원 불가`,

  호스팅: `## 호스팅 서비스 정보
- 플랜: Starter(월30만원, CDN 미사용), Basic(월50만원, CDN 500GB, 100GB 저장), Plus(월70만원, CDN 1,500GB, 200GB 저장, 가장 인기), Premium(월100만원, CDN 2,000GB, 250GB 저장)
- 핵심 기능: 글로벌 CDN 가속(50+ 엣지 노드), AWS 클라우드(Multi-AZ), IDC Tier-3 전용 서버, 24/7 NOC 모니터링(10분 초동대응), Auto Scaling, DDoS 방어/WAF, 일일 자동 백업(30일 스냅샷), 전담 엔지니어
- SLA: 99.9% 가동률 보장
- 부가 서비스: DB 이중화, 대용량 스토리지 확장, VPN/전용 네트워크, 무중단 마이그레이션, 인프라 컨설팅, 실시간 성능 대시보드
- 도입 기간: 요구분석(1~2일) → 서버 구성(3~5일) → 테스트(2~3일) → 오픈`,

  유지보수: `## 유지보수 서비스 정보
- 플랜: Basic(월30만원, 월2회 점검, 영업시간 장애대응), Standard(월60만원, 월4회 점검, 24/7 대응, 월6건 기능개선, 가장 인기), Premium(월120만원, 월8회 점검, SLA 99.9%, 기능개선 무제한, 연간 보안감사 1회)
- 핵심 기능: 정기 서버·DB·보안 점검, 장애 대응(10분 초동대응), 보안 패치(긴급 24시간 내), 기능 개선·커스터마이징, RCA(근본원인분석) 보고서, 월간 성능·보안 리포트
- 추가 개발: 신규 기능 개발, UI/UX 리뉴얼, 관리자 화면 고도화, 모바일 최적화, 외부 서비스 연동(카카오 알림톡/PG/SSO), 콘텐츠 마이그레이션
- 최소 계약 기간: 3개월, 이후 월 단위 자동 연장`,

  AI챗봇: `## AI 챗봇 서비스 정보
- 플랜: Starter(초기 50만원, FAQ 100건, 웹 1채널, GPT-4o, 월 1,000건 대화), Standard(초기 150만원, FAQ 500건, 웹+카카오 2채널, GPT-4o+RAG, 월 5,000건, LMS 연동, 가장 인기), Enterprise(맞춤 견적, 무제한, 멀티채널, GPT-4o+Claude+커스텀, LMS 풀연동+SSO)
- 월 운영비: 10~50만원(서버·API·유지보수)
- 핵심 기술: GPT-4o, Claude 3.5 Sonnet, RAG(검색증강생성), LangChain, Vector DB(Pinecone), 500ms 미만 응답속도
- 주요 기능: FAQ 자동 학습, LMS 데이터 실시간 연동, 멀티채널 동시 배포(웹/카카오/앱), 상담원 에스컬레이션, 월별 파인튜닝, 운영 대시보드
- 도입 기간: 분석(1~2주) → 데이터 학습(1주) → 개발·테스트(1~2주) → 배포(상시)`,

  APP: `## 앱 개발 서비스 정보
- 플랜: MVP(150만원~, 단일 플랫폼, 핵심 기능 3~5개, 1개월 버그 수정), Standard(250만원~, iOS+Android 동시, LMS 연동, Push 알림, 3개월 유지보수, 가장 인기), Enterprise(맞춤 견적, LMS 풀연동+SSO+DRM, 네이티브 모듈, 연간 유지보수)
- 기술 스택: React Native, Flutter, Swift(iOS), Kotlin(Android)
- 핵심 기능: LMS 완벽 연동(REST API/WebSocket), Push 알림(FCM/APNs), 오프라인 학습(DRM 암호화 저장), 앱스토어 등록·심사 대행
- 평균 개발 기간: MVP 4주~
- 스토어 심사 대행: Apple App Store(평균 24~48시간), Google Play(최대 7일)`,

  DRM: `## DRM(콘텐츠 보안) 서비스 정보
- 솔루션: 카테노이드(Kollus) DRM, 존플레이어(ZONE) DRM
- DRM 표준: Widevine(Google), FairPlay(Apple), PlayReady(Microsoft)
- 핵심 기능: AES-128 암호화, 화면 캡처·녹화 방지(OBS/Bandicam 차단), 개인 식별 워터마크(비가시/가시), EME 웹 표준(플러그인 불필요), 기기 등록·동시접속 제한, 오프라인 재생 보호, 보안 위협 실시간 모니터링
- LMS 연동: REST API 기반, 웹헤즈 LMS + 타사 LMS 모두 지원
- 비용: 콘텐츠 수량·트래픽·동시접속에 따라 맞춤 견적. LMS 플랜에 추가 시 월 30만원~
- 도입 기간: 환경분석(1~2일) → 계약(1~3일) → 연동·테스트(1~2주) → 운영(상시)`,

  "채널톡/SMS": `## 채널톡/SMS 서비스 정보
- 채널: 채널톡(Channel.io), SMS/LMS/MMS, 카카오 알림톡/친구톡, Push 알림, 이메일
- SMS 비용: 단문 SMS 건당 ~15원, 장문 LMS 건당 ~40원, 카카오 알림톡 건당 ~8원
- 핵심 기능: 채널톡 LMS 연동(수강현황·진도율 실시간 표시), SMS/LMS 대량 발송, 학습 독려 자동화(진도율 미달/미접속/수료 마감), CRM 세그먼트 연동, 발송 통계·ROI 분석, 이벤트 기반 자동화 시나리오(노코드), 알림톡 우선 → SMS Fallback
- 수신거부: 080 무료수신거부 기본 제공, 개인정보보호법 준수
- 비용: 초기 연동비(기관 규모에 따라 상이) + 월 종량제(채널톡 좌석수 + 발송 건수)`,

  PG: `## PG 결제 연동 서비스 정보
- 연동 PG사: 토스페이먼츠(가장 빠른 연동, REST API v2), KG이니시스(국내 점유율 1위), 모빌리언스(휴대폰 결제 전문), 결제선생(교육기관 특화, 분납·HRD-Net 환급), 해외 PG(Stripe/PayPal/Adyen)
- 지원 결제 수단: 신용/체크카드, 계좌이체, 가상계좌, 휴대폰 소액결제, 카카오페이, 네이버페이, 토스페이, 해외 Visa/Mastercard/Amex/JCB, WeChat/Alipay/PayPal, 에스크로
- 핵심 기능: 정기결제(구독) 자동화, 분납 결제, 결제 통계·정산 리포트, 보안(PCI-DSS, 토큰화, TLS 1.3), FDS 이상거래 탐지, 결제 오류 모니터링
- 지원 통화: 140+ 국가
- 비용: 맞춤 견적(월 거래 규모·PG사·결제 수단에 따라 수수료율 상이)
- 가맹점 필요 서류: 사업자등록증, 통신판매업 신고증, 대표자 신분증, 정산 계좌 통장, 서비스 URL·이용약관`,

  콘텐츠: `## 콘텐츠 제작 서비스 정보
- 콘텐츠 유형: 동영상 강의(4K 멀티캠), 인터랙티브(H5P/Storyline/Captivate), 2D/3D 애니메이션, 게이미피케이션, 법정 의무교육(5대), AI TTS/전문 성우 내레이션
- 비용: 촬영 편집형(차시당 50~80만원), PPT 변환형(30~50만원), 인터랙티브/애니메이션(100~200만원)
- 제작 기간: 단순 편집 2~3주, 인터랙티브/애니메이션 4~6주
- 품질 관리: 3단계 검수(교수설계·미디어·기술), WCAG 2.1 AA 접근성 준수, xAPI 패키징
- 제작 레퍼런스: 500+ 강좌, 기업 직무교육, 의료·금융·대학, 법정교육
- 납품 후 무상 수정: 2회 포함`,
};

/** inquiry.service 필드값을 카탈로그 키로 매핑 */
export function getServiceContext(serviceField: string | null | undefined): string {
  if (!serviceField) return SERVICE_CATALOG["LMS"]; // 기본값: LMS

  // 정확히 매칭
  if (SERVICE_CATALOG[serviceField]) return SERVICE_CATALOG[serviceField];

  // 부분 매칭 (대소문자 무시)
  const lower = serviceField.toLowerCase();
  const keyMap: Record<string, string> = {
    lms: "LMS",
    hosting: "호스팅",
    maintenance: "유지보수",
    chatbot: "AI챗봇",
    app: "APP",
    drm: "DRM",
    channel: "채널톡/SMS",
    sms: "채널톡/SMS",
    kakao: "채널톡/SMS",
    pg: "PG",
    content: "콘텐츠",
  };

  for (const [keyword, key] of Object.entries(keyMap)) {
    if (lower.includes(keyword)) return SERVICE_CATALOG[key];
  }

  // 매칭 실패 시 모든 서비스 요약 제공
  return Object.values(SERVICE_CATALOG).join("\n\n");
}
