import type { Metadata } from "next";
import { funMetadata, searchTitles } from "@/lib/seo/funMeta";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PackCard } from "@/components/fun/PackCard";
import { FunPageExtras } from "@/components/fun/FunPageExtras";
import { FunCtaBox } from "@/components/fun/FunCtaBox";
import { SeasonLinks } from "@/components/fun/SeasonLinks";
import { getFunCta } from "@/config/funCta";
import { EXCEL_PACK, entriesBySeason, getGroup, getItem, packGroups, packSeasons, retiredPackPath, seasonFromSlug, seasonSlug } from "@/config/pack";
import { collectionByItem, collectionPath } from "@/config/sheets";
import { textLink } from "@/components/ui/styles";

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
  return funMetadata({ title: `${f.season} ${searchTitles[`${f.group.slug}/${f.item.key}`] ?? f.item.title}`, description: `${f.season}의 감성으로 만든 ${f.item.title}. ${f.item.short}`, path: `/fun/${f.group.slug}/${f.item.key}/${seasonSlug[f.season]}`, ogKey: `${f.group.slug}-${f.item.key}-${seasonSlug[f.season]}` });
}

// 계절 상세페이지 — 그 계절의 양식만 모아 보여 줍니다. 그림을 누르면 큰 미리보기가 열리고, 상담 안내·클릭 기록도 이 페이지 단위로 쌓여요.
export default async function PackSeasonPage({ params }: Props) {
  const f = await find(params);
  if (!f) notFound();
  const { group, item, season } = f;
  if (group.slug === EXCEL_PACK) { const c = collectionByItem(item.key); permanentRedirect(c ? collectionPath(c, season) : "/fun/sheets"); } // 테마 모음으로 옮겨 감
  const moved = retiredPackPath(group.slug, item.key, seasonSlug[season]);
  if (moved) permanentRedirect(moved); // 내린 묶음(예전 PPT 템플릿)
  const list = entriesBySeason(item, season);
  const cta = getFunCta(group.slug, item.key);
  const links = packSeasons.map((s) => ({ slug: seasonSlug[s], label: s, count: entriesBySeason(item, s).length, href: `/fun/${group.slug}/${item.key}/${seasonSlug[s]}` }));
  return (
    <>
      <Section as="h1" title={`${season} ${item.title}`}>
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
        <p className="mt-3 text-ink-sub"><Link href={`/fun/${group.slug}/${item.key}`} className={textLink}>{item.title} 계절 고르기</Link> · <Link href={`/fun/${group.slug}`} className={textLink}>{group.title} 목록으로</Link> · <Link href="/fun" className={textLink}>즐길거리 전체 보기</Link></p>
      </Section>
      <Section><FunPageExtras path={`/fun/${group.slug}/${item.key}/${seasonSlug[season]}`} /></Section>
    </>
  );
}
