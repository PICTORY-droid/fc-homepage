"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Item = { slug: string; title: string };

// 상단 '메뉴' 버튼 — 링크를 누르거나 바깥을 누르거나 Esc 를 누르면 닫힙니다.
export function NavMenu({ categories }: { categories: Item[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]); // 페이지가 바뀌면 닫기

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const link = "block rounded-lg px-3 py-3 text-sm text-ink hover:bg-paper-gray";
  const close = () => setOpen(false);

  return (
    <div ref={root} className="relative">
      <button type="button" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((v) => !v)}
        className="flex min-h-[44px] shrink-0 cursor-pointer items-center whitespace-nowrap rounded-lg bg-paper-gray px-3 text-sm font-semibold text-ink">
        메뉴
      </button>
      {open && (
        <ul id="site-menu" className="absolute right-0 mt-2 w-56 rounded-xl border border-ink/10 bg-paper p-2 shadow-lg">
          {categories.map((c) => (
            <li key={c.slug}><Link href={`/c/${c.slug}`} onClick={close} className={link}>{c.title}</Link></li>
          ))}
          <li className="mt-1 border-t border-ink/10 pt-1"><Link href="/products" onClick={close} className={`${link} font-semibold`}>보험 상품 전체</Link></li>
          <li><Link href="/find" onClick={close} className={`${link} font-semibold`}>내게 맞는 보장 찾기</Link></li>
          <li><Link href="/tools" onClick={close} className={`${link} font-semibold`}>간편 계산기</Link></li>
          <li><Link href="/guide" onClick={close} className={`${link} font-semibold`}>이용 안내</Link></li>
        </ul>
      )}
    </div>
  );
}
