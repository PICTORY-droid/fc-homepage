// 자료 종류 × 연령대 표 — 어느 연령대가 어떤 자료를 받았는지. 계산은 features/analytics/interest.ts 에서 끝난 값을 보여 주기만 합니다.
import { AGE_BANDS } from "@/features/analytics/ageBand";
import type { AgeTypeRow } from "@/features/analytics/interest";

const n = (v: number) => v.toLocaleString("ko-KR");

export function AgeTable({ rows }: { rows: AgeTypeRow[] }) {
  return (
    <div className="rounded-card border border-ink/10 bg-paper p-4">
      <h3 className="font-bold text-ink">자료 종류 × 연령대</h3>
      <p className="mt-0.5 text-xs text-ink-sub">자료를 받은 뒤 연령대를 골라 준 경우만 셉니다. 가장 많은 칸을 진하게 표시해요.</p>
      {rows.length === 0 ? <p className="mt-2 text-sm text-ink-sub">아직 응답이 없습니다.</p> : (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="text-ink-sub"><th className="py-1 pr-2 font-semibold">자료 종류</th>{AGE_BANDS.map((b) => <th key={b} className="px-2 text-right font-semibold">{b}</th>)}<th className="pl-2 text-right font-semibold">합계</th></tr></thead>
            <tbody>{rows.map((r) => {
              const max = Math.max(...AGE_BANDS.map((b) => r.bands[b]));
              return (
                <tr key={r.type} className="border-t border-ink/10 text-ink">
                  <td className="py-1.5 pr-2">{r.type}</td>
                  {AGE_BANDS.map((b) => <td key={b} className={`px-2 text-right ${r.bands[b] === max && max > 0 ? "font-bold text-brand-deep" : ""}`}>{n(r.bands[b])}</td>)}
                  <td className="pl-2 text-right font-semibold">{n(r.total)}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
