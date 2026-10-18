import { describe, expect, it } from "vitest";
import { products } from "../config/products";
import { filterProducts } from "./productSearch";

const all = { q: "", group: "all", topic: "all" } as const;

describe("상품 검색·필터", () => {
  it("조건이 없으면 전체를 돌려준다", () => expect(filterProducts(products, all)).toHaveLength(products.length));
  it("상품명 일부로 찾는다", () => {
    const r = filterProducts(products, { ...all, q: "치아" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => (p.displayName + (p.slogan?.headline ?? "") + (p.slogan?.tags ?? []).join("")).includes("치아"))).toBe(true);
  });
  it("공백·대소문자는 무시한다", () => {
    expect(filterProducts(products, { ...all, q: " new 건강 " }).map((p) => p.id)).toContain("P002");
  });
  it("분류로 거른다", () => {
    const r = filterProducts(products, { ...all, group: "연금" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.group === "연금")).toBe(true);
  });
  it("결과가 없으면 빈 배열", () => expect(filterProducts(products, { ...all, q: "zzzz없는상품" })).toEqual([]));
});
