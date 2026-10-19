// 네이버 블로그 '위젯 직접등록'용 배너 이미지(가로 170px)를 public/widget/ 에 만듭니다.
// 사용: PW_PATH=<playwright 가 들어 있는 node_modules 경로> CHROMIUM_PATH=<크롬 실행 파일> node scripts/fun/widget/make_widget.mjs
// 이미지는 2배 크기(340px)로 만들어, 화면에서 width=170 으로 보여 선명하게 나옵니다.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = new URL("../../..", import.meta.url).pathname;
const OUT = path.join(ROOT, "public", "widget");

// 문구는 안내만 합니다(가입 권유·보장 단정 없음). 숫자는 실제 사이트에 있는 자료 수(엑셀 300 + PPT 600 = 900)만 씁니다.
const CHECK = `<svg width="13" height="13" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="currentColor"/><path d="M4.5 8.2l2.4 2.4 4.6-4.9" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const char = `<svg viewBox="0 0 200 180" width="64" height="58"><rect x="35" y="55" width="130" height="100" rx="18" fill="#fff" stroke="#E8591A" stroke-width="5"/><path d="M45 52 Q100 14 155 52 Z" fill="#E8591A"/><rect x="40" y="48" width="120" height="9" rx="4" fill="#C4540A"/><circle cx="100" cy="36" r="9" fill="#FFDAC1" stroke="#C4540A" stroke-width="3"/><path d="M40 150 L72 128 M160 150 L128 128" stroke="#E8591A" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="78" cy="100" r="5.5" fill="#333"/><circle cx="122" cy="100" r="5.5" fill="#333"/><path d="M90 112 Q100 122 110 112" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/><circle cx="64" cy="112" r="7" fill="#FF883A" opacity=".5"/><circle cx="136" cy="112" r="7" fill="#FF883A" opacity=".5"/></svg>`;

const chips = `<div style="display:flex;gap:5px;justify-content:center">${[["XLSX", "#1D7A46"], ["PPT", "#D24726"], ["DOCX", "#2B579A"]].map(([t, c]) => `<span style="background:${c};color:#fff;font-size:11px;font-weight:900;padding:6px 7px;border-radius:6px">${t}</span>`).join("")}</div>`;

const banners = [
  { id: "post", h: 305, tag: "우체국보험 FC 안내", head: `보험, 가입 전에<br><em>꼭 확인</em>하세요`, list: ["상품설명서·약관 먼저 확인", "충분히 비교한 뒤 결정", "상담만으론 가입 안 돼요"], cta: "상담 안내 보기", art: char, bg: "#FFF4EA", accent: "#E8591A" },
  { id: "forms", h: 305, tag: "무료 다운로드 · 가입 없이", head: `엑셀·PPT 양식<br><em>900종+</em> 무료`, list: ["가계부·견적서·장부 엑셀", "발표·돌잔치·결혼식 PPT", "받아서 바로 고쳐 쓰기"], cta: "자료실 바로가기", art: chips, bg: "#FFF4EA", accent: "#E8591A" },
];

const html = (b) => `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}body{width:170px;height:${b.h}px;font-family:"Noto Sans CJK KR","Noto Sans CJK JP","Malgun Gothic",sans-serif;color:#2B2B2B}
.c{position:relative;width:170px;height:${b.h}px;border-radius:12px;background:${b.bg};border:2px solid ${b.accent};overflow:hidden;display:flex;flex-direction:column}
.top{background:${b.accent};color:#fff;font-size:11px;font-weight:700;text-align:center;padding:7px 0;letter-spacing:-.3px}
.in{padding:12px 12px 0;flex:1;display:flex;flex-direction:column}
.h{font-size:20px;font-weight:900;line-height:1.28;letter-spacing:-1px}.h em{font-style:normal;color:${b.accent}}
.art{display:flex;justify-content:center;margin:8px 0 0}
ul{list-style:none;padding:0;margin:11px 0 0;display:flex;flex-direction:column;gap:7px}
li{display:flex;gap:6px;align-items:flex-start;font-size:11.5px;line-height:1.3;letter-spacing:-.4px;color:#3a3a3a}li svg{flex:none;margin-top:1px;color:${b.accent}}
.cta{margin:auto 10px 12px;background:${b.accent};color:#fff;text-align:center;border-radius:9px;padding:10px 0;font-size:14px;font-weight:900;letter-spacing:-.4px}
</style><div class="c"><div class="top">${b.tag}</div><div class="in"><div class="h">${b.head}</div>${b.art ? `<div class="art">${b.art}</div>` : ""}<ul>${b.list.map((t) => `<li>${CHECK}<span>${t}</span></li>`).join("")}</ul></div><div class="cta">${b.cta} ›</div></div>`;

const { chromium } = await import(pathToFileURL(path.join(process.env.PW_PATH ?? "", "playwright/index.mjs")).href);
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] });
for (const b of banners) {
  const page = await browser.newPage({ viewport: { width: 170, height: b.h }, deviceScaleFactor: 2 });
  await page.setContent(html(b), { waitUntil: "load" });
  await page.screenshot({ path: path.join(OUT, `${b.id}.png`), omitBackground: true, clip: { x: 0, y: 0, width: 170, height: b.h } });
  await page.close();
}
await browser.close();
console.log("위젯 배너", banners.length, "장 →", OUT);
