import { describe, expect, it } from "vitest";
import { productsForTopics, recommendTopics } from "./recommend";

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
});
