// 자료 관심도 표 — 미리보기·다운로드·받은 비율. 계산은 features/analytics/interest.ts 에서 끝난 값을 보여 주기만 합니다.
import type { InterestRow } from "@/features/analytics/interest";

const n = (v: number) => v.toLocaleString("ko-KR");

export function InterestTable({ title, lead, rows, firstCol }: { title: string; lead?: string; rows: InterestRow[]; firstCol: string }) {
  return (
    <div className="rounded-card border border-ink/10 bg-paper p-4">
      <h3 className="font-bold text-ink">{title}</h3>
      {lead && <p className="mt-0.5 text-xs text-ink-sub">{lead}</p>}
      {rows.length === 0 ? <p className="mt-2 text-sm text-ink-sub">아직 기록이 없습니다.</p> : (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="text-ink-sub"><th className="py-1 pr-2 font-semibold">{firstCol}</th><th className="px-2 text-right font-semibold">미리보기</th><th className="px-2 text-right font-semibold">다운로드</th><th className="pl-2 text-right font-semibold">받은 비율</th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.key} className="border-t border-ink/10 text-ink">
                <td className="break-all py-1.5 pr-2">{r.key}</td>
                <td className="px-2 text-right">{n(r.previews)}</td>
                <td className="px-2 text-right font-semibold">{n(r.downloads)}</td>
                <td className="pl-2 text-right">{r.rate === null ? "—" : `${r.rate}%`}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
