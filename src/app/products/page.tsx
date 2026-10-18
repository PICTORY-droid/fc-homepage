import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Notice } from "@/components/ui/Notice";
import { ProductCard } from "@/components/products/ProductCard";
import { productCopy } from "@/config/productCopy";
import { productsMeta } from "@/config/products";
import { site } from "@/config/site";
import { productsByGroup } from "@/lib/products";

export const metadata: Metadata = {
  title: productCopy.listTitle,
  description: "판매 중인 우체국보험 상품을 한곳에서 살펴보고 상세보기에서 자세히 확인하세요.",
};

// 보험 상품 목록 — 분류별로 보여 주고, 상세보기는 이 사이트의 상품 상세 페이지로 이동합니다.
export default function ProductsPage() {
  const groups = productsByGroup();
  return (
    <>
      <Section title={productCopy.listTitle} lead={productCopy.listLead}>
        <div className="space-y-6">
          <nav aria-label="상품 분류" className="flex flex-wrap gap-2 text-sm">
            {groups.map((g, i) => (
              <a key={g.group} href={`#group-${i}`} className="rounded-full bg-paper-gray px-4 py-2 font-semibold text-ink">
                {g.group} {g.items.length}
              </a>
            ))}
          </nav>
          <Notice>{site.notices.premium}</Notice>
        </div>
      </Section>
      {groups.map((g, i) => (
        <Section key={g.group} id={`group-${i}`} title={`${g.group} 보험`} tone={i % 2 === 0 ? "card" : "white"}>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((p) => <ProductCard key={p.id} product={p} />)}
          </ul>
        </Section>
      ))}
      <Section>
        <p className="text-xs text-ink-sub">
          {productsMeta.source} 기준 · {productsMeta.asOf} 확인 · {productCopy.statusNote}
          {site.reviewNo ? ` · 심의필 ${site.reviewNo}` : process.env.NODE_ENV !== "production" ? " · 심의번호 미입력(개발용)" : ""}
        </p>
      </Section>
    </>
  );
}
