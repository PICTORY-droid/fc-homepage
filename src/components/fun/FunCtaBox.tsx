import Link from "next/link";
import type { FunCta } from "@/config/funCta";
import { buttonClass } from "@/components/ui/styles";

// 자료 받기 페이지 끝의 상담 안내 — 눌러서 상담 신청으로 이동하며, 클릭 수가 통계(cta_click)에 기록됩니다.
export function FunCtaBox({ cta, from }: { cta: FunCta; from: string }) {
  return (
    <aside aria-label="상담 안내" className="rounded-card border border-brand/40 bg-brand-soft p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-ink">{cta.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-sub">{cta.text}</p>
        <p className="mt-1 text-xs text-ink-sub">상담만으로 가입이 진행되지 않아요. 보험 가입은 직접 판단해 결정하세요.</p>
      </div>
      <Link href={`/consult?topic=${cta.topic}`} data-track="cta" data-label={from}
        className={buttonClass("primary", "md", "mt-4 w-full shrink-0 sm:mt-0 sm:w-auto")}>
        {cta.button}
      </Link>
    </aside>
  );
}
