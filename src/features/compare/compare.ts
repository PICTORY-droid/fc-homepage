import { getProduct } from "../../lib/products";
import type { Product } from "../../config/products";
import { getProductDetail } from "../../config/productDetails";

export const MAX_COMPARE = 3;

/** 주소의 ids 값(P001,P003…)을 검증해 유효한 상품 최대 3개만 돌려줍니다. */
export function parseCompareIds(raw: string | string[] | undefined): Product[] {
  const text = Array.isArray(raw) ? raw.join(",") : raw ?? "";
  const ids = [...new Set(text.split(",").map((s) => s.trim().toUpperCase()).filter((s) => /^P\d{3}$/.test(s)))];
  return ids.map((id) => getProduct(id)).filter((p): p is Product => Boolean(p)).slice(0, MAX_COMPARE);
}

export type CompareRow = { label: string; values: string[] };

/** 선택한 상품들의 '핵심 정보' 항목을 합쳐 같은 항목끼리 나란히 놓습니다. (없는 값은 '—') */
export function buildFactRows(products: Product[]): CompareRow[] {
  const labels: string[] = [];
  for (const p of products) for (const f of getProductDetail(p.id)?.facts ?? []) if (!labels.includes(f.label)) labels.push(f.label);
  return labels.map((label) => ({
    label,
    values: products.map((p) => getProductDetail(p.id)?.facts.find((f) => f.label === label)?.value ?? "—"),
  }));
}
