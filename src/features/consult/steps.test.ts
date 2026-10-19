import { describe, expect, it } from "vitest";
import { errorsForStep, firstStepWithError, stepsFor } from "./steps";

describe("상담 신청 단계", () => {
  it("분야 → 신청 2단계로 끝난다", () => {
    expect(stepsFor().map((s) => s.key)).toEqual(["topic", "contact"]);
  });
  it("모든 입력 항목이 한 번씩만 배정된다", () => {
    const fields = stepsFor().flatMap((s) => s.fields);
    expect(new Set(fields).size).toBe(fields.length);
  });
  it("가장 앞선 오류 단계를 찾는다", () => {
    const s = stepsFor();
    expect(firstStepWithError({ phone: "오류" }, s)).toBe(1);
    expect(firstStepWithError({ topic: "오류", phone: "오류" }, s)).toBe(0);
    expect(firstStepWithError({}, s)).toBe(-1);
  });
  it("해당 단계의 오류만 추린다", () => {
    expect(errorsForStep({ topic: "a", phone: "b" }, stepsFor(), 1)).toEqual({ phone: "b" });
  });
});
