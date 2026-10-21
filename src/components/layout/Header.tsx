import Link from "next/link";
import { Black_Han_Sans } from "next/font/google";
import { site } from "@/config/site";
import { navGroups } from "@/config/nav";
import { NavMenu } from "./NavMenu";
import { ChatCharacter } from "@/components/chatbot/ChatCharacter";

// 로고 글씨체 — 굵은 고딕(공식 로고 느낌). 로고에만 적용
const logoFont = Black_Han_Sans({ weight: "400", subsets: ["latin"], display: "swap", preload: false });

// 상단 헤더 — 메뉴 열고 닫기는 NavMenu(클라이언트 컴포넌트)가 담당
export function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <ChatCharacter className="h-11 w-auto shrink-0 sm:h-14" />
            <span className="min-w-0">
              <span className={`${logoFont.className} flex items-baseline gap-1 whitespace-nowrap`} aria-label={site.brandName}>
                <span className="text-base text-[#9A2F1B] sm:text-xl" aria-hidden="true">{site.brandName.replace(/\s*길잡이$/, "")}</span>
                <span className="text-3xl text-[#E5481F] sm:text-4xl" aria-hidden="true">길잡이</span>
              </span>
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
