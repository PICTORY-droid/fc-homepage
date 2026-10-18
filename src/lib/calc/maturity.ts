import { addMonths, parseYmd, type Ymd } from "./date";
import { calcInsuranceAgeCore, type InsuranceAgeResult } from "./insuranceAge";
import { cmpYmd } from "./date";
import { collect, fail, succeed, type Outcome } from "./result";

export type TermType = "years" | "age";           // n년 만기 / n세 만기
export type PayType = "years" | "age" | "full";   // n년 납 / n세 납 / 전기납(보험기간과 동일)

export interface MaturityRaw {
  birth: string; contract: string;
  termType: TermType; term: string;
  payType: PayType; pay: string;
  monthlyPremium: string; // 선택
}

export interface MaturityResult {
  age: InsuranceAgeResult;
  termYears: number;          // 보험기간(년)
  endAge: number;             // 보험기간 종료 시 보험나이
  endYear: number;            // 보험기간 종료 연도(계약 연도 + 보험기간, 대략)
  payYears: number;           // 납입기간(년)
  payEndAge: number;          // 납입 종료 시 보험나이
  payEndYear: number;
  payMonths: number;          // 납입 횟수(월납 기준)
  coverageOnlyYears: number;  // 납입 끝난 뒤 보장만 받는 기간(년)
  totalPaid: number | null;   // 월 보험료 입력 시 총 납입액
}

export function computeMaturity(raw: MaturityRaw): Outcome<MaturityResult> {
  const { values, errors } = collect(
    { term: raw.term, pay: raw.payType === "full" ? "1" : raw.pay, monthlyPremium: raw.monthlyPremium },
    {
      term: { label: raw.termType === "age" ? "만기 나이" : "보험기간(년)", min: 1, max: 130, integer: true },
      pay: { label: raw.payType === "age" ? "납입 종료 나이" : "납입기간(년)", min: 1, max: 130, integer: true },
      monthlyPremium: { label: "월 보험료", min: 0, max: 100_000_000, integer: true, required: false },
    },
  );
  const birth = parseYmd(raw.birth);
  const contract = parseYmd(raw.contract);
  if (!birth) errors.birth = "생년월일을 정확히 입력해 주세요.";
  if (!contract) errors.contract = "계약일을 정확히 입력해 주세요.";
  if (birth && contract && cmpYmd(birth, contract) > 0) errors.birth = "생년월일은 계약일보다 앞이어야 합니다.";
  if (birth && birth.y < 1900) errors.birth = "1900년 이후 출생일을 입력해 주세요.";
  if (Object.keys(errors).length || !birth || !contract || values.term === null) return fail(errors);

  const age = calcInsuranceAgeCore(birth as Ymd, contract as Ymd);
  const termYears = raw.termType === "age" ? values.term - age.insuranceAge : values.term;
  if (termYears < 1) return fail({ term: `만기 나이는 현재 보험나이(${age.insuranceAge}세)보다 커야 합니다.` });
  if (termYears > 110) return fail({ term: "보험기간이 너무 깁니다. 값을 확인해 주세요." });

  let payYears = termYears;
  if (raw.payType !== "full") {
    if (values.pay === null) return fail(errors);
    payYears = raw.payType === "age" ? values.pay - age.insuranceAge : values.pay;
    if (payYears < 1) return fail({ pay: `납입 종료 나이는 현재 보험나이(${age.insuranceAge}세)보다 커야 합니다.` });
    if (payYears > termYears) return fail({ pay: "납입기간은 보험기간보다 길 수 없습니다." });
  }

  const payMonths = payYears * 12;
  return succeed({
    age, termYears,
    endAge: age.insuranceAge + termYears,
    endYear: addMonths(contract as Ymd, termYears * 12).y,
    payYears,
    payEndAge: age.insuranceAge + payYears,
    payEndYear: addMonths(contract as Ymd, payYears * 12).y,
    payMonths,
    coverageOnlyYears: termYears - payYears,
    totalPaid: values.monthlyPremium === null ? null : values.monthlyPremium * payMonths,
  });
}
