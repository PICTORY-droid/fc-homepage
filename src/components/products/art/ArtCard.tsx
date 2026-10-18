import type { ReactNode } from "react";

// 상품 일러스트 카드 틀 — 문구(상품명·핵심 문구)는 HTML 글자로 넣어 선명하게 보이게 합니다.
export function ArtCard({ name, headline, tags, children }: { name: string; headline?: string; tags?: string[]; children: ReactNode }) {
  return (
    <div className="relative flex aspect-[9/16] w-full flex-col bg-[#FFF4EC] px-5 pb-5 pt-[3.75rem] text-left lg:aspect-auto lg:h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/postal-insurance-logo.svg" alt="우체국보험" width={156} height={63} className="absolute left-5 top-4 h-7 w-auto" />
      {tags && tags.length > 0 && (
        <p className="text-xs font-bold text-brand-deep">{tags.join(" · ")}</p>
      )}
      {headline && <p className="mt-2 text-lg font-extrabold leading-snug text-[#D9432F]">{headline}</p>}
      <p className="mt-1 text-xs text-ink-sub">{name}</p>
      <div className="my-3 min-h-0 flex-1">{children}</div>
      <p className="rounded-xl border-2 border-[#D9432F]/70 bg-paper px-3 py-3 text-sm font-bold text-ink">
        자세한 보장 내용은 <span className="text-[#D9432F]">편하게 상담 주세요</span>
      </p>
    </div>
  );
}
