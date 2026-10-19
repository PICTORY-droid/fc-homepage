import { describe, expect, it } from "vitest";
import { currentMonthKST, monthlyPick } from "./monthly";

describe("이달의 양식", () => {
  it("12개월 모두 편지지·PPT·엑셀 3장이 실제 페이지로 이어진다", () => {
    for (let m = 1; m <= 12; m++) {
      const p = monthlyPick(m);
      expect(p.cards, `${m}월`).toHaveLength(3);
      expect(p.lead.length).toBeGreaterThan(5);
      for (const c of p.cards) expect(c.href).toMatch(/^\/fun\/(stationery|ppt|excel)\//);
    }
  });
  it("10월은 가을, 12월은 겨울, 3월은 봄", () => {
    expect(monthlyPick(10).cards[0].href).toBe("/fun/stationery/autumn");
    expect(monthlyPick(12).cards[0].href).toBe("/fun/stationery/winter");
    expect(monthlyPick(3).cards[0].href).toBe("/fun/stationery/spring");
  });
  it("한국 시간 기준 월을 돌려준다", () => {
    expect(currentMonthKST(new Date("2026-09-30T16:00:00Z"))).toBe(10); // 한국은 10월 1일 01시
  });
});
