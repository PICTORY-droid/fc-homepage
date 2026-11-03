"use client";
// 연령대 질문 상태 — 자료를 처음 받은 순간 한 번만 묻고, 답하거나 건너뛰면 이 브라우저에서는 다시 묻지 않습니다. (화면은 AgePrompt)
import { useCallback, useEffect, useRef, useState } from "react";
import { encodeAgeLabel } from "./ageBand";
import { onDownload } from "./downloadSignal";
import { isTrackingOff, track } from "./track";

export const AGE_ASKED_KEY = "fc_age_asked";
export type AgePromptState = "hidden" | "asking" | "thanks";

const wasAsked = (): boolean => {
  try { return localStorage.getItem(AGE_ASKED_KEY) === "1"; } catch { return false; }
};
const markAsked = () => {
  try { localStorage.setItem(AGE_ASKED_KEY, "1"); } catch { /* 저장소를 못 쓰면 이 화면에서만 다시 묻지 않음 */ }
};

export function useAgePrompt() {
  const [state, setState] = useState<AgePromptState>("hidden");
  const lastDownload = useRef("");
  const askedThisPage = useRef(false);

  useEffect(() => onDownload((label) => {
    if (askedThisPage.current || wasAsked() || isTrackingOff()) return;
    askedThisPage.current = true;
    lastDownload.current = label;
    setState("asking");
  }), []);

  useEffect(() => {
    if (state !== "thanks") return;
    const t = window.setTimeout(() => setState("hidden"), 1800);
    return () => window.clearTimeout(t);
  }, [state]);

  const choose = useCallback((band: string) => {
    const label = encodeAgeLabel(band, lastDownload.current);
    if (label) track("age_band", label);
    markAsked();
    setState("thanks");
  }, []);

  const skip = useCallback(() => { markAsked(); setState("hidden"); }, []);

  return { state, choose, skip };
}
