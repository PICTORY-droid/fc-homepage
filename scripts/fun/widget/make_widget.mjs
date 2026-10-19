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
  { id: "post", h: 260, bg: "#FFE9D6", fg: "#2B2B2B", sub: "우체국보험 FC 안내", title: ["우체국보험", "궁금하신가요?"], body: "충분히 비교하고 결정하세요", foot: "안내 사이트 가기", icon: "char" },
  { id: "forms", h: 260, bg: "#FF883A", fg: "#2B2B2B", sub: "우체국보험 FC 안내", title: ["무료 템플릿", "자료실"], body: "PPT · 엑셀 · 워드 양식", foot: "필요한 양식 받기", icon: "doc" },
];

const icons = {
  // 사이트 안내 도우미(챗봇)와 같은 캐릭터 — src/components/chatbot/ChatCharacter.tsx 의 그림을 그대로 옮겼습니다
  char: `<svg viewBox="0 0 200 180" width="92" height="83"><rect x="35" y="55" width="130" height="100" rx="18" fill="#fff" stroke="#E8591A" stroke-width="5"/><path d="M45 52 Q100 14 155 52 Z" fill="#E8591A"/><rect x="40" y="48" width="120" height="9" rx="4" fill="#C4540A"/><circle cx="100" cy="36" r="9" fill="#FFDAC1" stroke="#C4540A" stroke-width="3"/><path d="M40 150 L72 128 M160 150 L128 128" stroke="#E8591A" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="78" cy="100" r="5.5" fill="#333"/><circle cx="122" cy="100" r="5.5" fill="#333"/><path d="M90 112 Q100 122 110 112" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/><circle cx="64" cy="112" r="7" fill="#FF883A" opacity=".5"/><circle cx="136" cy="112" r="7" fill="#FF883A" opacity=".5"/></svg>`,
  doc: `<svg viewBox="0 0 64 64" width="72" height="72"><rect x="14" y="6" width="36" height="48" rx="5" fill="#fff"/><rect x="21" y="16" width="22" height="4" rx="2" fill="#FF883A"/><rect x="21" y="26" width="22" height="4" rx="2" fill="#F2B98A"/><rect x="21" y="36" width="14" height="4" rx="2" fill="#F2B98A"/></svg>`,
};

const html = (b) => `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}body{width:170px;height:${b.h}px;font-family:"Noto Sans CJK KR","Noto Sans CJK JP","Malgun Gothic",sans-serif}
.c{width:170px;height:${b.h}px;border-radius:14px;background:${b.bg};color:${b.fg};display:flex;flex-direction:column;align-items:center;padding:16px 10px 12px;text-align:center}
.s{font-size:11px;opacity:.9;letter-spacing:-.2px}.t{margin-top:8px;font-size:23px;font-weight:900;line-height:1.2;letter-spacing:-1px}
.i{margin:12px 0 8px}.b{font-size:11.5px;opacity:.95}
.f{margin-top:auto;width:100%;background:#fff;border:1.5px solid #FF883A;color:#2B2B2B;border-radius:10px;padding:8px 0;font-size:13px;font-weight:800}
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
