import { PageBanner } from "@/components/PageBanner";
import { CategoryCard } from "@/components/CategoryCard";
import { Section } from "@/components/ui/Section";
import { ConsultForm } from "@/components/consult/ConsultForm";
import { TopProducts } from "@/components/TopProducts";
import { categories } from "@/config/categories";
import { JsonLd } from "@/components/seo/JsonLd";
import { agencyJsonLd } from "@/lib/seo/jsonLd";

export default function HomePage() {
  const featured = categories.filter((c) => c.featured);
  return (
    <>
      <JsonLd data={agencyJsonLd()} />
      <PageBanner bannerKey="home" />
      <TopProducts />
      <Section title="추천 상담 분야" lead="먼저 살펴보시기 좋은 분야를 모았어요." reveal={false}>
        <div data-reveal="stagger" className="grid gap-4 sm:grid-cols-3">
          {featured.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      </Section>
      <Section title="전체 상담 분야" tone="card" reveal={false}>
        <div data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      </Section>
      <Section id="consult" title="간편 상담 신청">
        <ConsultForm initialTopic="health" />
      </Section>
    </>
  );
}
