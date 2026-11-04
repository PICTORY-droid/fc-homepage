import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { funMetadata, searchTitles } from "@/lib/seo/funMeta";
import { SheetCollectionView } from "@/components/fun/SheetCollectionView";
import { EXCEL_PACK } from "@/config/pack";
import { collectionPath, getSheetCollection, sheetCollections } from "@/config/sheets";

type Props = { params: Promise<{ group: string; item: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sheetCollections.map((c) => ({ group: c.group, item: c.item.key }));
}

const find = async (params: Props["params"]) => {
  const p = await params;
  return getSheetCollection(p.group, p.item);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await find(params);
  if (!c) return {};
  return funMetadata({ title: `${searchTitles[`${EXCEL_PACK}/${c.item.key}`] ?? c.item.title}`, description: c.item.short, path: collectionPath(c), ogKey: `${EXCEL_PACK}-${c.item.key}` });
}

// 테마 모음 페이지(예: /fun/sheets/life/ledger) — 디자인 50가지 전체. 화면은 SheetCollectionView 가 그립니다.
export default async function SheetCollectionPage({ params }: Props) {
  const c = await find(params);
  if (!c) notFound();
  return <SheetCollectionView c={c} />;
}
