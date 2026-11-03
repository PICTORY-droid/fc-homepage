// 토글(펼치기·접기) 표시 화살표 — 사이트 전체가 같은 모양을 씁니다.
// open 을 주면 그 값으로, 안 주면 <details> 의 열림 상태(group-open)로 돌아갑니다.
export function Chevron({ open, className = "" }: { open?: boolean; className?: string }) {
  const turn = open === undefined ? "group-open:rotate-180" : open ? "rotate-180" : "";
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`h-5 w-5 shrink-0 text-brand-deep transition-transform duration-200 motion-reduce:transition-none ${turn} ${className}`}>
      <path d="m5 8 5 5 5-5" />
    </svg>
  );
}
