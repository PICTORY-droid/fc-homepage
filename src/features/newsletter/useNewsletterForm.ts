"use client";
import { useState } from "react";
import { formatPhone } from "@/lib/phone";
import { subscribeSchema, unsubscribeSchema } from "./schema";
import { subscribeNewsletter, unsubscribeNewsletter } from "./api";

export type NewsletterStatus = "idle" | "submitting" | "done" | "error";

// 새 양식 알림 신청·해지 폼 상태와 전송 (화면 컴포넌트에는 로직을 넣지 않음)
export function useNewsletterForm(mode: "subscribe" | "unsubscribe", from: string) {
  const [phone, setPhoneRaw] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  const setPhone = (v: string) => { setPhoneRaw(formatPhone(v)); setError(""); };

  async function submit() {
    const input = { phone, consent, from, website };
    const parsed = mode === "subscribe" ? subscribeSchema.safeParse(input) : unsubscribeSchema.safeParse(input);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "입력 내용을 확인해 주세요."); return; }
    setStatus("submitting");
    const result = mode === "subscribe" ? await subscribeNewsletter(input as never) : await unsubscribeNewsletter(input);
    if (result.ok) { setStatus("done"); return; }
    setError(result.error.fields ? Object.values(result.error.fields)[0] ?? result.error.message : result.error.message);
    setStatus("error");
  }

  return { phone, consent, website, error, status, setPhone, setConsent: (v: boolean) => { setConsent(v); setError(""); }, setWebsite, submit };
}
