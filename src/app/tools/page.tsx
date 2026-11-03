import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Notice } from "@/components/ui/Notice";
import { AgeMaturityCalc } from "@/components/calc/AgeMaturityCalc";
import { RetirementCalc } from "@/components/calc/RetirementCalc";
import { CompoundCalc } from "@/components/calc/CompoundCalc";
import { BudgetCalc } from "@/components/calc/BudgetCalc";
import { calcNotices } from "@/config/calculators";
import { site } from "@/config/site";
import { buttonClass, pillClass } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "간편 계산기",
  description: "보험나이·만기·납입기간, 은퇴 후 생활비 부족분, 복리 적립·연금 수령, 가계부를 직접 계산해 보세요.",
};

// 간편 계산기 — 입력값은 브라우저 안에서만 계산하며 서버로 보내지 않습니다.
export default function ToolsPage() {
  return (
    <Section as="h1" title="간편 계산기" lead="직접 넣어 보고 확인하는 참고용 계산기입니다.">
      <div className="space-y-8">
        <Notice>{calcNotices.common}</Notice>
        <nav aria-label="계산기 바로가기" className="flex flex-wrap gap-2 text-sm">
          {[["#age", "보험나이·만기·납입"], ["#retire", "은퇴 생활비 부족분"], ["#compound", "복리 적립·수령"], ["#budget", "가계부"]].map(([h, t]) => (
            <a key={h} href={h} className={pillClass(false)}>{t}</a>
          ))}
        </nav>
        <p className="text-sm text-ink-sub">
          계산기 <strong className="text-ink">제목을 클릭하면</strong> 펼쳐집니다. 다시 클릭하면 접혀요.
        </p>
        <AgeMaturityCalc />
        <RetirementCalc />
        <CompoundCalc />
        <BudgetCalc />
        <div className="rounded-card bg-paper-card p-6 text-center">
          <p className="text-ink">결과가 궁금하거나 더 알아보고 싶으시면 편하게 문의해 주세요.</p>
          <p className="mt-1 text-sm text-ink-sub">{site.notices.promise}</p>
          <Link href="/consult" className={buttonClass("primary", "md", "mt-4")}>상담 신청 페이지로 이동</Link>
        </div>
      </div>
    </Section>
  );
}
