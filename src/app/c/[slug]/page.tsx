import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/PageBanner";
import { Section } from "@/components/ui/Section";
import { Notice } from "@/components/ui/Notice";
import { ConsultForm } from "@/components/consult/ConsultForm";
import { categories, getCategory } from "@/config/categories";
import type { BannerKey } from "@/config/banners";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCategory((await params).slug);
  return c ? { title: c.title, description: `${c.short} ${c.title} 관련 상품 안내와 상담 신청을 한곳에서 확인하세요.`, alternates: { canonical: `/c/${c.slug}` } } : {};
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).slug);
  if (!category) notFound();
  return (
    <>
      <PageBanner bannerKey={category.slug as BannerKey} />
      <Section title="이런 분께 도움이 될 수 있어요">
        <ul className="space-y-3">
          {category.forWhom.map((t) => (
            <li key={t} className="flex gap-3 rounded-card bg-paper-card p-4 text-ink">
              <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" />{t}
            </li>
          ))}
        </ul>
        {category.notice && <div className="mt-6"><Notice tone="alert">{category.notice}</Notice></div>}
      </Section>
      <Section title={`${category.title} 상담 신청`} tone="card">
        <ConsultForm initialTopic={category.slug} />
      </Section>
    </>
  );
}
