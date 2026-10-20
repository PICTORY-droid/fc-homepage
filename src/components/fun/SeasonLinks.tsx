import Link from "next/link";

export interface SeasonLink { slug: string; label: string; count: number; href: string; group?: "season" | "theme" }

const GROUPS: { key: "season" | "theme"; label: string }[] = [{ key: "season", label: "계절" }, { key: "theme", label: "주제" }];

// 편지지 상세페이지 사이를 오가는 메뉴 — 계절 / 주제 두 줄로 나누어 같은 크기의 칸으로 가지런히 보여 줍니다. 지금 보는 곳은 진하게 표시해요.
export function SeasonLinks({ items, current }: { items: SeasonLink[]; current?: string }) {
  const grouped = GROUPS.map((g) => ({ ...g, list: items.filter((s) => (s.group ?? "season") === g.key) })).filter((g) => g.list.length > 0);
  return (
    <nav aria-label="편지지 모음 선택" className="space-y-3">
      {grouped.map((g) => (
        <div key={g.key} className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <span className="w-12 shrink-0 pt-3 text-sm font-bold text-ink-sub">{g.label}</span>
          <div className={`grid flex-1 gap-2 ${g.list.length <= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"}`}>
            {g.list.map((s) => (
              <Link key={s.slug} href={s.href} aria-current={s.slug === current ? "page" : undefined}
                className={`flex min-h-[44px] flex-col items-center justify-center rounded-xl border px-2 py-1 text-center text-sm font-bold leading-tight ${s.slug === current ? "border-brand bg-brand text-ink" : "border-ink/25 bg-paper text-ink hover:bg-paper-gray"}`}>
                {s.label}<span className="text-xs font-semibold opacity-70">{s.count}종</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
