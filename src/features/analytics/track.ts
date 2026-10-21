"use client";
import type { EventName } from "./events";
import { readAttribution } from "./attribution";

// 브라우저에서 이벤트 한 건을 보냅니다. 실패해도 화면에는 아무 영향이 없습니다(최선 노력).
// 관리자가 /admin 에 한 번 로그인한 브라우저는 NO_TRACK_KEY 가 저장되어, 본인 방문·클릭이 통계에 섞이지 않습니다.
export const NO_TRACK_KEY = "fc_no_track";

export const isTrackingOff = (): boolean => {
  try { return localStorage.getItem(NO_TRACK_KEY) === "1"; } catch { return false; }
};

/** 첫 화면에서 한 번 불러 두면, 이후 어느 페이지에서 눌러도 첫 유입 경로가 기록됩니다. */
export const captureAttribution = () => { readAttribution(); };

export function track(name: EventName, label?: string): void {
  try {
    if (isTrackingOff() || location.pathname.startsWith("/admin")) return;
    const body = JSON.stringify({ name, path: location.pathname, label: label?.slice(0, 100), ...readAttribution() });
    void fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  } catch { /* 통계 실패는 무시 */ }
}
