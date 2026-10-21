// 카카오톡·SNS 공유용 미리보기 이미지(1200x630) 생성 — 결과: public/og/<상품ID>.png, public/og/default.png
// 카드 = 왼쪽 글(분류·상품명·핵심 문구·태그) + 오른쪽 상품 일러스트 + 길잡이 캐릭터·사이트 이름
//
// 실행 순서
//  1) npm run build && npx next start -p 3111      (일러스트를 사이트 화면에서 가져옵니다)
//  2) 다른 터미널에서: OG_BASE_URL=http://localhost:3111 node scripts/make-og.mjs
//     - playwright 가 없으면 npm i -D playwright (최초 1회), PW_PATH=playwright 설치 폴더(선택), CHROMIUM_PATH=크롬 경로(선택)
// 상품·문구·일러스트가 바뀌었을 때만 다시 실행하면 됩니다.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const BASE = process.env.OG_BASE_URL;
if (!BASE) {
  console.error("✖ OG_BASE_URL 이 필요합니다. 예) OG_BASE_URL=http://localhost:3111 node scripts/make-og.mjs");
  process.exit(1);
}
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve("playwright", { paths: [ROOT, process.env.PW_PATH ?? ROOT] }));

const products = JSON.parse(readFileSync(join(ROOT, "src/config/products.data.json"), "utf8"));
const src = readFileSync(join(ROOT, "src/config/products.ts"), "utf8");
const slogans = {};
for (const m of src.matchAll(/(P\d{3}):\s*\{\s*tags:\s*\[([^\]]*)\],\s*headline:\s*"([^"]+)"/g)) {
  slogans[m[1]] = { tags: [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]), headline: m[3] };
}

// 하단 표시 — 우체국 CI 대신 사이트의 길잡이 캐릭터(src/components/chatbot/ChatCharacter.tsx 와 같은 그림)와 사이트 이름
const CHAR = `<svg viewBox="0 0 200 180" height="56" xmlns="http://www.w3.org/2000/svg"><rect x="35" y="55" width="130" height="100" rx="18" fill="#fff" stroke="#E8591A" stroke-width="5"/><path d="M45 52 Q100 14 155 52 Z" fill="#E8591A"/><rect x="40" y="48" width="120" height="9" rx="4" fill="#C4540A"/><circle cx="100" cy="36" r="9" fill="#FFDAC1" stroke="#C4540A" stroke-width="3"/><path d="M40 150 L72 128 M160 150 L128 128" stroke="#E8591A" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="78" cy="100" r="5.5" fill="#333"/><circle cx="122" cy="100" r="5.5" fill="#333"/><path d="M90 112 Q100 122 110 112" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/><circle cx="64" cy="112" r="7" fill="#FF883A" opacity=".5"/><circle cx="136" cy="112" r="7" fill="#FF883A" opacity=".5"/></svg>`;
const COLOR = { 보장성: "#E8591A", 저축성: "#C98A0B", 연금: "#2F7D5B" };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function card({ chip, title, sub, tags = [], color, scene }) {
  // 공백 없이 이어지는 가장 긴 덩어리가 글 영역(약 600px)에 들어가도록 글자 크기를 맞춥니다.
  const unit = (ch) => (/[\u3131-\uD79D]/.test(ch) ? 1 : /[A-Za-z0-9]/.test(ch) ? 0.62 : 0.4);
  const widest = Math.max(...title.split(/\s+/).map((w) => [...w].reduce((a, c) => a + unit(c), 0)));
  const size = Math.max(44, Math.min(74, Math.floor(590 / (widest * 0.96))));
  return `<!doctype html><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0}body{width:1200px;height:630px;font-family:"Pretendard","Noto Sans CJK KR","Malgun Gothic",sans-serif;background:#FFF8EE;position:relative;overflow:hidden;color:#333;word-break:keep-all}
  .c1{position:absolute;right:-140px;top:-160px;width:560px;height:560px;border-radius:50%;background:${color};opacity:.14}
  .c2{position:absolute;left:300px;bottom:-240px;width:420px;height:420px;border-radius:50%;background:#FF883A;opacity:.14}
  .wrap{position:absolute;left:72px;top:64px;width:640px;bottom:56px;display:flex;flex-direction:column}
  .chip{display:inline-block;align-self:flex-start;background:${color};color:#fff;font-weight:800;font-size:26px;padding:8px 24px;border-radius:999px}
  h1{margin-top:28px;font-size:${size}px;line-height:1.2;font-weight:900;color:#2B2118;overflow-wrap:anywhere}
  .sub{margin-top:20px;font-size:32px;line-height:1.4;color:#5a4b3f;font-weight:600}
  .tags{margin-top:24px;display:flex;gap:12px}.tags span{background:#fff;border:2px solid #EADFD2;border-radius:999px;padding:6px 20px;font-size:25px;color:#6b5b4d;font-weight:700}
  .foot{margin-top:auto;display:flex;align-items:center;gap:14px}.foot svg{display:block}.foot b{font-size:30px;font-weight:900;color:#2B2118}
  .panel{position:absolute;right:64px;top:80px;width:430px;height:470px;border-radius:44px;background:#FFF4EC;box-shadow:0 10px 40px rgba(196,84,10,.18);display:flex;align-items:center;justify-content:center;overflow:hidden}
  .panel img{width:100%;height:100%;object-fit:contain}
  </style><div class="c1"></div><div class="c2"></div><div class="wrap">
  <span class="chip">${esc(chip)}</span><h1>${esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}
  ${tags.length ? `<div class="tags">${tags.map((t) => `<span>#${esc(t)}</span>`).join("")}</div>` : ""}
  <div class="foot">${CHAR}<b>우체국보험 길잡이</b></div></div>
  <div class="panel">${scene ? `<img src="${scene}" alt="">` : ""}</div>`;
}

mkdirSync(join(ROOT, "public/og"), { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const shot = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const web = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

// 사이트 화면에서 일러스트(그림 부분만)를 이미지로 가져옵니다. 애니메이션이 끝난 뒤에 찍습니다.
async function grabScene(path, selector) {
  await web.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await web.addStyleTag({ content: 'section[aria-label="대표 상품 안내"]{background:#FFF4EC!important}' }); // 홈 배너 배경 줄무늬 제거
  const el = web.locator(selector).first();
  await el.waitFor({ state: "visible", timeout: 15000 });
  await web.waitForTimeout(2500);
  return `data:image/png;base64,${(await el.screenshot({ type: "png" })).toString("base64")}`;
}

const jobs = [
  ["default", { chip: "우체국보험 길잡이", title: "필요한 보장을 함께 살펴보세요", sub: "가입 조건부터 보험금 지급사유까지 쉽게 정리했어요", color: "#E8591A" }, ["/", 'section[aria-label="대표 상품 안내"] svg']],
  ...products.map((p) => [
    p.id,
    { chip: `${p.group} 보험`, title: p.name, sub: slogans[p.id]?.headline, tags: slogans[p.id]?.tags, color: COLOR[p.group] ?? "#E8591A" },
    [`/products/${p.id}`, 'div[class*="aspect-[9/16]"] div.flex-1'],
  ]),
];
for (const [name, data, [path, selector]] of jobs) {
  let scene = "";
  try {
    scene = await grabScene(path, selector);
  } catch (e) {
    console.warn(`⚠ ${name}: 일러스트를 가져오지 못해 그림 없이 만듭니다 (${e.message.split("\n")[0]})`);
  }
  await shot.setContent(card({ ...data, scene }), { waitUntil: "load" });
  writeFileSync(join(ROOT, `public/og/${name}.png`), await shot.screenshot({ type: "png" }));
}
await browser.close();
console.log(`✔ OG 이미지 ${jobs.length}개 생성`);
