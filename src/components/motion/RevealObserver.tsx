"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// 스크롤로 화면에 들어오는 [data-reveal] 요소에 등장 효과를 켜 줍니다.
// - 처음부터 보이는 요소는 그대로 두고(깜빡임 없음), 아래쪽 요소만 숨겼다가 보일 때 나타납니다.
// - JS 가 꺼져 있거나 '동작 줄이기' 설정이면 아무것도 숨기지 않습니다.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.rs = "in";
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    // 스트리밍 중에는 요소가 아직 숨겨져(크기 0) 있을 수 있어, 보일 때까지 잠깐씩 다시 확인합니다.
    let tries = 0;
    let timer = 0;
    const scan = () => {
      let waiting = false;
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-rs])").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) { waiting = true; return; }
        if (r.top < window.innerHeight * 0.92) { el.dataset.rs = "seen"; return; } // 처음부터 보임 → 효과 없이 유지
        el.dataset.rs = "pending";
        io.observe(el);
      });
      if (waiting && tries++ < 20) timer = window.setTimeout(scan, 150);
    };
    const frame = requestAnimationFrame(scan);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(timer); io.disconnect(); };
  }, [pathname]);

  return null;
}
