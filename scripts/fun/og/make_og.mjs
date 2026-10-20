// 페이지별 공유 미리보기(OG) 이미지 1200×630 — public/og/fun/<키>.jpg
// 실행: PW_PATH=/home/claude/.npm-global/lib/node_modules CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/fun/og/make_og.mjs
// 키 규칙은 src/lib/seo/funMeta.ts 의 ogImagePath 와 같아야 합니다.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const OUT = path.join(ROOT, "public/og/fun");
const rd = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const pub = (p) => path.join(ROOT, "public", p);
const nn = (n) => String(n).padStart(2, "0");
const seasonSlug = { 봄: "spring", 여름: "summer", 가을: "autumn", 겨울: "winter" };

const stationery = rd("src/config/stationery.data.json");
const cards = rd("src/config/cards.data.json");
const pack = rd("src/config/pack.data.json");
const forms = fs.readFileSync(path.join(ROOT, "src/config/forms.ts"), "utf8");

const jobs = [];
const out = []; // { key, title, sub, thumbs: [절대경로], color }

const stSeason = { spring: ["봄 편지지", "#FF883A"], summer: ["여름 편지지", "#2FA8C9"], autumn: ["가을 편지지", "#C8742A"], winter: ["겨울 편지지", "#6B7FA8"], animal: ["동물 편지지", "#E58FD6"], place: ["장소 편지지", "#4FC3D9"], weather: ["날씨 편지지", "#6BB6FF"], coffee: ["커피 편지지", "#C79A7B"], window: ["창가 편지지", "#B79CFF"], garden: ["정원 편지지", "#5DAE6E"], culture: ["전통 편지지", "#C0392B"] };
out.push({ key: "stationery", title: "감성 편지지 980장", sub: "Word·PNG 무료 다운로드", thumbs: stationery.filter((s) => s.no === 1).map((s) => pub(`fun/stationery/thumbs/${s.id}.jpg`)).slice(0, 4), color: "#FF883A" });
for (const [k, [label, color]] of Object.entries(stSeason)) {
  out.push({ key: `stationery-${k}`, title: `${label} ${stationery.filter((s) => s.season === k).length}장`, sub: "Word·PNG 무료 다운로드", thumbs: stationery.filter((s) => s.season === k).slice(0, 4).map((s) => pub(`fun/stationery/thumbs/${s.id}.jpg`)), color });
}

for (const [ck, c] of Object.entries(cards)) {
  out.push({ key: `cards-${ck}`, title: `${c.label} 명함 템플릿`, sub: "PPT·SVG 무료 다운로드", thumbs: c.items.slice(0, 4).map((e) => pub(`fun/cards/${ck}/thumbs/${ck}-${nn(e.no)}.jpg`)), color: c.items[0]?.main ?? "#FF883A" });
}

// 엑셀·PPT: 항목별(전체) + 계절별
const items = { // 파일 키 → [그룹, 제목]
  "xlsx-ledger": ["excel", "가계부 엑셀"], "xlsx-policy": ["excel", "보험 증권 정리표 엑셀"], "xlsx-saving": ["excel", "저축 플래너 엑셀"], "xlsx-gift": ["excel", "경조사비 장부 엑셀"], "xlsx-allowance": ["excel", "용돈기입장 엑셀"], "xlsx-quote": ["excel", "견적서 엑셀"],
  "pptx-talk": ["ppt", "발표 템플릿 PPT"], "pptx-family": ["ppt", "가족 소개 PPT"], "pptx-birthday": ["ppt", "돌잔치 PPT"], "pptx-wedding": ["ppt", "결혼식 PPT"], "pptx-review": ["ppt", "보험 보장 점검 양식 PPT"], "pptx-news": ["ppt", "카드뉴스 PPT"],
  "pptx-talkpro": ["ppt-pro", "발표 PPT 프리미엄"], "pptx-familypro": ["ppt-pro", "가족 소개 PPT 프리미엄"], "pptx-birthdaypro": ["ppt-pro", "돌잔치 PPT 프리미엄"], "pptx-weddingpro": ["ppt-pro", "결혼식 PPT 프리미엄"], "pptx-reviewpro": ["ppt-pro", "보험 보장 점검 양식 PPT 프리미엄"], "pptx-newspro": ["ppt-pro", "카드뉴스 PPT 프리미엄"],
};
for (const [fk, [group, title]] of Object.entries(items)) {
  const [ext, key] = fk.split("-");
  const list = pack[fk] ?? [];
  const th = (e) => pub(`fun/pack/${ext}/${key}/thumbs/${key}-${nn(e.no)}.jpg`);
  out.push({ key: `${group}-${key}`, title, sub: "무료 다운로드", thumbs: list.slice(0, 4).map(th), color: list[0]?.main ?? "#FF883A" });
  for (const [sk, slug] of Object.entries(seasonSlug)) {
    const s = list.filter((e) => e.season === sk);
    out.push({ key: `${group}-${key}-${slug}`, title: `${sk} ${title}`, sub: "무료 다운로드", thumbs: s.slice(0, 4).map(th), color: s[0]?.main ?? "#FF883A" });
  }
}

// 이력서 포지션 (썸네일 없음 → 글자 중심)
for (const m of forms.matchAll(/id: "([\w-]+)", name: "([^"]+)"/g)) {
  out.push({ key: `forms-${m[1]}`, title: `${m[2]} 이력서·자기소개서`, sub: "Word 양식 20종 무료", thumbs: [], color: "#FF883A" });
}
out.push({ key: "forms", title: "직업별 이력서·자기소개서 600종", sub: "Word 양식 무료 다운로드", thumbs: [], color: "#FF883A" });
out.push({ key: "fun", title: "즐길거리", sub: "엑셀·PPT·편지지·명함 무료 양식", thumbs: [], color: "#FF883A" });

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const html = (o) => {
  const imgs = o.thumbs.filter((p) => fs.existsSync(p)).map((p, i) => `<img src="data:image/jpeg;base64,${fs.readFileSync(p).toString('base64')}" style="transform:rotate(${[-4, 2, -2, 4][i % 4]}deg)">`).join("");
  return `<html><body style="margin:0;width:1200px;height:630px;background:#FFF6EE;font-family:'Noto Sans CJK KR','Noto Sans KR',sans-serif;position:relative;overflow:hidden">
  <div style="position:absolute;left:0;top:0;width:18px;height:630px;background:${o.color}"></div>
  <div style="position:absolute;left:70px;top:90px;width:${imgs ? 560 : 1000}px">
    <div style="font-size:26px;font-weight:700;color:#B55A12;letter-spacing:1px">우체국보험 · 즐길거리</div>
    <div style="margin-top:22px;font-size:${imgs ? 66 : 74}px;font-weight:800;line-height:1.2;color:#2A1B10;word-break:keep-all">${esc(o.title)}</div>
    <div style="margin-top:26px;font-size:32px;color:#6B5645">${esc(o.sub)}</div>
  </div>
  <div style="position:absolute;right:50px;top:70px;width:520px;height:490px;display:flex;flex-wrap:wrap;gap:18px;justify-content:center;align-content:center">${imgs}</div>
  <style>img{box-sizing:border-box;width:240px;height:${o.thumbs.length > 2 ? 215 : 330}px;object-fit:cover;object-position:top;border-radius:10px;box-shadow:0 8px 24px rgba(60,30,10,.22);border:6px solid #fff;background:#fff}</style>
  </body></html>`;
};

const { chromium } = await import(pathToFileURL(path.join(process.env.PW_PATH ?? "", "playwright/index.mjs")).href);
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
let n = 0;
for (const o of out) {
  if (process.env.OG_ONLY && !o.key.startsWith(process.env.OG_ONLY)) continue; // 예) OG_ONLY=ppt-pro 이면 그 묶음만 다시 만듭니다
  await page.setContent(html(o), { waitUntil: "load" });
  await page.screenshot({ path: path.join(OUT, `${o.key}.jpg`), type: "jpeg", quality: 82 });
  n++;
}
await browser.close();
console.log(`OG 이미지 ${n}장 → ${OUT}`);
