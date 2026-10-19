"use client";
import { useMemo, useRef, useState } from "react";
import { track } from "@/features/analytics/track";
import { formatPhone } from "@/lib/phone";
import { consultSchema, type ConsultInput } from "./schema";
import { submitConsult } from "./api";
import { errorsForStep, firstStepWithError, stepsFor } from "./steps";

const normalize = <K extends keyof ConsultInput>(key: K, value: ConsultInput[K]): ConsultInput[K] => {
  if (key === "phone") return formatPhone(String(value)) as ConsultInput[K];
  if (key === "age") return String(value).replace(/\D/g, "").slice(0, 3) as ConsultInput[K]; // 숫자만, 최대 3자리
  return value;
};

export type FormStatus = "idle" | "submitting" | "done" | "error";

function collectErrors(values: ConsultInput): Record<string, string> {
  const parsed = consultSchema.safeParse(values);
  if (parsed.success) return {};
  const next: Record<string, string> = {};
  for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
  return next;
}

// 건강 관련 입력값(동의를 철회하면 함께 지웁니다)
const HEALTH_RESET = { surgery: "", surgeryNote: "", treatment: "", treatmentNote: "", familyHistory: [] } as const;

// 폼 상태·단계 이동·검증·제출 로직 (화면 컴포넌트에는 로직을 넣지 않음)
export function useConsultForm(initialTopic: string) {
  const [values, setValues] = useState<ConsultInput>({
    name: "", phone: "", age: "", topic: initialTopic as ConsultInput["topic"], time: "anytime", consent: false as unknown as true, website: "",
    hasInsurance: "", insuranceKinds: [], surgery: "", surgeryNote: "", treatment: "", treatmentNote: "", familyHistory: [], memo: "", healthConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const steps = useMemo(() => stepsFor(values.topic), [values.topic]);
  const last = steps.length - 1;
  const started = useRef(false);
  const markStarted = () => { if (!started.current) { started.current = true; track("consult_start"); } };

  const setField = <K extends keyof ConsultInput>(key: K, value: ConsultInput[K]) => {
    markStarted();
    setValues((v) => ({ ...v, [key]: normalize(key, value) }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  /** 목록 항목(복수 선택)을 켜고 끕니다. '없음/모름' 같은 배타 항목은 exclusive 로 지정 */
  const toggleInList = (key: "insuranceKinds" | "familyHistory", item: string, exclusive: readonly string[] = []) =>
    setValues((v) => {
      const cur = (v[key] ?? []) as string[];
      let next = cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item];
      if (!cur.includes(item) && exclusive.includes(item)) next = [item];
      else if (!cur.includes(item)) next = next.filter((x) => !exclusive.includes(x));
      return { ...v, [key]: next } as ConsultInput;
    });

  /** 건강 정보 수집 동의 — 동의를 끄면 입력했던 건강 관련 값도 지웁니다. */
  const setHealthConsent = (checked: boolean) => {
    setValues((v) => ({ ...v, healthConsent: checked, ...(checked ? {} : HEALTH_RESET) }) as ConsultInput);
    setErrors((e) => ({ ...e, healthConsent: "" }));
  };

  /** 현재 단계 입력이 올바르면 다음 단계로 이동 */
  function next() {
    const stepErrors = errorsForStep(collectErrors(values), steps, step);
    if (Object.keys(stepErrors).length) { setErrors((e) => ({ ...e, ...stepErrors })); return; }
    setStep((s) => Math.min(s + 1, last));
  }
  const back = () => { setServerMessage(""); setStatus("idle"); setStep((s) => Math.max(s - 1, 0)); };

  async function submit() {
    if (step < last) { next(); return; }
    const all = collectErrors(values);
    if (Object.keys(all).length) {
      setErrors(all);
      const target = firstStepWithError(all, steps);
      if (target >= 0 && target < step) setStep(target); // 앞 단계에 오류가 있으면 그 단계로
      return;
    }
    setStatus("submitting");
    const result = await submitConsult(values);
    if (result.ok) { track("consult_done"); setStatus("done"); return; }
    setErrors(result.error.fields ?? {});
    setServerMessage(result.error.message);
    setStatus("error");
    const target = firstStepWithError(result.error.fields ?? {}, steps);
    if (target >= 0) setStep(target);
  }

  return { values, errors, steps, step, totalSteps: steps.length, status, serverMessage, setField, toggleInList, setHealthConsent, next, back, submit };
}
