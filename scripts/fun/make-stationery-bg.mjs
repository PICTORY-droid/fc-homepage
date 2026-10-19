// Word 편지지용 배경 그림 생성 — 받는 사람·날짜·보내는 사람 글자를 뺀 그림(글쓰기 줄 포함)을 JPG 로 저장합니다.
// 실행: PW_PATH=<playwright 폴더> CHROMIUM_PATH=<크롬 경로> node scripts/fun/make-stationery-bg.mjs <출력 폴더>
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { designs, W, H, setBare } from "./stationery-art.mjs";

const ROOT = new URL("../../", import.meta.url).pathname;
const out = resolve(process.argv[2] ?? "");
if (!process.argv[2]) { console.error("출력 폴더를 지정하세요."); process.exit(1); }
mkdirSync(out, { recursive: true });
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve("playwright", { paths: [ROOT, process.env.PW_PATH ?? ROOT] }));
setBare(true);
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const p = await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 })).newPage();
for (const d of designs) {
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box;margin:0}html,body{width:${W}px;height:${H}px;font-family:"Pretendard","Noto Sans CJK KR",sans-serif}.sheet{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style><div class="sheet">${d.html()}</div>`, { waitUntil: "load" });
  writeFileSync(join(out, `${d.id}.jpg`), await p.screenshot({ type: "jpeg", quality: 90 }));
  console.log("✔", d.id);
}
await browser.close();
