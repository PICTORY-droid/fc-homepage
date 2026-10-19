// 한국 감성 풍경 그림 도구 — 모두 직접 그린 오리지널 SVG 입니다. (우체국 공식 로고·캐릭터는 쓰지 않습니다)
// 장면 크기는 800×600. 가운데(약 600×600)에 주인공이 오도록 그려 가로·세로·정사각으로 잘라 써도 어울립니다.
import { circle, ellipse, rect, path, g, star, cloud, snow, leaf, roundFlower, flower, rng, mix } from "../../seasons/kit.mjs";

export const CW = 800, CH = 600;
export { circle, ellipse, rect, path, g, star, cloud, snow, leaf, roundFlower, flower, rng, mix };
const f1 = (v) => Math.round(v * 10) / 10;

/** 테마 팔레트(p: dark/main/soft/pale/accent) → 풍경 색 */
export function colors(p) {
  return {
    p, dark: p.dark, main: p.main, soft: p.soft, pale: p.pale, accent: p.accent,
    green: mix("#5F9E5B", p.main, 0.18), dgreen: mix("#3F7A47", p.dark, 0.2), lgreen: mix("#9CC987", p.soft, 0.25),
    brown: mix("#8B6B55", p.dark, 0.15), wood: mix("#B58A5E", p.dark, 0.1), white: "#FFFFFF", cream: "#FFF8EC",
    red: "#D9534F", yellow: "#F4C542", orange: "#EE8A3A",
  };
}

let gid = 0;
export const newId = (k) => `${k}${++gid}`;

/** 하늘: 위→아래 그라데이션. kind: day | dusk | night | dawn | snow | rain */
export function sky(c, kind = "day") {
  const id = newId("sk");
  const stops = {
    day: [mix(c.soft, "#BFE3F7", 0.55), mix(c.pale, "#FFFFFF", 0.6)],
    dusk: [mix(c.main, "#F3B58A", 0.45), mix(c.soft, "#FFE9C7", 0.6)],
    night: [mix(c.dark, "#0E1530", 0.55), mix(c.dark, c.main, 0.45)],
    dawn: [mix(c.soft, "#F7C9A5", 0.5), mix(c.pale, "#FFF1D6", 0.6)],
    snow: [mix("#C9D6E6", c.soft, 0.35), mix("#F3F7FB", c.pale, 0.3)],
    rain: [mix("#9FB1C4", c.main, 0.2), mix("#D9E2EA", c.pale, 0.3)],
  }[kind];
  return { defs: `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${stops[0]}"/><stop offset="1" stop-color="${stops[1]}"/></linearGradient>`, body: rect(0, 0, CW, CH, `url(#${id})`) };
}

/** 굽이치는 언덕 한 겹 */
export function hill(y, amp, color, seed = 1, w = CW, bottom = CH) {
  const r = rng(seed); let d = `M0 ${f1(y)}`; const n = 6;
  for (let i = 1; i <= n; i++) d += ` Q${f1((i - 0.5) * w / n)} ${f1(y - amp * (0.4 + r() * 0.9))} ${f1(i * w / n)} ${f1(y - amp * (r() - 0.5) * 0.7)}`;
  return path(d + ` V${bottom} H0Z`, color);
}
export const water = (y, c, color) => rect(0, y, CW, CH - y, color) + Array.from({ length: 7 }, (_, i) => path(`M${40 + i * 120} ${y + 30 + (i % 3) * 40} q20 -12 40 0 t40 0`, "none", c.white, 3, 'opacity=".55"')).join("");
export const ground = (y, color) => rect(0, y, CW, CH - y, color);

// ───────── 하늘 장식
export const sun = (x, y, r, color, rays = true) => (rays ? Array.from({ length: 12 }, (_, i) => path(`M${f1(x + Math.cos(i * Math.PI / 6) * (r + 10))} ${f1(y + Math.sin(i * Math.PI / 6) * (r + 10))} L${f1(x + Math.cos(i * Math.PI / 6) * (r + 30))} ${f1(y + Math.sin(i * Math.PI / 6) * (r + 30))}`, "none", color, 6)).join("") : "") + circle(x, y, r, color);
export const moon = (x, y, r, color, bite = 0) => circle(x, y, r, color) + (bite ? circle(x + bite, y - bite * 0.4, r * 0.86, "#00000000") : "");
export const stars = (n, seed, color = "#FFFFFF", maxY = 250) => { const r = rng(seed); return Array.from({ length: n }, () => star(r() * CW, r() * maxY, 3 + r() * 5, color, 0.6 + r() * 0.4)).join(""); };
export const clouds = (c, items) => items.map(([x, y, s, o = 0.9]) => cloud(x, y, s, c.white, o)).join("");
export const birds = (items, color) => items.map(([x, y, s]) => path(`M${x} ${y} q${10 * s} ${-12 * s} ${20 * s} 0 q${10 * s} ${-12 * s} ${20 * s} 0`, "none", color, 3)).join("");

// ───────── 낙하 효과
export const petals = (n, seed, colors_, y0 = 0, y1 = CH, x0 = 0, x1 = CW) => { const r = rng(seed); return Array.from({ length: n }, (_, i) => { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), s = 5 + r() * 7; return ellipse(x, y, s, s * 0.55, colors_[i % colors_.length], `transform="rotate(${f1(r() * 180)} ${f1(x)} ${f1(y)})" opacity="${f1(0.7 + r() * 0.3)}"`); }).join(""); };
export const rain = (n, seed, color) => { const r = rng(seed); return Array.from({ length: n }, () => { const x = r() * CW, y = r() * CH * 0.8; return path(`M${f1(x)} ${f1(y)} l-6 20`, "none", color, 2.5, 'opacity=".7"'); }).join(""); };
export const snowfall = (n, seed, color = "#FFFFFF", y1 = CH) => { const r = rng(seed); return Array.from({ length: n }, () => circle(r() * CW, r() * y1, 2 + r() * 4, color, 'opacity=".85"')).join(""); };
export const fireflies = (n, seed, c, y0 = 200, y1 = 520) => { const r = rng(seed), id = newId("ff"); const defs = `<radialGradient id="${id}"><stop offset="0" stop-color="#FFF7B0"/><stop offset="0.4" stop-color="#FFE45C" stop-opacity=".7"/><stop offset="1" stop-color="#FFE45C" stop-opacity="0"/></radialGradient>`; return { defs, body: Array.from({ length: n }, () => circle(r() * CW, y0 + r() * (y1 - y0), 8 + r() * 14, `url(#${id})`)).join("") }; };
export const leavesFall = (n, seed, colors_, y1 = CH) => { const r = rng(seed); return Array.from({ length: n }, (_, i) => leaf(r() * CW, r() * y1, 22 + r() * 16, 8 + r() * 4, colors_[i % colors_.length], r() * 360)).join(""); };

// ───────── 나무·식물
export const tree = (x, y, s, c, kind = "round", crown = null) => {
  const cr = crown || c.green;
  const trunk = path(`M${-9} 0 Q-6 -70 ${-4} -110 L4 -110 Q8 -70 10 0Z`, c.brown);
  let top;
  if (kind === "pine") top = [0, 1, 2].map((i) => path(`M${-60 + i * 12} ${-70 - i * 55} L0 ${-150 - i * 55} L${60 - i * 12} ${-70 - i * 55}Z`, i % 2 ? c.dgreen : cr)).join("");
  else if (kind === "ginkgo") top = path("M0 -230 L-86 -90 Q-60 -60 0 -62 Q60 -60 86 -90Z", cr) + circle(-40, -110, 22, mix(cr, "#FFFFFF", 0.25)) + circle(34, -130, 26, mix(cr, "#FFFFFF", 0.2));
  else top = circle(0, -150, 70, cr) + circle(-52, -118, 46, mix(cr, c.dgreen, 0.2)) + circle(52, -122, 48, mix(cr, "#FFFFFF", 0.14)) + circle(-18, -190, 40, mix(cr, "#FFFFFF", 0.1));
  return g(trunk + top, x, y, s);
};
const dots = (cx, cy, r, n, seed, col, rr = [5, 8]) => { const rg = rng(seed); return Array.from({ length: n }, () => { const a = rg() * 6.283, d = Math.sqrt(rg()) * r; return circle(cx + Math.cos(a) * d, cy + Math.sin(a) * d, rr[0] + rg() * (rr[1] - rr[0]), col); }).join(""); };
export const blossomTree = (x, y, s, c, col1, col2, seed = 3) => g(path("M-10 0 Q-6 -80 -2 -120 M-2 -100 Q-50 -130 -80 -170 M0 -110 Q40 -140 90 -160", "none", c.brown, 14) + dots(0, -170, 100, 60, seed, col1, [9, 16]) + dots(0, -170, 100, 30, seed + 4, col2, [6, 11]), x, y, s);
export const persimmonTree = (x, y, s, c) => tree(x, y, s, c, "round", c.green) + g(dots(0, -150, 70, 9, 7, c.orange, [9, 12]), x, y, s);
export const bamboo = (x, y, s, c, n = 5) => g(Array.from({ length: n }, (_, i) => { const dx = i * 34 - (n - 1) * 17, h = 330 + (i % 3) * 50; return path(`M${dx} 0 V${-h}`, "none", i % 2 ? c.green : c.dgreen, 14, 'stroke-linecap="butt"') + Array.from({ length: 5 }, (_, k) => rect(dx - 8, -k * (h / 5) - 30, 16, 4, c.dgreen)).join("") + leaf(dx, -h + 40, 70, 14, c.lgreen, -60) + leaf(dx, -h + 70, 60, 12, c.green, 60); }).join(""), x, y, s);
export const grass = (x, y, s, c, n = 9, color = null) => g(Array.from({ length: n }, (_, i) => path(`M${i * 10 - n * 5} 0 Q${i * 10 - n * 5 + (i % 2 ? 14 : -14)} -40 ${i * 10 - n * 5 + (i - n / 2) * 4} ${-60 - (i % 3) * 14}`, "none", color || c.dgreen, 4)).join(""), x, y, s);
export const silverGrass = (x, y, s, c, n = 7) => g(Array.from({ length: n }, (_, i) => { const dx = (i - n / 2) * 14; const top = -150 - (i % 3) * 22; return path(`M${dx} 0 Q${dx + 6} -80 ${dx + (i - n / 2) * 8} ${top}`, "none", c.brown, 3) + ellipse(dx + (i - n / 2) * 8, top - 18, 7, 26, mix("#F2E8D0", c.soft, 0.3), `transform="rotate(${(i - n / 2) * 8} ${dx + (i - n / 2) * 8} ${top - 18})"`); }).join(""), x, y, s);
export const barley = (x, y, s, c, n = 9) => g(Array.from({ length: n }, (_, i) => { const dx = (i - n / 2) * 16, top = -110 - (i % 4) * 16; return path(`M${dx} 0 Q${dx + 4} -60 ${dx + (i - n / 2) * 3} ${top}`, "none", c.green, 4) + Array.from({ length: 4 }, (_, k) => ellipse(dx + (i - n / 2) * 3 + (k % 2 ? 6 : -6), top - k * 9, 4, 8, c.lgreen, `transform="rotate(${k % 2 ? 24 : -24} 0 0)"`)).join(""); }).join(""), x, y, s);
export const sunflower = (x, y, s, c) => g(path("M0 0 V190", "none", c.green, 10, "") + leaf(0, 120, 70, 24, c.green, -55) + leaf(0, 150, 60, 20, c.dgreen, 55) + Array.from({ length: 16 }, (_, i) => ellipse(0, -64, 14, 38, c.yellow, `transform="rotate(${i * 22.5} 0 -2)" transform-origin="0 0"`).replace(/transform="rotate\([^"]*\)" transform-origin="0 0"/, `transform="rotate(${i * 22.5} 0 0) translate(0 -2)"`)).join("") + circle(0, 0, 36, mix(c.brown, "#3A2418", 0.4)) + dots(0, 0, 26, 18, 5, "#5A3A28", [2, 3]), x, y - 190 * s, s);
export const hydrangea = (x, y, s, c, col1, col2) => g(leaf(-70, 40, 60, 28, c.green, -70) + leaf(70, 40, 60, 28, c.dgreen, 70) + dots(0, -20, 78, 70, 11, col1, [10, 15]) + dots(0, -20, 78, 40, 13, col2, [8, 12]) + dots(0, -20, 78, 18, 15, "#FFFFFF", [6, 9]), x, y, s);
export const lotus = (x, y, s, c, col) => g(ellipse(-80, 20, 70, 22, c.green) + ellipse(90, 30, 60, 18, c.dgreen) + path("M0 20 V-40", "none", c.dgreen, 8) + [-50, -25, 0, 25, 50].map((a) => path(`M0 -40 Q${a * 0.8} -100 ${a * 0.4} -140 Q${a * 0.1 + 14} -90 0 -40Z`, col, "none", 0, `transform="rotate(${a} 0 -40)"`)).join("") + circle(0, -62, 12, c.yellow), x, y, s);
export const cosmos = (x, y, s, c, col) => g(path("M0 0 V120", "none", c.green, 5) + leaf(0, 80, 50, 8, c.green, -30) + leaf(0, 100, 46, 8, c.dgreen, 30) + Array.from({ length: 8 }, (_, i) => ellipse(0, -22, 9, 24, col, `transform="rotate(${i * 45} 0 0)"`).replace(/transform="rotate\(([\d.]+) 0 0\)"/, 'transform="rotate($1 0 0)"')).join("") + circle(0, 0, 8, c.yellow), x, y - 120 * s, s);
export const tulip = (x, y, s, c, col) => g(path("M0 0 V90", "none", c.green, 6) + leaf(0, 80, 52, 14, c.dgreen, -45) + path("M-24 0 Q-28 -42 0 -56 Q28 -42 24 0 Q0 14 -24 0Z", col), x, y - 90 * s, s);
export const plumBranch = (x, y, s, c, col, seed = 2) => { const r = rng(seed); return g(path("M-200 120 Q-60 80 20 30 T220 -90 M20 30 Q50 90 90 130 M-60 90 Q-90 40 -80 -10", "none", c.brown, 9) + Array.from({ length: 22 }, () => roundFlower(-180 + r() * 400, -110 + r() * 230, 11 + r() * 8, 5, col, c.yellow, r() * 72)).join(""), x, y, s); };
export const carnation = (x, y, s, c, col) => g(path("M0 0 V110", "none", c.green, 6) + leaf(0, 90, 50, 12, c.dgreen, 40) + Array.from({ length: 3 }, (_, k) => circle(0, -8 + k * 0, 34 - k * 8, k % 2 ? mix(col, "#FFFFFF", 0.25) : col)).join("") + Array.from({ length: 10 }, (_, i) => path(`M0 -8 L${Math.cos(i * 0.628) * 36} ${-8 + Math.sin(i * 0.628) * 36}`, "none", mix(col, "#FFFFFF", 0.45), 2)).join(""), x, y - 110 * s, s);
export const acacia = (x, y, s, c) => g(path("M0 0 Q-10 -90 10 -170", "none", c.brown, 8) + Array.from({ length: 5 }, (_, i) => g(path("M0 0 V70", "none", c.green, 3) + dots(0, 40, 22, 14, i + 3, "#FFFFFF", [5, 8]), -40 + i * 22, -150 + (i % 2) * 30, 1)).join(""), x, y, s);

// ───────── 건물·사물
export const hanok = (x, y, s, c, roof = null) => g(rect(-90, -80, 180, 80, c.cream) + rect(-90, -80, 180, 8, c.wood) + rect(-70, -64, 36, 64, mix(c.wood, "#FFFFFF", 0.4)) + rect(-24, -64, 36, 64, mix(c.wood, "#FFFFFF", 0.4)) + rect(30, -64, 44, 64, mix(c.wood, "#FFFFFF", 0.4)) + [-70, -24, 30].map((dx, i) => path(`M${dx + 18} -64 V0 M${dx} -32 H${dx + (i < 2 ? 36 : 44)}`, "none", c.wood, 2)).join("") + path("M-130 -78 Q-100 -92 -90 -112 L90 -112 Q100 -92 130 -78 Q60 -90 0 -90 Q-60 -90 -130 -78Z", roof || c.dark) + path("M-110 -112 Q0 -150 110 -112 L90 -112 Q0 -136 -90 -112Z", mix(roof || c.dark, "#000000", 0.18)) + rect(-96, 0, 192, 10, mix(c.brown, "#555", 0.3)), x, y, s);
export const eave = (x, y, s, c) => g(path("M-260 -20 Q-120 -30 -20 -90 Q40 -130 110 -112 Q60 -100 30 -60 Q-60 20 -260 40Z", c.dark) + path("M-260 40 Q-60 20 30 -60 L40 -52 Q-50 40 -260 60Z", mix(c.dark, c.main, 0.35)) + rect(-250, 60, 340, 8, c.wood) + path("M60 -70 V-8", "none", c.brown, 3) + path("M45 -6 H75 L68 22 H52Z", c.accent) + path("M60 22 V50", "none", c.brown, 2) + path("M50 50 H70 L60 78Z", c.yellow), x, y, s);
export const lighthouse = (x, y, s, c) => g(path("M-34 0 L-22 -200 H22 L34 0Z", c.white) + [0, 1, 2].map((i) => path(`M${-32 + i * 4} ${-30 - i * 62} L${32 - i * 4} ${-30 - i * 62} L${30 - i * 4} ${-60 - i * 62} L${-30 + i * 4} ${-60 - i * 62}Z`, c.red)).join("") + rect(-28, -230, 56, 32, c.dark) + rect(-20, -226, 40, 22, c.yellow) + path("M-38 -230 L0 -270 L38 -230Z", c.red) + path("M30 -216 L220 -250 L220 -180Z", mix(c.yellow, "#FFFFFF", 0.4), "none", 0, 'opacity=".5"'), x, y, s);
export const boat = (x, y, s, c, col = null) => g(path("M-70 0 Q-60 36 -20 38 H40 Q70 36 80 0Z", col || c.accent) + rect(-8, -80, 5, 80, c.brown) + path("M0 -80 L50 -10 H0Z", c.white) + path("M-6 -76 L-52 -10 H-6Z", mix(c.white, c.soft, 0.5)), x, y, s);
export const pier = (x, y, s, c) => g(rect(-200, 0, 400, 14, c.wood) + Array.from({ length: 9 }, (_, i) => rect(-190 + i * 46, 14, 10, 50, c.brown)).join("") + Array.from({ length: 8 }, (_, i) => path(`M${-176 + i * 46} 0 V14`, "none", mix(c.brown, "#000", 0.3), 2)).join(""), x, y, s);
export const postbox = (x, y, s, c, col = null) => g(rect(-22, -110, 44, 110, col || c.red, 8) + rect(-26, -118, 52, 14, mix(col || c.red, "#000000", 0.2), 5) + rect(-14, -86, 28, 7, "#2B1A1A", 3) + rect(-12, -58, 24, 30, mix(col || c.red, "#FFFFFF", 0.25), 4) + rect(-30, 0, 60, 8, c.brown) + circle(0, -43, 7, c.yellow), x, y, s);
export const umbrella = (x, y, s, c, col) => g(path("M-90 0 Q-90 -90 0 -90 Q90 -90 90 0 Q70 -14 45 0 Q22 -14 0 0 Q-22 -14 -45 0 Q-70 -14 -90 0Z", col) + path("M0 -90 Q-40 -60 -45 0 M0 -90 Q40 -60 45 0 M0 -90 V0", "none", "#FFFFFF", 2.5, 'opacity=".6"') + path("M0 0 V90 Q0 108 -18 106", "none", c.dark, 6), x, y, s);
export const lantern = (x, y, s, c, col) => g(path("M0 -80 V-50", "none", c.brown, 3) + rect(-14, -52, 28, 8, c.brown) + ellipse(0, -8, 30, 42, col) + path("M-30 -8 Q0 -30 30 -8 M-30 -8 Q0 14 30 -8", "none", mix(col, "#FFFFFF", 0.5), 2) + path("M-24 -26 Q0 -4 24 -26", "none", mix(col, "#FFFFFF", 0.5), 2) + rect(-14, 34, 28, 8, c.brown) + Array.from({ length: 3 }, (_, i) => path(`M${-8 + i * 8} 42 V${64 - (i % 2) * 8}`, "none", c.accent, 3)).join(""), x, y, s);
export const jar = (x, y, s, c, col = null) => g(path("M-34 0 Q-52 -40 -34 -76 H34 Q52 -40 34 0Z", col || c.brown) + path("M-26 -76 Q0 -98 26 -76Z", mix(col || c.brown, "#FFFFFF", 0.2)) + rect(-30, -80, 60, 8, mix(col || c.brown, "#000", 0.2), 4) + path("M-38 -40 Q0 -30 38 -40", "none", mix(col || c.brown, "#FFFFFF", 0.3), 3), x, y, s);
export const jarGroup = (x, y, s, c) => jar(x - 80, y, s * 0.8, c, mix(c.brown, c.dark, 0.2)) + jar(x, y, s * 1.1, c) + jar(x + 84, y, s * 0.75, c, mix(c.brown, c.main, 0.3));
export const train = (x, y, s, c, col = null) => g(rect(-20, -76, 130, 70, col || c.main, 10) + [0, 1, 2].map((i) => rect(-6 + i * 40, -62, 28, 30, c.cream, 4)).join("") + rect(-26, -20, 142, 14, mix(col || c.main, "#000", 0.25), 4) + path("M110 -76 H170 Q184 -76 188 -40 V-6 H110Z", mix(col || c.main, c.dark, 0.3)) + rect(122, -62, 40, 26, c.cream, 4) + rect(150, -100, 18, 24, c.dark, 3) + [-6, 28, 70, 120, 160].map((dx) => circle(dx + 8, 0, 14, c.dark) + circle(dx + 8, 0, 5, c.cream)).join(""), x, y, s);
export const rails = (y, c) => rect(0, y, CW, 6, c.brown) + Array.from({ length: 26 }, (_, i) => rect(i * 32 - 4, y + 6, 12, 18, mix(c.brown, c.wood, 0.4))).join("");
export const bell = (x, y, s, c) => g(rect(-70, -140, 12, 150, c.wood) + rect(58, -140, 12, 150, c.wood) + rect(-76, -148, 152, 14, c.wood) + path("M-34 -20 Q-34 -80 0 -92 Q34 -80 34 -20Z", c.yellow) + rect(-40, -24, 80, 10, mix(c.yellow, c.brown, 0.4), 4) + circle(0, -8, 8, c.brown), x, y, s);
export const books = (x, y, s, c) => g([["#" + "000000", 0]].length ? [[170, c.main, 0], [150, c.accent, 24], [190, c.dark, 50], [160, c.yellow, 76]].map(([w, col, dy], i) => rect(-w / 2 + (i % 2) * 8, -dy - 24, w, 24, col, 3) + rect(-w / 2 + 12 + (i % 2) * 8, -dy - 15, 24, 6, c.cream, 2)).join("") : "", x, y, s);
export const jug = (x, y, s, c, col) => g(path("M-40 0 L-30 -90 H30 L40 0Z", col) + rect(-34, -100, 68, 12, mix(col, "#000", 0.15), 4), x, y, s);
export const brazier = (x, y, s, c) => g(rect(-46, -64, 92, 64, c.dark, 8) + Array.from({ length: 6 }, (_, i) => circle(-30 + (i % 3) * 30, -44 + Math.floor(i / 3) * 24, 7, c.orange)).join("") + path("M-20 -64 Q-30 -100 -8 -128 Q-4 -100 14 -96 Q30 -110 20 -64Z", c.orange) + path("M-8 -64 Q-12 -88 2 -104 Q8 -86 12 -64Z", c.yellow), x, y, s);
export const fishBun = (x, y, s, c) => g(path("M-60 0 Q-50 -34 -10 -36 Q40 -38 60 -12 L84 -30 L84 24 L60 8 Q30 36 -14 32 Q-52 30 -60 0Z", mix("#D89A4C", c.main, 0.15)) + circle(-34, -8, 5, c.dark) + path("M-10 -26 Q14 -34 34 -22 M-8 12 Q16 20 36 8", "none", mix("#B87A32", c.main, 0.2), 3), x, y, s);
export const sweetPotato = (x, y, s, c) => g(path("M-60 0 Q-70 -30 -20 -44 Q40 -56 66 -24 Q74 6 30 12 Q-30 20 -60 0Z", mix("#9C4A3C", c.main, 0.2)) + path("M-30 -26 Q10 -34 40 -22", "none", mix("#C17A4E", "#FFF", 0.2), 4), x, y, s);
export const stall = (x, y, s, c) => g(rect(-100, -60, 200, 60, c.wood) + path("M-120 -60 L-100 -120 H100 L120 -60Z", c.red) + Array.from({ length: 5 }, (_, i) => path(`M${-120 + i * 48} -60 l${i % 2 ? 6 : 14} -60 H${-120 + (i + 1) * 48 - 20}`, "none", c.white, 0)).join("") + Array.from({ length: 5 }, (_, i) => rect(-110 + i * 44, -118, 22, 56, i % 2 ? c.white : c.red)).join("") + rect(-80, -80, 60, 20, c.cream) + circle(30, -76, 14, c.yellow) + circle(60, -74, 14, c.orange) + path("M-60 -130 Q-70 -170 -50 -200 M-30 -130 Q-40 -166 -22 -190 M0 -130 Q-8 -160 8 -184", "none", c.white, 5, 'opacity=".7"'), x, y, s);
export const pouch = (x, y, s, c, col) => g(path("M-50 0 Q-66 -50 -34 -84 H34 Q66 -50 50 0Q0 14 -50 0Z", col) + path("M-34 -84 Q-20 -96 -4 -86 Q10 -96 34 -84 L30 -72 Q0 -80 -30 -72Z", mix(col, "#000", 0.2)) + path("M-6 -70 Q-26 -108 0 -116 Q26 -108 6 -70", "none", c.yellow, 5) + circle(0, -34, 16, mix(c.yellow, "#FFF", 0.2)) + path("M0 -48 V-20 M-14 -34 H14", "none", col, 3), x, y, s);
export const moonHouse = (x, y, s, c) => g(Array.from({ length: 5 }, (_, i) => path(`M${-90 + i * 18} 0 L0 ${-170 + i * 4}`, "none", c.brown, 12)).join("") + Array.from({ length: 5 }, (_, i) => path(`M${90 - i * 18} 0 L0 ${-170 + i * 4}`, "none", mix(c.brown, c.wood, 0.4), 12)).join("") + path("M-30 -100 Q-52 -180 0 -250 Q8 -190 40 -170 Q60 -130 30 -100Z", c.orange) + path("M-12 -110 Q-22 -160 4 -196 Q14 -160 24 -140 Q30 -116 6 -108Z", c.yellow), x, y, s);
export const yeontan = (x, y, s, c) => g(rect(-50, -60, 100, 60, "#3A3A3A", 6) + Array.from({ length: 9 }, (_, i) => circle(-30 + (i % 3) * 30, -46 + Math.floor(i / 3) * 18, 5, "#1A1A1A")).join("") + path("M-50 -30 H50", "none", "#555", 2), x, y, s);
export const bunkbed = null;
export const swallow = (x, y, s, c, col = null) => g(path("M-40 4 L-76 28 L-44 6 L-72 -4Z", col || c.dark) + path("M-40 -6 Q-6 -34 34 -10 Q50 4 36 16 Q-4 24 -40 6Z", col || c.dark) + path("M-22 -8 Q-4 -46 40 -50 Q12 -22 -2 -2Z", mix(col || c.dark, "#fff", 0.1)) + circle(38, -4, 13, col || c.dark) + path("M48 -2 l16 5 l-14 5Z", c.orange) + circle(42, -8, 2.5, "#fff") + path("M10 8 Q22 14 34 4 Q28 20 8 20Z", c.cream), x, y, s);
export const dragonfly = (x, y, s, c) => g(path("M-50 0 H50", "none", c.red, 6) + ellipse(-34, -12, 28, 7, c.white, 'opacity=".7"') + ellipse(-34, 12, 28, 7, c.white, 'opacity=".7"') + ellipse(10, -14, 28, 7, c.white, 'opacity=".7"') + ellipse(10, 14, 28, 7, c.white, 'opacity=".7"') + circle(54, 0, 9, c.red), x, y, s);
export const watermelon = (x, y, s, c) => g(path("M-70 -10 A70 70 0 0 0 70 -10Z", c.green) + path("M-62 -10 A62 62 0 0 0 62 -10Z", c.red) + path("M-70 -10 H70", "none", c.white, 6) + Array.from({ length: 7 }, (_, i) => ellipse(-36 + i * 12, 14 + (i % 2) * 14, 3, 5, "#2B1A1A")).join(""), x, y, s);
export const platform = (x, y, s, c) => g(rect(-140, 0, 280, 16, c.wood) + [-120, 100].map((dx) => rect(dx, 16, 18, 60, c.brown)).join("") + Array.from({ length: 5 }, (_, i) => path(`M${-110 + i * 56} 0 V16`, "none", c.brown, 2)).join(""), x, y, s);
export const winter = null;
export const camellia = (x, y, s, c, col) => g(Array.from({ length: 5 }, (_, i) => circle(Math.cos(i * 1.2566) * 22, Math.sin(i * 1.2566) * 22, 22, i % 2 ? col : mix(col, "#fff", 0.15))).join("") + circle(0, 0, 15, mix(col, "#B2243A", 0.2)) + dots(0, 0, 11, 14, 4, c.yellow, [1.6, 2.4]), x, y, s);
export const camelliaBranch = (x, y, s, c, col) => g(path("M-200 80 Q-80 40 20 -10 T220 -90", "none", c.brown, 9) + leaf(-110, 62, 56, 22, c.dgreen, -50) + leaf(-30, 30, 56, 22, c.green, 50) + leaf(70, -18, 56, 22, c.dgreen, -40) + leaf(150, -52, 50, 20, c.green, 50) + camellia(-60, 34, 1.3, c, col) + camellia(60, -14, 1.5, c, col) + camellia(170, -62, 1.1, c, col) + path("M-250 90 Q-60 40 220 -90 L240 -100 Q60 30 -250 110Z", "#FFFFFF", "none", 0, 'opacity=".9" transform="translate(0 -22)"'), x, y, s);
export const snowGround = (y, c) => path(`M0 ${y} Q120 ${y - 30} 260 ${y - 10} T540 ${y - 24} T800 ${y - 6} V${CH} H0Z`, "#FFFFFF") + path(`M0 ${y + 40} Q200 ${y + 14} 420 ${y + 36} T800 ${y + 26} V${CH} H0Z`, mix("#E8EEF7", c.soft, 0.35));
export const snowRoof = (path_) => path_;
export const christmasPost = (x, y, s, c) => g(rect(-110, -110, 220, 110, mix(c.cream, c.soft, 0.3)) + path("M-130 -108 L0 -190 L130 -108Z", c.red) + path("M-130 -108 H130", "none", "#FFFFFF", 12) + rect(-24, -64, 48, 64, c.dgreen) + rect(-90, -86, 44, 38, c.yellow, 3) + rect(46, -86, 44, 38, c.yellow, 3) + circle(0, -34, 5, c.yellow) + Array.from({ length: 8 }, (_, i) => circle(-110 + i * 31, -112 + (i % 2) * 5, 5, [c.red, c.yellow, c.green, "#fff"][i % 4])).join("") + circle(0, -170, 18, c.dgreen) + circle(0, -170, 7, c.red), x, y, s);
export const sunrise = (x, y, r, c) => Array.from({ length: 13 }, (_, i) => path(`M${f1(x + Math.cos(Math.PI + i * Math.PI / 12) * (r + 16))} ${f1(y + Math.sin(Math.PI + i * Math.PI / 12) * (r + 16))} L${f1(x + Math.cos(Math.PI + i * Math.PI / 12) * (r + 70))} ${f1(y + Math.sin(Math.PI + i * Math.PI / 12) * (r + 70))}`, "none", mix(c.yellow, "#FFFFFF", 0.35), 6, 'opacity=".8"')).join("") + path(`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y}Z`, c.orange);
export const house = (x, y, s, c, col = null) => g(rect(-60, -56, 120, 56, c.cream) + path("M-78 -52 L0 -110 L78 -52Z", col || c.brown) + rect(-14, -36, 28, 36, c.wood) + rect(-52, -40, 26, 22, mix(c.soft, "#FFFFFF", 0.3)) + rect(26, -40, 26, 22, mix(c.soft, "#FFFFFF", 0.3)) + rect(30, -100, 14, 30, c.brown), x, y, s);
export const smoke = (x, y, s, c) => g(path("M0 0 Q-20 -30 0 -50 Q20 -70 0 -100 Q-14 -120 6 -140", "none", c.white, 9, 'opacity=".75"'), x, y, s);
export const frame_window = (x, y, s, c) => g(rect(-170, -200, 340, 400, mix(c.wood, c.dark, 0.2), 14) + rect(-150, -180, 300, 360, "none", 0) + path("M0 -180 V180 M-150 0 H150", "none", mix(c.wood, c.dark, 0.2), 10), x, y, s);
export const dropsOnGlass = (n, seed, c, x0, y0, w, h) => { const r = rng(seed); return Array.from({ length: n }, () => { const x = x0 + r() * w, y = y0 + r() * h, s = 3 + r() * 6; return path(`M${f1(x)} ${f1(y - s * 2)} Q${f1(x + s)} ${f1(y)} ${f1(x)} ${f1(y + s)} Q${f1(x - s)} ${f1(y)} ${f1(x)} ${f1(y - s * 2)}Z`, "#FFFFFF", "none", 0, 'opacity=".75"'); }).join(""); };
export const pot = (x, y, s, c, col) => g(path("M-34 0 L-26 -50 H26 L34 0Z", c.brown) + rect(-38, -58, 76, 12, mix(c.brown, "#fff", 0.15), 4) + leaf(0, -56, 60, 18, c.green, -30) + leaf(0, -56, 54, 16, c.dgreen, 30) + roundFlower(0, -126, 18, 5, col, c.yellow), x, y, s);
export const riceRows = (y0, c, rows = 5) => Array.from({ length: rows }, (_, i) => { const y = y0 + i * 34; return rect(0, y, CW, 28, mix("#BFD9E8", c.soft, 0.4)) + Array.from({ length: 22 }, (_, k) => path(`M${20 + k * 38 + (i % 2) * 14} ${y + 28} l-3 -16 M${20 + k * 38 + (i % 2) * 14} ${y + 28} l3 -18`, "none", c.green, 3)).join(""); }).join("");
export const fieldRows = (y0, c, color, rows = 6) => Array.from({ length: rows }, (_, i) => path(`M0 ${y0 + i * 32} Q400 ${y0 + i * 32 - 20 + (i % 2) * 10} 800 ${y0 + i * 32}`, "none", color, 12 + i * 3)).join("");
export const hat = (x, y, s, c) => g(path("M-70 0 Q0 -50 70 0Z", mix("#E6C98A", c.main, 0.15)) + path("M-90 4 Q0 -8 90 4 Q0 16 -90 4Z", mix("#D1AE6A", c.main, 0.15)), x, y, s);
export const cicada = (x, y, s, c) => g(ellipse(0, 0, 30, 12, c.dgreen) + ellipse(-8, -10, 22, 8, mix(c.white, c.soft, 0.4), 'opacity=".85" transform="rotate(-20 -8 -10)"') + ellipse(10, -10, 22, 8, mix(c.white, c.soft, 0.4), 'opacity=".85" transform="rotate(10 10 -10)"') + circle(34, 0, 9, c.dgreen), x, y, s);
export const kite = (x, y, s, c, col) => g(path("M0 -50 L36 0 L0 70 L-36 0Z", col) + path("M0 -50 V70 M-36 0 H36", "none", "#FFFFFF", 2, 'opacity=".7"') + path("M0 70 Q-20 110 10 150 Q40 190 0 230", "none", c.dark, 2), x, y, s);
export const chestnut = (x, y, s, c) => g(circle(0, 0, 36, c.dgreen) + Array.from({ length: 22 }, (_, i) => path(`M${f1(Math.cos(i * 0.2856) * 30)} ${f1(Math.sin(i * 0.2856) * 30)} L${f1(Math.cos(i * 0.2856) * 46)} ${f1(Math.sin(i * 0.2856) * 46)}`, "none", mix(c.dgreen, c.brown, 0.4), 3)).join("") + path("M-14 22 Q0 34 14 22 Q0 12 -14 22Z", c.brown), x, y, s);
export const frost = (y, c) => Array.from({ length: 60 }, (_, i) => { const x = (i * 37) % CW + 6; return path(`M${x} ${y + (i % 5) * 18} l-3 -26 M${x} ${y + (i % 5) * 18} l4 -22`, "none", mix("#FFFFFF", c.soft, 0.25), 3); }).join("");
export const tableTea = null;
export const hanbokBow = null;
export const sign = (x, y, s, c, txt) => g(rect(-4, -90, 8, 90, c.brown) + rect(-60, -130, 120, 44, c.cream, 6) + path("M-60 -130 H60", "none", c.dark, 3) + rect(-52, -122, 104, 28, "none", 0), x, y, s);
export const station = (x, y, s, c) => g(rect(-140, -90, 280, 90, mix(c.cream, c.soft, 0.3)) + path("M-160 -88 L0 -150 L160 -88Z", c.dark) + rect(-110, -66, 52, 66, c.wood) + rect(-30, -66, 52, 66, c.wood) + rect(50, -66, 70, 40, mix(c.soft, "#fff", 0.4)) + circle(0, -112, 16, c.cream) + path("M0 -112 V-124 M0 -112 H8", "none", c.dark, 3), x, y, s);
export const schoolBuilding = (x, y, s, c) => g(rect(-160, -100, 320, 100, mix(c.cream, c.soft, 0.35)) + rect(-40, -150, 80, 50, mix(c.cream, c.soft, 0.25)) + path("M-50 -150 L0 -190 L50 -150Z", c.main) + circle(0, -128, 14, c.cream) + path("M0 -128 V-138 M0 -128 H7", "none", c.dark, 2.5) + Array.from({ length: 8 }, (_, i) => rect(-148 + i * 38 + (i > 3 ? 20 : 0), -80, 24, 28, mix(c.soft, "#fff", 0.5))).join("") + rect(-16, -44, 32, 44, c.wood), x, y, s);
export const marketLights = (c) => Array.from({ length: 9 }, (_, i) => circle(40 + i * 90, 70 + (i % 2) * 14, 9, c.yellow) + path(`M${40 + i * 90} 40 V${62 + (i % 2) * 14}`, "none", c.brown, 2)).join("") + path("M0 40 H800", "none", c.brown, 3);
export const lampPost = (x, y, s, c) => g(rect(-4, -190, 8, 190, c.dark) + path("M-30 -190 Q0 -230 30 -190Z", c.dark) + circle(0, -184, 12, c.yellow) + circle(0, -184, 30, c.yellow, 'opacity=".25"'), x, y, s);
export const wreath = (x, y, s, c) => g(circle(0, 0, 56, "none", `stroke="${c.dgreen}" stroke-width="22"`) + Array.from({ length: 6 }, (_, i) => circle(Math.cos(i * 1.047) * 56, Math.sin(i * 1.047) * 56, 6, c.red)).join("") + path("M-10 56 L-24 84 L0 72 L24 84 L10 56Z", c.red), x, y, s);
export const present = (x, y, s, c, col) => g(rect(-34, -56, 68, 56, col) + rect(-34, -56, 68, 12, mix(col, "#000", 0.15)) + rect(-6, -56, 12, 56, c.yellow) + path("M0 -56 Q-26 -92 -10 -78 Q0 -70 0 -56 Q0 -70 10 -78 Q26 -92 0 -56Z", c.yellow), x, y, s);
export const star8 = (x, y, r, col) => star(x, y, r, col);
export const hanjiPattern = null;
export const sleddog = null;

// ───────── 장면 조립
/** 장면 한 장: 배경(defs+body 배열)과 주 내용을 합쳐 800×600 SVG 조각을 돌려준다. */
export function scene(...parts) {
  let defs = "", body = "";
  for (const p of parts) { if (!p) continue; if (typeof p === "string") body += p; else { defs += p.defs || ""; body += p.body || ""; } }
  return { defs, body };
}
export const svgDoc = (w, h, defs, body, vb = `0 0 ${w} ${h}`, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}" ${extra}><defs>${defs}</defs>${body}</svg>`;
