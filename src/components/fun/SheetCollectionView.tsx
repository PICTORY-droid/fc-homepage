import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { FunCtaBox } from "@/components/fun/FunCtaBox";
import { FunPageExtras } from "@/components/fun/FunPageExtras";
import { PillNav } from "@/components/fun/PillNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { getFunCta } from "@/config/funCta";
import { EXCEL_PACK, entriesBySeason, getGroup as getPackGroup, packDownloadName, packEntries, packFile, packLarge, seasonSlug, type Season } from "@/config/pack";
import { SHEET_ASPECT, collectionCardThumb, collectionPath, collectionSeasons, getSheetGroup, sheetGroups, type SheetCollection } from "@/config/sheets";

const nn = (n: number) => String(n).padStart(2, "0");

// 테마 모음 페이지 — 엑셀 서식 분야 페이지와 같은 짜임(분야 버튼 → 카드 목록)에 계절 버튼 한 줄을 더했습니다. season 이 있으면 그 계절만 보여 줍니다. (표시만 담당)
export function SheetCollectionView({ c, season }: { c: SheetCollection; season?: Season }) {
  const { item } = c;
  const group = getSheetGroup(c.group);
  const list = season ? entriesBySeason(item, season) : packEntries(item);
  const path = collectionPath(c, season);
  const cta = getFunCta(EXCEL_PACK, item.key);
  const howto = getPackGroup(EXCEL_PACK)?.howto;
  const seasonPills = [{ key: "all", label: `전체 ${c.count}`, href: collectionPath(c) },
    ...collectionSeasons(c).map(({ season: s, count }) => ({ key: seasonSlug[s], label: `${s} ${count}`, href: collectionPath(c, s) }))];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([["홈", "/"], ["즐길거리", "/fun"], ["엑셀 서식", "/fun/sheets"], [group?.label ?? "", `/fun/sheets/${c.group}`], [item.title, path]])} />
      <Section as="h1" title={season ? `${season} ${item.title} ${list.length}종` : `${item.title} — 디자인 ${c.count}가지`} lead={item.short}>
        <PillNav label="엑셀 서식 분야" current={c.group} items={sheetGroups.map((g) => ({ key: g.key, label: g.label, href: `/fun/sheets/${g.key}` }))} className="mb-3" />
        <PillNav label="계절별 디자인" current={season ? seasonSlug[season] : "all"} items={seasonPills} />
        <ul data-reveal="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <DownloadCard key={e.no} title={`${nn(e.no)}. ${e.name}`} desc={`${e.flavor} · ${e.tag}`} thumb={collectionCardThumb(c, e.no)} zoom={packLarge(item, e.no)} aspect={SHEET_ASPECT}
              thumbAlt={`${item.title} ${e.name} 테마 미리보기`} links={[{ label: "엑셀 받기", href: packFile(item, e), filename: packDownloadName(item, e) }]} />
          ))}
        </ul>
      </Section>
      {cta && <Section><FunCtaBox cta={cta} from={path.replace("/fun/", "")} /></Section>}
      <Section>
        {howto && <p className="text-sm text-ink-sub">{howto}</p>}
        <p className="mt-3 text-ink-sub"><Link href={`/fun/sheets/${c.group}`} className="font-semibold text-brand-deep underline">{group?.label} 서식 보기</Link> · <Link href="/fun/sheets" className="font-semibold text-brand-deep underline">엑셀 서식 전체</Link> · <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
      <Section><FunPageExtras path={path} /></Section>
    </>
  );
}
