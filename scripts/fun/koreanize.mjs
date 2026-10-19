// 내려받는 파일의 '실제 파일 이름'을 한글로 바꿉니다(엑셀·PPT·Word·편지지).
// download="…" 속성을 무시하는 브라우저(카카오톡 인앱 등)에서도 한글 이름으로 저장되게 하려는 것이에요.
// 생성 스크립트가 영문 이름으로 파일을 새로 만들면, 그 뒤에 한 번 실행하세요: node --no-warnings --experimental-strip-types scripts/fun/koreanize.mjs
// 이미 바뀐 파일은 건드리지 않으므로 여러 번 실행해도 안전합니다. (이름 규칙은 src/config/pack.ts · forms.ts · stationery.ts 의 *DownloadName 과 같아야 해요)
import { existsSync, readFileSync, renameSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../..", import.meta.url).pathname;
const pub = (...p) => join(ROOT, "public", ...p);
const nn = (n) => String(n).padStart(2, "0");
const clean = (s) => s.replace(/[\\/:*?"<>|\s]+/g, "");
let moved = 0;
const mv = (a, b) => { if (existsSync(a) && !existsSync(b)) { renameSync(a, b); moved++; } };

// 1) 엑셀·PPT 꾸러미
const LABEL = { ledger: "가계부", policy: "보험증권정리표", saving: "저축플래너", gift: "경조사비장부", allowance: "용돈기입장", quote: "견적서",
  talk: "발표템플릿", family: "가족소개", birthday: "돌잔치", wedding: "결혼식", review: "보장점검양식", news: "카드뉴스",
  talkpro: "발표템플릿프리미엄", familypro: "가족소개프리미엄", birthdaypro: "돌잔치프리미엄", weddingpro: "결혼식프리미엄", reviewpro: "보장점검양식프리미엄", newspro: "카드뉴스프리미엄" };
const pack = JSON.parse(readFileSync(join(ROOT, "src/config/pack.data.json"), "utf8"));
for (const [k, list] of Object.entries(pack)) {
  const [ext, item] = k.split("-");
  for (const e of list) mv(pub("fun/pack", ext, item, `${item}-${nn(e.no)}.${ext}`), pub("fun/pack", ext, item, `${LABEL[item]}_${nn(e.no)}_${clean(e.flavor)}_${clean(e.name)}.${ext}`));
}

// 2) 이력서·자기소개서 Word
const f = await import(join(ROOT, "src/config/forms.ts"));
for (const p of f.allPositions) for (const k of ["resume", "cover"]) for (const v of f.variants) mv(pub("fun/forms", `${k}-${p.id}-${v}.docx`), pub("fun/forms", f.formDownloadName(p, k, v)));

// 3) 편지지
const SEASON = { spring: "봄", summer: "여름", autumn: "가을", winter: "겨울" };
for (const s of JSON.parse(readFileSync(join(ROOT, "src/config/stationery.data.json"), "utf8")))
  for (const ext of ["docx", "png"]) mv(pub("fun/stationery", `${s.id}.${ext}`), pub("fun/stationery", `편지지_${SEASON[s.season]}${nn(s.no)}_${s.name.replace(/\s+/g, "")}.${ext}`));

console.log("이름을 바꾼 파일:", moved);
