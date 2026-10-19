import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PackCard } from "@/components/fun/PackCard";
import { FunCtaBox } from "@/components/fun/FunCtaBox";
import { getFunCta } from "@/config/funCta";
import { entriesBySeason, getGroup, getItem, packEntries, packGroups, packSeasons } from "@/config/pack";

type Props = { params: Promise<{ group: string; item: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return packGroups.flatMap((g) => g.items.map((i) => ({ group: g.slug, item: i.key })));
}

const find = async (params: Props["params"]) => {
  const p = await params;
  const group = getGroup(p.group);
  const item = group && getItem(group, p.item);
  return group && item ? { group, item } : null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = await find(params);
  if (!f) return {};
  const n = packEntries(f.item).length;
  return { title: `${f.item.title} ${n}종`, description: f.item.short, alternates: { canonical: `/fun/${f.group.slug}/${f.item.key}` } };
}

// 항목 페이지 — 계절 순서로 정리한 50가지 테마 카드. 카드마다 한글 이름으로 내려받아요.
export default async function PackItemPage({ params }: Props) {
  const f = await find(params);
  if (!f) notFound();
  const { group, item } = f;
  const total = packEntries(item).length;
  const cta = getFunCta(group.slug, item.key);
  return (
    <>
      <Section title={`${item.title} ${total}종`} lead={item.short}>
        <nav aria-label="계절 바로가기" className="flex flex-wrap gap-2">
          {packSeasons.map((s) => (
            <a key={s} href={`#${s}`} className="flex min-h-[44px] items-center rounded-full border border-ink/25 bg-paper px-5 text-sm font-bold text-ink hover:bg-paper-gray">{s} {entriesBySeason(item, s).length}종</a>
          ))}
        </nav>
      </Section>
      {packSeasons.map((s, i) => (
        <Section key={s} id={s} tone={i % 2 ? "card" : undefined} title={`${s}의 감성`}>
          <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {entriesBySeason(item, s).map((e) => <PackCard key={e.no} item={item} entry={e} />)}
          </ul>
        </Section>
      ))}
      {cta && <Section><FunCtaBox cta={cta} from={`${group.slug}/${item.key}`} /></Section>}
      <Section>
        <p className="text-sm text-ink-sub">{group.howto}</p>
        <p className="mt-3 text-ink-sub"><Link href={`/fun/${group.slug}`} className="font-semibold text-brand-deep underline">{group.title} 목록으로</Link> · <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
