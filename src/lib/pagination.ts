// 목록 나누기(페이지네이션) — 화면·DB 와 분리된 순수 함수입니다.
export const PAGE_SIZE = 10;

export type Page<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  /** 현재 페이지의 첫·마지막 순번 (1부터, 비었으면 0) */
  from: number;
  to: number;
};

/** 주소의 ?page= 값을 안전한 정수로 바꿉니다. 이상한 값이면 1쪽. */
export function parsePage(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

/** 목록을 size 개씩 자릅니다. 범위를 벗어난 쪽 번호는 가장 가까운 쪽으로 맞춥니다. */
export function paginate<T>(items: readonly T[], page: number, size: number = PAGE_SIZE): Page<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const p = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  const start = (p - 1) * size;
  const slice = items.slice(start, start + size);
  return { items: slice, page: p, totalPages, total, from: total ? start + 1 : 0, to: start + slice.length };
}

/** 번호 버튼에 보일 쪽 목록: 처음·끝·현재 앞뒤 1쪽, 사이가 비면 "…" */
export function pageWindow(page: number, totalPages: number): (number | "…")[] {
  const keep = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const nums = [...keep].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}
