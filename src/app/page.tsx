import { PageBanner } from "@/components/PageBanner";
import { Section } from "@/components/ui/Section";
import { ConsultForm } from "@/components/consult/ConsultForm";
import { TopProducts } from "@/components/TopProducts";
import { JsonLd } from "@/components/seo/JsonLd";
import { agencyJsonLd } from "@/lib/seo/jsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd data={agencyJsonLd()} />
      <PageBanner bannerKey="home" />
      <TopProducts />
      <Section id="consult" title="간편 상담 신청">
        <ConsultForm initialTopic="health" />
      </Section>
    </>
  );
}
