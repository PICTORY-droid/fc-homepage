// 감성 편지지 10종의 그림·배치 — 모두 직접 그린 오리지널 SVG/CSS 입니다. (우체국 공식 로고·캐릭터는 쓰지 않습니다)
// 쪽 크기: A4 = 794 x 1123 CSS px. scripts/fun/make-stationery.mjs 가 이 파일을 불러 PNG 를 만듭니다.
export const W = 794, H = 1123;
const BRAND = "#FF883A", DEEP = "#C4540A", RED = "#E8591A";

const star = (x, y, r, fill = "#FFE08A", o = 1) =>
  `<polygon transform="translate(${x} ${y})" opacity="${o}" fill="${fill}" points="0,${-r} ${r * 0.3},${-r * 0.3} ${r},0 ${r * 0.3},${r * 0.3} 0,${r} ${-r * 0.3},${r * 0.3} ${-r},0 ${-r * 0.3},${-r * 0.3}"/>`;

/** 우표: 색 바탕 + 가장자리 구멍(종이색 점) + 안쪽 그림 */
export function stamp({ x, y, w = 120, h = 150, color = BRAND, paper = "#FFF9EE", rot = 0, art = "sun", value = "100" }) {
  const inner = {
    sun: `<circle cx="${w / 2}" cy="${h * 0.4}" r="${w * 0.22}" fill="#FFF3C4"/><path d="M14 ${h - 38} Q${w / 2} ${h * 0.5} ${w - 14} ${h - 38} Z" fill="#fff" opacity=".35"/>`,
    heart: `<path d="M${w / 2} ${h * 0.58} C${w * 0.1} ${h * 0.32} ${w * 0.3} ${h * 0.12} ${w / 2} ${h * 0.3} C${w * 0.7} ${h * 0.12} ${w * 0.9} ${h * 0.32} ${w / 2} ${h * 0.58}Z" fill="#fff" opacity=".92"/>`,
    mail: `<rect x="${w * 0.2}" y="${h * 0.26}" width="${w * 0.6}" height="${h * 0.34}" rx="4" fill="#fff"/><path d="M${w * 0.2} ${h * 0.28} L${w / 2} ${h * 0.46} L${w * 0.8} ${h * 0.28}" fill="none" stroke="${color}" stroke-width="3"/>`,
    star: star(w / 2, h * 0.4, w * 0.26, "#fff"),
    flower: [0, 72, 144, 216, 288].map((a) => `<circle cx="${w / 2 + Math.cos((a * Math.PI) / 180) * w * 0.17}" cy="${h * 0.4 + Math.sin((a * Math.PI) / 180) * w * 0.17}" r="${w * 0.12}" fill="#fff" opacity=".9"/>`).join("") + `<circle cx="${w / 2}" cy="${h * 0.4}" r="${w * 0.09}" fill="#FFD36B"/>`,
  }[art];
  return `<svg style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${rot}deg)" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${color}"/>${inner}
  <text x="${w - 12}" y="${h - 16}" text-anchor="end" font-size="20" font-weight="900" fill="#fff" font-family="Noto Sans CJK KR">${value}</text>
  <rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="${paper}" stroke-width="10" stroke-dasharray="0 12" stroke-linecap="round"/></svg>`;
}

/** 둥근 소인(우체국 날짜 도장 느낌) */
export function postmark({ x, y, size = 150, color = "#6b5b4d", rot = -12, text = "POST OFFICE · 마음 우체국 ·", o = 0.55 }) {
  const id = `pm${Math.round(x)}${Math.round(y)}`;
  return `<svg style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${rot}deg);opacity:${o}" width="${size}" height="${size}" viewBox="0 0 200 200">
  <defs><path id="${id}" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"/></defs>
  <circle cx="100" cy="100" r="92" fill="none" stroke="${color}" stroke-width="5"/><circle cx="100" cy="100" r="58" fill="none" stroke="${color}" stroke-width="3"/>
  <text font-size="19" font-weight="800" letter-spacing="2" fill="${color}" font-family="Noto Sans CJK KR"><textPath href="#${id}" startOffset="2%">${text}</textPath></text>
  <text x="100" y="96" text-anchor="middle" font-size="22" font-weight="900" fill="${color}" font-family="Noto Sans CJK KR">20  .  .</text>
  <path d="M52 116 h96 M56 128 h88" stroke="${color}" stroke-width="3" stroke-linecap="round"/></svg>`;
}

export const cloud = (x, y, s = 1, fill = "#fff") =>
  `<svg style="position:absolute;left:${x}px;top:${y}px" width="${200 * s}" height="${100 * s}" viewBox="0 0 200 100"><g fill="${fill}"><circle cx="60" cy="60" r="34"/><circle cx="100" cy="46" r="40"/><circle cx="140" cy="62" r="32"/><rect x="40" y="60" width="120" height="34" rx="17"/></g></svg>`;

export const envelope = (x, y, s = 1, rot = 0, fill = "#fff", line = DEEP) =>
  `<svg style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${rot}deg)" width="${110 * s}" height="${76 * s}" viewBox="0 0 110 76"><rect x="3" y="3" width="104" height="70" rx="8" fill="${fill}" stroke="${line}" stroke-width="4"/><path d="M6 8 L55 42 L104 8" fill="none" stroke="${line}" stroke-width="4" stroke-linejoin="round"/></svg>`;

const mailbox = (x, y, s = 1) =>
  `<svg style="position:absolute;left:${x}px;top:${y}px" width="${190 * s}" height="${260 * s}" viewBox="0 0 190 260">
  <rect x="86" y="150" width="18" height="100" fill="#8a5a3a"/><rect x="60" y="244" width="70" height="10" rx="5" fill="#6d4630"/>
  <path d="M20 150 V86 a65 65 0 0 1 130 0 V150 Z" fill="${RED}"/><rect x="20" y="124" width="130" height="30" rx="6" fill="${DEEP}"/>
  <rect x="48" y="104" width="74" height="9" rx="4.5" fill="#7a2f06"/><rect x="150" y="62" width="8" height="64" fill="#8a5a3a"/><path d="M158 62 h30 v22 h-30z" fill="#FFD36B"/>
  <circle cx="85" cy="70" r="6" fill="#fff" opacity=".5"/></svg>`;

const bike = (x, y, s = 1) =>
  `<svg style="position:absolute;left:${x}px;top:${y}px" width="${340 * s}" height="${190 * s}" viewBox="0 0 340 190">
  <ellipse cx="170" cy="182" rx="150" ry="7" fill="#0002"/>
  <g fill="#3b3b3b"><circle cx="78" cy="140" r="34"/><circle cx="262" cy="140" r="34"/></g><g fill="#fff"><circle cx="78" cy="140" r="14"/><circle cx="262" cy="140" r="14"/></g><g fill="#999"><circle cx="78" cy="140" r="5"/><circle cx="262" cy="140" r="5"/></g>
  <path d="M78 140 L120 96 H210 L262 140" fill="none" stroke="${DEEP}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M110 100 Q140 70 190 84 L232 96 Q250 112 232 124 L120 124 Q98 118 110 100Z" fill="${BRAND}"/>
  <rect x="26" y="54" width="86" height="58" rx="8" fill="${RED}"/><rect x="36" y="64" width="66" height="38" rx="5" fill="#fff"/><path d="M38 66 L69 86 L100 66" fill="none" stroke="${RED}" stroke-width="4"/>
  <path d="M238 100 L252 62 L276 58" fill="none" stroke="#333" stroke-width="7" stroke-linecap="round"/>
  <circle cx="168" cy="48" r="20" fill="#FFD9B8"/><path d="M146 44 Q168 16 190 44 Z" fill="${BRAND}"/><rect x="144" y="40" width="48" height="8" rx="4" fill="${DEEP}"/><circle cx="176" cy="52" r="3" fill="#333"/>
  <path d="M158 68 Q160 100 186 100 L236 92 L240 74 L192 78 Z" fill="${RED}"/><path d="M196 80 L246 66" stroke="#FFD9B8" stroke-width="10" stroke-linecap="round"/>
  <rect x="150" y="96" width="62" height="14" rx="7" fill="#2b2b2b"/>
  <circle cx="292" cy="96" r="9" fill="#FFE9A8"/></svg>`;

const flowers = (cx, cy, s = 1, colors = ["#FFB4B4", "#FFD9A8", "#FFE9A8"]) =>
  [0, 1, 2, 3, 4, 5].map((i) => `<g transform="translate(${cx + Math.cos(i) * 40 * s} ${cy + Math.sin(i * 1.7) * 40 * s}) scale(${s})">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${Math.cos((a * Math.PI) / 180) * 14}" cy="${Math.sin((a * Math.PI) / 180) * 14}" r="11" fill="${colors[i % 3]}"/>`).join("")}<circle r="7" fill="#FFF3C4"/></g>`).join("");

// 글쓰기 줄 — setBare(true) 이면 받는 사람/날짜/보내는 사람 글자만 빼고(글쓰기 줄은 유지) 그립니다(Word 파일 배경용)
let BARE = false;
export const setBare = (v) => { BARE = v; };
const WRITING_TEXT = /^(받는 사람|보내는 사람|날짜|To\.|From\.|20__)/;
const rules = ({ x, y, w, rows, gap = 44, color = "#d9cbb8", dash = false }) =>
  `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${rows * gap}px;background:repeating-linear-gradient(to bottom,transparent 0 ${gap - 2}px,${color} ${gap - 2}px ${gap}px);${dash ? "" : ""}"></div>`;
const t = (x, y, text, { size = 22, color = "#6b5b4d", weight = 700, w, align } = {}) => BARE && WRITING_TEXT.test(text) ? "" :
  `<div style="position:absolute;left:${x}px;top:${y}px;${w ? `width:${w}px;` : ""}font-size:${size}px;font-weight:${weight};color:${color};${align ? `text-align:${align};` : ""}white-space:nowrap">${text}</div>`;
const fields = (x, y, w, color = "#6b5b4d") =>
  t(x, y, "받는 사람 : ______________", { size: 20, color }) + t(x + w - 280, y, "날짜 : 20__ . __ . __", { size: 20, color });
const from = (x, y, w, color = "#6b5b4d") => t(x, y, "보내는 사람 : ______________", { size: 20, color, w, align: "right" });
const credit = (color = "#a89a8a", bottom = 24) =>
  `<div style="position:absolute;left:0;right:0;bottom:${bottom}px;text-align:center;font-size:13px;color:${color}">감성 편지지 · 우체국보험 상담 안내</div>`;

export const designs = [
  {
    id: "01-airmail", name: "에어메일", color: "#1F4E9E",
    html: () => `<div style="position:absolute;inset:0;background:repeating-linear-gradient(-45deg,#E8381F 0 16px,#fff 16px 32px,#1F4E9E 32px 48px,#fff 48px 64px)"></div>
      <div style="position:absolute;left:26px;top:26px;right:26px;bottom:26px;background:#FFFDF8"></div>
      ${t(0, 70, "✈  AIR MAIL  ✈", { size: 46, color: "#1F4E9E", weight: 900, w: W, align: "center" })}
      ${t(0, 128, "par avion · 마음을 하늘로 보내요", { size: 18, color: "#E8381F", w: W, align: "center" })}
      ${fields(90, 190, 614)}${rules({ x: 90, y: 250, w: 614, rows: 17, color: "#cfd8e8" })}${from(90, 1010, 614)}${credit()}`,
  },
  {
    id: "02-stamps", name: "우표 콜라주", color: BRAND,
    html: () => `<div style="position:absolute;inset:0;background:#FFF9EE"></div>
      ${stamp({ x: 540, y: 52, color: BRAND, rot: 6, art: "sun", value: "100" })}${stamp({ x: 620, y: 120, w: 100, h: 126, color: "#2F7D5B", rot: -8, art: "flower", value: "250" })}
      ${stamp({ x: 460, y: 150, w: 96, h: 120, color: "#1F4E9E", rot: -4, art: "mail", value: "430" })}${postmark({ x: 520, y: 150, size: 170, rot: -14 })}
      ${t(70, 78, "From my heart", { size: 44, color: DEEP, weight: 900 })}${t(72, 140, "소중한 마음을 우표 한 장에 담아", { size: 20, color: "#8a6a4d", weight: 600 })}
      ${t(70, 300, "받는 사람 : ______________", { size: 20 })}${rules({ x: 70, y: 330, w: 654, rows: 16, color: "#e3d2b8" })}${from(70, 1056, 654)}${credit()}`,
  },
  {
    id: "03-mailbox", name: "빨간 우체통", color: RED,
    html: () => `<div style="position:absolute;inset:0;background:#FFF4EC"></div>
      <div style="position:absolute;left:44px;top:44px;right:44px;bottom:44px;border:3px dashed ${BRAND};border-radius:28px"></div>
      ${t(0, 86, "마음 우체통", { size: 48, color: RED, weight: 900, w: W, align: "center" })}${t(0, 148, "오늘의 이야기를 톡 넣어 주세요", { size: 19, color: DEEP, w: W, align: "center", weight: 600 })}
      ${fields(96, 206, 602, DEEP)}${rules({ x: 96, y: 258, w: 602, rows: 14, color: "#f2cfb3" })}${mailbox(556, 840, 0.95)}${from(96, 880, 400, DEEP)}${credit(DEEP)}`,
  },
  {
    id: "04-postmark", name: "소인 엽서", color: "#6b5b4d",
    html: () => `<div style="position:absolute;inset:0;background:#FBF6EC"></div>
      <div style="position:absolute;left:46px;top:46px;right:46px;bottom:46px;border:2px solid #8a7a68"></div><div style="position:absolute;left:58px;top:58px;right:58px;bottom:58px;border:1px solid #b8a890"></div>
      ${postmark({ x: 230, y: 380, size: 340, rot: -10, o: 0.1 })}${postmark({ x: 530, y: 80, size: 150, rot: 10, o: 0.6 })}
      ${t(96, 96, "POST CARD", { size: 44, color: "#6b5b4d", weight: 900 })}${t(98, 152, "from  ______________________", { size: 20 })}
      ${t(96, 230, "받는 사람 : ______________", { size: 20 })}${rules({ x: 96, y: 262, w: 602, rows: 17, color: "#d8c9b2" })}${credit("#a89a8a", 70)}`,
  },
  {
    id: "05-sky", name: "하늘 편지", color: "#4FA3E0",
    html: () => `<div style="position:absolute;inset:0;background:linear-gradient(#BFE3FF 0,#E6F4FF 34%,#FFFFFF 62%)"></div>
      ${cloud(40, 70, 1.1)}${cloud(520, 40, 0.9)}${cloud(300, 160, 0.7, "#ffffffcc")}
      ${envelope(600, 150, 0.9, 14)}${envelope(120, 190, 0.6, -10, "#FFF3C4")}${envelope(370, 80, 0.5, 6, "#FFE0CC")}
      ${t(0, 270, "하늘 우체국", { size: 42, color: "#2F7FBF", weight: 900, w: W, align: "center" })}
      ${fields(90, 340, 614, "#4a6b86")}${rules({ x: 90, y: 392, w: 614, rows: 15, color: "#c6def0" })}${from(90, 1054, 614, "#4a6b86")}${credit("#7fa0bb")}`,
  },
  {
    id: "06-flower", name: "꽃 편지", color: "#E58AA0",
    html: () => `<div style="position:absolute;inset:0;background:#FFF6F4"></div>
      <svg style="position:absolute;left:0;top:0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${flowers(110, 110, 1.3)}${flowers(690, 1010, 1.3, ["#FFD9A8", "#FFB4B4", "#FFF0B8"])}${flowers(700, 90, 0.7, ["#FFD9E0", "#FFB4C4", "#FFE9A8"])}${flowers(100, 1030, 0.7, ["#FFE0B8", "#FFC4C4", "#FFE9A8"])}</svg>
      ${t(0, 150, "To. my dear", { size: 40, color: "#C45E78", weight: 900, w: W, align: "center" })}
      ${fields(110, 240, 574, "#9a6a74")}${rules({ x: 110, y: 296, w: 574, rows: 15, color: "#f1d4d4" })}${from(110, 1000, 380, "#9a6a74")}${credit("#c9a4ab")}`,
  },
  {
    id: "07-kraft", name: "크래프트 포장지", color: "#A97A45",
    html: () => `<div style="position:absolute;inset:0;background:#D9B98A;background-image:radial-gradient(#c8a574 1px,transparent 1.4px);background-size:14px 14px"></div>
      <div style="position:absolute;left:60px;top:90px;right:60px;bottom:60px;background:#FFFCF4;border-radius:14px;box-shadow:0 8px 24px #0003"></div>
      <svg style="position:absolute;left:0;top:30px" width="${W}" height="90" viewBox="0 0 ${W} 90"><path d="M0 40 Q200 80 400 40 T794 40" fill="none" stroke="#7a5a34" stroke-width="5" stroke-dasharray="10 6"/><circle cx="397" cy="44" r="12" fill="#7a5a34"/></svg>
      <div style="position:absolute;left:520px;top:130px;transform:rotate(-8deg);border:4px double ${RED};color:${RED};font-weight:900;font-size:26px;padding:6px 18px;border-radius:8px">HANDMADE</div>
      ${t(100, 150, "작은 소포 같은 편지", { size: 38, color: "#7a5a34", weight: 900 })}
      ${t(100, 230, "받는 사람 : ______________", { size: 20, color: "#7a5a34" })}${rules({ x: 100, y: 270, w: 594, rows: 16, color: "#e6d8bd" })}${from(100, 996, 594, "#7a5a34")}${credit("#7a5a34", 80)}`,
  },
  {
    id: "08-night", name: "별밤 편지", color: "#1B2A49",
    html: () => `<div style="position:absolute;inset:0;background:#1B2A49"></div>
      <svg style="position:absolute;left:0;top:0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${[[60, 60, 7], [170, 130, 4], [330, 50, 5], [470, 120, 3], [610, 70, 6], [730, 150, 4], [90, 940, 5], [700, 980, 7], [400, 1070, 4], [740, 560, 3], [40, 600, 4]].map(([x, y, r]) => star(x, y, r)).join("")}
      <path d="M690 100 a46 46 0 1 0 40 70 a38 38 0 1 1 -40 -70z" fill="#FFE9A8"/></svg>
      <div style="position:absolute;left:70px;top:210px;right:70px;bottom:90px;background:#FFFDF6;border-radius:18px"></div>
      ${t(70, 80, "Good Night Letter", { size: 38, color: "#FFE9A8", weight: 900 })}${t(72, 136, "별이 뜨는 밤, 마음을 적어요", { size: 19, color: "#cbd6ee", weight: 600 })}
      ${t(104, 238, "받는 사람 : ______________", { size: 20, color: "#47536f" })}${rules({ x: 104, y: 282, w: 586, rows: 17, color: "#dcd6c6" })}${from(104, 1000, 586, "#47536f")}${credit("#9fb0d4", 40)}`,
  },
  {
    id: "09-biker", name: "달려라 집배원", color: BRAND,
    html: () => `<div style="position:absolute;inset:0;background:#FFF8EE"></div>
      <div style="position:absolute;left:0;right:0;top:0;height:200px;background:${BRAND}"></div>
      ${t(60, 56, "오늘도 배달 중~", { size: 46, color: "#fff", weight: 900 })}${t(62, 124, "마음을 싣고 부릉부릉 달려가요", { size: 20, color: "#fff4e6", weight: 600 })}
      ${envelope(610, 50, 0.9, 12, "#fff", DEEP)}
      ${fields(80, 232, 634)}${rules({ x: 80, y: 290, w: 634, rows: 14, color: "#efd9bf" })}
      <div style="position:absolute;left:0;right:0;bottom:0;height:150px;background:#EADFD0"></div><div style="position:absolute;left:0;right:0;bottom:64px;height:6px;background:repeating-linear-gradient(90deg,#fff 0 34px,transparent 34px 60px)"></div>
      ${bike(430, 886, 0.82)}${from(80, 930, 340)}${credit("#a89a8a", 16)}`,
  },
  {
    id: "10-simple", name: "심플 오렌지", color: BRAND,
    html: () => `<div style="position:absolute;inset:0;background:#FFFFFF"></div>
      <div style="position:absolute;left:0;top:0;bottom:0;width:22px;background:${BRAND}"></div>
      ${t(70, 70, "Letter", { size: 52, color: BRAND, weight: 900 })}
      ${BARE ? "" : `<div style="position:absolute;left:70px;top:150px;width:300px;height:70px;border:2px solid ${BRAND};border-radius:12px"></div>${t(86, 142, "To.", { size: 16, color: DEEP })}
      <div style="position:absolute;left:394px;top:150px;width:300px;height:70px;border:2px solid #ddd;border-radius:12px"></div>${t(410, 142, "From.", { size: 16, color: "#999" })}`}
      ${t(560, 74, "20__ . __ . __", { size: 22, color: "#888", weight: 600 })}
      ${rules({ x: 70, y: 262, w: 624, rows: 18, color: "#ececec" })}${credit("#bbb", 36)}`,
  },
];
