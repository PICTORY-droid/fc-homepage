import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { UnsubscribeForm } from "@/components/fun/UnsubscribeForm";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "새 양식 알림 해지", robots: { index: false } };

export default function UnsubscribePage() {
  return (
    <Section title="새 양식 알림 해지" lead="알림을 받지 않으시려면 신청하신 연락처를 입력해 주세요. 바로 처리됩니다.">
      <UnsubscribeForm />
      <p className="mt-6 text-sm text-ink-sub">전화로 말씀하셔도 됩니다. {site.contact.fcPhone} · {site.contact.hours}</p>
    </Section>
  );
}
