import { describe, expect, it } from "vitest";
import { products, TOPIC_IDS } from "./products";
import { productsByGroup, relatedProducts, getProduct } from "../lib/products";
import { existsSync } from "node:fs";

describe("products", () => {
  it("판매중지 상품은 포함되지 않는다", () => {
    const stopped = ["P029","P032","P033","P036","P037","P038","P039","P040","P047","P048","P049"];
    for (const id of stopped) expect(getProduct(id)).toBeUndefined();
  });
  it("id가 중복되지 않고 모든 상품이 상담 분야에 연결된다", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    for (const p of products) expect(TOPIC_IDS).toContain(p.id);
  });
  it("이미지가 있다고 표시된 상품은 파일이 실제로 존재한다", () => {
    for (const p of products.filter((x) => x.image)) {
      expect(existsSync(`public/products/${p.id}.webp`)).toBe(true);
      expect(existsSync(`public/products/${p.id}-thumb.webp`)).toBe(true);
    }
  });
  it("분류별 묶음의 합이 전체와 같다", () => {
    expect(productsByGroup().reduce((n, g) => n + g.items.length, 0)).toBe(products.length);
  });
  it("관련 상품은 자기 자신을 포함하지 않는다", () => {
    expect(relatedProducts("P001").some((p) => p.id === "P001")).toBe(false);
  });
});
