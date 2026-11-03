import Link from "next/link";
import type { Product } from "@/config/products";
import { productPath } from "@/lib/products";
import { ProductThumb } from "./ProductThumb";
import { buttonClass, cardLinkClass } from "@/components/ui/styles";

// 상품 목록 카드 — 표시만 담당
export function ProductCard({ product, compare }: { product: Product; compare?: { checked: boolean; disabled: boolean; onToggle: () => void } }) {
  return (
    <li className={`flex flex-col ${cardLinkClass}`}>
      <ProductThumb product={product} />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold text-brand-deep">{product.group}</p>
        <h3 className="mt-1 text-lg font-bold leading-snug text-ink sm:min-h-[3.5rem]">{product.displayName}</h3>
        <p className="mt-2 text-sm text-ink-sub sm:min-h-[2.5rem]">{product.slogan?.headline}</p>
        <div className="mt-auto pt-5">
        {compare && (
          <label className="mb-3 flex min-h-[44px] cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
            <input type="checkbox" className="h-5 w-5 accent-brand" checked={compare.checked}
              disabled={compare.disabled && !compare.checked} onChange={compare.onToggle} />
            비교에 담기<span className="sr-only"> — {product.displayName}</span>
          </label>
        )}
        <Link href={productPath(product.id)}
          className={buttonClass("primary", "md", "w-full")}>
          상세보기<span className="sr-only"> — {product.displayName}</span>
        </Link>
        </div>
      </div>
    </li>
  );
}
