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

/** 도장(소인)은 글자가 그림에 굳어 수정할 수 없어 쓰지 않는다 */
const postmark = () => "";
const wave = (x, y, w, p, o = 0.5) => [0, 14, 28, 42].map((dy) => `<path d="M${x} ${y + dy} q22 -12 44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0" fill="none" stroke="${p.d}" stroke-width="4" opacity="${o}" stroke-linecap="round" transform="scale(${w / 352} 1)" />`).join("");
const tape = (x, y, w, p, rot = -6) => g(`<rect width="${w}" height="38" fill="${p.c}" opacity=".7"/><path d="M0 0 l5 6 l-5 6 l5 6 l-5 6 l5 6 l-5 6Z M${w} 0 l-5 6 l5 6 l-5 6 l5 6 l-5 6 l5 6Z" fill="${p.paper}" opacity=".8"/>`, x, y, 1, rot);

const ART = [
  // 0 — 큰 우표 + 소인
  (h, p, o) => `${g(`${shadow(0, 0, 400, 500)}${rect(0, 0, 400, 500, p.a)}${rect(24, 24, 352, 392, p.paper)}${rect(24, 24, 352, 392, p.b, 0, 'opacity=".55"')}${g(h(p), 200 - 150, 220 - 150, 1.5)}
    ${rect(0, 0, 400, 500, "none", 0, `stroke="${p.paper}" stroke-width="16" stroke-dasharray="0 20" stroke-linecap="round"`)}`, 130, 100, 1, 3)}
    ${postmark(40, 330, 1.7, p, o.mark)}${wave(330, 200, 300, p)}`,
  // 1 — 폴라로이드 두 장
  (h, p, o) => `${g(`${shadow(0, 0, 400, 470)}${rect(0, 0, 400, 470, "#fffdf8")}${rect(24, 24, 352, 352, p.b)}`, 170, 70, 1, 8)}
    ${g(`${shadow(0, 0, 440, 520)}${rect(0, 0, 440, 520, "#fffdf8")}${rect(26, 26, 388, 388, p.b)}${rect(26, 26, 388, 388, p.paper, 0, 'opacity=".35"')}${g(h(p), 220 - 140, 220 - 140, 1.4)}${rect(26, 26, 388, 388, "none", 0, 'stroke="#00000012"')}`, 80, 120, 1, -5)}
    ${tape(190, 96, 150, p, -6)}${postmark(400, 520, 1.1, p, o.mark, 10, 0.45)}`,
  // 2 — 항공우편 줄무늬 카드
  (h, p, o) => `<defs><pattern id="am" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="40" height="40" fill="${p.paper}"/><rect width="20" height="40" fill="${p.a}"/><rect x="20" width="10" height="40" fill="${p.c}"/></pattern></defs>
    ${g(`${shadow(0, 0, 500, 620)}${rect(0, 0, 500, 620, "url(#am)")}${rect(24, 24, 452, 572, p.paper)}${rect(24, 24, 452, 572, p.b, 0, 'opacity=".4"')}
      ${g(h(p), 250 - 170, 320 - 170, 1.7)}${rect(60, 540, 380, 3, p.d, 0, 'opacity=".35"')}`, 80, 70, 1, 2)}
    ${postmark(340, 430, 1.25, p, o.mark, -10, 0.5)}`,
  // 3 — 승차권 조각
  (h, p, o) => `${g(`${shadow(0, 0, 360, 640, 14)}${rect(0, 0, 360, 640, p.a, 14)}${rect(18, 18, 324, 604, p.paper, 8)}
      ${circ(180, 270, 128, p.b)}${g(h(p), 180 - 125, 270 - 125, 1.25)}
      <path d="M18 450 H342" stroke="${p.a}" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/>${circ(0, 450, 20, "#00000000")}
      <text x="180" y="506" text-anchor="middle" font-size="28" font-weight="800" fill="${p.d}" font-family="${SERIF}"></text>
      ${Array.from({ length: 28 }, (_, i) => rect(40 + i * 10.4, 540, i % 3 === 0 ? 5 : 3, 54, p.d, 0, 'opacity=".7"')).join("")}`, 140, 50, 1, -3)}
    ${postmark(10, 520, 1.3, p, o.mark, -12, 0.45)}`,
];

const bgSvg = (w, h, p, id) => `<defs>
  <filter id="gr${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${3 + (id % 9)}"/><feColorMatrix type="matrix" values="0 0 0 0 .42  0 0 0 0 .32  0 0 0 0 .2  0 0 0 .5 -.1"/></filter>
  <radialGradient id="vg${id}" cx="50%" cy="48%" r="78%"><stop offset=".6" stop-color="#6b4a2b" stop-opacity="0"/><stop offset="1" stop-color="#6b4a2b" stop-opacity=".18"/></radialGradient></defs>`;

const sr = (seed) => { let v = seed * 9301 + 49297; return () => ((v = (v * 9301 + 49297) % 233280) / 233280); };

/** 봄 — 싱그러운 연두빛 공기 + 흩날리는 꽃잎·새잎 + 햇살 */
const springBg = (w, h, p, i) => {
  const r = sr(i + 7);
  const petals = Array.from({ length: 26 }, () => { const x = r() * w, y = r() * h, s = 0.6 + r() * 1.1, rot = r() * 360; return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s.toFixed(2)})" opacity="${(0.35 + r() * 0.45).toFixed(2)}"><ellipse rx="9" ry="14" fill="${r() > 0.35 ? p.b : p.a}"/><path d="M0 -14 q3 14 0 28" stroke="#fff" stroke-width="1.2" fill="none" opacity=".6"/></g>`; }).join("");
  const leaves = Array.from({ length: 12 }, () => { const x = r() * w, y = r() * h, s = 0.7 + r() * 1.0, rot = r() * 360; return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s.toFixed(2)})" opacity="${(0.35 + r() * 0.35).toFixed(2)}"><path d="M0 -16 C12 -8 12 8 0 16 C-12 8 -12 -8 0 -16Z" fill="#8CC97B"/><path d="M0 -14 V14" stroke="#fff" stroke-width="1.3" opacity=".7"/></g>`; }).join("");
  return `<defs><linearGradient id="sg${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3FBE6"/><stop offset=".55" stop-color="#FFFFFF"/><stop offset="1" stop-color="${mix(p.b, "#FFFFFF", 0.65)}"/></linearGradient>
    <radialGradient id="sun${i}" cx=".12" cy=".08" r=".75"><stop offset="0" stop-color="#FFF6C2" stop-opacity=".95"/><stop offset=".5" stop-color="#FFF6C2" stop-opacity=".25"/><stop offset="1" stop-color="#FFF6C2" stop-opacity="0"/></radialGradient></defs>
    ${rect(0, 0, w, h, `url(#sg${i})`)}${rect(0, 0, w, h, `url(#sun${i})`)}${leaves}${petals}`;
};

/** 여름 — 맑고 시원한 하늘빛 + 물결·물방울·빛줄기 */
const summerBg = (w, h, p, i) => {
  const r = sr(i + 11);
  const bubbles = Array.from({ length: 18 }, () => { const x = r() * w, y = r() * h * 0.85, rr = 6 + r() * 26; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rr.toFixed(0)}" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-opacity=".8" stroke-width="2"/><circle cx="${(x - rr * 0.3).toFixed(0)}" cy="${(y - rr * 0.3).toFixed(0)}" r="${(rr * 0.22).toFixed(1)}" fill="#fff" opacity=".9"/>`; }).join("");
  const wv = (y, c, o, amp) => `<path d="M0 ${y} ${Array.from({ length: 9 }, (_, k) => `Q${(k * 2 + 1) * w / 16} ${y + (k % 2 ? amp : -amp)} ${(k + 1) * w / 8} ${y}`).join(" ")} V${h} H0Z" fill="${c}" opacity="${o}"/>`;
  return `<defs><linearGradient id="sg${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4F6FB"/><stop offset=".6" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D6F0F5"/></linearGradient>
    <linearGradient id="ray${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    ${rect(0, 0, w, h, `url(#sg${i})`)}
    <g opacity=".7"><path d="M${w * 0.05} 0 L${w * 0.26} 0 L${w * 0.5} ${h} L${w * 0.2} ${h}Z" fill="url(#ray${i})"/><path d="M${w * 0.3} 0 L${w * 0.4} 0 L${w * 0.62} ${h} L${w * 0.5} ${h}Z" fill="url(#ray${i})"/></g>
    ${bubbles}${wv(h * 0.86, "#9ED8E6", 0.45, 22)}${wv(h * 0.9, "#6CC3D8", 0.4, 18)}${wv(h * 0.95, "#3FAFCB", 0.35, 14)}`;
};

/** 가을 — 맑고 높은 하늘빛 공기 + 따뜻한 햇살 + 선명한 단풍·은행잎이 가볍게 흩날리는 배경 */
const autumnBg = (w, h, p, i) => {
  const r = sr(i + 17);
  const cols = [p.a, p.b, "#FFC93C", "#FF8A5B", mix(p.a, "#FFFFFF", 0.35)];
  const leaves = Array.from({ length: 22 }, () => { const x = r() * w, y = r() * h, s = 0.7 + r() * 1.1, rot = r() * 360; return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${s.toFixed(2)})" opacity="${(0.45 + r() * 0.45).toFixed(2)}"><path d="M0 -18 C14 -10 14 10 0 20 C-14 10 -14 -10 0 -18Z" fill="${cols[Math.floor(r() * cols.length)]}"/><path d="M0 -14 V18" stroke="#fff" stroke-opacity=".6" stroke-width="2"/></g>`; }).join("");
  const dots = Array.from({ length: 16 }, () => `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(3 + r() * 7).toFixed(0)}" fill="#fff" opacity="${(0.5 + r() * 0.4).toFixed(2)}"/>`).join("");
  return `<defs><linearGradient id="sg${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F4FF"/><stop offset=".5" stop-color="#FFFFFF"/><stop offset="1" stop-color="${mix(p.b, "#FFFFFF", 0.55)}"/></linearGradient>
    <radialGradient id="sun${i}" cx=".88" cy=".08" r=".7"><stop offset="0" stop-color="#FFF1B8" stop-opacity=".95"/><stop offset=".55" stop-color="#FFF1B8" stop-opacity=".25"/><stop offset="1" stop-color="#FFF1B8" stop-opacity="0"/></radialGradient></defs>
    ${rect(0, 0, w, h, `url(#sg${i})`)}${rect(0, 0, w, h, `url(#sun${i})`)}${dots}${leaves}`;
};

/** 겨울 — 맑은 얼음빛 하늘 + 반짝이는 눈송이 + 포근한 흰 눈언덕 */
const winterBg = (w, h, p, i) => {
  const r = sr(i + 23);
  const flakes = Array.from({ length: 34 }, () => { const x = r() * w, y = r() * h * 0.9, rr = 3 + r() * 11; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rr.toFixed(0)}" fill="#fff" fill-opacity="${(0.7 + r() * 0.3).toFixed(2)}" stroke="#BFE2FF" stroke-opacity=".8" stroke-width="1.5"/>`; }).join("");
  const stars = Array.from({ length: 9 }, () => { const x = r() * w, y = r() * h * 0.8, s = 0.6 + r() * 1.0; return `<path transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)})" d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4Z" fill="#fff" stroke="${mix(p.a, "#8CCBFF", 0.5)}" stroke-opacity=".55" stroke-width="1.5"/>`; }).join("");
  const hill = (y, c, o, amp) => `<path d="M0 ${y} C${w * 0.25} ${y - amp} ${w * 0.55} ${y + amp} ${w} ${y - amp * 0.4} V${h} H0Z" fill="${c}" opacity="${o}"/>`;
  return `<defs><linearGradient id="sg${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDF0FF"/><stop offset=".55" stop-color="#F7FBFF"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient></defs>
    ${rect(0, 0, w, h, `url(#sg${i})`)}${stars}${flakes}${hill(h * 0.9, "#D2E9FA", 0.7, 26)}${hill(h * 0.95, "#FFFFFF", 0.95, 20)}`;
};

export const cover = (d, i) => {
  const w = d.wide ? 1600 : 1000, h = d.wide ? 900 : 1000;
  const fresh = true; // 네 계절 모두 맑고 깨끗한 색감
  const p = pal({ a: d.main, b: d.soft, c: d.accent, d: d.dark, bg: d.pale });
  p.paper = "#FFFFFF"; p.ink = mix(d.dark, "#1f2a2a", 0.4);
  const hero = pickHero(d.hero);
  const art = ART[d.style](hero, p, d);
  const place = d.wide ? `translate(${w - BOX.w * 1.18 - 70} ${(h - BOX.h * 1.18) / 2}) scale(1.18)` : `translate(${(w - BOX.w * 0.66) / 2 - 30} ${h - BOX.h * 0.66 - 50}) scale(.66)`;
  const label = d.wide
    ? txt(112, 100, d.label, { size: 22, weight: 700, fill: p.d, spacing: 8, opacity: 0.7, serif: false }) + rect(112, 120, 64, 3, p.a) + txt(112, d.season === "여름" ? h - 150 : h - 70, "반딧불이의 곳간", { size: 17, fill: p.d, spacing: 3, opacity: 0.5, serif: false })
    : txt(100, 90, d.label, { size: 22, weight: 700, fill: p.d, spacing: 8, opacity: 0.7, serif: false }) + rect(100, 110, 64, 3, p.a);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${bgSvg(w, h, p, i)}
    ${{ 봄: springBg, 여름: summerBg, 가을: autumnBg, 겨울: winterBg }[d.season](w, h, p, i)}${label}<g transform="${place}">${art}</g>
    ${fresh ? "" : `<rect width="${w}" height="${h}" filter="url(#gr${i})" opacity=".5"/><rect width="${w}" height="${h}" fill="url(#vg${i})"/>`}</svg>`;
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
