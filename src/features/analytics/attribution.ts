import type { EventInput } from "./events";

// 유입 정보(utm_*·이전 사이트 주소) 읽기/보관 — 이벤트 전송과 상담 신청이 같은 값을 씁니다.
// 첫 방문 때 한 번만 탭 임시 저장소(sessionStorage)에 담습니다. 쿠키는 쓰지 않습니다.
export type Attribution = Pick<EventInput, "source" | "medium" | "campaign" | "refHost">;
const KEY = "fc_attr";

export function readAttribution(): Attribution {
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
