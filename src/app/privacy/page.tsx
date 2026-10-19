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
          <dt className="font-bold">2-1. 민감정보 (선택 수집)</dt>
          <dd className="text-ink-sub">{p.sensitiveItems} 일반 개인정보 동의와 별도로 동의를 받으며, 동의하지 않아도 상담 신청이 가능합니다. 목적은 보장 상담에 한정되며 목적 달성 시 지체 없이 파기합니다.</dd>
        </div>
        <div>
          <dt className="font-bold">3. 보유 및 이용 기간</dt>
          <dd className="text-ink-sub">
            {p.retentionMonths ? `상담 신청일로부터 ${p.retentionMonths}개월간 보관하며, 이후 지체 없이 파기합니다.` : "상담 목적이 달성되면 지체 없이 파기합니다. (구체적 기간은 확정 후 안내)"}
          </dd>
        </div>
        <div><dt className="font-bold">4. 제3자 제공</dt><dd className="text-ink-sub">법령에 근거가 있는 경우를 제외하고 제3자에게 제공하지 않습니다.</dd></div>
        <div><dt className="font-bold">5. 동의 거부 권리</dt><dd className="text-ink-sub">동의를 거부할 수 있으며, 거부 시 온라인 상담 신청이 제한됩니다. 전화로 문의하실 수 있습니다.</dd></div>
        <div><dt className="font-bold">6. 이용 통계(비식별)</dt><dd className="text-ink-sub">서비스 개선을 위해 자료 내려받기·전화·카카오톡 문의 버튼을 누른 횟수와 상담 신청의 시작·완료 횟수를 집계합니다. 이름·연락처·IP 주소와 연결하지 않으며, 광고나 개인 식별에 쓰지 않습니다.</dd></div>
        <div>
          <dt className="font-bold">7. 새 양식 알림 (선택, 광고성 정보 수신 동의)</dt>
          <dd className="text-ink-sub">새 양식 소식을 {site.newsletter.channel}로 보내기 위해 연락처만 수집하며, 동의일로부터 {site.newsletter.retentionMonths}개월간 보관한 뒤 파기합니다. 동의하지 않아도 자료를 받는 데 지장이 없으며, <a className="underline" href="/unsubscribe">해지 페이지</a>나 전화로 언제든 수신을 거부할 수 있습니다. 상담 신청 정보와는 따로 보관합니다.</dd>
        </div>
        <div><dt className="font-bold">8. 문의</dt><dd className="text-ink-sub">{site.contact.fcPhone}{p.contactEmail ? ` / ${p.contactEmail}` : ""}</dd></div>
      </dl>
    </Section>
  );
}
