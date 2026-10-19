"use client";
import type { EventInput, EventName } from "./events";

// 브라우저에서 이벤트 한 건을 보냅니다. 실패해도 화면에는 아무 영향이 없습니다(최선 노력).
// 유입 정보(utm_*·이전 사이트 주소)는 첫 방문 때 한 번만 탭 임시 저장소(sessionStorage)에 담아 둡니다. 쿠키는 쓰지 않습니다.
type Attribution = Pick<EventInput, "source" | "medium" | "campaign" | "refHost">;
const KEY = "fc_attr";

function readAttribution(): Attribution {
  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as Attribution;
    const q = new URLSearchParams(location.search);
    let refHost = "";
    try { refHost = document.referrer ? new URL(document.referrer).hostname : ""; } catch { /* 무시 */ }
    const a: Attribution = {
      source: q.get("utm_source") ?? undefined, medium: q.get("utm_medium") ?? undefined, campaign: q.get("utm_campaign") ?? undefined,
      refHost: refHost && refHost !== location.hostname ? refHost : undefined,
    };
    sessionStorage.setItem(KEY, JSON.stringify(a));
    return a;
  } catch { return {}; }
}

/** 첫 화면에서 한 번 불러 두면, 이후 어느 페이지에서 눌러도 첫 유입 경로가 기록됩니다. */
export const captureAttribution = () => { readAttribution(); };

export function track(name: EventName, label?: string): void {
  try {
    const body = JSON.stringify({ name, path: location.pathname, label: label?.slice(0, 100), ...readAttribution() });
    void fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  } catch { /* 통계 실패는 무시 */ }
}
