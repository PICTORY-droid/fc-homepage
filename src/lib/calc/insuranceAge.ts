import { addMonths, cmpYmd, diffDays, formatYmd, parseYmd, todayKst, type Ymd } from "./date";
import { fail, succeed, type Outcome } from "./result";

// 보험나이: 계약일 기준 만 나이에서 6개월 미만 끝수는 버리고 6개월 이상은 1년으로 올림.
// → 생일로부터 6개월이 지난 날(상령일)부터 보험나이가 1살 올라갑니다.
export interface InsuranceAgeResult {
  manAge: number;            // 만 나이
  insuranceAge: number;      // 보험나이
  nextChangeDate: string;    // 다음 상령일(보험나이가 오르는 날) yyyy-mm-dd
  daysToNextChange: number;  // 기준일부터 남은 일수
}

export interface InsuranceAgeRaw { birth: string; base: string }

// 기준일에 보험나이가 a 가 되는 시점: 생일 + (12a − 6)개월
const reachDate = (birth: Ymd, a: number) => addMonths(birth, 12 * a - 6);

export function calcInsuranceAgeCore(birth: Ymd, base: Ymd): InsuranceAgeResult {
  let man = base.y - birth.y;
  while (man > 0 && cmpYmd(addMonths(birth, 12 * man), base) > 0) man -= 1;

  let ins = base.y - birth.y + 1;
  while (ins > 0 && cmpYmd(reachDate(birth, ins), base) > 0) ins -= 1;

  const next = reachDate(birth, ins + 1);
  return { manAge: man, insuranceAge: ins, nextChangeDate: formatYmd(next), daysToNextChange: diffDays(base, next) };
}

export function computeInsuranceAge(raw: InsuranceAgeRaw): Outcome<InsuranceAgeResult> {
  const errors: Record<string, string> = {};
  const birth = parseYmd(raw.birth);
  const base = parseYmd(raw.base);
  if (!birth) errors.birth = "생년월일을 정확히 입력해 주세요.";
  if (!base) errors.base = "기준일(계약일)을 정확히 입력해 주세요.";
  if (birth && base) {
    if (cmpYmd(birth, base) > 0) errors.birth = "생년월일은 기준일보다 앞이어야 합니다.";
    else if (birth.y < 1900) errors.birth = "1900년 이후 출생일을 입력해 주세요.";
    else if (base.y - birth.y > 120) errors.base = "기준일과 생년월일 차이가 너무 큽니다.";
  }
  if (Object.keys(errors).length || !birth || !base) return fail(errors);
  return succeed(calcInsuranceAgeCore(birth, base));
}

export { todayKst };
