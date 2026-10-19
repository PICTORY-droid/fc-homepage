// 직업별 이력서·자기소개서 Word 파일 — 직업군 10개 × 포지션 2개 × 양식 5종 × (이력서·자기소개서) = 200개.
// 파일은 public/fun/forms/ 에 있고 scripts/fun/docx/make_forms_docx.py 로 만듭니다. (포지션 id 는 resume_data.py 와 같아야 합니다)
export type DocKind = "resume" | "cover";
export interface Position { id: string; name: string; desc: string }
export interface JobGroup { key: string; label: string; positions: [Position, Position] }

export const jobGroups: JobGroup[] = [
  { key: "it", label: "IT·개발", positions: [
    { id: "it-backend", name: "백엔드 개발자", desc: "기술 스택·프로젝트 성과(지표) 중심" },
    { id: "it-frontend", name: "프론트엔드 개발자", desc: "배포한 서비스·성능/접근성 개선 사례 중심" } ] },
  { key: "design", label: "디자인", positions: [
    { id: "design-uiux", name: "UI·UX 디자이너", desc: "프로젝트 케이스(문제→과정→결과)·사용 도구" },
    { id: "design-brand", name: "브랜드·그래픽 디자이너", desc: "작업물·공모전 수상 이력 중심(사진 포함)" } ] },
  { key: "marketing", label: "마케팅", positions: [
    { id: "mkt-performance", name: "퍼포먼스 마케터", desc: "매체별 ROAS·CPA와 캠페인 성과 중심" },
    { id: "mkt-content", name: "콘텐츠·SNS 마케터", desc: "채널 운영 성과·대표 콘텐츠 중심" } ] },
  { key: "sales", label: "영업·금융", positions: [
    { id: "sales-b2b", name: "법인영업(B2B)", desc: "연도별 실적·거래처 수주 사례 중심" },
    { id: "sales-fc", name: "보험·금융 영업", desc: "보유 자격·신계약 실적·고객 관리 방식" } ] },
  { key: "office", label: "사무·경영지원", positions: [
    { id: "office-accounting", name: "회계·재무", desc: "자격·회계 프로그램·담당 업무 범위 체크" },
    { id: "office-hr", name: "인사·총무", desc: "담당 영역 체크·제도 개선 프로젝트" } ] },
  { key: "medical", label: "의료", positions: [
    { id: "med-nurse", name: "간호사", desc: "면허·부서별 임상 경력·보유 술기 체크" },
    { id: "med-admin", name: "병원 행정·간호조무사", desc: "자격·업무 경험·EMR·청구 시스템" } ] },
  { key: "education", label: "교육", positions: [
    { id: "edu-teacher", name: "학교·학원 교사/강사", desc: "교원 자격·수업 경력·교육관" },
    { id: "edu-childcare", name: "보육·유아교사", desc: "보육 자격·담당 연령반·활동 프로그램" } ] },
  { key: "service", label: "서비스", positions: [
    { id: "svc-hotel", name: "호텔·관광 서비스", desc: "어학 능력·부서 경험·서비스 사례" },
    { id: "svc-cafe", name: "외식·카페 매니저", desc: "매장 운영 규모·매출/원가 개선 사례" } ] },
  { key: "production", label: "생산·물류", positions: [
    { id: "prod-quality", name: "생산·품질관리", desc: "기능 자격·설비/공정·불량 개선 사례" },
    { id: "prod-logistics", name: "물류·구매", desc: "담당 업무 체크·시스템·비용 절감" } ] },
  { key: "construction", label: "건설·시설", positions: [
    { id: "con-site", name: "건설 현장관리", desc: "현장 이력(공종·규모)·공정/안전 관리" },
    { id: "con-electric", name: "전기·설비 기술", desc: "전기·소방 자격·담당 설비·장애 대응" } ] },
];

export const kindLabel: Record<DocKind, string> = { resume: "이력서", cover: "자기소개서" };
export const allPositions = jobGroups.flatMap((g) => g.positions);

/** 양식 5종 — 이력서·자기소개서 모두 번호(1~5)마다 짜임이 완전히 다릅니다. */
export const variantNames: Record<DocKind, readonly string[]> = {
  resume: ["정석형", "사이드바형", "타임라인형", "요약형", "카드형"],
  cover: ["문항형", "줄노트형", "좌우2단형", "STAR형", "서술형"],
};
export const variantDesc: Record<DocKind, readonly string[]> = {
  resume: ["칸마다 채우는 표준 서식", "왼쪽에 연락처·기술을 모은 2단 구성", "기간을 왼쪽 선에 이어 쓰는 서체 중심 구성", "상단 띠와 핵심 요약으로 한눈에 보이는 구성", "경력·프로젝트를 카드로 나눠 쓰는 구성"],
  cover: ["문항마다 상자에 쓰는 기본형", "줄 노트에 이어 쓰는 담백한 구성", "질문은 왼쪽, 답변은 오른쪽에 쓰는 2단 구성", "상황·과제·행동·결과로 정리하는 구성", "편지처럼 흐름 있게 쓰는 서술형"],
};
export const variants = [1, 2, 3, 4, 5] as const;
export type Variant = (typeof variants)[number];

export const getPosition = (id: string) => allPositions.find((p) => p.id === id);
export const groupOf = (id: string) => jobGroups.find((g) => g.positions.some((p) => p.id === id));

export const formFile = (id: string, kind: DocKind, n: Variant, ext: "docx" | "jpg") => (ext === "jpg" ? `/fun/forms/thumbs/${kind}-${id}-${n}.jpg` : `/fun/forms/${kind}-${id}-${n}.docx`);

/** 그림을 눌렀을 때 보이는 큰 미리보기(모든 쪽을 세로로 이어 붙인 그림) */
export const formLargeFile = (id: string, kind: DocKind, n: Variant) => `/fun/forms/thumbs/large/${kind}-${id}-${n}.jpg`;

/** 내려받을 때 보이는 한글 파일 이름 — 예) 이력서_백엔드개발자_1_정석형.docx */
export const formDownloadName = (p: Position, kind: DocKind, n: Variant) => `${kindLabel[kind]}_${p.name.replace(/\s+/g, "").replace(/\//g, "·")}_${n}_${variantNames[kind][n - 1]}.docx`;
