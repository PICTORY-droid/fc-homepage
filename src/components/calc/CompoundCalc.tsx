"use client";
import { calcNotices } from "@/config/calculators";
import { useCalc } from "@/features/calc/useCalc";
import { computeCompound, type CompoundRaw } from "@/lib/calc/compound";
import { formatWon, formatWonKorean } from "@/lib/format";
import { Buttons, CalcShell, ResultBox, Row, TextField } from "./fields";

const INITIAL: CompoundRaw = { monthlyDeposit: "", years: "", ratePct: "", payoutYears: "" };

// 복리 적립 · 연금 수령 시뮬레이션
export function CompoundCalc() {
  const { values: v, errors: e, result: r, setField, submit, reset } = useCalc(INITIAL, computeCompound);
  return (
    <CalcShell id="compound" title="복리 적립 · 연금 수령 시뮬레이션" lead="매달 모으면 얼마가 되는지, 모은 돈을 나눠 받으면 한 달에 얼마인지 가정으로 계산해 보세요.">
      <form noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }} className="space-y-5">
        <TextField id="cp-dep" label="월 납입액" unit="원" value={v.monthlyDeposit} onChange={(x) => setField("monthlyDeposit", x)} error={e.monthlyDeposit} placeholder="예: 300,000" />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="cp-yrs" label="적립 기간" unit="년" value={v.years} onChange={(x) => setField("years", x)} error={e.years} />
          <TextField id="cp-rate" label="연 이율 (가정)" unit="%" inputMode="decimal" value={v.ratePct} onChange={(x) => setField("ratePct", x)} error={e.ratePct} help="실제 상품의 이율이 아니라 직접 가정하는 값이에요. 0도 입력할 수 있어요." />
        </div>
        <TextField id="cp-pay" label="수령 기간 (선택)" unit="년" value={v.payoutYears} onChange={(x) => setField("payoutYears", x)} error={e.payoutYears} help="적립한 돈을 몇 년에 걸쳐 나눠 받을지 넣으면 월 수령액을 계산해요." />
        <Buttons onReset={reset} />
      </form>

      {r && (
        <ResultBox>
          <p className="text-lg font-bold text-ink">{r.months / 12}년 뒤 적립금은 약 {formatWonKorean(r.futureValue)}입니다.</p>
          <dl className="mt-4">
            <Row label="총 납입액" value={formatWon(r.totalDeposit)} />
            <Row label="이자(가정)" value={formatWon(r.interest)} />
            <Row label="적립금" value={formatWon(r.futureValue)} strong />
            {r.payout && (
              <>
                <Row label={`${r.payout.years}년간 매월 받을 수 있는 금액`} value={formatWon(r.payout.monthly)} strong />
                <Row label="수령 합계" value={formatWon(r.payout.total)} />
              </>
            )}
          </dl>
          <p className="mt-3 text-xs text-ink-sub">{calcNotices.compound}</p>
        </ResultBox>
      )}
    </CalcShell>
  );
}
