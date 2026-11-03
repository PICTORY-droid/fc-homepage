// 상단 메뉴 '즐길거리' 안의 세부 토글 목록 — 즐길거리 항목(slug)마다 펼치면 보이는 하위 메뉴를 각 자료 설정에서 자동으로 만듭니다.
// 자료(편지지 계절·명함 분류·PPT 묶음·엑셀 분야·직군)를 추가하면 메뉴에도 저절로 생겨요. (서버에서만 읽는 설정 파일)
import { seasons } from "./stationery";
import { cardCategories } from "./cards";
import { listedPackGroups } from "./pack";
import { sheetGroups } from "./sheets";
import { jobGroups } from "./forms";

export interface FunMenuLink { label: string; href: string }

const packChildren = Object.fromEntries(
  listedPackGroups.map((g) => [g.slug, g.items.map((it) => ({ label: it.title.replace(/\s*프리미엄$/, ""), href: `/fun/${g.slug}/${it.key}` }))]),
);

export const funMenuChildren: Record<string, FunMenuLink[]> = {
  ...packChildren,
  stationery: seasons.map((s) => ({ label: `${s.label} 편지지`, href: `/fun/stationery/${s.key}` })),
  cards: cardCategories.map((c) => ({ label: c.label, href: `/fun/cards/${c.key}` })),
  sheets: sheetGroups.map((g) => ({ label: g.label, href: `/fun/sheets/${g.key}` })),
  forms: jobGroups.map((g) => ({ label: g.label, href: `/fun/forms#${g.key}` })),
};
