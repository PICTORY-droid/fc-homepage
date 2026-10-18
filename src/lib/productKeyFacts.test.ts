import { describe, expect, it } from "vitest";
import { buildKeyFacts } from "./productKeyFacts";

const base = { group: "보장성", effectiveDate: "2025-09-12" };

describe("핵심 정보 카드", () => {
  it("분류가 항상 첫 칸이고 최대 4칸", () => {
    const r = buildKeyFacts({ ...base, facts: [
      { label: "보험기간", value: "20년" }, { label: "가입 나이", value: "최대 70세까지" },
      { label: "납입주기", value: "월납" }, { label: "보험금액(가입금액)", value: "500만원" }, { label: "건강진단", value: "무진단" },
    ] });
    expect(r).toHaveLength(4);
    expect(r[0]).toEqual({ label: "분류", value: "보장성 보험" });
    expect(r.map((x) => x.label)).toEqual(["분류", "보험기간", "가입나이", "납입"]);
  });
  it("긴 문장은 카드에서 제외하고, 부족하면 고시 시행일로 채운다", () => {
    const r = buildKeyFacts({ ...base, facts: [{ label: "가입 한도", value: "피보험자가 가입 당시 66세 이상이면 2,000만원 한도로 가입할 수 있습니다" }] });
    expect(r.map((x) => x.label)).toEqual(["분류", "고시 시행일"]);
  });
  it("상세 정보가 없어도 동작", () => {
    expect(buildKeyFacts(base)).toHaveLength(2);
  });
});
