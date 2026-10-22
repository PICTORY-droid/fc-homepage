import { describe, expect, it } from "vitest";
import { FEATURED_MONTH, currentMonthKST, homeMonth, monthlyPick } from "./monthly";

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
  it("홈에는 12월의 양식(겨울 자료)이 올라간다", () => {
    expect(FEATURED_MONTH).toBe(12);
    expect(homeMonth(new Date("2026-10-20T00:00:00Z"))).toBe(12);
    const p = monthlyPick(homeMonth());
    expect(p.heading).toBe("12월의 양식");
    expect(p.cards.map((c) => c.title)).toEqual(["포근빛 편지지", "포근빛 카드뉴스", "포근빛 가계부"]);
  });
});
