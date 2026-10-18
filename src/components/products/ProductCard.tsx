import Link from "next/link";
import type { Product } from "@/config/products";
import { productPath } from "@/lib/products";
import { ProductThumb } from "./ProductThumb";

// 상품 목록 카드 — 표시만 담당
export function ProductCard({ product }: { product: Product }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-card border border-ink/10 bg-paper">
      <ProductThumb product={product} />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold text-brand-deep">{product.group}</p>
        <h3 className="mt-1 text-lg font-bold leading-snug text-ink">{product.displayName}</h3>
        {product.slogan && <p className="mt-2 text-sm text-ink-sub">{product.slogan.headline}</p>}
        <Link href={productPath(product.id)}
          className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand px-6 text-base font-semibold text-ink hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
          상세보기<span className="sr-only"> — {product.displayName}</span>
        </Link>
      </div>
    </li>
  );
}
