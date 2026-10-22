import type { Metadata } from "next";
import { funMetadata, searchTitles } from "@/lib/seo/funMeta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { SeasonChooser } from "@/components/fun/SeasonChooser";
import { FunPageExtras } from "@/components/fun/FunPageExtras";
import { FunCtaBox } from "@/components/fun/FunCtaBox";
import { getFunCta } from "@/config/funCta";
import { entriesBySeason, getGroup, getItem, packEntries, packGroups, packSeasons, packThumb, seasonSlug } from "@/config/pack";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";

type Props = { params: Promise<{ group: string; item: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return packGroups.flatMap((g) => g.items.map((i) => ({ group: g.slug, item: i.key })));
}

const find = async (params: Props["params"]) => {
  const p = await params;
  const group = getGroup(p.group);
  const item = group && getItem(group, p.item);
  return group && item ? { group, item } : null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = await find(params);
  if (!f) return {};
  const n = packEntries(f.item).length;
  return funMetadata({ title: `${searchTitles[`${f.group.slug}/${f.item.key}`] ?? f.item.title} ${n}종`, description: f.item.short, path: `/fun/${f.group.slug}/${f.item.key}`, ogKey: `${f.group.slug}-${f.item.key}` });
}

// 항목 페이지 — 빛깔 중 하나를 고르는 입구. 실제 양식은 빛깔별 상세페이지에 있어요.
export default async function PackItemPage({ params }: Props) {
  const f = await find(params);
  if (!f) notFound();
  const { group, item } = f;
  const total = packEntries(item).length;
  const cta = getFunCta(group.slug, item.key);
  const choices = packSeasons.map((s) => {
    const list = entriesBySeason(item, s);
    return { slug: seasonSlug[s], label: s, count: list.length, href: `/fun/${group.slug}/${item.key}/${seasonSlug[s]}`, lead: `${s}의 감성으로 만든 ${item.title} ${list.length}종. ${list.slice(0, 3).map((e) => e.name).join(" · ")} 등`,
      thumbs: list.slice(0, 3).map((e) => packThumb(item, e.no)).filter((t): t is string => !!t), aspect: item.aspect };
  });
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([["홈", "/"], ["즐길거리", "/fun"], [group.title, `/fun/${group.slug}`], [item.title, `/fun/${group.slug}/${item.key}`]])} />
      <Section as="h1" title={`${item.title} ${total}종`} lead={`${item.short} — 계절을 골라 들어가 보세요.`}>
        <SeasonChooser items={choices} />
      </Section>
      {cta && <Section><FunCtaBox cta={cta} from={`${group.slug}/${item.key}`} /></Section>}
      <Section>
        <p className="text-sm text-ink-sub">{group.howto}</p>
        <p className="mt-3 text-ink-sub"><Link href={`/fun/${group.slug}`} className="font-semibold text-brand-deep underline">{group.title} 목록으로</Link> · <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
      <Section><FunPageExtras path={`/fun/${group.slug}/${item.key}`} /></Section>
    </>
  );
}
