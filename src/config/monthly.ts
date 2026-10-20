// 이달의 양식 — 달력 기준으로 지금 계절에 맞는 자료 3가지를 골라 홈에 올립니다. 문구는 달마다 한 줄만 바꾸면 됩니다.
import { getGroup, getItem, entriesBySeason, packThumb, seasonSlug, type Season } from "./pack";
import { seasons, stationeryBySeason, stationeryFile, type SeasonKey } from "./stationery";

export interface MonthlyCard { href: string; title: string; desc: string; thumb?: string; aspect: number }
export interface MonthlyPick { month: number; heading: string; lead: string; cards: MonthlyCard[] }

const SEASON_OF_MONTH: Record<number, { key: SeasonKey; label: Season }> = {
  1: { key: "winter", label: "겨울" }, 2: { key: "winter", label: "겨울" }, 3: { key: "spring", label: "봄" }, 4: { key: "spring", label: "봄" }, 5: { key: "spring", label: "봄" },
  6: { key: "summer", label: "여름" }, 7: { key: "summer", label: "여름" }, 8: { key: "summer", label: "여름" }, 9: { key: "autumn", label: "가을" }, 10: { key: "autumn", label: "가을" }, 11: { key: "autumn", label: "가을" },
  12: { key: "winter", label: "겨울" },
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
  return { href: `/fun/${g.slug}/${it.key}/${seasonSlug[season]}`, title: `${season} ${it.title}`, desc: "", thumb: first ? packThumb(it, first.no) : undefined, aspect: it.aspect ?? 1 };
};

export function monthlyPick(month: number): MonthlyPick {
  const m = ((month - 1) % 12 + 12) % 12 + 1;
  const { key, label } = SEASON_OF_MONTH[m];
  const season = seasons.find((s) => s.key === key);
  const letter = stationeryBySeason(key)[0];
  const cards: MonthlyCard[] = [
    { href: `/fun/stationery/${key}`, title: `${label} 편지지`, desc: season?.lead ?? "", thumb: letter ? stationeryFile(letter, "jpg") : undefined, aspect: 794 / 1123 },
    packCard("ppt", "news", label), packCard("excel", "ledger", label),
  ].filter((c): c is MonthlyCard => Boolean(c));
  return { month: m, heading: `${m}월의 양식`, lead: LEAD[m], cards };
}

/** 한국 시간 기준 현재 월 */
export const currentMonthKST = (now = new Date()) => Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", month: "numeric" }).format(now));

/** 홈에 올릴 달 — 숫자(1~12)를 적으면 그 달의 양식을 고정해 보여 주고, null 이면 한국 시간 기준 현재 달을 따라갑니다. */
export const FEATURED_MONTH: number | null = 12;
export const homeMonth = (now = new Date()) => FEATURED_MONTH ?? currentMonthKST(now);
