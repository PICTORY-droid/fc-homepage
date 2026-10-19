// PPT 배경 — 테마마다 다른 '번지는 빛(메시 그라데이션)' + 고운 입자 + 얇은 선 장식을 JPG 로 만듭니다.
// 실행: PW_PATH=… CHROMIUM_PATH=… node scripts/fun/memory/mesh_bg.mjs <입력 json> <출력 폴더>
// 입력 json: [{ id, wide(bool), seed, base, colors:[hex×5], line:"#fff", deco:"rings|arc|lines|dots|cross|grid|orbit", soft(0~1: 내용 쪽은 1) }]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

const rng = (seed) => { let v = (seed * 9301 + 49297) % 233280; return () => ((v = (v * 9301 + 49297) % 233280) / 233280); };

function decoSvg(kind, w, h, r, line) {
  const L = (o) => `stroke="${line}" stroke-opacity="${o}" fill="none"`;
  const cx = w * (0.15 + r() * 0.7), cy = h * (0.15 + r() * 0.7);
  if (kind === "rings") return [1, 2, 3, 4].map((k) => `<circle cx="${cx}" cy="${cy}" r="${h * (0.14 + k * 0.1)}" ${L(0.55 - k * 0.08)} stroke-width="2"/>`).join("");
  if (kind === "arc") return `<path d="M${-w * 0.1} ${h * (0.6 + r() * 0.3)} Q${w * 0.5} ${-h * (0.1 + r() * 0.3)} ${w * 1.1} ${h * (0.5 + r() * 0.4)}" ${L(0.7)} stroke-width="3"/><path d="M${-w * 0.1} ${h * 0.7 + 26} Q${w * 0.5} ${h * 0.1 + 26} ${w * 1.1} ${h * 0.6 + 26}" ${L(0.4)} stroke-width="2"/>`;
  if (kind === "lines") return Array.from({ length: 14 }, (_, k) => `<path d="M${w * (k / 14) - h * 0.2} ${h} L${w * (k / 14) + h * 0.5} 0" ${L(0.28)} stroke-width="1.5"/>`).join("");
  if (kind === "dots") return Array.from({ length: 46 }, () => `<circle cx="${r() * w}" cy="${r() * h}" r="${2 + r() * 5}" fill="${line}" fill-opacity="${0.35 + r() * 0.4}"/>`).join("");
  if (kind === "cross") return Array.from({ length: 22 }, () => { const x = r() * w, y = r() * h, s = 7 + r() * 8; return `<path d="M${x - s} ${y}H${x + s}M${x} ${y - s}V${y + s}" ${L(0.6)} stroke-width="2" stroke-linecap="round"/>`; }).join("");
  if (kind === "grid") return Array.from({ length: 9 }, (_, k) => `<path d="M${(w / 9) * k} 0V${h}" ${L(0.22)} stroke-width="1"/>`).join("") + Array.from({ length: 5 }, (_, k) => `<path d="M0 ${(h / 5) * k}H${w}" ${L(0.22)} stroke-width="1"/>`).join("");
  return `<ellipse cx="${w * 0.5}" cy="${h * 0.5}" rx="${w * 0.42}" ry="${h * 0.3}" ${L(0.5)} stroke-width="2" transform="rotate(${-20 + r() * 40} ${w / 2} ${h / 2})"/><ellipse cx="${w * 0.5}" cy="${h * 0.5}" rx="${w * 0.34}" ry="${h * 0.22}" ${L(0.35)} stroke-width="1.5" transform="rotate(${-20 + r() * 40} ${w / 2} ${h / 2})"/>`;
}

export const html = (d) => {
  const w = d.wide ? 1920 : 1200, h = d.wide ? 1080 : 1200;
  const r = rng(d.seed);
  const blobs = d.colors.map((c, k) => {
    const s = (0.5 + r() * 0.45) * Math.max(w, h) * 0.6;
    const x = r() * w - s / 2, y = r() * h - s / 2;
    return `<i style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${s.toFixed(0)}px;height:${s.toFixed(0)}px;background:${c};opacity:${(0.75 + r() * 0.25).toFixed(2)}"></i>`;
  }).join("");
  const rr = rng(d.seed + 77);
  return `<!doctype html><meta charset="utf-8"><style>*{margin:0}html,body{width:${w}px;height:${h}px;overflow:hidden;background:${d.base}}
  .m{position:absolute;inset:0;overflow:hidden;background:${d.base}}.m i{position:absolute;border-radius:50%;filter:blur(${Math.round(Math.max(w, h) * 0.07)}px)}
  .fade{position:absolute;inset:0;background:#fff;opacity:${d.soft}}svg{position:absolute;inset:0}</style>
  <div class="m">${blobs}</div><div class="fade"></div>
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${decoSvg(d.deco, w, h, rr, d.line)}
  <filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${d.seed % 50}"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 -.18"/></filter><rect width="${w}" height="${h}" filter="url(#g)" opacity=".5"/></svg>`;
};

if (process.argv[1] && process.argv[1].endsWith("mesh_bg.mjs")) {
  const list = JSON.parse(readFileSync(resolve(process.argv[2]), "utf8"));
  const out = resolve(process.argv[3]);
  mkdirSync(out, { recursive: true });
  const require = createRequire(import.meta.url);
  const { chromium } = require(require.resolve("playwright", { paths: [process.env.PW_PATH ?? process.cwd()] }));
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  for (const d of list) {
    const w = d.wide ? 1920 : 1200, h = d.wide ? 1080 : 1200;
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(html(d), { waitUntil: "load" });
    writeFileSync(join(out, `${d.id}.jpg`), await page.screenshot({ type: "jpeg", quality: 86 }));
  }
  console.log("✔ 배경", list.length, "장");
  await browser.close();
}
