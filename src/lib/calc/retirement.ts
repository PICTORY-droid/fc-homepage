import { collect, fail, succeed, type Outcome } from "./result";

// 은퇴 후 생활비 부족분 — 물가 상승만 반영한 단순 계산 (투자·운용 수익은 반영하지 않음)
export interface RetirementRaw {
  currentAge: string; retireAge: string; lifeAge: string;
  monthlyExpense: string;   // 지금 기준 희망 월 생활비(원)
  monthlyPension: string;   // 은퇴 시점부터 받을 월 수입 합계(원)
  inflationPct: string;     // 연 물가상승률(%)
  pensionGrowthPct: string; // 월 수입의 연 증가율(%)
}

export interface RetirementResult {
  retireYears: number;            // 은퇴 후 기간(년)
  expenseAtRetire: number;        // 은퇴 시점의 월 생활비(물가 반영)
  firstYearMonthlyGap: number;    // 은퇴 첫해 월 부족액
  lastYearMonthlyGap: number;     // 마지막 해 월 부족액
  totalNeed: number;              // 은퇴 기간 생활비 합계
  totalIncome: number;            // 은퇴 기간 월 수입 합계
  totalGap: number;               // 부족액 합계
}

export function computeRetirement(raw: RetirementRaw): Outcome<RetirementResult> {
  const { values: v, errors } = collect(raw, {
    currentAge: { label: "현재 나이", min: 1, max: 100, integer: true },
    retireAge: { label: "은퇴 나이", min: 1, max: 100, integer: true },
    lifeAge: { label: "생활비를 준비할 나이", min: 1, max: 120, integer: true },
    monthlyExpense: { label: "희망 월 생활비", min: 0, max: 1_000_000_000, integer: true },
    monthlyPension: { label: "월 수입(연금 등)", min: 0, max: 1_000_000_000, integer: true },
    inflationPct: { label: "물가상승률", min: 0, max: 20 },
    pensionGrowthPct: { label: "월 수입 증가율", min: 0, max: 20 },
  });
  if (Object.keys(errors).length) return fail(errors);
  const [c, r, l, e, p, inf, g] = [v.currentAge!, v.retireAge!, v.lifeAge!, v.monthlyExpense!, v.monthlyPension!, v.inflationPct! / 100, v.pensionGrowthPct! / 100];
  if (r <= c) return fail({ retireAge: "은퇴 나이는 현재 나이보다 커야 합니다." });
  if (l <= r) return fail({ lifeAge: "준비할 나이는 은퇴 나이보다 커야 합니다." });

  const n = l - r;
  let totalNeed = 0, totalIncome = 0, totalGap = 0, first = 0, last = 0, atRetire = 0;
  for (let t = 0; t < n; t++) {
    const exp = e * (1 + inf) ** (r - c + t);
    const inc = p * (1 + g) ** t;
    const gap = Math.max(0, exp - inc);
    if (t === 0) { first = gap; atRetire = exp; }
    if (t === n - 1) last = gap;
    totalNeed += exp * 12; totalIncome += inc * 12; totalGap += gap * 12;
  }
  const R = Math.round;
  return succeed({
    retireYears: n, expenseAtRetire: R(atRetire), firstYearMonthlyGap: R(first), lastYearMonthlyGap: R(last),
    totalNeed: R(totalNeed), totalIncome: R(totalIncome), totalGap: R(totalGap),
  });
}
