"use client";
import { useState } from "react";
import { sendTemplateRequest } from "./api";
import { templateRequestSchema } from "./schema";

export type TemplateRequestStatus = "idle" | "submitting" | "done" | "error";

// 템플릿 요청 폼 상태와 전송 (화면 컴포넌트에는 로직을 넣지 않음)
export function useTemplateRequest(from: string) {
  const [request, setRequestRaw] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<TemplateRequestStatus>("idle");

  const setRequest = (v: string) => { setRequestRaw(v); setError(""); };

  async function submit(): Promise<boolean> {
    const input = { request, from, website };
    const parsed = templateRequestSchema.safeParse(input);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "입력 내용을 확인해 주세요."); return false; }
    setStatus("submitting");
    const result = await sendTemplateRequest(input);
    if (result.ok) { setStatus("done"); return true; }
    setError(result.error.fields ? Object.values(result.error.fields)[0] ?? result.error.message : result.error.message);
    setStatus("error");
    return false;
  }

  return { request, website, error, status, setRequest, setWebsite, submit };
}
