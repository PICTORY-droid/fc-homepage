// PPT 표지 배경 그림 — 우표·폴라로이드·항공우편·승차권 네 가지 '옛 우체국' 구도. 글자는 PPT 에서 직접 올리므로 그림에는 글이 거의 없습니다.
// 실행: PW_PATH=… CHROMIUM_PATH=… node scripts/fun/memory/covers.mjs <입력 json> <출력 폴더>
// 입력 json: [{ id, wide(bool), style(0~3), label, mark, main, soft, dark, pale, accent, hero:"sp.cherry" }]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { g, mix } from "../seasons/kit.mjs";
import { pal, txt, SANS, SERIF } from "./base.mjs";
import * as ob from "./objects.mjs";
import { heroes as sp } from "../seasons/spring.mjs";
import { heroes as su } from "../seasons/summer.mjs";
import { heroes as au } from "../seasons/autumn.mjs";
import { heroes as wi } from "../seasons/winter.mjs";

const HERO = { sp, su, au, wi, ob };
const pickHero = (key) => { const [a, b] = key.split("."); const h = HERO[a]?.[b]; if (!h) throw new Error(`그림 없음: ${key}`); return h; };
const rect = (x, y, w, h, fill, rx = 0, ex = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${ex}/>`;
const circ = (cx, cy, r, fill, ex = "") => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${ex}/>`;
const shadow = (x, y, w, h, rx = 6) => rect(x + 8, y + 12, w, h, "#3a2a18", rx, 'opacity=".16"');
const BOX = { w: 640, h: 740 };

/** 한 해 소인 — 안쪽에 2027 */
const postmark = (x, y, s, p, mark, rot = -12, o = 0.6) => {
  const id = `pm${Math.round(x)}${Math.round(y)}`;
  return g(`<defs><path id="${id}" d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0"/></defs>
  <circle cx="100" cy="100" r="92" fill="none" stroke="${p.d}" stroke-width="5" opacity="${o}"/><circle cx="100" cy="100" r="58" fill="none" stroke="${p.d}" stroke-width="3" opacity="${o}"/>
  <text font-size="17" font-weight="800" letter-spacing="2" fill="${p.d}" opacity="${o}" font-family="${SANS}"><textPath href="#${id}">${mark} · 우체국 · ${mark} ·</textPath></text>
  <text x="100" y="99" text-anchor="middle" font-size="26" font-weight="900" fill="${p.d}" opacity="${o}" font-family="${SANS}">2027</text>
  <path d="M54 114 h92 M58 126 h84" stroke="${p.d}" stroke-width="3" stroke-linecap="round" opacity="${o}"/>`, x, y, s, rot);
};
const wave = (x, y, w, p, o = 0.5) => [0, 14, 28, 42].map((dy) => `<path d="M${x} ${y + dy} q22 -12 44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0" fill="none" stroke="${p.d}" stroke-width="4" opacity="${o}" stroke-linecap="round" transform="scale(${w / 352} 1)" />`).join("");
const tape = (x, y, w, p, rot = -6) => g(`<rect width="${w}" height="38" fill="${p.c}" opacity=".7"/><path d="M0 0 l5 6 l-5 6 l5 6 l-5 6 l5 6 l-5 6Z M${w} 0 l-5 6 l5 6 l-5 6 l5 6 l-5 6 l5 6Z" fill="${p.paper}" opacity=".8"/>`, x, y, 1, rot);

const ART = [
  // 0 — 큰 우표 + 소인
  (h, p, o) => `${g(`${shadow(0, 0, 400, 500)}${rect(0, 0, 400, 500, p.a)}${rect(24, 24, 352, 392, p.paper)}${rect(24, 24, 352, 392, p.b, 0, 'opacity=".55"')}${g(h(p), 200 - 150, 220 - 150, 1.5)}
    ${rect(0, 0, 400, 500, "none", 0, `stroke="${p.paper}" stroke-width="16" stroke-dasharray="0 20" stroke-linecap="round"`)}
    <text x="376" y="474" text-anchor="end" font-size="40" font-weight="900" fill="#fff" font-family="${SANS}">300</text><text x="24" y="474" font-size="20" font-weight="700" fill="#fff" letter-spacing="4" font-family="${SANS}">KOREA</text>`, 130, 100, 1, 3)}
    ${postmark(40, 330, 1.7, p, o.mark)}${wave(330, 200, 300, p)}`,
  // 1 — 폴라로이드 두 장
  (h, p, o) => `${g(`${shadow(0, 0, 400, 470)}${rect(0, 0, 400, 470, "#fffdf8")}${rect(24, 24, 352, 352, p.b)}`, 170, 70, 1, 8)}
    ${g(`${shadow(0, 0, 440, 520)}${rect(0, 0, 440, 520, "#fffdf8")}${rect(26, 26, 388, 388, p.b)}${rect(26, 26, 388, 388, p.paper, 0, 'opacity=".35"')}${g(h(p), 220 - 140, 220 - 140, 1.4)}${rect(26, 26, 388, 388, "none", 0, 'stroke="#00000012"')}
      <text x="220" y="478" text-anchor="middle" font-size="26" fill="${p.ink}" opacity=".7" font-family="${SERIF}">2027 .</text>`, 80, 120, 1, -5)}
    ${tape(190, 96, 150, p, -6)}${postmark(400, 520, 1.1, p, o.mark, 10, 0.45)}`,
  // 2 — 항공우편 줄무늬 카드
  (h, p, o) => `<defs><pattern id="am" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="40" height="40" fill="${p.paper}"/><rect width="20" height="40" fill="${p.a}"/><rect x="20" width="10" height="40" fill="${p.c}"/></pattern></defs>
    ${g(`${shadow(0, 0, 500, 620)}${rect(0, 0, 500, 620, "url(#am)")}${rect(24, 24, 452, 572, p.paper)}${rect(24, 24, 452, 572, p.b, 0, 'opacity=".4"')}
      <text x="250" y="86" text-anchor="middle" font-size="19" font-weight="800" letter-spacing="6" fill="${p.a}" font-family="${SANS}">PAR AVION  ·  항 공 우 편</text>
      ${g(h(p), 250 - 170, 320 - 170, 1.7)}${rect(60, 540, 380, 3, p.d, 0, 'opacity=".35"')}`, 80, 70, 1, 2)}
    ${postmark(340, 430, 1.25, p, o.mark, -10, 0.5)}`,
  // 3 — 승차권 조각
  (h, p, o) => `${g(`${shadow(0, 0, 360, 640, 14)}${rect(0, 0, 360, 640, p.a, 14)}${rect(18, 18, 324, 604, p.paper, 8)}
      <text x="180" y="66" text-anchor="middle" font-size="20" font-weight="800" letter-spacing="10" fill="${p.a}" font-family="${SANS}">승 차 권</text>
      ${circ(180, 270, 128, p.b)}${g(h(p), 180 - 125, 270 - 125, 1.25)}
      <path d="M18 450 H342" stroke="${p.a}" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/>${circ(0, 450, 20, "#00000000")}
      <text x="180" y="506" text-anchor="middle" font-size="28" font-weight="800" fill="${p.d}" font-family="${SERIF}">2027 · ${o.mark}</text>
      ${Array.from({ length: 28 }, (_, i) => rect(40 + i * 10.4, 540, i % 3 === 0 ? 5 : 3, 54, p.d, 0, 'opacity=".7"')).join("")}`, 140, 50, 1, -3)}
    ${postmark(10, 520, 1.3, p, o.mark, -12, 0.45)}`,
];

const bgSvg = (w, h, p, id) => `<defs>
  <filter id="gr${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${3 + (id % 9)}"/><feColorMatrix type="matrix" values="0 0 0 0 .42  0 0 0 0 .32  0 0 0 0 .2  0 0 0 .5 -.1"/></filter>
  <radialGradient id="vg${id}" cx="50%" cy="48%" r="78%"><stop offset=".6" stop-color="#6b4a2b" stop-opacity="0"/><stop offset="1" stop-color="#6b4a2b" stop-opacity=".18"/></radialGradient></defs>`;

export const cover = (d, i) => {
  const w = d.wide ? 1600 : 1000, h = d.wide ? 900 : 1000;
  const p = pal({ a: mix(d.main, "#a8894f", 0.16), b: d.soft, c: mix(d.accent, "#c9a05a", 0.25), d: d.dark, bg: d.pale });
  const hero = pickHero(d.hero);
  const art = ART[d.style](hero, p, d);
  const place = d.wide ? `translate(${w - BOX.w * 1.18 - 70} ${(h - BOX.h * 1.18) / 2}) scale(1.18)` : `translate(${(w - BOX.w * 0.66) / 2 - 30} ${h - BOX.h * 0.66 - 50}) scale(.66)`;
  const label = d.wide
    ? txt(112, 100, d.label, { size: 22, weight: 700, fill: p.d, spacing: 8, opacity: 0.7, serif: false }) + rect(112, 120, 64, 3, p.a) + txt(112, h - 70, "우체국보험 상담 안내  ·  2027", { size: 17, fill: p.d, spacing: 3, opacity: 0.5, serif: false })
    : txt(100, 90, d.label, { size: 22, weight: 700, fill: p.d, spacing: 8, opacity: 0.7, serif: false }) + rect(100, 110, 64, 3, p.a);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${bgSvg(w, h, p, i)}
    ${rect(0, 0, w, h, p.paper)}${rect(0, 0, w, h, p.b, 0, 'opacity=".22"')}${label}<g transform="${place}">${art}</g>
    <rect width="${w}" height="${h}" filter="url(#gr${i})" opacity=".5"/><rect width="${w}" height="${h}" fill="url(#vg${i})"/></svg>`;
};

if (process.argv[1] && process.argv[1].endsWith("covers.mjs")) {
  const list = JSON.parse(readFileSync(resolve(process.argv[2]), "utf8"));
  const out = resolve(process.argv[3]);
  mkdirSync(out, { recursive: true });
  const require = createRequire(import.meta.url);
  const { chromium } = require(require.resolve("playwright", { paths: [process.env.PW_PATH ?? process.cwd()] }));
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2 });
  let n = 0;
  for (const d of list) {
    const w = d.wide ? 1600 : 1000, h = d.wide ? 900 : 1000;
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}html,body{width:${w}px;height:${h}px;overflow:hidden}svg{display:block}</style>${cover(d, ++n)}`, { waitUntil: "load" });
    writeFileSync(join(out, `${d.id}.jpg`), await page.screenshot({ type: "jpeg", quality: 90 }));
  }
  console.log("✔ 표지", n, "장");
  await browser.close();
}
