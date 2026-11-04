import { notFound, permanentRedirect } from "next/navigation";
import { EXCEL_PACK, getGroup, getItem, packGroups, packSeasons, retiredItemPath, retiredPackPath, RETIRED_ITEMS, seasonFromSlug, seasonSlug } from "@/config/pack";
import { collectionByItem, collectionPath } from "@/config/sheets";

// 예전 빛깔(꽃빛·초록빛·노을빛·포근빛)별 주소 — PPT 템플릿은 이제 빛깔로 나누지 않고 항목 페이지에서 모두 보여 줍니다.
// 저장·공유된 예전 주소가 끊기지 않도록 주소만 만들어 두고 알맞은 곳으로 옮겨 보냅니다(308).
type Props = { params: Promise<{ group: string; item: string; season: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const retired = Object.keys(RETIRED_ITEMS).flatMap((k) => { const [group, item] = k.split("/"); return packSeasons.map((s) => ({ group, item, season: seasonSlug[s] })); });
  return [...packGroups.flatMap((g) => g.items.flatMap((i) => packSeasons.map((s) => ({ group: g.slug, item: i.key, season: seasonSlug[s] })))), ...retired];
}

export default async function PackSeasonPage({ params }: Props) {
  const p = await params;
  const gone = retiredItemPath(p.group, p.item);
  if (gone) permanentRedirect(gone); // 내린 항목(카드뉴스)
  const group = getGroup(p.group);
  const item = group && getItem(group, p.item);
  const season = seasonFromSlug(p.season);
  if (!group || !item || !season) notFound();
  if (group.slug === EXCEL_PACK) { const c = collectionByItem(item.key); permanentRedirect(c ? collectionPath(c, season) : "/fun/sheets"); } // 엑셀 테마 모음(빛깔별 유지)
  permanentRedirect(retiredPackPath(group.slug, item.key) ?? `/fun/${group.slug}/${item.key}`);
}
