"use client";
import { useState } from "react";
import { formatPhone } from "@/lib/phone";
import { consultSchema, type ConsultInput } from "./schema";
import { submitConsult } from "./api";

const normalize = <K extends keyof ConsultInput>(key: K, value: ConsultInput[K]): ConsultInput[K] => {
  if (key === "phone") return formatPhone(String(value)) as ConsultInput[K];
  if (key === "age") return String(value).replace(/\D/g, "").slice(0, 3) as ConsultInput[K]; // 숫자만, 최대 3자리
  return value;
};

export type FormStatus = "idle" | "submitting" | "done" | "error";

// 폼 상태·검증·제출 로직 (화면 컴포넌트에는 로직을 넣지 않음)
export function useConsultForm(initialTopic: string) {
  const [values, setValues] = useState<ConsultInput>({
    name: "", phone: "", age: "", topic: initialTopic as ConsultInput["topic"], time: "anytime", consent: false as unknown as true, website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const setField = <K extends keyof ConsultInput>(key: K, value: ConsultInput[K]) => {
    setValues((v) => ({ ...v, [key]: normalize(key, value) }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  async function submit() {
    const parsed = consultSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      return;
    }
    setStatus("submitting");
    const result = await submitConsult(values);
    if (result.ok) { setStatus("done"); return; }
    setErrors(result.error.fields ?? {});
    setServerMessage(result.error.message);
    setStatus("error");
  }

  return { values, errors, status, serverMessage, setField, submit };
}
