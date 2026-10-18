import { PageBanner } from "@/components/PageBanner";
import { CategoryCard } from "@/components/CategoryCard";
import { Section } from "@/components/ui/Section";
import { ConsultForm } from "@/components/consult/ConsultForm";
import { TopProducts } from "@/components/TopProducts";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { ButtonLink } from "@/components/ui/Button";
import { categories } from "@/config/categories";
import { JsonLd } from "@/components/seo/JsonLd";
import { agencyJsonLd } from "@/lib/seo/jsonLd";

const STEPS = [
  ["상담 신청", "이름과 연락처, 궁금한 분야를 남겨 주세요."],
  ["연락 드립니다", "희망하신 시간에 맞춰 전화드립니다."],
  ["비교 후 결정", "충분히 설명드리고, 결정은 천천히 하셔도 됩니다."],
];

export default function HomePage() {
  const featured = categories.filter((c) => c.featured);
  return (
    <>
      <JsonLd data={agencyJsonLd()} />
      <PageBanner bannerKey="home" />
      <TopProducts />
      <ProfileSection />
      <Section title="추천 상담 분야" lead="먼저 살펴보시기 좋은 분야를 모았어요.">
        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      </Section>
      <Section title="전체 상담 분야" tone="card">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      </Section>
      <Section title="간편 계산기" lead="보험나이, 은퇴 후 생활비 부족분, 복리 적립을 직접 계산해 보세요.">
        <ButtonLink href="/tools" variant="soft">계산기 열기</ButtonLink>
      </Section>
      <Section title="상담은 이렇게 진행돼요" tone="card">
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="rounded-card bg-paper-card p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand font-bold text-ink">{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold text-ink">{t}</h3>
              <p className="mt-1 text-sm text-ink-sub">{d}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section id="consult" title="간편 상담 신청">
        <div className="max-w-xl"><ConsultForm initialTopic="health" /></div>
      </Section>
    </>
  );
}
