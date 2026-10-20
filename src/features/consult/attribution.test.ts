import { describe, expect, it } from "vitest";
import { consultSchema } from "./schema";

const base = { name: "홍길동", phone: "010-1234-5678", topic: "health", consent: true, website: "", memo: "보장이 궁금해요" };

describe("상담 신청 유입 정보", () => {
  it("유입 정보가 있으면 그대로 통과한다", () => {
    const r = consultSchema.safeParse({ ...base, attribution: { source: "notion", medium: "note", campaign: "talkpro_41" } });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.attribution?.campaign).toBe("talkpro_41");
  });
  it("유입 정보가 없어도 신청은 통과한다", () => {
    expect(consultSchema.safeParse(base).success).toBe(true);
  });
  it("형식이 틀린 유입 정보는 버리고 신청은 막지 않는다", () => {
    const r = consultSchema.safeParse({ ...base, attribution: { source: "<script>" } });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.attribution).toBeUndefined();
  });
});
