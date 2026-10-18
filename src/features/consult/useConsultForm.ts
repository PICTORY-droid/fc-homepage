"use client";
import { useState } from "react";
import { formatPhone } from "@/lib/phone";
import { consultSchema, type ConsultInput } from "./schema";
import { submitConsult } from "./api";

export type FormStatus = "idle" | "submitting" | "done" | "error";

// 폼 상태·검증·제출 로직 (화면 컴포넌트에는 로직을 넣지 않음)
export function useConsultForm(initialTopic: string) {
  const [values, setValues] = useState<ConsultInput>({
    name: "", phone: "", topic: initialTopic as ConsultInput["topic"], time: "anytime", consent: false as unknown as true, website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const setField = <K extends keyof ConsultInput>(key: K, value: ConsultInput[K]) => {
    setValues((v) => ({ ...v, [key]: key === "phone" ? (formatPhone(String(value)) as ConsultInput[K]) : value }));
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
