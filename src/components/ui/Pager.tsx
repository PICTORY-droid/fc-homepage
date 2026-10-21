import Link from "next/link";
import { pageWindow } from "@/lib/pagination";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  /** 쪽 번호를 붙일 주소 (예: "/admin") */
  basePath: string;
};

const hrefOf = (basePath: string, p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);
const BTN = "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl px-3 text-sm font-bold";

// 목록 아래 쪽 이동 막대 — 한 쪽뿐이면 아무것도 그리지 않습니다.
export function Pager({ page, totalPages, total, from, to, basePath }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="쪽 이동" className="mt-6">
      <p className="mb-2 text-center text-sm text-ink-sub">총 {total.toLocaleString("ko-KR")}건 중 {from}–{to}번째 (최신순)</p>
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        {page > 1 && <li><Link href={hrefOf(basePath, page - 1)} className={`${BTN} border border-ink/20 text-ink`}>이전</Link></li>}
        {pageWindow(page, totalPages).map((p, i) => (
          <li key={`${p}-${i}`}>
            {p === "…" ? <span className="px-1 text-ink-sub" aria-hidden="true">…</span> : (
              <Link href={hrefOf(basePath, p)} aria-current={p === page ? "page" : undefined}
                className={`${BTN} ${p === page ? "bg-ink text-paper" : "border border-ink/20 text-ink"}`}>{p}</Link>
            )}
          </li>
        ))}
        {page < totalPages && <li><Link href={hrefOf(basePath, page + 1)} className={`${BTN} border border-ink/20 text-ink`}>다음</Link></li>}
      </ul>
    </nav>
  );
}
