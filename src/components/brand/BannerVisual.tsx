// 배너 오른쪽 장식 그림 (자체 제작, 장식용 — 스크린리더에서는 숨김)
export function BannerVisual() {
  return (
    <svg viewBox="0 0 360 300" className="h-full w-full" aria-hidden="true" focusable="false">
      <circle cx="190" cy="150" r="130" fill="#FFDAC1" />
      <circle cx="285" cy="62" r="26" fill="#FF883A" opacity=".85" />
      <circle cx="62" cy="240" r="18" fill="#FF883A" opacity=".55" />
      <path d="M190 52 276 84v62c0 50-34 86-86 106-52-20-86-56-86-106V84l86-32Z" fill="#fff" stroke="#FF883A" strokeWidth="6" />
      <path d="m146 150 32 32 58-62" fill="none" stroke="#C4540A" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="20" y="96" width="92" height="46" rx="12" fill="#fff" stroke="#EFEFEF" />
      <rect x="32" y="110" width="44" height="7" rx="3.5" fill="#FFDAC1" />
      <rect x="32" y="124" width="62" height="7" rx="3.5" fill="#EFEFEF" />
      <rect x="258" y="196" width="86" height="46" rx="12" fill="#fff" stroke="#EFEFEF" />
      <rect x="270" y="210" width="40" height="7" rx="3.5" fill="#FFDAC1" />
      <rect x="270" y="224" width="58" height="7" rx="3.5" fill="#EFEFEF" />
    </svg>
  );
}
