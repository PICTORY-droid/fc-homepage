// 우체국 감성 소품 12종 — 편지지마다 다른 소품을 골라 씁니다. (직접 그린 그림이며 공식 로고는 없습니다)
import { circle, rect, path, g, text, star, ellipse } from "./kit.mjs";

/** 톱니 가장자리 우표 */
const stamp = (x, y, s, p, { rot = 5, value = "100", inner = "" } = {}) => g(`
  <rect width="110" height="136" fill="${p.a}"/>${inner || `${circle(55, 54, 24, p.paper, 'opacity=".9"')}${path("M20 112 Q55 70 90 112Z", p.paper, "none", 0, 'opacity=".45"')}`}
  <rect width="110" height="136" fill="none" stroke="${p.paper}" stroke-width="9" stroke-dasharray="0 11" stroke-linecap="round"/>`, x, y, s, rot);

const postmark = () => ""; // 도장(소인)은 쓰지 않는다

const envelope = (x, y, s, p, { rot = 8 } = {}) => g(`<rect x="3" y="3" width="104" height="70" rx="8" fill="${p.paper}" stroke="${p.d}" stroke-width="4"/><path d="M6 8 L55 46 L104 8" fill="none" stroke="${p.d}" stroke-width="4" stroke-linejoin="round"/>${circle(55, 40, 7, p.c)}`, x, y, s, rot);

const airmail = (x, y, s, p, { w = 300 } = {}) => g(`<defs><clipPath id="am${Math.round(x)}${Math.round(y)}"><rect width="${w}" height="16" rx="3"/></clipPath></defs><g clip-path="url(#am${Math.round(x)}${Math.round(y)})"><rect width="${w}" height="16" fill="${p.paper}"/>${Array.from({ length: Math.ceil(w / 22) + 2 }, (_, i) => path(`M${i * 22 - 8} 16 l12 -16 h8 l-12 16z`, i % 2 ? p.a : p.d)).join("")}</g>`, x, y, s);

const mailbox = (x, y, s, p) => g(`<rect x="86" y="150" width="18" height="100" fill="#8a6a4a"/><rect x="60" y="244" width="70" height="10" rx="5" fill="#6d5036"/>
  <path d="M20 150 V86 a65 65 0 0 1 130 0 V150 Z" fill="${p.a}"/><rect x="20" y="124" width="130" height="30" rx="6" fill="${p.d}"/><rect x="48" y="104" width="74" height="9" rx="4.5" fill="${p.paper}" opacity=".85"/>
  <rect x="150" y="62" width="8" height="64" fill="#8a6a4a"/><path d="M158 62 h30 v22 h-30z" fill="${p.c}"/>`, x, y, s);

const parcelTag = (x, y, s, p, { label = "" } = {}) => g(`<path d="M0 20 L24 0 H110 a10 10 0 0 1 10 10 V70 a10 10 0 0 1 -10 10 H24 L0 60Z" fill="${p.paper}" stroke="${p.d}" stroke-width="3"/>${circle(22, 30, 5, p.d, 'opacity=".5"')}<path d="M22 30 Q-20 10 -34 40" fill="none" stroke="${p.d}" stroke-width="3"/>${text(66, 49, label, { size: 20, fill: p.d, weight: 900, anchor: "middle" })}`, x, y, s, -8);

const plane = (x, y, s, p) => g(`<path d="M0 40 L120 0 L84 90 L58 56 Z" fill="${p.paper}" stroke="${p.d}" stroke-width="4" stroke-linejoin="round"/><path d="M58 56 L120 0" stroke="${p.d}" stroke-width="3"/><path d="M58 56 L56 82 L72 66" fill="${p.c}" stroke="${p.d}" stroke-width="3" stroke-linejoin="round"/><path d="M-10 70 q-30 6 -50 -14" fill="none" stroke="${p.d}" stroke-width="3" stroke-dasharray="3 7" stroke-linecap="round"/>`, x, y, s, -6);

const zip = (x, y, s, p) => g(Array.from({ length: 5 }, (_, i) => rect(i * 34, 0, 28, 36, "none", 3, `stroke="${p.a}" stroke-width="3"`)).join("") + text(0, -8, "우편번호", { size: 12, fill: p.d, weight: 700 }), x, y, s);

const wax = (x, y, s, p) => g(`<path d="M50 4 q18 -6 30 8 q16 4 10 22 q12 14 -2 28 q2 16 -18 18 q-12 14 -28 2 q-18 4 -22 -14 q-14 -12 -2 -26 q-6 -18 12 -24 q8 -14 20 -14z" fill="${p.a}"/>${circle(50, 46, 24, "none", `stroke="${p.paper}" stroke-width="3" opacity=".6"`)}${star(50, 46, 12, p.paper, 0.8)}`, x, y, s);

const bike = (x, y, s, p) => g(`<g fill="#3d3d3d"><circle cx="40" cy="78" r="18"/><circle cx="130" cy="78" r="18"/></g><g fill="#fff"><circle cx="40" cy="78" r="7"/><circle cx="130" cy="78" r="7"/></g>
  <path d="M40 78 L66 50 H112 L130 78" fill="none" stroke="${p.d}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="2" y="28" width="52" height="36" rx="6" fill="${p.a}"/><rect x="8" y="34" width="40" height="24" rx="4" fill="${p.paper}"/><path d="M9 35 L28 48 L47 35" fill="none" stroke="${p.a}" stroke-width="3"/>
  ${circle(92, 24, 12, "#FFD9B8")}<path d="M78 22 Q92 4 106 22Z" fill="${p.d}"/><path d="M84 38 Q86 56 104 56 L118 50 L120 40Z" fill="${p.a}"/>`, x, y, s);

const ticket = (x, y, s, p, { label = "TICKET" } = {}) => g(`<path d="M0 8 a8 8 0 0 1 8 -8 H122 a8 8 0 0 1 8 8 v16 a10 10 0 0 0 0 20 v16 a8 8 0 0 1 -8 8 H8 a8 8 0 0 1 -8 -8 v-16 a10 10 0 0 0 0 -20Z" fill="${p.paper}" stroke="${p.d}" stroke-width="3"/><path d="M92 6 v60" stroke="${p.d}" stroke-width="2" stroke-dasharray="4 5"/>${text(44, 40, label, { size: 16, fill: p.d, weight: 900, anchor: "middle", spacing: 1 })}${star(111, 36, 9, p.c)}`, x, y, s, 4);

const sealTape = (x, y, s, p, { w = 220 } = {}) => g(`<rect width="${w}" height="26" fill="${p.c}" opacity=".85"/>${Array.from({ length: Math.floor(w / 36) }, (_, i) => text(10 + i * 36, 19, "♥", { size: 14, fill: p.paper, weight: 900 })).join("")}<path d="M0 0 l-6 4 l6 4 l-6 4 l6 4 l-6 5 l6 5 M${w} 0 l6 4 l-6 4 l6 4 l-6 4 l6 5 l-6 5" fill="none" stroke="${p.c}" stroke-width="2"/>`, x, y, s, -2);

const scale = (x, y, s, p) => g(`<rect width="110" height="76" rx="8" fill="${p.paper}" stroke="${p.d}" stroke-width="3"/><path d="M14 54 h82 M14 38 h56" stroke="${p.a}" stroke-width="4" stroke-linecap="round"/>${text(14, 26, "항공 · 소포", { size: 13, fill: p.d, weight: 800 })}${circle(90, 22, 8, p.c)}`, x, y, s, -3);

const KINDS = { stamp, postmark, envelope, airmail, mailbox, parcelTag, plane, zip, wax, bike, ticket, sealTape, scale };
export const postalKinds = Object.keys(KINDS);
export const postal = (kind, ...a) => KINDS[kind](...a);
