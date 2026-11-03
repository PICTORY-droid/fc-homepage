import type { Metadata } from "next";
import { funMetadata } from "@/lib/seo/funMeta";
import Link from "next/link";
import { CardCta } from "@/components/ui/CardCta";
import { notFound, permanentRedirect } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { EXCEL_PACK, getGroup, packEntries, packGroups } from "@/config/pack";
import { cardLinkClass, textLink } from "@/components/ui/styles";

type Props = { params: Promise<{ group: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return packGroups.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGroup((await params).group);
  return g ? funMetadata({ title: `${g.title} 무료 다운로드`, description: g.short, path: `/fun/${g.slug}`, ogKey: "fun" }) : {};
}

// 자료 꾸러미 묶음 페이지 — 항목(가계부·견적서 …) 목록. 항목마다 50종 페이지로 이어집니다.
export default async function PackGroupPage({ params }: Props) {
  const g = getGroup((await params).group);
  if (!g) notFound();
  if (g.slug === EXCEL_PACK) permanentRedirect("/fun/sheets"); // 엑셀 양식은 생활·업무 엑셀 서식으로 옮겨 감
  return (
    <>
      <Section as="h1" title={g.title} lead={g.lead}>
        <ul data-reveal="stagger" className="grid gap-4 sm:grid-cols-2">
          {g.items.map((it) => (
            <li key={it.key}>
              <Link href={`/fun/${g.slug}/${it.key}`} className={`flex h-full flex-col p-5 outline-none ${cardLinkClass}`}>
                <span className="text-lg font-bold text-ink">{it.title}</span>
                <span className="mt-1 text-sm leading-relaxed text-ink-sub">{it.short}</span>
                <CardCta className="mt-3">{packEntries(it).length}종 보기</CardCta>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <p className="text-sm text-ink-sub">{g.howto}</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className={textLink}>즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
