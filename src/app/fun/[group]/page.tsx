import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { getGroup, packEntries, packGroups } from "@/config/pack";

type Props = { params: Promise<{ group: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return packGroups.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGroup((await params).group);
  return g ? { title: g.title, description: g.short, alternates: { canonical: `/fun/${g.slug}` } } : {};
}

// 자료 꾸러미 묶음 페이지 — 항목(가계부·견적서 …) 목록. 항목마다 50종 페이지로 이어집니다.
export default async function PackGroupPage({ params }: Props) {
  const g = getGroup((await params).group);
  if (!g) notFound();
  return (
    <>
      <Section title={g.title} lead={g.lead}>
        <ul data-reveal="stagger" className="grid gap-4 sm:grid-cols-2">
          {g.items.map((it) => (
            <li key={it.key}>
              <Link href={`/fun/${g.slug}/${it.key}`} className="group flex h-full flex-col rounded-card border border-ink/10 bg-paper-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
                <span className="text-lg font-bold text-ink">{it.title} <span className="text-sm font-semibold text-brand-deep">{packEntries(it).length}종</span></span>
                <span className="mt-1 text-sm leading-relaxed text-ink-sub">{it.short}</span>
                <span className="mt-3 text-sm font-bold text-brand-deep">골라서 받기 →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <p className="text-sm text-ink-sub">{g.howto}</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
