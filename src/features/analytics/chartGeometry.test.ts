import { describe, expect, it } from "vitest";
import { donutSlices, linePoints } from "./chartGeometry";

const PAD = { l: 10, r: 10, t: 10, b: 10 };

describe("linePoints", () => {
  it("최댓값이 맨 위, 0 이 맨 아래에 놓인다", () => {
    const { points, max, peak } = linePoints([0, 5, 10], 120, 60, PAD);
    expect(max).toBe(10);
    expect(peak).toBe(2);
    expect(points[0]).toEqual({ x: 10, y: 50 });
    expect(points[2]).toEqual({ x: 110, y: 10 });
  });
  it("모두 0 이거나 값이 하나여도 깨지지 않는다", () => {
    expect(linePoints([0, 0], 120, 60, PAD).points.every((p) => p.y === 50)).toBe(true);
    expect(linePoints([3], 120, 60, PAD).points[0].x).toBe(60);
    expect(linePoints([], 120, 60, PAD)).toMatchObject({ points: [], peak: -1 });
  });
});

describe("donutSlices", () => {
  it("비율 합이 100 이고 시작 위치가 이어진다", () => {
    const s = donutSlices([{ key: "a", count: 3 }, { key: "b", count: 1 }]);
    expect(s.map((x) => x.pct)).toEqual([75, 25]);
    expect(s[0].offset).toBe(25);
    expect(s[1].offset).toBe(-50);
  });
  it("조각이 많으면 나머지를 기타로 묶는다", () => {
    const rows = Array.from({ length: 9 }, (_, i) => ({ key: `s${i}`, count: 9 - i }));
    const s = donutSlices(rows, 6);
    expect(s).toHaveLength(6);
    expect(s.at(-1)?.key).toBe("기타");
    expect(s.reduce((t, x) => t + x.pct, 0)).toBeCloseTo(100);
  });
  it("0 이하는 빼고, 비면 빈 배열", () => {
    expect(donutSlices([{ key: "a", count: 0 }])).toEqual([]);
    expect(donutSlices([])).toEqual([]);
  });
});
