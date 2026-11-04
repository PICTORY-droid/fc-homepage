// 네이버 카페 하네스 — npm run cafe:check (푸시 전 verify:fast 에도 포함)
// 오류(✖)가 하나라도 있으면 실패합니다. 경고(⚠)는 사람이 확인할 목록입니다. 검사 항목 설명: cafe/HARNESS.md
import { checkConfig, checkPost } from "./lib/rules.mjs";
import { loadConfig, loadPosts, loadProducts } from "./lib/load.mjs";

const cfg = loadConfig();
const posts = loadPosts();
const ctx = { cfg, products: loadProducts(), slugs: new Set(), today: new Date() };
const issues = [...checkConfig(cfg), ...posts.flatMap((p) => checkPost(p.file, p.meta, p.body, ctx))];

const errors = issues.filter((i) => i.level === "error");
for (const w of issues.filter((i) => i.level === "warn")) console.warn(`⚠ [${w.code}] ${w.msg}`);
if (errors.length) {
  console.error("\n✖ 카페 검사 실패");
  for (const e of errors) console.error(`  - [${e.code}] ${e.msg}`);
  process.exit(1);
}
console.log(`✔ 카페 검사 통과 (게시판 ${cfg.menus.flatMap((g) => g.boards).length}개, 원고 ${posts.length}편)`);
