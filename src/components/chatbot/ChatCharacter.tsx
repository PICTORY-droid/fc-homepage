// 안내 도우미 캐릭터 — 직접 그린 오리지널(집배원 모자를 쓴 편지봉투). 장식용이라 화면낭독기에서는 숨깁니다.
export function ChatCharacter({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 180" className={`cb-char ${className}`}>
      <rect x="35" y="55" width="130" height="100" rx="18" fill="#fff" stroke="#E8591A" strokeWidth="5" />
      <path d="M45 52 Q100 14 155 52 Z" fill="#E8591A" />
      <rect x="40" y="48" width="120" height="9" rx="4" fill="#C4540A" />
      <circle cx="100" cy="36" r="9" fill="#FFDAC1" stroke="#C4540A" strokeWidth="3" />
      <path d="M40 150 L72 128 M160 150 L128 128" stroke="#E8591A" strokeWidth="4" strokeLinecap="round" fill="none" />
      <g className="cb-eyes">
        <circle cx="78" cy="100" r="5.5" fill="#333" />
        <circle cx="122" cy="100" r="5.5" fill="#333" />
      </g>
      <path d="M90 112 Q100 122 110 112" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      <circle cx="64" cy="112" r="7" fill="#FF883A" opacity=".5" />
      <circle cx="136" cy="112" r="7" fill="#FF883A" opacity=".5" />
    </svg>
  );
}
