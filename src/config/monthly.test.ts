import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FEATURED_MONTH, currentMonthKST, homeMonth, monthlyPick } from "./monthly";

describe("이달의 양식", () => {
  it("12개월 모두 편지지·PPT·엑셀 3장이 실제 페이지로 이어진다", () => {
    for (let m = 1; m <= 12; m++) {
      const p = monthlyPick(m);
      expect(p.cards, `${m}월`).toHaveLength(3);
      expect(p.lead.length).toBeGreaterThan(5);
      for (const c of p.cards) expect(c.href).toMatch(/^\/fun\/(forms|ppt-pro|sheets)\//);
    }
  });
  it("10월은 가을, 12월은 겨울, 3월은 봄", () => {
    expect(monthlyPick(10).cards[2].href).toBe("/fun/sheets/life/ledger/autumn");
    expect(monthlyPick(12).cards[2].href).toBe("/fun/sheets/life/ledger/winter");
    expect(monthlyPick(3).cards[2].href).toBe("/fun/sheets/life/ledger/spring");
  });
  it("한국 시간 기준 월을 돌려준다", () => {
    expect(currentMonthKST(new Date("2026-09-30T16:00:00Z"))).toBe(10); // 한국은 10월 1일 01시
  });
  it("홈에는 12월의 양식(겨울 자료)이 올라간다", () => {
    expect(FEATURED_MONTH).toBe(12);
    expect(homeMonth(new Date("2026-10-20T00:00:00Z"))).toBe(12);
    const p = monthlyPick(homeMonth());
    expect(p.heading).toBe("12월의 양식");
    expect(p.cards.map((c) => c.title).slice(1)).toEqual(["포근빛 발표 템플릿 프리미엄", "포근빛 가계부"]);
    expect(p.cards[0].title).toMatch(/이력서·자기소개서$/); // 편지지 대신 이력서·자기소개서
    expect(p.cards[2].href).toBe("/fun/sheets/life/ledger/winter"); // 가계부는 엑셀 서식의 테마 모음으로 바로 연결
  });
  it("카드에는 설명 문장 없이 제목만, 이력서·자기소개서 카드는 여러 직무 후보 중 무작위", () => {
    const p = monthlyPick(12);
    for (const c of p.cards) expect(c.desc).toBe("");
    const pool = p.cards[0].pool ?? [];
    expect(new Set(pool.map((c) => c.href)).size).toBeGreaterThan(4);
    for (const c of pool) {
      expect(c.href).toMatch(/^\/fun\/forms\/[a-z0-9-]+$/); expect(c.thumbs).toHaveLength(2); expect(new Set(c.thumbs).size).toBe(2);
      for (const t of c.thumbs) { expect(t).toMatch(/^\/fun\/forms\/thumbs\/.+\.jpg$/); expect(existsSync(join(process.cwd(), "public", t)), t).toBe(true); }
    }
  });
});
