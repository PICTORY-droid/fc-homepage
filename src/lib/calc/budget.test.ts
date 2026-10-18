import { describe, expect, it } from "vitest";
import { computeBudget, previewGroupMonthly, type BudgetGroupDef } from "./budget";
import { budgetExample, budgetGroups } from "../../config/budgetItems";

const G: BudgetGroupDef[] = [
  { key: "income", title: "수입", lead: "", items: [{ key: "salary", label: "월급" }, { key: "bonus", label: "상여", period: "yearly" }] },
  { key: "fixed", title: "고정", lead: "", items: [{ key: "rent", label: "월세" }, { key: "loan", label: "대출", tag: "loan" }, { key: "ins", label: "보험", tag: "insurance" }] },
  { key: "variable", title: "변동", lead: "", items: [{ key: "food", label: "식비" }] },
  { key: "yearly", title: "연", lead: "", items: [{ key: "trip", label: "여행", period: "yearly" }] },
  { key: "saving", title: "저축", lead: "", items: [{ key: "dep", label: "적금" }] },
];
const ok = (raw: Record<string, string>) => {
  const r = computeBudget(raw, G);
  if (!r.ok) throw new Error(JSON.stringify(r.errors));
  return r.value;
};

describe("가계부 계산", () => {
  const raw = { salary: "3,000,000", bonus: "1,200,000", rent: "700,000", loan: "500,000", ins: "200,000", food: "400,000", trip: "600,000", dep: "300,000" };

  it("연 단위 항목은 12로 나눠 월 환산", () => {
    const r = ok(raw);
    expect(r.incomeMonthly).toBe(3_100_000);       // 3,000,000 + 1,200,000/12
    expect(r.groups.find((g) => g.key === "yearly")!.monthly).toBe(50_000);
  });
  it("지출·저축·잔액", () => {
    const r = ok(raw);
    expect(r.spendMonthly).toBe(700_000 + 500_000 + 200_000 + 400_000 + 50_000); // 1,850,000
    expect(r.savingMonthly).toBe(300_000);
    expect(r.balanceMonthly).toBe(3_100_000 - 1_850_000 - 300_000);              // 950,000
  });
  it("비율", () => {
    const r = ok(raw);
    expect(r.savingsRate).toBeCloseTo(300_000 / 3_100_000, 10);
    expect(r.loanRatio).toBeCloseTo(500_000 / 3_100_000, 10);
    expect(r.insuranceRatio).toBeCloseTo(200_000 / 3_100_000, 10);
    expect(r.shares.fixed).toBeCloseTo(1_400_000 / 3_100_000, 10);
  });
  it("연 환산은 연 단위 항목의 원래 금액을 사용", () => {
    const r = ok(raw);
    expect(r.annual.income).toBe(3_000_000 * 12 + 1_200_000);
    expect(r.annual.spend).toBe((700_000 + 500_000 + 200_000 + 400_000) * 12 + 600_000);
    expect(r.annual.saving).toBe(3_600_000);
    expect(r.annual.balance).toBe(r.annual.income - r.annual.spend - r.annual.saving);
  });
  it("지출이 더 크면 잔액이 음수", () => {
    const r = ok({ ...raw, food: "3,000,000" });
    expect(r.balanceMonthly).toBeLessThan(0);
  });
  it("목표 저축률과 비교", () => {
    const r = ok({ ...raw, targetPct: "20" });
    expect(r.target).toEqual({ pct: 20, amount: 620_000, gap: 300_000 - 620_000 });
    expect(ok(raw).target).toBeNull();
  });
  it("비상금은 월 지출의 몇 개월치인지", () => {
    const r = ok({ ...raw, emergency: "3,700,000" });
    expect(r.emergency!.months).toBeCloseTo(3_700_000 / 1_850_000, 10); // 2개월
  });
  it("가장 큰 지출 항목 순서", () => {
    const r = ok(raw);
    expect(r.topExpenses.map((i) => i.key)).toEqual(["rent", "loan", "food", "ins", "trip"]);
  });
  it("빈 칸은 0, 대출·보험 항목이 없으면 비율 null", () => {
    const r = computeBudget({ salary: "1000000" }, [G[0], G[2]]);
    if (!r.ok) throw new Error();
    expect(r.value.spendMonthly).toBe(0);
    expect(r.value.loanRatio).toBeNull();
    expect(r.value.emergency).toBeNull();
  });
  it("검증 오류", () => {
    expect(computeBudget({ ...raw, food: "abc" }, G)).toMatchObject({ ok: false, errors: { food: expect.any(String) } });
    expect(computeBudget({ ...raw, food: "-5" }, G).ok).toBe(false);
    expect(computeBudget({ ...raw, food: "1.5" }, G).ok).toBe(false);
    expect(computeBudget({ ...raw, food: "9,999,999,999" }, G).ok).toBe(false);
    expect(computeBudget({ ...raw, targetPct: "150" }, G).ok).toBe(false);
    expect(computeBudget({ rent: "500000" }, G)).toMatchObject({ ok: false, errors: { form: expect.any(String) } });
  });
  it("입력 중 그룹 합계 미리보기는 잘못된 값을 0으로 처리", () => {
    expect(previewGroupMonthly({ rent: "700,000", loan: "x", ins: "100000" }, G[1])).toBe(800_000);
    expect(previewGroupMonthly({ trip: "600000" }, G[3])).toBe(50_000);
  });
});

describe("실제 항목 설정", () => {
  it("key 중복이 없고 예시 숫자로 계산됨", () => {
    const keys = budgetGroups.flatMap((g) => g.items.map((i) => i.key));
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).not.toContain("targetPct");
    expect(keys).not.toContain("emergency");
    const r = computeBudget(budgetExample, budgetGroups);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.incomeMonthly).toBe(3_100_000);
      expect(r.value.loanRatio).not.toBeNull();
      expect(r.value.insuranceRatio).not.toBeNull();
    }
  });
});
