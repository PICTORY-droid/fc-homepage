// 카페 하네스가 읽는 파일 모음 — 설정·원고·판매 중 상품 데이터(홈페이지와 같은 원본)
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "./frontmatter.mjs";

export const CAFE = new URL("../../", import.meta.url).pathname;
const ROOT = join(CAFE, "..");

export const loadConfig = () => JSON.parse(readFileSync(join(CAFE, "cafe.config.json"), "utf8"));

/** 판매 중 상품 (홈페이지 src/config/products.data.json — 판매중지·온라인 전용 상품은 이미 빠져 있음) */
export const loadProducts = () =>
  new Map(JSON.parse(readFileSync(join(ROOT, "src/config/products.data.json"), "utf8")).map((p) => [p.id, p.name]));

export function loadPosts() {
  const dir = join(CAFE, "posts");
  return readdirSync(dir).filter((f) => f.endsWith(".md")).sort().map((f) => {
    const { meta, body } = parseFrontmatter(readFileSync(join(dir, f), "utf8"));
    return { file: `posts/${f}`, meta, body };
  });
}
