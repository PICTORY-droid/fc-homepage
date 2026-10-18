import type { MetadataRoute } from "next";
import { categories } from "@/config/categories";
import { siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/consult", "/tools", "/privacy", ...categories.map((c) => `/c/${c.slug}`)];
  return pages.map((p) => ({ url: `${siteUrl}${p}`, lastModified: new Date() }));
}
