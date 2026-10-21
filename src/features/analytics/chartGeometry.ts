// 관리자 그래프 좌표 계산 — 화면(SVG)과 분리된 순수 함수입니다.
export type Pt = { x: number; y: number };
export type Pad = { l: number; r: number; t: number; b: number };

/** 값 목록을 선 그래프 좌표로 바꿉니다. 값이 모두 0이어도 안전합니다. */
export function linePoints(values: number[], w: number, h: number, pad: Pad): { points: Pt[]; max: number; peak: number } {
  const max = Math.max(1, ...values);
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const points = values.map((v, i) => ({
    x: values.length === 1 ? pad.l + innerW / 2 : pad.l + (i * innerW) / (values.length - 1),
    y: pad.t + innerH - (v / max) * innerH,
  }));
  const peak = values.length ? values.indexOf(Math.max(...values)) : -1;
  return { points, max, peak };
}

export type Slice = { key: string; count: number; pct: number; offset: number };

/** 도넛 그래프 조각: 상위 maxSlices-1 개 + 나머지는 "기타". 둘레를 100 으로 보고 비율·시작 위치를 계산합니다. */
export function donutSlices(rows: { key: string; count: number }[], maxSlices = 6): Slice[] {
  const live = rows.filter((r) => r.count > 0).sort((a, b) => b.count - a.count);
  const total = live.reduce((s, r) => s + r.count, 0);
  if (total === 0) return [];
  const head = live.length > maxSlices ? live.slice(0, maxSlices - 1) : live;
  const rest = live.slice(head.length).reduce((s, r) => s + r.count, 0);
  const merged = rest > 0 ? [...head, { key: "기타", count: rest }] : head;
  let acc = 0;
  return merged.map((r) => {
    const pct = (r.count / total) * 100;
    const slice = { key: r.key, count: r.count, pct, offset: 25 - acc }; // 25 = 12시 방향에서 시작
    acc += pct;
    return slice;
  });
}
