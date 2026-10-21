import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";
import { navGroups } from "@/config/nav";
import { NavMenu } from "./NavMenu";
import { ChatCharacter } from "@/components/chatbot/ChatCharacter";

// 상단 헤더 — 메뉴 열고 닫기는 NavMenu(클라이언트 컴포넌트)가 담당
export function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <ChatCharacter className="h-10 w-auto shrink-0 sm:h-12" />
            <span className="min-w-0">
              <Image src="/brand/brand-wordmark.png" alt={site.brandName} width={762} height={102} priority className="block h-7 w-auto sm:h-10" />
              {(site.affiliation || site.tagline) && (
                <span className="block truncate text-xs text-ink-sub">
                  {site.affiliation}{site.affiliation && site.tagline ? " · " : ""}{site.tagline}
                </span>
              )}
            </span>
          </Link>
          <nav className="flex shrink-0 items-center gap-2" aria-label="주요 메뉴">
            <NavMenu groups={navGroups} />
          </nav>
        </div>
      </header>
    </>
  );
}
