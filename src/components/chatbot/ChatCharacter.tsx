// 안내 도우미 캐릭터 — 직접 그린 오리지널(집배원 모자를 쓴 편지봉투). 장식용이라 화면낭독기에서는 숨깁니다.
export function ChatCharacter({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 180" className={`cb-char ${className}`}>
      <rect x="35" y="55" width="130" height="100" rx="18" fill="#fff" stroke="#E8591A" strokeWidth="5" />
      <path d="M45 52 Q100 14 155 52 Z" fill="#E8591A" />
      <rect x="40" y="48" width="120" height="9" rx="4" fill="#C4540A" />
      {/* 모자 앞 우체국 심벌 — 사용 허락을 받은 공식 마크 파일을 모양 변형 없이 그대로 얹습니다(흰 배지 위) */}
      <circle cx="100" cy="35" r="17" fill="#fff" stroke="#C4540A" strokeWidth="3" />
      <image href="/brand/postal-insurance-mark.svg" x="87" y="21" width="26" height="28" preserveAspectRatio="xMidYMid meet" />
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
