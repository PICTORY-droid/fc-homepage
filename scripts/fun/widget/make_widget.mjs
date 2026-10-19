// 네이버 블로그 '위젯 직접등록'용 배너 이미지(가로 170px, 캐릭터 모양)를 public/widget/ 에 만듭니다.
// 사용: PW_PATH=<playwright 가 들어 있는 node_modules 경로> CHROMIUM_PATH=<크롬 실행 파일> node scripts/fun/widget/make_widget.mjs
// 이미지는 2배 크기(340px)로 만들어, 화면에서 width=170 으로 보여 선명하게 나옵니다.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = new URL("../../..", import.meta.url).pathname;
const OUT = path.join(ROOT, "public", "widget");

// 배너 자체가 캐릭터 모양입니다(배경은 투명). 직접 그린 오리지널 — 사이트 안내 도우미(편지봉투)와 같은 식구예요.
// 문구는 안내만 합니다(가입 권유·보장 단정 없음). 숫자(900종)는 실제 사이트의 엑셀 300 + PPT 600 입니다.
const H = 345;
const eyes = (y) => `<circle cx="62" cy="${y}" r="6" fill="#333"/><circle cx="108" cy="${y}" r="6" fill="#333"/><path d="M76 ${y + 14} Q85 ${y + 24} 94 ${y + 14}" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/><circle cx="48" cy="${y + 13}" r="7.5" fill="#FF883A" opacity=".45"/><circle cx="122" cy="${y + 13}" r="7.5" fill="#FF883A" opacity=".45"/>`;
const feet = `<ellipse cx="58" cy="${H - 12}" rx="17" ry="9" fill="#C4540A"/><ellipse cx="112" cy="${H - 12}" rx="17" ry="9" fill="#C4540A"/>`;
const txt = (top, size, color, weight, html, extra = "") => `<div style="position:absolute;left:14px;width:142px;top:${top}px;text-align:center;font-size:${size}px;font-weight:${weight};color:${color};line-height:1.25;letter-spacing:-.6px;${extra}">${html}</div>`;
const cta = (top, label, bg, fg) => `<div style="position:absolute;left:24px;width:122px;top:${top}px;text-align:center;background:${bg};color:${fg};border-radius:20px;padding:7px 0;font-size:14px;font-weight:900;letter-spacing:-.4px;box-shadow:0 2px 0 rgba(0,0,0,.15)">${label} ›</div>`;

const banners = [
  { // 우체국보험 — 집배원 모자를 쓴 편지봉투 캐릭터
    id: "post",
    svg: `${feet}
      <ellipse cx="10" cy="215" rx="8" ry="12" fill="#fff" stroke="#E8591A" stroke-width="4"/><ellipse cx="160" cy="215" rx="8" ry="12" fill="#fff" stroke="#E8591A" stroke-width="4"/>
      <rect x="10" y="72" width="150" height="250" rx="24" fill="#fff" stroke="#E8591A" stroke-width="5"/>
      <path d="M14 96 Q85 176 156 96 L156 82 Q154 76 146 76 L24 76 Q16 76 14 82 Z" fill="#FFE9D6"/>
      <path d="M14 96 Q85 176 156 96" fill="none" stroke="#E8591A" stroke-width="4"/>
      ${eyes(112)}
      <path d="M24 76 Q85 -6 146 76 Z" fill="#E8591A"/><rect x="20" y="68" width="130" height="13" rx="6" fill="#C4540A"/><circle cx="85" cy="32" r="9" fill="#FFDAC1" stroke="#C4540A" stroke-width="3"/>
      <g transform="rotate(12 146 74)"><circle cx="146" cy="74" r="25" fill="#FFD84D" stroke="#E8591A" stroke-width="3"/><text x="146" y="70" text-anchor="middle" font-size="10" font-weight="900" fill="#C4540A">0원</text><text x="146" y="88" text-anchor="middle" font-size="17" font-weight="900" fill="#C4540A">무료</text></g>`,
    html: `${txt(166, 11.5, "#C4540A", 800, "우체국보험 FC 안내")}${txt(184, 18, "#2B2B2B", 900, "내 보험 한눈에")}${txt(207, 24, "#E8591A", 900, "증권 정리표")}${txt(243, 11.5, "#555", 600, "가입한 보험 한 장에 정리<br>월 보험료·만기 자동 계산")}${cta(280, "무료로 받기", "#E8591A", "#fff")}`,
  },
  { // 자료실 — 서류가 쏙 올라온 폴더 캐릭터
    id: "forms",
    svg: `${feet}
      <g transform="rotate(-9 40 80)"><rect x="18" y="26" width="42" height="80" rx="5" fill="#1D7A46"/><text x="39" y="46" text-anchor="middle" font-size="11" font-weight="900" fill="#fff">XLSX</text></g>
      <g transform="rotate(9 130 80)"><rect x="110" y="26" width="42" height="80" rx="5" fill="#2B579A"/><text x="131" y="46" text-anchor="middle" font-size="10.5" font-weight="900" fill="#fff">DOCX</text></g>
      <rect x="64" y="12" width="44" height="90" rx="5" fill="#D24726"/><text x="86" y="32" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">PPT</text>
      <path d="M10 112 Q10 96 26 96 L66 96 Q74 96 78 104 L84 112 L144 112 Q160 112 160 128 L160 302 Q160 322 140 322 L30 322 Q10 322 10 302 Z" fill="#FF883A" stroke="#C4540A" stroke-width="5"/>
      <ellipse cx="10" cy="215" rx="8" ry="12" fill="#FFB27A" stroke="#C4540A" stroke-width="4"/><ellipse cx="160" cy="215" rx="8" ry="12" fill="#FFB27A" stroke="#C4540A" stroke-width="4"/>
      ${eyes(128)}`,
    html: `${txt(166, 11.5, "#4a2a10", 800, "우체국보험 FC 안내")}${txt(184, 18, "#2B2B2B", 900, "엑셀·PPT 양식")}${txt(207, 26, "#fff", 900, "900종+ 무료", "text-shadow:0 2px 0 #C4540A")}${txt(246, 11.5, "#4a2a10", 700, "회원가입 없이 다운로드<br>받아서 바로 고쳐 쓰기")}${cta(282, "자료실 가기", "#fff", "#C4540A")}`,
  },
];

const html = (b) => `<!doctype html><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box}body{width:170px;height:${H}px;position:relative;background:transparent;font-family:"Noto Sans CJK KR","Noto Sans CJK JP","Malgun Gothic",sans-serif}</style><svg width="170" height="${H}" viewBox="0 0 170 ${H}" style="position:absolute;left:0;top:0;font-family:inherit">${b.svg}</svg>${b.html}`;

const { chromium } = await import(pathToFileURL(path.join(process.env.PW_PATH ?? "", "playwright/index.mjs")).href);
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] });
for (const b of banners) {
  const page = await browser.newPage({ viewport: { width: 170, height: H }, deviceScaleFactor: 2 });
  await page.setContent(html(b), { waitUntil: "load" });
  await page.screenshot({ path: path.join(OUT, `${b.id}.png`), omitBackground: true, clip: { x: 0, y: 0, width: 170, height: H } });
  await page.close();
}
await browser.close();
console.log("위젯 배너", banners.length, "장 →", OUT);
