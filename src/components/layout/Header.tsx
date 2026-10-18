import Link from "next/link";
import { site } from "@/config/site";
import { categories } from "@/config/categories";
import { NavMenu } from "./NavMenu";

// 상단 헤더 — 메뉴 열고 닫기는 NavMenu(클라이언트 컴포넌트)가 담당
export function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/postal-insurance-mark.svg" alt="" width={36} height={39} className="h-9 w-auto shrink-0" />
            <span className="min-w-0">
              <span className="block truncate text-lg font-bold text-ink">{site.brandName}</span>
              {(site.affiliation || site.tagline) && (
                <span className="block truncate text-xs text-ink-sub">
                  {site.affiliation}{site.affiliation && site.tagline ? " · " : ""}{site.tagline}
                </span>
              )}
            </span>
          </Link>
          <nav className="flex shrink-0 items-center gap-2" aria-label="주요 메뉴">
            <NavMenu categories={categories.map((c) => ({ slug: c.slug, title: c.title }))} />
          </nav>
        </div>
      </header>
    </>
  );
}
