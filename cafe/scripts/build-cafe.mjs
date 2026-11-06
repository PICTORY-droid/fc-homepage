// 카페 원고 → 붙여넣기용 HTML (cafe/out). 검사를 통과해야 만듭니다. 사용: npm run cafe:build
// out/index.html 을 열고 글을 눌러 → 본문 전체 선택(Ctrl+A) → 복사 → 카페 스마트에디터에 붙여 넣기
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { toHtml, toPlain } from "./lib/markdown.mjs";
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
  list.push(`<li>${meta.status === "초안" ? '<span class="draft">초안</span> ' : ""}<a href="${name}">${esc(meta.title)}</a> <span class="meta">→ ${esc(meta.menu)} · 대표 이미지: thumbs/${esc(meta.slug)}.png</span></li>`);
}
// 붙여넣기용 보통 글 묶음 — 게시판·제목·태그·대표 이미지·대체 텍스트·본문을 글마다 차례로
const sep = "\n\n==================================================\n\n";
const plain = posts.map(({ meta, body }, i) => {
  const f = cfg.footer;
  const link = withUtm(meta.slug);
  const host = (u) => new URL(u).host.replace(/^www\./, "");
  const written = meta.written ?? meta.asOf;
  const dateLine = `작성일 ${written}${meta.asOf !== written ? ` · 상품 정보 기준 ${meta.asOf}` : ""} · 출처: ${[...new Set(meta.sources.map(host))].join(", ")}`;
  // 꼬리말 순서(확정 양식): 상담 링크 → (상품 글) 보험료 안내 → 공식 정보 → 민원 창구 → 작성일·출처
  const foot = [`${f.consult.label}: ${f.consult.url}`, meta.kind === "상품" ? f.premium : "", f.officialInfo, f.service, dateLine].filter(Boolean).join("\n");
  // 태그 10개: 글 키워드 먼저, 모자라면 카페 공통 태그로 채움(중복 제거) — 네이버 카페 태그 최대 10개
  const tags = [...new Set([...(meta.tags ?? []), ...meta.keywords, ...cfg.commonTags].map((k) => k.replace(/\s/g, "")))].slice(0, cfg.limits.tags).map((k) => `#${k}`).join(" ");
  const hand = Boolean(meta.icon); // 손그림 이미지(대표 + 메모 카드)가 있는 글
  const img1 = hand ? `hand/${meta.slug}-1.png` : `thumbs/${meta.slug}.png`;
  // 본문 배치(확정 양식): 사진1+설명 → 인사 문단 → 사진2(메모 카드)+설명 → 【소제목】들
  let text = toPlain(body, link);
  const photo = (file, cap) => `[사진: ${file}]\n${cap}`;
  if (hand) { const k = text.indexOf("\n【"); const mark = `\n${photo(`hand/${meta.slug}-2.png`, meta.cardTitle)}\n`; text = k > 0 ? text.slice(0, k) + mark + text.slice(k) : text + mark; }
  text = `${photo(img1, (meta.thumb ?? []).join(" "))}\n${text}`;
  return [`[${i + 1}] 게시판: ${meta.menu}${meta.status === "초안" && meta.kind === "상품" ? "   ※ 광고 심의 후 게시" : ""}`, `제목: ${meta.title}`, `태그: ${tags}`, "----- 본문 -----", text, "", foot].join("\n");
}).join(sep);
writeFileSync(join(OUT, "붙여넣기용_전체원고.txt"), plain);
// 게시판별 묶음도 따로 — 한 게시판씩 올릴 때 편하게
const byMenu = new Map();
plain.split(sep).forEach((chunk, i) => { const m = posts[i].meta.menu; byMenu.set(m, [...(byMenu.get(m) ?? []), chunk]); });
for (const [m, chunks] of byMenu) writeFileSync(join(OUT, `게시판_${m.replace(/[\\/:*?"<>|]/g, "")}.txt`), chunks.join(sep));
writeFileSync(join(OUT, "index.html"), page("카페 원고 목록", `<h1>카페 원고 목록</h1><p class="meta">제목은 카페 글쓰기의 제목 칸에, 태그는 태그 칸에 그대로 넣으세요.</p><ol>${list.join("")}</ol>`));
console.log(`✔ 붙여넣기용 원고 ${posts.length}편 → cafe/out/index.html`);
