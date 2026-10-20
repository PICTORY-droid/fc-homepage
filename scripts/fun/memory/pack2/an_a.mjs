import { circle, ellipse, rect, path, g, star, mix, D, eye, blush, nz, mouth, shade, bow, sparkle, heart, whisk, scarf, dots } from "./an_kit.mjs";

export const cat = (p) => shade() + path("M138 168 Q186 168 176 120 Q172 106 162 116", "none", "#f2a65a", 13) + ellipse(100, 150, 40, 36, "#f6b26b") + ellipse(100, 160, 22, 22, "#fff3df") +
  path("M54 80 L56 34 L92 58Z", "#f6b26b") + path("M146 80 L144 34 L108 58Z", "#f6b26b") + path("M62 70 L63 46 L82 60Z", "#ffb6c1") + path("M138 70 L137 46 L118 60Z", "#ffb6c1") +
  ellipse(100, 96, 52, 44, "#f6b26b") + [[92, 62], [100, 58], [108, 62]].map(([x, y]) => path(`M${x} ${y} v12`, "none", "#e08f3e", 4)).join("") + ellipse(100, 112, 24, 17, "#fff3df") +
  eye(78, 98, 5.5) + eye(122, 98, 5.5) + nz(100, 106, "#ff8a9c", 4.5) + mouth(100, 110, 6) + blush(66, 112) + blush(134, 112) + whisk(58, 108, -1) + whisk(142, 108, 1) + ellipse(84, 176, 12, 8, "#fff3df") + ellipse(116, 176, 12, 8, "#fff3df") + bow(100, 140, p, 1) + dots(p);

export const dog = (p) => shade() + ellipse(100, 150, 40, 36, "#e8c08c") + ellipse(100, 160, 22, 22, "#fff7ea") + path("M146 160 Q176 150 172 126", "none", "#d9a96c", 11) +
  path("M54 66 Q30 70 34 112 Q40 134 58 116 Q66 90 62 70Z", "#b97d45") + path("M146 66 Q170 70 166 112 Q160 134 142 116 Q134 90 138 70Z", "#b97d45") + ellipse(100, 96, 50, 44, "#e8c08c") +
  ellipse(100, 112, 25, 19, "#fff7ea") + path("M76 78 Q92 70 98 84 Q86 100 74 94Z", "#b97d45", "none", 0, 'opacity=".0"') + ellipse(76, 90, 12, 14, "#b97d45", 'opacity=".9"') +
  eye(78, 94, 5.5) + eye(122, 94, 5.5) + nz(100, 104, D, 7) + path("M100 108 v6 M92 114 Q100 122 108 114", "none", D, 2) + path("M95 117 Q100 134 105 117Z", "#ff7f8e") + blush(68, 110) + blush(132, 110) + path("M78 138 H122", "none", p.a, 9) + circle(100, 148, 7, p.c) + dots(p);

export const rabbit = (p) => shade() + ellipse(100, 152, 38, 34, "#fffaf5") + ellipse(76, 36, 15, 44, "#fffaf5", 'transform="rotate(-10 76 36)"') + ellipse(124, 36, 15, 44, "#fffaf5", 'transform="rotate(10 124 36)"') +
  ellipse(76, 38, 8, 32, "#ffc3d0", 'transform="rotate(-10 76 38)"') + ellipse(124, 38, 8, 32, "#ffc3d0", 'transform="rotate(10 124 38)"') + ellipse(100, 104, 48, 42, "#fffaf5") + eye(80, 102, 5.5) + eye(120, 102, 5.5) +
  nz(100, 110, "#ff8a9c", 4.5) + path("M100 112 v6 M94 120 Q100 126 106 120", "none", D, 2) + blush(66, 116) + blush(134, 116) + whisk(60, 112, -1) + whisk(140, 112, 1) + ellipse(88, 176, 12, 8, "#fffaf5") + ellipse(112, 176, 12, 8, "#fffaf5") +
  path("M72 138 q28 14 56 0 q-4 14 -28 14 q-24 0 -28 -14Z", p.a) + circle(150, 160, 14, "#fffaf5") + dots(p);

export const bear = (p) => shade() + ellipse(100, 152, 42, 36, "#b98355") + ellipse(100, 158, 24, 22, "#e8c9a0") + circle(60, 62, 17, "#b98355") + circle(140, 62, 17, "#b98355") + circle(60, 62, 9, "#e8c9a0") + circle(140, 62, 9, "#e8c9a0") +
  ellipse(100, 98, 52, 46, "#b98355") + ellipse(100, 114, 24, 18, "#f1dcc0") + eye(78, 94, 5.5) + eye(122, 94, 5.5) + nz(100, 106, D, 7) + path("M100 110 v6 M92 116 Q100 122 108 116", "none", D, 2) + blush(66, 108) + blush(134, 108) +
  heart(100, 160, 14, p.a) + ellipse(70, 176, 13, 9, "#a06c42") + ellipse(130, 176, 13, 9, "#a06c42") + dots(p);

export const panda = (p) => shade() + ellipse(100, 154, 44, 36, "#fff") + ellipse(66, 172, 14, 12, D) + ellipse(134, 172, 14, 12, D) + path("M58 142 Q100 160 142 142 Q142 156 100 164 Q58 156 58 142Z", D) + circle(58, 60, 17, D) + circle(142, 60, 17, D) +
  ellipse(100, 98, 54, 46, "#fff") + ellipse(78, 96, 13, 17, D, 'transform="rotate(24 78 96)"') + ellipse(122, 96, 13, 17, D, 'transform="rotate(-24 122 96)"') + circle(79, 95, 5, "#fff") + circle(121, 95, 5, "#fff") + circle(80, 95, 3, D) + circle(120, 95, 3, D) +
  nz(100, 112, D, 7) + path("M100 116 v5 M93 121 Q100 127 107 121", "none", D, 2) + blush(64, 114, 8) + blush(136, 114, 8) +
  path("M150 120 Q176 96 184 54 Q150 74 150 120Z", "#7dc27a") + path("M152 116 Q168 90 180 60", "none", "#4f9a55", 2.5) + dots(p);

export const penguin = (p) => shade() + ellipse(100, 112, 54, 70, "#33384a") + ellipse(100, 128, 36, 52, "#fff") + path("M48 108 Q22 130 36 156 Q52 150 56 128Z", "#33384a") + path("M152 108 Q178 130 164 156 Q148 150 144 128Z", "#33384a") +
  ellipse(100, 78, 42, 36, "#33384a") + ellipse(100, 88, 28, 24, "#fff") + eye(86, 78, 5) + eye(114, 78, 5) + path("M90 90 Q100 84 110 90 Q100 106 90 90Z", "#ffa940") + blush(76, 90, 7) + blush(124, 90, 7) +
  ellipse(84, 184, 16, 7, "#ffa940") + ellipse(116, 184, 16, 7, "#ffa940") + path("M62 104 Q100 124 138 104 L134 118 Q100 138 66 118Z", p.a) + path("M122 114 l8 30 l14 -6 l-8 -28Z", mix(p.a, "#000000", 0.14)) + sparkle(36, 40, 7, p.c) + sparkle(166, 46, 5, p.c) + heart(160, 168, 5, p.a, .8);

export const fox = (p) => shade() + path("M138 160 Q196 160 184 104 Q166 100 156 126 Q150 146 138 150Z", "#f08a3c") + path("M170 112 Q184 108 184 104 Q178 130 170 140Z", "#fff") + ellipse(100, 152, 38, 34, "#f08a3c") + ellipse(100, 160, 20, 20, "#fff") +
  path("M50 84 L54 30 L94 62Z", "#f08a3c") + path("M150 84 L146 30 L106 62Z", "#f08a3c") + path("M60 70 L60 46 L80 60Z", D) + path("M140 70 L140 46 L120 60Z", D) +
  path("M48 100 Q50 66 100 62 Q150 66 152 100 Q150 128 100 140 Q50 128 48 100Z", "#f08a3c") + path("M48 104 Q76 108 100 140 Q124 108 152 104 Q146 132 100 142 Q54 132 48 104Z", "#fff") +
  eye(80, 98, 5) + eye(120, 98, 5) + circle(100, 120, 5, D) + path("M100 125 v4 M94 130 Q100 134 106 130", "none", D, 2) + blush(66, 112) + blush(134, 112) + path("M72 146 q28 14 56 0 q-6 14 -28 14 q-22 0 -28 -14Z", p.a) + dots(p);

export const squirrel = (p) => shade() + path("M128 170 Q196 176 186 110 Q180 60 140 70 Q172 84 164 124 Q158 150 128 150Z", "#c47a3c") + path("M150 110 Q164 96 168 80", "none", "#e8b27a", 5) + ellipse(100, 150, 36, 36, "#c47a3c") + ellipse(100, 158, 20, 22, "#ffeacb") +
  path("M60 74 L58 38 L88 62Z", "#c47a3c") + path("M140 74 L142 38 L112 62Z", "#c47a3c") + path("M62 40 l0 -10 M138 40 l0 -10", "none", "#8a4f20", 4) + ellipse(100, 98, 44, 38, "#c47a3c") + ellipse(100, 112, 22, 16, "#ffeacb") +
  eye(82, 96, 5.5) + eye(118, 96, 5.5) + nz(100, 106, D, 5) + path("M96 112 v8 h8 v-8", "#fff", D, 1.6) + blush(68, 108) + blush(132, 108) +
  g(path("M0 0 Q-14 -2 -14 14 Q-12 28 0 30 Q12 28 14 14 Q14 -2 0 0Z", "#a56a35") + rect(-8, -8, 16, 8, "#6f4a22", 3) + path("M0 -8 v-8", "none", "#6f4a22", 3), 62, 150, 0.9) + dots(p);

export const hedgehog = (p) => shade() + Array.from({ length: 22 }, (_, i) => { const a = (Math.PI * (i + 0.5)) / 22 + Math.PI; const x = 100 + Math.cos(a) * 62, y = 128 + Math.sin(a) * 64; return path(`M${(100 + Math.cos(a) * 40).toFixed(1)} ${(128 + Math.sin(a) * 42).toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}`, "none", "#8a6a4f", 7); }).join("") +
  ellipse(100, 128, 64, 52, "#9b7a5c") + path("M36 138 Q42 98 82 92 Q116 90 128 110 Q150 114 170 130 Q172 168 100 172 Q44 172 36 138Z", "#f3d9b8") + circle(56, 132, 5, D) + ellipse(40, 136, 5, 4, D) + blush(70, 148, 7) +
  circle(86, 120, 4.5, D) + circle(86, 119, 1.5, "#fff") + path("M94 140 Q104 146 112 138", "none", D, 2) + ellipse(80, 170, 11, 7, "#e6c79f") + ellipse(124, 170, 11, 7, "#e6c79f") + circle(150, 70, 12, "#e85d5d") + path("M150 58 q6 -10 14 -8", "none", "#5a8f4a", 3) + dots(p);

export const hamster = (p) => shade() + ellipse(100, 140, 66, 52, "#f2c894") + ellipse(100, 150, 44, 38, "#fff6e8") + circle(54, 74, 15, "#f2c894") + circle(146, 74, 15, "#f2c894") + circle(54, 74, 8, "#ffc3d0") + circle(146, 74, 8, "#ffc3d0") +
  ellipse(100, 108, 62, 48, "#f2c894") + ellipse(100, 120, 40, 28, "#fff6e8") + path("M56 98 Q74 78 100 90 Q86 100 70 112Z", "#d9955a", "none", 0, 'opacity=".75"') + path("M144 98 Q126 78 100 90 Q114 100 130 112Z", "#d9955a", "none", 0, 'opacity=".75"') +
  eye(78, 104, 5.5) + eye(122, 104, 5.5) + nz(100, 114, "#ff8a9c", 4) + path("M100 117 v4 M94 122 Q100 127 106 122", "none", D, 2) + blush(60, 122, 10) + blush(140, 122, 10) +
  ellipse(100, 150, 12, 8, "#c9a86a") + path("M100 146 l-4 8 M100 146 l4 8", "none", "#8a6a3a", 1.6) + ellipse(86, 172, 11, 8, "#fff6e8") + ellipse(114, 172, 11, 8, "#fff6e8") + dots(p);

export const sheep = (p) => shade() + rect(78, 150, 9, 30, "#6a5a55", 4) + rect(113, 150, 9, 30, "#6a5a55", 4) +
  [[52, 112, 30], [78, 96, 32], [108, 94, 34], [138, 110, 32], [62, 140, 30], [96, 142, 36], [134, 138, 30], [100, 76, 26]].map(([x, y, r]) => circle(x, y, r, "#fffaf2", 'stroke="#efe3d2" stroke-width="2"')).join("") +
  ellipse(100, 104, 33, 36, "#5c4a48") + ellipse(66, 98, 14, 8, "#5c4a48", 'transform="rotate(20 66 98)"') + ellipse(134, 98, 14, 8, "#5c4a48", 'transform="rotate(-20 134 98)"') + circle(100, 80, 24, "#fffaf2") +
  eye(88, 104, 4.5) + eye(112, 104, 4.5) + ellipse(100, 122, 7, 5, "#3a2f33") + path("M100 127 v3 M95 131 Q100 135 105 131", "none", D, 1.8) + blush(80, 118, 7) + blush(120, 118, 7) + bow(130, 76, p, 0.8) + dots(p);

export const koala = (p) => shade() + ellipse(100, 154, 42, 36, "#a9b0b8") + ellipse(100, 160, 24, 22, "#e9edf1") + circle(50, 70, 26, "#a9b0b8") + circle(150, 70, 26, "#a9b0b8") + circle(50, 70, 15, "#f1f3f6") + circle(150, 70, 15, "#f1f3f6") +
  ellipse(100, 100, 52, 46, "#a9b0b8") + eye(80, 96, 5) + eye(120, 96, 5) + path("M86 100 Q100 94 114 100 Q116 126 100 130 Q84 126 86 100Z", D) + ellipse(95, 104, 3, 2, "#fff", 'opacity=".5"') + blush(64, 112) + blush(136, 112) +
  path("M146 160 Q176 150 190 110", "none", "#8a6a4a", 5) + path("M168 130 Q190 120 188 102 Q166 108 168 130Z", "#7dc27a") + path("M158 146 Q176 150 170 168 Q152 164 158 146Z", "#5fae6a") + ellipse(70, 176, 12, 8, "#8e969f") + ellipse(130, 176, 12, 8, "#8e969f") + dots(p);

export const fawn = (p) => shade() + rect(72, 150, 9, 32, "#d9a066", 4) + rect(119, 150, 9, 32, "#d9a066", 4) + ellipse(100, 140, 44, 34, "#e6b077") + [[84, 128], [104, 124], [120, 138], [92, 148], [110, 150], [74, 142]].map(([x, y]) => circle(x, y, 3.4, "#fff4e2")).join("") +
  ellipse(46, 78, 16, 9, "#e6b077", 'transform="rotate(-30 46 78)"') + ellipse(154, 78, 16, 9, "#e6b077", 'transform="rotate(30 154 78)"') + ellipse(46, 78, 8, 4, "#ffc3d0", 'transform="rotate(-30 46 78)"') + ellipse(154, 78, 8, 4, "#ffc3d0", 'transform="rotate(30 154 78)"') +
  path("M76 58 L72 38 M72 46 l-8 -6 M124 58 L128 38 M128 46 l8 -6", "none", "#c98e56", 4) + ellipse(100, 96, 42, 40, "#e6b077") + ellipse(100, 116, 22, 16, "#fff4e2") + eye(82, 94, 5.5) + eye(118, 94, 5.5) + nz(100, 108, D, 5) + path("M100 112 v4 M94 117 Q100 122 106 117", "none", D, 1.8) +
  blush(66, 108) + blush(134, 108) + path("M70 130 Q100 142 130 130", "none", p.a, 7) + circle(100, 138, 6, p.c) + dots(p);

export const duck = (p) => shade() + path("M30 110 Q24 78 50 78 Q54 52 100 52 Q146 52 150 80 Q176 78 170 114 Q164 168 100 170 Q40 168 30 110Z", "#ffd93d") + path("M44 120 Q70 150 108 128 Q96 160 70 160 Q46 150 44 120Z", "#ffc61a", "none", 0, 'opacity=".8"') + ellipse(100, 74, 38, 34, "#ffd93d") +
  eye(86, 70, 4.5) + eye(114, 70, 4.5) + path("M84 84 Q100 76 116 84 Q114 98 100 98 Q86 98 84 84Z", "#ff9f43") + path("M92 90 Q100 94 108 90", "none", "#c96a1a", 1.6) + blush(72, 86, 7) + blush(128, 86, 7) +
  path("M100 38 q-6 -14 6 -18 q-2 10 -6 18Z", "#ffd93d") + path("M20 188 q20 -8 40 0 t40 0 t40 0 t40 0", "none", p.c, 4, 'opacity=".6"') + bow(100, 130, p, 1) + dots(p);

export const otter = (p) => shade() + ellipse(100, 150, 44, 36, "#9b6b47") + ellipse(100, 156, 28, 26, "#e4c4a0") + path("M138 168 Q182 170 186 150 Q170 150 150 156", "#8a5c3a") + circle(60, 70, 13, "#9b6b47") + circle(140, 70, 13, "#9b6b47") +
  ellipse(100, 100, 48, 40, "#9b6b47") + ellipse(100, 114, 28, 20, "#e4c4a0") + eye(82, 96, 5) + eye(118, 96, 5) + nz(100, 106, D, 6) + path("M100 110 v4 M94 116 Q100 122 106 116", "none", D, 1.8) + whisk(70, 112, -1) + whisk(130, 112, 1) + blush(66, 112) + blush(134, 112) +
  g(path("M0 0 Q-24 -6 -26 14 Q-24 34 0 34 Q24 34 26 14 Q24 -6 0 0Z", p.a) + path("M-18 8 Q0 -4 18 8", "none", p.paper, 2.5) + path("M0 4 V30", "none", p.paper, 2, 'opacity=".6"'), 100, 144, 0.9) +
  ellipse(74, 150, 11, 8, "#7d553a") + ellipse(126, 150, 11, 8, "#7d553a") + path("M20 186 q20 -10 40 0 t40 0 t40 0 t40 0", "none", p.c, 4, 'opacity=".6"') + dots(p);

export const alpaca = (p) => shade() + ellipse(100, 150, 46, 36, "#fff5e6") + rect(84, 80, 32, 80, "#fff5e6", 14) + [[70, 140], [96, 150], [128, 140], [112, 128], [84, 128]].map(([x, y]) => circle(x, y, 18, "#fff5e6", 'stroke="#f0e2cc" stroke-width="2"')).join("") +
  ellipse(86, 38, 8, 22, "#fff5e6", 'transform="rotate(-14 86 38)"') + ellipse(114, 38, 8, 22, "#fff5e6", 'transform="rotate(14 114 38)"') + circle(100, 66, 26, "#fff5e6", 'stroke="#f0e2cc" stroke-width="2"') +
  ellipse(100, 82, 20, 24, "#f4dcc0") + eye(90, 76, 4.5) + eye(110, 76, 4.5) + ellipse(100, 92, 5, 3.6, "#c98a6a") + path("M100 95 v3 M95 99 Q100 103 105 99", "none", D, 1.6) + blush(86, 90, 5) + blush(114, 90, 5) +
  path("M82 120 Q100 130 118 120", "none", p.a, 9) + circle(100, 126, 6, p.c) + rect(80, 168, 8, 16, "#e0c7a6", 3) + rect(112, 168, 8, 16, "#e0c7a6", 3) + dots(p);

export const raccoon = (p) => shade() + path("M138 160 Q192 160 184 118 Q168 112 156 128Z", "#9a9aa3") + [0, 1, 2].map((i) => path(`M${150 + i * 10} ${122 + i * 8} q12 8 6 22`, "none", D, 5)).join("") + ellipse(100, 152, 40, 34, "#9a9aa3") + ellipse(100, 160, 22, 22, "#e6e6ec") +
  circle(58, 64, 15, "#9a9aa3") + circle(142, 64, 15, "#9a9aa3") + circle(58, 64, 7, D) + circle(142, 64, 7, D) + ellipse(100, 98, 52, 44, "#b8b8c0") + path("M52 92 Q76 82 100 94 Q124 82 148 92 Q148 118 124 112 Q100 106 76 112 Q52 118 52 92Z", D) +
  ellipse(100, 114, 24, 18, "#f4f4f8") + eye(78, 96, 5) + eye(122, 96, 5) + circle(78, 96, 5, "#fff") + circle(78, 96, 3.4, D) + circle(122, 96, 5, "#fff") + circle(122, 96, 3.4, D) + nz(100, 108, D, 6) + path("M100 112 v4 M94 118 Q100 124 106 118", "none", D, 1.8) +
  path("M70 138 H130", "none", p.a, 8) + dots(p);
