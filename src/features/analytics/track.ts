"use client";
import type { EventName } from "./events";
import { readAttribution } from "./attribution";

// 브라우저에서 이벤트 한 건을 보냅니다. 실패해도 화면에는 아무 영향이 없습니다(최선 노력).

/** 첫 화면에서 한 번 불러 두면, 이후 어느 페이지에서 눌러도 첫 유입 경로가 기록됩니다. */
export const captureAttribution = () => { readAttribution(); };

export function track(name: EventName, label?: string): void {
  try {
    const body = JSON.stringify({ name, path: location.pathname, label: label?.slice(0, 100), ...readAttribution() });
    void fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  } catch { /* 통계 실패는 무시 */ }
}
