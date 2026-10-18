"use client";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";

// 예기치 못한 오류 화면 — 내부 오류 내용은 표시하지 않음
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <Section title="일시적인 오류가 발생했어요">
      <p className="mb-6 text-ink-sub">잠시 후 다시 시도해 주세요. 급하시면 {site.contact.fcPhone} 로 전화 주세요.</p>
      <button onClick={reset} className="min-h-[48px] rounded-xl bg-brand px-6 font-semibold text-ink">다시 시도</button>
    </Section>
  );
}
