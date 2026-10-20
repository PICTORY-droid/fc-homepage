// 동물 그림 공통 도구 — 200x200 칸, 오리지널 SVG (캐릭터·상표 없음)
import { circle, ellipse, rect, path, g, star, mix } from "../../seasons/kit.mjs";
export { circle, ellipse, rect, path, g, star, mix };
export const D = "#3a3038";
export const eye = (x, y, r = 5) => circle(x, y, r, D) + circle(x - r * 0.32, y - r * 0.34, r * 0.36, "#fff");
export const blush = (x, y, w = 9) => ellipse(x, y, w, w * 0.62, "#ff8fa3", 'opacity=".42"');
export const nz = (x, y, c = D, w = 5) => path(`M${x - w} ${y - 2} Q${x} ${y - 5} ${x + w} ${y - 2} Q${x} ${y + 6} ${x - w} ${y - 2}Z`, c);
export const mouth = (x, y, w = 6) => path(`M${x - w} ${y} Q${x - w / 2} ${y + 6} ${x} ${y} Q${x + w / 2} ${y + 6} ${x + w} ${y}`, "none", D, 2);
export const shade = (x = 100, w = 52) => ellipse(x, 186, w, 7, "#000", 'opacity=".07"');
export const bow = (x, y, p, s = 1) => g(path("M0 0 L-16 -10 L-16 10Z", p.a) + path("M0 0 L16 -10 L16 10Z", p.a) + circle(0, 0, 5, p.d), x, y, s);
export const sparkle = (x, y, r, c) => star(x, y, r, c, 0.95);
export const heart = (x, y, s, c, o = 1) => path(`M${x} ${y + s * 0.9} C${x - s * 1.6} ${y - s * 0.3} ${x - s * 0.7} ${y - s * 1.2} ${x} ${y - s * 0.4} C${x + s * 0.7} ${y - s * 1.2} ${x + s * 1.6} ${y - s * 0.3} ${x} ${y + s * 0.9}Z`, c, "none", 0, `opacity="${o}"`);
export const whisk = (x, y, dir = 1) => [-6, 0, 6].map((d) => path(`M${x} ${y + d * 0.4} L${x + dir * 26} ${y + d * 1.6 - 2}`, "none", D, 1.6, 'opacity=".55"')).join("");
export const scarf = (y, c, w = 66) => path(`M${100 - w / 2} ${y} Q100 ${y + 14} ${100 + w / 2} ${y} L${100 + w / 2 - 4} ${y + 14} Q100 ${y + 28} ${100 - w / 2 + 4} ${y + 14}Z`, c) + path(`M${100 + w / 2 - 14} ${y + 12} l8 28 l12 -6 l-6 -24Z`, mix(c, "#000000", 0.12));
export const dots = (p) => sparkle(32, 40, 7, p.c) + sparkle(168, 34, 5, p.c) + heart(166, 150, 5, p.a, 0.85);
