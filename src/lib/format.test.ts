import { describe, expect, it } from "vitest";
import { formatWon, formatWonKorean } from "./format";

describe("금액 표시", () => {
  it("원 단위 / 만 원 반올림", () => {
    expect(formatWon(1234567)).toBe("1,234,567원");
    expect(formatWonKorean(9_999)).toBe("9,999원");
    expect(formatWonKorean(1_268_250)).toBe("127만 원");
    expect(formatWonKorean(720_000_000)).toBe("7억 2,000만 원");
    expect(formatWonKorean(99_996_000)).toBe("1억 원");
    expect(formatWonKorean(0)).toBe("0원");
  });
});
