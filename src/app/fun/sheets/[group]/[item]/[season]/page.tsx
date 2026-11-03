import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { funMetadata, searchTitles } from "@/lib/seo/funMeta";
import { SheetCollectionView } from "@/components/fun/SheetCollectionView";
import { EXCEL_PACK, entriesBySeason, packSeasons, seasonFromSlug, seasonSlug } from "@/config/pack";
import { collectionPath, getSheetCollection, sheetCollections } from "@/config/sheets";

type Props = { params: Promise<{ group: string; item: string; season: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sheetCollections.flatMap((c) => packSeasons.map((s) => ({ group: c.group, item: c.item.key, season: seasonSlug[s] })));
}

const find = async (params: Props["params"]) => {
  const p = await params;
  const c = getSheetCollection(p.group, p.item);
  const season = seasonFromSlug(p.season);
  return c && season ? { c, season } : null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = await find(params);
  if (!f) return {};
  const { c, season } = f;
  const n = entriesBySeason(c.item, season).length;
  return funMetadata({
    title: `${season} ${searchTitles[`${EXCEL_PACK}/${c.item.key}`] ?? c.item.title} ${n}종`,
    description: `${season}의 감성으로 만든 ${c.item.title} ${n}종. ${c.item.short}`,
    path: collectionPath(c, season), ogKey: `${EXCEL_PACK}-${c.item.key}-${seasonSlug[season]}`,
  });
}

// 테마 모음 계절 페이지(예: /fun/sheets/life/ledger/spring) — 그 계절 디자인만. 상담 안내·클릭 기록도 이 페이지 단위로 쌓여요.
export default async function SheetCollectionSeasonPage({ params }: Props) {
  const f = await find(params);
  if (!f) notFound();
  return <SheetCollectionView c={f.c} season={f.season} />;
}
