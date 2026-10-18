import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Notice } from "@/components/ui/Notice";
import { AgeMaturityCalc } from "@/components/calc/AgeMaturityCalc";
import { RetirementCalc } from "@/components/calc/RetirementCalc";
import { CompoundCalc } from "@/components/calc/CompoundCalc";
import { calcNotices } from "@/config/calculators";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "간편 계산기",
  description: "보험나이·만기·납입기간, 은퇴 후 생활비 부족분, 복리 적립·연금 수령을 직접 계산해 보세요.",
};

// 간편 계산기 — 입력값은 브라우저 안에서만 계산하며 서버로 보내지 않습니다.
export default function ToolsPage() {
  return (
    <Section title="간편 계산기" lead="직접 넣어 보고 확인하는 참고용 계산기입니다.">
      <div className="space-y-8">
        <Notice>{calcNotices.common}</Notice>
        <nav aria-label="계산기 바로가기" className="flex flex-wrap gap-2 text-sm">
          {[["#age", "보험나이·만기·납입"], ["#retire", "은퇴 생활비 부족분"], ["#compound", "복리 적립·수령"]].map(([h, t]) => (
            <a key={h} href={h} className="rounded-full bg-paper-gray px-4 py-2 font-semibold text-ink">{t}</a>
          ))}
        </nav>
        <AgeMaturityCalc />
        <RetirementCalc />
        <CompoundCalc />
        <div className="rounded-card bg-paper-card p-6 text-center">
          <p className="text-ink">결과가 궁금하거나 더 알아보고 싶으시면 편하게 문의해 주세요.</p>
          <p className="mt-1 text-sm text-ink-sub">{site.notices.promise}</p>
          <Link href="/consult" className="mt-4 inline-flex min-h-[48px] items-center rounded-xl bg-brand px-6 font-semibold text-ink hover:brightness-95">상담 신청 페이지로 이동</Link>
        </div>
      </div>
    </Section>
  );
}
