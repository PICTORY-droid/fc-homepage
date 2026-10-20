// 한국 전통문화 편지지 500장 — 한복·혼례 / 한옥·마을 / 음식 / 놀이·민속 / 악기·공연 / 공예·생활 / 절기·명절 / 상징·문양 / 역사유산 / 한글·서예
import { palettes, NP, LAYS_SCENE, LAYS_OBJ } from "./designs2.mjs";
import { cultureHeroes } from "./pack3/index.mjs";
import { TA } from "./pack3/text_a.mjs";
import { TB } from "./pack3/text_b.mjs";
const TEXT = { ...TA, ...TB };
export const CULTURE_SUBS = [
  ["hanbok", "한복·혼례", "HANBOK"], ["hanok", "한옥·마을", "HANOK"], ["food", "음식", "KOREAN FOOD"], ["play", "놀이·민속", "FOLK PLAY"],
  ["music", "악기·공연", "MUSIC"], ["craft", "공예·생활", "CRAFT"], ["season", "절기·명절", "SEASONS"], ["symbol", "상징·문양", "SYMBOL"],
  ["heritage", "역사유산", "HERITAGE"], ["hangul", "한글·서예", "HANGUL"],
];
const EYE = Object.fromEntries(CULTURE_SUBS.map(([k, , e]) => [k, e]));
const order = CULTURE_SUBS.map(([k]) => k);
const sorted = [...cultureHeroes].sort((a, b) => order.indexOf(a.sub) - order.indexOf(b.sub));
export const designs3 = sorted.map((h, i) => {
  const [title, tag] = TEXT[h.key];
  const lays = h.scene ? LAYS_SCENE : LAYS_OBJ;
  return { id: `culture-${String(i + 1).padStart(3, "0")}`, season: "culture", sub: h.sub, n: 11 + (700 + i) * 7, title, tag, hero: h.hero, p: palettes[(i * 7 + 29) % NP], layout: lays[(i + 3) % lays.length], scene: h.scene, eyebrow: EYE[h.sub], editTitle: true };
});
const seen = new Set();
for (const d of designs3) { let k = palettes.indexOf(d.p); while (seen.has(d.layout + "|" + k)) k = (k + 1) % NP; seen.add(d.layout + "|" + k); d.p = palettes[k]; }
