// 감성 편지지 10종 생성 — 결과: public/fun/stationery/<번호-이름>.png, thumbs/<번호-이름>.jpg (미리보기)
// 실행: PW_PATH=<playwright 폴더> CHROMIUM_PATH=<크롬 경로> node scripts/fun/make-stationery.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { designs, W, H } from "./stationery-art.mjs";

const ROOT = new URL("../../", import.meta.url).pathname;
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve("playwright", { paths: [ROOT, process.env.PW_PATH ?? ROOT] }));
const out = join(ROOT, "public/fun/stationery");
mkdirSync(join(out, "thumbs"), { recursive: true });

const page = (body) => `<!doctype html><meta charset="utf-8"><style>
@page{size:${W}px ${H}px;margin:0}*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px;font-family:"Pretendard","Noto Sans CJK KR","Malgun Gothic",sans-serif}
.sheet{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style><div class="sheet">${body}</div>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 });
const p = await ctx.newPage();
const thumbCtx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 0.55 });
const tp = await thumbCtx.newPage();
for (const d of designs) {
  await p.setContent(page(d.html()), { waitUntil: "load" });
  writeFileSync(join(out, `${d.id}.png`), await p.screenshot({ type: "png" }));
  await tp.setContent(page(d.html()), { waitUntil: "load" });
  writeFileSync(join(out, `thumbs/${d.id}.jpg`), await tp.screenshot({ type: "jpeg", quality: 80 }));
  console.log("✔", d.id, d.name);
}
await browser.close();
