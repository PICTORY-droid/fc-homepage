import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterOptIn } from "@/components/fun/NewsletterOptIn";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { allPositions, formDocx, formDownloadName, formFile, formLargeFile, getPosition, groupOf, kindLabel, variantDesc, variantNames, variants, type DocKind } from "@/config/forms";

type Props = { params: Promise<{ position: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allPositions.map((p) => ({ position: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPosition((await params).position);
  if (!p) return {};
  return { title: `${p.name} 이력서·자기소개서 Word 양식 10종`, description: `${p.name} 이력서 5종과 자기소개서 5종 — ${p.desc}. 무료 Word 파일.`, alternates: { canonical: `/fun/forms/${p.id}` } };
}

const kinds: DocKind[] = ["resume", "cover"];

// 포지션 페이지 — 이력서 5종 · 자기소개서 5종. 카드마다 한글 이름으로 내려받아요.
export default async function PositionFormsPage({ params }: Props) {
  const p = getPosition((await params).position);
  if (!p) notFound();
  const group = groupOf(p.id);
  return (
    <>
      <Section title={`${p.name} 이력서·자기소개서`} lead={`${group?.label ?? ""} · ${p.desc}`}>
        <nav aria-label="문서 종류 바로가기" className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <a key={k} href={`#${k}`} className="flex min-h-[44px] items-center rounded-full border border-ink/25 bg-paper px-5 text-sm font-bold text-ink hover:bg-paper-gray">{kindLabel[k]} 5종</a>
          ))}
        </nav>
      </Section>
      {kinds.map((k, i) => (
        <Section key={k} id={k} tone={i % 2 ? "card" : undefined} title={`${kindLabel[k]} 5종`}>
          <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {variants.map((v) => (
              <DownloadCard key={v} title={`${v}. ${variantNames[k][v - 1]}`} desc={variantDesc[k][v - 1]} thumb={formFile(p.id, k, v, "jpg")} zoom={formLargeFile(p.id, k, v)} thumbAlt={`${p.name} ${kindLabel[k]} ${variantNames[k][v - 1]} 미리보기`}
                links={[{ label: "Word", href: formDocx(p, k, v), filename: formDownloadName(p, k, v) }]} />
            ))}
          </ul>
        </Section>
      ))}
      <Section>
        <p className="text-sm text-ink-sub">A4 빈 양식이에요. 연한 회색 글씨는 안내 문구이니 지우고 입력하세요. 칸은 글이 길어지면 자동으로 늘어나요.</p>
        <p className="mt-3 text-ink-sub"><Link href="/fun/forms" className="font-semibold text-brand-deep underline">다른 포지션 보기</Link> · <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
      <Section><NewsletterOptIn from={`/fun/forms/${p.id}`} /></Section>
    </>
  );
}
