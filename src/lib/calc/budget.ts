import { collect, fail, parseNum, succeed, type NumOptions, type Outcome } from "./result";

// 가계부 계산 — 항목 정의(config)를 받아 계산하는 순수 함수. 화면·저장소와 무관합니다.
export type GroupKind = "income" | "fixed" | "variable" | "yearly" | "saving";
export type ItemTag = "loan" | "insurance";

export interface BudgetItemDef {
  key: string;
  label: string;
  /** 입력 단위. 기본은 월 금액, "yearly" 는 1년 합계를 넣으면 12로 나눠 월 환산 */
  period?: "monthly" | "yearly";
  /** 비율 지표용 표시 (대출 상환 비율, 보험료 비율) */
  tag?: ItemTag;
  help?: string;
}
export interface BudgetGroupDef { key: GroupKind; title: string; lead: string; items: BudgetItemDef[] }

export interface BudgetItemResult { key: string; label: string; groupKey: GroupKind; monthly: number; annual: number }
export interface BudgetGroupResult { key: GroupKind; title: string; monthly: number; annual: number; items: BudgetItemResult[] }

export interface BudgetResult {
  groups: BudgetGroupResult[];
  incomeMonthly: number;
  spendMonthly: number;       // 고정 + 변동 + 연 1회성(월 환산)
  savingMonthly: number;
  balanceMonthly: number;     // 수입 − 지출 − 저축·투자 (음수면 부족)
  annual: { income: number; spend: number; saving: number; balance: number };
  /** 월 수입 대비 비율(0~1). 수입이 0이면 계산하지 않으므로 항상 유효 */
  shares: { fixed: number; variable: number; yearly: number; saving: number };
  savingsRate: number;
  loanRatio: number | null;       // 대출 항목이 하나도 없으면 null
  insuranceRatio: number | null;
  target: { pct: number; amount: number; gap: number } | null; // gap = 실제 저축 − 목표 저축
  emergency: { fund: number; months: number | null } | null;   // months = 비상금 ÷ 월 지출
  topExpenses: BudgetItemResult[];
}

export const MAX_ITEM = 1_000_000_000;
export const EXTRA_KEYS = { targetPct: "targetPct", emergency: "emergency" } as const;

const itemSpec = (label: string): NumOptions => ({ label, min: 0, max: MAX_ITEM, integer: true, required: false });
const toMonthly = (item: BudgetItemDef, v: number) => (item.period === "yearly" ? Math.round(v / 12) : v);
const toAnnual = (item: BudgetItemDef, v: number) => (item.period === "yearly" ? v : v * 12);

// 입력 중에 보여 주는 그룹 월 합계 (잘못된 값은 0으로 보고 오류는 내지 않음)
export function previewGroupMonthly(raw: Record<string, string>, group: BudgetGroupDef): number {
  return group.items.reduce((sum, it) => {
    const r = parseNum(raw[it.key] ?? "", itemSpec(it.label));
    return sum + (r.ok && r.value ? toMonthly(it, r.value) : 0);
  }, 0);
}

export function computeBudget(raw: Record<string, string>, groups: BudgetGroupDef[]): Outcome<BudgetResult> {
  const specs: Record<string, NumOptions> = {};
  const inputs: Record<string, string> = {};
  for (const g of groups) for (const it of g.items) { specs[it.key] = itemSpec(it.label); inputs[it.key] = raw[it.key] ?? ""; }
  specs[EXTRA_KEYS.targetPct] = { label: "목표 저축률", min: 0, max: 100, required: false };
  specs[EXTRA_KEYS.emergency] = { label: "현재 비상금", min: 0, max: 100 * MAX_ITEM, integer: true, required: false };
  inputs[EXTRA_KEYS.targetPct] = raw[EXTRA_KEYS.targetPct] ?? "";
  inputs[EXTRA_KEYS.emergency] = raw[EXTRA_KEYS.emergency] ?? "";

  const { values, errors } = collect(inputs, specs);
  if (Object.keys(errors).length) return fail(errors);

  const results: BudgetGroupResult[] = groups.map((g) => {
    const items: BudgetItemResult[] = g.items.map((it) => {
      const v = values[it.key] ?? 0;
      return { key: it.key, label: it.label, groupKey: g.key, monthly: toMonthly(it, v), annual: toAnnual(it, v) };
    });
    return { key: g.key, title: g.title, monthly: items.reduce((s, i) => s + i.monthly, 0), annual: items.reduce((s, i) => s + i.annual, 0), items };
  });

  const sumKind = (k: GroupKind, f: "monthly" | "annual") => results.filter((g) => g.key === k).reduce((s, g) => s + g[f], 0);
  const incomeMonthly = sumKind("income", "monthly");
  if (incomeMonthly <= 0) return fail({ form: "월 수입을 한 가지 이상 입력해 주세요. 수입이 있어야 비율을 계산할 수 있어요." });

  const spendKinds: GroupKind[] = ["fixed", "variable", "yearly"];
  const spendMonthly = spendKinds.reduce((s, k) => s + sumKind(k, "monthly"), 0);
  const savingMonthly = sumKind("saving", "monthly");
  const balanceMonthly = incomeMonthly - spendMonthly - savingMonthly;
  const spendAnnual = spendKinds.reduce((s, k) => s + sumKind(k, "annual"), 0);
  const incomeAnnual = sumKind("income", "annual");
  const savingAnnual = sumKind("saving", "annual");

  const tagged = (tag: ItemTag) => {
    const defs = groups.flatMap((g) => g.items).filter((i) => i.tag === tag);
    if (!defs.length) return null;
    const total = results.flatMap((g) => g.items).filter((i) => defs.some((d) => d.key === i.key)).reduce((s, i) => s + i.monthly, 0);
    return total / incomeMonthly;
  };

  const targetPct = values[EXTRA_KEYS.targetPct];
  const target = targetPct === null ? null : (() => {
    const amount = Math.round((incomeMonthly * targetPct) / 100);
    return { pct: targetPct, amount, gap: savingMonthly - amount };
  })();
  const fund = values[EXTRA_KEYS.emergency];
  const emergency = fund === null ? null : { fund, months: spendMonthly > 0 ? fund / spendMonthly : null };

  const topExpenses = results
    .filter((g) => spendKinds.includes(g.key))
    .flatMap((g) => g.items)
    .filter((i) => i.monthly > 0)
    .sort((a, b) => b.monthly - a.monthly)
    .slice(0, 5);

  return succeed({
    groups: results, incomeMonthly, spendMonthly, savingMonthly, balanceMonthly,
    annual: { income: incomeAnnual, spend: spendAnnual, saving: savingAnnual, balance: incomeAnnual - spendAnnual - savingAnnual },
    shares: {
      fixed: sumKind("fixed", "monthly") / incomeMonthly, variable: sumKind("variable", "monthly") / incomeMonthly,
      yearly: sumKind("yearly", "monthly") / incomeMonthly, saving: savingMonthly / incomeMonthly,
    },
    savingsRate: savingMonthly / incomeMonthly,
    loanRatio: tagged("loan"), insuranceRatio: tagged("insurance"),
    target, emergency, topExpenses,
  });
}
