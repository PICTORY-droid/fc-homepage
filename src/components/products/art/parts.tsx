import type { CSSProperties, ReactNode } from "react";

// 상품 일러스트 공통 부품 — 모든 부품은 '바닥 가운데(0,0)'에서 위쪽(-y)으로 그려집니다.
// 색·선 굵기·모서리는 여기서만 정하므로, 부품을 조합한 38개 그림의 스타일이 같아집니다. (움직임은 globals.css 의 .art-*)
export const RED = "#D9432F";
export const ORANGE = "#FF883A";
export const PEACH = "#FFDAC1";
export const CREAM = "#FFE9D8";
export const YELLOW = "#FFD98A";
export const WHITE = "#fff";
export const GROUND = 178;

const st = { stroke: RED, strokeWidth: 3.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const delayVar = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

/** 부품을 놓는 자리 — 등장(pop) 효과 + 선택적 반복 움직임(loop) */
export function Put({ x, y = GROUND, s = 1, d = 0, loop, rot, children }: { x: number; y?: number; s?: number; d?: number; loop?: string; rot?: number; children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})${rot ? ` rotate(${rot})` : ""}`}>
      <g className="art-in" style={delayVar(d)}>
        <g className={loop} style={loop ? delayVar(d) : undefined}>{children}</g>
      </g>
    </g>
  );
}

/** 무대 — 배경 원, 반짝이, 바닥선 */
export function Stage({ children, ground = true }: { children: ReactNode; ground?: boolean }) {
  return (
    <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <circle className="art-breathe" cx="120" cy="104" r="86" fill={CREAM} />
      <g stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round">
        <path className="art-twinkle" style={delayVar(0)} d="M28 36v10M23 41h10" />
        <path className="art-twinkle" style={delayVar(0.8)} d="M214 62v10M209 67h10" />
        <path className="art-twinkle" style={delayVar(1.6)} d="M22 122v8M18 126h8" />
      </g>
      {ground && <path className="art-draw" pathLength={1} style={delayVar(0)} d="M18 178h204" stroke={RED} strokeWidth="3" strokeLinecap="round" fill="none" />}
      {children}
    </svg>
  );
}

export const Person = ({ fill = PEACH, hair }: { fill?: string; hair?: boolean }) => (
  <g {...st}>
    <path d="M-17 0V-18a17 17 0 0 1 34 0V0Z" fill={fill} />
    <circle cx="0" cy="-46" r="11" fill={WHITE} />
    {hair && <path d="M-11 -48a11 11 0 0 1 22 0c-6-3-16-3-22 0Z" fill={RED} />}
    <path d="M-4 -44q4 3 8 0" fill="none" strokeWidth="2.5" />
  </g>
);

export const HeartShape = ({ fill = ORANGE }: { fill?: string }) => (
  <path d="M0 8C-14 -2-16 -14-8 -18-4 -20 0 -16 0 -13 0 -16 4 -20 8 -18 16 -14 14 -2 0 8Z" fill={fill} {...st} strokeWidth={2.5} />
);
/** 바닥에 놓는 하트 (크게 쓸 때) */
export const Heart = ({ fill }: { fill?: string }) => <g transform="translate(0 -10)"><HeartShape fill={fill} /></g>;

export const Shield = ({ symbol, label }: { symbol?: "cross" | "heart" | "check" | "text"; label?: string }) => (
  <g>
    <path d="M0 0C-18-6-32-20-32-40v-26L0-78 32-66v26C32-20 18-6 0 0Z" fill={WHITE} {...st} />
    <g transform="translate(0 -40)">
      {symbol === "cross" && <path d="M-6 -14h12v8h8v12h-8v8h-12v-8h-8v-12h8Z" fill={PEACH} {...st} strokeWidth={2.5} />}
      {symbol === "heart" && <HeartShape />}
      {symbol === "check" && <path d="m-12 0 8 8 16-18" fill="none" stroke={ORANGE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />}
      {symbol === "text" && <text textAnchor="middle" y="6" fontSize="17" fontWeight="800" fill={RED} fontFamily="inherit">{label}</text>}
    </g>
  </g>
);

export const Coin = ({ label = "₩", r = 20, fontSize = 18 }: { label?: string; r?: number; fontSize?: number }) => (
  <g transform={`translate(0 ${-r})`}>
    <circle r={r} fill={YELLOW} {...st} />
    <circle r={r - 6} fill="none" stroke={RED} strokeWidth="2" strokeDasharray="2 4" strokeLinecap="round" />
    <text textAnchor="middle" y={fontSize * 0.35} fontSize={fontSize} fontWeight="800" fill={RED} fontFamily="inherit">{label}</text>
  </g>
);

export const Doc = ({ label, lines = 3, w = 52, h = 66 }: { label?: string; lines?: number; w?: number; h?: number }) => (
  <g {...st}>
    <rect x={-w / 2} y={-h} width={w} height={h} rx="7" fill={WHITE} />
    {label && <text x="0" y={-h + 20} textAnchor="middle" fontSize="12" fontWeight="800" fill={RED} stroke="none" fontFamily="inherit">{label}</text>}
    {Array.from({ length: lines }, (_, i) => (
      <path key={i} d={`M${-w / 2 + 9} ${-h + (label ? 32 : 18) + i * 10}h${i === lines - 1 ? w / 2 - 6 : w - 18}`} fill="none" strokeWidth="2.8" />
    ))}
  </g>
);

export const Checklist = () => (
  <g {...st}>
    <rect x="-28" y="-72" width="56" height="72" rx="8" fill={WHITE} />
    <rect x="-12" y="-80" width="24" height="12" rx="5" fill={PEACH} />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(0 ${-52 + i * 18})`}>
        <rect x="-18" y="-6" width="11" height="11" rx="3" fill="none" strokeWidth="2.6" />
        <path d="m-16 0 3 3 5-7" fill="none" stroke={ORANGE} strokeWidth="3" />
        <path d="M-1 0h18" fill="none" strokeWidth="2.8" />
      </g>
    ))}
  </g>
);

export const Umbrella = () => (
  <g {...st}>
    <path d="M-46 -52a46 46 0 0 1 92 0c-8-8-16-8-23 0-7-8-16-8-23 0-7-8-16-8-23 0Z" fill={PEACH} />
    <path d="M0 -52V-6a8 8 0 0 1-16 0" fill="none" />
    <path d="M0 -98v-6" fill="none" />
  </g>
);

export const Car = () => (
  <g {...st}>
    <path d="M-52 -8h104v-16q0-6-6-8l-16-4-14-14h-34l-14 14-14 4q-6 2-6 8Z" fill={WHITE} />
    <path d="M-30 -36h22v-12h-12Z M2 -36h22l-10-12H2Z" fill={PEACH} strokeWidth={2.5} />
    <g className="art-wheel"><circle cx="-30" cy="-6" r="11" fill={WHITE} /><circle cx="-30" cy="-6" r="3" fill={RED} stroke="none" /></g>
    <g className="art-wheel"><circle cx="30" cy="-6" r="11" fill={WHITE} /><circle cx="30" cy="-6" r="3" fill={RED} stroke="none" /></g>
  </g>
);

export const Tooth = () => (
  <g {...st}>
    <path d="M-34 -78c0-18 18-20 34-12 16-8 34-6 34 12 0 26-10 36-13 62-1 10-12 10-13 0-2-16-4-22-8-22s-6 6-8 22c-1 10-12 10-13 0-3-26-13-36-13-62Z" fill={WHITE} />
    <path d="M-20 -72q-6 4-6 12" fill="none" stroke={PEACH} strokeWidth="4" />
  </g>
);

export const Piggy = () => (
  <g {...st}>
    <path d="M-30 -6v-10M-12 -6v-10M12 -6v-10M30 -6v-10" fill="none" />
    <ellipse cx="0" cy="-30" rx="38" ry="26" fill={PEACH} />
    <path d="M-16 -50 -8 -62-2 -50" fill={PEACH} />
    <ellipse cx="40" cy="-30" rx="10" ry="9" fill={WHITE} />
    <circle cx="26" cy="-38" r="2.5" fill={RED} stroke="none" />
    <path d="M-38 -34q-10-4-8 6" fill="none" />
    <path d="M-10 -54h16" fill="none" strokeWidth="4" />
  </g>
);

export const GradCap = () => (
  <g {...st}>
    <path d="M-30 -34v14c0 10 60 10 60 0v-14" fill={PEACH} />
    <path d="M0 -62 50 -44 0 -26-50 -44Z" fill={WHITE} />
    <path d="M50 -44v22" fill="none" />
    <circle cx="50" cy="-18" r="4" fill={ORANGE} />
  </g>
);

export const HardHat = () => (
  <g {...st}>
    <path d="M-48 -6a48 48 0 0 1 96 0Z" fill={YELLOW} />
    <path d="M-52 -6h104" fill="none" strokeWidth="5" />
    <path d="M-10 -52h20v16h-20Z" fill={PEACH} strokeWidth={2.5} />
  </g>
);

export const Gift = () => (
  <g {...st}>
    <rect x="-32" y="-42" width="64" height="42" rx="4" fill={WHITE} />
    <rect x="-37" y="-58" width="74" height="16" rx="4" fill={PEACH} />
    <path d="M0 -58V0" fill="none" />
    <path d="M0 -58c-6-14-22-14-22-6s16 6 22 6Zm0 0c6-14 22-14 22-6s-16 6-22 6Z" fill={ORANGE} />
  </g>
);

export const Building = () => (
  <g {...st}>
    <rect x="-28" y="-96" width="56" height="96" rx="4" fill={WHITE} />
    {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
      <rect key={`${r}${c}`} x={-19 + c * 14} y={-86 + r * 16} width="9" height="9" rx="2" fill={r === 1 && c === 1 ? ORANGE : PEACH} strokeWidth={2} />
    )))}
    <rect x="-8" y="-22" width="16" height="22" rx="3" fill={PEACH} strokeWidth={2.5} />
  </g>
);

export const Drop = () => (
  <g {...st}>
    <path d="M0 -70C-22 -40-30 -28-30 -18a30 30 0 0 0 60 0C30 -28 22 -40 0 -70Z" fill={PEACH} />
    <path d="M-14 -22a14 14 0 0 0 10 12" fill="none" stroke={WHITE} strokeWidth="4" />
  </g>
);

export const Meter = () => (
  <g {...st}>
    <rect x="-20" y="-56" width="40" height="56" rx="8" fill={WHITE} />
    <rect x="-13" y="-48" width="26" height="18" rx="3" fill={PEACH} strokeWidth={2.5} />
    <path d="M-10 -39h5l3-5 4 10 3-5h4" fill="none" stroke={ORANGE} strokeWidth="2.5" />
    <circle cx="0" cy="-16" r="6" fill="none" strokeWidth="2.8" />
  </g>
);

export const Ribbon = () => (
  <g {...st}>
    <path d="M0 -80c-26 0-26 30 0 52 26-22 26-52 0-52Z" fill={PEACH} />
    <path d="M-6 -34-26 0M6 -34 26 0" fill="none" />
  </g>
);

export const Balloon = () => (
  <g {...st}>
    <ellipse cx="0" cy="-70" rx="20" ry="24" fill={ORANGE} />
    <path d="m-4 -46 4 6 4-6Z" fill={ORANGE} strokeWidth={2.5} />
    <path d="M0 -40c-8 10 8 20 0 40" fill="none" strokeWidth="2.5" />
  </g>
);

export const Bed = () => (
  <g {...st}>
    <path d="M-52 0v-34M52 0v-22" fill="none" />
    <rect x="-52" y="-24" width="104" height="14" rx="5" fill={PEACH} />
    <path d="M-52 -24h104" fill="none" />
    <ellipse cx="-30" cy="-32" rx="16" ry="7" fill={WHITE} />
    <circle cx="-30" cy="-46" r="11" fill={WHITE} />
    <path d="M-12 -24c0-12 40-12 64-6v6Z" fill={WHITE} />
  </g>
);

export const Basket = () => (
  <g {...st}>
    <path d="M-40 -34h80l-9 34h-62Z" fill={PEACH} />
    <path d="M-20 -34 -16 0M0 -34V0M20 -34 16 0M-36 -18h72" fill="none" strokeWidth={2.5} />
  </g>
);

export const Sprout = () => (
  <g {...st}>
    <path d="M0 0V-26" fill="none" />
    <path d="M0 -22c-14 0-20-10-18-18 12 0 20 6 18 18Zm0-6c12-2 18-10 16-18-12 2-18 8-16 18Z" fill={ORANGE} />
  </g>
);

export const Bandage = () => (
  <g {...st}>
    <rect x="-34" y="-12" width="68" height="24" rx="12" fill={PEACH} />
    <rect x="-10" y="-12" width="20" height="24" fill={WHITE} strokeWidth={2.5} />
    <path d="M-3 -3h.1M3 -3h.1M-3 4h.1M3 4h.1" strokeWidth="3" />
  </g>
);

export const CoinStack = ({ n = 3 }: { n?: number }) => (
  <g {...st}>
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(0 ${-10 - i * 12})`}>
        <ellipse rx="26" ry="9" fill={YELLOW} />
        <path d="M-26 0v0" />
      </g>
    ))}
  </g>
);

export const Percent = () => (
  <g transform="translate(0 -22)" {...st}>
    <circle r="22" fill={ORANGE} />
    <text textAnchor="middle" y="8" fontSize="24" fontWeight="800" fill={WHITE} stroke="none" fontFamily="inherit">%</text>
  </g>
);

export const Tag = ({ label, w = 46 }: { label: string; w?: number }) => (
  <g {...st}>
    <rect x={-w / 2} y="-26" width={w} height="26" rx="8" fill={WHITE} />
    <text x="0" y="-8" textAnchor="middle" fontSize="12" fontWeight="800" fill={RED} stroke="none" fontFamily="inherit">{label}</text>
  </g>
);

/** 점선 화살표(흐르는 효과) — d 는 SVG 경로 */
export const FlowArrow = ({ d, head }: { d: string; head: string }) => (
  <g fill="none" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path className="art-flow" d={d} strokeDasharray="2 9" />
    <path d={head} />
  </g>
);

export const Ecg = ({ d }: { d: string }) => (
  <path className="art-ecg" pathLength={1} d={d} fill="none" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
);

export const Sparkle = () => <path d="M0 -8v16M-8 0h16" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />;
