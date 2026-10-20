import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ConsultForm } from "@/components/consult/ConsultForm";
import { KakaoBanner } from "@/components/KakaoBanner";
import { getCategory } from "@/config/categories";

export const metadata: Metadata = {
  title: "상담 신청",
  description: "이름과 연락처, 관심 분야를 남기면 희망하신 시간대에 전화로 연락드립니다. 상담 신청만으로 가입이 진행되지 않습니다.",
  alternates: { canonical: "/consult" },
};

type Props = { searchParams: Promise<{ topic?: string }> };

export default async function ConsultPage({ searchParams }: Props) {
  const { topic } = await searchParams;
  const initial = topic && (topic === "other" || getCategory(topic)) ? topic : "health";
  return (
    <Section as="h1" title="간편 상담 신청">
      <div className="mb-8"><KakaoBanner /></div>
      <ConsultForm initialTopic={initial} />
    </Section>
  );
}
