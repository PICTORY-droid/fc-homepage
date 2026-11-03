// 생활·업무 엑셀 서식 — 템블리(tembly) 엑셀서식 100종, 분야 6개. 파일은 public/fun/sheets/ 에 있습니다.
// 목록(sheets.data.json)과 파일은 scripts/fun/sheets/import_tembly_sheets.py 가 템블리 저장소에서 가져옵니다. 직접 고치지 말고 스크립트로 다시 만드세요.
import data from "./sheets.data.json";

export type SheetGroupKey = "work" | "office" | "biz" | "life" | "study" | "event";

export interface SheetTemplate {
  id: string;
  title: string;
  desc: string;
  group: SheetGroupKey;
  tag: string;
  /** ledger: 입력·대시보드·설정 구조의 장부형, form: 한 장짜리 양식·계산기 */
  kind: "ledger" | "form";
  featured: boolean;
  /** 요약(대시보드) 화면이 있는지 */
  dashboard: boolean;
  sheets: string[];
  highlights: string[];
}

export interface SheetGroup { key: SheetGroupKey; label: string; short: string; items: SheetTemplate[] }

// 분야 이름·소개는 여기서만 고칩니다. (순서 = 화면에 보이는 순서)
const meta: { key: SheetGroupKey; label: string; short: string }[] = [
  { key: "work", label: "취업·직장", short: "지원 현황, 면접, 근무 기록, 퇴직금" },
  { key: "office", label: "업무·사무", short: "일정, 회의, 서류, 달력" },
  { key: "biz", label: "소상공인·프리랜서", short: "매출, 견적서, 급여, 세금 준비" },
  { key: "life", label: "생활·가계", short: "가계부, 저축, 대출, 집안 관리" },
  { key: "study", label: "학습·교육", short: "출석, 성적, 계획, 시간표" },
  { key: "event", label: "모임·행사·여가", short: "회비, 경조사, 행사 준비, 여행" },
];

export const sheetTemplates = (data as { items: SheetTemplate[] }).items;

export const sheetGroups: SheetGroup[] = meta.map((g) => ({ ...g, items: sheetTemplates.filter((t) => t.group === g.key) }));

export const getSheetGroup = (key: string) => sheetGroups.find((g) => g.key === key);

/** 추천 서식(분야 순서 → 목록 순서) */
export const featuredSheets: SheetTemplate[] = sheetGroups.flatMap((g) => g.items.filter((t) => t.featured));

type Ref = Pick<SheetTemplate, "id">;

export const sheetFile = (t: Ref) => `/fun/sheets/files/${t.id}.xlsx`;
/** 카드 미리보기(760×500) */
export const sheetThumb = (t: Ref) => `/fun/sheets/thumbs/${t.id}.jpg`;
/** 팝업 큰 미리보기 — 입력 화면 아래에 요약 화면이 이어 붙어 있음 */
export const sheetLarge = (t: Ref) => `/fun/sheets/large/${t.id}.jpg`;

export const SHEET_ASPECT = 760 / 500;

/** 내려받을 때 보이는 한글 이름 — 예) 엑셀서식_퇴직금 계산표.xlsx (파일 이름에 쓸 수 없는 글자는 뺌) */
export function sheetDownloadName(t: Pick<SheetTemplate, "title">): string {
  const clean = t.title.replace(/[\\/:*?"<>|\u0000-\u001f]/g, "").trim().slice(0, 60);
  return `엑셀서식_${clean}.xlsx`;
}

/** 카드 아래 한 줄 설명 — 서식 설명 + 시트 구성 */
export const sheetCardDesc = (t: SheetTemplate) => `${t.desc} (${t.sheets.join("·")})`;
