import type { ConsultInput } from "./schema";

// 상담 신청 단계 정의 — 단계별로 검증할 입력 항목을 한 곳에서 관리합니다.
// '기타 / 잘 모르겠어요'를 고른 경우에만 '상세' 단계가 추가됩니다.
export type StepKey = "topic" | "who" | "detail" | "contact";
export type FieldKey = keyof ConsultInput;
export type StepDef = { key: StepKey; label: string; title: string; fields: FieldKey[] };

const TOPIC: StepDef = { key: "topic", label: "분야", title: "어떤 분야가 궁금하세요?", fields: ["topic"] };
const WHO: StepDef = { key: "who", label: "대상", title: "누구를 위한 상담인가요?", fields: ["age", "time"] };
const DETAIL: StepDef = {
  key: "detail", label: "상세", title: "조금 더 알려 주시면 정확히 안내드릴 수 있어요",
  fields: ["hasInsurance", "insuranceKinds", "surgery", "surgeryNote", "treatment", "treatmentNote", "familyHistory", "memo", "healthConsent"],
};
const CONTACT: StepDef = { key: "contact", label: "연락처", title: "연락드릴 곳을 알려 주세요", fields: ["name", "phone", "consent"] };

export const needsDetail = (topic: string) => topic === "other";

export function stepsFor(topic: string): StepDef[] {
  return needsDetail(topic) ? [TOPIC, WHO, DETAIL, CONTACT] : [TOPIC, WHO, CONTACT];
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
