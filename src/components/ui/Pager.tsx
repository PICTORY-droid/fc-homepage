import Link from "next/link";
import { pageWindow } from "@/lib/pagination";
import { pillClass } from "@/components/ui/styles";

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
const PAGE = "min-w-[44px] !px-3"; // 쪽 번호 — 알약 모양(지금 쪽은 주황)

// 목록 아래 쪽 이동 막대 — 한 쪽뿐이면 아무것도 그리지 않습니다.
export function Pager({ page, totalPages, total, from, to, basePath }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="쪽 이동" className="mt-6">
      <p className="mb-2 text-center text-sm text-ink-sub">총 {total.toLocaleString("ko-KR")}건 중 {from}–{to}번째 (최신순)</p>
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        {page > 1 && <li><Link href={hrefOf(basePath, page - 1)} className={pillClass(false, PAGE)}>이전</Link></li>}
        {pageWindow(page, totalPages).map((p, i) => (
          <li key={`${p}-${i}`}>
            {p === "…" ? <span className="px-1 text-ink-sub" aria-hidden="true">…</span> : (
              <Link href={hrefOf(basePath, p)} aria-current={p === page ? "page" : undefined}
                className={pillClass(p === page, PAGE)}>{p}</Link>
            )}
          </li>
        ))}
        {page < totalPages && <li><Link href={hrefOf(basePath, page + 1)} className={pillClass(false, PAGE)}>다음</Link></li>}
      </ul>
    </nav>
  );
}
