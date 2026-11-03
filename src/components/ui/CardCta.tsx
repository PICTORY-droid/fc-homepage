import type { ReactNode } from "react";
import { cardCtaClass } from "./styles";

// 이동 카드 맨 아래 '…보기 →' — 카드에 마우스를 올리면 화살표가 살짝 움직입니다. (카드 쪽에 group 클래스가 있어야 함)
// className 으로 위쪽 여백만 바꿀 수 있습니다(기본 mt-2).
export function CardCta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block ${cardCtaClass} ${className}`}>
      {children} <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
    </span>
  );
}
