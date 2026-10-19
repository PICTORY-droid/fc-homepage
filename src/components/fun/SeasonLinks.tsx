import Link from "next/link";

export interface SeasonLink { slug: string; label: string; count: number; href: string }

// 계절 상세페이지 사이를 오가는 알약 모양 메뉴 — 지금 보는 계절은 진하게 표시합니다.
export function SeasonLinks({ items, current }: { items: SeasonLink[]; current?: string }) {
  return (
    <nav aria-label="계절 선택" className="flex flex-wrap gap-2">
      {items.map((s) => (
        <Link key={s.slug} href={s.href} aria-current={s.slug === current ? "page" : undefined}
          className={`flex min-h-[44px] items-center rounded-full border px-5 text-sm font-bold ${s.slug === current ? "border-brand bg-brand text-ink" : "border-ink/25 bg-paper text-ink hover:bg-paper-gray"}`}>
          {s.label} {s.count}종
        </Link>
      ))}
    </nav>
  );
}
