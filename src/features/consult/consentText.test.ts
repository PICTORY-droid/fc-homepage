import { describe, expect, it } from "vitest";
import { consentNote } from "./consentText";

describe("개인정보 동의 안내 문구", () => {
  it("법정 고지 항목(수집 항목·목적·보유 기간·거부 권리)을 모두 담는다", () => {
    const t = consentNote(null);
    for (const k of ["이름", "연락처", "상담 회신", "파기", "동의하지 않으셔도"]) expect(t).toContain(k);
  });
  it("보유 기간이 정해지면 그 기간을 쓴다", () => {
    expect(consentNote(6)).toContain("6개월");
  });
});
