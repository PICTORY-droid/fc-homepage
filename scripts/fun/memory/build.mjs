// 기억 편지지 80장 만들기 — 결과: <출력 폴더>/png/<id>.png(내려받기용), thumbs/<id>.jpg(미리보기), bg/<id>.jpg(Word 배경), meta.json
// 실행: PW_PATH=<playwright 폴더> CHROMIUM_PATH=<크롬 경로> node scripts/fun/memory/build.mjs <출력 폴더> [id 앞부분 필터]
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { W, H } from "./base.mjs";
import { draw } from "./layouts.mjs";
import { allDesigns as seasonal } from "./designs.mjs";
import { designs2 } from "./designs2.mjs";
const allDesigns = [...seasonal, ...designs2];

const out = resolve(process.argv[2] ?? "");
const filter = process.argv[3] ?? "";
if (!process.argv[2]) { console.error("출력 폴더를 지정하세요."); process.exit(1); }
for (const d of ["png", "thumbs", "bg"]) mkdirSync(join(out, d), { recursive: true });
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve("playwright", { paths: [process.env.PW_PATH ?? process.cwd()] }));
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const mk = async (scale) => (await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: scale })).newPage());
const big = await mk(1.5), small = await mk(0.55);
const html = (svg) => `<!doctype html><meta charset="utf-8"><style>*{margin:0}html,body{width:${W}px;height:${H}px;overflow:hidden}svg{display:block}</style>${svg}`;
const meta = [];
for (const d of allDesigns.filter((x) => x.id.startsWith(filter))) {
  const r = draw(d, d.hero);
  await big.setContent(html(r.svg(false)), { waitUntil: "load" });
  writeFileSync(join(out, `png/${d.id}.png`), await big.screenshot({ type: "png" }));
  await small.setContent(html(r.svg(false)), { waitUntil: "load" });
  writeFileSync(join(out, `thumbs/${d.id}.jpg`), await small.screenshot({ type: "jpeg", quality: 82 }));
  await big.setContent(html(r.svg(true)), { waitUntil: "load" });
  writeFileSync(join(out, `bg/${d.id}.jpg`), await big.screenshot({ type: "jpeg", quality: 90 }));
  meta.push({ id: d.id, season: d.season, name: d.title, tag: d.tag, color: d.p.ink.slice(1), date: r.area.date, fields: r.area.fields, rules: r.area.rules, from: r.area.from });
}
writeFileSync(join(out, `meta${filter ? "-" + filter : ""}.json`), JSON.stringify(meta, null, 1));
console.log("✔", meta.length, "장");
await browser.close();
