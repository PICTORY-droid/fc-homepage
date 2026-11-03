import Link from "next/link";
import { pillClass } from "@/components/ui/styles";

export interface PillLink { key: string; label: string; href: string }

// 알약 모양 바로가기 줄 — 분야·계절·묶음 고르기에 씁니다. 지금 보는 곳은 주황 바탕으로 표시해요. (모양은 ui/styles.ts 의 pillClass)
export function PillNav({ label, items, current, className = "mb-6" }: { label: string; items: PillLink[]; current?: string; className?: string }) {
  return (
    <nav aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((x) => (
        <Link key={x.key} href={x.href} aria-current={x.key === current ? "page" : undefined}
          className={pillClass(x.key === current)}>
          {x.label}
        </Link>
      ))}
    </nav>
  );
}
