import type { ConsultInput } from "./schema";

// 상담 신청 3단계 정의 — 단계별로 검증할 입력 항목을 한 곳에서 관리합니다.
export type StepKey = "topic" | "who" | "contact";
export type FieldKey = keyof ConsultInput;

export const STEPS: { key: StepKey; label: string; title: string; fields: FieldKey[] }[] = [
  { key: "topic", label: "분야", title: "어떤 분야가 궁금하세요?", fields: ["topic"] },
  { key: "who", label: "대상", title: "누구를 위한 상담인가요?", fields: ["age", "time"] },
  { key: "contact", label: "연락처", title: "연락드릴 곳을 알려 주세요", fields: ["name", "phone", "consent"] },
];

/** 검증 오류(필드→메시지) 중 가장 앞선 단계의 번호(없으면 -1) */
export function firstStepWithError(errors: Record<string, string>): number {
  return STEPS.findIndex((s) => s.fields.some((f) => Boolean(errors[f])));
}

/** 특정 단계에 해당하는 오류만 추립니다. */
export function errorsForStep(errors: Record<string, string>, step: number): Record<string, string> {
  const fields = STEPS[step]?.fields ?? [];
  return Object.fromEntries(Object.entries(errors).filter(([k, v]) => v && (fields as string[]).includes(k)));
}
