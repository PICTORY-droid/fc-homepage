// 콘텐츠 가드 — 빌드 전에 자동 실행됩니다. (npm run check)
//  1) 항상 검사: 금지 표현, 배너 상품 중복, 배너 개수(페이지당 1개)
//  2) REQUIRE_REVIEW=1 일 때 추가 검사: 심의번호/프로필/e마크 확인/개인정보 항목 확정
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const FORBIDDEN = ["최고", "1위", "전액", "100%", "무조건", "확정수익", "원금보장", "원금 보장", "수익률", "업계 최", "국가가 보장"];
const errors = [];
const warns = [];

const read = (p) => readFileSync(join(ROOT, p), "utf8");
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");

function walk(dir) {
  return readdirSync(join(ROOT, dir)).flatMap((n) => {
    const rel = join(dir, n);
    return statSync(join(ROOT, rel)).isDirectory() ? walk(rel) : [rel];
  });
}

// 1-a 금지 표현 (문구가 들어있는 config / app / components)
for (const f of [...walk("src/config"), ...walk("src/app"), ...walk("src/components")].filter((f) => /\.tsx?$/.test(f))) {
  const text = stripComments(read(f));
  for (const w of FORBIDDEN) if (text.includes(w)) errors.push(`[금지표현] ${f} 에 "${w}" 포함 — 광고 심의/오인 위험`);
}

// 1-b 배너 규칙
const productsSrc = stripComments(read("src/config/products.ts"));
const banners = stripComments(read("src/config/banners.ts"));
const block = banners.slice(banners.indexOf("export const banners"));
const products = [...block.matchAll(/product:\s*"([^"]+)"/g)].map((m) => m[1]);
const keys = [...block.matchAll(/^\s{2}(\w+):\s*\{/gm)].map((m) => m[1]);
if (products.length !== keys.length) errors.push(`[배너] 페이지 ${keys.length}개에 상품 ${products.length}개 — 페이지당 상품 1개여야 함`);
const dup = products.filter((p, i) => products.indexOf(p) !== i);
if (dup.length) errors.push(`[배너] 상품 중복: ${[...new Set(dup)].join(", ")} — 페이지마다 다른 상품이어야 함`);

// 2 운영 빌드 전용 검사
const strict = process.env.REQUIRE_REVIEW === "1";
const site = stripComments(read("src/config/site.ts"));
const checks = [
  [/reviewNo:\s*""/.test(site), "광고 심의번호(site.reviewNo)가 비어 있음"],
  [/profileConfirmed:\s*false/.test(site), "프로필 미확정(site.profileConfirmed=false)"],
  [/retentionMonths:\s*null/.test(site), "개인정보 보유 기간(site.privacy.retentionMonths) 미확정"],
  [/contactEmail:\s*""/.test(site), "개인정보 문의 이메일(site.privacy.contactEmail) 비어 있음"],
  [/eMarkVerified:\s*false/.test(productsSrc), "e마크(온라인 전용) 상품이 섞여 있지 않은지 확인 안 됨 (products.ts productsMeta.eMarkVerified)"],
  [/eMarkChecked:\s*false/.test(banners), "e마크(온라인 전용) 확인이 안 된 배너 상품이 있음 (banners.ts eMarkChecked)"],
];
for (const [bad, msg] of checks) if (bad) (strict ? errors : warns).push(`[운영전] ${msg}`);

for (const w of warns) console.warn("⚠", w);
if (errors.length) {
  console.error("\n✖ 콘텐츠 검사 실패");
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}
console.log(`✔ 콘텐츠 검사 통과 (배너 ${keys.length}개, 상품 ${products.length}종${strict ? ", 운영 모드" : ""})`);
