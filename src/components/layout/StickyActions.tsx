"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";

const HIDE_ON = ["/consult", "/admin"];

// 모바일 하단 고정 버튼 — 전화 / (설정 시) 카톡 / 상담 신청
export function StickyActions() {
  const pathname = usePathname();
  if (HIDE_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  const btn = "flex min-h-[48px] flex-1 items-center justify-center rounded-xl text-base font-bold";
  return (
    <>
      <div aria-hidden="true" className="h-24 sm:hidden" />
      <nav aria-label="빠른 상담" className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-md gap-2">
          <a href={`tel:${site.contact.fcPhone}`} className={`${btn} border border-ink/30 bg-paper text-ink`}>전화하기</a>
          {site.contact.kakaoUrl && (
            <a href={site.contact.kakaoUrl} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#FEE500] text-ink`}>
              카톡 상담<span className="sr-only"> (새 창으로 열림)</span>
            </a>
          )}
          <Link href="/consult" className={`${btn} bg-brand text-ink`}>상담 신청</Link>
        </div>
      </nav>
    </>
  );
}
