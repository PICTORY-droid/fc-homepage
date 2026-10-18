import Link from "next/link";
import { site } from "@/config/site";
import { categories } from "@/config/categories";

// 상단 헤더 — 모바일 메뉴는 JS 없이 <details> 로 동작
export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0">
          <span className="block truncate text-lg font-bold text-ink">{site.fcName}</span>
          <span className="block truncate text-xs text-ink-sub">
            {site.affiliation ? `${site.affiliation} · ` : ""}{site.tagline}
          </span>
        </Link>
        <nav className="flex items-center gap-2" aria-label="주요 메뉴">
          <details className="group relative">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center rounded-lg bg-paper-gray px-4 text-sm font-semibold text-ink">
              상담 분야
            </summary>
            <ul className="absolute right-0 mt-2 w-56 rounded-xl border border-ink/10 bg-paper p-2 shadow-lg">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/c/${c.slug}`} className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-paper-gray">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
          <a
            href={`tel:${site.contact.fcPhone}`}
            className="flex min-h-[44px] items-center rounded-lg bg-brand px-4 text-sm font-semibold text-ink"
          >
            전화 상담
          </a>
        </nav>
      </div>
    </header>
  );
}
