import type { ConsultInput } from "./schema";

// 상담 신청 단계 정의 — 단계별로 검증할 입력 항목을 한 곳에서 관리합니다.
// 필수 입력은 이름·연락처·궁금한 점(+동의) 뿐이고, 나머지는 '더 알려 주실 내용(선택)'에 모아 둡니다.
export type StepKey = "topic" | "contact";
export type FieldKey = keyof ConsultInput;
export type StepDef = { key: StepKey; label: string; title: string; fields: FieldKey[] };

const TOPIC: StepDef = { key: "topic", label: "분야", title: "어떤 분야가 궁금하세요?", fields: ["topic"] };
const CONTACT: StepDef = {
  key: "contact", label: "신청", title: "연락드릴 곳과 궁금한 점을 알려 주세요",
  fields: [
    "name", "phone", "memo", "consent",
    "age", "time", "hasInsurance", "insuranceKinds", "surgery", "surgeryNote", "treatment", "treatmentNote", "familyHistory", "healthConsent",
  ],
};

export function stepsFor(): StepDef[] {
  return [TOPIC, CONTACT];
}

/** 검증 오류(필드→메시지) 중 가장 앞선 단계의 번호(없으면 -1) */
export function firstStepWithError(errors: Record<string, string>, steps: StepDef[]): number {
  return steps.findIndex((s) => s.fields.some((f) => Boolean(errors[f])));
}

/** 특정 단계에 해당하는 오류만 추립니다. */
export function errorsForStep(errors: Record<string, string>, steps: StepDef[], step: number): Record<string, string> {
  const fields = steps[step]?.fields ?? [];
  return Object.fromEntries(Object.entries(errors).filter(([k, v]) => v && (fields as string[]).includes(k)));
}
