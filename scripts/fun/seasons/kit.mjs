// 계절 편지지 그림 도구 — 모두 직접 그린 오리지널 SVG 입니다. (우체국 공식 로고·캐릭터는 쓰지 않습니다)
export const W = 794, H = 1123, GAP = 44;
const n1 = (v) => Math.round(v * 10) / 10;

export const circle = (cx, cy, r, fill, ex = "") => `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="${fill}" ${ex}/>`;
export const ellipse = (cx, cy, rx, ry, fill, ex = "") => `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(rx)}" ry="${n1(ry)}" fill="${fill}" ${ex}/>`;
export const rect = (x, y, w, h, fill, rx = 0, ex = "") => `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx="${rx}" fill="${fill}" ${ex}/>`;
export const path = (d, fill = "none", stroke = "none", sw = 0, ex = "") => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${ex}/>`;
export const g = (inner, x = 0, y = 0, s = 1, rot = 0, ex = "") => `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${rot}) scale(${s})" ${ex}>${inner}</g>`;
export const text = (x, y, str, { size = 22, weight = 700, fill = "#444", anchor = "start", spacing = 0, opacity = 1, rot = 0 } = {}) =>
  `<text x="${n1(x)}" y="${n1(y)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}" opacity="${opacity}" ${rot ? `transform="rotate(${rot} ${n1(x)} ${n1(y)})"` : ""} font-family="Noto Sans CJK KR, Pretendard, Malgun Gothic, sans-serif">${str}</text>`;

/** 꽃잎 n장으로 된 꽃 */
export const flower = (cx, cy, r, n, petal, center, rot = 0) =>
  Array.from({ length: n }, (_, i) => { const a = ((360 / n) * i + rot) * Math.PI / 180; return ellipse(cx + Math.cos(a) * r * 0.62, cy + Math.sin(a) * r * 0.62, r * 0.42, r * 0.3, petal, `transform="rotate(${(360 / n) * i + rot} ${n1(cx + Math.cos(a) * r * 0.62)} ${n1(cy + Math.sin(a) * r * 0.62)})"`); }).join("") + circle(cx, cy, r * 0.28, center);
/** 둥근 꽃잎 꽃(벚꽃·코스모스류) */
export const roundFlower = (cx, cy, r, n, petal, center, rot = 0) =>
  Array.from({ length: n }, (_, i) => { const a = ((360 / n) * i + rot) * Math.PI / 180; return circle(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55, r * 0.45, petal); }).join("") + circle(cx, cy, r * 0.22, center);
/** 잎 하나: (x,y)에서 위로 len 만큼 */
export const leaf = (x, y, len, w, fill, rot = 0, vein = "") =>
  g(path(`M0 0 Q${w} ${-len * 0.5} 0 ${-len} Q${-w} ${-len * 0.5} 0 0Z`, fill) + (vein ? path(`M0 -4 L0 ${-len + 6}`, "none", vein, 1.6) : ""), x, y, 1, rot);
export const star = (cx, cy, r, fill, o = 1) => `<polygon opacity="${o}" fill="${fill}" points="${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i * 45 - 90) * Math.PI / 180; const rr = i % 2 ? r * 0.32 : r; return `${n1(cx + Math.cos(a) * rr)},${n1(cy + Math.sin(a) * rr)}`; }).join(" ")}"/>`;
export const cloud = (x, y, s, fill = "#fff", o = 1) => g(`<g fill="${fill}" opacity="${o}"><circle cx="60" cy="60" r="34"/><circle cx="100" cy="46" r="40"/><circle cx="140" cy="62" r="32"/><rect x="40" y="60" width="120" height="34" rx="17"/></g>`, x, y, s);
export const snow = (cx, cy, r, stroke = "#fff", sw = 3) => Array.from({ length: 3 }, (_, i) => path(`M${n1(cx - r)} ${cy} L${n1(cx + r)} ${cy}`, "none", stroke, sw, `transform="rotate(${i * 60} ${cx} ${cy})"`)).join("") + Array.from({ length: 6 }, (_, i) => path(`M${cx} ${n1(cy - r * 0.62)} l-${n1(r * 0.16)} -${n1(r * 0.16)} M${cx} ${n1(cy - r * 0.62)} l${n1(r * 0.16)} -${n1(r * 0.16)}`, "none", stroke, sw * 0.7, `transform="rotate(${i * 60} ${cx} ${cy})"`)).join("");

/** 같은 번호면 늘 같은 값을 돌려주는 난수 — 장마다 흩뿌림 배치가 달라지도록 씁니다 */
export const rng = (seed) => { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); };

/** 글쓰기 줄(칸마다 아래쪽에 가는 선) — Word 본문 줄 간격(44px)과 같습니다 */
export const rulesSvg = (x, y, w, rows, color, dash = false) =>
  Array.from({ length: rows }, (_, i) => rect(x, y + i * GAP + GAP - 2, w, 2, color)).join("");
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// ---- 색 도우미 ----
const hex2 = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (c1, c2, t) => { const a = hex2(c1), b = hex2(c2); return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
/** 팔레트: a 주색, b 보조색, c 포인트, d 짙은 제목색, bg 연한 배경색 → 나머지는 자동 */
export const pal = ({ a, b, c, d, bg }) => ({ a, b, c, d, bg, pat: mix(bg, a, 0.28), paper: "#FFFEFA", ink: mix(d, "#2a2a2a", 0.45), line: mix("#ffffff", a, 0.38) });
export const hexagon = (cx, cy, r, fill, stroke = "none", sw = 0) => path(`M${n1(cx + r)} ${cy} ` + [1, 2, 3, 4, 5].map((i) => `L${n1(cx + Math.cos((i * 60 * Math.PI) / 180) * r)} ${n1(cy + Math.sin((i * 60 * Math.PI) / 180) * r)}`).join(" ") + "Z", fill, stroke, sw);
