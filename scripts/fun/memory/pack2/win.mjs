// 창가 그림 50종 — 창틀 12가지 × 풍경(하늘·땅·날씨) × 창턱 소품 12가지의 서로 다른 조합. 200x200 칸, 오리지널 SVG.
import { circle, ellipse, rect, path, g, star, mix, rng } from "../../seasons/kit.mjs";
import { SKY, sun, moon, stars, cl, hill, sea, mount, pine, tree, house, bird, boat, lamp } from "./sc_kit.mjs";

const FRAMES = {
  plain: { d: "M46 30 H154 V150 H46Z", bb: [46, 30, 108, 120], mun: "M100 30 V150 M46 90 H154" },
  arch: { d: "M46 150 V80 A54 54 0 0 1 154 80 V150Z", bb: [46, 26, 108, 124], mun: "M100 26 V150 M46 88 H154" },
  round: { d: "M100 32 A58 58 0 1 1 99.9 32Z", bb: [42, 32, 116, 116], mun: "M42 90 H158 M100 32 V148" },
  french: { d: "M40 30 H160 V150 H40Z", bb: [40, 30, 120, 120], mun: "M100 30 V150 M40 70 H160 M40 110 H160" },
  grid: { d: "M44 30 H156 V150 H44Z", bb: [44, 30, 112, 120], mun: "M81 30 V150 M119 30 V150 M44 70 H156 M44 110 H156" },
  shutters: { d: "M60 36 H140 V148 H60Z", bb: [60, 36, 80, 112], mun: "M100 36 V148 M60 92 H140" },
  bay: { d: "M30 44 L56 30 H144 L170 44 V150 H30Z", bb: [30, 30, 140, 120], mun: "M70 30 V150 M130 30 V150 M30 96 H170" },
  cafe: { d: "M36 52 H164 V150 H36Z", bb: [36, 52, 128, 98], mun: "M100 52 V150" },
  attic: { d: "M52 150 V66 L100 28 L148 66 V150Z", bb: [52, 28, 96, 122], mun: "M100 28 V150 M52 98 H148" },
  sash: { d: "M50 28 H150 V150 H50Z", bb: [50, 28, 100, 122], mun: "M50 88 H150 M50 94 H150" },
  oval: { d: "M100 26 A48 62 0 1 1 99.9 26Z", bb: [52, 26, 96, 124], mun: "M100 26 V150 M52 88 H148" },
  lancet: { d: "M58 150 V74 Q58 40 100 20 Q142 40 142 74 V150Z", bb: [58, 20, 84, 130], mun: "M100 20 V150 M58 92 H142" },
};
const GROUND = {
  hills: (p) => hill(120, "#8fd88a", 12) + hill(138, "#6fc47a", 10, 2) + hill(160, "#58b068", 8, 4),
  sea: (p) => sea(104, "#3fa8d8", "#bfeaf7") + boat(120, 110, 0.5, p.a),
  city: (p) => [[34, 90, 22], [54, 70, 24], [78, 96, 20], [98, 62, 22], [120, 84, 26], [146, 74, 20]].map(([x, y, w], i) => rect(x, y, w, 100, ["#5a6aa8", "#6a7ab8", "#4a5a98"][i % 3]) + rect(x + 4, y + 8, 4, 5, "#ffe27a") + rect(x + 12, y + 20, 4, 5, "#ffe27a")).join("") + rect(30, 148, 140, 10, "#3a4678"),
  forest: (p) => hill(124, "#6fc49a", 8) + [50, 70, 90, 112, 132, 150].map((x, i) => pine(x, 150 - (i % 2) * 8, 1.7 + (i % 3) * 0.2, i % 2 ? "#2f9e6a" : "#3fae7a")).join("") + rect(30, 146, 140, 8, "#4a8a5a"),
  mountain: (p) => mount(70, 150, 120, 100, "#8a9ac8", "#fff") + mount(140, 150, 110, 80, "#7a8ab8", "#fff") + hill(150, "#8fd88a", 4),
  rooftops: (p) => [[40, 110, 36], [78, 96, 40], [120, 104, 36], [150, 112, 30]].map(([x, y, w], i) => path(`M${x - 4} ${y + 40} L${x + w / 2} ${y} L${x + w + 4} ${y + 40}Z`, ["#d9776a", "#e8946a", "#c9605a", "#e8a07a"][i]) + rect(x, y + 40, w, 40, ["#f6e0c0", "#f0d4b0"][i % 2])).join("") + rect(80, 78, 4, 14, "#8a6a5a") + rect(30, 150, 140, 6, "#8a7a8a"),
  field: (p) => hill(112, "#f0d86a", 8) + hill(130, "#e8c850", 8, 2) + hill(150, "#d8b440", 6, 4) + Array.from({ length: 12 }, (_, i) => path(`M${36 + i * 10} 150 q2 -14 0 -22`, "none", "#c9a030", 2)).join(""),
  lake: (p) => mount(100, 112, 140, 50, "#9ab8d8") + rect(30, 112, 140, 60, "#6fc0e0") + [0, 1, 2].map((i) => path(`M40 ${122 + i * 12} q10 -4 20 0 t20 0 t20 0 t20 0 t20 0`, "none", "#d4f4fb", 2, 'opacity=".8"')).join("") + boat(110, 134, 0.6, p.c),
  snowhill: (p) => hill(116, "#f4f8ff", 10) + hill(138, "#e0ecfa", 8, 2) + [60, 100, 136].map((x, i) => g(path("M0 -34 L-12 -10 H12Z M0 -24 L-15 2 H15Z", "#4a9a78") + path("M0 -34 L-6 -22 H6Z M0 -24 L-8 -10 H8Z", "#fff"), x, 140 + (i % 2) * 8, 1.1)).join(""),
  fence: (p) => hill(112, "#9ae08a", 8) + hill(132, "#7fd078", 8, 2) + path("M30 148 H170", "none", "#c98a52", 5) + path("M30 132 H170", "none", "#c98a52", 5) + Array.from({ length: 9 }, (_, i) => path(`M${36 + i * 16} 152 V120 L${40 + i * 16} 114 L${44 + i * 16} 120 V152Z`, "#e8c08a")).join("") + [[60, 100], [120, 96]].map(([x, y], i) => g(path("M0 0 V-20", "none", "#58bd6d", 2) + circle(0, -22, 5, ["#ff9ab5", "#ffd166"][i]), x, y + 20)).join(""),
};
const FX = {
  none: () => "",
  rain: () => Array.from({ length: 22 }, (_, i) => { const r = rng(900 + i); return path(`M${(30 + r() * 140).toFixed(0)} ${(30 + r() * 110).toFixed(0)} l-4 12`, "none", "#e8f4ff", 2, 'opacity=".85"'); }).join(""),
  snow: () => Array.from({ length: 26 }, (_, i) => { const r = rng(950 + i); return circle(30 + r() * 140, 30 + r() * 120, 1.4 + r() * 2.6, "#fff", 'opacity=".95"'); }).join(""),
  petals: () => Array.from({ length: 12 }, (_, i) => { const r = rng(990 + i); const x = 30 + r() * 140, y = 30 + r() * 110; return ellipse(x, y, 5, 3, "#ffb3c9", `transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"`); }).join(""),
  sparkle: () => star(60, 56, 6, "#fff", 0.95) + star(140, 48, 5, "#fff", 0.9) + star(118, 96, 4, "#fff", 0.8) + star(80, 110, 4, "#fff", 0.8),
};
const CELEST = { day: sun(136, 58, 14), sunset: sun(100, 112, 18, "#fff2b0"), dusk: sun(70, 100, 14, "#ffe0a8"), night: moon(130, 56, 12) + stars(14, 77, 90), dawn: sun(70, 110, 14, "#ffd9a0"), gray: "", teal: sun(130, 54, 12, "#fff2b0"), pink: sun(120, 70, 12, "#fff0c8"), gold: sun(110, 60, 16, "#fff2b0"), lav: moon(70, 60, 10, "#fff7c2") + stars(8, 81, 80) };
const viewOf = (p, [sky, ground, fx]) => `<rect width="200" height="200" fill="url(#vg_${sky})"/>${CELEST[sky]}${cl(30, 50, 0.26, sky === "night" || sky === "lav" ? "#7a84c8" : "#fff", 0.9)}${GROUND[ground](p)}${FX[fx]()}`;

const DECOR = {
  plant: (p) => rect(78, 156, 44, 28, p.a, 6) + rect(74, 152, 52, 8, mix(p.a, "#000000", 0.14), 4) + [-24, 0, 24].map((r) => path("M100 152 Q100 126 100 112", "none", "#4fae6a", 4, `transform="rotate(${r} 100 152)"`)).join("") + [-24, 0, 24].map((r) => g(path("M0 0 Q10 -14 0 -28 Q-10 -14 0 0Z", "#58bd6d"), 100, 118, 1, r)).join(""),
  cat: (p) => ellipse(100, 160, 38, 22, "#f6b26b") + circle(72, 148, 18, "#f6b26b") + path("M58 138 L58 118 L72 130Z M86 138 L86 118 L72 130Z", "#f6b26b") + path("M66 150 q3 3 6 0 M76 150 q3 3 6 0", "none", "#3a3038", 2) + path("M134 164 Q160 168 154 148", "none", "#e0963f", 8) + [0, 1, 2].map((i) => path(`M${90 + i * 10} 146 v8`, "none", "#e08f3e", 3)).join(""),
  books: (p) => rect(64, 158, 72, 12, p.a, 2) + rect(70, 146, 62, 12, p.c, 2) + rect(66, 134, 66, 12, mix(p.a, "#ffffff", 0.4), 2) + rect(72, 160, 56, 2, "#fff", 1, 'opacity=".6"') + rect(76, 148, 50, 2, "#fff", 1, 'opacity=".6"'),
  candle: (p) => rect(82, 150, 36, 34, "#fff6e4", 8, 'stroke="#e8d8c0" stroke-width="2"') + rect(96, 136, 8, 16, "#fff") + path("M100 134 q-6 -10 0 -18 q6 8 0 18Z", "#ffb938") + circle(100, 126, 16, "#ffe27a", 'opacity=".25"') + path("M88 166 H112", "none", p.a, 3),
  mug: (p) => path("M76 146 H124 L120 182 H80Z", "#fff") + path("M124 154 Q142 154 140 168 Q138 176 122 174", "none", "#fff", 7) + rect(76, 150, 48, 5, p.a, 2) + path("M84 140 q-4 -8 0 -14 q4 -8 0 -14 M100 140 q-4 -8 0 -14 q4 -8 0 -14 M116 140 q-4 -8 0 -14 q4 -8 0 -14", "none", "#fff", 3, 'opacity=".8"'),
  lampD: (p) => rect(96, 150, 8, 32, "#8a6a5a") + ellipse(100, 184, 22, 5, "#8a6a5a") + path("M72 150 L84 120 H116 L128 150Z", p.c) + circle(100, 150, 22, "#ffe27a", 'opacity=".3"'),
  birds: (p) => [[70, 160, p.a], [112, 164, p.c]].map(([x, y, c]) => ellipse(x, y, 16, 12, c) + circle(x - 12, y - 8, 9, c) + path(`M${x - 20} ${y - 8} l-6 3 l6 3Z`, "#ffb938") + circle(x - 14, y - 10, 1.8, "#3a3038") + path(`M${x + 12} ${y} l16 6`, "none", c, 4) + path(`M${x - 4} ${y + 12} v6 M${x + 4} ${y + 12} v6`, "none", "#ffb938", 2)).join(""),
  vase: (p) => path("M82 156 Q80 184 92 184 H108 Q120 184 118 156Z", "#bfe8f7") + path("M84 164 Q100 172 116 164", "none", "#fff", 2, 'opacity=".7"') + [[88, 132, "#ff9ab5"], [100, 124, "#ffd166"], [112, 134, "#c9a6ff"]].map(([x, y, c]) => path(`M${x} 156 Q${x} 140 ${x} ${y}`, "none", "#58bd6d", 3) + circle(x, y, 8, c) + circle(x, y, 3, "#ffd54f")).join(""),
  lantern: (p) => path("M86 120 H114 L118 130 V170 H82 V130Z", p.a) + rect(84, 128, 32, 40, "#ffe27a", 4, 'opacity=".85"') + path("M86 120 Q100 106 114 120", "none", p.d, 3) + rect(80, 168, 40, 6, p.d, 3) + circle(100, 148, 24, "#ffe27a", 'opacity=".25"'),
  chime: (p) => rect(70, 112, 60, 5, "#a8704a", 2) + [[78, 30], [92, 42], [106, 26], [120, 38]].map(([x, h], i) => path(`M${x} 117 V${117 + h}`, "none", "#c9ced6", 1.6) + rect(x - 3, 117 + h, 6, 36, ["#9ae6c9", "#ffd166", "#ff9ab5", "#9ac4f0"][i], 3)).join(""),
  cactus: (p) => rect(80, 164, 40, 20, "#e8a07a", 4) + rect(76, 160, 48, 8, "#d98a5a", 3) + rect(92, 120, 16, 44, "#58bd6d", 8) + rect(76, 134, 12, 20, "#58bd6d", 6) + rect(112, 128, 12, 22, "#58bd6d", 6) + path("M84 150 H92 M108 148 H116", "none", "#58bd6d", 4) + circle(100, 118, 5, "#ff9ab5"),
  teapot: (p) => ellipse(100, 166, 28, 20, p.a) + rect(86, 142, 28, 8, mix(p.a, "#ffffff", 0.2), 4) + circle(100, 140, 4, p.d) + path("M126 160 Q146 154 150 140 Q132 146 126 150", "none", p.a, 5) + path("M74 158 Q58 160 60 172 Q66 176 74 172", "none", p.a, 5) + path("M80 160 Q100 168 120 160", "none", "#fff", 2, 'opacity=".5"'),
};
const CURT = {
  none: () => "",
  tied: (p, bb) => { const [x, y, w, h] = bb; return path(`M${x - 10} ${y - 8} Q${x + 4} ${y + h * 0.5} ${x - 6} ${y + h + 4} H${x + 10} Q${x + 18} ${y + h * 0.55} ${x + 14} ${y - 8}Z`, p.c, "none", 0, 'opacity=".95"') + path(`M${x + w + 10} ${y - 8} Q${x + w - 4} ${y + h * 0.5} ${x + w + 6} ${y + h + 4} H${x + w - 10} Q${x + w - 18} ${y + h * 0.55} ${x + w - 14} ${y - 8}Z`, p.c, "none", 0, 'opacity=".95"') + rect(x - 12, y - 12, w + 24, 5, p.d, 2); },
  sheer: (p, bb) => { const [x, y, w, h] = bb; return path(`M${x - 4} ${y - 6} H${x + w + 4} V${y + h} H${x - 4}Z`, "#fff", "none", 0, 'opacity=".32"') + Array.from({ length: 5 }, (_, i) => path(`M${x + 6 + i * (w / 5)} ${y} V${y + h}`, "none", "#fff", 3, 'opacity=".35"')).join("") + rect(x - 8, y - 10, w + 16, 4, "#a8704a", 2); },
};
const gradDefs = (p) => Object.entries(SKY).map(([k, [a, b]]) => `<linearGradient id="vg_${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`).join("");
let wid = 0;
const mkWin = (fr, vw, dc, cu, wall) => (p) => { const F = FRAMES[fr]; const k = "wn" + (wid++); const [bx, by, bw, bh] = F.bb;
  const extra = fr === "shutters" ? path("M60 36 H40 V148 H60Z M140 36 H160 V148 H140Z", p.c) + [0, 1, 2, 3, 4, 5].map((i) => path(`M42 ${44 + i * 17} H58 M142 ${44 + i * 17} H158`, "none", p.paper, 2, 'opacity=".7"')).join("") : "";
  const awning = fr === "cafe" ? path("M26 52 H174 L168 36 H32Z", p.a) + Array.from({ length: 6 }, (_, i) => path(`M${32 + i * 23} 36 H${55 + i * 23} L${57 + i * 23} 52 H${30 + i * 23}Z`, i % 2 ? "#fff" : p.a)).join("") + path("M26 52 q6 8 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0", p.a, "none", 0) : "";
  return `<defs>${gradDefs(p)}<clipPath id="${k}"><path d="${F.d}"/></clipPath></defs>` + rect(0, 0, 200, 200, wall, 16) +
  (fr === "bay" || fr === "grid" ? "" : "") + path(F.d, p.paper, mix(p.d, "#ffffff", 0.6), 14, 'opacity="1"') + `<g clip-path="url(#${k})">${viewOf(p, vw)}</g>` + path(F.d, "none", p.paper, 8) + path(F.d, "none", mix(p.a, "#ffffff", 0.2), 3.4) + path(F.mun, "none", p.paper, 4) + extra + awning +
  (fr === "cafe" ? g(`<text x="0" y="0" text-anchor="middle" font-size="13" font-weight="800" fill="${p.d}" font-family="Noto Sans CJK KR">OPEN</text>`, 100, 110) : "") + CURT[cu](p, F.bb) + rect(24, 150, 152, 8, "#fff", 4) + rect(24, 150, 152, 3, "#fff", 2, 'opacity="0"') + rect(30, 158, 140, 5, mix(p.d, "#ffffff", 0.5), 2, 'opacity=".5"') + DECOR[dc](p) + star(26, 34, 6, p.c, 0.9) + star(174, 42, 5, p.c, 0.85); };
// 창틀 × 풍경(하늘·땅·날씨) × 창턱 소품 × 커튼 × 벽색 — 50가지 조합은 모두 다릅니다.
const W = [
  ["plain", ["day", "hills", "none"], "plant", "none", "#fff1e8"], ["arch", ["sunset", "sea", "none"], "cat", "tied", "#fff4f0"], ["round", ["night", "city", "sparkle"], "candle", "none", "#eef0ff"], ["french", ["day", "field", "none"], "vase", "sheer", "#fffbe8"], ["grid", ["gray", "rooftops", "rain"], "mug", "none", "#f0f4f8"],
  ["shutters", ["gold", "hills", "petals"], "birds", "none", "#fff6e8"], ["bay", ["teal", "lake", "none"], "teapot", "tied", "#effbfb"], ["cafe", ["pink", "city", "sparkle"], "lampD", "none", "#fff0f6"], ["attic", ["night", "mountain", "sparkle"], "books", "none", "#eef0fb"], ["sash", ["dawn", "rooftops", "none"], "cactus", "none", "#fff3ec"],
  ["oval", ["lav", "forest", "sparkle"], "lantern", "sheer", "#f6f0ff"], ["lancet", ["dusk", "mountain", "none"], "candle", "tied", "#f6eefa"], ["plain", ["gray", "forest", "rain"], "books", "none", "#eef2f4"], ["arch", ["day", "snowhill", "snow"], "mug", "none", "#f0f6ff"], ["round", ["sunset", "hills", "none"], "plant", "none", "#fff2ea"],
  ["french", ["night", "rooftops", "snow"], "lampD", "tied", "#eceffa"], ["grid", ["teal", "sea", "none"], "chime", "none", "#edfbfb"], ["shutters", ["day", "fence", "none"], "vase", "none", "#f4fbf0"], ["bay", ["dusk", "city", "none"], "cat", "none", "#f7eefb"], ["cafe", ["day", "city", "none"], "mug", "none", "#fff7ec"],
  ["attic", ["gold", "field", "none"], "birds", "none", "#fffae6"], ["sash", ["night", "lake", "sparkle"], "teapot", "none", "#ecf0fb"], ["oval", ["day", "sea", "none"], "cactus", "none", "#eef8fd"], ["lancet", ["pink", "hills", "petals"], "vase", "sheer", "#fff2f7"], ["plain", ["dawn", "mountain", "none"], "lantern", "none", "#fff2ee"],
  ["arch", ["gray", "city", "rain"], "candle", "none", "#eef1f6"], ["round", ["gold", "forest", "none"], "cat", "none", "#fff8e6"], ["french", ["day", "snowhill", "snow"], "teapot", "tied", "#eff6ff"], ["grid", ["sunset", "mountain", "none"], "plant", "none", "#fff1ea"], ["shutters", ["teal", "forest", "none"], "books", "none", "#eefaf8"],
  ["bay", ["day", "fence", "petals"], "birds", "sheer", "#f4fbf1"], ["cafe", ["night", "city", "sparkle"], "candle", "none", "#eceffb"], ["attic", ["sunset", "rooftops", "none"], "mug", "none", "#fff0e8"], ["sash", ["gold", "hills", "none"], "lampD", "none", "#fffbe9"], ["oval", ["dusk", "lake", "none"], "plant", "none", "#f4eefa"],
  ["lancet", ["day", "hills", "none"], "chime", "none", "#f2f8ff"], ["plain", ["pink", "city", "none"], "teapot", "tied", "#fff0f5"], ["arch", ["teal", "mountain", "none"], "lantern", "none", "#edfaf9"], ["round", ["gray", "sea", "rain"], "mug", "none", "#eef2f6"], ["french", ["lav", "hills", "sparkle"], "vase", "none", "#f7f1ff"],
  ["grid", ["dawn", "lake", "none"], "birds", "none", "#fff3f0"], ["shutters", ["night", "forest", "sparkle"], "books", "none", "#eceef8"], ["bay", ["gold", "sea", "none"], "plant", "tied", "#fffbea"], ["cafe", ["dusk", "rooftops", "none"], "lampD", "none", "#f6eefa"], ["attic", ["day", "forest", "petals"], "cat", "none", "#f1faf3"],
  ["sash", ["gray", "snowhill", "snow"], "candle", "none", "#f0f4fa"], ["oval", ["sunset", "city", "none"], "chime", "none", "#fff1ec"], ["lancet", ["teal", "sea", "none"], "cactus", "none", "#edfbfc"], ["plain", ["lav", "mountain", "sparkle"], "teapot", "sheer", "#f6f0ff"], ["arch", ["dawn", "hills", "none"], "vase", "tied", "#fff3f1"],
];
export const windows = W.map(([fr, vw, dc, cu, wall]) => mkWin(fr, vw, dc, cu, wall));
