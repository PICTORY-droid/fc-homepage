// 기억 편지지 공통 바탕 — 종이 결(grain)·가장자리 그늘·글쓰기 줄·제목 글꼴
import { W, H, GAP, circle, rect, path, g, text as baseText, mix, pal as basePal, rng } from "../seasons/kit.mjs";
export { W, H, GAP, circle, rect, path, g, rng, mix };

export const SERIF = "Noto Serif CJK KR, Noto Serif CJK SC, Batang, serif";
export const SANS = "Noto Sans CJK KR, Pretendard, Malgun Gothic, sans-serif";
const n1 = (v) => Math.round(v * 10) / 10;

export const txt = (x, y, str, { size = 20, weight = 400, fill = "#444", anchor = "start", spacing = 0, opacity = 1, rot = 0, serif = false } = {}) =>
  `<text x="${n1(x)}" y="${n1(y)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}" opacity="${opacity}" ${rot ? `transform="rotate(${rot} ${n1(x)} ${n1(y)})"` : ""} font-family="${serif ? SERIF : SANS}">${str}</text>`;

/** 깨끗한 파스텔 팔레트 — a 주색, b 보조색, c 포인트, d 짙은 색(제목), bg 연한 바탕 */
export const pal = (o) => {
  const p = basePal(o);
  p.paper = mix(o.bg, "#FFFFFF", 0.55);   // 맑은 흰 종이에 아주 옅은 색기
  p.ink = mix(o.d, "#2b2b33", 0.45);       // 또렷하고 깨끗한 잉크색
  p.line = mix(p.paper, o.a, 0.35);         // 은은한 파스텔 줄
  p.pat = mix(o.bg, o.a, 0.3);
  return p;
};

/** 종이 질감: 결 + 가장자리 그늘 (모든 장에 가장 위에 덮음) */
/** 질감·그늘 없이 깨끗하게 (호출부 호환을 위해 빈 값을 돌려줍니다) */
export const finish = () => "";
export const finishBody = () => "";

/** 글쓰기 줄 — 연필 선 느낌(살짝 옅게) */
export const rules = (x, y, w, rows, color) => Array.from({ length: rows }, (_, i) => rect(x, y + i * GAP + GAP - 2, w, 1.8, color, 0, 'opacity=".9"')).join("");

/** 제목을 한두 줄로 */
export const splitTitle = (t, max = 8) => {
  if (t.length <= max) return [t];
  const m = Math.floor(t.length / 2);
  let best = -1;
  for (let i = 0; i < t.length; i++) if (t[i] === " " && (best < 0 || Math.abs(i - m) < Math.abs(best - m))) best = i;
  return best > 0 ? [t.slice(0, best), t.slice(best + 1)] : [t.slice(0, m), t.slice(m)];
};
export const titleSvg = (d, x, y, p, { size = 44, anchor = "start", max = 8, gap = 52, w } = {}) => {
  const ls = splitTitle(d.title, max);
  // 글자를 뺀 배경(bare)을 만들 때는 제목을 그리지 않고 위치만 기록합니다 → Word 에서 제목을 직접 고쳐 쓸 수 있어요.
  const hide = d._bare && d.editTitle;
  if (hide) d._titleArea = { x, y, anchor, size, gap, w: w ?? (anchor === "middle" ? 600 : W - x - 70), lines: ls.length };
  const eyebrow = d.eyebrow ? txt(x, y - size - 8, d.eyebrow, { size: 13, weight: 700, fill: p.a, anchor, spacing: 5, serif: false }) : "";
  const t = hide ? "" : ls.map((s, i) => txt(x, y + i * gap, s, { size, weight: 700, fill: p.d, anchor, spacing: 1 })).join("");
  return { svg: eyebrow + t, bottom: y + (ls.length - 1) * gap + 22 };  // 제목 아래 보조 문장은 두지 않습니다
};
export const credit = (p, y = 1106) => txt(W / 2, y, "편지지 · 반딧불이의 곳간", { size: 12, fill: p.d, anchor: "middle", opacity: 0.5, serif: false });
export const wrapSvg = (id, defs, body, seed) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}${finish(id, seed)}</defs>${body}${finishBody(id)}</svg>`;
export const hero = (fn, p, cx, cy, s, rot = 0) => g(fn(p), cx - 100 * s, cy - 100 * s, s, rot);
export const tape = (x, y, w, p, rot = -6, o = 0.72) => g(`<rect width="${w}" height="30" fill="${p.c}" opacity="${o}"/><path d="M0 0 l4 5 l-4 5 l4 5 l-4 5 l4 5 l-4 5Z M${w} 0 l-4 5 l4 5 l-4 5 l4 5 l-4 5 l4 5Z" fill="${p.paper}" opacity=".7"/>`, x, y, 1, rot);
