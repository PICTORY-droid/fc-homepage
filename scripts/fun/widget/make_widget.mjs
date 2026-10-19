// 네이버 블로그 '위젯 직접등록'용 배너 이미지(가로 170px)를 public/widget/ 에 만듭니다.
// 사용: PW_PATH=<playwright 가 들어 있는 node_modules 경로> CHROMIUM_PATH=<크롬 실행 파일> node scripts/fun/widget/make_widget.mjs
// 이미지는 2배 크기(340px)로 만들어, 화면에서 width=170 으로 보여 선명하게 나옵니다.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = new URL("../../..", import.meta.url).pathname;
const OUT = path.join(ROOT, "public", "widget");

// 문구는 안내만 합니다(가입 권유·보장 단정 없음). 주소는 배너를 눌렀을 때 열리는 곳이 아니라 화면 표시용이에요.
const banners = [
  { id: "forms", h: 260, bg: "#FF883A", fg: "#2B2B2B", sub: "우체국보험 FC 안내", title: ["무료 양식", "자료실"], body: "PPT · 엑셀 · 워드", foot: "필요한 양식 받아가기", icon: "doc" },
  { id: "consult", h: 260, bg: "#2F5D8C", fg: "#FFFFFF", sub: "우체국보험 FC 안내", title: ["보장 점검", "상담 안내"], body: "충분히 비교하고 결정하세요", foot: "상담 안내 보기", icon: "chat" },
  { id: "tools", h: 260, bg: "#2E7D5B", fg: "#FFFFFF", sub: "우체국보험 FC 안내", title: ["보험 계산", "도구 모음"], body: "내 상황에 맞춰 살펴보기", foot: "도구 열어보기", icon: "calc" },
];

const icons = {
  doc: `<svg viewBox="0 0 64 64" width="64" height="64"><rect x="14" y="6" width="36" height="48" rx="5" fill="#fff"/><rect x="21" y="16" width="22" height="4" rx="2" fill="#FF883A"/><rect x="21" y="26" width="22" height="4" rx="2" fill="#F2B98A"/><rect x="21" y="36" width="14" height="4" rx="2" fill="#F2B98A"/></svg>`,
  chat: `<svg viewBox="0 0 64 64" width="64" height="64"><path d="M10 12h44a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H30l-12 10V46h-8a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z" fill="#fff"/><circle cx="22" cy="29" r="3.5" fill="#2F5D8C"/><circle cx="32" cy="29" r="3.5" fill="#2F5D8C"/><circle cx="42" cy="29" r="3.5" fill="#2F5D8C"/></svg>`,
  calc: `<svg viewBox="0 0 64 64" width="64" height="64"><rect x="12" y="6" width="40" height="52" rx="6" fill="#fff"/><rect x="18" y="12" width="28" height="12" rx="3" fill="#2E7D5B"/><g fill="#A9D3BF"><circle cx="24" cy="34" r="4"/><circle cx="32" cy="34" r="4"/><circle cx="40" cy="34" r="4"/><circle cx="24" cy="44" r="4"/><circle cx="32" cy="44" r="4"/><circle cx="40" cy="44" r="4"/></g></svg>`,
};

const html = (b) => `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}body{width:170px;height:${b.h}px;font-family:"Noto Sans CJK KR","Noto Sans CJK JP","Malgun Gothic",sans-serif}
.c{width:170px;height:${b.h}px;border-radius:14px;background:${b.bg};color:${b.fg};display:flex;flex-direction:column;align-items:center;padding:16px 10px 12px;text-align:center}
.s{font-size:11px;opacity:.9;letter-spacing:-.2px}.t{margin-top:8px;font-size:23px;font-weight:900;line-height:1.2;letter-spacing:-1px}
.i{margin:12px 0 8px}.b{font-size:11.5px;opacity:.95}
.f{margin-top:auto;width:100%;background:#fff;color:#2B2B2B;border-radius:10px;padding:8px 0;font-size:13px;font-weight:800}
</style><div class="c"><div class="s">${b.sub}</div><div class="t">${b.title.join("<br>")}</div><div class="i">${icons[b.icon]}</div><div class="b">${b.body}</div><div class="f">${b.foot}</div></div>`;

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
