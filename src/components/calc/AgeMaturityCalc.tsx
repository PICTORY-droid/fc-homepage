"use client";
import { useEffect, useState } from "react";
import { calcNotices } from "@/config/calculators";
import { useCalc } from "@/features/calc/useCalc";
import { computeMaturity, type MaturityRaw } from "@/lib/calc/maturity";
import { formatYmd, todayKst } from "@/lib/calc/date";
import { formatWon } from "@/lib/format";
import { Buttons, CalcShell, DateField, ResultBox, Row, SelectField, TextField } from "./fields";

const INITIAL: MaturityRaw = { birth: "", contract: "", termType: "years", term: "", payType: "full", pay: "", monthlyPremium: "" };

// 보험나이 · 만기 · 납입기간 계산기
export function AgeMaturityCalc() {
  const { values: v, errors: e, result: r, setField, submit, reset } = useCalc(INITIAL, computeMaturity);
  const [resetKey, setResetKey] = useState(0); // 날짜 입력칸을 비우기 위한 키

  // 오늘 날짜는 브라우저에서만 채웁니다 (서버/브라우저 날짜 불일치 방지)
  useEffect(() => { setField("contract", formatYmd(todayKst())); }, [setField]);

  // '처음부터': 모두 비우되 계약일은 오늘로 다시 채웁니다.
  const handleReset = () => { reset(); setField("contract", formatYmd(todayKst())); setResetKey((n) => n + 1); };

  return (
    <CalcShell id="age" title="보험나이 · 만기 · 납입기간" lead="생년월일과 계약일을 넣으면 보험나이와 만기·납입 종료 시점을 알려드려요.">
      <form noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <DateField key={`b${resetKey}`} id="age-birth" label="생년월일" value={v.birth} onChange={(x) => setField("birth", x)} error={e.birth} />
          <DateField key={`c${resetKey}`} id="age-contract" label="계약일(기준일)" value={v.contract} onChange={(x) => setField("contract", x)} error={e.contract} help="오늘 날짜가 자동으로 들어갑니다. 바꿀 수 있어요." />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField id="age-termType" label="보험기간 방식" value={v.termType} onChange={(x) => setField("termType", x as MaturityRaw["termType"])}
            options={[["years", "○년 만기"], ["age", "○세 만기"]]} />
          <TextField id="age-term" label={v.termType === "age" ? "만기 나이(세)" : "보험기간(년)"} value={v.term} onChange={(x) => setField("term", x)} error={e.term} placeholder={v.termType === "age" ? "예: 100" : "예: 20"} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField id="age-payType" label="납입 방식" value={v.payType} onChange={(x) => setField("payType", x as MaturityRaw["payType"])}
            options={[["full", "전기납 (보험기간 내내)"], ["years", "○년 납"], ["age", "○세 납"]]} />
          {v.payType !== "full" && (
            <TextField id="age-pay" label={v.payType === "age" ? "납입 종료 나이(세)" : "납입기간(년)"} value={v.pay} onChange={(x) => setField("pay", x)} error={e.pay} placeholder={v.payType === "age" ? "예: 60" : "예: 10"} />
          )}
        </div>
        <TextField id="age-premium" label="월 보험료 (선택)" value={v.monthlyPremium} onChange={(x) => setField("monthlyPremium", x)} error={e.monthlyPremium}
          unit="원" help="이미 알고 있는 월 보험료를 넣으면 총 납입액을 계산해요. 비워도 됩니다." />
        <Buttons onReset={handleReset} />
      </form>

      {r && (
        <ResultBox>
          <p className="text-lg font-bold text-ink">
            보험나이 {r.age.insuranceAge}세 <span className="text-sm font-normal text-ink-sub">(만 {r.age.manAge}세)</span>
          </p>
          <p className="mt-1 text-sm text-ink-sub">
            다음 보험나이 변경일은 {r.age.nextChangeDate} (계약일로부터 {r.age.daysToNextChange.toLocaleString("ko-KR")}일 뒤)입니다.
          </p>
          <dl className="mt-4">
            <Row label="보험기간" value={`${r.termYears}년 (보험나이 ${r.endAge}세까지)`} />
            <Row label="보험기간 종료 연도(대략)" value={`${r.endYear}년`} />
            <Row label="납입기간" value={`${r.payYears}년 · ${r.payMonths.toLocaleString("ko-KR")}회(월납 기준)`} />
            <Row label="납입 종료" value={`보험나이 ${r.payEndAge}세 · ${r.payEndYear}년경`} />
            <Row label="납입 후 보장만 받는 기간" value={`${r.coverageOnlyYears}년`} />
            {r.totalPaid !== null && <Row label="총 납입액(월 보험료 × 납입 횟수)" value={formatWon(r.totalPaid)} strong />}
          </dl>
          <p className="mt-3 text-xs text-ink-sub">{calcNotices.age}</p>
        </ResultBox>
      )}
    </CalcShell>
  );
}
