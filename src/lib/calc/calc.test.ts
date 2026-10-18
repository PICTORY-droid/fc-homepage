import { describe, expect, it } from "vitest";
import { addMonths, parseYmd, todayKst } from "./date";
import { computeInsuranceAge } from "./insuranceAge";
import { computeMaturity } from "./maturity";
import { computeRetirement } from "./retirement";
import { computeCompound, futureValue, monthlyPayout } from "./compound";
import { parseNum } from "./result";

const age = (birth: string, base: string) => {
  const r = computeInsuranceAge({ birth, base });
  if (!r.ok) throw new Error(JSON.stringify(r.errors));
  return r.value;
};

describe("날짜", () => {
  it("월말 보정", () => {
    expect(addMonths({ y: 2024, m: 8, d: 31 }, 6)).toEqual({ y: 2025, m: 2, d: 28 });
    expect(addMonths({ y: 2023, m: 8, d: 31 }, 6)).toEqual({ y: 2024, m: 2, d: 29 });
    expect(addMonths({ y: 2024, m: 1, d: 15 }, -6)).toEqual({ y: 2023, m: 7, d: 15 });
  });
  it("잘못된 날짜 거부", () => {
    expect(parseYmd("2023-02-29")).toBeNull();
    expect(parseYmd("2024-02-29")).not.toBeNull();
    expect(parseYmd("abc")).toBeNull();
  });
  it("한국 시간 기준 오늘", () => {
    expect(todayKst(new Date("2026-10-17T16:00:00Z"))).toEqual({ y: 2026, m: 10, d: 18 });
  });
});

describe("보험나이 (6개월 미만 버림, 6개월 이상 올림)", () => {
  it("기사 예시: 1990-12-01생, 2022-05-31 → 31세 / 2022-06-01 → 32세", () => {
    expect(age("1990-12-01", "2022-05-31").insuranceAge).toBe(31);
    expect(age("1990-12-01", "2022-06-01").insuranceAge).toBe(32);
    expect(age("1990-12-01", "2022-06-01").manAge).toBe(31);
  });
  it("생일 당일: 만 나이는 오르지만 보험나이는 그대로", () => {
    const a = age("1990-12-01", "2022-12-01");
    expect(a.manAge).toBe(32);
    expect(a.insuranceAge).toBe(32);
  });
  it("다음 상령일 / 남은 일수", () => {
    const a = age("1990-12-01", "2022-05-31");
    expect(a.nextChangeDate).toBe("2022-06-01");
    expect(a.daysToNextChange).toBe(1);
    const b = age("1990-12-01", "2022-06-01");
    expect(b.nextChangeDate).toBe("2023-06-01");
    expect(b.daysToNextChange).toBe(365);
  });
  it("신생아: 6개월 전 0세, 6개월 후 1세", () => {
    expect(age("2026-01-10", "2026-07-09").insuranceAge).toBe(0);
    expect(age("2026-01-10", "2026-07-10").insuranceAge).toBe(1);
    expect(age("2026-01-10", "2026-01-10").insuranceAge).toBe(0);
  });
  it("2월 29일생", () => {
    // 평년에는 2월 28일을 생일로 계산 (약관·상품에 따라 다를 수 있음 → 화면에 안내)
    expect(age("2000-02-29", "2023-02-27").manAge).toBe(22);
    expect(age("2000-02-29", "2023-02-28").manAge).toBe(23);
    expect(age("2000-02-29", "2024-02-29").manAge).toBe(24);
  });
  it("연도 경계(12월 31일생)", () => {
    expect(age("1999-12-31", "2026-06-29").insuranceAge).toBe(26);
    expect(age("1999-12-31", "2026-06-30").insuranceAge).toBe(27);
  });
  it("검증: 미래 생일·형식 오류", () => {
    expect(computeInsuranceAge({ birth: "2030-01-01", base: "2026-10-18" }).ok).toBe(false);
    expect(computeInsuranceAge({ birth: "", base: "2026-10-18" }).ok).toBe(false);
    expect(computeInsuranceAge({ birth: "1890-01-01", base: "2026-10-18" }).ok).toBe(false);
  });
  it("무작위 일관성: 보험나이는 만 나이 또는 만 나이+1", () => {
    for (let i = 0; i < 2000; i++) {
      const y = 1950 + (i * 7) % 70, m = 1 + (i * 5) % 12, d = 1 + (i * 11) % 28;
      const by = 2026, bm = 1 + (i * 3) % 12, bd = 1 + (i * 13) % 28;
      const b = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const t = `${by}-${String(bm).padStart(2, "0")}-${String(bd).padStart(2, "0")}`;
      const r = computeInsuranceAge({ birth: b, base: t });
      if (!r.ok) continue;
      const diff = r.value.insuranceAge - r.value.manAge;
      expect([0, 1]).toContain(diff);
      expect(r.value.daysToNextChange).toBeGreaterThan(0);
    }
  });
});

describe("만기·납입기간", () => {
  const base = { birth: "1990-12-01", contract: "2026-10-18", monthlyPremium: "" };
  it("20년 만기 20년 납", () => {
    const r = computeMaturity({ ...base, termType: "years", term: "20", payType: "years", pay: "20" });
    if (!r.ok) throw new Error();
    expect(r.value.age.insuranceAge).toBe(36);
    expect(r.value.endAge).toBe(56);
    expect(r.value.payEndAge).toBe(56);
    expect(r.value.endYear).toBe(2046);
    expect(r.value.coverageOnlyYears).toBe(0);
    expect(r.value.payMonths).toBe(240);
    expect(r.value.totalPaid).toBeNull();
  });
  it("100세 만기 20년 납, 총 납입액", () => {
    const r = computeMaturity({ ...base, monthlyPremium: "50,000", termType: "age", term: "100", payType: "years", pay: "20" });
    if (!r.ok) throw new Error();
    expect(r.value.termYears).toBe(64);
    expect(r.value.coverageOnlyYears).toBe(44);
    expect(r.value.totalPaid).toBe(12_000_000);
  });
  it("전기납 / 나이 납입", () => {
    const a = computeMaturity({ ...base, termType: "years", term: "10", payType: "full", pay: "" });
    if (!a.ok) throw new Error();
    expect(a.value.payYears).toBe(10);
    const b = computeMaturity({ ...base, termType: "age", term: "90", payType: "age", pay: "60" });
    if (!b.ok) throw new Error();
    expect(b.value.payYears).toBe(24);
  });
  it("검증 오류", () => {
    expect(computeMaturity({ ...base, termType: "years", term: "10", payType: "years", pay: "11" }).ok).toBe(false);
    expect(computeMaturity({ ...base, termType: "age", term: "30", payType: "full", pay: "" }).ok).toBe(false);
    expect(computeMaturity({ ...base, termType: "years", term: "0", payType: "full", pay: "" }).ok).toBe(false);
    expect(computeMaturity({ ...base, birth: "", termType: "years", term: "10", payType: "full", pay: "" }).ok).toBe(false);
    expect(computeMaturity({ ...base, monthlyPremium: "-1", termType: "years", term: "10", payType: "full", pay: "" }).ok).toBe(false);
  });
});

describe("은퇴 후 생활비 부족분", () => {
  const raw = { currentAge: "40", retireAge: "60", lifeAge: "90", monthlyExpense: "3,000,000", monthlyPension: "1,000,000", inflationPct: "0", pensionGrowthPct: "0" };
  it("물가 0%: 부족분 = (생활비 − 수입) × 12 × 기간", () => {
    const r = computeRetirement(raw);
    if (!r.ok) throw new Error();
    expect(r.value.retireYears).toBe(30);
    expect(r.value.firstYearMonthlyGap).toBe(2_000_000);
    expect(r.value.totalGap).toBe(2_000_000 * 12 * 30);
    expect(r.value.totalNeed).toBe(3_000_000 * 12 * 30);
  });
  it("물가 반영: 은퇴 시점 생활비 = 현재 × (1+i)^(은퇴까지 년수)", () => {
    const r = computeRetirement({ ...raw, inflationPct: "2" });
    if (!r.ok) throw new Error();
    expect(r.value.expenseAtRetire).toBe(Math.round(3_000_000 * 1.02 ** 20));
  });
  it("수입이 생활비보다 크면 부족분 0", () => {
    const r = computeRetirement({ ...raw, monthlyPension: "5,000,000" });
    if (!r.ok) throw new Error();
    expect(r.value.totalGap).toBe(0);
  });
  it("검증 오류", () => {
    expect(computeRetirement({ ...raw, retireAge: "40" }).ok).toBe(false);
    expect(computeRetirement({ ...raw, lifeAge: "60" }).ok).toBe(false);
    expect(computeRetirement({ ...raw, monthlyExpense: "" }).ok).toBe(false);
    expect(computeRetirement({ ...raw, inflationPct: "50" }).ok).toBe(false);
  });
});

describe("복리 적립·수령", () => {
  it("이율 0%: 단순 합계", () => {
    expect(futureValue(100_000, 144, 0)).toBe(14_400_000);
    expect(monthlyPayout(1_200_000, 12, 0)).toBe(100_000);
  });
  it("검증된 수치: 월 10만 원, 연 12%(월 1%), 12개월 → 1,268,250", () => {
    expect(Math.round(futureValue(100_000, 12, 0.01))).toBe(1_268_250);
  });
  it("검증된 수치: 100만 원을 월 1%로 12개월 나눠 받으면 월 88,849", () => {
    expect(Math.round(monthlyPayout(1_000_000, 12, 0.01))).toBe(88_849);
  });
  it("적립 → 수령 종합", () => {
    const r = computeCompound({ monthlyDeposit: "100,000", years: "1", ratePct: "12", payoutYears: "1" });
    if (!r.ok) throw new Error();
    expect(r.value.totalDeposit).toBe(1_200_000);
    expect(r.value.futureValue).toBe(1_268_250);
    expect(r.value.interest).toBe(68_250);
    expect(r.value.payout?.monthly).toBe(112_683);
  });
  it("수령 기간 생략 가능, 검증 오류", () => {
    const r = computeCompound({ monthlyDeposit: "100000", years: "10", ratePct: "0", payoutYears: "" });
    if (!r.ok) throw new Error();
    expect(r.value.payout).toBeNull();
    expect(computeCompound({ monthlyDeposit: "0", years: "10", ratePct: "3", payoutYears: "" }).ok).toBe(false);
    expect(computeCompound({ monthlyDeposit: "1e5", years: "10", ratePct: "3", payoutYears: "" }).ok).toBe(false);
    expect(computeCompound({ monthlyDeposit: "100000", years: "10.5", ratePct: "3", payoutYears: "" }).ok).toBe(false);
    expect(computeCompound({ monthlyDeposit: "100000", years: "10", ratePct: "99", payoutYears: "" }).ok).toBe(false);
  });
});

describe("숫자 파서", () => {
  it("쉼표·공백 허용, 문자 거부", () => {
    expect(parseNum("1,234 567", { label: "x" })).toEqual({ ok: true, value: 1234567 });
    expect(parseNum("12a", { label: "x" }).ok).toBe(false);
    expect(parseNum("", { label: "x", required: false })).toEqual({ ok: true, value: null });
  });
});
