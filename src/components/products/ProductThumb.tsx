import type { Product } from "@/config/products";
import { productImage } from "@/lib/products";

// 상품 대표 이미지 — 이미지가 없으면 이름이 들어간 기본 타일
export function ProductThumb({ product, className = "" }: { product: Product; className?: string }) {
  const img = productImage(product);
  if (img) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={img.thumb} alt={`${product.displayName} 안내 이미지`} width={480} height={480} loading="lazy"
        className={`aspect-square w-full object-cover ${className}`} />
    );
  }
  return (
    <div className={`flex aspect-square w-full flex-col items-center justify-center gap-2 bg-brand-soft/50 p-4 text-center ${className}`}>
      <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-brand-deep">{product.group}</span>
      <span className="text-base font-bold leading-snug text-ink">{product.displayName}</span>
    </div>
  );
}
