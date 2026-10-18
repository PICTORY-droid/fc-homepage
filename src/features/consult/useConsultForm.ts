"use client";
import { useState } from "react";
import { formatPhone } from "@/lib/phone";
import { consultSchema, type ConsultInput } from "./schema";
import { submitConsult } from "./api";
import { STEPS, errorsForStep, firstStepWithError } from "./steps";

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

// 폼 상태·단계 이동·검증·제출 로직 (화면 컴포넌트에는 로직을 넣지 않음)
export function useConsultForm(initialTopic: string) {
  const [values, setValues] = useState<ConsultInput>({
    name: "", phone: "", age: "", topic: initialTopic as ConsultInput["topic"], time: "anytime", consent: false as unknown as true, website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const last = STEPS.length - 1;

  const setField = <K extends keyof ConsultInput>(key: K, value: ConsultInput[K]) => {
    setValues((v) => ({ ...v, [key]: normalize(key, value) }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  /** 현재 단계 입력이 올바르면 다음 단계로 이동 */
  function next() {
    const stepErrors = errorsForStep(collectErrors(values), step);
    if (Object.keys(stepErrors).length) { setErrors((e) => ({ ...e, ...stepErrors })); return; }
    setStep((s) => Math.min(s + 1, last));
  }
  const back = () => { setServerMessage(""); setStatus("idle"); setStep((s) => Math.max(s - 1, 0)); };

  async function submit() {
    if (step < last) { next(); return; }
    const all = collectErrors(values);
    if (Object.keys(all).length) {
      setErrors(all);
      const target = firstStepWithError(all);
      if (target >= 0 && target < step) setStep(target); // 앞 단계에 오류가 있으면 그 단계로
      return;
    }
    setStatus("submitting");
    const result = await submitConsult(values);
    if (result.ok) { setStatus("done"); return; }
    setErrors(result.error.fields ?? {});
    setServerMessage(result.error.message);
    setStatus("error");
    const target = firstStepWithError(result.error.fields ?? {});
    if (target >= 0) setStep(target);
  }

  return { values, errors, step, totalSteps: STEPS.length, status, serverMessage, setField, next, back, submit };
}
