import { describe, expect, it } from "vitest";
import { STEPS, errorsForStep, firstStepWithError } from "./steps";

describe("상담 신청 단계", () => {
  it("3단계이고 모든 입력 항목이 한 번씩만 배정된다", () => {
    expect(STEPS).toHaveLength(3);
    const fields = STEPS.flatMap((s) => s.fields);
    expect(new Set(fields).size).toBe(fields.length);
  });
  it("가장 앞선 오류 단계를 찾는다", () => {
    expect(firstStepWithError({ phone: "오류" })).toBe(2);
    expect(firstStepWithError({ age: "오류", phone: "오류" })).toBe(1);
    expect(firstStepWithError({})).toBe(-1);
  });
  it("해당 단계의 오류만 추린다", () => {
    expect(errorsForStep({ age: "a", phone: "b" }, 1)).toEqual({ age: "a" });
  });
});
