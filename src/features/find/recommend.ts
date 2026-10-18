import { products, type Product } from "../../config/products";
import type { Concern, Who, AgeBand } from "../../config/finder";
import { CONCERN_TOPICS } from "../../config/finder";
import { DETAIL_FALLBACK_IDS, DETAIL_PRODUCT_RULES } from "../../config/finderDetail";
import type { FamilyHistory, InsuranceKind, YesNo } from "../consult/detailOptions";

// '보장 찾기' 문답 결과 계산 — 화면과 무관한 순수 함수
// 결과는 '권유'가 아니라 선택한 내용과 관련된 상담 분야/상품을 보여주는 용도입니다.
export type FinderAnswers = { who: Who; ageBand: AgeBand; concern: Concern };

export function recommendTopics(a: FinderAnswers): string[] {
  const topics: string[] = [...CONCERN_TOPICS[a.concern]];
  if (a.concern === "disease" || a.concern === "hospital") {
    if (a.who === "child" || a.ageBand === "kid") topics.unshift("kids");
    if (a.who === "parent" || a.ageBand === "senior") topics.push("senior");
  }
  if (a.concern === "saving" && (a.who === "child" || a.ageBand === "kid")) topics.unshift("saving");
  return [...new Set(topics)];
}

export function productsForTopics(topics: string[], limit = 3): Product[] {
  const out: Product[] = [];
  for (const t of topics) for (const p of products) if (p.topic === t && !out.includes(p)) out.push(p);
  return out.slice(0, limit);
}

// '잘 모르겠어요' 추가 문항 답변 — 모두 선택 입력이며, 이 화면의 답변은 서버로 보내지 않습니다.
export type DetailAnswers = {
  hasInsurance?: YesNo;
  insuranceKinds?: InsuranceKind[];
  surgery?: YesNo;
  treatment?: YesNo;
  familyHistory?: FamilyHistory[];
};
export type DetailResult = { products: Product[]; topics: string[]; reasons: string[] };

/** 추가 문항 답변에 따라 함께 살펴볼 상품과 그 이유를 돌려줍니다. (가입을 권유하는 것이 아니라 살펴볼 상품 안내) */
export function recommendFromDetail(d: DetailAnswers, limit = 3): DetailResult {
  const ids: string[] = [];
  const reasons: string[] = [];
  const add = (rule: { ids: readonly string[]; reason: string }) => { ids.push(...rule.ids); reasons.push(rule.reason); };

  if (d.surgery === "yes" || d.treatment === "yes") add(DETAIL_PRODUCT_RULES.history);
  const seenReason = new Set<string>();
  for (const f of d.familyHistory ?? []) {
    if (f === "none" || f === "unknown") continue;
    const rule = DETAIL_PRODUCT_RULES.family[f];
    if (rule && !seenReason.has(rule.reason)) { seenReason.add(rule.reason); add(rule); }
  }
  if (d.hasInsurance) add(DETAIL_PRODUCT_RULES.insurance[d.hasInsurance]);
  ids.push(...DETAIL_FALLBACK_IDS);

  const picked = [...new Set(ids)].map((id) => products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p)).slice(0, limit);
  return { products: picked, topics: [...new Set(picked.map((p) => p.topic as string))], reasons };
}
