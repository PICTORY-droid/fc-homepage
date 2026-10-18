import { products, type Product } from "../../config/products";
import type { Concern, Who, AgeBand } from "../../config/finder";
import { CONCERN_TOPICS } from "../../config/finder";

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
