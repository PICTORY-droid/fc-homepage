import Link from "next/link";
import type { Category } from "@/config/categories";

// 상담 분야 카드 (공식 사이트의 둥근 카드 + 연한 배경 스타일)
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/c/${category.slug}`}
      className="flex min-h-[132px] flex-col justify-between rounded-card border border-ink/10 bg-paper p-5 transition hover:border-brand hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
    >
      <div>
        <h3 className="text-lg font-bold text-ink">{category.title}</h3>
        <p className="mt-1 text-sm text-ink-sub">{category.short}</p>
      </div>
      <span className="mt-4 text-sm font-semibold text-brand-deep">자세히 보기 →</span>
    </Link>
  );
}
