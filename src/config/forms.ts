// 직업별 이력서·자기소개서 Word 파일 — 직업군 10개 × 포지션 2개, 이력서·자기소개서 각 20종(총 40개).
// 파일은 public/fun/forms/ 에 있고 scripts/fun/docx/make_resumes_docx.py · make_covers_docx.py 로 만듭니다. (id 는 두 스크립트와 같아야 합니다)
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

export const formFile = (id: string, kind: DocKind, ext: "docx" | "jpg") => (ext === "jpg" ? `/fun/forms/thumbs/${kind}-${id}.jpg` : `/fun/forms/${kind}-${id}.docx`);

/** 내려받을 때 보이는 한글 파일 이름 — 예) 이력서_백엔드개발자.docx */
export const formDownloadName = (p: Position, kind: DocKind) => `${kindLabel[kind]}_${p.name.replace(/\s+/g, "").replace(/\//g, "·")}.docx`;
