// 기억 편지지 배치 13종 — 종이의 '형식' 자체가 추억입니다(폴라로이드·항공우편·줄공책·엽서·그림일기·승차권·카세트·일력·창가·봉투·한지·쪽지·삐삐).
// 각 배치는 { defs, body, area } 를 돌려줍니다. area: fields=[x,y,w] 받는 사람(+날짜) 줄, rules=[x,y,w,rows] 글쓰기 줄, from=[x,y,w,맞춤]|null
import { W, H, GAP, circle, rect, path, g, rng, mix, txt, titleSvg, credit, rules, hero, tape, wrapSvg, SERIF } from "./base.mjs";
import { postal } from "../seasons/postal.mjs";
import { L2, coverSvg } from "./layouts2.mjs";

const star = (cx, cy, r, f, o = 1) => `<polygon opacity="${o}" fill="${f}" points="${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => { const a = (i * 36 - 90) * Math.PI / 180, rr = i % 2 ? r * 0.45 : r; return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`; }).join(" ")}"/>`;

/** 톱니 우표 안에 소재 그림 */
export const stampHero = (h, p, x, y, s, rot = 4, value = "330") => g(`
  <rect width="110" height="136" fill="${p.a}"/><rect x="10" y="10" width="90" height="100" fill="${p.paper}"/>${g(h(p), 6, 12, 0.49)}
  <rect width="110" height="136" fill="none" stroke="${p.paper}" stroke-width="9" stroke-dasharray="0 11" stroke-linecap="round"/>`, x, y, s, rot);

const pm = () => ""; // 소인(지역·연도 글자)은 그림에 굽지 않는다
const shadow = (x, y, w, h, rx = 6) => rect(x + 5, y + 7, w, h, "#2b3a67", rx, 'opacity=".08"');
const L = {};
const flow = (bottom, minRy = 0) => { const fy = bottom + 26; const ry = Math.max(fy + 48, minRy); return { fy, ry, rows: Math.floor((1046 - ry) / GAP) }; };

// 1. 폴라로이드 사진 한 장
L.polaroid = (d, h, p) => {
  const t = titleSvg(d, 70, 190, p, { size: 44, max: 6 });
  const photo = g(`${shadow(0, 0, 300, 340)}<rect width="300" height="340" fill="#ffffff"/><rect x="20" y="20" width="260" height="258" fill="${p.b}"/>${g(h(p), 20 + 130 - 130, 20 + 129 - 130, 1.3)}
    <rect x="20" y="20" width="260" height="258" fill="none" stroke="#00000010"/>${txt(150, 312, d.cap ?? "20     .    .", { size: 17, anchor: "middle", fill: p.ink, opacity: .65 })}`, 440, 62, 1, 4);
  const body = `${rect(0, 0, W, H, p.paper)}${photo}${tape(520, 44, 130, p, -4)}${pm(p, 398, 300, 0.8, d.mark ?? "POST OFFICE")}${t.svg}${rules(70, 470, 654, 14, p.line)}${credit(p)}`;
  return { defs: "", body, area: { fields: [70, 422, 654], rules: [70, 470, 654, 14], from: [70, 1052, 654, "left"] } };
};

// 2. 항공우편 봉투 테두리
L.airmail = (d, h, p) => {
  const defs = `<pattern id="am" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="44" height="44" fill="${p.paper}"/><rect width="22" height="44" fill="${p.a}"/><rect x="22" width="11" height="44" fill="${p.c}"/></pattern>`;
  const B = 24;
  const t = titleSvg(d, 80, 150, p, { size: 44, max: 7 });
  const body = `${rect(0, 0, W, H, p.paper)}${rect(0, 0, W, B, "url(#am)")}${rect(0, H - B, W, B, "url(#am)")}${rect(0, 0, B, H, "url(#am)")}${rect(W - B, 0, B, H, "url(#am)")}
    ${rect(B, B, W - 2 * B, H - 2 * B, "none", 0, `stroke="${p.d}" stroke-width="1.5" opacity=".5"`)}
    ${stampHero(h, p, 560, 64, 1.0, 3, d.price ?? "330")}${pm(p, 500, 70, 0.9, d.mark ?? "KOREA")}
    ${t.svg}${rules(80, 290, 634, 17, p.line)}${credit(p)}`;
  return { defs, body, area: { fields: [80, 238, 634], rules: [80, 290, 634, 16], from: [80, 1004, 634, "left"] } };
};

// 3. 줄공책(스프링) + 이름표 스티커
L.notebook = (d, h, p) => {
  const holes = Array.from({ length: 15 }, (_, i) => `<circle cx="34" cy="${70 + i * 70}" r="12" fill="#e9e2d2" stroke="#00000022"/><rect x="14" y="${64 + i * 70}" width="48" height="12" rx="6" fill="${p.d}" opacity=".7"/>`).join("");
  const label = g(`${shadow(0, 0, 380, 150)}<rect width="380" height="150" rx="10" fill="${p.bg}" stroke="${p.d}" stroke-width="3"/><rect x="10" y="10" width="360" height="130" rx="6" fill="none" stroke="${p.a}" stroke-width="1.5" stroke-dasharray="6 5"/>
    ${txt(24, 36, " 이름 : ", { size: 14, fill: p.ink, opacity: .7, serif: false })}`, 130, 70, 1, 0);
  const t = titleSvg(d, 320, 152, p, { size: 36, anchor: "middle", max: 7, gap: 42, w: 340 });
  const body = `${rect(0, 0, W, H, p.paper)}${rect(0, 0, 94, H, mix(p.paper, p.b, 0.25))}${holes}${rect(98, 0, 2, H, p.c, 0, 'opacity=".75"')}${rect(104, 0, 2, H, p.c, 0, 'opacity=".75"')}
    ${rules(120, 250, 620, 18, mix(p.paper, p.a, 0.35))}${label}${t.svg}${hero(h, p, 650, 150, 1.0, 6)}${credit(p)}`;
  return { defs: "", body, area: { fields: [120, 212, 620], rules: [120, 250, 620, 18], from: [120, 1042, 620, "left"] } };
};

// 4. 엽서 뒷면(우표·소인·우편번호 칸)
L.postcard = (d, h, p) => {
  const t = titleSvg(d, 64, 112, p, { size: 36, max: 9, gap: 44 });
  const body = `${rect(0, 0, W, H, p.paper)}${rect(26, 26, W - 52, H - 52, "none", 0, `stroke="${p.d}" stroke-width="1.5" opacity=".35"`)}${rect(528, 70, 1.8, 960, p.d, 0, 'opacity=".35"')}
    ${txt(64, 70, "POST   CARD", { size: 13, weight: 700, fill: p.a, spacing: 5, serif: false })}${t.svg}
    ${stampHero(h, p, 612, 60, 1.05, 2, d.price ?? "330")}${pm(p, 560, 64, 1.0, d.mark ?? "POST OFFICE")}
    ${postal("zip", 556, 320, 0.8, p)}${[0, 1, 2].map((i) => rect(556, 420 + i * 58, 190, 1.8, p.d, 0, 'opacity=".5"')).join("")}${txt(556, 410, "받는 분", { size: 13, fill: p.ink, opacity: .6, serif: false })}
    ${hero(h, p, 640, 800, 1.2, -4)}${rules(64, 248, 440, 18, p.line)}${credit(p)}`;
  return { defs: "", body, area: { fields: [64, 200, 440], rules: [64, 248, 440, 18], from: null } };
};

// 5. 그림일기(날씨·그림 칸)
L.diary = (d, h, p) => {
  const wx = ["맑음", "흐림", "비", "눈"].map((s, i) => `${circle(452 + i * 70, 126, 15, "none", `stroke="${p.d}" stroke-width="2"`)}${i === (d.weather ?? 0) ? circle(452 + i * 70, 126, 7.5, p.a) : ""}${txt(452 + i * 70, 164, s, { size: 13, anchor: "middle", fill: p.ink, serif: false })}`).join("");
  const tab = g(`<rect width="300" height="44" rx="10" fill="${p.b}" stroke="${p.a}" stroke-width="2.5"/>`, 70, 192);
  const t = titleSvg(d, 220, 222, p, { size: 23, anchor: "middle", max: 14, w: 280 });
  const body = `${rect(0, 0, W, H, p.paper)}${rect(40, 36, W - 80, H - 72, "none", 14, `stroke="${p.a}" stroke-width="2" stroke-dasharray="3 8" stroke-linecap="round"`)}
    ${txt(70, 138, "그 림 일 기", { size: 26, weight: 700, fill: p.d, spacing: 6 })}${wx}
    ${tab}${t.svg}${rect(70, 234, 654, 318, p.bg, 12, `stroke="${p.d}" stroke-width="2.5"`)}${hero(h, p, 397, 394, 1.4, 0)}${txt(86, 540, "오늘 있었던 일을 그림으로 그려 보세요", { size: 13, fill: p.ink, opacity: .45, serif: false })}
    ${rules(70, 590, 654, 10, p.line)}${credit(p)}`;
  return { defs: "", body, area: { fields: [70, 52, 654], rules: [70, 590, 654, 10], from: [70, 1052, 654, "left"] } };
};

// 6. 승차권(기차표)
L.ticket = (d, h, p) => {
  const t = titleSvg(d, 70, 350, p, { size: 40, max: 8 });
  const f = flow(t.bottom);
  const tk = g(`${shadow(0, 0, 654, 210, 10)}<path d="M0 12 a12 12 0 0 1 12 -12 H642 a12 12 0 0 1 12 12 V92 a14 14 0 0 0 0 28 V198 a12 12 0 0 1 -12 12 H12 a12 12 0 0 1 -12 -12 V120 a14 14 0 0 0 0 -28Z" fill="#ffffff" stroke="${p.d}" stroke-width="2.5"/>
    <rect x="0" y="0" width="654" height="44" rx="12" fill="${p.a}"/><rect x="0" y="22" width="654" height="22" fill="${p.a}"/>${txt(24, 31, "승  차  권", { size: 20, weight: 700, fill: "#fff", spacing: 8 })}${txt(630, 30, d.train ?? "무궁화호", { size: 18, weight: 700, fill: "#fff", anchor: "end" })}
    ${txt(30, 96, "출발", { size: 14, fill: p.ink, opacity: .6, serif: false })}${txt(30, 140, d.from ?? "추억역", { size: 38, weight: 700, fill: p.d })}${txt(300, 140, "→", { size: 34, fill: p.a, anchor: "middle" })}${txt(340, 96, "도착", { size: 14, fill: p.ink, opacity: .6, serif: false })}${txt(340, 140, d.to ?? "그리움역", { size: 38, weight: 700, fill: p.d })}
    <path d="M24 164 H630" stroke="${p.d}" stroke-width="1.5" stroke-dasharray="4 5" opacity=".6"/>${txt(30, 192, "20      .      .      발행        일반실  1매", { size: 14, fill: p.ink, opacity: .7, serif: false })}
    ${g(h(p), 520, 62, 0.5)}`, 70, 66, 1, d.tilt ?? -1.5);
  const body = `${rect(0, 0, W, H, p.paper)}${tk}${t.svg}${rules(70, f.ry, 654, f.rows, p.line)}${credit(p)}`;
  return { defs: "", body, area: { fields: [70, f.fy, 654], rules: [70, f.ry, 654, f.rows], from: [70, 1052, 654, "left"] } };
};

// 7. 카세트 테이프(라벨에 손글씨 제목)
L.cassette = (d, h, p) => {
  const reel = (cx) => `${circle(cx, 0, 38, "#f4efe3")}${circle(cx, 0, 38, "none", 'stroke="#3a3a3a" stroke-width="3"')}${Array.from({ length: 6 }, (_, i) => `<rect x="${cx - 3}" y="-36" width="6" height="14" fill="#3a3a3a" transform="rotate(${i * 60} ${cx} 0)"/>`).join("")}${circle(cx, 0, 9, "#3a3a3a")}`;
  const tape = g(`${shadow(0, 0, 560, 330, 18)}<rect width="560" height="330" rx="18" fill="${p.a}"/><rect x="18" y="16" width="524" height="190" rx="10" fill="#ffffff"/>
    <rect x="30" y="26" width="500" height="54" fill="${p.c}" opacity=".85"/>${txt(46, 64, "A  SIDE", { size: 24, weight: 800, fill: "#fff", spacing: 4, serif: false })}${txt(514, 64, "C-60", { size: 20, weight: 800, fill: "#fff", anchor: "end", serif: false })}
    <path d="M60 152 H500" stroke="${p.d}" stroke-width="1.5" opacity=".5"/>
    <rect x="130" y="224" width="300" height="60" rx="30" fill="#2e2a28"/><g transform="translate(0 254)">${reel(190)}${reel(370)}</g><path d="M200 296 h160 l16 34 h-192Z" fill="#00000022"/>
    ${[0, 1, 2, 3].map((i) => circle(46 + i * 156, 312, 6, "#00000030")).join("")}`, 74, 66, 0.84, 0);
  const t = titleSvg(d, 309, 179, p, { size: 32, anchor: "middle", max: 12, w: 420 });
  const body = `${rect(0, 0, W, H, p.paper)}${tape}${t.svg}${hero(h, p, 650, 220, 0.85, 8)}${rules(70, 430, 654, 14, p.line)}${credit(p)}`;
  return { defs: "", body, area: { fields: [70, 382, 654], rules: [70, 430, 654, 14], from: [70, 1052, 654, "left"] } };
};

// 8. 일력(절기)
L.almanac = (d, h, p) => {
  const t = titleSvg(d, 360, 150, p, { size: 40, max: 6 });
  const cal = g(`${shadow(0, 0, 250, 300, 6)}<rect width="250" height="300" rx="6" fill="#ffffff"/><rect width="250" height="62" rx="6" fill="${p.a}"/><rect y="40" width="250" height="22" fill="${p.a}"/>
    ${circle(60, 10, 7, "#fff", `stroke="${p.d}" stroke-width="2"`)}${circle(190, 10, 7, "#fff", `stroke="${p.d}" stroke-width="2"`)}${txt(125, 42, d.month ?? "3월", { size: 26, weight: 700, fill: "#fff", anchor: "middle", spacing: 4 })}
    ${txt(125, 180, d.hanja ?? "立春", { size: 76, weight: 700, fill: p.d, anchor: "middle" })}${txt(125, 226, d.term ?? "입춘", { size: 26, weight: 700, fill: p.a, anchor: "middle", spacing: 8 })}
    <path d="M30 246 H220" stroke="${p.d}" stroke-width="1.5" opacity=".4"/>${txt(125, 276, d.cal ?? "음력  월  일", { size: 15, fill: p.ink, anchor: "middle", opacity: .65, serif: false })}`, 70, 70, 1, -3);
  const body = `${rect(0, 0, W, H, p.paper)}${cal}${t.svg}${hero(h, p, 600, 260, 0.78, 6)}${rules(70, 410, 654, 16, p.line)}${credit(p)}`;
  return { defs: "", body, area: { fields: [70, 362, 654], rules: [70, 410, 654, 14], from: [70, 1052, 654, "left"] } };
};

// 9. 창가(빗방울·눈·햇살 무늬)
L.window = (d, h, p) => {
  const r = rng(d.n ?? 7);
  const fx = d.fx ?? "none";
  const drops = fx === "rain" ? Array.from({ length: 26 }, () => { const x = 90 + r() * 614, y = 80 + r() * 320; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q-5 12 0 18 q5 -6 0 -18Z" fill="#fff" opacity=".55"/>`; }).join("") : fx === "snow" ? Array.from({ length: 34 }, () => circle(90 + r() * 614, 80 + r() * 320, 2 + r() * 4, "#fff", 'opacity=".85"')).join("") : fx === "petal" ? Array.from({ length: 16 }, () => `<ellipse cx="${(90 + r() * 614).toFixed(0)}" cy="${(80 + r() * 320).toFixed(0)}" rx="7" ry="4" fill="${p.b}" transform="rotate(${(r() * 120).toFixed(0)} 300 200)"/>`).join("") : fx === "leaf" ? Array.from({ length: 12 }, () => `<ellipse cx="${(90 + r() * 614).toFixed(0)}" cy="${(80 + r() * 320).toFixed(0)}" rx="9" ry="5" fill="${p.c}" opacity=".8" transform="rotate(${(r() * 160).toFixed(0)} 300 200)"/>`).join("") : "";
  const t = titleSvg(d, W / 2, 500, p, { size: 42, anchor: "middle", max: 9 });
  const f = flow(t.bottom);
  const body = `${rect(0, 0, W, H, p.paper)}${rect(80, 70, 634, 340, p.b)}${path("M80 300 Q250 250 397 296 T714 280 V410 H80Z", mix(p.b, p.a, 0.5), "none", 0, 'opacity=".5"')}${hero(h, p, 397, 240, 1.4)}${drops}
    ${rect(66, 56, 662, 368, "none", 0, `stroke="${p.d}" stroke-width="14"`)}${rect(392, 62, 10, 356, p.d)}${rect(72, 236, 650, 10, p.d)}${rect(52, 424, 690, 20, p.d)}${rect(52, 424, 690, 6, "#fff", 0, 'opacity=".25"')}
    ${path("M66 62 Q120 200 78 420 H66Z", p.c, "none", 0, 'opacity=".9"')}${path("M728 62 Q674 200 716 420 H728Z", p.c, "none", 0, 'opacity=".9"')}
    ${t.svg}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs: "", body, area: { fields: [80, f.fy, 634], rules: [80, f.ry, 634, f.rows], from: [80, 1052, 634, "left"] } };
};

// 10. 봉투 안쪽(속지 무늬)과 우표
L.envelope = (d, h, p) => {
  const defs = `<pattern id="sec" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><rect width="26" height="26" fill="${p.a}"/><path d="M0 13 H26" stroke="${p.paper}" stroke-width="1.6" opacity=".35"/><circle cx="6" cy="6" r="2" fill="${p.paper}" opacity=".35"/></pattern>`;
  const t = titleSvg(d, 80, 410, p, { size: 42, max: 8 });
  const f = flow(t.bottom);
  const body = `${rect(0, 0, W, H, p.paper)}${path(`M0 0 H${W} V250 L${W / 2} 340 L0 250Z`, "url(#sec)")}${path(`M0 250 L${W / 2} 340 L${W} 250`, "none", p.d, 3, 'opacity=".55"')}
    ${circle(397, 330, 44, p.c)}${circle(397, 330, 34, "none", `stroke="${p.paper}" stroke-width="2" opacity=".7"`)}${g(h(p), 397 - 38, 330 - 38, 0.38)}${stampHero(h, p, 60, 36, 0.8, -4, d.price ?? "330")}${pm(p, 560, 40, 0.9, d.mark ?? "POST OFFICE")}
    ${t.svg}${rules(80, f.ry, 634, f.rows, p.line)}${credit(p)}`;
  return { defs, body, area: { fields: [80, f.fy, 634], rules: [80, f.ry, 634, f.rows], from: [80, 1052, 634, "left"] } };
};

// 11. 한지·문살·낙관
L.hanji = (d, h, p) => {
  const r = rng(d.n ?? 11);
  const fib = Array.from({ length: 160 }, () => { const x = r() * W, y = r() * H, l = 10 + r() * 30, a = r() * Math.PI; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l${(Math.cos(a) * l).toFixed(0)} ${(Math.sin(a) * l).toFixed(0)}" stroke="${p.d}" stroke-width=".8" opacity=".10"/>`; }).join("");
  const lat = Array.from({ length: 8 }, (_, i) => rect(10 + i * 0, 60 + i * 130, 76, 4, p.d, 0, 'opacity=".5"')).join("") + Array.from({ length: 3 }, (_, i) => rect(10 + i * 38, 56, 4, 960, p.d, 0, 'opacity=".5"')).join("") + rect(10, 56, 76, 4, p.d);
  const t = titleSvg(d, 450, 190, p, { size: 46, anchor: "middle", max: 6 });
  const f = flow(Math.max(t.bottom, 260));
  const seal = g(`<rect width="70" height="70" rx="6" fill="${p.a}"/><rect x="5" y="5" width="60" height="60" rx="3" fill="none" stroke="${p.paper}" stroke-width="2" opacity=".8"/>${txt(35, 48, d.seal ?? "福", { size: 38, weight: 800, fill: p.paper, anchor: "middle" })}`, 650, 70, 1, 4);
  const body = `${rect(0, 0, W, H, p.paper)}${fib}${rect(0, 0, 96, H, mix(p.paper, p.d, 0.08))}${lat}${rect(96, 0, 3, H, p.d, 0, 'opacity=".5"')}${seal}${hero(h, p, 220, 150, 0.7, -4)}${t.svg}${rules(140, f.ry, 590, f.rows, p.line)}${credit(p)}`;
  return { defs: "", body, area: { fields: [140, f.fy, 590], rules: [140, f.ry, 590, f.rows], from: [140, 1040, 590, "left"] } };
};

// 12. 쪽지·롤링페이퍼(테이프·낙서)
L.scrap = (d, h, p) => {
  const r = rng(d.n ?? 5);
  const doodles = Array.from({ length: 9 }, (_, i) => { const x = 60 + r() * 680, y = 40 + r() * 230; return i % 3 === 0 ? star(x, y, 12 + r() * 8, p.c, 0.55) : i % 3 === 1 ? circle(x, y, 7 + r() * 6, "none", `stroke="${p.a}" stroke-width="2.5" opacity=".6"`) : `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q10 -16 20 0 t20 0" stroke="${p.d}" stroke-width="2.5" fill="none" opacity=".4"/>`; }).join("");
  const t = titleSvg(d, 70, 336, p, { size: 44, max: 8 });
  const f = flow(t.bottom);
  const body = `${rect(0, 0, W, H, p.paper)}${doodles}${g(`${shadow(0, 0, 250, 250)}<rect width="250" height="250" fill="#ffffff"/><rect x="14" y="14" width="222" height="222" fill="${p.b}"/>${g(h(p), 14, 14, 1.11)}`, 470, 50, 1, 5)}${tape(540, 36, 120, p, 6)}
    ${g(`<rect width="150" height="104" fill="${p.bg}" stroke="${p.d}" stroke-width="2"/>${txt(75, 42, d.note1 ?? "잘 지내?", { size: 22, weight: 700, fill: p.d, anchor: "middle" })}${txt(75, 76, d.note2 ?? "보고 싶다", { size: 18, fill: p.ink, anchor: "middle" })}`, 90, 66, 1, -6)}${tape(120, 56, 80, p, -8)}
    ${t.svg}${rules(70, f.ry, 654, f.rows, p.line)}${credit(p)}`;
  return { defs: "", body, area: { fields: [70, f.fy, 654], rules: [70, f.ry, 654, f.rows], from: [70, 1052, 654, "left"] } };
};

// 13. 삐삐 (호출 문자 화면)
L.pager = (d, h, p) => {
  const t = titleSvg(d, 70, 370, p, { size: 42, max: 8 });
  const f = flow(t.bottom);
  const dev = g(`${shadow(0, 0, 330, 210, 22)}<rect width="330" height="210" rx="22" fill="${p.a}"/><rect x="12" y="12" width="306" height="186" rx="16" fill="none" stroke="#ffffff55" stroke-width="2"/>
    <rect x="30" y="30" width="270" height="92" rx="8" fill="#c9d6b0" stroke="#2b3a26" stroke-width="3"/>${txt(44, 70, d.lcd1 ?? "8282", { size: 38, weight: 800, fill: "#2b3a26", serif: false, spacing: 6 })}${txt(44, 106, d.lcd2 ?? "1004  7942  486", { size: 20, weight: 700, fill: "#2b3a26", serif: false, spacing: 2, opacity: .8 })}
    ${[0, 1, 2].map((i) => `<rect x="${50 + i * 90}" y="146" width="70" height="30" rx="15" fill="${p.d}" opacity=".85"/>`).join("")}${circle(300, 22, 5, p.c)}`, 70, 80, 1, -4);
  const body = `${rect(0, 0, W, H, p.paper)}${dev}${hero(h, p, 600, 190, 0.8, 6)}${txt(400, 300, d.sub ?? "음성 사서함 1건", { size: 16, fill: p.ink, opacity: .6 })}${t.svg}${rules(70, f.ry, 654, f.rows, p.line)}${credit(p)}`;
  return { defs: "", body, area: { fields: [70, f.fy, 654], rules: [70, f.ry, 654, f.rows], from: [70, 1052, 654, "left"] } };
};

export const layoutNames = [...Object.keys(L), ...Object.keys(L2)];
export const draw = (d, heroFn) => {
  const p = d.p;
  const run = (bare) => { d._bare = bare; d._titleArea = null; const r = (L[d.layout] ?? L2[d.layout])(d, heroFn, p); d._bare = false; return { ...r, titleArea: d._titleArea }; };
  const bareRun = run(true);            // 글자를 뺀 배경 + 제목 위치(Word 에서 제목 편집용)
  const full = run(false);
  const a = full.area;
  const lab = [
    txt(a.fields[0], a.fields[1] + 28, "받는 사람 :", { size: 17, weight: 700, fill: p.ink, serif: false }),
    d.dateLine === false ? "" : txt(a.fields[0] + a.fields[2], a.fields[1] + 28, "날짜 :        년     월     일", { size: 17, weight: 700, fill: p.ink, anchor: "end", serif: false }),
    a.from ? txt(a.from[3] === "right" ? a.from[0] + a.from[2] : a.from[0], a.from[1] + 28, "보내는 사람 :", { size: 17, weight: 700, fill: p.ink, anchor: a.from[3] === "right" ? "end" : "start", serif: false }) : "",
  ].join("");
  return { cover: () => coverSvg(d, heroFn, p), svg: (bare) => (bare ? wrapSvg(d.id, bareRun.defs, bareRun.body, d.n ?? 3) : wrapSvg(d.id, full.defs, full.body + lab, d.n ?? 3)), area: { ...a, date: d.dateLine !== false, title: d.editTitle ? bareRun.titleArea ?? null : null } };
};
