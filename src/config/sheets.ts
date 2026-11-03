// 생활·업무 엑셀 서식 — 분야 6개 안에 두 가지 자료가 함께 들어 있습니다.
//  · 서식 100종: 템블리(tembly) 엑셀서식. 파일은 public/fun/sheets/, 목록(sheets.data.json)은 scripts/fun/sheets/import_tembly_sheets.py 가 만듭니다.
//  · 테마 모음 6종(항목마다 디자인 50가지): 예전 '엑셀 양식' 묶음. 파일·목록은 config/pack.ts(엑셀 묶음)를 그대로 씁니다.
import data from "./sheets.data.json";
import { EXCEL_PACK, entriesBySeason, getGroup as getPackGroup, packEntries, packSeasons, seasonSlug, type PackItem, type Season } from "./pack";

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

/** 테마 모음 — 엑셀 양식 항목 하나(가계부 등)와 그 디자인 50가지 */
export interface SheetCollection { item: PackItem; group: SheetGroupKey; count: number }

export interface SheetGroup { key: SheetGroupKey; label: string; short: string; items: SheetTemplate[]; collections: SheetCollection[] }

// 분야 이름·소개는 여기서만 고칩니다. (순서 = 화면에 보이는 순서)
const meta: { key: SheetGroupKey; label: string; short: string }[] = [
  { key: "work", label: "취업·직장", short: "지원 현황, 면접, 근무 기록, 퇴직금" },
  { key: "office", label: "업무·사무", short: "일정, 회의, 서류, 달력" },
  { key: "biz", label: "소상공인·프리랜서", short: "매출, 견적서, 급여, 세금 준비" },
  { key: "life", label: "생활·가계", short: "가계부, 저축, 대출, 집안 관리" },
  { key: "study", label: "학습·교육", short: "출석, 성적, 계획, 시간표" },
  { key: "event", label: "모임·행사·여가", short: "회비, 경조사, 행사 준비, 여행" },
];

// 테마 모음이 들어가는 분야 — 엑셀 양식 항목이 늘면 여기에 한 줄 추가합니다. (sheets.test.ts 가 빠진 항목을 잡아냄)
export const COLLECTION_GROUP: Record<string, SheetGroupKey> = {
  ledger: "life", policy: "life", saving: "life", allowance: "life", gift: "event", quote: "biz",
};

export const sheetTemplates = (data as { items: SheetTemplate[] }).items;

export const sheetCollections: SheetCollection[] = (getPackGroup(EXCEL_PACK)?.items ?? [])
  .filter((item) => COLLECTION_GROUP[item.key])
  .map((item) => ({ item, group: COLLECTION_GROUP[item.key], count: packEntries(item).length }));

export const sheetGroups: SheetGroup[] = meta.map((g) => ({
  ...g,
  items: sheetTemplates.filter((t) => t.group === g.key),
  collections: sheetCollections.filter((c) => c.group === g.key),
}));

export const getSheetGroup = (key: string) => sheetGroups.find((g) => g.key === key);

/** 주소의 분야·항목이 서로 맞을 때만 돌려줍니다. (예: /fun/sheets/life/ledger) */
export const getSheetCollection = (group: string, item: string) => sheetCollections.find((c) => c.group === group && c.item.key === item);

/** 추천 서식(분야 순서 → 목록 순서) */
export const featuredSheets: SheetTemplate[] = sheetGroups.flatMap((g) => g.items.filter((t) => t.featured));

/** 테마 모음까지 합친 내려받을 수 있는 엑셀 파일 수 */
export const sheetFileCount = sheetTemplates.length + sheetCollections.reduce((n, c) => n + c.count, 0);

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

// ── 테마 모음 ────────────────────────────────────────────────

/** 테마 모음 주소 — 계절을 주면 그 계절 페이지 (예: /fun/sheets/life/ledger/spring) */
export const collectionPath = (c: SheetCollection, season?: Season) => `/fun/sheets/${c.group}/${c.item.key}${season ? `/${seasonSlug[season]}` : ""}`;

/** 엑셀 양식 항목 키로 테마 모음 찾기 (예전 /fun/excel/<항목> 주소 옮기기·이달의 양식 연결용) */
export const collectionByItem = (itemKey: string) => sheetCollections.find((c) => c.item.key === itemKey);

/** 계절별 수 — 계절 버튼에 씁니다 */
export const collectionSeasons = (c: SheetCollection) => packSeasons.map((s) => ({ season: s, count: entriesBySeason(c.item, s).length }));

/** 테마 모음 카드 미리보기(760×500, 서식 카드와 같은 크기) — scripts/fun/sheets/make_collection_cards.py 가 만듭니다 */
export const collectionCardThumb = (c: Pick<SheetCollection, "item">, no: number) => `/fun/pack/xlsx/${c.item.key}/cards/${c.item.key}-${String(no).padStart(2, "0")}.jpg`;
