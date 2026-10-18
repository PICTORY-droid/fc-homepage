import { describe, expect, it } from "vitest";
import { MAX_COMPARE, buildFactRows, parseCompareIds } from "./compare";

describe("상품 비교", () => {
  it("유효한 id 만 남기고 중복·소문자·공백을 정리한다", () => {
    expect(parseCompareIds(" p001, P003 ,P001,X999,hello").map((p) => p.id)).toEqual(["P001", "P003"]);
  });
  it(`최대 ${MAX_COMPARE}개까지만`, () => {
    expect(parseCompareIds("P001,P002,P003,P004,P005")).toHaveLength(MAX_COMPARE);
  });
  it("값이 없거나 배열이어도 안전하다", () => {
    expect(parseCompareIds(undefined)).toEqual([]);
    expect(parseCompareIds(["P001", "P002"])).toHaveLength(2);
  });
  it("항목 이름을 합치고 없는 값은 — 로 채운다", () => {
    const rows = buildFactRows(parseCompareIds("P001,P021"));
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) expect(r.values).toHaveLength(2);
    expect(rows.some((r) => r.values.includes("—"))).toBe(true);
  });
});
