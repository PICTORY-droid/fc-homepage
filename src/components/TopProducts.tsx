import { topProducts } from "@/config/topProducts";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import Link from "next/link";
import { renderProductScene } from "@/components/products/art";

// 우체국보험 판매량 TOP 2 — 내용은 config/topProducts.ts 에서만 수정합니다.
export function TopProducts() {
  return (
    <Section dense title={topProducts.title} lead={`${topProducts.source} · ${topProducts.asOf} 확인`} tone="card" reveal={false}>
      <ol data-reveal="stagger" className="grid gap-4 md:grid-cols-2">
        {topProducts.items.map((p) => (
          <li key={p.rank} className="flex flex-col overflow-hidden rounded-card sm:flex-row border border-ink/10 bg-paper transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg">
            <Link href={p.detailPath} aria-label={`${p.name} 상세보기`} className="relative block h-32 shrink-0 bg-[#FFF4EC] px-3 pb-1 pt-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink sm:h-auto sm:w-36 md:w-40">
              {renderProductScene(p.detailPath.split("/").pop() ?? "")}
              <span className="absolute left-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-ink">{p.rank}</span>
            </Link>
            <div className="flex flex-1 flex-col justify-between gap-3 p-4">
              <div>
                <h3 className="text-base font-bold leading-snug text-ink sm:text-lg">{p.name}</h3>
                <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="상품 특징">
                  {p.tags.map((t) => (
                    <li key={t} className="rounded-full bg-paper-gray px-2 py-0.5 text-xs text-ink-sub">#{t}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <ButtonLink href={`/consult?topic=${p.topic}`} className="!min-h-[40px] flex-1 !px-3 !text-sm sm:flex-none">상담하기</ButtonLink>
                <ButtonLink href={p.detailPath} variant="outline" className="!min-h-[40px] flex-1 !px-3 !text-sm sm:flex-none">상세보기</ButtonLink>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-ink-sub">{topProducts.note}</p>
    </Section>
  );
}
