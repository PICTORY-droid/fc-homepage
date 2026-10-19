import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/rateLimit";
import { eventSchema } from "./events";

describe("이용 통계 이벤트 검증", () => {
  it("올바른 이벤트는 통과한다", () => {
    expect(eventSchema.safeParse({ name: "download", path: "/fun/forms/it-backend", label: "이력서_백엔드개발자_1_정석형.docx", source: "kakao", refHost: "m.search.naver.com" }).success).toBe(true);
    expect(eventSchema.safeParse({ name: "consult_done", path: "/consult" }).success).toBe(true);
  });
  it("목록에 없는 이름·잘못된 경로·스크립트 문자는 거부한다", () => {
    expect(eventSchema.safeParse({ name: "hack", path: "/" }).success).toBe(false);
    expect(eventSchema.safeParse({ name: "download", path: "https://evil.com" }).success).toBe(false);
    expect(eventSchema.safeParse({ name: "download", path: "/x", label: "<script>" }).success).toBe(false);
    expect(eventSchema.safeParse({ name: "download", path: "/x", source: "a b" }).success).toBe(false);
  });
});

describe("요청 제한기", () => {
  it("한도를 넘으면 막고, 시간이 지나면 풀린다", () => {
    const limited = createRateLimiter(3, 1000);
    expect([1, 2, 3].map(() => limited("ip", 0))).toEqual([false, false, false]);
    expect(limited("ip", 10)).toBe(true);
    expect(limited("ip", 2000)).toBe(false);
    expect(limited("other", 10)).toBe(false);
  });
});
