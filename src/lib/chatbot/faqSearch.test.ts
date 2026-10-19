import { describe, expect, it } from "vitest";
import { officialFaq } from "../../config/officialFaq";
import { buildFaqIndex, isDecisive, searchFaq } from "./faqSearch";

const idx = buildFaqIndex(officialFaq);

describe("공식 질문 검색", () => {
  it("글자가 한 자뿐이면 찾지 않는다", () => expect(searchFaq(idx, "암")).toEqual([]));
  it("띄어쓰기가 달라도 찾는다", () => expect(searchFaq(idx, "청약 철회")[0].item.id).toBe("F015"));
  it("질문 원문은 확실한 한 가지로 판단한다", () => {
    const q = officialFaq[4].question;
    expect(isDecisive(searchFaq(idx, q), q)).toBe(true);
  });
  it("짧고 흔한 말은 확실하다고 보지 않는다", () => expect(isDecisive(searchFaq(idx, "보험"), "보험")).toBe(false));
  it("데이터 형식 검사: 모든 항목에 질문·답변·분류가 있다", () => {
    for (const f of officialFaq) { expect(f.question.length).toBeGreaterThan(3); expect(f.answer.length).toBeGreaterThan(5); expect(f.category).toBeTruthy(); }
    expect(new Set(officialFaq.map((f) => f.id)).size).toBe(officialFaq.length);
  });
});
