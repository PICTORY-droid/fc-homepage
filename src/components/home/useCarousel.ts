"use client";
// 자동 넘김·일시정지·스와이프 로직 — 화면(HeroCarousel)과 분리했습니다.
import { useCallback, useEffect, useRef, useState } from "react";

export function useCarousel(count: number, intervalMs: number) {
  // 무한 이어붙이기: 화면 위치(pos)는 [마지막 복제, 1…n, 처음 복제] 기준이라 1→n→1 이 한 방향으로 계속 이어집니다.
  const [pos, setPos] = useState(1);
  const [animate, setAnimate] = useState(true);
  const index = (((pos - 1) % count) + count) % count;
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

  const go = useCallback((i: number) => { setAnimate(true); setPos(i + 1); }, []);
  const next = useCallback(() => { setAnimate(true); setPos((p) => Math.min(p + 1, count + 1)); }, [count]);
  const prev = useCallback(() => { setAnimate(true); setPos((p) => Math.max(p - 1, 0)); }, []);

  // 복제 장에 도착하면 효과 없이 진짜 장으로 되돌려 놓습니다. (이동 효과가 없거나 이벤트를 놓쳐도 되돌리도록 안전장치 포함)
  const snap = useCallback(() => {
    setPos((p) => {
      if (p === count + 1 || p === 0) { setAnimate(false); return p === 0 ? count : 1; }
      return p;
    });
  }, [count]);
  useEffect(() => {
    if (pos !== count + 1 && pos !== 0) return;
    const t = window.setTimeout(snap, reduced ? 0 : 900);
    return () => window.clearTimeout(t);
  }, [pos, count, reduced, snap]);

  const running = !paused && !hover && !reduced && count > 1;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(next, intervalMs);
    return () => window.clearTimeout(t);
  }, [running, pos, next, intervalMs]);

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      touchX.current = null;
      if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
    },
  };

  return { index, pos, animate, snap, go, next, prev, paused, setPaused, setHover, running, reduced, swipe };
}
