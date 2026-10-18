import type { Product, ProductGroup } from "../config/products";

// 상품 검색·필터 — 화면과 무관한 순수 함수
export type ProductFilter = { q: string; group: ProductGroup | "all"; topic: string | "all" };

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

export function filterProducts(list: Product[], f: ProductFilter): Product[] {
  const q = norm(f.q);
  return list.filter((p) => {
    if (f.group !== "all" && p.group !== f.group) return false;
    if (f.topic !== "all" && p.topic !== f.topic) return false;
    if (!q) return true;
    const hay = norm([p.displayName, p.name, p.slogan?.headline ?? "", ...(p.slogan?.tags ?? [])].join(" "));
    return hay.includes(q);
  });
}
