// 이달의 양식 — 달력 기준으로 지금 계절에 맞는 자료 3가지를 골라 홈에 올립니다. 문구는 달마다 한 줄만 바꾸면 됩니다.
import { EXCEL_PACK, getGroup, getItem, entriesBySeason, packThumb, seasonSlug, type Season } from "./pack";
import { collectionByItem, collectionPath } from "./sheets";
import { seasons, stationeryBySeason, stationeryFile, type SeasonKey } from "./stationery";

const PAIRS_PER_SEASON = 3; // 홈 무작위 편지지 후보: 빛깔·주제마다 두 장씩 짝지은 묶음 수 (홈 화면 데이터가 무거워지지 않게)

export interface MonthlyCard { href: string; title: string; desc: string; thumb?: string; aspect: number; pool?: MonthlyChoice[] }
/** 홈에서 무작위로 바꿔 보여 줄 후보(편지지) — 첫 번째가 기본(서버 화면)이고, 방문할 때마다 그중 하나로 바뀝니다. */
export interface MonthlyChoice { href: string; title: string; thumbs: string[] } // 편지지 두 장을 나란히
export interface MonthlyPick { month: number; heading: string; lead: string; cards: MonthlyCard[] }

const SEASON_OF_MONTH: Record<number, { key: SeasonKey; label: Season }> = {
  1: { key: "winter", label: "포근빛" }, 2: { key: "winter", label: "포근빛" }, 3: { key: "spring", label: "꽃빛" }, 4: { key: "spring", label: "꽃빛" }, 5: { key: "spring", label: "꽃빛" },
  6: { key: "summer", label: "초록빛" }, 7: { key: "summer", label: "초록빛" }, 8: { key: "summer", label: "초록빛" }, 9: { key: "autumn", label: "노을빛" }, 10: { key: "autumn", label: "노을빛" }, 11: { key: "autumn", label: "노을빛" },
  12: { key: "winter", label: "포근빛" },
};
// 달마다 한 줄 — 단정·권유 없이 계절 분위기만 담습니다.
const LEAD: Record<number, string> = {
  1: "새해 인사와 한 해 계획을 적어 두기 좋은 때예요.", 2: "봄을 기다리며 안부를 전하기 좋은 때예요.", 3: "새 학기, 새 출발에 어울리는 자료예요.", 4: "꽃 소식과 함께 안부를 전해 보세요.",
  5: "가정의 달, 가족에게 마음을 전해 보세요.", 6: "초여름, 시원한 안부 편지 한 장 어떠세요.", 7: "무더위를 잊게 해 줄 청량한 자료예요.", 8: "휴가철 소식을 나누기 좋은 때예요.",
  9: "추석 인사와 가을 안부를 준비해 보세요.", 10: "단풍처럼 물드는 이야기를 적어 보세요.", 11: "한 해를 돌아보며 고마운 분께 편지를 써 보세요.", 12: "연말 인사와 결산을 정리해 보세요.",
};

const packCard = (groupSlug: string, itemKey: string, season: Season): MonthlyCard | undefined => {
  const g = getGroup(groupSlug); const it = g && getItem(g, itemKey);
  if (!g || !it) return undefined;
  const first = entriesBySeason(it, season)[0];
  const moved = g.slug === EXCEL_PACK ? collectionByItem(it.key) : undefined; // 엑셀 양식은 엑셀 서식의 테마 모음 주소로
  return { href: moved ? collectionPath(moved, season) : `/fun/${g.slug}/${it.key}/${seasonSlug[season]}`, title: `${season} ${it.title}`, desc: "", thumb: first ? packThumb(it, first.no) : undefined, aspect: it.aspect ?? 1 };
};

export function monthlyPick(month: number): MonthlyPick {
  const m = ((month - 1) % 12 + 12) % 12 + 1;
  const { key, label } = SEASON_OF_MONTH[m];
  const letter = stationeryBySeason(key)[0];
  const pairsOf = (k: SeasonKey) => { const l = stationeryBySeason(k); return Array.from({ length: Math.min(PAIRS_PER_SEASON, Math.floor(l.length / 2)) }, (_, j) => [l[j * 2], l[j * 2 + 1]].map((it) => stationeryFile(it, "jpg"))); };
  // 기본(첫 번째)은 이달의 빛깔, 나머지는 모든 빛깔·주제 — 방문할 때마다 그중 한 묶음이 보여요
  const pool: MonthlyChoice[] = [key, ...seasons.map((s) => s.key)].flatMap((k, n) => (n === 0 ? pairsOf(k).slice(0, 1) : pairsOf(k)).map((thumbs) => ({ href: `/fun/stationery/${k}`, title: `${seasons.find((s) => s.key === k)?.label ?? ""} 편지지`, thumbs })));
  const cards: MonthlyCard[] = [
    { href: `/fun/stationery/${key}`, title: `${label} 편지지`, desc: "", thumb: letter ? stationeryFile(letter, "jpg") : undefined, aspect: 794 / 1123, pool },
    packCard("ppt-pro", "talkpro", label), packCard("excel", "ledger", label),
  ].filter((c): c is MonthlyCard => Boolean(c));
  return { month: m, heading: `${m}월의 양식`, lead: LEAD[m], cards };
}

/** 한국 시간 기준 현재 월 */
export const currentMonthKST = (now = new Date()) => Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", month: "numeric" }).format(now));

/** 홈에 올릴 달 — 숫자(1~12)를 적으면 그 달의 양식을 고정해 보여 주고, null 이면 한국 시간 기준 현재 달을 따라갑니다. */
export const FEATURED_MONTH: number | null = 12;
export const homeMonth = (now = new Date()) => FEATURED_MONTH ?? currentMonthKST(now);
