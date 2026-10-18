import { GROUP_ORDER, products, type Product, type ProductGroup } from "../config/products";

// 상품 조회 — 화면과 무관한 순수 함수
export const getProduct = (id: string): Product | undefined => products.find((p) => p.id === id);

export function productsByGroup(): { group: ProductGroup; items: Product[] }[] {
  return GROUP_ORDER
    .map((group) => ({ group, items: products.filter((p) => p.group === group) }))
    .filter((g) => g.items.length > 0);
}

// 같은 분류의 다른 상품 (같은 상담 분야 우선)
export function relatedProducts(id: string, limit = 4): Product[] {
  const me = getProduct(id);
  if (!me) return [];
  const others = products.filter((p) => p.id !== id && p.group === me.group);
  const same = others.filter((p) => p.topic === me.topic);
  return [...same, ...others.filter((p) => p.topic !== me.topic)].slice(0, limit);
}

export const productImage = (p: Product) =>
  p.image ? { full: `/products/${p.id}.webp`, thumb: `/products/${p.id}-thumb.webp` } : null;

export const productPath = (id: string) => `/products/${id}`;
export const consultHref = (p: Product) => `/consult?topic=${p.topic}`;
