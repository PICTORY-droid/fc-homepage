// 계절과 상관없는 주제 편지지용 현대식 배치 8종 — 깨끗한 여백, 큰 그림, 인스타그램 감성.
// 각 배치는 layouts.mjs 와 같은 { defs, body, area } 를 돌려줍니다.
import { W, H, GAP, circle, rect, path, g, mix, txt, titleSvg, credit, rules, hero } from "./base.mjs";

const flow = (bottom, minRy = 0) => { const fy = bottom + 26; const ry = Math.max(fy + 48, minRy); return { fy, ry, rows: Math.floor((1046 - ry) / GAP) }; };
const area = (x, f, w) => ({ fields: [x, f.fy, w], rules: [x, f.ry, w, f.rows], from: [x, 1052, w, "left"] });
const soft = (x, y, w, h, rx) => rect(x + 4, y + 8, w, h, "#2b3a67", rx, 'opacity=".07"');
const dotsRow = (p, y) => [0, 1, 2].map((i) => circle(W / 2 - 18 + i * 18, y, 3, p.a, 'opacity=".7"')).join("");
const clip = (id, shape) => `<clipPath id="${id}">${shape}</clipPath>`;
const L2 = {};

// 아치 창 — 둥근 윗부분 안에 그림
L2.arch = (d, h, p) => {
  const id = `ar-${d.id}`, x = 197, y = 70, w = 400, hh = 420;
  const shape = `M${x} ${y + hh} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + hh}Z`;
  const t = titleSvg(d, W / 2, y + hh + 70, p, { size: 44, anchor: "middle", max: 9 });
  const f = flow(t.bottom);
  const body = `${rect(0, 0, W, H, p.paper)}${path(shape.replace(/^M(\d+)/, (m, a) => `M${+a + 8}`), p.b, "none", 0, 'transform="translate(6 10)" opacity=".7"')}
    <g clip-path="url(#${id})">${rect(x, y, w, hh, p.b)}${hero(h, p, x + w / 2, y + hh / 2 + 10, 2.1)}</g>${path(shape, "none", p.a, 5)}
    ${t.svg}${dotsRow(p, t.bottom + 6)}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: clip(id, `<path d="${shape}"/>`), body, area: area(80, f, 634) };
};

// 원형 — 큰 동그라미 안에 그림
L2.circle = (d, h, p) => {
  const id = `ci-${d.id}`, cx = W / 2, cy = 270, r = 190;
  const t = titleSvg(d, W / 2, cy + r + 76, p, { size: 44, anchor: "middle", max: 9 });
  const f = flow(t.bottom);
  const body = `${rect(0, 0, W, H, p.paper)}${circle(cx + 8, cy + 10, r + 22, p.b, 'opacity=".8"')}<g clip-path="url(#${id})">${rect(cx - r, cy - r, 2 * r, 2 * r, p.b)}${hero(h, p, cx, cy, 1.9)}</g>${circle(cx, cy, r, "none", `stroke="#ffffff" stroke-width="10"`)}${circle(cx, cy, r + 5, "none", `stroke="${p.a}" stroke-width="2"`)}
    ${t.svg}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: clip(id, `<circle cx="${cx}" cy="${cy}" r="${r}"/>`), body, area: area(80, f, 634) };
};

// 카드 — 위쪽에 둥근 사진 카드, 아래 제목
L2.card = (d, h, p) => {
  const id = `ca-${d.id}`, x = 70, y = 60, w = 654, hh = 360;
  const t = titleSvg(d, x + 6, y + hh + 68, p, { size: 42, max: 10 });
  const f = flow(t.bottom);
  const body = `${rect(0, 0, W, H, p.paper)}${soft(x, y, w, hh, 28)}<g clip-path="url(#${id})">${rect(x, y, w, hh, p.b)}${hero(h, p, x + w / 2, y + hh / 2, 1.8)}</g>${rect(x, y, w, hh, "none", 28, 'stroke="#ffffff" stroke-width="6"')}
    ${rect(x + 6, y + hh + 78 - 52, 6, 56, p.a, 3)}${rules(x, f.ry, w, f.rows, p.line)}${credit(p)}`.replace(rect(x + 6, y + hh + 78 - 52, 6, 56, p.a, 3), "") + t.svg;
  return { defs: clip(id, `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="28"/>`), body, area: area(x, f, w) };
};

// 액자 — 이중 테두리 안쪽에 작은 그림과 제목
L2.frame = (d, h, p) => {
  const t = titleSvg(d, 96, 170, p, { size: 44, max: 6 });
  const f = flow(Math.max(t.bottom, 250));
  const body = `${rect(0, 0, W, H, p.paper)}${rect(28, 28, W - 56, H - 56, "none", 22, `stroke="${p.a}" stroke-width="3"`)}${rect(44, 44, W - 88, H - 88, "none", 14, `stroke="${p.a}" stroke-width="1.2" opacity=".5"`)}
    ${circle(618, 150, 82, p.b)}${hero(h, p, 618, 150, 0.9)}${t.svg}${rect(96, t.bottom + 18, 54, 4, p.a, 2)}${rules(96, f.ry, 602, f.rows, p.line)}${credit(p)}`;
  return { defs: "", body, area: area(96, f, 602) };
};

// 띠 — 위에 색 띠, 그림이 띠 위에 걸쳐 앉음
L2.band = (d, h, p) => {
  const t = titleSvg(d, 80, 330, p, { size: 44, max: 7 });
  const f = flow(t.bottom);
  const body = `${rect(0, 0, W, H, p.paper)}${rect(0, 0, W, 230, p.b)}${path(`M0 230 Q${W / 2} 270 ${W} 230 V222 H0Z`, p.b)}${[0, 1, 2, 3, 4].map((i) => circle(70 + i * 160, 40 + (i % 2) * 44, 28 + (i % 3) * 8, p.a, 'opacity=".15"')).join("")}
    ${circle(580, 230, 108, "#ffffff")}${circle(580, 230, 100, p.b)}${hero(h, p, 580, 230, 1.05)}${t.svg}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: "", body, area: area(80, f, 634) };
};

// 구름 모양 바탕 — 부드러운 덩어리 위에 그림
L2.blob = (d, h, p) => {
  const t = titleSvg(d, W / 2, 560, p, { size: 44, anchor: "middle", max: 9 });
  const f = flow(t.bottom);
  const body = `${rect(0, 0, W, H, p.paper)}${path("M120 220 C90 120 220 60 330 90 C420 20 560 60 600 140 C720 160 740 300 650 360 C690 440 580 500 480 470 C400 520 280 500 230 450 C120 470 60 330 120 220Z", p.b)}
    ${circle(120, 90, 16, p.c, 'opacity=".55"')}${circle(690, 80, 10, p.a, 'opacity=".5"')}${circle(60, 440, 8, p.a, 'opacity=".5"')}${hero(h, p, 397, 280, 1.7)}
    ${t.svg}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: "", body, area: area(80, f, 634) };
};

// 세로 띠 — 왼쪽에 색 띠와 그림, 오른쪽에 글
L2.side = (d, h, p) => {
  const t = titleSvg(d, 270, 140, p, { size: 40, max: 8 });
  const f = flow(Math.max(t.bottom, 220));
  const body = `${rect(0, 0, W, H, p.paper)}${rect(0, 0, 190, H, p.b)}${rect(190, 0, 3, H, p.a, 0, 'opacity=".5"')}${hero(h, p, 95, 150, 0.82)}${hero(h, p, 95, 520, 0.7)}${hero(h, p, 95, 880, 0.82)}
    ${[0, 1, 2, 3, 4, 5].map((i) => circle(95, 280 + i * 40 + (i > 2 ? 40 : 0), 3, p.a, 'opacity=".45"')).join("")}${t.svg}${rules(240, f.ry, 484, f.rows, p.line)}${credit(p)}`;
  return { defs: "", body, area: area(240, f, 484) };
};

// 사선 — 비스듬한 색면 위에 그림
L2.slant = (d, h, p) => {
  const t = titleSvg(d, 80, 420, p, { size: 44, max: 7 });
  const f = flow(t.bottom);
  const body = `${rect(0, 0, W, H, p.paper)}${path(`M0 0 H${W} V250 L0 340Z`, p.b)}${path(`M0 340 L${W} 250 V262 L0 352Z`, p.a, "none", 0, 'opacity=".6"')}${circle(560, 160, 92, "#ffffff", 'opacity=".75"')}${hero(h, p, 560, 160, 0.95)}${star(p)}
    ${t.svg}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: "", body, area: area(80, f, 634) };
};
const star = (p) => circle(110, 110, 6, p.a, 'opacity=".6"') + circle(170, 170, 3, p.c, 'opacity=".8"') + circle(130, 230, 4, p.a, 'opacity=".4"');
export { L2 };
