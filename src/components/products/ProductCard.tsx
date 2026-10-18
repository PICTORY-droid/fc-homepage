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
        <h3 className="mt-1 text-lg font-bold leading-snug text-ink sm:min-h-[3.5rem]">{product.displayName}</h3>
        <p className="mt-2 text-sm text-ink-sub sm:min-h-[2.5rem]">{product.slogan?.headline}</p>
        <div className="mt-auto pt-5">
        <Link href={productPath(product.id)}
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand px-6 text-base font-semibold text-ink hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
          상세보기<span className="sr-only"> — {product.displayName}</span>
        </Link>
        </div>
      </div>
    </li>
  );
}
