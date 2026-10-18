import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section title="페이지를 찾을 수 없어요">
      <p className="mb-6 text-ink-sub">주소가 바뀌었거나 없는 페이지입니다.</p>
      <ButtonLink href="/">처음으로</ButtonLink>
    </Section>
  );
}
