import { linePoints } from "@/features/analytics/chartGeometry";

type Props = { title: string; unit: string; data: { label: string; value: number }[] };

const W = 320;
const H = 150;
const PAD = { l: 8, r: 8, t: 22, b: 8 };
const LINE = "#C4540A";
const FILL = "#FF883A";

// 날짜별 추이 선 그래프 — 외부 라이브러리 없이 SVG 로 서버에서 그립니다.
export function TrendChart({ title, unit, data }: Props) {
  const values = data.map((d) => d.value);
  const { points, max, peak } = linePoints(values, W, H, PAD);
  const total = values.reduce((s, v) => s + v, 0);
  const avg = data.length ? total / data.length : 0;
  const line = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const base = H - PAD.b;
  const area = points.length ? `M${points[0].x.toFixed(1)},${base} L${line.replaceAll(" ", " L")} L${points.at(-1)!.x.toFixed(1)},${base} Z` : "";
  const top = peak >= 0 ? points[peak] : null;
  const showDots = data.length <= 31;

  return (
    <div className="rounded-card border border-ink/10 bg-paper p-4">
      <h3 className="font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-sub">
        합계 <b className="text-ink">{total.toLocaleString("ko-KR")}{unit}</b> · 하루 평균 <b className="text-ink">{avg.toFixed(1)}{unit}</b>
        {peak >= 0 && values[peak] > 0 && <> · 가장 많은 날 <b className="text-ink">{values[peak]}{unit}</b> ({data[peak].label.slice(5)})</>}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-40 w-full" role="img" aria-label={`${title}: 합계 ${total}${unit}, 하루 평균 ${avg.toFixed(1)}${unit}, 가장 많은 날 ${max}${unit}`}>
        {[0, 0.5, 1].map((g) => {
          const y = PAD.t + (H - PAD.t - PAD.b) * g;
          return <line key={g} x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="#000" strokeOpacity="0.08" strokeDasharray={g === 1 ? undefined : "3 4"} />;
        })}
        {area && <path d={area} fill={FILL} fillOpacity="0.18" />}
        {points.length > 1 && <polyline points={line} fill="none" stroke={LINE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
        {showDots && points.map((p, i) => (
          <circle key={data[i].label} cx={p.x} cy={p.y} r="2.4" fill={LINE}><title>{`${data[i].label} · ${data[i].value}${unit}`}</title></circle>
        ))}
        {top && values[peak] > 0 && (
          <g>
            <circle cx={top.x} cy={top.y} r="4.5" fill="#fff" stroke={LINE} strokeWidth="2" />
            <text x={Math.min(Math.max(top.x, 16), W - 16)} y={top.y - 9} textAnchor="middle" fontSize="11" fontWeight="700" fill={LINE}>{values[peak]}</text>
          </g>
        )}
      </svg>
      <p className="flex justify-between text-xs text-ink-sub"><span>{data[0]?.label}</span><span>{data.at(-1)?.label}</span></p>
    </div>
  );
}
