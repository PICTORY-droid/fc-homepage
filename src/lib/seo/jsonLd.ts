import { site, siteUrl } from "@/config/site";
import type { Product } from "@/config/products";

// 검색엔진용 구조화 데이터(JSON-LD) 생성 — 순수 함수 (화면과 무관)
export function agencyJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: site.fcName,
    description: site.description,
    url: siteUrl,
    telephone: site.contact.fcPhone.replace(/^0/, "+82-"),
    openingHours: "Mo-Fr 09:00-18:00",
    image: `${siteUrl}/og/default.png`,
  };
}

export function productJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "보험 상품", item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 3, name: p.displayName, item: `${siteUrl}/products/${p.id}` },
    ],
  };
}

/** <script> 안에 넣어도 안전하도록 '<' 를 이스케이프 */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
