// 배경 무늬 10종 — 장식 영역(띠·가장자리)에만 깔고, 글을 쓰는 종이 부분은 늘 깨끗하게 둡니다.
export const patternKinds = ["solid", "dots", "stripes", "checks", "grid", "waves", "diamonds", "confetti", "linen", "gradient"];

/** 무늬 정의(<defs> 안에 넣을 것)와 채울 때 쓸 fill 값을 돌려줍니다. */
export function pattern(kind, p, id) {
  const bg = p.bg, c = p.pat;
  const mk = (w, h, inner) => ({ defs: `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"><rect width="${w}" height="${h}" fill="${bg}"/>${inner}</pattern>`, fill: `url(#${id})` });
  switch (kind) {
    case "dots": return mk(26, 26, `<circle cx="7" cy="7" r="3" fill="${c}"/><circle cx="20" cy="20" r="3" fill="${c}"/>`);
    case "stripes": return mk(28, 28, `<rect width="14" height="28" fill="${c}" opacity=".55"/>`);
    case "checks": return mk(40, 40, `<rect width="20" height="20" fill="${c}" opacity=".5"/><rect x="20" y="20" width="20" height="20" fill="${c}" opacity=".5"/>`);
    case "grid": return mk(30, 30, `<path d="M0 0H30M0 0V30" stroke="${c}" stroke-width="2" opacity=".7"/>`);
    case "waves": return mk(48, 24, `<path d="M0 12 q12 -12 24 0 t24 0" fill="none" stroke="${c}" stroke-width="3" opacity=".7"/>`);
    case "diamonds": return mk(36, 36, `<path d="M18 4 L32 18 L18 32 L4 18Z" fill="${c}" opacity=".5"/>`);
    case "confetti": return mk(80, 80, `<rect x="8" y="10" width="10" height="4" rx="2" fill="${c}" transform="rotate(30 13 12)"/><circle cx="52" cy="22" r="4" fill="${c}"/><rect x="30" y="56" width="12" height="4" rx="2" fill="${c}" transform="rotate(-40 36 58)"/><circle cx="68" cy="64" r="3" fill="${c}"/><circle cx="14" cy="48" r="3" fill="${c}"/>`);
    case "linen": return mk(8, 8, `<path d="M0 0 L8 8 M8 0 L0 8" stroke="${c}" stroke-width="1" opacity=".6"/>`);
    case "gradient": return { defs: `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.a}" stop-opacity=".55"/><stop offset="1" stop-color="${bg}"/></linearGradient>`, fill: `url(#${id})` };
    default: return { defs: "", fill: bg };
  }
}
