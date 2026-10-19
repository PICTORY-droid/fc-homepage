// 추억 소품 그림 — 200x200 칸 안에 직접 그린 오리지널 SVG (공식 로고·캐릭터·상표 없음)
import { circle, ellipse, rect, path, g, star, mix } from "../seasons/kit.mjs";
const line = (d, c, w = 4) => path(d, "none", c, w);

export const schoolbag = (p) => rect(52, 44, 96, 128, p.a, 16) + rect(52, 44, 96, 58, mix(p.a, "#000", .14), 16) + rect(52, 78, 96, 24, mix(p.a, "#000", .14)) + rect(88, 88, 24, 28, p.c, 5) + circle(100, 102, 4, p.paper) +
  rect(62, 124, 76, 38, mix(p.a, "#fff", .18), 8) + rect(70, 134, 60, 5, p.paper, 2, 'opacity=".7"') + path("M72 44 Q100 10 128 44", "none", p.d, 7) + rect(40, 100, 14, 50, mix(p.a, "#000", .2), 6) + rect(146, 100, 14, 50, mix(p.a, "#000", .2), 6) +
  path("M148 60 q22 6 16 30", "none", p.c, 3) + circle(164, 94, 7, p.c) + rect(82, 18, 36, 22, p.paper, 4, `stroke="${p.d}" stroke-width="2"`) + g('<text x="18" y="15" text-anchor="middle" font-size="11" font-weight="700" fill="#555" font-family="Noto Sans CJK KR">이름</text>', 82, 18);

export const mailbox = (p) => rect(92, 130, 16, 58, "#7a5a3c") + rect(66, 184, 68, 8, "#5d4329", 4) + path("M52 130 V74 a48 48 0 0 1 96 0 V130Z", p.a) + path("M52 112 H148 V130 H52Z", mix(p.a, "#000", .22)) +
  rect(68, 82, 64, 9, mix(p.a, "#000", .35), 4.5) + rect(72, 96, 56, 4, p.paper, 2, 'opacity=".75"') + circle(100, 54, 12, p.paper, 'opacity=".9"') + path("M92 54 h16 M100 46 v16", "none", p.a, 3.5) + rect(70, 138, 60, 28, p.paper, 4, 'opacity=".9"') + path("M76 150 h48 M76 158 h34", "none", p.d, 2.5, 'opacity=".5"');

export const radio = (p) => rect(24, 64, 152, 96, p.a, 16) + rect(34, 74, 132, 76, mix(p.a, "#000", .12), 10) + circle(66, 112, 28, mix(p.a, "#000", .38)) + Array.from({ length: 5 }, (_, i) => circle(66, 112, 25 - i * 5, "none", 'stroke="#ffffff30" stroke-width="2"')).join("") +
  rect(104, 84, 54, 22, p.paper, 4) + path("M110 106 V88 M124 106 V94 M138 106 V90", "none", p.d, 2) + path("M112 98 H152", "none", p.c, 2) + circle(116, 130, 9, p.paper) + circle(146, 130, 9, p.paper) + path("M60 64 L126 18", "none", p.d, 4) + circle(126, 18, 5, p.c) + rect(40, 160, 12, 10, p.d, 3) + rect(148, 160, 12, 10, p.d, 3);

export const payphone = (p) => rect(54, 18, 92, 164, p.a, 12) + rect(54, 18, 92, 40, mix(p.a, "#000", .2), 12) + rect(64, 26, 72, 24, p.paper, 4) + g('<text x="36" y="17" text-anchor="middle" font-size="14" font-weight="800" fill="#444" font-family="Noto Sans CJK KR">공중전화</text>', 64, 26) +
  rect(64, 70, 72, 24, "#2a2a2a", 4) + circle(100, 82, 6, p.c) + Array.from({ length: 9 }, (_, i) => circle(76 + (i % 3) * 24, 110 + Math.floor(i / 3) * 16, 5, p.paper)).join("") + rect(80, 160, 40, 8, p.d, 3) +
  path("M54 70 Q30 76 34 104 Q38 124 54 128", "none", mix(p.a, "#000", .3), 9) + path("M44 100 q-12 20 -4 44 t10 30", "none", "#444", 3);

export const electricfan = (p) => rect(92, 126, 16, 44, "#777") + path("M56 178 H144 L136 168 H64Z", p.d) + circle(100, 82, 62, "none", `stroke="${p.d}" stroke-width="6"`) + circle(100, 82, 44, "none", `stroke="${p.d}" stroke-width="2.5" opacity=".6"`) + circle(100, 82, 26, "none", `stroke="${p.d}" stroke-width="2" opacity=".5"`) +
  [0, 120, 240].map((r) => ellipse(100, 52, 14, 30, p.b, `transform="rotate(${r} 100 82)" opacity=".92"`)).join("") + circle(100, 82, 11, p.a) + circle(100, 82, 4, p.paper) + path("M100 20 V144 M38 82 H162", "none", p.d, 1.8, 'opacity=".5"') + rect(88, 138, 24, 10, p.d, 3);

export const roastpotato = (p) => rect(92, 20, 18, 50, "#555", 4) + rect(86, 14, 30, 10, "#444", 4) + ellipse(100, 84, 54, 12, "#6a6a6a") + rect(46, 84, 108, 80, "#7a7a7a", 8) + rect(46, 84, 108, 14, "#8f8f8f") + rect(46, 150, 108, 14, "#666", 8) +
  path("M62 112 H138", "none", "#5a5a5a", 3) + path("M70 126 a14 12 0 0 1 28 0Z", "#2a2a2a") + path("M78 126 q4 -14 8 -4 q4 -10 6 4Z", "#ff9f43") + ellipse(150, 168, 26, 10, p.c, 'transform="rotate(-8 150 168)"') + ellipse(124, 176, 22, 9, mix(p.c, "#000", .15), 'transform="rotate(6 124 176)"') + path("M20 184 H180", "none", "#5a4a3a", 5) +
  path("M34 62 q8 -12 0 -22 M20 70 q8 -12 0 -22", "none", p.b, 3, 'opacity=".8"');

export const pencils = (p) => [[-28, p.a], [6, p.c], [34, p.b]].map(([r, c], i) => g(`<rect x="-9" y="-70" width="18" height="120" fill="${c}"/><rect x="-9" y="-70" width="6" height="120" fill="#fff" opacity=".25"/><path d="M-9 50 L0 82 L9 50Z" fill="#f0d3a8"/><path d="M-3 70 L0 82 L3 70Z" fill="#444"/><rect x="-9" y="-86" width="18" height="16" fill="#e8928a"/><rect x="-9" y="-72" width="18" height="6" fill="#bbb"/>`, 100 + i * 4, 98, 1, r)).join("") + rect(30, 168, 140, 14, mix(p.paper, "#000", .05), 3, `stroke="${p.d}" stroke-width="2"`) + Array.from({ length: 9 }, (_, i) => rect(38 + i * 15, 168, 2, i % 3 ? 6 : 10, p.d)).join("");

export const camera = (p) => rect(26, 62, 148, 92, p.a, 14) + rect(26, 62, 148, 28, mix(p.a, "#000", .22), 14) + rect(26, 78, 148, 12, mix(p.a, "#000", .22)) + circle(100, 112, 34, "#2d2d2d") + circle(100, 112, 25, "#4a5560") + circle(100, 112, 14, "#1d2329") + circle(92, 104, 5, "#fff", 'opacity=".6"') +
  rect(46, 44, 32, 20, mix(p.a, "#000", .35), 4) + rect(132, 50, 28, 14, p.paper, 3) + circle(148, 76, 5, p.c) + path("M26 80 Q8 110 26 138", "none", p.d, 5) + rect(34, 98, 18, 12, p.paper, 3, 'opacity=".85"');

export const patjuk = (p) => ellipse(100, 120, 78, 46, "#8a3a2a") + ellipse(100, 112, 70, 38, "#5e1f1a") + path("M30 112 q70 30 140 0", "none", "#00000030", 3) +
  [[70, 106], [96, 98], [124, 106], [84, 122], [112, 120], [140, 118], [58, 122]].map(([x, y], i) => circle(x, y, 8 + (i % 2), "#f6efe0")).join("") + path("M38 120 Q40 168 100 172 Q160 168 162 120", "#b4452e") + path("M60 168 H140", "none", "#8a3a2a", 6) +
  path("M156 46 L112 100", "none", "#c49a6c", 6) + ellipse(156, 46, 14, 8, "#c49a6c", 'transform="rotate(-48 156 46)"') + path("M70 60 q8 -12 0 -22 M96 56 q8 -12 0 -22 M122 60 q8 -12 0 -22", "none", "#ddd", 3, 'opacity=".8"');
