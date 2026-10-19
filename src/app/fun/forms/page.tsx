import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { formDownloadName, formFile, jobGroups, kindLabel, type DocKind } from "@/config/forms";

export const metadata: Metadata = {
  title: "직업별 이력서·자기소개서 Word 양식",
  description: "직업 10군, 포지션 20개별 이력서·자기소개서 Word 양식 40종을 무료로 내려받아 컴퓨터에서 바로 입력하세요.",
  alternates: { canonical: "/fun/forms" },
};

const kinds: DocKind[] = ["resume", "cover"];

export default function FormsPage() {
  return (
    <>
      <Section title="직업별 이력서·자기소개서" lead="직업 10군 · 포지션 20개마다 항목과 질문이 다른 Word 양식이에요. 칸을 눌러 바로 입력하면 칸이 자동으로 늘어나요.">
        <nav aria-label="직업군 바로가기" className="flex flex-wrap gap-2">
          {jobGroups.map((g) => (
            <a key={g.key} href={`#${g.key}`} className="flex min-h-[44px] items-center rounded-full border border-ink/25 bg-paper px-4 text-sm font-bold text-ink hover:bg-paper-gray">{g.label}</a>
          ))}
        </nav>
      </Section>
      {jobGroups.map((g, i) => (
        <Section key={g.key} id={g.key} tone={i % 2 ? "card" : undefined} title={g.label} lead={`${g.positions[0].name} · ${g.positions[1].name}`}>
          <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {g.positions.flatMap((p) => kinds.map((k) => (
              <DownloadCard key={`${k}-${p.id}`} title={`${p.name} ${kindLabel[k]}`} desc={k === "resume" ? p.desc : `${p.name}에게 자주 묻는 질문 5가지`} thumb={formFile(p.id, k, "jpg")}
                links={[{ label: "Word", href: formFile(p.id, k, "docx"), filename: formDownloadName(p, k) }]} />
            )))}
          </ul>
        </Section>
      ))}
      <Section>
        <p className="text-sm text-ink-sub">A4 크기 빈 양식이에요. Word 파일을 열어 칸을 눌러 입력하세요. 주민등록번호 등 민감한 개인정보는 제출할 때 꼭 필요한 경우에만 적으세요.</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
