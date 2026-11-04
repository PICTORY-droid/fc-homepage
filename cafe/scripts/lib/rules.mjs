// 네이버 카페 하네스 규칙 — 모두 순수 함수입니다. 결과: { level: "error" | "warn", code, msg }
// 검사 목록과 이유는 cafe/HARNESS.md 와 같은 번호를 씁니다. 규칙을 바꾸면 그 문서도 함께 고치세요.
import { FORBIDDEN, SOFT } from "../../../scripts/lib/adRules.mjs";
import { linksOf, textLength } from "./markdown.mjs";

const err = (code, msg) => ({ level: "error", code, msg });
const warn = (code, msg) => ({ level: "warn", code, msg });
const len = (s) => [...s].length;

// 광고·신뢰 표현 목록 (카페 전용)
export const COMPARE = ["손해보험사보다", "타사보다", "다른 보험사보다", "다른 회사보다", "어디보다", "가장 저렴", "제일 저렴", "더 저렴", "가성비 1"];
export const FAKE_REVIEW = ["실제 고객 후기", "고객 후기", "가입 후기", "체험담", "내돈내산"];
export const REWARD = ["기프티콘", "상품권", "경품", "추첨", "사은품", "현금 지급", "캐시백"];
export const BANNED = ["경남 김해", "설계사"];
const DAILY_PREMIUM = /하루\s*\d[\d,]*\s*원|일\s*\d[\d,]*\s*원꼴/;
const PHONE = /\b0\d{1,2}-\d{3,4}-\d{4}\b|\b1\d{3}-\d{4}\b/g;
const RRN = /\b\d{6}-[1-4]\d{6}\b/;
const PRODUCT_NAME = /우체국[가-힣A-Za-z]*보험/g;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** A. 카페 설정 */
export function checkConfig(cfg) {
  const r = [];
  const L = cfg.limits;
  const names = cfg.brand.nameCandidates;
  if (!names.length) r.push(err("A1", "카페명 후보가 없음"));
  for (const n of names) if (len(n.name) > L.name) r.push(err("A1", `카페명 "${n.name}" ${len(n.name)}자 — ${L.name}자 이내`));
  if (names.filter((n) => n.recommended).length !== 1) r.push(err("A1", "추천 카페명(recommended)은 정확히 1개"));
  const intro = cfg.brand.intro;
  if (len(intro) > L.intro) r.push(err("A2", `카페 소개 ${len(intro)}자 — ${L.intro}자 이내`));
  for (const k of cfg.brand.introKeywords) if (!intro.includes(k)) r.push(warn("A2", `카페 소개에 핵심 키워드 "${k}" 없음`));
  if (/<[^>]+>/.test(intro)) r.push(err("A2", "카페 설명에는 HTML 태그를 쓸 수 없음"));
  if (cfg.brand.mobileName && len(cfg.brand.mobileName) > L.name) r.push(err("A1", `모바일 카페 이름 ${len(cfg.brand.mobileName)}자 — ${L.name}자 이내`));
  // A12 카페 검색어 — 네이버가 공백을 붙여 한 단어로 등록하므로 처음부터 붙여 쓰고, 카페와 관련 있는 말만
  const sk = cfg.brand.searchKeywords ?? [];
  if (!sk.length) r.push(err("A12", "카페 검색어가 없음"));
  for (const k of sk) {
    if (/\s/.test(k)) r.push(err("A12", `검색어 "${k}" 에 공백 — 붙여 써야 함`));
    if (!/우체국|보험|실비|실손/.test(k)) r.push(warn("A12", `검색어 "${k}" 가 카페 주제(우체국보험)와 멀어 보임`));
    for (const w of [...FORBIDDEN, ...COMPARE]) if (k.includes(w)) r.push(err("A12", `검색어 "${k}" 에 금지·비교 표현 "${w}"`));
  }
  if (new Set(sk).size !== sk.length) r.push(err("A12", "검색어 중복"));
  const boards = cfg.menus.flatMap((g) => g.boards.map((b) => ({ ...b, group: g.group, hidden: !!g.hiddenUntilReady })));
  for (const a of cfg.requiredAreas) if (!boards.some((b) => b.area === a && !b.hidden)) r.push(err("A3", `필수 영역(${a}) 게시판이 없음`));
  const seen = new Set();
  for (const b of boards) { if (seen.has(b.name)) r.push(err("A4", `게시판 이름 중복: ${b.name}`)); seen.add(b.name); }
  const gradeNames = new Set(["매니저", "전체", ...cfg.grades.map((g) => g.name)]);
  for (const b of boards) for (const k of ["write", "read"]) if (!gradeNames.has(b[k])) r.push(err("A5", `${b.name} 의 ${k} 권한 "${b[k]}" 는 없는 등급`));
  for (const b of boards.filter((x) => x.area === "review")) if (b.operatorWrite !== false) r.push(err("A6", `후기 게시판(${b.name})은 운영자가 쓰지 않도록 operatorWrite:false 필요`));
  for (const b of boards.filter((x) => x.area === "consult")) if (b.kind !== "link") r.push(err("A7", `상담 게시판(${b.name})은 카페 안에서 연락처를 받지 않도록 링크(kind:"link")여야 함`));
  for (const g of cfg.menus.filter((x) => /제휴/.test(x.group))) if (!g.hiddenUntilReady) r.push(err("A8", "제휴 입점 메뉴는 규정 확인 전까지 비공개(hiddenUntilReady)"));
  const keys = ["posts", "comments", "visits", "likes", "joinWeeks"];
  cfg.grades.forEach((g, i) => {
    if (i > 0) for (const k of keys) if (g[k] < cfg.grades[i - 1][k]) r.push(err("A9", `등급 ${g.name} 의 ${k} 조건이 앞 등급보다 낮음`));
    for (const p of g.perks) for (const w of [...REWARD, "할인", "무료 상담 우선"]) if (p.includes(w)) r.push(err("A10", `등급 ${g.name} 혜택 "${p}" — 금전·경품성 혜택 금지("${w}")`));
  });
  // A13 가입 안내문·가입 질문 — 광고 표현 검사, 개인정보 최소 수집(가입 질문으로 연락처·주민번호 등 묻지 않기)
  const guide = cfg.joinSettings?.joinGuide ?? "";
  if (/<[^>]+>/.test(guide)) r.push(err("A13", "가입 안내문에는 HTML 태그를 쓸 수 없음"));
  if (L.joinGuide && len(guide) > L.joinGuide) r.push(err("A13", `가입 안내문 ${len(guide)}자 — ${L.joinGuide}자 이내(네이버 기준)`));
  for (const w of [...FORBIDDEN, ...COMPARE, ...REWARD, ...BANNED]) if (guide.includes(w)) r.push(err("A13", `가입 안내문에 "${w}"`));
  // 가입 환영글 — 같은 표현 검사, 연결할 공지 원고가 실제로 있어야 함
  const welcome = cfg.joinSettings?.welcome;
  if (welcome) {
    if (/<[^>]+>/.test(welcome.text)) r.push(err("A13", "가입 환영글에는 HTML 태그를 쓸 수 없음"));
    for (const w of [...FORBIDDEN, ...COMPARE, ...REWARD, ...BANNED]) if (welcome.text.includes(w)) r.push(err("A13", `가입 환영글에 "${w}"`));
  }
  const qs = cfg.joinSettings?.joinQuestions ?? [];
  if (qs.length > 3) r.push(err("A13", "가입 질문은 최대 3개"));
  for (const q of qs) if (/연락처|전화|휴대폰|주민|주소|생년월일|증권|병력|질병|소득/.test(q)) r.push(err("A13", `가입 질문 "${q}" — 개인정보·민감정보 수집 금지`));
  for (const k of ["officialInfo", "premium", "service"]) if (!cfg.footer[k]) r.push(err("A11", `글 아래 필수 고지(footer.${k}) 비어 있음`));
  return r;
}

/** B~F. 원고 한 편 — ctx: { cfg, products(Map id→name), slugs(Set), today(Date) } */
export function checkPost(file, meta, body, ctx) {
  const r = [];
  const { cfg } = ctx;
  const L = cfg.limits;
  const at = (x) => `${file}: ${x}`;
  if (!meta) return [err("B1", at("머리말(--- … ---)이 없음"))];

  // B. 형식
  for (const k of ["slug", "title", "menu", "kind", "status", "keywords", "asOf", "sources"]) if (!meta[k] || (Array.isArray(meta[k]) && !meta[k].length)) r.push(err("B1", at(`머리말 ${k} 비어 있음`)));
  const boards = cfg.menus.flatMap((g) => g.boards);
  const board = boards.find((b) => b.name === meta.menu);
  if (meta.menu && !board) r.push(err("B2", at(`게시판 "${meta.menu}" 이 카페 설정에 없음`)));
  if (board && board.area === "review") r.push(err("B2", at("운영자 원고는 후기 게시판에 올릴 수 없음")));
  if (meta.slug) { if (ctx.slugs.has(meta.slug)) r.push(err("B3", at(`slug 중복: ${meta.slug}`))); ctx.slugs.add(meta.slug); }
  if (meta.title && len(meta.title) > L.title) r.push(err("B4", at(`제목 ${len(meta.title)}자 — ${L.title}자 이내`)));
  const kw = Array.isArray(meta.keywords) ? meta.keywords : [];
  if (kw.length > L.keywordsMax) r.push(err("B5", at(`키워드 ${kw.length}개 — ${L.keywordsMax}개 이내`)));
  if (kw[0] && meta.title && !meta.title.replace(/\s/g, "").includes(kw[0].replace(/\s/g, ""))) r.push(warn("B5", at(`첫 키워드 "${kw[0]}" 가 제목에 없음 (검색 노출)`)));
  if (!["공지", "정보", "상품"].includes(meta.kind)) r.push(err("B1", at(`kind 는 공지·정보·상품 중 하나 (지금: ${meta.kind})`)));
  if (meta.kind !== "공지" && textLength(body) < L.bodyMin) r.push(warn("B6", at(`본문 ${textLength(body)}자 — 정보성 글은 ${L.bodyMin}자 이상 권장`)));
  if (meta.kind !== "공지" && (body.match(/^##\s/gm) ?? []).length < 2) r.push(warn("B7", at("소제목(##)이 2개 미만 — 읽기 흐름·검색 요약에 불리")));

  // C. 사실·출처
  for (const id of meta.products ?? []) if (!ctx.products.has(id)) r.push(err("C1", at(`상품 ${id} 는 판매 중 상품 데이터에 없음 (판매중지·e마크 여부 확인)`)));
  const known = [...ctx.products.values()].map((n) => n.replace(/\(.*$/, ""));
  for (const m of new Set(body.match(PRODUCT_NAME) ?? [])) if (m !== "우체국보험" && !known.some((n) => n.includes(m) || m.includes(n))) r.push(err("C2", at(`상품명 "${m}" 이 판매 중 상품 데이터에 없음`)));
  const hostOk = (u) => { try { return cfg.links.allowedHosts.includes(new URL(u).host); } catch { return false; } };
  for (const s of meta.sources ?? []) if (!hostOk(s)) r.push(err("C3", at(`출처 "${s}" — 공식·자사 주소(${cfg.links.allowedHosts.join(", ")})만`)));
  if (meta.asOf && !DATE.test(meta.asOf)) r.push(err("C4", at(`asOf 날짜 형식 YYYY-MM-DD (지금: ${meta.asOf})`)));
  else if (meta.asOf && (ctx.today - new Date(meta.asOf)) / 864e5 > L.staleDays) r.push(warn("C4", at(`기준일 ${meta.asOf} — ${L.staleDays}일 지남, 공식 자료로 다시 확인`)));
  for (const u of linksOf(body)) if (!hostOk(u)) r.push(err("C5", at(`본문 링크 "${u}" — 허용 주소만`)));

  // D. 광고 표현
  const text = `${meta.title ?? ""}\n${body}`;
  for (const w of FORBIDDEN) if (text.includes(w)) r.push(err("D1", at(`금지 표현 "${w}"`)));
  for (const w of SOFT) if (text.includes(w)) r.push(warn("D2", at(`주의 표현 "${w}" — 심의 전 확인`)));
  for (const w of COMPARE) if (text.includes(w)) r.push(err("D3", at(`비교·우열 표현 "${w}" — 근거 없는 비교 광고 금지`)));
  if (DAILY_PREMIUM.test(text)) r.push(err("D4", at("하루 단위 보험료 표현 — 보험료를 실제보다 적게 보이게 하는 표시 금지")));
  for (const w of BANNED) if (text.includes(w)) r.push(err("D5", at(`쓰지 않기로 한 표현 "${w}"`)));

  // E. 신뢰·개인정보
  for (const w of FAKE_REVIEW) if (text.includes(w)) r.push(err("E1", at(`"${w}" — 운영자 글에 후기·체험담 형식 금지(고객을 가장한 광고)`)));
  for (const w of REWARD) if (text.includes(w)) r.push(err("E2", at(`"${w}" — 보상·경품 이벤트 금지(특별이익 제공 소지)`)));
  const phones = text.match(PHONE) ?? [];
  for (const p of phones) if (!cfg.phones.allowed.includes(p)) r.push(err("E4", at(`허용되지 않은 전화번호 ${p}`)));
  if (/계약\s*변경|해지|민원/.test(meta.title ?? "") && phones.includes(cfg.phones.fcPhone)) r.push(err("E3", at("계약변경·해지·민원 글에는 FC 휴대폰 대신 고객센터 안내")));
  if (RRN.test(text)) r.push(err("E4", at("주민등록번호 형식이 본문에 있음")));

  // F. 게시 단계
  if (!["초안", "인증"].includes(meta.status)) r.push(err("F1", at(`status 는 초안·인증 중 하나 (지금: ${meta.status})`)));
  if (meta.kind === "상품" && meta.status === "인증" && !meta.reviewNo) r.push(err("F1", at("상품 글을 '인증'으로 두려면 광고 심의번호(reviewNo) 필요")));
  return r;
}
