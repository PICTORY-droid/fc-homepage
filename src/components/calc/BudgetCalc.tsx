"use client";
import { useEffect, useRef } from "react";
import { budgetExample, budgetGroups } from "@/config/budgetItems";
import { useCalc } from "@/features/calc/useCalc";
import { computeBudget, previewGroupMonthly, type BudgetGroupDef } from "@/lib/calc/budget";
import { formatWon } from "@/lib/format";
import { BudgetResultView } from "./BudgetResultView";
import { Buttons, CalcShell, TextField } from "./fields";

const EXTRA_KEYS = ["targetPct", "emergency"];
const INITIAL: Record<string, string> = Object.fromEntries(
  [...budgetGroups.flatMap((g) => g.items.map((i) => i.key)), ...EXTRA_KEYS].map((k) => [k, ""]),
);
const compute = (raw: Record<string, string>) => computeBudget(raw, budgetGroups);

function GroupFields({ g, open, values, errors, setField }: {
  g: BudgetGroupDef; open: boolean; values: Record<string, string>; errors: Record<string, string>; setField: (k: string, v: string) => void;
}) {
  const hasError = g.items.some((i) => errors[i.key]);
  const subtotal = previewGroupMonthly(values, g);
  const ref = useRef<HTMLDetailsElement>(null);
  // 오류가 생기면 접혀 있던 그룹을 펼칩니다. (open 속성은 고정해 두어 사용자가 접는 동작을 막지 않음)
  useEffect(() => { if (hasError && ref.current) ref.current.open = true; }, [hasError]);
  return (
    <details ref={ref} open={open} className="rounded-xl border border-ink/15 bg-paper">
      <summary className="flex min-h-[52px] cursor-pointer flex-wrap items-center justify-between gap-2 px-4 py-3">
        <span className="font-bold text-ink">{g.title}</span>
        <span className="text-sm text-ink-sub">
          {hasError ? <span className="font-semibold text-alert">입력값 확인 필요</span> : <>월 합계 <strong className="text-ink">{formatWon(subtotal)}</strong></>}
        </span>
      </summary>
      <div className="border-t border-ink/10 px-4 pb-5 pt-3">
        <p className="mb-4 text-sm text-ink-sub">{g.lead}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {g.items.map((it) => (
            <TextField key={it.key} id={`bg-${it.key}`} label={it.label} unit="원" placeholder="0" value={values[it.key] ?? ""}
              onChange={(x) => setField(it.key, x)} error={errors[it.key]} help={it.help} />
          ))}
        </div>
      </div>
    </details>
  );
}

// 가계부 계산기 — 화면 상태는 useCalc, 계산은 lib/calc/budget.ts, 항목은 config/budgetItems.ts
export function BudgetCalc() {
  const { values, errors, result, setField, submit, reset } = useCalc(INITIAL, compute);
  const resultRef = useRef<HTMLDivElement>(null);

  // 계산 후 결과 위치로 이동 (입력칸이 길어서 결과가 화면 밖에 있을 수 있음)
  useEffect(() => {
    if (!result) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [result]);

  const fillExample = () => Object.entries(budgetExample).forEach(([k, v]) => setField(k, v));

  return (
    <CalcShell id="budget" title="가계부 계산기" lead="한 달 수입과 지출을 항목별로 넣으면 저축률, 남는 돈, 가장 큰 지출을 한눈에 정리해 드려요.">
      <div className="mb-5 rounded-xl bg-paper-card p-4 text-sm text-ink-sub">
        <p className="font-semibold text-ink">이렇게 입력하세요</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>금액은 <strong className="text-ink">원 단위 숫자</strong>로 입력합니다. 쉼표는 넣어도 되고 빼도 됩니다.</li>
          <li>해당하지 않는 칸은 <strong className="text-ink">비워 두세요.</strong> 0으로 계산합니다.</li>
          <li>변동 지출은 최근 두세 달 평균을 넣으면 정확해요. 칸 이름에 <strong className="text-ink">(연 합계)</strong>가 있으면 1년 동안 쓰는 총액을 넣습니다.</li>
          <li>이 계산기는 입력한 내용을 저장하지 않습니다. 페이지를 닫으면 사라져요.</li>
        </ul>
        <button type="button" onClick={fillExample} className="mt-3 min-h-[44px] rounded-xl border border-ink/30 bg-paper px-4 font-semibold text-ink hover:bg-paper-gray">
          예시 숫자로 채워 보기
        </button>
        <span className="ml-2 text-xs">(사용법을 보여 주는 숫자일 뿐, 추천값이 아닙니다)</span>
      </div>

      <form noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }} className="space-y-4">
        {budgetGroups.map((g, i) => (
          <GroupFields key={g.key} g={g} open={i < 2} values={values} errors={errors} setField={setField} />
        ))}

        <div className="rounded-xl border border-ink/15 bg-paper p-4">
          <p className="font-bold text-ink">⑥ 추가 정보 (선택)</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <TextField id="bg-targetPct" label="목표 저축률" unit="%" inputMode="decimal" placeholder="예: 20" value={values.targetPct}
              onChange={(x) => setField("targetPct", x)} error={errors.targetPct}
              help="월 수입 중 몇 %를 저축하고 싶은지 직접 정해 입력하세요. 20이면 20%입니다." />
            <TextField id="bg-emergency" label="지금 가진 비상금" unit="원" placeholder="예: 3,000,000" value={values.emergency}
              onChange={(x) => setField("emergency", x)} error={errors.emergency}
              help="바로 꺼내 쓸 수 있는 현금성 자금입니다. 월 지출의 몇 개월치인지 계산해요." />
          </div>
        </div>

        {errors.form && <p role="alert" className="rounded-xl border border-alert/40 bg-paper px-4 py-3 text-sm text-alert">{errors.form}</p>}
        <Buttons onReset={reset} />
      </form>

      <div ref={resultRef} className="scroll-mt-24">{result && <BudgetResultView r={result} />}</div>
    </CalcShell>
  );
}
