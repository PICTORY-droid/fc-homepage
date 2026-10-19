import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ConsultForm } from "@/components/consult/ConsultForm";
import { KakaoBanner } from "@/components/KakaoBanner";
import { getCategory } from "@/config/categories";

export const metadata: Metadata = { title: "상담 신청" };

type Props = { searchParams: Promise<{ topic?: string }> };

export default async function ConsultPage({ searchParams }: Props) {
  const { topic } = await searchParams;
  const initial = topic && (topic === "other" || getCategory(topic)) ? topic : "health";
  return (
    <Section title="간편 상담 신청">
      <div className="mb-8"><KakaoBanner /></div>
      <ConsultForm initialTopic={initial} />
    </Section>
  );
}
