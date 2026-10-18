import { topProducts } from "@/config/topProducts";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import Link from "next/link";
import { renderProductScene } from "@/components/products/art";

// 우체국보험 판매량 TOP 2 — 내용은 config/topProducts.ts 에서만 수정합니다.
export function TopProducts() {
  return (
    <Section title={topProducts.title} lead={`${topProducts.source} · ${topProducts.asOf} 확인`} tone="card" reveal={false}>
      <ol data-reveal="stagger" className="grid gap-4 md:grid-cols-2">
        {topProducts.items.map((p) => (
          <li key={p.rank} className="flex flex-col overflow-hidden rounded-card border border-ink/10 bg-paper transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg">
            <Link href={p.detailPath} aria-label={`${p.name} 상세보기`} className="relative block h-48 bg-[#FFF4EC] px-4 pb-1 pt-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink">
              {renderProductScene(p.detailPath.split("/").pop() ?? "")}
              <span className="absolute left-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-ink">{p.rank}</span>
            </Link>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h3 className="text-xl font-bold text-ink">{p.name}</h3>
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="상품 특징">
                  {p.tags.map((t) => (
                    <li key={t} className="rounded-full bg-paper-gray px-3 py-1 text-xs text-ink-sub">#{t}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/consult?topic=${p.topic}`}>상담하기</ButtonLink>
                <ButtonLink href={p.detailPath} variant="outline">상세보기</ButtonLink>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-ink-sub">{topProducts.note}</p>
    </Section>
  );
}
