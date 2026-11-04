"use client";
import { useEffect } from "react";

// 반복 장식 움직임(html[data-anim])은 첫 화면이 다 그려진 뒤에 켭니다. 첫 화면 속도를 위해서예요.
// 켜는 때: 손님이 처음 화면을 만지거나(스크롤·터치·마우스·키보드) 페이지를 다 불러오고 DELAY_MS 가 지났을 때 중 빠른 쪽
const DELAY_MS = 4000;
const EVENTS = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"] as const;

export function MotionStarter() {
  useEffect(() => {
    const root = document.documentElement;
    let t = 0;
    const on = () => {
      root.dataset.anim = "on";
      cleanup();
    };
    const arm = () => { t = window.setTimeout(on, DELAY_MS); };
    function cleanup() {
      window.clearTimeout(t);
      window.removeEventListener("load", arm);
      EVENTS.forEach((e) => window.removeEventListener(e, on));
    }
    EVENTS.forEach((e) => window.addEventListener(e, on, { once: true, passive: true }));
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return cleanup;
  }, []);
  return null;
}
