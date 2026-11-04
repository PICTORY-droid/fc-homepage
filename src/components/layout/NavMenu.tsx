"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NavGroup } from "@/config/nav";
import { Chevron } from "@/components/ui/Chevron";
import { focusRing } from "@/components/ui/styles";

// 상단 삼선(햄버거) 메뉴 — 누르면 항목 묶음이 나오고, 묶음 제목을 누르면 그 안의 메뉴가 펼쳐집니다.
// 닫히는 경우: 삼선 다시 누르기 · 바깥 누르기 · Esc · 링크 선택 · 페이지 이동 · Tab 으로 메뉴 밖으로 나가기
const rowBase = `flex w-full items-center justify-between gap-2 rounded-xl px-3 text-left text-ink transition duration-200 hover:bg-brand-tint ${focusRing}`;
const linkCls = (current: boolean) =>
  `block rounded-lg px-3 py-2.5 text-base transition duration-200 hover:bg-brand-tint ${focusRing} ${current ? "font-bold text-brand-deep" : "text-ink"}`;

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
        className={`flex h-11 w-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xl bg-paper-gray transition duration-200 hover:bg-brand-soft ${focusRing}`}>
        <span aria-hidden="true" className={`${bar} ${open ? "translate-y-[7px] rotate-45" : ""}`} />
        <span aria-hidden="true" className={`${bar} ${open ? "opacity-0" : ""}`} />
        <span aria-hidden="true" className={`${bar} ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
      </button>
      {open && (
        <div id="site-menu" className="absolute right-0 z-50 mt-2 max-h-[calc(100dvh-5.5rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-card border border-ink/10 bg-paper p-2 shadow-xl">
          <ul className="space-y-1">
            {groups.map((g) => {
              const expanded = openGroup === g.id;
              return (
                <li key={g.id}>
                  <button type="button" aria-expanded={expanded} aria-controls={`nav-${g.id}`} onClick={() => setOpenGroup(expanded ? null : g.id)}
                    className={`${rowBase} min-h-[48px] text-base font-bold ${expanded ? "bg-brand-soft/60" : ""}`}>
                    {g.title}
                    <Chevron open={expanded} />
                  </button>
                  {expanded && (
                    <ul id={`nav-${g.id}`} className="mb-1 mt-1 space-y-0.5 pl-2">
                      {g.items.map((it) => (
                        <li key={it.href}>
                          <Link href={it.href} onClick={() => close()} aria-current={pathname === it.href ? "page" : undefined} className={linkCls(pathname === it.href)}>
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
