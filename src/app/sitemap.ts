import type { MetadataRoute } from "next";
import { categories } from "@/config/categories";
import { products } from "@/config/products";
import { cardCategories } from "@/config/cards";
import { packGroups, packSeasons, seasonSlug } from "@/config/pack";
import { seasons } from "@/config/stationery";
import { siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/consult", "/tools", "/products", "/privacy", "/guide", "/profile", "/find", "/compare", ...categories.map((c) => `/c/${c.slug}`), ...products.map((x) => `/products/${x.id}`),
    "/fun", "/fun/stationery", ...seasons.map((s) => `/fun/stationery/${s.key}`), "/fun/cards", ...cardCategories.map((c) => `/fun/cards/${c.key}`),
    ...packGroups.flatMap((g) => [`/fun/${g.slug}`, ...g.items.flatMap((i) => [`/fun/${g.slug}/${i.key}`, ...packSeasons.map((s) => `/fun/${g.slug}/${i.key}/${seasonSlug[s]}`)])])];
  return pages.map((p) => ({ url: `${siteUrl}${p}`, lastModified: new Date() }));
}
