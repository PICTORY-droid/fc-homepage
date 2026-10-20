import type { Metadata } from "next";
import { funMetadata } from "@/lib/seo/funMeta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { StationeryGrid } from "@/components/fun/StationeryGrid";
import { FunPageExtras } from "@/components/fun/FunPageExtras";
import { FunCtaBox } from "@/components/fun/FunCtaBox";
import { SeasonLinks } from "@/components/fun/SeasonLinks";
import { stationeryCta } from "@/config/funCta";
import { seasons, stationeryBySeason, subsOf } from "@/config/stationery";

type Props = { params: Promise<{ season: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return seasons.map((s) => ({ season: s.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = (await params).season;
  const s = seasons.find((x) => x.key === key);
  if (!s) return {};
  return funMetadata({ title: `${s.label} 편지지 무료 다운로드 ${stationeryBySeason(s.key).length}장`, description: `${s.lead}. ${s.label} 편지지 ${stationeryBySeason(s.key).length}장을 Word·PNG로 무료로 받으세요.`, path: `/fun/stationery/${s.key}`, ogKey: `stationery-${s.key}` });
}

// 계절 상세페이지 — 그 모음의 편지지. 그림을 누르면 큰 미리보기가 열리고, 상담 안내·클릭 기록도 이 페이지 단위로 쌓여요.
export default async function StationerySeasonPage({ params }: Props) {
  const key = (await params).season;
  const s = seasons.find((x) => x.key === key);
  if (!s) notFound();
  const list = stationeryBySeason(s.key);
  const links = seasons.map((x) => ({ slug: x.key, label: x.label, count: stationeryBySeason(x.key).length, href: `/fun/stationery/${x.key}`, group: x.group }));
  return (
    <>
      <Section title={`${s.label} 편지지 ${list.length}장`} lead={s.lead}>
        <SeasonLinks items={links} current={s.key} />
      </Section>
      <Section tone="card">
        <StationeryGrid items={list} subs={subsOf(s.key)} />
      </Section>
      <Section><FunCtaBox cta={stationeryCta} from={`stationery/${s.key}`} /></Section>
      <Section>
        <p className="text-sm text-ink-sub">A4 크기예요. 편지지 속 제목도 Word에서 눌러 원하는 글로 고칠 수 있고, 엽서는 같은 분위기의 그림 한 장이에요. Word 파일은 받는 사람·날짜·본문을 눌러 바로 입력할 수 있고, 줄에 맞춰 글이 써져요. 개인적인 편지와 SNS 공유는 자유롭게 쓰셔도 좋아요.</p>
        <p className="mt-3 text-ink-sub"><Link href="/fun/stationery" className="font-semibold text-brand-deep underline">다른 편지지 고르기</Link> · <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
      <Section><FunPageExtras path={`/fun/stationery/${s.key}`} /></Section>
    </>
  );
}
