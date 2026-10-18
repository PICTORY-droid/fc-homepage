import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ConsultForm } from "@/components/consult/ConsultForm";
import { getCategory } from "@/config/categories";

export const metadata: Metadata = { title: "상담 신청" };

type Props = { searchParams: Promise<{ topic?: string }> };

export default async function ConsultPage({ searchParams }: Props) {
  const { topic } = await searchParams;
  const initial = topic && (topic === "other" || getCategory(topic)) ? topic : "health";
  return (
    <Section title="간편 상담 신청" lead="남겨주신 연락처로 희망하신 시간에 연락드립니다.">
      <div className="max-w-xl"><ConsultForm initialTopic={initial} /></div>
    </Section>
  );
}
