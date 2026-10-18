import { collect, fail, succeed, type Outcome } from "./result";

// 복리 적립·연금 수령 시뮬레이션 — 연 이율을 가정해 월복리(연 이율 ÷ 12)로 계산합니다.
// 특정 상품의 실제 금액이 아니며, 적립은 매월 말 납입으로 가정합니다.
export interface CompoundRaw {
  monthlyDeposit: string; years: string; ratePct: string;
  payoutYears: string; // 선택: 비우면 수령 계산 생략
}

export interface CompoundResult {
  months: number;
  totalDeposit: number;
  futureValue: number;
  interest: number;
  payout: { years: number; monthly: number; total: number } | null;
}

// 매월 말 납입 적립 미래가치
export function futureValue(monthly: number, months: number, monthlyRate: number): number {
  if (monthlyRate === 0) return monthly * months;
  return monthly * (((1 + monthlyRate) ** months - 1) / monthlyRate);
}

// 적립금을 months 개월 동안 매월 말 같은 금액으로 나눠 받을 때의 월 수령액
export function monthlyPayout(balance: number, months: number, monthlyRate: number): number {
  if (monthlyRate === 0) return balance / months;
  return (balance * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
}

export function computeCompound(raw: CompoundRaw): Outcome<CompoundResult> {
  const { values: v, errors } = collect(raw, {
    monthlyDeposit: { label: "월 납입액", min: 1, max: 100_000_000, integer: true },
    years: { label: "적립 기간(년)", min: 1, max: 60, integer: true },
    ratePct: { label: "연 이율(가정)", min: 0, max: 30 },
    payoutYears: { label: "수령 기간(년)", min: 1, max: 60, integer: true, required: false },
  });
  if (Object.keys(errors).length) return fail(errors);
  const m = v.ratePct! / 100 / 12;
  const months = v.years! * 12;
  const fv = futureValue(v.monthlyDeposit!, months, m);
  const total = v.monthlyDeposit! * months;
  let payout: CompoundResult["payout"] = null;
  if (v.payoutYears !== null) {
    const pm = v.payoutYears * 12;
    const monthly = monthlyPayout(fv, pm, m);
    payout = { years: v.payoutYears, monthly: Math.round(monthly), total: Math.round(monthly * pm) };
  }
  return succeed({ months, totalDeposit: total, futureValue: Math.round(fv), interest: Math.round(fv - total), payout });
}
