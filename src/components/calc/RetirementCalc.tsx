"use client";
import { calcNotices } from "@/config/calculators";
import { useCalc } from "@/features/calc/useCalc";
import { computeRetirement, type RetirementRaw } from "@/lib/calc/retirement";
import { formatWon, formatWonKorean } from "@/lib/format";
import { Buttons, CalcShell, ResultBox, Row, TextField } from "./fields";

const INITIAL: RetirementRaw = {
  currentAge: "", retireAge: "", lifeAge: "", monthlyExpense: "", monthlyPension: "", inflationPct: "0", pensionGrowthPct: "0",
};

// 은퇴 후 생활비 부족분 계산기
export function RetirementCalc() {
  const { values: v, errors: e, result: r, setField, submit, reset } = useCalc(INITIAL, computeRetirement);
  return (
    <CalcShell id="retire" title="은퇴 후 생활비 부족분" lead="은퇴 후 받을 수입으로 생활비가 충분한지, 부족하다면 얼마인지 확인해 보세요.">
      <form noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField id="rt-cur" label="현재 나이" unit="세" value={v.currentAge} onChange={(x) => setField("currentAge", x)} error={e.currentAge} />
          <TextField id="rt-ret" label="은퇴 나이" unit="세" value={v.retireAge} onChange={(x) => setField("retireAge", x)} error={e.retireAge} />
          <TextField id="rt-life" label="준비할 나이" unit="세" value={v.lifeAge} onChange={(x) => setField("lifeAge", x)} error={e.lifeAge} help="몇 세까지의 생활비를 계산할지 직접 정해 주세요." />
        </div>
        <TextField id="rt-exp" label="희망 월 생활비 (지금 물가 기준)" unit="원" value={v.monthlyExpense} onChange={(x) => setField("monthlyExpense", x)} error={e.monthlyExpense} placeholder="예: 3,000,000" />
        <TextField id="rt-pen" label="은퇴 후 월 수입 합계 (연금 등)" unit="원" value={v.monthlyPension} onChange={(x) => setField("monthlyPension", x)} error={e.monthlyPension} placeholder="예: 1,000,000" help="국민연금·퇴직연금 등 확인한 금액만 넣어 주세요." />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="rt-inf" label="연 물가상승률 (가정)" unit="%" inputMode="decimal" value={v.inflationPct} onChange={(x) => setField("inflationPct", x)} error={e.inflationPct} help="0이면 물가를 반영하지 않아요." />
          <TextField id="rt-gr" label="월 수입 연 증가율 (가정)" unit="%" inputMode="decimal" value={v.pensionGrowthPct} onChange={(x) => setField("pensionGrowthPct", x)} error={e.pensionGrowthPct} />
        </div>
        <Buttons onReset={reset} />
      </form>

      {r && (
        <ResultBox>
          {r.totalGap > 0
            ? <p className="text-lg font-bold text-ink">은퇴 후 {r.retireYears}년간 부족한 생활비는 약 {formatWonKorean(r.totalGap)}입니다.</p>
            : <p className="text-lg font-bold text-ink">입력하신 조건에서는 은퇴 후 {r.retireYears}년간 부족분이 없습니다.</p>}
          <dl className="mt-4">
            <Row label="은퇴 시점의 월 생활비(물가 반영)" value={formatWon(r.expenseAtRetire)} />
            <Row label="은퇴 첫해 월 부족액" value={formatWon(r.firstYearMonthlyGap)} strong />
            <Row label="마지막 해 월 부족액" value={formatWon(r.lastYearMonthlyGap)} />
            <Row label="은퇴 기간 생활비 합계" value={formatWonKorean(r.totalNeed)} />
            <Row label="은퇴 기간 수입 합계" value={formatWonKorean(r.totalIncome)} />
          </dl>
          <p className="mt-3 text-xs text-ink-sub">{calcNotices.retirement}</p>
        </ResultBox>
      )}
    </CalcShell>
  );
}
