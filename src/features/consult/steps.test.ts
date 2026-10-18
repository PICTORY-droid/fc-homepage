import { describe, expect, it } from "vitest";
import { errorsForStep, firstStepWithError, stepsFor } from "./steps";

describe("상담 신청 단계", () => {
  it("일반 분야는 3단계, 기타는 상세 단계가 더해진 4단계", () => {
    expect(stepsFor("health")).toHaveLength(3);
    expect(stepsFor("other").map((s) => s.key)).toEqual(["topic", "who", "detail", "contact"]);
  });
  it("모든 입력 항목이 한 번씩만 배정된다", () => {
    const fields = stepsFor("other").flatMap((s) => s.fields);
    expect(new Set(fields).size).toBe(fields.length);
  });
  it("가장 앞선 오류 단계를 찾는다", () => {
    const s = stepsFor("other");
    expect(firstStepWithError({ phone: "오류" }, s)).toBe(3);
    expect(firstStepWithError({ age: "오류", phone: "오류" }, s)).toBe(1);
    expect(firstStepWithError({ healthConsent: "x" }, s)).toBe(2);
    expect(firstStepWithError({}, s)).toBe(-1);
  });
  it("해당 단계의 오류만 추린다", () => {
    expect(errorsForStep({ age: "a", phone: "b" }, stepsFor("health"), 1)).toEqual({ age: "a" });
  });
});
