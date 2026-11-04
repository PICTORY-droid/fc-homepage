import { describe, expect, it } from "vitest";
import { navGroups } from "./nav";

describe("상단 메뉴 정렬", () => {
  it("그룹은 제목이 짧은 순이다", () => {
    const lens = navGroups.map((g) => g.title.length);
    expect(lens).toEqual([...lens].sort((a, b) => a - b));
  });
  it("그룹 안의 세부 메뉴는 글자 수가 적은 순이다", () => {
    for (const g of navGroups) {
      const lens = g.items.map((i) => i.label.length);
      expect(lens, g.title).toEqual([...lens].sort((a, b) => a - b));
    }
  });
});

describe("메뉴 정리", () => {
  it("'즐길거리 전체 보기'와 '개인정보 처리방침'은 메뉴에 없다", () => {
    const all = navGroups.flatMap((g) => g.items);
    expect(all.some((i) => i.href === "/fun")).toBe(false);
    expect(all.some((i) => i.href === "/privacy")).toBe(false);
  });
});
