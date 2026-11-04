// 카페 원고 → 붙여넣기용 HTML (cafe/out). 검사를 통과해야 만듭니다. 사용: npm run cafe:build
// out/index.html 을 열고 글을 눌러 → 본문 전체 선택(Ctrl+A) → 복사 → 카페 스마트에디터에 붙여 넣기
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { toHtml } from "./lib/markdown.mjs";
import { CAFE, loadConfig, loadPosts } from "./lib/load.mjs";

execFileSync(process.execPath, [join(CAFE, "scripts/check-cafe.mjs")], { stdio: "inherit" });

const cfg = loadConfig();
const OUT = join(CAFE, "out");
mkdirSync(OUT, { recursive: true });
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** 홈페이지 링크에만 유입 표시(UTM)를 붙입니다 — 관리자 통계에서 카페 유입·상담 전환을 글별로 봅니다. */
const withUtm = (slug) => (u) => {
  const url = new URL(u);
  if (url.host !== "korea-bohum.vercel.app") return u;
  url.searchParams.set("utm_source", cfg.links.utm.source);
  url.searchParams.set("utm_medium", cfg.links.utm.medium);
  url.searchParams.set("utm_campaign", slug);
  return url.toString();
};

const style = `body{max-width:760px;margin:24px auto;padding:0 16px;font-family:'Pretendard','Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#222;line-height:1.8}
h1{font-size:24px}h2{font-size:20px;margin-top:32px;border-left:4px solid #E8590C;padding-left:10px}h3{font-size:17px}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#FFF4EC}
blockquote{margin:16px 0;padding:12px 16px;background:#FFF4EC;border-radius:8px}.meta{color:#666;font-size:13px}.foot{margin-top:40px;padding-top:16px;border-top:1px solid #ddd;font-size:14px;color:#555}
.draft{display:inline-block;background:#666;color:#fff;font-size:12px;padding:2px 8px;border-radius:4px}`;

const page = (title, inner) => `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${style}</style></head><body>${inner}</body></html>`;

const posts = loadPosts();
const list = [];
for (const { meta, body } of posts) {
  const f = cfg.footer;
  const link = withUtm(meta.slug);
  const foot = `<div class="foot">
<p>기준일 ${esc(meta.asOf)} · 출처: ${meta.sources.map((s) => `<a href="${esc(s)}">${esc(new URL(s).host)}</a>`).join(", ")}</p>
${meta.kind === "상품" ? `<p>${esc(f.premium)}</p>` : ""}
<p>${esc(f.service)}</p>
<p><a href="${esc(link(f.consult.url))}">${esc(f.consult.label)}</a></p>
<p>${esc(f.officialInfo)}</p>
${meta.reviewNo ? `<p>심의필 ${esc(meta.reviewNo)}</p>` : ""}</div>`;
  const name = `${meta.status === "초안" ? "초안_" : ""}${meta.slug}.html`;
  writeFileSync(join(OUT, name), page(meta.title, `${toHtml(body, link)}\n${foot}`));
  list.push(`<li>${meta.status === "초안" ? '<span class="draft">초안</span> ' : ""}<a href="${name}">${esc(meta.title)}</a> <span class="meta">→ ${esc(meta.menu)} · 태그: ${meta.keywords.map(esc).join(", ")}</span></li>`);
}
writeFileSync(join(OUT, "index.html"), page("카페 원고 목록", `<h1>카페 원고 목록</h1><p class="meta">제목은 카페 글쓰기의 제목 칸에, 태그는 태그 칸에 그대로 넣으세요.</p><ol>${list.join("")}</ol>`));
console.log(`✔ 붙여넣기용 원고 ${posts.length}편 → cafe/out/index.html`);
