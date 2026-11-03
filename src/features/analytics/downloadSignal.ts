"use client";
// '방금 자료를 받았다'는 신호 — 다운로드 기록(ClickTracker)과 연령대 질문(AgePrompt)을 서로 모르게 이어 줍니다.
const EVENT = "fc:download";

export function emitDownload(label: string): void {
  try { window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: label })); } catch { /* 신호 실패는 무시 */ }
}

/** 구독을 시작하고, 구독을 끝내는 함수를 돌려줍니다. */
export function onDownload(cb: (label: string) => void): () => void {
  const h = (e: Event) => cb((e as CustomEvent<string>).detail ?? "");
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
}
