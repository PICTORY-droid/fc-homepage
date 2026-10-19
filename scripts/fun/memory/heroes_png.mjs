// PPT 표지용 소재 그림(배경 없는 PNG) — 계절 그림 50가지를 팔레트 색으로 그려 투명 PNG 로 저장합니다.
// 실행: PW_PATH=… CHROMIUM_PATH=… node scripts/fun/memory/heroes_png.mjs <입력 json> <출력 폴더>
// 입력 json: [{ id, hero:"sp.cherry", main, soft, dark, pale, accent }]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { pal } from "./base.mjs";
import * as ob from "./objects.mjs";
import { heroes as sp } from "../seasons/spring.mjs";
import { heroes as su } from "../seasons/summer.mjs";
import { heroes as au } from "../seasons/autumn.mjs";
import { heroes as wi } from "../seasons/winter.mjs";

const HERO = { sp, su, au, wi, ob };
const pick = (key) => { const [a, b] = key.split("."); const h = HERO[a]?.[b]; if (!h) throw new Error(`그림 없음: ${key}`); return h; };

const list = JSON.parse(readFileSync(resolve(process.argv[2]), "utf8"));
const out = resolve(process.argv[3]);
mkdirSync(out, { recursive: true });
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve("playwright", { paths: [process.env.PW_PATH ?? process.cwd()] }));
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 700, height: 700 }, deviceScaleFactor: 1.5 });
for (const d of list) {
  const p = pal({ a: d.main, b: d.soft, c: d.accent, d: d.dark, bg: d.pale });
  p.paper = "#FFFFFF";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="-50 -50 400 400">${pick(d.hero)(p)}</svg>`;
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}html,body{background:transparent}svg{display:block}</style>${svg}`, { waitUntil: "load" });
  writeFileSync(join(out, `${d.id}.png`), await page.screenshot({ type: "png", omitBackground: true }));
}
console.log("✔ 소재 그림", list.length, "장");
await browser.close();
