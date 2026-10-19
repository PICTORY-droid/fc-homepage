import { describe, expect, it } from "vitest";
import { subscribeSchema, unsubscribeSchema } from "./schema";

describe("새 양식 알림 입력 규칙", () => {
  const ok = { phone: "010-1234-5678", consent: true, from: "/fun/stationery/spring", website: "" };
  it("정상 입력은 숫자만 남긴다", () => {
    const r = subscribeSchema.safeParse(ok);
    expect(r.success && r.data.phone).toBe("01012345678");
  });
  it("동의 없음·잘못된 번호·이상한 경로·봇 입력은 거부", () => {
    expect(subscribeSchema.safeParse({ ...ok, consent: false }).success).toBe(false);
    expect(subscribeSchema.safeParse({ ...ok, phone: "123" }).success).toBe(false);
    expect(subscribeSchema.safeParse({ ...ok, from: "javascript:alert(1)" }).success).toBe(false);
    expect(subscribeSchema.safeParse({ ...ok, website: "x" }).success).toBe(false);
  });
  it("해지는 연락처만 필요하다", () => {
    expect(unsubscribeSchema.safeParse({ phone: "010-1234-5678", website: "" }).success).toBe(true);
  });
});
