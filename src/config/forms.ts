// 직업별 이력서·자기소개서 Word 파일 — 직업군 10개 × 포지션 3개 × 양식 10종 × (이력서·자기소개서) = 600개.
// 양식 구조와 작성 가이드는 고용24 이력서·자기소개서 가이드, NCS 입사지원서 구성, STAR 기법, JSON Resume 스키마를 바탕으로 합니다(scripts/fun/docx/guide_data.py).
// 파일은 public/fun/forms/ 에 있고 scripts/fun/docx/make_forms_docx.py 로 만듭니다. (포지션 id 는 resume_data.py 와 같아야 합니다)
export type DocKind = "resume" | "cover";
export interface Position { id: string; name: string; desc: string }
export interface JobGroup { key: string; label: string; positions: Position[] }

export const jobGroups: JobGroup[] = [
  { key: "it", label: "IT·개발", positions: [
    { id: "it-backend", name: "백엔드 개발자", desc: "기술 스택·프로젝트 성과(지표) 중심" },
    { id: "it-frontend", name: "프론트엔드 개발자", desc: "배포한 서비스·성능/접근성 개선 사례 중심" },
    { id: "it-data", name: "데이터 분석가", desc: "분석 질문·도구(SQL·Python)·의사결정 영향 중심" } ] },
  { key: "design", label: "디자인", positions: [
    { id: "design-uiux", name: "UI·UX 디자이너", desc: "프로젝트 케이스(문제→과정→결과)·사용 도구" },
    { id: "design-brand", name: "브랜드·그래픽 디자이너", desc: "작업물·공모전 수상 이력 중심(사진 포함)" },
    { id: "design-video", name: "영상·모션 디자이너", desc: "대표 영상 링크·도구·내 역할 중심" } ] },
  { key: "marketing", label: "마케팅", positions: [
    { id: "mkt-performance", name: "퍼포먼스 마케터", desc: "매체별 ROAS·CPA와 캠페인 성과 중심" },
    { id: "mkt-content", name: "콘텐츠·SNS 마케터", desc: "채널 운영 성과·대표 콘텐츠 중심" },
    { id: "mkt-crm", name: "CRM·그로스 마케터", desc: "고객 세그먼트·자동화·리텐션 실험 중심" } ] },
  { key: "sales", label: "영업·금융", positions: [
    { id: "sales-b2b", name: "법인영업(B2B)", desc: "연도별 실적·거래처 수주 사례 중심" },
    { id: "sales-fc", name: "보험·금융 영업", desc: "보유 자격·신계약 실적·고객 관리 방식" },
    { id: "sales-tech", name: "기술영업·솔루션 세일즈", desc: "PoC·데모·수주 사례와 제품 이해 중심" } ] },
  { key: "office", label: "사무·경영지원", positions: [
    { id: "office-accounting", name: "회계·재무", desc: "자격·회계 프로그램·담당 업무 범위 체크" },
    { id: "office-hr", name: "인사·총무", desc: "담당 영역 체크·제도 개선 프로젝트" },
    { id: "office-secretary", name: "비서·사무행정", desc: "일정·문서·회의 지원 범위와 사무 프로그램" } ] },
  { key: "medical", label: "의료", positions: [
    { id: "med-nurse", name: "간호사", desc: "면허·부서별 임상 경력·보유 술기 체크" },
    { id: "med-admin", name: "병원 행정·간호조무사", desc: "자격·업무 경험·EMR·청구 시스템" },
    { id: "med-dental", name: "치과위생사·치과행정", desc: "면허·보수교육·진료 보조 범위 체크" } ] },
  { key: "education", label: "교육", positions: [
    { id: "edu-teacher", name: "학교·학원 교사/강사", desc: "교원 자격·수업 경력·교육관" },
    { id: "edu-childcare", name: "보육·유아교사", desc: "보육 자격·담당 연령반·활동 프로그램" },
    { id: "edu-afterschool", name: "방과후·돌봄교사", desc: "자격·담당 학년·프로그램·안전 관리" } ] },
  { key: "service", label: "서비스", positions: [
    { id: "svc-hotel", name: "호텔·관광 서비스", desc: "어학 능력·부서 경험·서비스 사례" },
    { id: "svc-cafe", name: "외식·카페 매니저", desc: "매장 운영 규모·매출/원가 개선 사례" },
    { id: "svc-cs", name: "고객센터·CS 상담원", desc: "응대 건수·만족도 지표·상담 분야 중심" } ] },
  { key: "production", label: "생산·물류", positions: [
    { id: "prod-quality", name: "생산·품질관리", desc: "기능 자격·설비/공정·불량 개선 사례" },
    { id: "prod-logistics", name: "물류·구매", desc: "담당 업무 체크·시스템·비용 절감" },
    { id: "prod-safety", name: "산업안전관리", desc: "안전보건 자격·위험성 평가·재해 예방 실적" } ] },
  { key: "construction", label: "건설·시설", positions: [
    { id: "con-site", name: "건설 현장관리", desc: "현장 이력(공종·규모)·공정/안전 관리" },
    { id: "con-electric", name: "전기·설비 기술", desc: "전기·소방 자격·담당 설비·장애 대응" },
    { id: "con-interior", name: "인테리어 시공·설계", desc: "시공 이력(면적·공사비)·도면 프로그램" } ] },
];

export const kindLabel: Record<DocKind, string> = { resume: "이력서", cover: "자기소개서" };
export const allPositions = jobGroups.flatMap((g) => g.positions);

/** 양식 10종 — 이력서·자기소개서 모두 번호(1~10)마다 짜임이 완전히 다릅니다. */
export const variantNames: Record<DocKind, readonly string[]> = {
  resume: ["정석형", "사이드바형", "타임라인형", "요약형", "카드형", "NCS형", "경력기술서형", "신입활동형", "포트폴리오형", "JSONResume형"],
  cover: ["문항형", "줄노트형", "좌우2단형", "STAR형", "서술형", "NCS4문항형", "준비4단계형", "경험3카드형", "두괄식형", "직무매칭형"],
};
export const variantDesc: Record<DocKind, readonly string[]> = {
  resume: ["칸마다 채우는 표준 서식", "왼쪽에 연락처·기술을 모은 2단 구성", "기간을 왼쪽 선에 이어 쓰는 서체 중심 구성", "상단 띠와 핵심 요약으로 한눈에 보이는 구성", "경력·프로젝트를 카드로 나눠 쓰는 구성", "인적·교육·자격·경력경험 4영역 + 경력기술서(NCS 입사지원서 구조)", "회사별 담당 역할·업무·성과를 길게 적는 경력직 구성", "활동 기간·장소·내용·맡은 일·결과로 적는 신입 구성", "대표 작업 3선을 먼저 보여 주는 포트폴리오 구성", "basics·work·education·skills 구조의 JSON Resume 방식"],
  cover: ["문항마다 상자에 쓰는 기본형", "줄 노트에 이어 쓰는 담백한 구성", "질문은 왼쪽, 답변은 오른쪽에 쓰는 2단 구성", "상황·과제·행동·결과로 정리하는 구성", "편지처럼 흐름 있게 쓰는 서술형", "지원동기·직무경험·조직적합성·직업기초능력 4문항(NCS)", "정보수집→역량→경험→비전 4단계로 준비한 뒤 쓰는 구성", "경험 3개를 STAR로 정리해 두고 꺼내 쓰는 구성", "한 줄 결론→근거 3가지→본문의 두괄식 구성", "공고의 요구 역량과 내 경험을 짝지어 쓰는 구성"],
};
export const variants = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type Variant = (typeof variants)[number];

export const getPosition = (id: string) => allPositions.find((p) => p.id === id);
export const groupOf = (id: string) => jobGroups.find((g) => g.positions.some((p) => p.id === id));

export const formFile = (id: string, kind: DocKind, n: Variant, _ext: "jpg") => `/fun/forms/thumbs/${kind}-${id}-${n}.jpg`;

/** 그림을 눌렀을 때 보이는 큰 미리보기(모든 쪽을 세로로 이어 붙인 그림) */
export const formLargeFile = (id: string, kind: DocKind, n: Variant) => `/fun/forms/thumbs/large/${kind}-${id}-${n}.jpg`;

/** 내려받을 때 보이는 한글 파일 이름 — 예) 이력서_백엔드개발자_1_정석형.docx */
export const formDownloadName = (p: Position, kind: DocKind, n: Variant) => `${kindLabel[kind]}_${p.name.replace(/\s+/g, "").replace(/\//g, "·")}_${n}_${variantNames[kind][n - 1]}.docx`;

/** 실제 Word 파일 주소 — 파일 이름 자체가 한글이에요 */
export const formDocx = (p: Position, kind: DocKind, n: Variant) => `/fun/forms/${formDownloadName(p, kind, n)}`;
