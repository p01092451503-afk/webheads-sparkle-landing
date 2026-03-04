import { useState } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { BookOpen, TrendingUp, Lightbulb, ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  category: "guide" | "trend" | "tip";
  title: string;
  summary: string;
  content: string[];
  date: string;
  readTime: string;
  keywords: string[];
}

const categoryConfig = {
  guide: { label: "인사이트", icon: BookOpen, color: "hsl(250,55%,52%)" },
  trend: { label: "트렌드", icon: TrendingUp, color: "hsl(192,50%,42%)" },
  tip: { label: "실용 팁", icon: Lightbulb, color: "hsl(40,80%,50%)" },
};

const blogPosts: BlogPost[] = [
  {
    id: "lms-checklist-2026",
    category: "guide",
    title: "2026년 LMS 도입 전 반드시 확인해야 할 체크리스트 10가지",
    summary: "학습관리시스템(LMS)을 처음 도입하거나 교체를 고려하는 기업·기관 담당자를 위해, 도입 전 검토해야 할 핵심 항목을 정리했습니다. 커스터마이징 범위부터 DRM 연동, 모바일 지원, 관리자 권한 체계까지 놓치기 쉬운 포인트를 짚어드립니다.",
    content: [
      "LMS 도입은 단순한 소프트웨어 구매가 아닙니다. 조직의 교육 체계를 디지털로 전환하는 전략적 의사결정입니다. 도입 목적이 '사내교육 효율화'인지, '외부 수강생 대상 온라인 교육 플랫폼 운영'인지에 따라 필요한 기능과 아키텍처가 크게 달라집니다.",
      "첫째, 커스터마이징 범위를 확인하세요. 임대형(SaaS) LMS는 빠르게 도입할 수 있지만 UI/UX 변경이 제한적입니다. 반면 구축형 LMS는 브랜드 아이덴티티에 맞는 화이트라벨링과 기능 확장이 자유롭습니다. 웹헤즈 PRO는 구축형이면서도 SaaS 배포를 지원하여 두 가지 장점을 모두 제공합니다.",
      "둘째, RESTful API 연동 지원 여부를 점검하세요. HRD 시스템, 그룹웨어, ERP 등 기존 인프라와의 연동이 원활해야 실질적인 업무 효율 개선이 가능합니다. 서드파티 API 연동이 없는 LMS는 데이터 사일로(Data Silo)를 만들 수 있습니다.",
      "셋째, DRM(Digital Rights Management) 지원을 확인하세요. 유료 교육 콘텐츠를 운영한다면 카테노이드(Kollus), 존플레이어 등의 DRM 연동은 필수입니다. 불법 복제 방지뿐 아니라 수강 완료율 추적에도 DRM 플레이어 데이터가 활용됩니다.",
      "넷째, 모바일 반응형과 앱 지원을 살피세요. 2026년 현재 모바일 학습 비중이 전체의 60%를 넘어섰습니다. 단순 반응형 웹을 넘어 오프라인 학습, 푸시 알림 등을 지원하는 PWA 또는 네이티브 앱 연동이 있는지 확인하세요.",
      "그 외에 관리자 권한 체계(다중 관리자, 부서별 권한), 수료증 자동 발급, SCORM/xAPI 표준 지원, 실시간 화상 강의 연동, 학습 분석 대시보드, 데이터 마이그레이션 지원 등도 반드시 체크해야 합니다."
    ],
    date: "2026-03-04",
    readTime: "8분",
    keywords: ["LMS 도입", "학습관리시스템", "이러닝 솔루션", "LMS 구축", "체크리스트"],
  },
  {
    id: "ai-lms-trend-2026",
    category: "trend",
    title: "AI 기반 학습관리의 미래: 2026년 이러닝 트렌드 5가지",
    summary: "생성형 AI와 적응형 학습(Adaptive Learning)이 LMS 시장을 어떻게 변화시키고 있는지, 실제 기업교육 현장에서의 활용 사례와 함께 2026년 핵심 트렌드를 분석합니다.",
    content: [
      "2026년 이러닝 시장에서 가장 주목할 변화는 AI의 본격적인 교육 현장 통합입니다. 단순한 챗봇을 넘어, AI가 학습자의 진도·이해도·학습 패턴을 실시간 분석하여 맞춤형 학습 경로를 자동 생성하는 '적응형 학습(Adaptive Learning)'이 기업교육 LMS의 핵심 기능으로 자리잡고 있습니다.",
      "트렌드 1: AI 튜터링 — GPT 기반의 AI 튜터가 학습자의 질문에 24시간 즉시 응답하고, 오답 패턴을 분석하여 보충 콘텐츠를 자동 추천합니다. 웹헤즈 LMS는 AI 챗봇과 학습 데이터를 연동하여 개인화된 학습 가이드를 제공합니다.",
      "트렌드 2: 마이크로러닝의 고도화 — 5~10분 단위의 초단기 학습 모듈이 표준이 되면서, AI가 학습자별 최적 학습 시간대와 분량을 자동 조절합니다. 출퇴근 시간 모바일 학습에 최적화된 콘텐츠 포맷이 중요해졌습니다.",
      "트렌드 3: 학습 분석(Learning Analytics) 고도화 — 단순 수료율을 넘어, 학습 참여도·지식 보유율·업무 성과와의 상관관계를 분석하는 HRD 연계형 대시보드가 확산되고 있습니다.",
      "트렌드 4: 비대면 교육의 하이브리드화 — 실시간 화상 강의와 비동기 이러닝을 결합한 블렌디드 러닝이 표준 교육 방식으로 정착했습니다. LMS 내에서 Zoom, Teams 등 화상 도구와의 원클릭 연동이 필수 기능이 되었습니다.",
      "트렌드 5: 클라우드 네이티브 LMS — 온프레미스에서 클라우드로의 전환이 가속화되면서, AWS·GCP 기반의 오토스케일링 LMS가 대규모 동시접속 환경에서도 안정적인 서비스를 보장합니다."
    ],
    date: "2026-03-01",
    readTime: "7분",
    keywords: ["AI LMS", "AI 교육 솔루션", "이러닝 트렌드", "AI 기반 학습관리", "클라우드 LMS"],
  },
  {
    id: "lms-cost-guide",
    category: "tip",
    title: "LMS 도입 비용 가이드: 임대형 vs 구축형, 실제 얼마나 들까?",
    summary: "이러닝 플랫폼 도입을 검토할 때 가장 많이 받는 질문, '비용이 얼마나 드나요?'에 대한 현실적인 답변입니다. 임대형 SaaS와 맞춤형 구축 방식의 비용 구조를 항목별로 비교 분석합니다.",
    content: [
      "LMS 도입 비용은 '임대형(SaaS)'과 '구축형' 두 가지 모델에 따라 크게 달라집니다. 임대형은 초기 비용이 낮고 빠른 도입이 가능하지만, 장기적으로 월/연 구독료가 누적됩니다. 구축형은 초기 투자가 크지만 장기 운영 시 총소유비용(TCO)이 유리할 수 있습니다.",
      "임대형 LMS (예: WEBHEADS Light) — 월 이용료 기반으로 운영됩니다. 서버 호스팅, 보안 패치, 기본 기능 업데이트가 포함되어 IT 인력이 부족한 중소기업에 적합합니다. 일반적으로 사용자 수에 따라 과금되며, 50인 이하 소규모 조직부터 도입 가능합니다.",
      "구축형 LMS (예: WEBHEADS PRO) — 초기 개발비 + 연간 유지보수 계약으로 운영됩니다. 화이트라벨링, API 연동, 맞춤 기능 개발이 필요한 대기업·공공기관·교육전문 기업에 적합합니다. 초기 비용이 높지만, 3년 이상 운영 시 임대형 대비 비용 효율성이 높아집니다.",
      "숨겨진 비용 항목을 주의하세요: 콘텐츠 변환/제작 비용, DRM 라이선스, SMS/알림톡 발송 비용, 추가 스토리지, SSL 인증서, 도메인, 관리자 교육 비용 등이 초기 견적에 포함되지 않는 경우가 많습니다.",
      "비용 최적화 팁: ① 초기에는 핵심 기능만 도입하고 단계적으로 확장하세요. ② DRM은 콘텐츠 유형에 맞는 최소 사양으로 선택하세요. ③ SMS 대신 카카오 알림톡을 활용하면 건당 비용을 절감할 수 있습니다. ④ 웹헤즈처럼 호스팅·LMS·DRM을 원스톱으로 제공하는 업체를 선택하면 별도 연동 비용을 줄일 수 있습니다."
    ],
    date: "2026-02-25",
    readTime: "6분",
    keywords: ["LMS 도입 비용", "이러닝 플랫폼 추천", "LMS 솔루션 비교", "맞춤형 LMS 개발", "교육관리 솔루션"],
  },
  {
    id: "hrd-education-system",
    category: "guide",
    title: "HRD 교육시스템 구축 완벽 가이드: 기업 인재개발의 디지털 전환",
    summary: "HRD(인적자원개발) 부서가 사내교육 시스템을 디지털로 전환할 때 고려해야 할 전략적 요소와 기술적 요건을 상세히 안내합니다. 법정의무교육부터 직무교육까지 체계적 운영 방안을 제시합니다.",
    content: [
      "기업의 HRD 교육시스템 구축은 단순히 온라인 강의를 올리는 것이 아닙니다. 조직의 인재개발 전략과 연계된 체계적인 학습 생태계를 만드는 과정입니다. 법정의무교육(산업안전, 개인정보보호, 직장내 괴롭힘 방지 등)의 자동화부터, 직무역량 기반의 맞춤형 교육과정 설계까지 폭넓은 범위를 다룹니다.",
      "성공적인 HRD 시스템 구축을 위해서는 먼저 조직의 교육 니즈를 체계적으로 분석해야 합니다. 부서별·직급별 필수 교육과정을 매핑하고, 학습 이력 관리와 수료 현황 추적이 자동화되는 LMS 인프라가 필요합니다. 웹헤즈 LMS는 부서별 관리자 권한 분리, 교육과정 자동 배정, 수료증 자동 발급 등 HRD 전용 기능을 기본 제공합니다.",
      "특히 대기업과 공공기관에서는 기존 HR 시스템(SAP, Oracle HCM 등)과의 연동이 필수적입니다. REST API 기반의 양방향 데이터 동기화를 통해, 인사 정보 변경 시 교육과정이 자동으로 재배정되고, 교육 이수 결과가 인사 평가에 반영되는 통합 시스템을 구현할 수 있습니다.",
      "온프레미스와 클라우드 중 어떤 배포 방식을 선택할지도 중요합니다. 보안 규정이 엄격한 금융·공공 기관은 온프레미스 또는 프라이빗 클라우드를 선호하며, 빠른 확장성이 필요한 스타트업·중견기업은 퍼블릭 클라우드 기반의 SaaS형이 효율적입니다."
    ],
    date: "2026-02-20",
    readTime: "9분",
    keywords: ["HRD 교육시스템 구축", "사내교육 시스템", "기업교육 LMS", "직무교육 플랫폼", "온라인 교육 플랫폼"],
  },
  {
    id: "b2b-education-platform",
    category: "trend",
    title: "B2B 교육 플랫폼 시장 분석: 국내 LMS 솔루션 비교 2026",
    summary: "국내 이러닝 솔루션 시장에서 주요 LMS 제공업체들의 강점과 차이점을 분석합니다. 도입 규모별·산업별로 적합한 솔루션을 추천하고, 웹헤즈의 차별화 포인트를 객관적으로 제시합니다.",
    content: [
      "2026년 국내 LMS 시장은 약 8,500억 원 규모로 성장했으며, 코로나 이후 정착된 비대면 교육 수요와 AI 기술 도입이 시장 확대를 이끌고 있습니다. 글로벌 SaaS형 LMS(Moodle, Canvas, Docebo 등)와 국내 전문 솔루션이 경쟁하는 구도 속에서, 한국어 지원과 국내 규정 대응력이 핵심 차별점이 되고 있습니다.",
      "국내 LMS 선택 시 고려할 핵심 요소: ① 한국어 완벽 지원 및 한국식 교육 프로세스 반영 ② 내일배움카드, HRD-Net 등 정부 교육 플랫폼과의 연동 ③ 카카오 알림톡, 네이버 간편결제 등 국내 서비스 통합 ④ 국내 IDC 또는 클라우드(NHN, NCP 등)에서의 데이터 주권 보장.",
      "웹헤즈 LMS는 16년간 축적된 국내 교육 시장 노하우를 바탕으로, 구축형과 SaaS형을 모두 지원하는 유연한 아키텍처를 제공합니다. 특히 300개 이상의 기업·기관 도입 사례에서 검증된 안정성과, 카테노이드 DRM·PG 결제·SMS/알림톡 등 국내 필수 서비스의 원스톱 통합이 강점입니다.",
      "산업별 추천: 금융·공공 → 온프레미스 구축형(보안 규정 대응) | 제조·유통 → 클라우드 SaaS형(빠른 도입, 다지점 지원) | 교육·출판 → 수강생 관리 특화형(결제·수료·DRM 통합) | 스타트업 → 경량 SaaS형(최소 비용, 빠른 런칭)"
    ],
    date: "2026-02-15",
    readTime: "8분",
    keywords: ["국내 LMS", "한국 이러닝 솔루션", "B2B 교육 플랫폼", "LMS 솔루션 비교", "교육플랫폼 개발"],
  },
  {
    id: "ai-chatbot-education",
    category: "tip",
    title: "AI 챗봇을 LMS에 도입하는 실전 가이드",
    summary: "교육 현장에서 AI 챗봇을 어떻게 활용할 수 있는지, 실제 도입 시 주의할 점과 효과적인 운영 전략을 소개합니다. 학습자 문의 자동응대부터 AI 기반 퀴즈 생성까지 다양한 활용 시나리오를 다룹니다.",
    content: [
      "AI 챗봇은 더 이상 단순 FAQ 응답 도구가 아닙니다. LMS와 통합된 AI 챗봇은 학습자의 진도 확인, 과제 리마인더, 오답 해설, 맞춤 콘텐츠 추천까지 수행하는 '디지털 학습 비서'로 진화했습니다. 웹헤즈는 자체 AI 챗봇 솔루션을 LMS에 내장하여 별도 연동 없이 즉시 활용할 수 있습니다.",
      "도입 시 가장 중요한 것은 '목적 설정'입니다. ① 학습자 문의 자동응대(수강 방법, 일정 안내 등) ② 학습 진도 알림 및 독려 ③ AI 기반 퀴즈/평가 자동 생성 ④ 관리자 업무 자동화(수료증 발급, 통계 리포트 등) — 이 중 우선순위를 정하고 단계적으로 확장하는 것이 성공의 열쇠입니다.",
      "효과 측정 지표로는 학습자 문의 응답 시간 단축률(평균 85% 감소), 반복 문의 자동처리율(70% 이상 목표), 학습 완료율 변화, 관리자 업무시간 절감률 등을 추적하세요.",
      "주의할 점: AI 챗봇이 잘못된 정보를 제공하는 '할루시네이션' 문제를 방지하려면, 교육과정 데이터와 학사 규정을 기반으로 한 RAG(Retrieval-Augmented Generation) 아키텍처를 적용해야 합니다. 웹헤즈 AI 챗봇은 고객사의 교육 데이터만을 참조하여 답변하는 구조로, 정확도와 보안을 동시에 확보합니다."
    ],
    date: "2026-02-10",
    readTime: "6분",
    keywords: ["AI 챗봇", "AI 교육 솔루션", "AI LMS", "교육용 SaaS 솔루션", "AI 기반 학습관리"],
  },
  {
    id: "online-exam-system",
    category: "guide",
    title: "온라인 시험 시스템 구축 방법: 부정행위 방지부터 자동 채점까지",
    summary: "비대면 환경에서 신뢰할 수 있는 온라인 시험·평가 시스템을 구축하는 방법을 단계별로 안내합니다. 부정행위 감지 기술, 문항 관리, 자동 채점, 성적 분석까지 실무에 필요한 모든 요소를 다룹니다.",
    content: [
      "온라인 시험 시스템은 LMS의 핵심 모듈 중 하나입니다. 단순 퀴즈부터 공인 자격시험 수준의 고보안 평가까지, 요구 수준에 따라 아키텍처가 크게 달라집니다. 웹헤즈 LMS는 다양한 평가 시나리오에 대응할 수 있는 유연한 시험 엔진을 제공합니다.",
      "부정행위 방지(Anti-Cheating) 기술은 온라인 시험의 신뢰도를 결정합니다. 주요 기법으로는 ① 문항 랜덤 셔플(출제 순서·보기 순서 무작위화) ② 시간 제한 및 문항별 타이머 ③ 브라우저 잠금(Lock Browser) — 시험 중 다른 탭·앱 전환 차단 ④ 웹캠 기반 본인 인증 및 응시 행동 모니터링 ⑤ IP 기반 접속 제한(특정 장소에서만 응시 허용) 등이 있습니다.",
      "문항 관리 체계도 중요합니다. 대규모 문항 은행(Question Bank)을 구축하고, 난이도·유형·출제 범위별로 태깅하면 자동 출제가 가능합니다. 객관식, 주관식, OX, 서술형, 파일 업로드형 등 다양한 문항 유형을 지원해야 하며, 특히 서술형 답안에는 AI 기반 자동 채점(NLP 키워드 매칭)을 적용할 수 있습니다.",
      "성적 분석 및 리포팅도 간과해서는 안 됩니다. 문항별 정답률, 변별도, 난이도 분석 등 고전검사이론(CTT) 기반의 문항 분석을 제공하면, 다음 시험의 출제 품질을 지속적으로 개선할 수 있습니다. 웹헤즈 LMS는 시험 결과를 대시보드로 시각화하여 교육 담당자가 즉시 인사이트를 얻을 수 있도록 합니다.",
      "구축 시 체크리스트: ① 동시접속자 수용 규모(서버 부하 테스트 필수) ② 네트워크 끊김 시 자동 저장·복구 기능 ③ 장애인 접근성(스크린리더, 키보드 내비게이션) ④ 모바일 응시 지원 여부 ⑤ 수료/합격 기준 자동 연동(LMS 학습 이력에 반영)"
    ],
    date: "2026-02-05",
    readTime: "8분",
    keywords: ["온라인 시험 시스템", "온라인 학습 시스템 구축 방법", "비대면 교육 플랫폼", "LMS 구축", "e-learning system"],
  },
  {
    id: "scorm-vs-xapi",
    category: "tip",
    title: "SCORM vs xAPI 비교: 우리 조직에 맞는 이러닝 표준은?",
    summary: "이러닝 콘텐츠 표준인 SCORM과 xAPI(Tin Can)의 차이점을 상세히 비교합니다. 각 표준의 장단점, 적용 시나리오, 마이그레이션 전략까지 실무 관점에서 정리했습니다.",
    content: [
      "SCORM(Sharable Content Object Reference Model)은 2000년대 초반부터 이러닝 업계의 사실상 표준으로 자리잡은 콘텐츠 패키징·추적 규격입니다. SCORM 1.2와 SCORM 2004가 가장 널리 사용되며, 대부분의 LMS가 기본 지원합니다. 학습 시작/완료, 점수, 소요 시간 등 기본적인 학습 데이터를 추적할 수 있습니다.",
      "xAPI(Experience API, 일명 Tin Can API)는 SCORM의 한계를 극복하기 위해 ADL(Advanced Distributed Learning)이 개발한 차세대 표준입니다. '누가(Actor) 무엇을(Verb) 어디서(Object) 했다'라는 Statement 구조로 거의 모든 학습 활동을 추적할 수 있습니다. 오프라인 학습, 시뮬레이션, 현장 실습, 모바일 학습 등 웹 브라우저 밖의 활동까지 기록 가능합니다.",
      "핵심 차이점 비교: ① 추적 범위 — SCORM은 웹 브라우저 내 활동만, xAPI는 모든 환경(모바일 앱, VR, 오프라인 등) ② 데이터 저장 — SCORM은 LMS에 직접 기록, xAPI는 별도 LRS(Learning Record Store)에 저장 ③ 콘텐츠 구조 — SCORM은 엄격한 패키징(ZIP + manifest), xAPI는 자유로운 형식 ④ 복잡도 — SCORM은 구현이 간단, xAPI는 LRS 구축이 필요하여 초기 비용 높음.",
      "어떤 표준을 선택해야 할까? 기존 SCORM 콘텐츠가 대량으로 있고 기본적인 수료 추적만 필요하다면 SCORM이 현실적입니다. 반면 ① 모바일/오프라인 학습 추적이 필요하거나 ② 세밀한 학습 행동 분석(어떤 문제에서 얼마나 고민했는지 등)이 필요하거나 ③ 여러 시스템의 학습 데이터를 통합 분석하려면 xAPI가 적합합니다.",
      "마이그레이션 전략: 당장 xAPI로 전면 전환하기 어렵다면, 'SCORM + xAPI 하이브리드' 방식을 권장합니다. 기존 SCORM 콘텐츠는 그대로 운영하면서, 신규 콘텐츠와 비정형 학습 활동에만 xAPI를 적용하는 단계적 전환이 효과적입니다. 웹헤즈 LMS는 SCORM 1.2/2004와 xAPI를 모두 지원하여 점진적 마이그레이션이 가능합니다."
    ],
    date: "2026-01-28",
    readTime: "7분",
    keywords: ["이러닝 솔루션", "e-learning system", "LMS 구축", "교육관리 솔루션", "온라인 교육 플랫폼"],
  },
  {
    id: "cloud-lms-migration",
    category: "trend",
    title: "온프레미스에서 클라우드 LMS로: 성공적인 마이그레이션 전략",
    summary: "기존 온프레미스 LMS를 클라우드로 전환할 때 겪는 과제와 해결책을 실전 경험 기반으로 정리합니다. 데이터 마이그레이션, 보안 인증, 비용 최적화까지 단계별 로드맵을 제공합니다.",
    content: [
      "클라우드 LMS 전환은 단순히 서버를 옮기는 것이 아닙니다. 교육 데이터, 사용자 계정, 콘텐츠 파일, 학습 이력 등 방대한 데이터의 무결성을 보장하면서 서비스 중단 없이 이전하는 것이 핵심 과제입니다. 웹헤즈는 100개 이상의 마이그레이션 프로젝트 경험을 바탕으로 검증된 3단계 전환 프로세스를 운영합니다.",
      "1단계 — 현황 분석 및 계획(2~4주): 기존 시스템의 데이터 구조, API 연동 현황, 커스터마이징 범위를 분석합니다. 특히 SCORM 패키지, 동영상 콘텐츠(DRM 적용 여부), 수료 이력 등의 데이터 형식과 볼륨을 정확히 파악하는 것이 중요합니다. 이 단계에서 클라우드 아키텍처(AWS, NHN Cloud, NCP 등)와 예상 비용 모델을 확정합니다.",
      "2단계 — 병행 운영 및 테스트(4~8주): 클라우드 환경에 새 LMS를 구축하고 데이터를 마이그레이션한 후, 기존 시스템과 병행 운영하며 안정성을 검증합니다. 이 기간에 사용자 그룹을 나누어 단계적으로 전환(Canary Deployment)하면 리스크를 최소화할 수 있습니다.",
      "3단계 — 전면 전환 및 최적화(2~4주): DNS 전환을 통해 전면 이행하고, 이후 성능 최적화(CDN 적용, DB 쿼리 튜닝, 오토스케일링 설정)를 진행합니다. 전환 후 최소 4주간 집중 모니터링 기간을 두어 예상치 못한 이슈에 빠르게 대응합니다.",
      "보안 고려사항: 클라우드 전환 시 ISMS 인증, 개인정보보호법 준수, 데이터 주권(국내 리전 사용) 등을 반드시 확인하세요. 금융·공공 분야는 프라이빗 클라우드 또는 하이브리드 클라우드 구성이 필요할 수 있습니다. 웹헤즈는 국내 IDC 및 클라우드 환경 모두에서 호스팅을 지원합니다."
    ],
    date: "2026-01-20",
    readTime: "9분",
    keywords: ["클라우드 LMS", "온라인 학습 시스템 구축 방법", "교육플랫폼 개발", "교육관리 솔루션", "이러닝 솔루션"],
  },
  {
    id: "compliance-training-lms",
    category: "guide",
    title: "법정의무교육 자동화: LMS로 컴플라이언스 교육 효율 300% 높이기",
    summary: "산업안전, 개인정보보호, 직장내 괴롭힘 방지 등 법정의무교육을 LMS로 자동화하는 방법을 소개합니다. 교육 대상자 자동 배정부터 수료증 발급, 미이수자 알림까지 실무 운영 노하우를 공유합니다.",
    content: [
      "매년 반복되는 법정의무교육은 HR/HRD 담당자에게 큰 부담입니다. 대상자 선정, 교육 일정 공지, 출석 관리, 수료증 발급, 미이수자 독려까지 수작업으로 처리하면 수백 시간이 소요됩니다. LMS를 활용한 자동화는 이 과정을 획기적으로 줄여줍니다.",
      "자동화 가능 영역: ① 교육 대상자 자동 배정 — 입사일, 부서, 직급 기반으로 필수 교육과정을 자동 할당합니다. 신규 입사자에게는 온보딩 교육이, 관리직에게는 리더십·괴롭힘 방지 교육이 자동으로 배정됩니다. ② 수료 기한 알림 — 교육 기한 D-14, D-7, D-3, D-1에 카카오 알림톡 또는 이메일로 자동 리마인더를 발송합니다.",
      "③ 수료증 자동 생성·발급 — 교육 완료 즉시 수료번호가 부여된 PDF 수료증이 자동 생성되며, 학습 이력에 기록됩니다. ④ 미이수자 리포트 — 관리자 대시보드에서 부서별·교육과정별 미이수 현황을 실시간 확인하고, 미이수자에게 일괄 독려 메시지를 발송할 수 있습니다.",
      "법정의무교육 LMS 구축 시 주의점: ① 교육 콘텐츠의 법적 유효성을 확인하세요(고용노동부 인정 콘텐츠 여부) ② 수강 완료 조건을 명확히 설정하세요(최소 시청 시간, 퀴즈 통과 기준 등) ③ 교육 이력은 최소 3년 이상 보관해야 합니다(근로기준법 등) ④ 장애인 접근성(웹 접근성 인증)을 확보하면 공공기관 납품에 유리합니다.",
      "웹헤즈 LMS는 법정의무교육 자동화를 위한 전용 모듈을 기본 탑재하고 있으며, 고용보험 환급과정(HRD-Net) 연동도 지원합니다. 도입 후 평균적으로 교육 운영 업무 시간이 70% 이상 절감되는 것으로 나타났습니다."
    ],
    date: "2026-01-15",
    readTime: "7분",
  },
  {
    id: "global-lms-landscape-2026",
    category: "trend",
    title: "2026 글로벌 LMS 시장 지형도: Moodle, Canvas, Docebo 등 주요 플레이어 분석",
    summary: "전 세계 LMS 시장을 이끄는 주요 플랫폼의 최신 동향과 전략을 분석합니다. 오픈소스부터 엔터프라이즈 SaaS까지, 글로벌 경쟁 구도와 국내 시장에 주는 시사점을 정리했습니다.",
    content: [
      "2026년 글로벌 LMS 시장 규모는 약 280억 달러에 달하며, 연평균 19% 이상 성장하고 있습니다. 시장을 주도하는 플레이어는 크게 세 그룹으로 나뉩니다: ① 오픈소스(Moodle, Open edX) ② 대학·교육기관 중심 SaaS(Canvas by Instructure, Blackboard) ③ 기업교육 특화 SaaS(Docebo, Cornerstone, SAP Litmos).",
      "Moodle은 전 세계 3억 명 이상의 사용자를 보유한 최대 오픈소스 LMS입니다. 2026년에는 Moodle Workplace 4.5를 출시하며 기업교육 시장 공략을 강화하고 있습니다. 플러그인 생태계가 강점이지만, 커스터마이징에 개발 인력이 필요하고 UI/UX가 다소 구식이라는 평가를 받습니다.",
      "Canvas(Instructure)는 북미 대학 시장 점유율 1위를 유지하며, 2025년 AI 기반 'Canvas Copilot'을 도입해 교수자의 강의 설계와 학습자 피드백을 자동화했습니다. Docebo는 AI 기반 '스킬 매핑(Skill Mapping)' 기능으로 기업교육 시장에서 빠르게 성장 중이며, LinkedIn Learning, Salesforce 등과의 깊은 연동이 특징입니다.",
      "국내 시장에 주는 시사점: ① AI 기능이 LMS의 핵심 경쟁력이 됨 ② 단독 LMS가 아닌 'Learning Ecosystem Platform'으로 진화 ③ 모바일 퍼스트 UX가 기본 요건 ④ 데이터 기반 학습 분석(Learning Analytics)의 중요성 증가. 웹헤즈는 이러한 글로벌 트렌드를 반영하면서도 한국 시장 특수성(DRM, 알림톡, HRD-Net 연동)을 충족하는 하이브리드 전략을 취하고 있습니다."
    ],
    date: "2026-01-10",
    readTime: "8분",
    keywords: ["국내 LMS", "LMS 솔루션 비교", "e-learning system", "온라인 교육 플랫폼", "교육플랫폼 개발"],
  },
  {
    id: "microlearning-global-cases",
    category: "guide",
    title: "마이크로러닝 글로벌 성공 사례: Google, Walmart, Unilever는 어떻게 교육하나",
    summary: "5분 이내의 초단기 학습 모듈로 직원 역량을 극대화하는 마이크로러닝. 글로벌 대기업들의 실제 도입 사례와 성과 데이터를 바탕으로 효과적인 운영 전략을 소개합니다.",
    content: [
      "마이크로러닝(Microlearning)은 3~7분 분량의 핵심 집중 콘텐츠로 학습 효율을 극대화하는 방법론입니다. Ebbinghaus의 망각곡선 이론에 기반하여, 짧은 반복 학습이 장기 기억 전환에 가장 효과적이라는 연구 결과가 이를 뒷받침합니다.",
      "Google의 'Whisper Courses': 구글은 관리자 교육에 2주간 매일 이메일로 2분짜리 실천 과제를 보내는 '위스퍼 코스'를 운영합니다. 예를 들어 '오늘 1:1 미팅에서 열린 질문을 3개 이상 해보세요' 같은 즉시 실행 가능한 과제로, 전통적인 리더십 교육 대비 참여율이 3배 이상 높았습니다.",
      "Walmart의 VR 마이크로러닝: 월마트는 17,000개 이상의 매장 직원을 대상으로 VR 기반 마이크로러닝을 도입했습니다. 블랙프라이데이 대응, 고객 응대 시나리오 등을 5분 이내 VR 시뮬레이션으로 훈련하여, 교육 시간은 80% 줄이면서 지식 보유율은 10~15% 향상시켰습니다.",
      "Unilever의 AI 큐레이션 러닝: 유니레버는 Degreed 플랫폼을 활용해 직원 개개인의 역할·관심사·학습 이력에 맞는 마이크로러닝 콘텐츠를 AI가 자동 추천합니다. 사내 콘텐츠뿐 아니라 TED, Coursera, Harvard Business Review 등 외부 콘텐츠도 통합 큐레이션하여 학습 선택의 폭을 넓혔습니다.",
      "국내 적용 시 고려사항: ① 한국어 콘텐츠 제작 인프라 확보(자막, 더빙, AI 음성 합성) ② 카카오톡 등 메신저 기반 푸시 학습 활용 ③ 모바일 세로형 영상 포맷 최적화 ④ 짧은 퀴즈로 즉각적 피드백 제공. 웹헤즈 LMS는 마이크로러닝 전용 모듈과 모바일 최적화 플레이어를 제공합니다."
    ],
    date: "2026-01-05",
    readTime: "7분",
    keywords: ["이러닝 솔루션", "기업교육 LMS", "온라인 교육 플랫폼", "AI 기반 학습관리", "비대면 교육 플랫폼"],
  },
  {
    id: "immersive-learning-vr-ar",
    category: "trend",
    title: "VR/AR 기반 몰입형 학습의 부상: 해외 LMS 기술 최전선",
    summary: "메타버스와 XR 기술이 교육에 어떻게 적용되고 있는지, 해외 주요 기업과 대학의 실제 사례를 통해 몰입형 학습(Immersive Learning)의 현재와 미래를 조망합니다.",
    content: [
      "2026년, 몰입형 학습(Immersive Learning)은 더 이상 미래 기술이 아닌 현실입니다. PwC의 연구에 따르면 VR 기반 교육은 교실 수업 대비 4배 빠른 학습 속도, 2.75배 높은 자신감, 3.75배 강한 감정적 연결을 보여줍니다.",
      "의료 분야: Johns Hopkins 대학은 수술 시뮬레이션에 VR을 도입하여, 수련의의 수술 정확도를 230% 향상시켰습니다. Osso VR 플랫폼은 정형외과 수술 훈련을 가상으로 제공하며, 전 세계 140개 이상의 의료기관에서 사용 중입니다.",
      "제조·안전 분야: BMW는 전 세계 31개 공장 직원의 조립 교육에 AR 가이드를 적용하여 교육 시간을 75% 단축했습니다. Shell은 정유 시설 안전 교육에 VR을 도입해, 위험 환경 노출 없이 비상 대응 훈련을 반복 실시합니다.",
      "LMS와의 통합 방향: 최신 LMS들은 xAPI 표준을 통해 VR/AR 학습 데이터를 자동 수집합니다. '어떤 시나리오에서 실수했는지', '반복 횟수와 숙련도 변화' 등 세밀한 학습 분석이 가능해졌습니다. Cornerstone, Docebo 등은 VR 콘텐츠 라이브러리(Strivr, Mursion 등)와의 네이티브 연동을 지원합니다.",
      "국내 현황과 전망: 한국에서는 KOTRA, 삼성전자, 현대자동차 등이 VR 교육을 시범 도입했으며, 정부도 '메타버스 교육' 예산을 확대하고 있습니다. 다만 VR 기기 비용과 콘텐츠 제작 비용이 높아, 단기적으로는 웹 기반 3D 시뮬레이션(WebXR)이 현실적인 대안이 될 수 있습니다."
    ],
    date: "2025-12-28",
    readTime: "8분",
    keywords: ["이러닝 트렌드", "e-learning system", "온라인 교육 플랫폼", "AI 교육 솔루션", "교육플랫폼 개발"],
  },
  {
    id: "skills-based-learning",
    category: "guide",
    title: "스킬 기반 학습(Skills-Based Learning)으로의 전환: LinkedIn, Coursera의 전략",
    summary: "직무 중심에서 스킬 중심으로 전환되는 글로벌 교육 패러다임. LinkedIn Learning, Coursera for Business 등이 어떻게 스킬 택소노미를 구축하고 학습과 커리어를 연결하는지 분석합니다.",
    content: [
      "2026년 글로벌 HRD의 가장 큰 화두는 '스킬 기반 조직(Skills-Based Organization)'입니다. 세계경제포럼(WEF)에 따르면, 2030년까지 현재 직무의 44%에서 핵심 스킬이 변화할 것으로 예측됩니다. 이에 따라 LMS도 '과정 완료' 중심에서 '스킬 습득·인증' 중심으로 재편되고 있습니다.",
      "LinkedIn Learning의 스킬 그래프: LinkedIn은 40,000개 이상의 스킬을 매핑한 '스킬 택소노미'를 보유하고 있습니다. 학습자의 프로필, 직무, 업계 트렌드를 분석하여 '부족한 스킬'을 자동 식별하고, 맞춤형 학습 경로를 제안합니다.",
      "Coursera for Business의 스킬셋 벤치마킹: Coursera는 기업 고객에게 '글로벌 스킬 벤치마크'를 제공합니다. 동종업계 평균 대비 우리 조직의 스킬 수준을 비교하고, 격차를 줄이기 위한 학습 프로그램을 자동 설계합니다.",
      "Degreed의 스킬 시그널: Degreed는 학습 이력뿐 아니라 실제 업무 성과, 동료 평가, 자격증 등 다양한 '스킬 시그널'을 통합하여 개인의 스킬 프로파일을 구축합니다. 이를 통해 내부 인재 이동(Internal Mobility)과 프로젝트 팀 구성에 활용합니다.",
      "국내 LMS에의 적용: 한국 기업은 아직 직급·직무 중심의 교육 체계가 주류이지만, 대기업을 중심으로 스킬 기반 전환이 시작되고 있습니다. 웹헤즈 LMS는 교육과정에 스킬 태그를 부여하고, 수료 시 스킬 포인트를 누적하는 구조를 제공하여 단계적인 스킬 기반 전환을 지원합니다."
    ],
    date: "2025-12-20",
    readTime: "9분",
    keywords: ["기업교육 LMS", "직무교육 플랫폼", "HRD 교육시스템 구축", "AI 기반 학습관리", "교육관리 솔루션"],
  },
  {
    id: "edtech-unicorns-2026",
    category: "trend",
    title: "에듀테크 유니콘 분석: Duolingo, Coursera, Byju's의 기술 전략",
    summary: "기업가치 10억 달러를 넘긴 글로벌 에듀테크 기업들의 기술 스택과 성장 전략을 분석합니다. 이들의 성공 요인에서 국내 LMS 사업자가 배울 수 있는 인사이트를 도출합니다.",
    content: [
      "글로벌 에듀테크 시장은 2026년 4,000억 달러를 넘어섰으며, 유니콘 기업만 30개 이상 탄생했습니다. 이들의 공통점은 '기술 주도 교육 혁신'입니다.",
      "Duolingo의 게이미피케이션 엔진: 월간 활성 사용자 1억 명을 돌파한 Duolingo의 핵심은 '학습을 게임처럼' 만드는 기술입니다. 스트릭(연속 학습일), 리더보드, XP 포인트 등 게이미피케이션 요소와 스페이스드 리피티션 알고리즘을 결합하여, 일일 학습 리텐션율 55%를 달성했습니다.",
      "Coursera의 엔터프라이즈 전환: B2C로 시작한 Coursera는 'Coursera for Business/Government'로 B2B 시장을 공략하며 수익성을 개선했습니다. 7,000개 이상의 기업·정부가 고객이며, 대학 학위 프로그램과 직업 자격증을 LMS 내에서 원스톱 제공하는 'Learning Hub' 모델이 차별점입니다.",
      "Byju's의 적응형 학습: 인도 최대 에듀테크 Byju's는 학습자의 실시간 반응을 분석하여 난이도를 동적으로 조절하는 적응형 학습 엔진을 운영합니다. 다만 과도한 확장으로 재정 위기를 겪으며, '기술력과 사업 모델의 균형'이 중요하다는 교훈을 남겼습니다.",
      "국내 LMS에의 시사점: ① 게이미피케이션은 자발적 학습 참여의 핵심 동력 ② B2B 전환 시 기업별 맞춤 대시보드와 ROI 리포팅이 필수 ③ 적응형 학습은 AI 비용 대비 효과를 검증한 후 단계적 도입 ④ 콘텐츠 독점이 아닌 '플랫폼 연동'이 확장성의 열쇠."
    ],
    date: "2025-12-15",
    readTime: "8분",
    keywords: ["이러닝 솔루션", "온라인 교육 플랫폼", "AI LMS", "교육플랫폼 개발", "e-learning system"],
  },
  {
    id: "learning-analytics-dashboard",
    category: "tip",
    title: "학습 분석 대시보드 구축 가이드: 데이터로 교육 ROI를 증명하는 법",
    summary: "교육 담당자가 경영진에게 교육 투자 대비 성과(ROI)를 입증하기 위한 학습 분석 대시보드 설계 방법을 단계별로 안내합니다.",
    content: [
      "교육 예산을 확보하려면 ROI를 숫자로 보여줘야 합니다. '교육을 많이 했다'가 아니라 '교육으로 무엇이 달라졌는가'를 증명하는 학습 분석(Learning Analytics) 대시보드는 HRD 부서의 필수 도구입니다.",
      "핵심 KPI 4계층(Kirkpatrick 모델 기반): Level 1 반응 — 학습 만족도, NPS | Level 2 학습 — 사전·사후 테스트 점수 변화 | Level 3 행동 — 교육 후 업무 적용도 | Level 4 결과 — 매출 변화, 이직률 감소.",
      "대시보드 설계 원칙: ① 경영진용 — 3~5개 핵심 지표만 표시 ② 관리자용 — 팀별 학습 진도, 미이수자 현황 ③ 학습자용 — 개인 학습 이력, 획득 스킬/배지, 추천 과정.",
      "데이터 수집 포인트: LMS 내 학습 이력, xAPI 기반 상세 행동 데이터, 외부 데이터 연동(HR 시스템의 인사 평가, 이직률, 성과 지표). 웹헤즈 LMS는 이 모든 데이터를 통합 대시보드에서 시각화합니다.",
      "실전 팁: ① 초기에는 Level 1~2 지표부터 시작 ② 월간 정기 리포트를 자동 생성하여 경영진에게 발송 ③ A/B 테스트로 교육 효과를 객관적으로 검증 ④ 벤치마크 데이터와 비교하여 맥락을 제공."
    ],
    date: "2025-12-10",
    readTime: "7분",
    keywords: ["학습관리시스템", "기업교육 LMS", "HRD 교육시스템 구축", "교육관리 솔루션", "LMS 솔루션 비교"],
  },
  {
    id: "eu-digital-education-policy",
    category: "trend",
    title: "EU 디지털 교육 정책과 LMS: 유럽의 온라인 교육 표준화 동향",
    summary: "유럽연합의 디지털 교육 액션 플랜(DEAP)이 LMS 시장에 미치는 영향을 분석합니다. GDPR 준수, 접근성 지침, 마이크로크레덴셜 프레임워크 등 규제 환경 변화와 사업 기회를 다룹니다.",
    content: [
      "EU는 '디지털 교육 액션 플랜(DEAP)'을 통해 유럽 전역의 디지털 교육 인프라를 표준화하고 있습니다. 2026년 기준, EU 디지털 교육 시장은 약 450억 유로 규모입니다.",
      "GDPR과 LMS: 유럽에서 LMS를 운영하려면 학습 데이터의 GDPR 준수가 필수입니다. 학습자의 동의 관리, 데이터 최소 수집 원칙, '잊힐 권리' 구현 등이 LMS 핵심 기능으로 포함되어야 합니다.",
      "유럽 접근성 법(EAA): 2025년 6월부터 시행된 EAA는 디지털 교육 서비스에 WCAG 2.1 AA 수준의 접근성을 의무화합니다. 시각·청각 장애인을 위한 자막, 스크린리더 호환, 키보드 내비게이션 등이 필수 요건입니다.",
      "마이크로크레덴셜 프레임워크: EU는 단기 학습 성과를 공식 인정하는 마이크로크레덴셜 표준을 도입했습니다. LMS가 EU 표준에 맞는 디지털 배지·인증서를 발급하면, 유럽 27개국에서 상호 인정됩니다.",
      "한국 시장에의 시사점: ① K-MOOC, 학점은행제 등 국내에서도 마이크로크레덴셜 논의가 활발 ② 개인정보보호법 강화 추세에 맞춘 LMS 데이터 관리 필요 ③ 해외 진출 시 GDPR 준수 LMS 아키텍처가 경쟁력. 웹헤즈는 KWCAG 기준을 충족하는 접근성 대응 LMS를 제공합니다."
    ],
    date: "2025-12-05",
    readTime: "9분",
    keywords: ["e-learning system", "온라인 교육 플랫폼", "이러닝 솔루션", "교육플랫폼 개발", "클라우드 LMS"],
  },
  {
    id: "generative-ai-content-creation",
    category: "guide",
    title: "생성형 AI로 이러닝 콘텐츠 제작 시간을 90% 줄이는 방법",
    summary: "GPT, Gemini 등 생성형 AI를 활용하여 교육 콘텐츠를 빠르게 제작하는 실전 워크플로우를 소개합니다. 스크립트 작성부터 퀴즈 생성, 영상 나레이션까지 AI 자동화 파이프라인을 구축하는 노하우입니다.",
    content: [
      "이러닝 콘텐츠 제작의 가장 큰 병목은 '시간'입니다. 전통적인 방식으로 1시간 분량의 이러닝 콘텐츠를 만들려면 평균 100~160시간의 개발 시간이 소요됩니다. 생성형 AI를 활용하면 이 시간을 10분의 1로 줄일 수 있습니다.",
      "AI 콘텐츠 제작 파이프라인: ① 주제 분석 — AI가 학습 구조를 자동 설계 ② 스크립트 생성 — GPT/Gemini가 교육 자료 기반으로 강의 스크립트 자동 작성 ③ 시각 자료 — AI 이미지 생성으로 삽화·인포그래픽 제작 ④ 나레이션 — TTS AI가 자연스러운 음성 생성 ⑤ 퀴즈 자동 생성.",
      "품질 관리가 핵심입니다: AI가 생성한 콘텐츠는 반드시 SME(Subject Matter Expert)의 검수를 거쳐야 합니다. 사실 정확성, 법적 정확성, 브랜드 톤앤매너 일관성, 문화적 적합성을 체크해야 합니다.",
      "영상 합성: AI 아바타(Synthesia, D-ID)가 가상 강사 영상을 생성합니다. 한국어 TTS 품질이 크게 향상되어 실제 성우 녹음과 구분하기 어려운 수준입니다.",
      "웹헤즈는 LMS와 연동된 AI 콘텐츠 제작 워크플로우를 제공합니다. 기존 교육 자료를 업로드하면 AI가 이러닝 모듈로 자동 변환하고, 관리자가 편집·승인 후 즉시 LMS에 배포할 수 있습니다."
    ],
    date: "2025-11-28",
    readTime: "8분",
    keywords: ["AI 교육 솔루션", "이러닝 솔루션", "AI LMS", "교육용 SaaS 솔루션", "맞춤형 LMS 개발"],
  },
  {
    id: "southeast-asia-lms-market",
    category: "trend",
    title: "동남아 LMS 시장의 급성장: 한국 이러닝 기업의 해외 진출 기회",
    summary: "인도네시아, 베트남, 필리핀 등 동남아시아 이러닝 시장의 폭발적 성장세를 분석합니다. 현지 시장 특성과 한국 LMS 기업의 해외 사업 기회를 탐색합니다.",
    content: [
      "동남아시아 이러닝 시장은 2026년 약 120억 달러 규모로, 연평균 25% 이상의 초고속 성장을 기록하고 있습니다. 젊은 인구 구성(평균 연령 29세), 급속한 디지털화, 정부의 교육 디지털 전환 정책이 성장 동력입니다.",
      "시장 특성: ① 모바일 퍼스트 — 인터넷 사용자의 70% 이상이 모바일 전용 ② 다국어 지원 필수 ③ 저대역폭 대응 — 농촌 지역의 느린 인터넷에서도 작동하는 경량 콘텐츠 전략 ④ 가격 민감성.",
      "한국 LMS의 경쟁력: ① K-콘텐츠와 연계한 한국어 교육 LMS 수요 ② 동남아 진출 한국 기업의 사내교육 LMS 납품 ③ 정부 ODA 연계 교육 인프라 구축 사업 ④ 한국의 앞선 이러닝 기술력에 대한 높은 신뢰.",
      "진출 시 유의사항: ① 현지 파트너십이 핵심 ② 현지화 수준 — 단순 번역이 아닌 현지 교육 문화·제도에 맞는 기능 커스터마이징 ③ 데이터 규제 — 현지 데이터 주권법 준수 ④ 결제 인프라 — GoPay, GrabPay, Momo 등 현지 결제 수단 연동.",
      "웹헤즈는 다국어 지원, 모바일 최적화, 클라우드 기반 아키텍처 등 해외 시장에 필요한 기술적 기반을 이미 갖추고 있으며, 현지 파트너십을 통한 단계적 진출 전략을 수립 중입니다."
    ],
    date: "2025-11-20",
    readTime: "9분",
    keywords: ["이러닝 솔루션", "B2B 교육 플랫폼", "e-learning system", "클라우드 LMS", "교육플랫폼 개발"],
  },
  {
    id: "gamification-lms-strategy",
    category: "tip",
    title: "LMS 게이미피케이션 설계 가이드: 학습 완료율을 2배로 높이는 7가지 전략",
    summary: "배지, 리더보드, 스트릭 등 게이미피케이션 요소를 LMS에 효과적으로 적용하는 방법을 소개합니다. 과도한 보상이 역효과를 내는 사례와 함께 균형 잡힌 설계 원칙을 제시합니다.",
    content: [
      "게이미피케이션은 학습 완료율을 평균 40~60% 향상시키는 검증된 전략입니다. 그러나 잘못 설계하면 '보상 피로'를 일으켜 내적 동기를 훼손할 수 있습니다. 핵심은 외적 보상과 내적 동기의 균형입니다.",
      "전략 1~2: 진행률 시각화(프로그레스 바, 학습 지도)와 마이크로 배지('첫 강의 완료', '연속 5일 학습', '퀴즈 만점' 등)로 즉각적 성취감을 제공합니다.",
      "전략 3~4: 스트릭 시스템(연속 학습일수 추적, Duolingo 핵심 전략)과 소셜 리더보드(부서별·동기별 학습 순위). 단, 하위권 좌절 방지를 위해 '상위 N명만 표시'하거나 '개인 최고 기록 갱신'에 초점을 맞추세요.",
      "전략 5~7: 시나리오 기반 챌린지(실제 업무 시뮬레이션 미니 게임), 팀 미션(부서 단위 공동 목표), 실물 보상 연계(포인트 적립 → 카페 쿠폰, 반차 등).",
      "웹헤즈 LMS는 배지 시스템, 포인트 적립, 학습 랭킹, 수료 인증서 등 게이미피케이션 핵심 모듈을 기본 제공하며, 조직 문화에 맞게 보상 체계를 커스터마이징할 수 있습니다."
    ],
    date: "2025-11-15",
    readTime: "7분",
    keywords: ["기업교육 LMS", "이러닝 플랫폼 추천", "학습관리시스템", "교육관리 솔루션", "맞춤형 LMS 개발"],
  },
  {
    id: "open-edx-enterprise",
    category: "guide",
    title: "Open edX로 기업 교육 플랫폼 구축하기: 가능성과 한계",
    summary: "하버드·MIT가 만든 오픈소스 MOOC 플랫폼 Open edX를 기업 교육에 활용할 수 있을까? 기술 아키텍처, 커스터마이징 범위, 운영 비용, 상용 LMS와의 현실적 비교를 통해 판단 기준을 제공합니다.",
    content: [
      "Open edX는 edX(현 2U)의 기반 기술로, 전 세계 수천 개 대학·기업이 사용하는 대규모 오픈소스 학습 플랫폼입니다. Python/Django 기반이며, 2025년 'Redwood' 릴리스에서 React 기반 Micro-Frontend 아키텍처로 전환되었습니다.",
      "강점: ① 완전한 소스 코드 접근 ② 대규모 동시접속(5,000만 사용자 검증) ③ 풍부한 학습 도구(토론 포럼, 피어 평가, XBlock) ④ SCORM/xAPI 지원 ⑤ 글로벌 커뮤니티.",
      "한계: ① 높은 기술 장벽(Kubernetes, Docker, Terraform 필요) ② 기업교육 특화 기능 부족(법정의무교육, 인사 시스템 연동, 한국형 결제 등 별도 개발) ③ 한국어 지원 미흡 ④ TCO가 상용 LMS와 비슷하거나 더 높을 수 있음.",
      "언제 적합한가: 대규모 MOOC 운영, 글로벌 다국어 교육 플랫폼, 자체 개발 역량이 충분한 대기업·대학. 국내 중소·중견기업 사내교육이 목적이라면 한국 시장에 최적화된 상용 LMS가 도입 속도와 효율 면에서 유리합니다.",
      "하이브리드 전략: Open edX를 외부 MOOC용, 상용 LMS를 내부 직원 교육용으로 이원화 운영하는 전략도 효과적입니다. 웹헤즈는 Open edX에서 웹헤즈 LMS로의 마이그레이션과 두 플랫폼 간 데이터 동기화도 지원합니다."
    ],
    date: "2025-11-10",
    readTime: "9분",
    keywords: ["LMS 구축", "교육플랫폼 개발", "이러닝 솔루션", "LMS 솔루션 비교", "온라인 학습 시스템 구축 방법"],
  },
];

function BlogCard({ post, isExpanded, onToggle }: { post: BlogPost; isExpanded: boolean; onToggle: () => void }) {
  const config = categoryConfig[post.category];
  const Icon = config.icon;

  return (
    <article
      className="group rounded-2xl border border-border bg-card overflow-hidden transition-shadow duration-300 hover:shadow-lg"
      itemScope
      itemType="https://schema.org/Article"
    >
      {/* Category bar */}
      <div className="h-1" style={{ backgroundColor: config.color }} />

      <div className="p-6 md:p-8">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: config.color }}
          >
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <time itemProp="datePublished" dateTime={post.date}>{post.date}</time>
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {post.readTime} 읽기
          </span>
        </div>

        {/* Title */}
        <h2
          className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-tight"
          itemProp="headline"
          style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}
        >
          {post.title}
        </h2>

        {/* Summary */}
        <p
          className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-4"
          itemProp="description"
          style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}
        >
          {post.summary}
        </p>

        {/* Expanded content */}
        {isExpanded && (
          <div className="space-y-4 mb-5 pt-4 border-t border-border">
            {post.content.map((paragraph, i) => (
              <p
                key={i}
                className="text-sm md:text-[15px] text-foreground/80 leading-[1.8]"
                style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}
                itemProp="articleBody"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Keywords */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.keywords.map((kw) => (
            <span
              key={kw}
              className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground"
              itemProp="keywords"
            >
              #{kw}
            </span>
          ))}
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-2 transition-colors"
        >
          {isExpanded ? "접기" : "자세히 읽기"}
          <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </button>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "웹헤즈 LMS 인사이트",
    description: "LMS 도입 가이드, 이러닝 트렌드, AI 교육 솔루션 인사이트를 제공하는 웹헤즈 블로그",
    url: "https://service.webheads.co.kr/blog",
    publisher: {
      "@type": "Organization",
      name: "Webheads",
      url: "https://service.webheads.co.kr",
    },
    blogPost: blogPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.summary,
      datePublished: p.date,
      keywords: p.keywords.join(", "),
      author: { "@type": "Organization", name: "Webheads" },
    })),
  };

  return (
    <>
      <SEO
        title="LMS 인사이트 | 이러닝 트렌드 · 도입 가이드 — 웹헤즈"
        description="LMS 도입 체크리스트, AI 기반 학습관리 트렌드, 이러닝 플랫폼 비용 가이드 등 기업교육 담당자를 위한 전문 인사이트를 제공합니다."
        keywords="LMS 도입, 이러닝 솔루션, AI LMS, 학습관리시스템, 기업교육 LMS, LMS 솔루션 비교, 이러닝 트렌드, AI 교육 솔루션, 교육플랫폼 개발, HRD 교육시스템 구축"
        path="/blog"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="inline-block px-4 py-1.5 mb-5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary">
            Blog & Insights
          </span>
          <h1
            className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-4"
            style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif", letterSpacing: "-0.02em" }}
          >
            LMS 인사이트
          </h1>
          <p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}
          >
            이러닝 솔루션 도입부터 AI 학습관리 트렌드까지,<br className="hidden md:block" />
            기업교육 담당자를 위한 전문 가이드를 제공합니다.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col gap-8">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                isExpanded={expandedId === post.id}
                onToggle={() => handleToggle(post.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-8 md:p-12 text-center">
            <h2
              className="text-2xl md:text-3xl font-bold text-foreground mb-3"
              style={{ fontFamily: "'Noto Sans', 'Noto Sans KR', sans-serif" }}
            >
              LMS 도입, 어디서부터 시작해야 할지 모르겠다면?
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              16년 경험의 웹헤즈 전문 컨설턴트가 무료로 상담해드립니다.
            </p>
            <Link
              to="/lms#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
            >
              무료 상담 신청하기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
