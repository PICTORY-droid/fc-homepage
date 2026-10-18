import { describe, expect, it } from "vitest";
import { productsForTopics, recommendFromDetail, recommendTopics } from "./recommend";

describe("보장 찾기 결과", () => {
  it("걱정에 맞는 분야를 돌려준다", () => {
    expect(recommendTopics({ who: "self", ageBand: "adult", concern: "pension" })).toEqual(["pension"]);
  });
  it("자녀의 건강 걱정은 어린이 분야를 먼저 보여준다", () => {
    expect(recommendTopics({ who: "child", ageBand: "kid", concern: "disease" })).toEqual(["kids", "health"]);
  });
  it("부모님의 병원비 걱정은 시니어 분야를 덧붙인다", () => {
    expect(recommendTopics({ who: "parent", ageBand: "senior", concern: "hospital" })).toEqual(["health", "senior"]);
  });
  it("분야에 해당하는 상품을 최대 개수까지 돌려준다", () => {
    const r = productsForTopics(["health", "senior"], 3);
    expect(r.length).toBeLessThanOrEqual(3);
    expect(r.length).toBeGreaterThan(0);
  });

  describe("'잘 모르겠어요' 추가 문항 결과", () => {
    it("아무것도 답하지 않아도 기본 상품을 보여준다", () => {
      const r = recommendFromDetail({});
      expect(r.products.map((p) => p.id)).toEqual(["P002", "P020"]);
      expect(r.reasons).toEqual([]);
    });
    it("수술·치료 이력이 있으면 간편 고지 상품을 먼저 보여준다", () => {
      const r = recommendFromDetail({ surgery: "yes" });
      expect(r.products[0].id).toBe("P021");
      expect(r.reasons[0]).toContain("간편하게 고지");
    });
    it("가족력에 따라 관련 상품이 앞에 온다", () => {
      expect(recommendFromDetail({ familyHistory: ["cancer"] }).products[0].id).toBe("P007");
      expect(recommendFromDetail({ familyHistory: ["brain", "heart"] }).products.map((p) => p.id)).toContain("P003");
    });
    it("가족력 '없음·모름'은 이유를 만들지 않고, 결과는 최대 3개", () => {
      const r = recommendFromDetail({ familyHistory: ["none"], hasInsurance: "no", surgery: "yes" });
      expect(r.products.length).toBeLessThanOrEqual(3);
      expect(r.reasons.some((x) => x.includes("가족력"))).toBe(false);
    });
  });
});
