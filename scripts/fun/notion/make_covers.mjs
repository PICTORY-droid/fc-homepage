// 노션 페이지 맨 위 배너(커버) 이미지를 public/notion/ 에 만듭니다 — FC 홈페이지와 같은 주황 색 체계.
// 사용: PW_PATH=<playwright 가 들어 있는 node_modules 경로> CHROMIUM_PATH=<크롬 실행 파일> node scripts/fun/notion/make_covers.mjs
// 크기 1500×600. 노션은 화면 폭에 따라 위아래를 잘라 보여 주므로 글은 가운데 띠(위아래 120px 안쪽)에만 둡니다.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = new URL("../../..", import.meta.url).pathname;
const OUT = path.join(ROOT, "public", "notion");
const img = (p) => pathToFileURL(path.join(ROOT, "public", "fun", p)).href;
const pad = (n) => String(n).padStart(2, "0");
const ppt = (item, n) => img(`pack/pptx/${item}pro/thumbs/${item}pro-${pad(n)}.jpg`);
const xls = (item, n) => img(`pack/xlsx/${item}/thumbs/${item}-${pad(n)}.jpg`);
const st = (season, n) => img(`stationery/thumbs/${season}-${pad(n)}.jpg`);

// 문구는 안내만 합니다(보험·상담·연락처 없음). 900종 = 엑셀 300 + PPT 600.
const covers = [
  { id: "home", tag: "무료 다운로드 · 회원가입 없이", h1: "무료 PPT·엑셀·워드 양식", em: "900종+", sub: "계절 감성 50가지 테마 · 받아서 바로 고쳐 쓰기", cards: [ppt("birthday", 1), ppt("talk", 26), ppt("wedding", 14)] },
  { id: "ppt", tag: "PPT 템플릿", h1: "사진만 넣으면 끝나는", em: "PPT 템플릿", sub: "발표 · 가족 소개 · 돌잔치 · 결혼식 · 카드뉴스", cards: [ppt("talk", 1), ppt("family", 14), ppt("birthday", 39)] },
  { id: "excel", tag: "엑셀 양식", h1: "입력하면 자동 계산되는", em: "엑셀 양식", sub: "가계부 · 용돈기입장 · 경조사비 장부 · 견적서 · 저축 플래너", cards: [xls("ledger", 1), xls("quote", 14), xls("saving", 26)], wide: true },
  { id: "word", tag: "워드 · 인쇄물", h1: "바로 출력해 쓰는", em: "워드·인쇄물", sub: "이력서 · 자기소개서 · 계절 편지지 · 명함", cards: [st("autumn", 1), st("spring", 1), st("winter", 1)], tall: true },
  { id: "season", tag: "계절별 모음", h1: "봄 · 여름 · 가을 · 겨울", em: "계절별 모음", sub: "지금 계절에 어울리는 분위기로 골라 보세요", cards: [ppt("birthday", 3), ppt("family", 16), ppt("wedding", 28), ppt("talk", 41)] },
  { id: "guide", tag: "사용법 가이드", h1: "처음이어도 쉬운", em: "사용법 가이드", sub: "사진 넣기 · 색과 글꼴 한 번에 바꾸기 · 엑셀 수식 고치기", cards: [ppt("family", 2), ppt("news", 3)] },
  { id: "request", tag: "새 양식 · 요청", h1: "필요한 양식, 말씀해 주세요", em: "이달의 양식", sub: "만들어 줬으면 하는 템플릿을 남겨 주세요", cards: [ppt("news", 14), ppt("news", 26), ppt("news", 39)] },
];

const html = (c) => {
  const n = c.cards.length;
  const w = c.wide ? 300 : c.tall ? 190 : 270;
  const h = c.wide ? 232 : c.tall ? 268 : 152;
  const rots = [-9, 3, 11, -4];
  const xs = [0, 150, 300, 430];
  const cardHtml = c.cards.map((u, k) => `<div class="card" style="left:${xs[k] * (n === 2 ? 1.6 : n === 4 ? 0.82 : 1)}px;top:${(k % 2) * 40 + 12}px;width:${w}px;height:${h}px;transform:rotate(${rots[k]}deg);z-index:${k};background-image:url('${u}')"></div>`).join("");
  return `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}body{width:1500px;height:600px;position:relative;overflow:hidden;font-family:"Noto Sans CJK KR","Noto Sans CJK JP","Malgun Gothic",sans-serif;color:#333;background:linear-gradient(135deg,#FFF6EE 0%,#FFE6D2 60%,#FFDAC1 100%)}
.c1{position:absolute;right:-120px;top:-160px;width:620px;height:620px;border-radius:50%;background:#FFDAC1;opacity:.75}
.c2{position:absolute;left:-90px;bottom:-190px;width:420px;height:420px;border-radius:50%;background:#FFCDA8;opacity:.55}
.c3{display:none}
.txt{position:absolute;left:96px;top:108px;width:760px}
.tag{display:inline-block;background:#fff;color:#C4540A;font-weight:800;font-size:30px;padding:10px 26px;border-radius:40px;box-shadow:0 2px 0 rgba(196,84,10,.18)}
h1{margin-top:22px;font-size:60px;line-height:1.18;font-weight:900;letter-spacing:-2.5px}
h1 em{font-style:normal;color:#FF883A}
.sub{margin-top:18px;font-size:28px;font-weight:600;color:#666;letter-spacing:-.8px}
.cards{position:absolute;left:880px;top:130px;width:560px;height:360px}
.card{position:absolute;border-radius:16px;background-size:cover;background-position:top;border:6px solid #fff;box-shadow:0 14px 28px rgba(150,70,10,.22)}
.chips{position:absolute;left:540px;top:110px;display:flex;gap:12px}
.chip{color:#fff;font-weight:900;font-size:26px;padding:9px 18px;border-radius:10px}
</style><div class="c1"></div><div class="c2"></div><div class="c3"></div>
<div class="txt"><span class="tag">${c.tag}</span><h1>${c.h1}<br><em>${c.em}</em></h1><p class="sub">${c.sub}</p></div>
${c.id === "home" ? `<div class="chips"><span class="chip" style="background:#1D7A46">XLSX</span><span class="chip" style="background:#D24726">PPT</span><span class="chip" style="background:#2B579A">DOCX</span></div>` : ""}
<div class="cards">${cardHtml}</div>`;
};

const { chromium } = await import(pathToFileURL(path.join(process.env.PW_PATH ?? "", "playwright/index.mjs")).href);
fs.mkdirSync(OUT, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cover-"));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox", "--allow-file-access-from-files"] });
for (const c of covers) {
  const page = await browser.newPage({ viewport: { width: 1500, height: 600 } });
  const f = path.join(tmp, `${c.id}.html`);
  fs.writeFileSync(f, html(c));
  await page.goto(pathToFileURL(f).href, { waitUntil: "load" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `cover-${c.id}.jpg`), type: "jpeg", quality: 88 });
  await page.close();
}
await browser.close();
console.log("노션 커버", covers.length, "장 →", OUT);
