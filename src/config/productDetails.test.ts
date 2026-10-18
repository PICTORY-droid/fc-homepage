import { describe, expect, it } from "vitest";
import { products } from "./products";
import { getProductDetail } from "./productDetails";

describe("productDetails", () => {
  it("모든 상품에 상세 데이터가 있다", () => {
    for (const p of products) expect(getProductDetail(p.id), p.id).toBeDefined();
  });
  it("표의 모든 행이 머리글과 열 수가 같다", () => {
    for (const p of products) {
      for (const t of getProductDetail(p.id)!.tables) {
        for (const r of t.rows) expect(r.length, `${p.id} ${t.title}`).toBe(t.head.length);
      }
    }
  });
  it("근거 문서명과 핵심 정보 또는 표가 있다", () => {
    for (const p of products) {
      const d = getProductDetail(p.id)!;
      expect(d.docName.length).toBeGreaterThan(0);
      expect(d.facts.length + d.tables.length).toBeGreaterThan(0);
    }
  });
});
