// 배너 그림 5종 — 모두 직접 그린 장식용 SVG (스크린리더에서는 숨김). 색은 테마에서 받습니다.
import type { HeroArtKey, HeroTheme } from "@/config/heroSlides";

const Frame = ({ t, children }: { t: HeroTheme; children: React.ReactNode }) => (
  <svg viewBox="0 0 360 300" className="h-full w-full" aria-hidden="true" focusable="false">
    <circle cx="190" cy="152" r="132" fill={t.soft} opacity=".75" />
    <circle cx="190" cy="152" r="96" fill="#fff" opacity=".55" />
    <circle className="fx-float" cx="292" cy="58" r="22" fill={t.accent} opacity=".8" />
    <circle className="fx-float-slow" cx="58" cy="238" r="15" fill={t.accent} opacity=".5" />
    <circle className="fx-float-slow" cx="318" cy="228" r="9" fill={t.soft} />
    {children}
  </svg>
);

const Card = ({ x, y, w, t }: { x: number; y: number; w: number; t: HeroTheme }) => (
  <g className="fx-float-slow">
    <rect x={x} y={y} width={w} height="46" rx="12" fill="#fff" stroke="#fff" opacity=".95" />
    <rect x={x + 12} y={y + 14} width={w * 0.45} height="7" rx="3.5" fill={t.soft} />
    <rect x={x + 12} y={y + 28} width={w * 0.65} height="7" rx="3.5" fill="#ECEFF4" />
  </g>
);

const art: Record<HeroArtKey, (t: HeroTheme) => React.ReactNode> = {
  // 방패 + 체크 — 보장 점검
  shield: (t) => (
    <>
      <path className="fx-pop" d="M190 52 276 84v62c0 50-34 86-86 106-52-20-86-56-86-106V84l86-32Z" fill="#fff" stroke={t.accent} strokeWidth="6" />
      <path className="fx-draw" d="m146 150 32 32 58-62" fill="none" stroke={t.deep} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <Card x={20} y={96} w={92} t={t} />
      <Card x={258} y={196} w={86} t={t} />
    </>
  ),
  // 풍선 + 종이비행기 — 자녀
  balloon: (t) => (
    <>
      <g className="fx-float">
        <ellipse cx="160" cy="124" rx="52" ry="62" fill={t.accent} />
        <ellipse cx="144" cy="104" rx="12" ry="20" fill="#fff" opacity=".45" />
        <path d="M160 186 150 202h20Z" fill={t.accent} />
        <path d="M160 202c-8 22 8 34 0 60" fill="none" stroke={t.deep} strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="fx-float-slow">
        <ellipse cx="236" cy="150" rx="38" ry="46" fill="#FFD76A" />
        <ellipse cx="224" cy="136" rx="9" ry="15" fill="#fff" opacity=".5" />
        <path d="M236 196 229 207h14Z" fill="#FFD76A" />
        <path d="M236 207c-6 16 6 26 0 44" fill="none" stroke={t.deep} strokeWidth="3" strokeLinecap="round" />
      </g>
      <path className="fx-float" d="m52 96 78-30-26 58-14-22Z" fill="#fff" stroke={t.deep} strokeWidth="4" strokeLinejoin="round" />
      <path d="m90 102 14-22" stroke={t.deep} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  // 하트 — 산모·신생아
  heart: (t) => (
    <>
      <path className="art-beat" d="M190 236C128 190 102 160 102 124c0-26 20-44 44-44 18 0 34 10 44 26 10-16 26-26 44-26 24 0 44 18 44 44 0 36-26 66-88 112Z" fill={t.accent} />
      <path d="M130 112c0-14 10-24 22-24" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity=".6" />
      <path className="fx-float" d="M68 118c-18-12-28-22-28-34 0-9 7-15 15-15 6 0 10 3 13 8 3-5 7-8 13-8 8 0 15 6 15 15 0 12-10 22-28 34Z" fill="#fff" stroke={t.accent} strokeWidth="4" />
      <path className="fx-float-slow" d="M318 210c-12-8-18-14-18-22 0-6 4-10 10-10 4 0 6 2 8 5 2-3 4-5 8-5 6 0 10 4 10 10 0 8-6 14-18 22Z" fill="#fff" stroke={t.accent} strokeWidth="3" />
    </>
  ),
  // 해돋이 — 노후 준비
  sunrise: (t) => (
    <>
      <g className="art-breathe">
        <circle cx="190" cy="168" r="56" fill="#FFE08A" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = Math.PI + (Math.PI / 8) * i;
          return <path key={i} d={`M${190 + Math.cos(a) * 70} ${168 + Math.sin(a) * 70}L${190 + Math.cos(a) * 88} ${168 + Math.sin(a) * 88}`} stroke="#FFD15C" strokeWidth="6" strokeLinecap="round" />;
        })}
      </g>
      <clipPath id="hero-sun-clip"><circle cx="190" cy="152" r="132" /></clipPath>
      <g clipPath="url(#hero-sun-clip)">
        <path d="M40 232c46-44 94-58 150-34 46 22 90 8 130-26v140H40Z" fill={t.accent} opacity=".85" />
        <path d="M40 256c52-30 100-34 150-12 44 20 86 10 130-10v90H40Z" fill={t.deep} opacity=".85" />
      </g>
      <Card x={24} y={70} w={92} t={t} />
    </>
  ),
  // 편지봉투 + 동전 — 목돈 마련
  envelope: (t) => (
    <>
      <g className="fx-pop">
        <rect x="88" y="104" width="204" height="130" rx="16" fill="#fff" stroke={t.accent} strokeWidth="6" />
        <path d="m96 116 94 66 94-66" fill="none" stroke={t.accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path className="art-beat" d="M190 214c-22-16-30-24-30-34 0-8 6-13 13-13 7 0 12 4 17 11 5-7 10-11 17-11 7 0 13 5 13 13 0 10-8 18-30 34Z" fill={t.accent} transform="translate(0 -4) scale(1)" />
      </g>
      <g className="fx-float">
        <ellipse cx="300" cy="104" rx="30" ry="11" fill="#FFD76A" />
        <path d="M270 104v14c0 6 13 11 30 11s30-5 30-11v-14" fill="#FFC93C" />
        <ellipse cx="300" cy="92" rx="30" ry="11" fill="#FFE08A" />
        <ellipse cx="300" cy="92" rx="30" ry="11" fill="none" stroke="#FFC93C" strokeWidth="3" />
      </g>
      <Card x={22} y={190} w={86} t={t} />
    </>
  ),
};

export function HeroArt({ kind, theme }: { kind: HeroArtKey; theme: HeroTheme }) {
  return <Frame t={theme}>{art[kind](theme)}</Frame>;
}
