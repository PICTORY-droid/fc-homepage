import { serializeJsonLd } from "@/lib/seo/jsonLd";

// 구조화 데이터 삽입 — 서버 컴포넌트
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
