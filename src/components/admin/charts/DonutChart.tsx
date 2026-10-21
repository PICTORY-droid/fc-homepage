import { donutSlices } from "@/features/analytics/chartGeometry";

type Props = { title: string; rows: { key: string; count: number }[]; unit: string; empty?: string };

// 색만으로 구분하지 않도록 오른쪽 목록에 이름·숫자·% 를 함께 보여줍니다.
const COLORS = ["#FF883A", "#1F2937", "#2B8A7E", "#6C5CE7", "#D64F7A", "#8A94A6"];
const R = 15.9155; // 둘레 = 100

// 비율 도넛 그래프 — 외부 라이브러리 없이 SVG 로 서버에서 그립니다.
export function DonutChart({ title, rows, unit, empty = "아직 기록이 없습니다." }: Props) {
  const slices = donutSlices(rows, COLORS.length);
  const total = slices.reduce((s, x) => s + x.count, 0);
  return (
    <div className="rounded-card border border-ink/10 bg-paper p-4">
      <h3 className="font-bold text-ink">{title}</h3>
      {slices.length === 0 ? <p className="mt-2 text-sm text-ink-sub">{empty}</p> : (
        <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row">
          <svg viewBox="0 0 42 42" className="h-36 w-36 shrink-0" role="img" aria-label={`${title}: ${slices.map((s) => `${s.key} ${Math.round(s.pct)}%`).join(", ")}`}>
            <circle cx="21" cy="21" r={R} fill="none" stroke="#000" strokeOpacity="0.06" strokeWidth="6" />
            {slices.map((s, i) => (
              <circle key={s.key} cx="21" cy="21" r={R} fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth="6"
                strokeDasharray={`${s.pct} ${100 - s.pct}`} strokeDashoffset={s.offset}><title>{`${s.key} · ${s.count}${unit}`}</title></circle>
            ))}
            <text x="21" y="21.5" textAnchor="middle" fontSize="6" fontWeight="700" fill="#111">{total.toLocaleString("ko-KR")}</text>
            <text x="21" y="27" textAnchor="middle" fontSize="3" fill="#666">{unit} 합계</text>
          </svg>
          <ul className="w-full min-w-0 space-y-1.5 text-sm">
            {slices.map((s, i) => (
              <li key={s.key} className="flex items-center gap-2 text-ink">
                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} aria-hidden="true" />
                <span className="min-w-0 flex-1 break-all">{s.key}</span>
                <span className="shrink-0 font-semibold">{s.count.toLocaleString("ko-KR")}</span>
                <span className="w-10 shrink-0 text-right text-ink-sub">{Math.round(s.pct)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
