import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "개인정보처리방침" };

// 초안입니다. 보유 기간·문의처는 config/site.ts 에서 확정하고, 운영 전 소속 기관 기준을 확인하세요.
export default function PrivacyPage() {
  const p = site.privacy;
  return (
    <Section title="개인정보처리방침">
      <dl className="space-y-6 text-ink">
        <div><dt className="font-bold">1. 수집·이용 목적</dt><dd className="text-ink-sub">{p.purpose}</dd></div>
        <div><dt className="font-bold">2. 수집 항목</dt><dd className="text-ink-sub">{p.items}</dd></div>
        <div>
          <dt className="font-bold">3. 보유 및 이용 기간</dt>
          <dd className="text-ink-sub">
            {p.retentionMonths ? `상담 종료 후 ${p.retentionMonths}개월간 보관하며, 이후 지체 없이 파기합니다.` : "상담 목적이 달성되면 지체 없이 파기합니다. (구체적 기간은 확정 후 안내)"}
          </dd>
        </div>
        <div><dt className="font-bold">4. 제3자 제공</dt><dd className="text-ink-sub">법령에 근거가 있는 경우를 제외하고 제3자에게 제공하지 않습니다.</dd></div>
        <div><dt className="font-bold">5. 동의 거부 권리</dt><dd className="text-ink-sub">동의를 거부할 수 있으며, 거부 시 온라인 상담 신청이 제한됩니다. 전화로 문의하실 수 있습니다.</dd></div>
        <div><dt className="font-bold">6. 문의</dt><dd className="text-ink-sub">{site.contact.fcPhone}{p.contactEmail ? ` / ${p.contactEmail}` : ""}</dd></div>
      </dl>
    </Section>
  );
}
