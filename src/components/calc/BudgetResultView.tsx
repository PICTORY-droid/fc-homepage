import { calcNotices } from "@/config/calculators";
import type { BudgetResult } from "@/lib/calc/budget";
import { formatWon, formatWonKorean } from "@/lib/format";
import { ResultBox, Row } from "./fields";

const pct = (r: number) => `${(r * 100).toFixed(1)}%`;

// 가계부 결과 표시 — 계산은 lib/calc/budget.ts 에서 끝난 값을 보여 주기만 합니다.
export function BudgetResultView({ r }: { r: BudgetResult }) {
  const over = r.balanceMonthly < 0;
  const outflow = r.spendMonthly + r.savingMonthly;
  const base = over ? outflow : r.incomeMonthly; // 막대 전체 길이의 기준
  const segs = [
    { name: "고정 지출", value: r.groups.find((g) => g.key === "fixed")!.monthly, cls: "bg-brand-deep" },
    { name: "변동 지출", value: r.groups.find((g) => g.key === "variable")!.monthly, cls: "bg-brand" },
    { name: "연 1~2회 지출(월 환산)", value: r.groups.find((g) => g.key === "yearly")!.monthly, cls: "bg-brand-soft" },
    { name: "저축·투자", value: r.savingMonthly, cls: "bg-ink" },
    ...(over ? [] : [{ name: "남는 돈", value: r.balanceMonthly, cls: "bg-paper-gray" }]),
  ];
  const maxTop = r.topExpenses[0]?.monthly ?? 0;

  return (
    <ResultBox>
      <p className="text-lg font-bold text-ink">
        {over
          ? `매달 약 ${formatWonKorean(-r.balanceMonthly)}이 부족합니다.`
          : `매달 약 ${formatWonKorean(r.balanceMonthly)}이 남습니다.`}
      </p>
      <p className="mt-1 text-sm text-ink-sub">
        월 수입 {formatWon(r.incomeMonthly)} − 지출 {formatWon(r.spendMonthly)} − 저축·투자 {formatWon(r.savingMonthly)} = {over ? "−" : ""}{formatWon(Math.abs(r.balanceMonthly))}
      </p>

      <div className="mt-4" role="img" aria-label={`${over ? "지출과 저축 합계" : "월 수입"} 대비 항목별 비중: ${segs.map((s) => `${s.name} ${pct(s.value / base)}`).join(", ")}`}>
        <div className="flex h-5 w-full overflow-hidden rounded-full border border-ink/15 bg-paper">
          {segs.filter((s) => s.value > 0).map((s) => (
            <div key={s.name} className={s.cls} style={{ width: `${(s.value / base) * 100}%` }} />
          ))}
        </div>
        <ul className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
          {segs.map((s) => (
            <li key={s.name} className="flex items-center gap-2 text-ink">
              <span className={`inline-block h-3 w-3 shrink-0 rounded-sm border border-ink/20 ${s.cls}`} aria-hidden="true" />
              <span>{s.name}</span>
              <span className="ml-auto font-semibold">{formatWon(s.value)} <span className="font-normal text-ink-sub">({pct(s.value / r.incomeMonthly)})</span></span>
            </li>
          ))}
        </ul>
        {over && <p className="mt-2 text-xs text-ink-sub">부족한 경우 막대는 지출과 저축 합계를 기준으로 그렸고, 괄호의 비율은 월 수입 대비입니다.</p>}
      </div>

      <h3 className="mt-6 font-bold text-ink">핵심 지표</h3>
      <dl className="mt-1">
        <Row label="저축률 (저축·투자 ÷ 월 수입)" value={pct(r.savingsRate)} strong />
        <Row label="지출 비율 (지출 ÷ 월 수입)" value={pct(r.spendMonthly / r.incomeMonthly)} />
        {r.loanRatio !== null && <Row label="소득 대비 대출 상환 비율" value={pct(r.loanRatio)} />}
        {r.insuranceRatio !== null && <Row label="소득 대비 보험료 비율" value={pct(r.insuranceRatio)} />}
        {r.target && (
          <Row
            label={`목표 저축률 ${r.target.pct}% (월 ${formatWon(r.target.amount)}) 대비`}
            value={r.target.gap >= 0 ? `${formatWon(r.target.gap)} 더 저축 중` : `${formatWon(-r.target.gap)} 부족`}
          />
        )}
        {r.emergency && (
          <Row
            label={`비상금 ${formatWon(r.emergency.fund)}`}
            value={r.emergency.months === null ? "월 지출이 0원이라 계산 불가" : `월 지출의 약 ${r.emergency.months.toFixed(1)}개월치`}
          />
        )}
      </dl>

      <h3 className="mt-6 font-bold text-ink">1년으로 환산하면</h3>
      <dl className="mt-1">
        <Row label="연 수입" value={formatWonKorean(r.annual.income)} />
        <Row label="연 지출" value={formatWonKorean(r.annual.spend)} />
        <Row label="연 저축·투자" value={formatWonKorean(r.annual.saving)} />
        <Row label={r.annual.balance < 0 ? "연 부족액" : "연 남는 돈"} value={formatWonKorean(Math.abs(r.annual.balance))} strong />
      </dl>

      {r.topExpenses.length > 0 && (
        <>
          <h3 className="mt-6 font-bold text-ink">가장 큰 지출 항목 (월)</h3>
          <ol className="mt-2 space-y-2">
            {r.topExpenses.map((it, i) => (
              <li key={it.key}>
                <div className="flex justify-between gap-3 text-sm text-ink">
                  <span>{i + 1}. {it.label}</span>
                  <span className="font-semibold">{formatWon(it.monthly)} <span className="font-normal text-ink-sub">({pct(it.monthly / r.incomeMonthly)})</span></span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-paper">
                  <div className="h-2 rounded-full bg-brand" style={{ width: `${(it.monthly / maxTop) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
        </>
      )}

      <details className="mt-6">
        <summary className="min-h-[44px] cursor-pointer py-2 font-bold text-ink">항목별 상세 보기 (월 금액 · 수입 대비)</summary>
        {r.groups.map((g) => {
          const rows = g.items.filter((i) => i.monthly > 0);
          if (!rows.length) return null;
          return (
            <div key={g.key} className="mt-3">
              <p className="text-sm font-semibold text-ink">{g.title} · {formatWon(g.monthly)}</p>
              <dl>
                {rows.map((i) => <Row key={i.key} label={i.label} value={`${formatWon(i.monthly)} (${pct(i.monthly / r.incomeMonthly)})`} />)}
              </dl>
            </div>
          );
        })}
      </details>

      <p className="mt-4 text-xs text-ink-sub">{calcNotices.budget}</p>
    </ResultBox>
  );
}
