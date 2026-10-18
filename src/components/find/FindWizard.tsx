"use client";
import { useEffect, useRef } from "react";
import { AGE_OPTIONS, CONCERN_OPTIONS, WHO_OPTIONS } from "@/config/finder";
import { getCategory } from "@/config/categories";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { useFinder } from "@/features/find/useFinder";

const choice = "flex min-h-[56px] w-full items-center rounded-xl border border-ink/20 bg-paper px-5 py-3 text-left text-base text-ink hover:border-brand-deep hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";
const TITLES = ["누구를 위한 보장인가요?", "연령대를 알려 주세요", "가장 마음에 걸리는 것은 무엇인가요?"];

// 내게 맞는 보장 찾기 — 3개 문항 후 관련 분야·상품을 보여줍니다. (추천이 아니라 살펴볼 곳을 안내)
export function FindWizard() {
  const f = useFinder();
  const ref = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } ref.current?.focus(); }, [f.step]);

  if (f.step === 3 && f.result) {
    const names = f.result.topics.map((t) => getCategory(t)?.title ?? "기타").join(" · ");
    const primary = f.result.topics[0] ?? "other";
    return (
      <div>
        <h2 ref={ref} tabIndex={-1} className="text-2xl font-bold text-ink outline-none">함께 살펴볼 분야: {names}</h2>
        <p className="mt-2 text-ink-sub">선택하신 내용과 관련된 상품이에요. 어떤 보장이 필요한지는 가입 중인 보험과 상황에 따라 달라서, 상담에서 함께 확인하시는 것을 권해드려요.</p>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {f.result.products.map((p) => <ProductCard key={p.id} product={p} />)}
        </ul>
        {f.result.products.length === 0 && <p className="mt-6 text-ink-sub">관련 상품을 찾지 못했어요. 상담 신청으로 문의해 주세요.</p>}
        <div className="mt-8 space-y-4">
          <Notice>가입 가능 여부와 보험료는 나이·건강상태·가입 조건에 따라 달라집니다. 가입 전 상품설명서와 약관을 꼭 확인하세요.</Notice>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/consult?topic=${primary}`}>이 분야로 상담 신청</ButtonLink>
            <ButtonLink href="/products" variant="outline">전체 상품 보기</ButtonLink>
            <button type="button" onClick={f.restart} className="min-h-[48px] rounded-xl px-6 text-base font-semibold text-ink underline">다시 해보기</button>
          </div>
        </div>
      </div>
    );
  }

  const step = f.step;
  return (
    <div>
      <p className="text-sm font-semibold text-brand-deep" aria-live="polite">{step + 1} / 3</p>
      <h2 ref={ref} tabIndex={-1} className="mt-1 text-2xl font-bold text-ink outline-none">{TITLES[step]}</h2>
      <div className={`mt-6 grid gap-3 ${step === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {step === 0 && WHO_OPTIONS.map((o) => (
          <button key={o.value} type="button" className={choice} aria-pressed={f.who === o.value} onClick={() => f.pickWho(o.value)}>{o.label}</button>
        ))}
        {step === 1 && AGE_OPTIONS.map((o) => (
          <button key={o.value} type="button" className={choice} aria-pressed={f.ageBand === o.value} onClick={() => f.pickAge(o.value)}>{o.label}</button>
        ))}
        {step === 2 && CONCERN_OPTIONS.map((o) => (
          <button key={o.value} type="button" className={choice} aria-pressed={f.concern === o.value} onClick={() => f.pickConcern(o.value)}>
            <span><b className="block">{o.label}</b><span className="text-sm text-ink-sub">{o.hint}</span></span>
          </button>
        ))}
      </div>
      {step > 0 && <button type="button" onClick={f.back} className="mt-6 min-h-[44px] text-base font-semibold text-ink underline">이전 문항</button>}
    </div>
  );
}
