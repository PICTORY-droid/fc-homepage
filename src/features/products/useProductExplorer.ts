"use client";
import { useMemo, useState } from "react";
import type { Product, ProductGroup } from "@/config/products";
import { filterProducts, type ProductFilter } from "@/lib/productSearch";
import { MAX_COMPARE } from "@/features/compare/compare";

const INITIAL: ProductFilter = { q: "", group: "all", topic: "all" };

// 상품 목록의 검색·필터·비교 선택 상태 (화면 컴포넌트에는 로직을 넣지 않음)
export function useProductExplorer(products: Product[]) {
  const [filter, setFilter] = useState<ProductFilter>(INITIAL);
  const [selected, setSelected] = useState<string[]>([]);

  const result = useMemo(() => filterProducts(products, filter), [products, filter]);
  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= MAX_COMPARE ? cur : [...cur, id]));

  return {
    filter, result, selected, toggle,
    setQ: (q: string) => setFilter((f) => ({ ...f, q })),
    setGroup: (group: ProductGroup | "all") => setFilter((f) => ({ ...f, group })),
    setTopic: (topic: string) => setFilter((f) => ({ ...f, topic })),
    reset: () => setFilter(INITIAL),
  };
}
