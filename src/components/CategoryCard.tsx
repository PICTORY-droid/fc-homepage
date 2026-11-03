import Link from "next/link";
import { CardCta } from "@/components/ui/CardCta";
import type { Category } from "@/config/categories";
import { cardLinkClass } from "@/components/ui/styles";

// 상담 분야 카드 (공식 사이트의 둥근 카드 + 연한 배경 스타일)
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/c/${category.slug}`}
      className={`flex min-h-[132px] flex-col justify-between p-5 outline-none ${cardLinkClass}`}
    >
      <div>
        <h3 className="text-lg font-bold text-ink">{category.title}</h3>
        <p className="mt-1 text-sm text-ink-sub">{category.short}</p>
      </div>
      <CardCta className="mt-4">자세히 보기</CardCta>
    </Link>
  );
}
