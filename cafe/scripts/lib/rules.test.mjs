import { describe, expect, it } from "vitest";
import { checkConfig, checkPost } from "./rules.mjs";
import { parseFrontmatter } from "./frontmatter.mjs";
import { toHtml } from "./markdown.mjs";
import { loadConfig, loadProducts } from "./load.mjs";

const cfg = loadConfig();
const products = loadProducts();
const base = { slug: "t", title: "우체국 실비 청구 테스트", menu: "청구 서류 정리", kind: "정보", status: "초안", keywords: ["우체국 실비"], asOf: "2026-10-18", sources: ["https://www.epostlife.go.kr"] };
const body = "## 하나\n본문\n## 둘\n본문";
const run = (meta, b = body) => checkPost("x.md", { ...base, ...meta }, b, { cfg, products, slugs: new Set(), today: new Date("2026-11-05") });
const codes = (r) => r.filter((i) => i.level === "error").map((i) => i.code);

describe("카페 설정 검사(A)", () => {
  it("현재 설정은 오류 없음", () => expect(codes(checkConfig(cfg))).toEqual([]));
  it("후기 게시판을 운영자가 쓰면 막는다", () => {
    const c = structuredClone(cfg);
    c.menus.find((g) => g.group === "이용 후기").boards[0].operatorWrite = true;
    expect(codes(checkConfig(c))).toContain("A6");
  });
  it("등급 혜택에 경품을 넣으면 막는다", () => {
    const c = structuredClone(cfg);
    c.grades[1].perks.push("기프티콘 추첨");
    expect(codes(checkConfig(c))).toContain("A10");
  });
  it("카페 설명 50자 초과·공백 들어간 검색어를 막는다", () => {
    const c = structuredClone(cfg);
    c.brand.intro = "가".repeat(51);
    c.brand.searchKeywords = ["우체국 실비"];
    const got = codes(checkConfig(c));
    expect(got).toContain("A2");
    expect(got).toContain("A12");
  });
  it("가입 질문으로 연락처를 묻거나 안내문에 HTML을 넣으면 막는다", () => {
    const c = structuredClone(cfg);
    c.joinSettings.joinQuestions = ["휴대폰 번호를 알려 주세요"];
    c.joinSettings.joinGuide = "<b>환영해요</b>";
    expect(codes(checkConfig(c)).filter((x) => x === "A13").length).toBe(2);
  });
  it("제휴 메뉴를 바로 공개하면 막는다", () => {
    const c = structuredClone(cfg);
    c.menus.find((g) => g.group === "제휴 입점").hiddenUntilReady = false;
    expect(codes(checkConfig(c))).toContain("A8");
  });
});

describe("원고 검사(B~F)", () => {
  it("정상 원고는 오류 없음", () => expect(codes(run({}))).toEqual([]));
  it("없는 게시판·후기 게시판을 막는다", () => {
    expect(codes(run({ menu: "없는판" }))).toContain("B2");
    expect(codes(run({ menu: "상담·카페 이용 후기" }))).toContain("B2");
  });
  it("판매 중이 아닌 상품 ID·상품명을 막는다", () => {
    expect(codes(run({ products: ["P999"] }))).toContain("C1");
    expect(codes(run({}, `${body}\n우체국만능보험 소개`))).toContain("C2");
  });
  it("공식·자사 외 출처와 링크를 막는다", () => {
    expect(codes(run({ sources: ["https://blog.example.com/a"] }))).toContain("C3");
    expect(codes(run({}, `${body}\n[여기](https://evil.example.com)`))).toContain("C5");
  });
  it("광고 금지·비교·하루 보험료 표현을 막는다", () => {
    expect(codes(run({}, `${body}\n업계 최저`))).toContain("D1");
    expect(codes(run({}, `${body}\n손해보험사보다 좋아요`))).toContain("D3");
    expect(codes(run({}, `${body}\n하루 300원이면 돼요`))).toContain("D4");
    expect(codes(run({}, `${body}\n설계사가 알려 드려요`))).toContain("D5");
  });
  it("고객 가장 후기·경품·개인정보를 막는다", () => {
    expect(codes(run({}, `${body}\n실제 고객 후기입니다`))).toContain("E1");
    expect(codes(run({}, `${body}\n댓글 달면 기프티콘`))).toContain("E2");
    expect(codes(run({}, `${body}\n010-1234-5678 로 연락`))).toContain("E4");
    expect(codes(run({ title: "우체국 실비 해지 방법" }, `${body}\n010-2192-1599`))).toContain("E3");
  });
  it("심의번호 없는 상품 글은 '인증'으로 둘 수 없다", () => {
    expect(codes(run({ kind: "상품", status: "인증" }))).toContain("F1");
    expect(codes(run({ kind: "상품", status: "인증", reviewNo: "제2026-001호" }))).toEqual([]);
  });
});

describe("원고 도구", () => {
  it("머리말 목록을 읽는다", () => expect(parseFrontmatter("---\na: [x, y]\nb: c\n---\n본문").meta).toEqual({ a: ["x", "y"], b: "c" }));
  it("표·목록·링크를 HTML로 바꾸고 링크에 UTM을 붙인다", () => {
    const h = toHtml("| a | b |\n| --- | --- |\n| 1 | 2 |\n- 하나\n[상담](https://x.kr/c)", (u) => `${u}?utm_source=t`);
    expect(h).toContain("<td>1</td>");
    expect(h).toContain("<li>하나</li>");
    expect(h).toContain('href="https://x.kr/c?utm_source=t"');
  });
});
