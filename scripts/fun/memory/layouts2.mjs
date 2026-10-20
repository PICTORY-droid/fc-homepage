// 주제 편지지용 현대식 배치 8종 — 넉넉한 여백, 큰 그림, 작은 영문 라벨 + 굵은 제목 + 얇은 강조선.
// 각 배치는 layouts.mjs 와 같은 { defs, body, area } 를 돌려줍니다. 제목은 titleSvg 로만 그려서(Word 에서 편집 가능) 위치가 area.title 로 기록됩니다.
import { W, H, GAP, circle, rect, path, g, mix, rng, txt, titleSvg, credit, rules, hero } from "./base.mjs";
import { star } from "../seasons/kit.mjs";

const flow = (bottom, minRy = 0) => { const fy = bottom + 26; const ry = Math.max(fy + 48, minRy); return { fy, ry, rows: Math.floor((1046 - ry) / GAP) }; };
const area = (x, f, w) => ({ fields: [x, f.fy, w], rules: [x, f.ry, w, f.rows], from: [x, 1052, w, "left"] });
const soft = (x, y, w, h, rx) => rect(x + 4, y + 10, w, h, "#2b3a67", rx, 'opacity=".07"');
const accent = (p, x, y, anchor = "start") => rect(anchor === "middle" ? x - 28 : x, y, 56, 4, p.a, 2);
const gid = (d) => `pg-${d.id}`;
const pdefs = (d, p) => `<linearGradient id="${gid(d)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(p.a, "#ffffff", 0.72)}"/><stop offset=".6" stop-color="${mix(p.b, "#ffffff", 0.55)}"/><stop offset="1" stop-color="#ffffff"/></linearGradient>`;
const paper = (d) => rect(0, 0, W, H, `url(#${gid(d)})`);
// 꿈결 그라데이션(더 또렷) — 위는 주색, 중간은 두 색의 섞임, 아래는 아주 연함
const ddefs = (d, p) => `<linearGradient id="${gid(d)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(p.a, "#ffffff", 0.38)}"/><stop offset=".5" stop-color="${mix(mix(p.a, p.c, 0.5), "#ffffff", 0.66)}"/><stop offset="1" stop-color="${mix(p.c, "#ffffff", 0.9)}"/></linearGradient><radialGradient id="gl-${d.id}"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>`;
const sparkle = (d, n, y1, y2, x1 = 0, x2 = W) => { const r = rng(d.n ?? 5); return Array.from({ length: n }, (_, i) => { const x = x1 + r() * (x2 - x1), y = y1 + r() * (y2 - y1), k = r(); return k > 0.7 ? star(x, y, 6 + r() * 6, "#ffffff", 0.95) : circle(x, y, 1.2 + r() * 2.2, "#ffffff", `opacity="${(0.5 + r() * 0.5).toFixed(2)}"`); }).join(""); };
const clip = (id, shape) => `<clipPath id="${id}">${shape}</clipPath>`;
const L2 = {};

// 1. 아치 창
L2.arch = (d, h, p) => {
  const id = `ar-${d.id}`, x = 197, y = 70, w = 400, hh = 430;
  const shape = `M${x} ${y + hh} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + hh}Z`;
  const t = titleSvg(d, W / 2, y + hh + 78, p, { size: 44, anchor: "middle", max: 9 });
  const f = flow(t.bottom + 14);
  const body = `${paper(d)}${path(shape, p.b, "none", 0, 'transform="translate(10 12)" opacity=".6"')}<g clip-path="url(#${id})">${rect(x, y, w, hh, p.b)}${hero(h, p, x + w / 2, y + hh / 2 + 10, 2.15)}</g>${path(shape, "none", "#ffffff", 8)}${path(shape, "none", p.a, 2)}
    ${t.svg}${accent(p, W / 2, t.bottom + 12, "middle")}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: pdefs(d, p) + clip(id, `<path d="${shape}"/>`), body, area: area(80, f, 634) };
};

// 2. 원형
L2.circle = (d, h, p) => {
  const id = `ci-${d.id}`, cx = W / 2, cy = 270, r = 190;
  const t = titleSvg(d, W / 2, cy + r + 100, p, { size: 44, anchor: "middle", max: 9 });
  const f = flow(t.bottom + 14);
  const body = `${paper(d)}${circle(cx + 10, cy + 12, r + 24, p.b, 'opacity=".85"')}<g clip-path="url(#${id})">${rect(cx - r, cy - r, 2 * r, 2 * r, p.b)}${hero(h, p, cx, cy, 1.95)}</g>${circle(cx, cy, r, "none", `stroke="#ffffff" stroke-width="10"`)}${circle(cx, cy, r + 5, "none", `stroke="${p.a}" stroke-width="2"`)}
    ${t.svg}${accent(p, W / 2, t.bottom + 12, "middle")}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: pdefs(d, p) + clip(id, `<circle cx="${cx}" cy="${cy}" r="${r}"/>`), body, area: area(80, f, 634) };
};

// 3. 와이드 카드
L2.card = (d, h, p) => {
  const id = `ca-${d.id}`, x = 70, y = 64, w = 654, hh = 380;
  const t = titleSvg(d, x + 4, y + hh + 84, p, { size: 44, max: 10, w: 600 });
  const f = flow(t.bottom + 14);
  const body = `${paper(d)}${soft(x, y, w, hh, 30)}<g clip-path="url(#${id})">${rect(x, y, w, hh, p.b)}${hero(h, p, x + w / 2, y + hh / 2, 1.9)}</g>${rect(x, y, w, hh, "none", 30, 'stroke="#ffffff" stroke-width="6"')}
    ${t.svg}${accent(p, x + 4, t.bottom + 12)}${rules(x, f.ry, w, f.rows, p.line)}${credit(p)}`;
  return { defs: pdefs(d, p) + clip(id, `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="30"/>`), body, area: area(x, f, w) };
};

// 4. 액자 테두리 — 이중 테두리 안에 큰 원형 그림
L2.frame = (d, h, p) => {
  const id = `fr-${d.id}`, cx = W / 2, cy = 300, r = 175;
  const t = titleSvg(d, W / 2, cy + r + 100, p, { size: 44, anchor: "middle", max: 9 });
  const f = flow(t.bottom + 14);
  const body = `${paper(d)}${rect(28, 28, W - 56, H - 56, "none", 22, `stroke="${p.a}" stroke-width="3"`)}${rect(44, 44, W - 88, H - 88, "none", 14, `stroke="${p.a}" stroke-width="1.2" opacity=".5"`)}
    <g clip-path="url(#${id})">${rect(cx - r, cy - r, 2 * r, 2 * r, p.b)}${hero(h, p, cx, cy, 1.75)}</g>${circle(cx, cy, r, "none", `stroke="${p.a}" stroke-width="3"`)}${circle(cx, cy, r + 12, "none", `stroke="${p.a}" stroke-width="1.2" opacity=".5"`)}
    ${t.svg}${accent(p, W / 2, t.bottom + 12, "middle")}${rules(96, f.ry, 602, f.rows, p.line)}${credit(p)}`;
  return { defs: pdefs(d, p) + clip(id, `<circle cx="${cx}" cy="${cy}" r="${r}"/>`), body, area: area(96, f, 602) };
};

// 5. 색 띠 — 위쪽 색 띠 위에 큰 원형 그림이 걸침
L2.band = (d, h, p) => {
  const id = `bd-${d.id}`, cx = W / 2, cy = 250, r = 165;
  const t = titleSvg(d, W / 2, cy + r + 90, p, { size: 44, anchor: "middle", max: 9 });
  const f = flow(t.bottom + 14);
  const body = `${paper(d)}${rect(0, 0, W, 290, p.b)}${[0, 1, 2, 3, 4].map((i) => circle(70 + i * 160, 40 + (i % 2) * 44, 28 + (i % 3) * 8, p.a, 'opacity=".14"')).join("")}
    ${circle(cx, cy, r + 10, "#ffffff")}<g clip-path="url(#${id})">${rect(cx - r, cy - r, 2 * r, 2 * r, p.b)}${hero(h, p, cx, cy, 1.7)}</g>
    ${t.svg}${accent(p, W / 2, t.bottom + 12, "middle")}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: pdefs(d, p) + clip(id, `<circle cx="${cx}" cy="${cy}" r="${r}"/>`), body, area: area(80, f, 634) };
};

// 6. 구름 덩어리
L2.blob = (d, h, p) => {
  const t = titleSvg(d, W / 2, 600, p, { size: 44, anchor: "middle", max: 9 });
  const f = flow(t.bottom + 14);
  const body = `${paper(d)}${path("M120 220 C90 120 220 60 330 90 C420 20 560 60 600 140 C720 160 740 300 650 360 C690 440 580 500 480 470 C400 520 280 500 230 450 C120 470 60 330 120 220Z", p.b)}
    ${circle(120, 90, 16, p.c, 'opacity=".55"')}${circle(690, 80, 10, p.a, 'opacity=".5"')}${circle(60, 440, 8, p.a, 'opacity=".5"')}${hero(h, p, 397, 285, 1.75)}
    ${t.svg}${accent(p, W / 2, t.bottom + 12, "middle")}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: pdefs(d, p), body, area: area(80, f, 634) };
};

// 7. 사선 — 비스듬한 색면 위, 오른쪽에 큰 원형 그림, 제목은 왼쪽 아래
L2.slant = (d, h, p) => {
  const id = `sl-${d.id}`, cx = 540, cy = 215, r = 175;
  const t = titleSvg(d, 80, 500, p, { size: 46, max: 7, w: 620 });
  const f = flow(t.bottom + 14);
  const body = `${paper(d)}${path(`M0 0 H${W} V330 L0 420Z`, p.b)}${path(`M0 420 L${W} 330 V342 L0 432Z`, p.a, "none", 0, 'opacity=".55"')}${circle(cx, cy, r + 10, "#ffffff")}
    <g clip-path="url(#${id})">${rect(cx - r, cy - r, 2 * r, 2 * r, p.b)}${hero(h, p, cx, cy, 1.75)}</g>${circle(120, 120, 6, p.a, 'opacity=".6"')}${circle(190, 190, 3, p.c, 'opacity=".8"')}${circle(140, 270, 4, p.a, 'opacity=".4"')}
    ${t.svg}${accent(p, 80, t.bottom + 12)}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: pdefs(d, p) + clip(id, `<circle cx="${cx}" cy="${cy}" r="${r}"/>`), body, area: area(80, f, 634) };
};

// 8. 모서리 큰 그림 — 오른쪽 위에서 흘러나오는 큰 원
L2.corner = (d, h, p) => {
  const id = `co-${d.id}`, cx = 535, cy = 205, r = 245;
  const t = titleSvg(d, 80, 520, p, { size: 46, max: 8, w: 600 });
  const f = flow(t.bottom + 14);
  const body = `${paper(d)}${circle(cx + 14, cy + 16, r, p.a, 'opacity=".14"')}<g clip-path="url(#${id})">${rect(cx - r, cy - r, 2 * r, 2 * r, p.b)}${hero(h, p, cx - 6, cy + 14, 1.9)}</g>${circle(cx, cy, r, "none", `stroke="#ffffff" stroke-width="8"`)}
    ${circle(70, 120, 9, p.c, 'opacity=".6"')}${circle(130, 210, 5, p.a, 'opacity=".5"')}${t.svg}${accent(p, 80, t.bottom + 12)}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: pdefs(d, p) + clip(id, `<circle cx="${cx}" cy="${cy}" r="${r}"/>`), body, area: area(80, f, 634) };
};


// 10. 꿈결 하늘 — 그라데이션 하늘 위에 별빛, 가운데 떠 있는 그림
L2.dream = (d, h, p) => {
  const t = titleSvg(d, W / 2, 590, p, { size: 42, anchor: "middle", max: 9 });
  const f = flow(t.bottom + 16);
  const body = `${paper(d)}${circle(W / 2, 320, 250, `url(#gl-${d.id})`)}${sparkle(d, 34, 30, 620)}${path("M180 470 Q397 520 614 470", "none", "#ffffff", 3, 'opacity=".45"')}
    ${hero(h, p, W / 2, 318, 1.5)}${t.svg}${accent(p, W / 2, t.bottom + 12, "middle")}${rules(80, f.ry, 634, f.rows, mix(p.a, "#ffffff", 0.5))}${credit(p)}`;
  return { defs: ddefs(d, p), body, area: area(80, f, 634) };
};

// 11. 안개 달 — 왼쪽 위의 커다란 반투명 달, 오른쪽 아래로 흐르는 궤도와 그림
L2.mist = (d, h, p) => {
  const t = titleSvg(d, 80, 540, p, { size: 44, max: 7, w: 620 });
  const f = flow(t.bottom + 16);
  const body = `${paper(d)}${circle(120, 120, 250, `url(#gl-${d.id})`)}${circle(120, 120, 205, "#ffffff", 'opacity=".28"')}${circle(120, 120, 205, "none", 'stroke="#ffffff" stroke-width="2" opacity=".7"')}${sparkle(d, 30, 20, 520)}
    ${circle(560, 285, 170, "none", 'stroke="#ffffff" stroke-width="2" opacity=".75"')}${circle(560, 285, 215, "none", 'stroke="#ffffff" stroke-width="1.4" opacity=".5"')}${hero(h, p, 560, 285, 1.45)}
    ${t.svg}${accent(p, 80, t.bottom + 12)}${rules(80, f.ry, 634, f.rows, mix(p.a, "#ffffff", 0.5))}${credit(p)}`;
  return { defs: ddefs(d, p), body, area: area(80, f, 634) };
};

// 12. 색 매트 — 색 테두리 안에 크림색 종이, 위에 작은 그림 하나
L2.mat = (d, h, p) => {
  const mat = mix(p.a, "#8a8ca0", 0.18), x = 62, y = 62, w = W - 124, hh = H - 124;
  const t = titleSvg(d, W / 2, 288, p, { size: 32, anchor: "middle", max: 12, w: 480 });
  const f = flow(t.bottom + 10);
  const body = `${rect(0, 0, W, H, mat)}${rect(x, y, w, hh, "#fffdf7", 6)}${rect(x + 8, y + 8, w - 16, hh - 16, "none", 3, `stroke="${mix(mat, "#ffffff", 0.55)}" stroke-width="1.4"`)}
    ${hero(h, p, W / 2, 160, 0.5)}${t.svg}${rules(120, f.ry, 554, f.rows, mix(mat, "#fffdf7", 0.6))}${credit(p, 1090)}`;
  return { defs: "", body, area: { fields: [120, f.fy, 554], rules: [120, f.ry, 554, f.rows], from: [120, 1040, 554, "left"] } };
};

// 일러스트 엽서(표지) — 편지지 한 세트에 들어 있는 그림 한 장짜리 페이지
export const coverSvg = (d, h, p) => {
  const eyebrow = d.eyebrow ? txt(W / 2, 880, d.eyebrow, { size: 15, weight: 700, fill: p.a, anchor: "middle", spacing: 8, serif: false }) : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${ddefs(d, p)}</defs>${paper(d)}${circle(W / 2, 470, 380, `url(#gl-${d.id})`)}${sparkle(d, 46, 30, 820)}
    ${hero(h, p, W / 2, 470, 3.1)}${eyebrow}${txt(W / 2, 944, d.title, { size: 52, weight: 700, fill: p.d, anchor: "middle", spacing: 1 })}${rect(W / 2 - 30, 974, 60, 4, p.a, 2)}${txt(W / 2, 1022, d.tag, { size: 21, fill: p.ink, anchor: "middle", opacity: 0.72, serif: false })}</svg>`;
};
export { L2 };
