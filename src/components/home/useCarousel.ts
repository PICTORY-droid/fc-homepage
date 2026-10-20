"use client";
// 자동 넘김·일시정지·스와이프 로직 — 화면(HeroCarousel)과 분리했습니다.
import { useCallback, useEffect, useRef, useState } from "react";

export function useCarousel(count: number, intervalMs: number) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // 사용자가 직접 멈춤
  const [hover, setHover] = useState(false); // 마우스·키보드 포커스 중 잠시 멈춤
  const [reduced, setReduced] = useState(true); // '동작 줄이기' 사용자는 자동 넘김 없음(시작은 안전하게 true)
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  const running = !paused && !hover && !reduced && count > 1;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(next, intervalMs);
    return () => window.clearTimeout(t);
  }, [running, index, next, intervalMs]);

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      touchX.current = null;
      if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
    },
  };

  return { index, go, next, prev, paused, setPaused, setHover, running, reduced, swipe };
}
