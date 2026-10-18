import type { ReactNode } from "react";

// 글머리(·) 목록 — 문장이 여러 줄이어도 둘째 줄부터 첫 줄 글자 위치에 맞춰 내어쓰기 됩니다.
export function BulletList({ items, className = "" }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden="true" className="shrink-0">·</span>
          <span className="min-w-0 flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}
