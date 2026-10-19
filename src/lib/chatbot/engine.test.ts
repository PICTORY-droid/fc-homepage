import { describe, expect, it } from "vitest";
import { products } from "../../config/products";
import { looksSensitive, reply } from "./engine";

const hrefs = (q: string) => reply(q).links.map((l) => l.href);

describe("안내 도우미", () => {
  it("빈 입력은 안내 문구", () => expect(reply("   ").text).toContain("입력"));
  it("보험료 질문은 금액을 말하지 않고 상담으로 연결", () => {
    const r = reply("보험료 얼마예요?");
    expect(r.text).not.toMatch(/\d+원/);
    expect(r.links.map((l) => l.href)).toContain("/consult");
  });
  it("분야 단어로 분야 안내와 상품을 보여준다", () => {
    expect(hrefs("아이 보험")).toContain("/c/kids");
    expect(hrefs("암")).toContain("/c/health");
    expect(hrefs("연금")).toContain("/c/pension");
  });
  it("상품 이름이 들어가면 그 상품으로 연결", () => expect(hrefs("암케어보험")).toContain("/products/P007"));
  it("병력 질문은 가입 가능 여부를 단정하지 않는다", () => {
    const r = reply("병력 있어도 가입돼요?");
    expect(r.text).not.toMatch(/가입(이)? 가능합니다|가입됩니다/);
  });
  it("모르는 질문은 상담으로 연결", () => {
    const r = reply("오늘 날씨 어때");
    expect(r.links.map((l) => l.href)).toContain("/consult");
  });
  it("주민번호·전화번호는 처리하지 않고 경고", () => {
    for (const s of ["900101-1234567", "010-1234-5678", "주민번호 알려줄게"]) {
      expect(looksSensitive(s)).toBe(true);
      expect(reply(s).text).toContain("개인정보");
    }
  });
  it("공식 고객센터 번호(1599-0100)는 어떤 답에도 넣지 않는다", () => {
    for (const q of ["전화", "고객센터", "연락처", "공식", "보험금"]) {
      const r = reply(q);
      expect(JSON.stringify(r)).not.toContain("1599-0100");
    }
  });
  it("모든 연결 주소는 사이트 안 경로·전화·카카오뿐", () => {
    const qs = ["상품찾기", "가입조건", "보험료", "상담", "카톡", "전화", "비교", "자동이체", "보험금청구", "개인정보", "출처", "가입방법", "담당자", "안녕", "감사", "아이", "암", "연금", "산모", "저축", "치매", "병력", "회사", "zzzz", ...products.map((p) => p.displayName)];
    for (const q of qs) for (const l of reply(q).links) expect(l.href).toMatch(/^(\/|tel:|https:\/\/open\.kakao\.com\/|https:\/\/epostlife\.go\.kr\/IPCCFQ0001\.do$)/);
  });
  it("상품 링크는 실제 상품 ID", () => {
    const ids = new Set(products.map((p) => p.id));
    for (const l of reply("아이").links.filter((l) => l.href.startsWith("/products/"))) expect(ids.has(l.href.split("/")[2])).toBe(true);
  });
  it("계약 관리 질문은 공식 자주하는 질문으로 안내하고 답을 지어내지 않는다", () => {
    const r = reply("자동이체 변경");
    expect(r.links.map((l) => l.href)).toContain("https://epostlife.go.kr/IPCCFQ0001.do");
    expect(r.text).not.toMatch(/\d+일|\d+원/);
  });
  it("다이렉트 보험은 1599-0100 문의로 안내", () => {
    const r = reply("다이렉트 보험 상담 가능해요?");
    expect(r.text).toBe("다이렉트 보험은 이곳에서 상담이 어렵습니다. 1599-0100으로 문의주세요.");
    expect(r.links.map((l) => l.href)).toEqual(["tel:1599-0100"]);
  });
  it("너무 긴 입력은 잘라서 처리", () => expect(() => reply("가".repeat(5000))).not.toThrow());
});
