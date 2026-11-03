import Link from "next/link";

export interface PillLink { key: string; label: string; href: string }

// 알약 모양 바로가기 줄 — 엑셀 서식의 분야·계절 고르기에 씁니다. 지금 보는 곳은 진하게 표시해요. (표시만 담당)
export function PillNav({ label, items, current, className = "mb-6" }: { label: string; items: PillLink[]; current?: string; className?: string }) {
  return (
    <nav aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((x) => (
        <Link key={x.key} href={x.href} aria-current={x.key === current ? "page" : undefined}
          className={`flex min-h-[44px] items-center rounded-full border px-4 text-sm font-bold ${x.key === current ? "border-ink bg-ink text-paper" : "border-ink/25 bg-paper text-ink hover:bg-paper-gray"}`}>
          {x.label}
        </Link>
      ))}
    </nav>
  );
}
