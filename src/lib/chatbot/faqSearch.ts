import type { OfficialFaq } from "../../config/officialFaq";

// 공식 자주하는 질문 검색 — 화면과 무관한 순수 함수.
// 글자 두 개씩 끊어(bigram) 입력과 질문을 견주기 때문에 띄어쓰기·조사가 달라도 찾을 수 있습니다.
export const normFaq = (s: string) => s.toLowerCase().replace(/[^0-9a-z가-힣]/g, "");

function bigrams(s: string): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
}

export interface FaqHit { item: OfficialFaq; score: number; coverage: number }

export interface FaqIndex { item: OfficialFaq; norm: string; grams: Set<string> }

export const buildFaqIndex = (list: OfficialFaq[]): FaqIndex[] =>
  list.map((item) => { const norm = normFaq(item.question); return { item, norm, grams: bigrams(norm) }; });

/** 입력의 글자쌍 — 띄어쓰기로 나뉜 낱말 안에서만 만듭니다 (낱말 사이를 잇는 글자쌍은 제외) */
export function queryGrams(input: string): Set<string> {
  const out = new Set<string>();
  input.split(/\s+/).forEach((tok) => bigrams(normFaq(tok)).forEach((g) => out.add(g)));
  return out;
}

/** 입력과 가까운 질문을 점수 순으로 돌려줍니다. (입력이 너무 짧으면 빈 배열) */
export function searchFaq(index: FaqIndex[], input: string, limit = 5): FaqHit[] {
  const q = normFaq(input);
  const qg = queryGrams(input);
  if (qg.size === 0) return [];
  const hits: FaqHit[] = [];
  for (const e of index) {
    let common = 0;
    qg.forEach((g) => { if (e.grams.has(g)) common++; });
    if (common === 0) continue;
    const coverage = common / qg.size; // 입력 글자가 질문에 얼마나 들어 있나
    const dice = (2 * common) / (qg.size + e.grams.size); // 질문과 입력이 얼마나 닮았나
    const exact = e.norm === q ? 1 : 0;
    hits.push({ item: e.item, coverage, score: Math.min(1, 0.7 * coverage + 0.3 * dice + exact) });
  }
  return hits.sort((a, b) => b.score - a.score || a.item.question.length - b.item.question.length).slice(0, limit);
}

/** 한 가지 답으로 바로 보여줘도 될 만큼 확실한가 */
export function isDecisive(hits: FaqHit[], input: string): boolean {
  if (hits.length === 0) return false;
  const q = normFaq(input);
  if (hits[0].item && normFaq(hits[0].item.question) === q) return true;
  if (queryGrams(input).size < 3) return false; // 너무 짧은 입력은 목록으로
  const second = hits[1]?.score ?? 0;
  return hits[0].coverage >= 0.8 && hits[0].score - second >= 0.08;
}
