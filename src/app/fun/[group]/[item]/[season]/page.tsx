import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PackCard } from "@/components/fun/PackCard";
import { FunCtaBox } from "@/components/fun/FunCtaBox";
import { SeasonLinks } from "@/components/fun/SeasonLinks";
import { getFunCta } from "@/config/funCta";
import { entriesBySeason, getGroup, getItem, packGroups, packSeasons, seasonFromSlug, seasonSlug } from "@/config/pack";

type Props = { params: Promise<{ group: string; item: string; season: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return packGroups.flatMap((g) => g.items.flatMap((i) => packSeasons.map((s) => ({ group: g.slug, item: i.key, season: seasonSlug[s] }))));
}

const find = async (params: Props["params"]) => {
  const p = await params;
  const group = getGroup(p.group);
  const item = group && getItem(group, p.item);
  const season = seasonFromSlug(p.season);
  return group && item && season ? { group, item, season } : null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = await find(params);
  if (!f) return {};
  const n = entriesBySeason(f.item, f.season).length;
  return { title: `${f.season} ${f.item.title} ${n}종`, description: `${f.season}의 감성으로 만든 ${f.item.title} ${n}종. ${f.item.short}`, alternates: { canonical: `/fun/${f.group.slug}/${f.item.key}/${seasonSlug[f.season]}` } };
}

// 계절 상세페이지 — 그 계절의 양식만 모아 보여 줍니다. 그림을 누르면 큰 미리보기가 열리고, 상담 안내·클릭 기록도 이 페이지 단위로 쌓여요.
export default async function PackSeasonPage({ params }: Props) {
  const f = await find(params);
  if (!f) notFound();
  const { group, item, season } = f;
  const list = entriesBySeason(item, season);
  const cta = getFunCta(group.slug, item.key);
  const links = packSeasons.map((s) => ({ slug: seasonSlug[s], label: s, count: entriesBySeason(item, s).length, href: `/fun/${group.slug}/${item.key}/${seasonSlug[s]}` }));
  return (
    <>
      <Section title={`${season} ${item.title} ${list.length}종`} lead={item.short}>
        <SeasonLinks items={links} current={seasonSlug[season]} />
      </Section>
      <Section tone="card">
        <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((e) => <PackCard key={e.no} item={item} entry={e} />)}
        </ul>
      </Section>
      {cta && <Section><FunCtaBox cta={cta} from={`${group.slug}/${item.key}/${seasonSlug[season]}`} /></Section>}
      <Section>
        <p className="text-sm text-ink-sub">{group.howto}</p>
        <p className="mt-3 text-ink-sub"><Link href={`/fun/${group.slug}/${item.key}`} className="font-semibold text-brand-deep underline">{item.title} 계절 고르기</Link> · <Link href={`/fun/${group.slug}`} className="font-semibold text-brand-deep underline">{group.title} 목록으로</Link> · <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
