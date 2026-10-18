import { describe, expect, it } from "vitest";
import { buildDetailPayload, summarizeDetail } from "./detailOptions";
import { consultSchema } from "./schema";

const base = { name: "홍길동", phone: "010-1234-5678", age: "40", topic: "other", time: "anytime", consent: true, website: "" };

describe("상세 문진", () => {
  it("건강 항목은 동의가 없으면 저장 묶음에서 빠진다", () => {
    const p = buildDetailPayload({ hasInsurance: "yes", insuranceKinds: ["cancer"], surgery: "yes", surgeryNote: "맹장", healthConsent: false });
    expect(p).toEqual({ hasInsurance: "yes", insuranceKinds: ["cancer"] });
  });
  it("동의가 있으면 요약에 건강 항목이 포함된다", () => {
    const p = buildDetailPayload({ surgery: "yes", surgeryNote: "맹장", familyHistory: ["cancer"], healthConsent: true });
    expect(summarizeDetail(p).join("\n")).toContain("가족력: 암");
  });
  it("비어 있으면 null", () => expect(buildDetailPayload({})).toBeNull());
  it("스키마: 동의 없이 건강 입력 시 거부", () => {
    expect(consultSchema.safeParse({ ...base, surgery: "yes" }).success).toBe(false);
    expect(consultSchema.safeParse({ ...base, surgery: "yes", healthConsent: true }).success).toBe(true);
    expect(consultSchema.safeParse(base).success).toBe(true);
  });
  it("스키마: 허용되지 않은 값 거부", () => {
    expect(consultSchema.safeParse({ ...base, hasInsurance: "maybe" }).success).toBe(false);
  });
});
