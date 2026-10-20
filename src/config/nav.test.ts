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
