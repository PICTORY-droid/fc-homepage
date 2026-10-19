// 이력서·자기소개서 빈 양식 10종 생성 — 결과: public/fun/forms/thumbs/<id>.jpg (미리보기 그림만 — 내려받는 파일은 scripts/fun/docx 의 Word 파일)
// 실행: PW_PATH=<playwright 폴더> CHROMIUM_PATH=<크롬 경로> node scripts/fun/make-forms.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { forms, css, W, H } from "./forms-art.mjs";

const ROOT = new URL("../../", import.meta.url).pathname;
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve("playwright", { paths: [ROOT, process.env.PW_PATH ?? ROOT] }));
const out = join(ROOT, "public/fun/forms");
mkdirSync(join(out, "thumbs"), { recursive: true });

const doc = (body) => `<!doctype html><meta charset="utf-8"><style>${css}</style>${body}`;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const p = await (await browser.newContext({ viewport: { width: W, height: H } })).newPage();
const tp = await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 0.55 })).newPage();
for (const f of forms) {
  await p.setContent(doc(f.html()), { waitUntil: "load" });
  // 점검: 각 쪽의 내용이 아래쪽 안내 줄과 겹치거나(>1073) 너무 비어 있으면(<900) 알려줍니다.
  const fill = await p.evaluate(() => [...document.querySelectorAll(".page")].map((pg) => { const top = pg.getBoundingClientRect().top; let b = 0; pg.querySelectorAll(":scope > *:not(.foot)").forEach((c) => { b = Math.max(b, c.getBoundingClientRect().bottom - top); }); return Math.round(b); }));
  if (!f.id.includes("profile") && fill.some((b) => b > 1073 || b < 900)) console.warn("  ⚠ 내용 끝 위치", f.id, fill.join(", "));
  await tp.setContent(doc(f.html()), { waitUntil: "load" });
  writeFileSync(join(out, `thumbs/${f.id}.jpg`), await tp.screenshot({ type: "jpeg", quality: 82, clip: { x: 0, y: 0, width: W, height: H } }));
  console.log("✔", f.id, f.name);
}
await browser.close();
