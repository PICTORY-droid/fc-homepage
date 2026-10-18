import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { FindWizard } from "@/components/find/FindWizard";

export const metadata: Metadata = {
  title: "내게 맞는 보장 찾기",
  description: "3가지 질문에 답하면 함께 살펴볼 보험 분야와 관련 상품을 안내합니다.",
};

export default function FindPage() {
  return (
    <Section title="내게 맞는 보장 찾기" lead="30초면 끝나는 3가지 질문입니다. 개인정보는 수집하지 않아요.">
      <div className="max-w-3xl"><FindWizard /></div>
    </Section>
  );
}
