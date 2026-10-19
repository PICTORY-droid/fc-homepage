import { describe, expect, it } from "vitest";
import { daysLeft, dueCutoff, expiryDate, formatKstDate, isDue } from "./dates";

describe("보관 기간 계산", () => {
  const now = new Date("2026-10-20T00:00:00Z");
  it("접수일로부터 36개월 뒤가 만료일", () => {
    expect(expiryDate("2023-11-10T00:00:00Z", 36).toISOString().slice(0, 10)).toBe("2026-11-10");
  });
  it("만료 30일 전부터 알림 대상, 지난 건도 포함", () => {
    expect(isDue("2023-11-10T00:00:00Z", 36, 30, now)).toBe(true); // 21일 남음
    expect(isDue("2023-12-10T00:00:00Z", 36, 30, now)).toBe(false); // 51일 남음
    expect(isDue("2023-01-01T00:00:00Z", 36, 30, now)).toBe(true); // 이미 지남
  });
  it("남은 일수와 DB 조회 경계가 서로 맞는다", () => {
    expect(daysLeft(expiryDate("2023-11-10T00:00:00Z", 36), now)).toBe(21);
    const cut = dueCutoff(36, 30, now);
    expect(isDue(cut, 36, 30, now)).toBe(true);
    expect(isDue(new Date(cut.getTime() + 2 * 86_400_000), 36, 30, now)).toBe(false);
  });
  it("한국 날짜 표기", () => {
    expect(formatKstDate("2026-10-19T16:26:10Z")).toBe("2026.10.20");
  });
});
