const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE = 'https://service.webheads.co.kr';

interface PageData {
  title: string;
  desc: string;
  h1: string;
  body: string;
}

const pages: Record<string, PageData> = {
  '/': {
    title: '웹헤즈 - 이러닝 솔루션 · LMS 구축 · 학습관리시스템 전문 기업',
    desc: '16년 경력, 400개 기관 도입. LMS 구축·클라우드 LMS·AI 기반 학습관리시스템·이러닝 호스팅·앱 개발까지 원스톱으로 제공하는 B2B 이러닝 전문기업.',
    h1: '웹헤즈 — 이러닝 솔루션 · LMS 구축 전문 기업',
    body: `<p>웹헤즈는 2010년 설립된 이러닝 전문 기업으로, LMS 구축·클라우드 LMS·AI 챗봇·DRM·호스팅·앱 개발·콘텐츠 제작까지 원스톱 서비스를 제공합니다. 400개 이상의 기업·기관이 웹헤즈 솔루션을 도입했습니다.</p>
      <h2>주요 서비스</h2>
      <ul>
        <li><a href="/lms">LMS 구축 · 학습관리시스템</a> — 클라우드 SaaS / 구축형 / 하이브리드</li>
        <li><a href="/hosting">이러닝 호스팅</a> — AWS 기반 99.9% SLA</li>
        <li><a href="/chatbot">AI 챗봇</a> — GPT-4o 기반 LMS 연동</li>
        <li><a href="/app">앱 개발</a> — iOS/Android 이러닝 전용 앱</li>
        <li><a href="/drm">DRM 솔루션</a> — Widevine/FairPlay 멀티 DRM</li>
        <li><a href="/content">콘텐츠 개발</a> — 이러닝 콘텐츠 기획·제작</li>
        <li><a href="/maintenance">유지보수</a> — 24/7 이러닝 플랫폼 유지보수</li>
        <li><a href="/pg">PG 결제</a> — 이러닝 전용 결제 연동</li>
        <li><a href="/channel">채널톡 연동</a> — 실시간 고객 소통</li>
        <li><a href="/sms-kakao">SMS/카카오 알림</a> — 학습 알림 자동화</li>
      </ul>
      <h2>요금 안내</h2>
      <p><a href="/pricing">요금제 보기</a> — LMS 월 30만원~, 구축형 별도 문의</p>
      <h2>블로그 · 가이드</h2>
      <p><a href="/blog">블로그</a> | <a href="/guides">가이드</a> | <a href="/cost-simulator">비용 시뮬레이터</a></p>`,
  },
  '/lms': {
    title: 'LMS 구축 · 학습관리시스템 | 웹헤즈',
    desc: '클라우드 LMS, SaaS LMS, 맞춤형 LMS 구축 전문. 400+ 기관 도입, 16년 노하우의 학습관리시스템.',
    h1: 'LMS 구축 · 학습관리시스템 전문',
    body: `<p>웹헤즈는 클라우드 SaaS LMS, 구축형 LMS, 하이브리드 LMS 등 기업·기관의 니즈에 맞는 최적의 학습관리시스템을 제공합니다.</p>
      <h2>LMS 유형</h2>
      <ul>
        <li><strong>클라우드 SaaS LMS</strong> — 즉시 도입, 월 30만원~, 서버 관리 불필요</li>
        <li><strong>구축형 LMS</strong> — 100% 맞춤 개발, 자체 서버 운영</li>
        <li><strong>하이브리드 LMS</strong> — SaaS 기반 + 커스텀 기능 추가</li>
      </ul>
      <h2>핵심 기능</h2>
      <ul>
        <li>수강신청·결제·학습진도 관리</li>
        <li>AI 기반 학습 분석 · 챗봇 튜터</li>
        <li>Widevine/FairPlay DRM 콘텐츠 보호</li>
        <li>실시간 화상강의(Zoom/MS Teams 연동)</li>
        <li>SCORM/xAPI 표준 지원</li>
      </ul>
      <p><a href="/pricing">요금제 보기</a> | <a href="/cost-simulator">비용 시뮬레이터</a> | <a href="/">홈으로</a></p>`,
  },
  '/hosting': {
    title: '이러닝 호스팅 | 웹헤즈',
    desc: 'AWS 기반 99.9% SLA 이러닝 전용 호스팅. 글로벌 CDN, 자동 스케일링, 24/7 모니터링.',
    h1: '이러닝 호스팅 · CDN',
    body: `<p>AWS 기반 이러닝 전용 호스팅으로 99.9% SLA를 보장합니다. 글로벌 CDN, 오토스케일링, DDoS 방어, 24/7 모니터링을 제공합니다.</p>
      <h2>호스팅 특징</h2>
      <ul>
        <li>AWS 리전 기반 고가용성 인프라</li>
        <li>글로벌 CDN으로 빠른 콘텐츠 전송</li>
        <li>자동 스케일링 — 동시접속 급증 대응</li>
        <li>SSL/TLS 무료 인증서 포함</li>
        <li>일일 자동 백업 · 재해 복구</li>
      </ul>
      <p><a href="/pricing">요금제 보기</a> | <a href="/lms">LMS 구축</a> | <a href="/">홈으로</a></p>`,
  },
  '/chatbot': {
    title: 'AI 챗봇 | 웹헤즈',
    desc: 'GPT-4o 기반 LMS 연동 AI 챗봇. 학습 상담, FAQ 자동 응답, 다국어 지원.',
    h1: 'AI 챗봇 · LMS 연동',
    body: `<p>GPT-4o 기반 AI 챗봇으로 LMS와 완벽하게 연동됩니다. 학습 상담, FAQ 자동 응답, 다국어(한·영·일) 지원.</p>
      <h2>챗봇 기능</h2>
      <ul>
        <li>GPT-4o 기반 자연어 처리</li>
        <li>LMS 학습 데이터 연동 상담</li>
        <li>24/7 자동 FAQ 응답</li>
        <li>한국어·영어·일본어 다국어 지원</li>
        <li>관리자 대시보드 · 대화 로그 분석</li>
      </ul>
      <p><a href="/lms">LMS 구축</a> | <a href="/pricing">요금제</a> | <a href="/">홈으로</a></p>`,
  },
  '/app': {
    title: '앱 개발 | 웹헤즈',
    desc: 'iOS/Android 이러닝 전용 앱 개발. 네이티브·하이브리드·웹앱 모두 지원.',
    h1: '이러닝 앱 개발',
    body: `<p>iOS/Android 이러닝 전용 앱을 개발합니다. 네이티브, 하이브리드, PWA 등 최적의 방식을 제안합니다.</p>
      <h2>앱 개발 서비스</h2>
      <ul>
        <li>네이티브 앱 (Swift/Kotlin)</li>
        <li>하이브리드 앱 (React Native/Flutter)</li>
        <li>PWA 웹앱</li>
        <li>오프라인 학습 · 푸시 알림</li>
        <li>앱스토어/구글플레이 등록 대행</li>
      </ul>
      <p><a href="/lms">LMS 구축</a> | <a href="/pricing">요금제</a> | <a href="/">홈으로</a></p>`,
  },
  '/drm': {
    title: 'DRM 솔루션 | 웹헤즈',
    desc: 'Widevine/FairPlay 멀티 DRM. 이러닝 콘텐츠 불법 복제 방지.',
    h1: 'DRM 솔루션 · 콘텐츠 보호',
    body: `<p>Widevine, FairPlay 기반 멀티 DRM으로 이러닝 콘텐츠를 불법 복제로부터 보호합니다.</p>
      <h2>DRM 기능</h2>
      <ul>
        <li>Widevine (Chrome/Android) + FairPlay (Safari/iOS)</li>
        <li>화면 캡처·녹화 방지</li>
        <li>동시접속 제한 · 디바이스 인증</li>
        <li>워터마크 삽입</li>
      </ul>
      <p><a href="/lms">LMS 구축</a> | <a href="/hosting">호스팅</a> | <a href="/">홈으로</a></p>`,
  },
  '/content': {
    title: '콘텐츠 개발 | 웹헤즈',
    desc: '이러닝 콘텐츠 기획·제작. 영상 촬영, 인터랙티브 콘텐츠, SCORM 패키징.',
    h1: '이러닝 콘텐츠 개발',
    body: `<p>이러닝 콘텐츠 기획부터 영상 촬영, 인터랙티브 콘텐츠 제작, SCORM 패키징까지 원스톱으로 제공합니다.</p>
      <h2>콘텐츠 유형</h2>
      <ul>
        <li>강의 영상 촬영·편집</li>
        <li>인터랙티브 HTML5 콘텐츠</li>
        <li>SCORM/xAPI 패키징</li>
        <li>평가·퀴즈 콘텐츠</li>
      </ul>
      <p><a href="/lms">LMS 구축</a> | <a href="/drm">DRM</a> | <a href="/">홈으로</a></p>`,
  },
  '/maintenance': {
    title: '유지보수 | 웹헤즈',
    desc: '24/7 이러닝 플랫폼 유지보수. 서버 관리, 보안 패치, 성능 최적화.',
    h1: '이러닝 플랫폼 유지보수',
    body: `<p>24/7 이러닝 플랫폼 유지보수 서비스. 서버 관리, 보안 패치, 성능 최적화, 장애 대응을 포함합니다.</p>
      <h2>유지보수 서비스</h2>
      <ul>
        <li>24/7 서버 모니터링 · 장애 대응</li>
        <li>보안 패치 · 취약점 점검</li>
        <li>성능 최적화 · DB 튜닝</li>
        <li>기능 개선 · 업데이트</li>
      </ul>
      <p><a href="/hosting">호스팅</a> | <a href="/pricing">요금제</a> | <a href="/">홈으로</a></p>`,
  },
  '/pg': {
    title: 'PG 결제 연동 | 웹헤즈',
    desc: '이러닝 전용 PG 결제 연동. 카드·계좌이체·가상계좌 등 다양한 결제 수단.',
    h1: 'PG 결제 연동',
    body: `<p>이러닝 플랫폼에 최적화된 PG 결제 연동 서비스를 제공합니다.</p>
      <h2>결제 기능</h2>
      <ul>
        <li>신용카드·체크카드 결제</li>
        <li>실시간 계좌이체 · 가상계좌</li>
        <li>정기결제(구독) 지원</li>
        <li>부분 환불 · 쿠폰 처리</li>
      </ul>
      <p><a href="/lms">LMS 구축</a> | <a href="/pricing">요금제</a> | <a href="/">홈으로</a></p>`,
  },
  '/channel': {
    title: '채널톡 연동 | 웹헤즈',
    desc: '채널톡 기반 실시간 고객 소통. LMS와 원클릭 연동.',
    h1: '채널톡 연동',
    body: `<p>채널톡 기반 실시간 고객 소통 솔루션. LMS와 원클릭으로 연동됩니다.</p>
      <p><a href="/lms">LMS 구축</a> | <a href="/chatbot">AI 챗봇</a> | <a href="/">홈으로</a></p>`,
  },
  '/sms-kakao': {
    title: 'SMS/카카오 알림 | 웹헤즈',
    desc: 'SMS·카카오 알림톡 자동 발송. 학습 알림, 출석 체크, 수료증 발급 알림.',
    h1: 'SMS · 카카오 알림',
    body: `<p>SMS와 카카오 알림톡으로 학습 알림, 출석 체크, 수료증 발급 등을 자동 발송합니다.</p>
      <p><a href="/lms">LMS 구축</a> | <a href="/pricing">요금제</a> | <a href="/">홈으로</a></p>`,
  },
  '/pricing': {
    title: '요금제 | 웹헤즈',
    desc: 'LMS 월 30만원~, 구축형 별도 문의. 호스팅·DRM·챗봇 등 서비스별 요금 안내.',
    h1: '요금제 안내',
    body: `<p>웹헤즈 서비스별 요금 안내. LMS 클라우드 월 30만원부터, 구축형은 별도 문의.</p>
      <h2>서비스별 요금</h2>
      <ul>
        <li><strong>클라우드 LMS</strong> — 월 30만원~</li>
        <li><strong>구축형 LMS</strong> — 별도 문의</li>
        <li><strong>호스팅</strong> — 월 15만원~</li>
        <li><strong>AI 챗봇</strong> — 월 10만원~</li>
        <li><strong>DRM</strong> — 월 20만원~</li>
      </ul>
      <p><a href="/cost-simulator">비용 시뮬레이터</a> | <a href="/service-request">서비스 신청</a> | <a href="/">홈으로</a></p>`,
  },
  '/cost-simulator': {
    title: 'LMS 비용 시뮬레이터 | 웹헤즈',
    desc: 'LMS 도입 비용을 간편하게 계산해 보세요. 사용자 수·기능별 맞춤 견적.',
    h1: 'LMS 비용 시뮬레이터',
    body: `<p>사용자 수, 필요 기능에 따라 LMS 도입 비용을 간편하게 시뮬레이션해 보세요.</p>
      <p><a href="/pricing">요금제</a> | <a href="/lms">LMS 구축</a> | <a href="/">홈으로</a></p>`,
  },
  '/blog': {
    title: '블로그 | 웹헤즈',
    desc: '이러닝·LMS 최신 트렌드, 도입 사례, 기술 인사이트를 공유합니다.',
    h1: '웹헤즈 블로그',
    body: `<p>이러닝·LMS 최신 트렌드, 도입 사례, 기술 인사이트를 공유합니다.</p>
      <p><a href="/guides">가이드</a> | <a href="/">홈으로</a></p>`,
  },
  '/guides': {
    title: '가이드 | 웹헤즈',
    desc: 'LMS 도입 가이드, 이러닝 전략, 기술 비교 자료를 제공합니다.',
    h1: '이러닝 가이드',
    body: `<p>LMS 도입 가이드, 이러닝 전략, 기술 비교 자료를 제공합니다.</p>
      <p><a href="/blog">블로그</a> | <a href="/">홈으로</a></p>`,
  },
  '/service-request': {
    title: '서비스 신청 | 웹헤즈',
    desc: '웹헤즈 서비스 도입 상담 및 견적 신청.',
    h1: '서비스 신청',
    body: `<p>이러닝 솔루션 도입 상담 및 견적을 신청하세요. 전문 컨설턴트가 맞춤 제안을 드립니다.</p>
      <p>전화: 02-540-4337 | 이메일: contact@webheads.co.kr</p>
      <p><a href="/pricing">요금제</a> | <a href="/">홈으로</a></p>`,
  },
  '/lms-development': {
    title: 'LMS 개발 · 맞춤형 학습관리시스템 | 웹헤즈',
    desc: '맞춤형 LMS 개발 전문. 기업·기관 니즈에 최적화된 학습관리시스템 구축.',
    h1: 'LMS 개발 · 맞춤형 학습관리시스템',
    body: `<p>기업·기관의 니즈에 맞춘 맞춤형 LMS를 개발합니다. 16년 경력의 전문 팀이 설계부터 운영까지 지원합니다.</p>
      <p><a href="/lms">LMS 구축</a> | <a href="/pricing">요금제</a> | <a href="/">홈으로</a></p>`,
  },
  '/corporate-lms': {
    title: '기업교육 LMS | 웹헤즈',
    desc: '기업 사내교육을 위한 LMS 솔루션. 직무교육·법정의무교육·온보딩 자동화.',
    h1: '기업교육 LMS',
    body: `<p>기업 사내교육에 최적화된 LMS. 직무교육, 법정의무교육, 온보딩 교육을 자동화합니다.</p>
      <p><a href="/lms">LMS 구축</a> | <a href="/employee-training-system">사내교육 시스템</a> | <a href="/">홈으로</a></p>`,
  },
  '/elearning-platform-development': {
    title: '이러닝 플랫폼 개발 | 웹헤즈',
    desc: '이러닝 플랫폼 기획·설계·개발. 온라인 교육 사업을 위한 맞춤형 플랫폼.',
    h1: '이러닝 플랫폼 개발',
    body: `<p>온라인 교육 사업을 위한 맞춤형 이러닝 플랫폼을 기획·설계·개발합니다.</p>
      <p><a href="/lms">LMS 구축</a> | <a href="/pricing">요금제</a> | <a href="/">홈으로</a></p>`,
  },
  '/employee-training-system': {
    title: '사내교육 시스템 구축 | 웹헤즈',
    desc: '사내교육 시스템 구축 전문. HRD 연동, 직무교육, 법정의무교육 관리.',
    h1: '사내교육 시스템 구축',
    body: `<p>사내교육 시스템을 구축합니다. HRD 연동, 직무교육 관리, 법정의무교육 이수 추적을 지원합니다.</p>
      <p><a href="/lms">LMS 구축</a> | <a href="/corporate-lms">기업교육 LMS</a> | <a href="/">홈으로</a></p>`,
  },
  '/online-education-site': {
    title: '온라인 교육 사이트 제작 | 웹헤즈',
    desc: '온라인 교육 사이트 제작. 수강신청·결제·학습관리 통합 플랫폼.',
    h1: '온라인 교육 사이트 제작',
    body: `<p>수강신청, 결제, 학습관리가 통합된 온라인 교육 사이트를 제작합니다.</p>
      <p><a href="/lms">LMS 구축</a> | <a href="/pricing">요금제</a> | <a href="/">홈으로</a></p>`,
  },
  '/live-class-solution': {
    title: '화상강의 솔루션 | 웹헤즈',
    desc: '실시간 화상강의 솔루션. Zoom·MS Teams 연동, LMS 통합 관리.',
    h1: '화상강의 솔루션',
    body: `<p>Zoom, MS Teams와 연동되는 실시간 화상강의 솔루션. LMS에서 통합 관리됩니다.</p>
      <p><a href="/lms">LMS 구축</a> | <a href="/pricing">요금제</a> | <a href="/">홈으로</a></p>`,
  },
};

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '웹헤즈',
  url: SITE,
  logo: `${SITE}/images/webheads-logo.png`,
  foundingDate: '2010',
  description: '이러닝 솔루션 · LMS 구축 전문 기업',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '월드컵로114, 3층',
    addressLocality: '마포구',
    addressRegion: '서울특별시',
    postalCode: '03950',
    addressCountry: 'KR',
  },
  telephone: '+82-2-540-4337',
  sameAs: [],
});

function buildHtml(page: PageData, path: string): string {
  const canonical = path === '/' ? SITE + '/' : SITE + path;
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${page.title}</title>
<meta name="description" content="${page.desc}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.desc}">
<meta property="og:image" content="${SITE}/og-image.png">
<script type="application/ld+json">${jsonLd}</script>
</head>
<body>
<header><a href="/">웹헤즈</a> | <a href="/lms">LMS</a> | <a href="/hosting">호스팅</a> | <a href="/chatbot">AI 챗봇</a> | <a href="/app">앱 개발</a> | <a href="/drm">DRM</a> | <a href="/pricing">요금제</a></header>
<main>
<h1>${page.h1}</h1>
${page.body}
</main>
<footer><p>© 2010-2026 주식회사 웹헤즈. 서울 마포구 월드컵로114, 3층 | 02-540-4337 | contact@webheads.co.kr</p>
<nav><a href="/">홈</a> | <a href="/lms">LMS</a> | <a href="/hosting">호스팅</a> | <a href="/chatbot">챗봇</a> | <a href="/pricing">요금제</a> | <a href="/blog">블로그</a> | <a href="/guides">가이드</a></nav>
</footer>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get('path') || '/';
  const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;

  const page = pages[normalizedPath];
  if (!page) {
    // Fallback to homepage for unknown paths
    const fallback = pages['/'];
    return new Response(buildHtml(fallback, '/'), {
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new Response(buildHtml(page, normalizedPath), {
    headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
  });
});
