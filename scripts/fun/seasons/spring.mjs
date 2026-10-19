// 봄 편지지 20장 — 장마다 주인공 소재가 다릅니다.
import { circle, ellipse, rect, path, g, text, flower, roundFlower, leaf, star, cloud, pal, hexagon } from "./kit.mjs";

const BROWN = "#8b6b55", GREEN = "#6fae6a", DGREEN = "#4f8f55";
const stem = (d, w = 5, c = GREEN) => path(d, "none", c, w);

const cherry = (p) => stem("M10 190 Q60 120 100 100 T190 30", 7, BROWN) + stem("M80 118 Q96 150 90 176", 5, BROWN) + stem("M120 82 Q140 60 150 66", 4, BROWN) +
  roundFlower(60, 138, 26, 5, p.a, p.c) + roundFlower(108, 96, 30, 5, p.b, p.c, 20) + roundFlower(160, 48, 28, 5, p.a, p.c) + roundFlower(92, 172, 20, 5, p.b, p.c) + roundFlower(138, 72, 16, 5, p.paper, p.c) + roundFlower(34, 168, 14, 5, p.paper, p.c) +
  [[40, 90], [150, 130], [175, 100]].map(([x, y]) => ellipse(x, y, 7, 4, p.b, `transform="rotate(30 ${x} ${y})"`)).join("");
const sprout = (p) => ellipse(100, 170, 72, 16, "#9b7653") + ellipse(100, 166, 56, 10, "#b08a63") + stem("M100 166 Q98 130 100 96", 7) +
  leaf(100, 120, 80, 34, p.a, -38, DGREEN) + leaf(100, 110, 74, 32, p.b, 40, DGREEN) + circle(100, 88, 9, p.c) + [[40, 40], [160, 52], [150, 24]].map(([x, y]) => star(x, y, 8, p.c, 0.8)).join("");
const tulip = (x, y, col, s, p) => g(`${stem("M0 0 V80", 6)}${leaf(0, 70, 46, 16, DGREEN, -50)}${leaf(0, 76, 40, 14, DGREEN, 50)}${path("M-24 0 Q-28 -42 0 -56 Q28 -42 24 0 Q0 14 -24 0Z", col)}${path("M-8 -2 Q-6 -34 0 -54 Q6 -34 8 -2", "none", p.paper, 2, 'opacity=".6"')}`, x, y, s);
const tulips = (p) => tulip(52, 60, p.a, 0.9, p) + tulip(100, 40, p.c, 1.1, p) + tulip(150, 62, p.b, 0.9, p);
const forsythia = (p) => stem("M6 160 Q70 150 100 90 T196 40", 6, BROWN) + stem("M60 150 Q70 110 56 80", 4, BROWN) + stem("M120 80 Q150 90 170 120", 4, BROWN) +
  [[56, 78], [96, 96], [140, 70], [176, 44], [172, 118], [34, 150], [76, 134], [120, 108], [150, 52]].map(([x, y], i) => flower(x, y, 15 - (i % 3) * 2, 4, i % 2 ? p.a : p.b, p.d, i * 17)).join("") + leaf(100, 90, 34, 12, GREEN, 60) + leaf(36, 150, 30, 11, GREEN, -50);
const dandelion = (p) => stem("M100 196 Q96 150 100 100", 5) + leaf(98, 190, 56, 14, DGREEN, -40) + leaf(100, 186, 50, 13, DGREEN, 40) +
  Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2, r = 56; const x = 100 + Math.cos(a) * r, y = 78 + Math.sin(a) * r; return path(`M100 78 L${x.toFixed(1)} ${y.toFixed(1)}`, "none", p.paper, 2, 'opacity=".95"') + circle(x, y, 4, p.paper, `stroke="${p.b}" stroke-width="1.5"`); }).join("") + circle(100, 78, 10, p.b) +
  [[170, 30], [188, 62], [20, 40]].map(([x, y]) => path(`M${x} ${y} l8 -10`, "none", p.paper, 2) + circle(x + 8, y - 10, 4, p.paper, `stroke="${p.b}" stroke-width="1.5"`)).join("");
const swallow = (p) => path("M50 112 L8 142 L40 114 L6 104Z", p.d) + path("M52 96 Q90 70 130 94 Q150 108 134 122 Q92 132 52 112Z", p.d) + path("M70 96 Q96 56 150 52 Q120 80 100 100Z", mixc(p.d)) +
  circle(138, 92, 18, p.d) + path("M150 94 l18 6 l-16 6Z", p.c) + circle(144, 88, 3, "#fff") + path("M120 112 Q136 118 148 104 Q140 124 118 124Z", p.a) +
  g(`<rect width="40" height="28" rx="4" fill="${p.paper}" stroke="${p.d}" stroke-width="3"/><path d="M2 4 L20 18 L38 4" fill="none" stroke="${p.d}" stroke-width="3"/>`, 148, 112, 1, 14);
const mixc = (c) => c + "cc";
const butterfly = (p) => path("M100 100 Q30 30 20 90 Q20 130 100 108Z", p.a) + path("M100 100 Q170 30 180 90 Q180 130 100 108Z", p.a) + path("M100 108 Q36 120 52 168 Q80 176 100 116Z", p.b) + path("M100 108 Q164 120 148 168 Q120 176 100 116Z", p.b) +
  [[54, 82, 10], [146, 82, 10], [66, 148, 7], [134, 148, 7]].map(([x, y, r]) => circle(x, y, r, p.paper, 'opacity=".85"')).join("") + ellipse(100, 112, 7, 38, p.d) + circle(100, 70, 9, p.d) + path("M98 64 Q86 40 70 34 M102 64 Q114 40 130 34", "none", p.d, 3) + circle(70, 34, 4, p.d) + circle(130, 34, 4, p.d);
const strawberry = (p) => path("M100 186 Q30 140 34 92 Q40 56 100 62 Q160 56 166 92 Q170 140 100 186Z", p.a) +
  [[70, 96], [100, 88], [130, 96], [58, 124], [86, 120], [114, 120], [142, 124], [76, 150], [100, 144], [124, 150], [100, 168]].map(([x, y]) => ellipse(x, y, 3, 4.5, p.c)).join("") +
  path("M100 66 Q70 30 40 52 Q62 60 80 66 Q56 66 54 84 Q84 76 100 70 Q116 76 146 84 Q144 66 120 66 Q138 60 160 52 Q130 30 100 66Z", GREEN) + stem("M100 66 Q104 40 114 28", 6) + circle(150, 36, 5, p.b) + circle(40, 40, 4, p.b);
const umbrella = (p) => path("M20 100 Q20 24 100 24 Q180 24 180 100 Q164 88 150 100 Q136 88 120 100 Q108 88 100 100 Q92 88 80 100 Q64 88 50 100 Q36 88 20 100Z", p.a) + path("M100 24 Q60 40 50 100 M100 24 Q140 40 150 100 M100 24 V100", "none", p.paper, 2.5, 'opacity=".7"') +
  path("M100 100 V150 Q100 168 84 166", "none", p.d, 6) + circle(100, 22, 5, p.d) + [[28, 126], [60, 150], [140, 142], [176, 124], [116, 176], [44, 176], [160, 178]].map(([x, y]) => path(`M${x} ${y} q-4 8 0 14 q4 -6 0 -14Z`, p.b)).join("");
const rapeseed = (p) => [30, 66, 104, 142, 176].map((x, i) => stem(`M${x} 196 Q${x + (i % 2 ? 6 : -6)} 130 ${x} ${70 + (i % 3) * 14}`, 5) + leaf(x, 180, 40, 12, DGREEN, i % 2 ? 50 : -50) +
  Array.from({ length: 9 }, (_, k) => flower(x + ((k * 7) % 14) - 7, 60 + (i % 3) * 14 + k * 4 - 6, 8, 4, p.a, p.c, k * 20)).join("")).join("");
const magnolia = (p) => stem("M6 190 Q70 150 120 100 T196 40", 7, BROWN) + leaf(60, 150, 40, 14, DGREEN, -60) + leaf(150, 70, 36, 12, DGREEN, 70) +
  [[70, 110, 1], [140, 62, 0.85]].map(([x, y, s]) => g(`${path("M-26 0 Q-28 -50 0 -62 Q28 -50 26 0 Q0 14 -26 0Z", p.paper, p.b, 3)}${path("M-14 0 Q-14 -40 0 -58 Q14 -40 14 0", p.a, "none", 0, 'opacity=".45"')}${path("M-26 0 Q-44 -30 -20 -50", p.b, p.b, 2)}${path("M26 0 Q44 -30 20 -50", p.b, p.b, 2)}`, x, y, s)).join("");
const azalea = (p) => stem("M8 180 Q60 150 100 110 T192 56", 6, BROWN) + [[40, 156, 0], [84, 126, 1], [130, 92, 0], [172, 62, 1], [60, 112, 1], [150, 124, 0]].map(([x, y, k], i) => g(`${flower(0, 0, 22, 5, k ? p.a : p.b, p.c, i * 12)}${[0, 1, 2, 3, 4].map((j) => circle(Math.cos(j * 1.25) * 6, Math.sin(j * 1.25) * 6, 1.6, p.d)).join("")}`, x, y, 1)).join("") + leaf(100, 126, 34, 12, DGREEN, 50) + leaf(60, 160, 30, 11, DGREEN, -60) + leaf(160, 90, 28, 10, DGREEN, 60);
const rainbow = (p) => ["#f88f8f", "#ffc36a", "#fbe76a", "#8fd08f", "#7fb7ee", "#a98fe0"].map((c, i) => path(`M${14 + i * 12} 150 A${86 - i * 12} ${86 - i * 12} 0 0 1 ${186 - i * 12} 150`, "none", c, 12)).join("") + cloud(-6, 118, 0.34, p.paper) + cloud(128, 120, 0.34, p.paper) + circle(160, 40, 0, p.c) + star(164, 36, 12, p.c, 0.9);
const lunch = (p) => path("M16 60 H184 V150 Q184 172 162 172 H38 Q16 172 16 150Z", p.a) + rect(16, 48, 168, 22, p.b, 6) + rect(28, 82, 68, 76, p.paper, 8) + rect(102, 82, 70, 34, p.paper, 8) + rect(102, 122, 70, 36, p.paper, 8) +
  [[48, 104], [78, 104], [48, 134], [78, 134]].map(([x, y]) => circle(x, y, 12, "#2f3b2f") + circle(x, y, 8, p.paper) + circle(x, y, 4, p.c)).join("") + ellipse(124, 98, 18, 11, "#ffe28a") + ellipse(124, 98, 8, 6, "#ffb938") + circle(140, 140, 12, "#f06a5c") + path("M134 130 l6 -6 l6 6", "none", DGREEN, 3) + leaf(160, 138, 22, 8, GREEN, 40) + flower(168, 36, 14, 5, p.c, p.paper);
const carnation = (p) => stem("M100 110 Q92 150 100 196", 6) + leaf(98, 170, 50, 14, DGREEN, -50) + leaf(100, 160, 44, 13, DGREEN, 52) +
  [0, 1, 2, 3, 4, 5, 6, 7].map((i) => circle(100 + Math.cos(i * 0.785) * 36, 78 + Math.sin(i * 0.785) * 30, 22, p.a)).join("") + [0, 1, 2, 3, 4, 5].map((i) => circle(100 + Math.cos(i * 1.05 + 0.3) * 22, 76 + Math.sin(i * 1.05 + 0.3) * 18, 18, p.b)).join("") + circle(100, 76, 16, p.paper, 'opacity=".85"') + path("M84 112 Q100 124 116 112 L112 124 Q100 134 88 124Z", GREEN) +
  path("M70 176 q30 -16 60 0 q-10 14 -30 8 q-20 6 -30 -8Z", p.c);
const bee = (p) => hexagon(52, 60, 30, p.c, p.paper, 4) + hexagon(104, 40, 26, p.b, p.paper, 4) + hexagon(150, 84, 30, p.c, p.paper, 4) + hexagon(56, 128, 26, p.b, p.paper, 4) +
  g(`${ellipse(-22, -22, 24, 14, p.paper, 'opacity=".85" transform="rotate(-30 -22 -22)"')}${ellipse(14, -26, 24, 14, p.paper, 'opacity=".85" transform="rotate(25 14 -26)"')}${ellipse(0, 0, 44, 30, "#ffcf3f")}${rect(-14, -30, 12, 60, "#3b3030", 0, 'transform="skewX(-8)"')}${rect(10, -28, 12, 56, "#3b3030", 0, 'transform="skewX(-8)"')}${circle(-42, -4, 16, "#3b3030")}${circle(-47, -8, 3.5, "#fff")}${path("M44 0 l16 4 l-16 4Z", "#3b3030")}${path("M-46 -18 q-8 -16 -20 -16 M-38 -20 q0 -18 -10 -26", "none", "#3b3030", 3)}`, 112, 140, 1, -6);
const kite = (p) => path("M100 10 L160 80 L100 150 L40 80Z", p.a) + path("M100 10 L100 150 M40 80 H160", "none", p.paper, 3) + path("M100 10 L160 80 L100 80Z", p.b) + path("M40 80 L100 80 L100 150Z", p.b) +
  path("M100 150 Q80 170 104 182 Q124 190 108 198", "none", p.d, 3) + [[88, 166], [112, 184]].map(([x, y]) => path(`M${x} ${y} l-12 -8 l0 16Z M${x} ${y} l12 -8 l0 16Z`, p.c)).join("") + cloud(-4, 100, 0.3, p.paper) + cloud(146, 30, 0.26, p.paper);
const chick = (p) => path("M30 120 Q30 52 100 52 Q170 52 170 120 Q170 186 100 186 Q30 186 30 120Z", p.paper, p.d, 3) + circle(100, 104, 46, "#ffd95a") + path("M30 124 l16 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 V190 H30Z", p.paper, p.d, 3) +
  circle(84, 96, 5, "#3b3030") + circle(118, 96, 5, "#3b3030") + path("M92 108 L110 108 L101 120Z", p.a) + ellipse(72, 112, 8, 5, p.b, 'opacity=".8"') + ellipse(130, 112, 8, 5, p.b, 'opacity=".8"') + path("M100 58 q-6 -18 6 -22 M94 60 q-12 -14 -2 -24", "none", "#ffd95a", 5);
const bicycle = (p) => g(`${circle(0, 0, 40, "none", `stroke="${p.d}" stroke-width="6"`)}${circle(0, 0, 4, p.d)}${path("M0 0 L-4 -36 M0 0 L36 4 M0 0 L-36 -6 M0 0 L8 36", "none", p.d, 1.6)}`, 52, 130) + g(`${circle(0, 0, 40, "none", `stroke="${p.d}" stroke-width="6"`)}${circle(0, 0, 4, p.d)}${path("M0 0 L-4 -36 M0 0 L36 4 M0 0 L-36 -6 M0 0 L8 36", "none", p.d, 1.6)}`, 148, 130) +
  path("M52 130 L84 84 H128 L148 130 M84 84 L100 130 H52 M128 84 L120 64 H138", "none", p.a, 6) + rect(70, 74, 30, 8, p.d, 4) + path("M140 70 q12 -4 18 6", "none", p.d, 5) +
  path("M126 96 H176 L170 124 H132Z", "#c79a62") + [[140, 92, p.b], [156, 86, p.c], [168, 94, p.a]].map(([x, y, c]) => flower(x, y, 12, 5, c, p.paper)).join("") + g(`<rect width="30" height="20" rx="3" fill="${p.paper}" stroke="${p.d}" stroke-width="2.5"/><path d="M2 3 L15 12 L28 3" fill="none" stroke="${p.d}" stroke-width="2.5"/>`, 126, 72, 1, -14);
const lilac = (p) => [[100, 30, 0], [70, 46, -18], [130, 46, 18], [52, 72, -30], [148, 72, 30]].map(([x, y, r], i) => g(Array.from({ length: 16 }, (_, k) => flower((k * 17) % 34 - 17, k * 8 - 4, 9, 4, k % 3 ? p.a : p.b, p.paper, k * 22)).join(""), x, y, 1, r)).join("") +
  stem("M100 100 Q96 150 100 196", 6) + path("M100 150 Q56 120 34 150 Q60 176 100 156Z", GREEN) + path("M100 160 Q144 130 168 160 Q142 184 100 166Z", DGREEN);

const S = "봄";
const D = (n, o) => ({ id: `spring-${String(n).padStart(2, "0")}`, season: S, ...o });
export const springDesigns = [
  D(1, { title: "벚꽃 편지", tag: "봄바람에 실려 온 꽃소식", hero: cherry, p: pal({ a: "#F5A3BC", b: "#FBD3DF", c: "#F7D56B", d: "#B04A6E", bg: "#FFF0F4" }), layout: "corner", v: 0, pat: "dots", postal: "stamp", price: "330", mark: "봄 소식" }),
  D(2, { title: "입춘 소식", tag: "겨울을 지나 새봄의 첫 편지", hero: sprout, p: pal({ a: "#7CC27A", b: "#B8E08F", c: "#F3C94E", d: "#3C7A47", bg: "#F1F9E6" }), layout: "banner", v: 1, pat: "solid", postal: "postmark", pp: { label: "立春 입춘" } }),
  D(3, { title: "튤립 정원", tag: "알록달록 튤립이 활짝 피었어요", hero: tulips, p: pal({ a: "#F28BA8", b: "#FFC1A1", c: "#F6D14F", d: "#A33F66", bg: "#FFF3E3" }), layout: "frame", v: 1, pat: "checks", postal: "envelope" }),
  D(4, { title: "개나리 안부", tag: "노란 개나리가 전하는 따뜻한 안부", hero: forsythia, p: pal({ a: "#F8D23C", b: "#FBE784", c: "#8BC56A", d: "#9A7410", bg: "#FFFBE0" }), layout: "sidebar", v: 0, pat: "stripes", postal: "airmail", pp: { w: 160 } }),
  D(5, { title: "민들레 홀씨", tag: "홀씨처럼 가볍게 날아가는 마음", hero: dandelion, p: pal({ a: "#9CD3E8", b: "#F4D443", c: "#F4B8C8", d: "#3C7C98", bg: "#EAF7FC" }), layout: "arch", v: 2, pat: "solid", postal: "plane" }),
  D(6, { title: "제비 편지", tag: "제비가 물고 온 봄 소식", hero: swallow, p: pal({ a: "#7FB8E6", b: "#BFE0F4", c: "#F28B6B", d: "#274A78", bg: "#EAF5FD" }), layout: "scene", v: 0, pat: "waves", postal: "mailbox", dateLine: true }),
  D(7, { title: "나비의 하루", tag: "나비처럼 살랑살랑 안부를 전해요", hero: butterfly, p: pal({ a: "#B79CE8", b: "#F4A9D6", c: "#8BD0C7", d: "#5C3F98", bg: "#F5EFFD" }), layout: "ribbon", v: 0, pat: "confetti", postal: "zip" }),
  D(8, { title: "딸기 한 바구니", tag: "달콤한 딸기 소식이 도착했어요", hero: strawberry, p: pal({ a: "#EE6E7C", b: "#F9B7BC", c: "#FFF1B0", d: "#A83348", bg: "#FFF0F0" }), layout: "card", v: 0, pat: "dots", postal: "parcelTag", pp: { label: "달콤" } }),
  D(9, { title: "봄비 우산", tag: "봄비 내리는 날 보내는 편지", hero: umbrella, p: pal({ a: "#79A9E8", b: "#A9D0F5", c: "#F5D27B", d: "#2F5B9A", bg: "#EAF2FC" }), layout: "wavetop", v: 0, pat: "linen", postal: "wax" }),
  D(10, { title: "유채꽃 바람", tag: "제주 들판에서 전하는 노란 인사", hero: rapeseed, p: pal({ a: "#F5CF3A", b: "#BFE38A", c: "#9ADBD0", d: "#6E7F14", bg: "#FFFBD9" }), layout: "banner", v: 3, pat: "grid", postal: "bike" }),
  D(11, { title: "목련 오후", tag: "하얀 목련이 피는 고요한 오후", hero: magnolia, p: pal({ a: "#E3A9CF", b: "#F3D5E8", c: "#B9A6E2", d: "#7D3F6E", bg: "#FBF1F7" }), layout: "sidebar", v: 1, pat: "gradient", postal: "ticket", pp: { label: "봄 편지" } }),
  D(12, { title: "진달래 꽃길", tag: "진달래 꽃길 따라 걸어요", hero: azalea, p: pal({ a: "#E88FBF", b: "#F6C2DC", c: "#FFD66B", d: "#9B3E78", bg: "#FFEFF7" }), layout: "corner", v: 1, pat: "diamonds", postal: "sealTape" }),
  D(13, { title: "무지개 소식", tag: "비 갠 뒤 무지개가 떴어요", hero: rainbow, p: pal({ a: "#8EC9F0", b: "#C8E6F8", c: "#FFE07A", d: "#3B6EA3", bg: "#EEF8FE" }), layout: "scene", v: 1, pat: "solid", postal: "scale" }),
  D(14, { title: "봄 소풍", tag: "도시락 싸 들고 소풍 가는 날", hero: lunch, p: pal({ a: "#8CC9A0", b: "#F5D78E", c: "#F28B77", d: "#3F7C56", bg: "#F1FAEF" }), layout: "card", v: 1, pat: "confetti", postal: "plane" }),
  D(15, { title: "카네이션 편지", tag: "어버이날, 고마운 마음을 담아", hero: carnation, p: pal({ a: "#EE7A8C", b: "#F8B6C0", c: "#C9E5A6", d: "#A8344C", bg: "#FFF1F1" }), layout: "frame", v: 0, pat: "solid", postal: "wax" }),
  D(16, { title: "꿀벌의 봄", tag: "붕붕, 꿀벌이 봄 소식을 날라요", hero: bee, p: pal({ a: "#F6C94D", b: "#FBE18E", c: "#F2A54A", d: "#8A5A10", bg: "#FFF8DD" }), layout: "ribbon", v: 1, pat: "diamonds", postal: "postmark", pp: { label: "SPRING" } }),
  D(17, { title: "연 날리는 날", tag: "바람 따라 높이 띄우는 마음", hero: kite, p: pal({ a: "#7ACBD6", b: "#F7B0A1", c: "#FCE287", d: "#2E7F8B", bg: "#E9F8FA" }), layout: "arch", v: 0, pat: "dots", postal: "envelope" }),
  D(18, { title: "삐약삐약 병아리", tag: "알을 깨고 나온 봄 소식", hero: chick, p: pal({ a: "#FFD95A", b: "#FFEBA3", c: "#F59E7A", d: "#A37B00", bg: "#FFFBE2" }), layout: "wavetop", v: 1, pat: "checks", postal: "mailbox" }),
  D(19, { title: "우체부 자전거", tag: "꽃바구니 싣고 달리는 봄 배달", hero: bicycle, p: pal({ a: "#6FB7A6", b: "#F7C8A0", c: "#F29BB6", d: "#2F6F63", bg: "#EAF7F3" }), layout: "postcard", v: 0, pat: "stripes", postal: "bike", price: "봄", mark: "SPRING" }),
  D(20, { title: "라일락 향기", tag: "라일락 향기 가득한 안부", hero: lilac, p: pal({ a: "#B58FE0", b: "#D9C3F2", c: "#9ED69A", d: "#6B3FA0", bg: "#F6F0FD" }), layout: "banner", v: 2, pat: "waves", postal: "stamp", price: "봄" }),
];
export const heroes = { cherry,sprout,tulips,forsythia,dandelion,swallow,butterfly,strawberry,umbrella,rapeseed,magnolia,azalea,rainbow,lunch,carnation,bee,kite,chick,bicycle,lilac };
