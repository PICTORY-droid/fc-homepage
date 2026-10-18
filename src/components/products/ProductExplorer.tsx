"use client";
import Link from "next/link";
import { useMemo } from "react";
import { categories } from "@/config/categories";
import { GROUP_ORDER, type Product } from "@/config/products";
import { ProductCard } from "./ProductCard";
import { useProductExplorer } from "@/features/products/useProductExplorer";
import { MAX_COMPARE } from "@/features/compare/compare";

const chip = "min-h-[44px] rounded-full px-4 text-sm font-semibold";
const fieldLabel = "mb-2 block text-sm font-semibold text-ink";
const fieldControl = "block w-full min-h-[48px] rounded-xl border border-ink/25 bg-paper px-4 text-base text-ink";

// 상품 목록 — 검색·분류 필터·비교 담기 (표시 담당, 로직은 useProductExplorer)
export function ProductExplorer({ products }: { products: Product[] }) {
  const { filter, setQ, setGroup, setTopic, reset, selected, toggle, result } = useProductExplorer(products);
  const grouped = useMemo(
    () => GROUP_ORDER.map((g) => ({ group: g, items: result.filter((p) => p.group === g) })).filter((g) => g.items.length),
    [result],
  );

  return (
    <div>
      <div className="space-y-5 rounded-card border border-ink/10 bg-paper p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_16rem]">
          <div>
            <label htmlFor="product-q" className={fieldLabel}>상품 검색</label>
            <input id="product-q" type="search" value={filter.q} onChange={(e) => setQ(e.target.value)}
              placeholder="예: 암, 치아, 어린이, 연금" autoComplete="off"
              className={`${fieldControl} focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink`} />
          </div>
          <div>
            <label htmlFor="product-topic" className={fieldLabel}>상담 분야</label>
            <select id="product-topic" value={filter.topic} onChange={(e) => setTopic(e.target.value)} className={fieldControl}>
              <option value="all">전체 분야</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              <option value="other">기타</option>
            </select>
          </div>
        </div>
        <div>
          <p id="product-group-label" className={fieldLabel}>분류</p>
          <div role="group" aria-labelledby="product-group-label" className="flex flex-wrap gap-2">
            {(["all", ...GROUP_ORDER] as const).map((g) => (
              <button key={g} type="button" aria-pressed={filter.group === g} onClick={() => setGroup(g)}
                className={`${chip} ${filter.group === g ? "bg-brand text-ink" : "bg-paper-gray text-ink-sub"}`}>
                {g === "all" ? "전체" : g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p role="status" className="mt-4 text-sm text-ink-sub">
        {result.length}개 상품
        {(filter.q || filter.group !== "all" || filter.topic !== "all") && (
          <button type="button" onClick={reset} className="ml-3 underline">필터 초기화</button>
        )}
      </p>

      {grouped.length === 0 ? (
        <div className="mt-8 rounded-card bg-paper-card p-8 text-center">
          <p className="font-semibold text-ink">조건에 맞는 상품이 없어요.</p>
          <p className="mt-1 text-sm text-ink-sub">검색어를 줄이거나 필터를 초기화해 보세요. 찾는 보장이 있다면 상담 신청으로 문의해 주세요.</p>
        </div>
      ) : (
        grouped.map((g) => (
          <section key={g.group} className="mt-8" aria-labelledby={`g-${g.group}`}>
            <h3 id={`g-${g.group}`} className="text-xl font-bold text-ink">{g.group} 보험 <span className="text-base font-normal text-ink-sub">{g.items.length}</span></h3>
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((p) => (
                <ProductCard key={p.id} product={p}
                  compare={{ checked: selected.includes(p.id), disabled: selected.length >= MAX_COMPARE, onToggle: () => toggle(p.id) }} />
              ))}
            </ul>
          </section>
        ))
      )}

      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/15 bg-paper px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <p className="text-sm text-ink"><b>{selected.length}</b>개 선택 <span className="text-ink-sub">(최대 {MAX_COMPARE}개)</span></p>
            <div className="flex gap-2">
              <button type="button" onClick={() => selected.forEach(toggle)} className="min-h-[44px] rounded-xl border border-ink/30 px-4 text-sm font-semibold text-ink">비우기</button>
              <Link href={`/compare?ids=${selected.join(",")}`}
                className={`flex min-h-[44px] items-center rounded-xl px-5 text-sm font-bold ${selected.length >= 2 ? "bg-brand text-ink" : "pointer-events-none bg-paper-gray text-ink-sub"}`}
                aria-disabled={selected.length < 2}>
                {selected.length >= 2 ? "나란히 비교하기" : "2개 이상 선택하세요"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
