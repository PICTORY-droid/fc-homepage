import type { MetadataRoute } from "next";
import { categories } from "@/config/categories";
import { products } from "@/config/products";
import { siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/consult", "/tools", "/products", "/privacy", ...categories.map((c) => `/c/${c.slug}`), ...products.map((x) => `/products/${x.id}`)];
  return pages.map((p) => ({ url: `${siteUrl}${p}`, lastModified: new Date() }));
}
