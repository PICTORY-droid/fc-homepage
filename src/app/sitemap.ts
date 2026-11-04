import type { MetadataRoute } from "next";
import { categories } from "@/config/categories";
import { products } from "@/config/products";
import { cardCategories } from "@/config/cards";
import { listedPackGroups, packSeasons } from "@/config/pack";
import { seasons } from "@/config/stationery";
import { collectionPath, sheetCollections, sheetGroups } from "@/config/sheets";
import { siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/consult", "/tools", "/products", "/privacy", "/guide", "/profile", "/find", "/compare", ...categories.map((c) => `/c/${c.slug}`), ...products.map((x) => `/products/${x.id}`),
    "/fun", "/fun/stationery", ...seasons.map((s) => `/fun/stationery/${s.key}`), "/fun/cards", ...cardCategories.map((c) => `/fun/cards/${c.key}`), "/fun/sheets", ...sheetGroups.map((g) => `/fun/sheets/${g.key}`), ...sheetCollections.flatMap((c) => [collectionPath(c), ...packSeasons.map((s) => collectionPath(c, s))]),
    ...listedPackGroups.flatMap((g) => [`/fun/${g.slug}`, ...g.items.map((i) => `/fun/${g.slug}/${i.key}`)])];
  return pages.map((p) => ({ url: `${siteUrl}${p}`, lastModified: new Date() }));
}
