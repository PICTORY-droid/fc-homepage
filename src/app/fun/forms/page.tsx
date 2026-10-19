import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { formTemplates, formFile } from "@/config/forms";

export const metadata: Metadata = {
  title: "이력서·자기소개서 양식 10종",
  description: "이력서 5종, 자기소개서 5종 빈 양식을 PDF로 무료로 내려받아 인쇄하거나 PDF 앱에서 바로 작성해 보세요.",
  alternates: { canonical: "/fun/forms" },
};

const groups = [
  { kind: "이력서" as const, title: "이력서 5종", lead: "상황에 맞게 골라 쓰세요. 신입·경력·한 장 요약까지 준비했어요." },
  { kind: "자기소개서" as const, title: "자기소개서 5종", lead: "문항형부터 자유 서술형까지, 줄과 칸이 잡혀 있어 쓰기 편해요." },
];

export default function FormsPage() {
  return (
    <>
      {groups.map((g, i) => (
        <Section key={g.kind} tone={i === 1 ? "card" : undefined} title={g.title} lead={g.lead}>
          <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {formTemplates.filter((f) => f.kind === g.kind).map((f) => (
              <DownloadCard key={f.id} title={f.name} desc={`${f.desc} · A4 ${f.pages}쪽`} thumb={formFile(f.id, "jpg")}
                links={[{ label: "PDF", href: formFile(f.id, "pdf"), filename: `${f.kind}양식-${f.name}.pdf` }]} />
            ))}
          </ul>
        </Section>
      ))}
      <Section>
        <p className="text-sm text-ink-sub">A4 크기 빈 양식이에요. 인쇄해서 손으로 쓰거나, PDF 앱에서 글자를 입력해 작성할 수 있어요. 주민등록번호 등 민감한 개인정보는 제출할 때 꼭 필요한 경우에만 적으세요.</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
