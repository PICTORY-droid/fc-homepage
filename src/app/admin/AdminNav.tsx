import Link from "next/link";
import { pillClass } from "@/components/ui/styles";

// 관리자 화면 위쪽 메뉴 — 상담 접수 / 유입 통계
const ITEMS = [{ key: "leads", href: "/admin", label: "상담 접수" }, { key: "stats", href: "/admin/stats", label: "유입 통계" }] as const;

export function AdminNav({ current }: { current: (typeof ITEMS)[number]["key"] }) {
  return (
    <nav aria-label="관리자 메뉴" className="mb-4 flex gap-2">
      {ITEMS.map((i) => (
        <Link key={i.key} href={i.href} aria-current={i.key === current ? "page" : undefined}
          className={pillClass(i.key === current)}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
