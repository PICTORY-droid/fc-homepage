// 우체국New건강클리닉보험 — 청진기·진료 차트·심박 그림 (자체 제작, 장식용). 움직임 스타일은 globals.css 의 .art-* 에서 관리합니다.
const RED = "#D9432F";
const PEACH = "#FFDAC1";
const ORANGE = "#FF883A";

type Dash = { d: string; delay: string };
const line = ({ d, delay }: Dash, extra = "") => (
  <path key={d} d={d} pathLength={1} className={`art-draw ${extra}`} style={{ "--d": delay } as React.CSSProperties} />
);

export function HealthClinicArt() {
  return (
    <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      {/* 배경 원 */}
      <circle className="art-breathe" cx="128" cy="100" r="84" fill="#FFE9D8" />

      {/* 반짝이 */}
      <g stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round">
        <path className="art-twinkle" style={{ "--d": "0s" } as React.CSSProperties} d="M30 34v10M25 39h10" />
        <path className="art-twinkle" style={{ "--d": ".8s" } as React.CSSProperties} d="M214 96v10M209 101h10" />
        <path className="art-twinkle" style={{ "--d": "1.6s" } as React.CSSProperties} d="M22 118v8M18 122h8" />
      </g>

      {/* 바닥선 */}
      <path d="M18 178h204" stroke={RED} strokeWidth="3" strokeLinecap="round" fill="none" className="art-draw" style={{ "--d": "0s" } as React.CSSProperties} pathLength={1} />

      {/* 진료 차트 */}
      <g className="art-float-slow">
        <rect x="108" y="40" width="100" height="130" rx="10" fill="#fff" stroke={RED} strokeWidth="3.5" />
        <rect x="140" y="30" width="36" height="16" rx="6" fill={PEACH} stroke={RED} strokeWidth="3.5" />
        <text x="158" y="68" textAnchor="middle" fontSize="13" fontWeight="800" fill={RED} fontFamily="inherit">진료</text>
        <g fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {line({ d: "M122 82h72", delay: ".5s" })}
          {line({ d: "M122 94h72", delay: ".7s" })}
          {line({ d: "M122 106h46", delay: ".9s" })}
        </g>
        {/* 심박 선 — 계속 흐르듯 그려짐 */}
        <path className="art-ecg" pathLength={1} fill="none" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          d="M122 142h16l7-16 9 32 9-26 6 10h25" />
      </g>

      {/* 청진기 */}
      <g className="art-sway" fill="none" stroke={RED} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        {line({ d: "M44 52v32a24 24 0 0 0 48 0V52", delay: ".2s" })}
        {line({ d: "M68 108c0 22-6 26-6 40", delay: ".6s" })}
        <circle cx="62" cy="156" r="11" fill={PEACH} />
        <circle cx="62" cy="156" r="4" fill={RED} stroke="none" />
        <circle cx="44" cy="48" r="5" fill="#fff" />
        <circle cx="92" cy="48" r="5" fill="#fff" />
      </g>

      {/* 하트 */}
      <path className="art-beat" d="M196 52c-3.5-6-12-3.4-12 3.2 0 6 8 10.6 12 14 4-3.4 12-8 12-14 0-6.6-8.5-9.2-12-3.2Z"
        fill={ORANGE} stroke={RED} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}
