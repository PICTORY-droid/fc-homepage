import type { Metadata } from "next";
import { funMetadata, searchTitles } from "@/lib/seo/funMeta";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PackCard } from "@/components/fun/PackCard";
import { FunPageExtras } from "@/components/fun/FunPageExtras";
import { FunCtaBox } from "@/components/fun/FunCtaBox";
import { getFunCta } from "@/config/funCta";
import { EXCEL_PACK, getGroup, getItem, packEntries, packGroups, retiredItemPath, retiredPackPath, RETIRED_ITEMS } from "@/config/pack";
import { collectionByItem, collectionPath } from "@/config/sheets";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { textLink } from "@/components/ui/styles";

type Props = { params: Promise<{ group: string; item: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const retired = Object.keys(RETIRED_ITEMS).map((k) => { const [group, item] = k.split("/"); return { group, item }; }); // 내린 항목의 예전 주소도 만들어 두고 옮겨 보냄
  return [...packGroups.flatMap((g) => g.items.map((i) => ({ group: g.slug, item: i.key }))), ...retired];
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
  return funMetadata({ title: `${searchTitles[`${f.group.slug}/${f.item.key}`] ?? f.item.title}`, description: f.item.short, path: `/fun/${f.group.slug}/${f.item.key}`, ogKey: `${f.group.slug}-${f.item.key}` });
}

// 항목 페이지 — 이 항목의 템플릿을 한 화면에 모두 보여 줍니다(빛깔로 나누지 않음). 그림을 누르면 큰 미리보기가 열려요.
export default async function PackItemPage({ params }: Props) {
  const raw = await params;
  const gone = retiredItemPath(raw.group, raw.item);
  if (gone) permanentRedirect(gone); // 내린 항목(카드뉴스)
  const f = await find(params);
  if (!f) notFound();
  const { group, item } = f;
  if (group.slug === EXCEL_PACK) { const c = collectionByItem(item.key); permanentRedirect(c ? collectionPath(c) : "/fun/sheets"); } // 테마 모음으로 옮겨 감
  const moved = retiredPackPath(group.slug, item.key);
  if (moved) permanentRedirect(moved); // 내린 묶음(예전 PPT 템플릿)
  const cta = getFunCta(group.slug, item.key);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([["홈", "/"], ["즐길거리", "/fun"], [group.title, `/fun/${group.slug}`], [item.title, `/fun/${group.slug}/${item.key}`]])} />
      <Section as="h1" title={item.title}>
        <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {packEntries(item).map((e, i) => <PackCard key={e.no} item={item} entry={e} priority={i < 2} />)}
        </ul>
      </Section>
      {cta && <Section><FunCtaBox cta={cta} from={`${group.slug}/${item.key}`} /></Section>}
      <Section>
        <p className="text-sm text-ink-sub">{group.howto}</p>
        <p className="mt-3 text-ink-sub"><Link href={`/fun/${group.slug}`} className={textLink}>{group.title} 목록으로</Link> · <Link href="/fun" className={textLink}>즐길거리 전체 보기</Link></p>
      </Section>
      <Section><FunPageExtras path={`/fun/${group.slug}/${item.key}`} /></Section>
    </>
  );
}
