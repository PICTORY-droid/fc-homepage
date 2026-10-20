// 한국 전통문화 그림 도구 — 200x200 칸, 오리지널 SVG (납작한 파스텔 + 오방색을 부드럽게)
import { circle, ellipse, rect, path, g, star, mix, rng } from "../pack2/sc_kit.mjs";
export { circle, ellipse, rect, path, g, star, mix, rng };
export const C = { red: "#e4574f", blue: "#4f7fd0", yel: "#f3c24f", wht: "#fffaf0", blk: "#34343f", grn: "#5fb36f", pnk: "#f4a6b8", org: "#f59a4a", pur: "#9b7fd8", brn: "#a8794f", dbrn: "#7a5338", gry: "#c9ced8", sky: "#bfe3f5", cream: "#fff3d6", tan: "#e8c99a", navy: "#34457a", jade: "#7cc8b0", mint: "#bfe8d4", rose: "#e8798f", lav: "#c9b6ee", gold: "#e8b04a" };
export const shd = (y = 178, rx = 52) => ellipse(100, y, rx, 7, "#2b3a67", 'opacity=".10"');
export const dark = (c, t = 0.18) => mix(c, "#000000", t);
export const lite = (c, t = 0.3) => mix(c, "#ffffff", t);
/** 반짝이는 작은 점들 */
export const dots = (n, seed, x1, x2, y1, y2, c, r = 2) => { const q = rng(seed); return Array.from({ length: n }, () => circle(x1 + q() * (x2 - x1), y1 + q() * (y2 - y1), r * (0.6 + q() * 0.8), c)).join(""); };
export const leaf = (x, y, s, c = C.grn, r = 0) => g(path("M0 0 Q10 -10 0 -24 Q-10 -10 0 0Z", c) + path("M0 -2 V-20", "none", dark(c, 0.15), 1), x, y, s, r);
export const flw = (x, y, r, c, m = C.yel) => [0, 1, 2, 3, 4].map((i) => { const a = (i * 72 - 90) * Math.PI / 180; return circle(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, r * 0.55, c); }).join("") + circle(x, y, r * 0.4, m);
export const steam = (x, y, c = "#ffffff") => [0, 1, 2].map((i) => path(`M${x - 14 + i * 14} ${y} q-6 -10 0 -18 q6 -8 0 -16`, "none", c, 3, 'opacity=".8"')).join("");

// ── 그릇 틀 ──────────────────────────────────────────────
/** 위에서 본 접시/그릇: 테두리색, 안쪽색, 내용물 */
export const dish = (rim, inner, content = "", r = 64) => circle(100, 104, r + 3, "#2b3a67", 'opacity=".09"') + circle(100, 100, r, rim) + circle(100, 100, r - 8, inner) + circle(100, 100, r - 8, "none", `stroke="${dark(rim, 0.08)}" stroke-width="1.5" opacity=".6"`) + content;
/** 옆에서 본 사발: 그릇색, 국물색, 내용물(국물 위), 김 */
export const bowl = (c, soup, top = "", s = true, w = 62) => shd(172, w) + path(`M${100 - w} 98 H${100 + w} Q${100 + w - 6} 160 100 164 Q${100 - w + 6} 160 ${100 - w} 98Z`, c) + path(`M${100 - w + 8} 140 Q100 150 ${100 + w - 8} 140`, "none", dark(c, 0.12), 3, 'opacity=".5"') + rect(100 - 24, 162, 48, 8, dark(c, 0.15), 3) + ellipse(100, 98, w, 14, dark(c, 0.1)) + ellipse(100, 98, w - 6, 11, soup) + top + (s ? steam(100, 80) : "");
/** 소반(작은 상) 위에 올림 */
export const tray = (c = C.dbrn) => ellipse(100, 166, 70, 12, "#2b3a67", 'opacity=".10"') + rect(30, 150, 140, 12, c, 5) + rect(46, 160, 8, 18, dark(c, 0.15)) + rect(146, 160, 8, 18, dark(c, 0.15));
/** 뚝배기 */
export const ttukbae = (soup = "#d9503a", top = "", s = true) => bowl("#6b4a3a", soup, top, s, 56);
export const scatter = (n, seed, cx, cy, rad, fn) => { const q = rng(seed); return Array.from({ length: n }, () => { const a = q() * 6.283, d = Math.sqrt(q()) * rad; return fn(cx + Math.cos(a) * d, cy + Math.sin(a) * d, q()); }).join(""); };
export const sesame = (n, seed, cx, cy, rad, c = "#fff6d8") => scatter(n, seed, cx, cy, rad, (x, y, k) => ellipse(x, y, 2.4, 1.4, c, `transform="rotate(${Math.round(k * 180)} ${x.toFixed(1)} ${y.toFixed(1)})"`));
export const rod = (x, y, w, h, c, rot = 0) => g(rect(-w / 2, -h / 2, w, h, c, Math.min(w, h) / 2), x, y, 1, rot);
export const chop = (c = "#a8794f") => g(rect(0, 0, 4, 70, c, 2) + rect(9, 0, 4, 70, c, 2), 150, 40, 1, 24);
