import { describe, expect, it } from "vitest";
import { templateRequestSchema } from "./schema";

const ok = { request: "이사 체크리스트 PPT가 있으면 좋겠어요", from: "/fun/ppt/talk", website: "" };

describe("템플릿 요청 검증", () => {
  it("정상 입력을 통과시킨다", () => expect(templateRequestSchema.safeParse(ok).success).toBe(true));
  it("너무 짧거나 비어 있으면 거절한다", () => {
    expect(templateRequestSchema.safeParse({ ...ok, request: " " }).success).toBe(false);
    expect(templateRequestSchema.safeParse({ ...ok, request: "가" }).success).toBe(false);
  });
  it("500자를 넘으면 거절한다", () => expect(templateRequestSchema.safeParse({ ...ok, request: "가".repeat(501) }).success).toBe(false));
  it("숨김 필드가 채워져 있으면(봇) 거절한다", () => expect(templateRequestSchema.safeParse({ ...ok, website: "x" }).success).toBe(false));
  it("이상한 경로는 거절한다", () => expect(templateRequestSchema.safeParse({ ...ok, from: "http://evil" }).success).toBe(false));
});
