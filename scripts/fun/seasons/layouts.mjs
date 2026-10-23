// 편지지 배치 10종 — 그림(주인공 소재)·색·무늬·우체국 소품을 받아 한 장의 SVG 와 글쓰기 영역을 돌려줍니다.
// area: fields=[x,y,w] 받는 사람(+날짜) 줄, rules=[x,y,w,rows] 글쓰기 줄, from=[x,y,w,맞춤]|null 보내는 사람 줄
import { W, H, circle, ellipse, rect, path, g, text, rulesSvg, rng, star } from "./kit.mjs";
import { pattern } from "./patterns.mjs";
import { postal } from "./postal.mjs";

const hero = (fn, p, cx, cy, s, rot = 0) => g(fn(p), cx - 100 * s, cy - 100 * s, s, rot);
const credit = (p, y = 1108) => text(W / 2, y, "계절 편지지 · 반딧불이의 곳간", { size: 12, fill: p.d, weight: 500, anchor: "middle", opacity: 0.55 });
const titleBlock = (x, y, d, p, { size = 44, anchor = "start", gap = 36 } = {}) =>
  text(x, y, d.title, { size, weight: 900, fill: p.d, anchor, spacing: 1 }) + text(x, y + gap, d.tag, { size: 17, weight: 600, fill: p.ink, anchor, opacity: 0.85 });
const wrap = (d, p, defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${body}</svg>`;

/** 띠 아래쪽 모양 4가지(v 에 따라) */
const bandBottom = (v, y, fill) => [
  rect(0, y - 2, W, 6, fill),
  path(`M0 ${y} Q${W * 0.25} ${y + 46} ${W * 0.5} ${y} T${W} ${y} V${y - 4} H0Z`, fill),
  Array.from({ length: 12 }, (_, i) => circle(34 + i * 66, y, 33, fill)).join(""),
  path(`M0 ${y} H${W} L${W} ${y + 34} L0 ${y}Z`, fill),
][v % 4];

const L = {
  banner(d, h, p) {
    const pat = pattern(d.pat, p, "pt");
    const body = `${rect(0, 0, W, H, p.paper)}${rect(0, 0, W, 250, pat.fill)}${bandBottom(d.v, 250, pat.fill === p.bg ? p.bg : p.bg)}
      ${d.pat === "solid" ? "" : rect(0, 0, W, 250, pat.fill)}${bandBottom(d.v, 250, p.bg)}
      ${circle(397, 128, 112, p.paper, 'opacity=".55"')}${hero(h, p, 397, 128, 1.05)}
      ${postal(d.postal, 640, 60, 0.7, p, d.pp)}${titleBlock(W / 2, 330, d, p, { anchor: "middle", size: 42 })}
      ${rulesSvg(80, 440, 634, 14, p.line)}${credit(p)}`;
    return { defs: pat.defs, body, area: { fields: [80, 392, 634], rules: [80, 440, 634, 14], from: [80, 1060, 634, "right"] } };
  },
  sidebar(d, h, p) {
    const pat = pattern(d.pat, p, "pt");
    const body = `${rect(0, 0, W, H, p.paper)}${rect(0, 0, 210, H, pat.fill)}${d.pat === "solid" ? "" : rect(0, 0, 210, H, p.bg, 0, 'opacity=".25"')}
      ${rect(206, 0, 4, H, p.a)}${circle(105, 190, 84, p.paper, 'opacity=".7"')}${hero(h, p, 105, 190, 1.0)}
      ${postal(d.postal, 40, 380 + (d.v % 3) * 30, 0.85, p, d.pp)}${text(105, 1000, d.season, { size: 20, fill: p.d, weight: 900, anchor: "middle", spacing: 6, opacity: 0.8 })}
      ${titleBlock(252, 120, d, p, { size: 40 })}${rulesSvg(252, 240, 470, 18, p.line)}${credit(p)}`;
    return { defs: pat.defs, body, area: { fields: [252, 190, 470], rules: [252, 240, 470, 18], from: [252, 1036, 470, "right"] } };
  },
  corner(d, h, p) {
    const pat = pattern(d.pat, p, "pt");
    const body = `${rect(0, 0, W, H, p.paper)}${path(`M${W} 0 V400 Q520 360 470 0Z`, pat.fill)}${path(`M${W} 0 V400 Q520 360 470 0Z`, p.bg, "none", 0, 'opacity=".35"')}
      ${hero(h, p, 600, 190, 1.45)}${titleBlock(70, 140, d, p, { size: 46, gap: 40 })}${postal(d.postal, 70, 230, 0.8, p, d.pp)}
      ${rulesSvg(70, 420, 654, 14, p.line)}${credit(p)}`;
    return { defs: pat.defs, body, area: { fields: [70, 372, 654], rules: [70, 420, 654, 14], from: [70, 1050, 654, "right"] } };
  },
  scene(d, h, p) {
    const pat = pattern(d.pat, p, "pt");
    const body = `${rect(0, 0, W, H, p.paper)}${rect(0, 0, W, 190, pat.fill)}${d.pat === "solid" ? "" : rect(0, 0, W, 190, p.bg, 0, 'opacity=".3"')}
      ${path(`M0 960 Q200 900 400 950 T${W} 930 V${H} H0Z`, p.b)}${path(`M0 1030 Q260 980 520 1030 T${W} 1010 V${H} H0Z`, p.a)}
      ${hero(h, p, 620, 880, 1.15)}${titleBlock(W / 2, 100, d, p, { anchor: "middle", size: 40 })}${postal(d.postal, 90, 960, 0.6, p, d.pp)}
      ${rulesSvg(80, 250, 634, 14, p.line)}${credit(p, 1112)}`;
    return { defs: pat.defs, body, area: { fields: [80, 200, 634], rules: [80, 250, 634, 14], from: [80, 874, 360, "left"] } };
  },
  frame(d, h, p) {
    const pat = pattern(d.pat, p, "pt");
    const body = `${rect(0, 0, W, H, pat.fill)}${d.pat === "solid" ? "" : ""}${rect(34, 34, W - 68, H - 68, p.paper, 22)}${rect(46, 46, W - 92, H - 92, "none", 16, `stroke="${p.a}" stroke-width="3" stroke-dasharray="${d.v % 2 ? "1 9" : "none"}" stroke-linecap="round"`)}
      ${[[56, 56], [W - 56, 56], [56, H - 56], [W - 56, H - 56]].map(([x, y], i) => star(x, y, 9, p.c, 0.9)).join("")}
      ${circle(397, 160, 96, p.bg)}${circle(397, 160, 96, "none", `stroke="${p.a}" stroke-width="3"`)}${hero(h, p, 397, 160, 0.95)}
      ${titleBlock(W / 2, 306, d, p, { anchor: "middle", size: 40 })}${postal(d.postal, 590, 70, 0.55, p, d.pp)}
      ${rulesSvg(90, 400, 614, 14, p.line)}${credit(p, 1070)}`;
    return { defs: pat.defs, body, area: { fields: [90, 350, 614], rules: [90, 400, 614, 14], from: [90, 1018, 614, "right"] } };
  },
  arch(d, h, p) {
    const pat = pattern(d.pat, p, "pt");
    const body = `${rect(0, 0, W, H, p.paper)}${path(`M227 340 V190 a170 170 0 0 1 340 0 V340Z`, pat.fill)}${path(`M227 340 V190 a170 170 0 0 1 340 0 V340Z`, p.bg, "none", 0, 'opacity=".4"')}
      ${path(`M227 340 V190 a170 170 0 0 1 340 0 V340Z`, "none", p.a, 4)}${hero(h, p, 397, 200, 1.2)}
      ${postal(d.postal, 90, 90, 0.7, p, d.pp)}${text(W - 90, 130, d.season, { size: 22, fill: p.d, weight: 900, anchor: "end", spacing: 6, opacity: 0.75 })}
      ${titleBlock(W / 2, 400, d, p, { anchor: "middle", size: 40 })}${rulesSvg(80, 480, 634, 14, p.line)}${credit(p)}`;
    return { defs: pat.defs, body, area: { fields: [80, 432, 634], rules: [80, 480, 634, 13], from: [80, 1052, 634, "right"] } };
  },
  ribbon(d, h, p) {
    const pat = pattern(d.pat, p, "pt");
    const body = `${rect(0, 0, W, H, p.paper)}${path(`M${W - 300} 0 H${W} V300Z`, pat.fill)}${path(`M${W - 300} 0 H${W} V300Z`, p.a, "none", 0, 'opacity=".4"')}
      ${hero(h, p, W - 130, 130, 1.0, 12)}${titleBlock(70, 130, d, p, { size: 46, gap: 40 })}${postal(d.postal, 70, 970, 0.6, p, d.pp)}
      ${rect(0, H - 40, W, 40, pat.fill)}${rect(0, H - 40, W, 6, p.a)}${rulesSvg(70, 290, 654, 15, p.line)}${credit(p, 1108)}`;
    return { defs: pat.defs, body, area: { fields: [70, 242, 654], rules: [70, 290, 654, 15], from: [70, 962, 654, "right"] } };
  },
  card(d, h, p) {
    const pat = pattern(d.pat, p, "pt");
    const body = `${rect(0, 0, W, H, pat.fill)}${d.pat === "solid" ? "" : ""}${rect(56, 246, W - 112, 850, p.paper, 24, 'opacity="1"')}
      ${titleBlock(70, 120, d, p, { size: 44 })}${hero(h, p, 620, 150, 1.05)}${postal(d.postal, 92, 1040, 0.5, p, d.pp)}
      ${rulesSvg(92, 340, 610, 15, p.line)}${credit(p, 1112)}`;
    return { defs: pat.defs, body, area: { fields: [92, 292, 610], rules: [92, 340, 610, 15], from: [92, 1010, 610, "right"] } };
  },
  wavetop(d, h, p) {
    const pat = pattern(d.pat, p, "pt");
    const body = `${rect(0, 0, W, H, p.paper)}${path(`M0 0 H${W} V200 Q${W * 0.75} 250 ${W * 0.5} 200 T0 210Z`, pat.fill)}${path(`M0 0 H${W} V200 Q${W * 0.75} 250 ${W * 0.5} 200 T0 210Z`, p.bg, "none", 0, 'opacity=".4"')}
      ${hero(h, p, 150, 120, 0.9)}${titleBlock(290, 110, d, p, { size: 42 })}${postal(d.postal, 580, 40, 0.55, p, d.pp)}
      ${path(`M0 ${H - 36} Q${W * 0.25} ${H - 66} ${W * 0.5} ${H - 36} T${W} ${H - 36} V${H} H0Z`, pat.fill)}
      ${rulesSvg(80, 320, 634, 16, p.line)}${credit(p, 1104)}`;
    return { defs: pat.defs, body, area: { fields: [80, 272, 634], rules: [80, 320, 634, 16], from: [80, 1034, 634, "right"] } };
  },
  postcard(d, h, p) {
    const pat = pattern(d.pat, p, "pt");
    const body = `${rect(0, 0, W, H, p.paper)}${rect(570, 0, W - 570, H, pat.fill)}${d.pat === "solid" ? "" : rect(570, 0, W - 570, H, p.bg, 0, 'opacity=".3"')}
      ${path(`M550 40 V${H - 40}`, "none", p.a, 3, 'stroke-dasharray="2 10"')}${postal("stamp", 610, 60, 0.8, p, { value: d.price })}${postal("postmark", 590, 60, 0.9, p, { label: d.mark })}
      ${hero(h, p, 672, 440, 0.95)}${postal(d.postal, 604, 600, 0.7, p, d.pp)}
      ${Array.from({ length: 4 }, (_, i) => rect(600, 820 + i * 46, 150, 2, p.a, 0, 'opacity=".6"')).join("")}${postal("zip", 592, 770, 0.6, p)}
      ${titleBlock(60, 108, d, p, { size: 38, gap: 32 })}${rulesSvg(60, 200, 460, 19, p.line)}${credit(p, 1108)}`;
    return { defs: pat.defs, body, area: { fields: [60, 152, 460], rules: [60, 200, 460, 19], from: null } };
  },
};
export const layoutNames = Object.keys(L);

/** 한 장 그리기: 주인공 그림 함수와 설명(d)을 받아 { svg, area } 를 돌려줍니다. bare=true 면 받는 사람/날짜/보내는 사람 글자는 뺍니다. */
export function drawSheet(d, heroFn, { bare = false } = {}) {
  const p = d.p;
  const r = L[d.layout](d, heroFn, p);
  const a = r.area;
  const lab = bare ? "" : [
    text(a.fields[0], a.fields[1] + 28, "받는 사람 :", { size: 17, fill: p.ink, weight: 700 }),
    d.dateLine === false ? "" : text(a.fields[0] + a.fields[2], a.fields[1] + 28, "날짜 :  20     년     월     일", { size: 17, fill: p.ink, weight: 700, anchor: "end" }),
    a.from ? text(a.from[3] === "right" ? a.from[0] + a.from[2] : a.from[0], a.from[1] + 28, "보내는 사람 :", { size: 17, fill: p.ink, weight: 700, anchor: a.from[3] === "right" ? "end" : "start" }) : "",
  ].join("");
  return { svg: wrap(d, p, r.defs, r.body + lab), area: { ...a, date: d.dateLine !== false } };
}
