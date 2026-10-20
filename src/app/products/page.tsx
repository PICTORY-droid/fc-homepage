import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Notice } from "@/components/ui/Notice";
import { ProductExplorer } from "@/components/products/ProductExplorer";
import { productCopy } from "@/config/productCopy";
import { products, productsMeta } from "@/config/products";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: productCopy.listTitle,
  description: "판매 중인 우체국보험 상품을 한곳에서 살펴보고 상세보기에서 자세히 확인하세요.",
  alternates: { canonical: "/products" },
};

// 보험 상품 목록 — 검색·필터·비교 담기를 지원하고, 상세보기는 이 사이트의 상품 상세 페이지로 이동합니다.
export default function ProductsPage() {
  return (
    <>
      <Section as="h1" title={productCopy.listTitle} lead={productCopy.listLead}>
        <div className="space-y-6">
          <Notice>{site.notices.premium}</Notice>
          <ProductExplorer products={products} />
        </div>
      </Section>
      <Section>
        <p className="text-xs text-ink-sub">
          {productsMeta.source} 기준 · {productsMeta.asOf} 확인 · {productCopy.statusNote}
          {site.reviewNo ? ` · 심의필 ${site.reviewNo}` : process.env.NODE_ENV !== "production" ? " · 심의번호 미입력(개발용)" : ""}
        </p>
      </Section>
    </>
  );
}
