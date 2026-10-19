"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NavGroup } from "@/config/nav";

// 상단 삼선(햄버거) 메뉴 — 누르면 항목 묶음이 나오고, 묶음 제목을 누르면 그 안의 메뉴가 펼쳐집니다.
// 닫히는 경우: 삼선 다시 누르기 · 바깥 누르기 · Esc · 링크 선택 · 페이지 이동 · Tab 으로 메뉴 밖으로 나가기
export function NavMenu({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    setOpenGroup(null);
    if (returnFocus) button.current?.focus();
  }, []);

  useEffect(() => { close(); }, [pathname, close]); // 페이지가 바뀌면 닫기

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(true); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open, close]);

  const bar = "block h-0.5 w-5 rounded-full bg-ink transition duration-200 motion-reduce:transition-none";

  return (
    <div ref={root} className="relative" onBlur={(e) => { const next = e.relatedTarget as Node | null; if (open && next && !root.current?.contains(next)) close(); }}>
      <button ref={button} type="button" aria-expanded={open} aria-controls="site-menu" aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        onClick={() => (open ? close() : setOpen(true))}
        className="flex h-11 w-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-lg bg-paper-gray hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
        <span aria-hidden="true" className={`${bar} ${open ? "translate-y-[7px] rotate-45" : ""}`} />
        <span aria-hidden="true" className={`${bar} ${open ? "opacity-0" : ""}`} />
        <span aria-hidden="true" className={`${bar} ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
      </button>
      {open && (
        <div id="site-menu" className="absolute right-0 z-50 mt-2 max-h-[calc(100dvh-5.5rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-ink/10 bg-paper p-2 shadow-xl">
          <ul className="space-y-1">
            {groups.map((g) => {
              const expanded = openGroup === g.id;
              return (
                <li key={g.id} className="rounded-xl">
                  <button type="button" aria-expanded={expanded} aria-controls={`nav-${g.id}`} onClick={() => setOpenGroup(expanded ? null : g.id)}
                    className={`flex min-h-[48px] w-full items-center justify-between rounded-xl px-3 text-left text-base font-bold text-ink hover:bg-paper-gray ${expanded ? "bg-brand-soft/60" : ""}`}>
                    {g.title}
                    <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 text-ink-sub transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 5 5 5-5" /></svg>
                  </button>
                  {expanded && (
                    <ul id={`nav-${g.id}`} className="mb-1 mt-1 space-y-0.5 pl-2">
                      {g.items.map((it) => (
                        <li key={it.href}>
                          <Link href={it.href} onClick={() => close()} aria-current={pathname === it.href ? "page" : undefined}
                            className={`block rounded-lg px-3 py-2.5 text-[15px] text-ink hover:bg-paper-gray ${pathname === it.href ? "font-bold text-brand-deep" : ""}`}>
                            {it.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
