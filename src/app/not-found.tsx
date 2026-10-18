import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";

// 없는 주소 — 막다른 길이 되지 않도록 주요 이동 경로를 함께 보여줍니다.
export default function NotFound() {
  return (
    <Section title="찾으시는 페이지가 없어요">
      <p className="text-ink-sub">주소가 바뀌었거나 없는 페이지입니다. 아래에서 원하시는 곳으로 이동해 보세요.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">처음으로</ButtonLink>
        <ButtonLink href="/products" variant="outline">보험 상품 보기</ButtonLink>
        <ButtonLink href="/find" variant="outline">보장 찾기</ButtonLink>
        <ButtonLink href="/consult" variant="soft">상담 신청</ButtonLink>
      </div>
      <p className="mt-6 text-sm text-ink-sub">급하시면 {site.contact.fcPhone} · {site.contact.hours}</p>
    </Section>
  );
}
