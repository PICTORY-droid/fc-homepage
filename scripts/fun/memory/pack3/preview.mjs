// 소품 미리보기: node preview.mjs <모듈> <출력.png> [열 수]  (PW_PATH, CHROMIUM_PATH 필요)
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { pal } from "../base.mjs";
const [mod, out, colsArg] = process.argv.slice(2);
const m = await import(mod.startsWith(".") ? mod : "./" + mod);
const flat = {}; for (const [k, v] of Object.entries(m)) { if (typeof v === "function") flat[k] = v; else if (Array.isArray(v)) v.forEach((f, i) => { if (typeof f === "function") flat[k + (i + 1)] = f; }); }
const names = Object.keys(flat);
const P = pal({ a: "#6BB6FF", b: "#D6EBFF", c: "#FFB86B", d: "#1F5FA8", bg: "#F3F9FF" });
const P2 = pal({ a: "#F4A6B8", b: "#FDE3EA", c: "#8FD3C0", d: "#B03A5B", bg: "#FFF5F8" });
const cols = +(colsArg || 10), S = 150, rows = Math.ceil(names.length / cols);
const cells = names.map((n, i) => { const p = i % 2 ? P2 : P; return `<g transform="translate(${(i % cols) * S} ${Math.floor(i / cols) * (S + 14)}) scale(${S / 200})"><rect width="200" height="200" fill="${p.b}"/>${flat[n](p)}</g><text x="${(i % cols) * S + 3}" y="${Math.floor(i / cols) * (S + 14) + S + 11}" font-size="10" font-family="Noto Sans CJK KR">${n}</text>`; }).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * S}" height="${rows * (S + 14)}"><rect width="100%" height="100%" fill="#fff"/>${cells}</svg>`;
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve("playwright", { paths: [process.env.PW_PATH ?? process.cwd()] }));
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const pg = await b.newPage({ viewport: { width: cols * S, height: rows * (S + 14) }, deviceScaleFactor: 2 });
await pg.setContent(`<body style="margin:0">${svg}</body>`);
writeFileSync(out, await pg.screenshot());
await b.close();
console.log(names.length);
