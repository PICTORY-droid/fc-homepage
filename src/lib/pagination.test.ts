import { describe, expect, it } from "vitest";
import { paginate, pageWindow, parsePage } from "./pagination";

const list = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

describe("parsePage", () => {
  it("정상 값은 그대로, 이상한 값은 1", () => {
    expect(parsePage("3")).toBe(3);
    expect(parsePage(["2", "5"])).toBe(2);
    for (const bad of [undefined, "", "0", "-1", "1.5", "abc", "NaN"]) expect(parsePage(bad)).toBe(1);
  });
});

describe("paginate", () => {
  it("10개씩 자르고 순번을 계산한다", () => {
    const p = paginate(list(25), 2);
    expect(p.items).toEqual(list(25).slice(10, 20));
    expect(p).toMatchObject({ page: 2, totalPages: 3, total: 25, from: 11, to: 20 });
  });
  it("마지막 쪽은 남은 만큼만", () => {
    expect(paginate(list(25), 3).items).toHaveLength(5);
  });
  it("범위를 벗어난 쪽은 가까운 쪽으로 맞춘다", () => {
    expect(paginate(list(25), 99).page).toBe(3);
    expect(paginate(list(25), 0).page).toBe(1);
  });
  it("빈 목록도 안전하다", () => {
    expect(paginate([], 1)).toMatchObject({ items: [], page: 1, totalPages: 1, total: 0, from: 0, to: 0 });
  });
});

describe("pageWindow", () => {
  it("적으면 전부, 많으면 …으로 줄인다", () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3]);
    expect(pageWindow(1, 20)).toEqual([1, 2, "…", 20]);
    expect(pageWindow(10, 20)).toEqual([1, "…", 9, 10, 11, "…", 20]);
    expect(pageWindow(20, 20)).toEqual([1, "…", 19, 20]);
  });
});
