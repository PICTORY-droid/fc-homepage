// 카카오톡·SNS 공유용 미리보기 이미지(1200x630) 생성 — 결과: public/og/<상품ID>.png, public/og/default.png
// 실행: npm i -D playwright (최초 1회) → node scripts/make-og.mjs
// 상품이 바뀌었을 때만 다시 실행하면 됩니다. (PW_PATH=playwright 설치 폴더, 선택)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve("playwright", { paths: [ROOT, process.env.PW_PATH ?? ROOT] }));

const products = JSON.parse(readFileSync(join(ROOT, "src/config/products.data.json"), "utf8"));
const src = readFileSync(join(ROOT, "src/config/products.ts"), "utf8");
const slogans = {};
for (const m of src.matchAll(/(P\d{3}):\s*\{\s*tags:\s*\[([^\]]*)\],\s*headline:\s*"([^"]+)"/g)) {
  slogans[m[1]] = { tags: [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]), headline: m[3] };
}

const COLOR = { 보장성: "#E8591A", 저축성: "#C98A0B", 연금: "#2F7D5B" };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function card({ chip, title, sub, tags = [], color }) {
  const size = title.length > 20 ? 62 : title.length > 14 ? 72 : 84;
  return `<!doctype html><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0}body{width:1200px;height:630px;font-family:"Pretendard","Noto Sans CJK KR","Malgun Gothic",sans-serif;background:#FFF8EE;position:relative;overflow:hidden;color:#333;word-break:keep-all}
  .c1{position:absolute;right:-140px;top:-160px;width:560px;height:560px;border-radius:50%;background:${color};opacity:.14}
  .c2{position:absolute;right:120px;bottom:-200px;width:420px;height:420px;border-radius:50%;background:#FF883A;opacity:.18}
  .wrap{position:absolute;left:80px;top:70px;right:80px;bottom:60px;display:flex;flex-direction:column}
  .chip{display:inline-block;align-self:flex-start;background:${color};color:#fff;font-weight:800;font-size:28px;padding:10px 26px;border-radius:999px}
  h1{margin-top:34px;font-size:${size}px;line-height:1.18;font-weight:900;color:#2B2118}
  .sub{margin-top:24px;font-size:36px;line-height:1.4;color:#5a4b3f;font-weight:600}
  .tags{margin-top:26px;display:flex;gap:12px}.tags span{background:#fff;border:2px solid #EADFD2;border-radius:999px;padding:6px 20px;font-size:26px;color:#6b5b4d;font-weight:700}
  .foot{margin-top:auto;display:flex;align-items:center;gap:16px;font-size:28px;font-weight:700;color:#2B2118}
  .dot{width:44px;height:44px;border-radius:50%;background:#FF883A;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:26px}
  .note{margin-left:auto;font-size:22px;font-weight:500;color:#8a7a6b}
  </style><div class="c1"></div><div class="c2"></div><div class="wrap">
  <span class="chip">${esc(chip)}</span><h1>${esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}
  ${tags.length ? `<div class="tags">${tags.map((t) => `<span>#${esc(t)}</span>`).join("")}</div>` : ""}
  <div class="foot"><span class="dot">우</span>우체국보험 FC</div></div>`;
}

mkdirSync(join(ROOT, "public/og"), { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const jobs = [
  ["default", { chip: "우체국보험 FC 상담 안내", title: "필요한 보장을 함께 살펴보세요", sub: "가입 조건부터 보험금 지급사유까지 쉽게 정리했어요", color: "#E8591A" }],
  ...products.map((p) => [p.id, { chip: `${p.group} 보험`, title: p.name, sub: slogans[p.id]?.headline, tags: slogans[p.id]?.tags, color: COLOR[p.group] ?? "#E8591A" }]),
];
for (const [name, data] of jobs) {
  await page.setContent(card(data), { waitUntil: "load" });
  writeFileSync(join(ROOT, `public/og/${name}.png`), await page.screenshot({ type: "png" }));
}
await browser.close();
console.log(`✔ OG 이미지 ${jobs.length}개 생성`);
