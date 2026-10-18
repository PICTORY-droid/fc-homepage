"use client";
import { calcNotices } from "@/config/calculators";
import { useCalc } from "@/features/calc/useCalc";
import { parseNum } from "@/lib/calc/result";
import { computeRetirement, type RetirementRaw } from "@/lib/calc/retirement";
import { formatWon, formatWonKorean } from "@/lib/format";
import { Buttons, CalcShell, ResultBox, Row, TextField } from "./fields";

const INITIAL: RetirementRaw = {
  currentAge: "", retireAge: "", lifeAge: "", monthlyExpense: "", monthlyPension: "", inflationPct: "0", pensionGrowthPct: "0",
};

// 사용 방법을 보여 주기 위한 예시 숫자 (추천값이 아님)
const EXAMPLE: RetirementRaw = {
  currentAge: "40", retireAge: "60", lifeAge: "90", monthlyExpense: "3,000,000", monthlyPension: "1,000,000", inflationPct: "2", pensionGrowthPct: "0",
};

// 입력한 금액을 읽기 쉽게 보여 주는 안내 문구 (표시 전용)
const moneyHint = (raw: string) => {
  const r = parseNum(raw, { label: "", min: 0, integer: true });
  return r.ok && r.value ? ` 지금 입력한 금액: ${formatWonKorean(r.value)}` : "";
};

// 은퇴 후 생활비 부족분 계산기
export function RetirementCalc() {
  const { values: v, errors: e, result: r, setField, submit, reset } = useCalc(INITIAL, computeRetirement);
  const fillExample = () => (Object.keys(EXAMPLE) as (keyof RetirementRaw)[]).forEach((k) => setField(k, EXAMPLE[k]));

  return (
    <CalcShell id="retire" title="은퇴 후 생활비 부족분" lead="은퇴 후 받을 수입으로 생활비가 충분한지, 부족하다면 얼마인지 확인해 보세요.">
      <div className="mb-5 rounded-xl bg-paper-card p-4 text-sm text-ink-sub">
        <p className="font-semibold text-ink">이렇게 입력하세요</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>모든 칸에 <strong className="text-ink">숫자만</strong> 입력합니다. 금액은 원 단위이고 쉼표는 넣어도 되고 빼도 됩니다.</li>
          <li>나이는 <strong className="text-ink">만 나이</strong>로 입력합니다.</li>
          <li>% 칸은 <strong className="text-ink">2</strong>라고 쓰면 2%입니다. 잘 모르겠으면 0을 두세요.</li>
        </ul>
        <button type="button" onClick={fillExample} className="mt-3 min-h-[44px] rounded-xl border border-ink/30 bg-paper px-4 font-semibold text-ink hover:bg-paper-gray">
          예시 숫자로 채워 보기
        </button>
        <span className="ml-2 text-xs">(사용법을 보여 주는 숫자일 뿐, 추천값이 아닙니다)</span>
      </div>

      <form noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField id="rt-cur" label="현재 나이" unit="세" placeholder="예: 40" value={v.currentAge} onChange={(x) => setField("currentAge", x)} error={e.currentAge}
            help="지금 만 나이를 입력하세요." />
          <TextField id="rt-ret" label="은퇴 나이" unit="세" placeholder="예: 60" value={v.retireAge} onChange={(x) => setField("retireAge", x)} error={e.retireAge}
            help="일을 그만두고 연금 등으로 생활하기 시작할 나이입니다. 현재 나이보다 커야 해요." />
          <TextField id="rt-life" label="준비할 나이" unit="세" placeholder="예: 90" value={v.lifeAge} onChange={(x) => setField("lifeAge", x)} error={e.lifeAge}
            help="몇 세까지의 생활비를 계산할지 직접 정해 주세요. 90을 넣으면 은퇴 후 90세까지입니다." />
        </div>
        <TextField id="rt-exp" label="희망 월 생활비 (지금 물가 기준)" unit="원" placeholder="예: 3,000,000" value={v.monthlyExpense} onChange={(x) => setField("monthlyExpense", x)} error={e.monthlyExpense}
          help={`은퇴 후 한 달에 쓰고 싶은 금액을 오늘 물가 기준으로 입력하세요. 3000000 또는 3,000,000은 300만 원입니다.${moneyHint(v.monthlyExpense)}`} />
        <TextField id="rt-pen" label="은퇴 후 월 수입 합계 (연금 등)" unit="원" placeholder="예: 1,000,000" value={v.monthlyPension} onChange={(x) => setField("monthlyPension", x)} error={e.monthlyPension}
          help={`은퇴한 첫해에 매달 받게 될 국민연금·퇴직연금·개인연금·임대수입 등을 모두 더한 금액입니다. 확인한 금액만 넣고, 받을 수입이 없으면 0을 입력하세요.${moneyHint(v.monthlyPension)}`} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="rt-inf" label="연 물가상승률 (가정)" unit="%" inputMode="decimal" placeholder="예: 2" value={v.inflationPct} onChange={(x) => setField("inflationPct", x)} error={e.inflationPct}
            help="해마다 물가가 오르는 비율을 직접 가정해 입력합니다. 2를 넣으면 매년 2%씩 올라 은퇴 때 생활비가 더 커집니다. 0이면 생활비가 지금 금액 그대로라고 계산합니다." />
          <TextField id="rt-gr" label="월 수입 연 증가율 (가정)" unit="%" inputMode="decimal" placeholder="예: 0" value={v.pensionGrowthPct} onChange={(x) => setField("pensionGrowthPct", x)} error={e.pensionGrowthPct}
            help="은퇴 후 월 수입이 해마다 늘어나는 비율입니다. 매년 같은 금액을 받으면 0을 두세요. 물가에 맞춰 오르는 수입이면 그 비율(예: 2)을 넣을 수 있어요." />
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
