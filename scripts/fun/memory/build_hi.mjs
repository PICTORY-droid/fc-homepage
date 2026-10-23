// 기억 편지지 80장 만들기 — 결과: <출력 폴더>/png/<id>.png(내려받기용), thumbs/<id>.jpg(미리보기), bg/<id>.jpg(Word 배경), meta.json
// 실행: PW_PATH=<playwright 폴더> CHROMIUM_PATH=<크롬 경로> node scripts/fun/memory/build.mjs <출력 폴더> [id 앞부분 필터]
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { W, H } from "./base.mjs";
import { draw } from "./layouts.mjs";
import { allDesigns as seasonal } from "./designs.mjs";
import { designs2 } from "./designs2.mjs";
import { designs3 } from "./designs3.mjs";
// 모든 편지지의 제목은 Word 에서 편집할 수 있도록 editTitle 을 켭니다.
const RN = JSON.parse(readFileSync(process.env.RENAME_JSON, "utf8"));
const allDesigns = [...seasonal, ...designs2, ...designs3].map((d) => ({ ...d, editTitle: true, tag: RN.tagsById?.[d.id] ?? RN.tags[d.title] ?? d.tag, mark: RN.marks[d.mark] ?? d.mark, title: RN.titlesById?.[d.id] ?? RN.titles[d.title] ?? d.title }));

const out = resolve(process.argv[2] ?? "");
const filter = process.argv[3] ?? "";
if (!process.argv[2]) { console.error("출력 폴더를 지정하세요."); process.exit(1); }
for (const d of ["png", "thumbs", "bg", "cover"]) mkdirSync(join(out, d), { recursive: true });
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve("playwright", { paths: [process.env.PW_PATH ?? process.cwd()] }));
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const mk = async (scale) => (await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: scale })).newPage());
const SC = Number(process.env.SC ?? 3), SB = Number(process.env.SB ?? 2);
const big = await mk(SC), mid = await mk(SB);
const html = (svg) => `<!doctype html><meta charset="utf-8"><style>*{margin:0}html,body{width:${W}px;height:${H}px;overflow:hidden}svg{display:block}</style>${svg}`;
const meta = [];
for (const d of allDesigns.filter((x) => x.id.startsWith(filter))) {
  const r = draw(d, d.hero);
  await big.setContent(html(r.svg(false)), { waitUntil: "load" });
  writeFileSync(join(out, `png/${d.id}.png`), await big.screenshot({ type: "png" }));
  await mid.setContent(html(r.svg(false)), { waitUntil: "load" });
  writeFileSync(join(out, `thumbs/${d.id}.jpg`), await mid.screenshot({ type: "jpeg", quality: 93 }));
  await mid.setContent(html(r.svg(true)), { waitUntil: "load" });
  writeFileSync(join(out, `bg/${d.id}.jpg`), await mid.screenshot({ type: "jpeg", quality: 92 }));
  await big.setContent(html(r.cover()), { waitUntil: "load" });
  writeFileSync(join(out, `cover/${d.id}.jpg`), await big.screenshot({ type: "jpeg", quality: 93 }));
  meta.push({ id: d.id, season: d.season, sub: d.sub ?? null, name: d.title, tag: d.tag, color: d.p.ink.slice(1), tcolor: d.p.d.slice(1), date: r.area.date, fields: r.area.fields, rules: r.area.rules, from: r.area.from, title: r.area.title ?? null });
}
writeFileSync(join(out, `meta${filter ? "-" + filter : ""}.json`), JSON.stringify(meta, null, 1));
console.log("✔", meta.length, "장");
await browser.close();
