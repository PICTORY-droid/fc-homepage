import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { FunCtaBox } from "@/components/fun/FunCtaBox";
import { SeasonLinks } from "@/components/fun/SeasonLinks";
import { stationeryCta } from "@/config/funCta";
import { seasons, stationeryBySeason, stationeryDownloadName, stationeryFile } from "@/config/stationery";

type Props = { params: Promise<{ season: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return seasons.map((s) => ({ season: s.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = (await params).season;
  const s = seasons.find((x) => x.key === key);
  if (!s) return {};
  return { title: `${s.label} 편지지 20장`, description: `${s.lead}. ${s.label}의 기억을 담은 편지지 20장을 Word·PNG로 무료로 받으세요.`, alternates: { canonical: `/fun/stationery/${s.key}` } };
}

// 계절 상세페이지 — 그 계절의 편지지 20장. 그림을 누르면 큰 미리보기가 열리고, 상담 안내·클릭 기록도 이 페이지 단위로 쌓여요.
export default async function StationerySeasonPage({ params }: Props) {
  const key = (await params).season;
  const s = seasons.find((x) => x.key === key);
  if (!s) notFound();
  const list = stationeryBySeason(s.key);
  const links = seasons.map((x) => ({ slug: x.key, label: x.label, count: stationeryBySeason(x.key).length, href: `/fun/stationery/${x.key}` }));
  return (
    <>
      <Section title={`${s.label} 편지지 ${list.length}장`} lead={s.lead}>
        <SeasonLinks items={links} current={s.key} />
      </Section>
      <Section tone="card">
        <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {list.map((it) => (
            <DownloadCard key={it.id} title={it.name} desc={it.tag} thumb={stationeryFile(it, "jpg")} zoom={stationeryFile(it, "png")}
              links={[{ label: "Word", href: stationeryFile(it, "docx"), filename: stationeryDownloadName(it, "docx") }, { label: "PNG", href: stationeryFile(it, "png"), filename: stationeryDownloadName(it, "png") }]} />
          ))}
        </ul>
      </Section>
      <Section><FunCtaBox cta={stationeryCta} from={`stationery/${s.key}`} /></Section>
      <Section>
        <p className="text-sm text-ink-sub">A4 크기예요. Word 파일은 받는 사람·날짜·본문을 눌러 바로 입력할 수 있고, 줄에 맞춰 글이 써져요. 개인적인 편지와 SNS 공유는 자유롭게 쓰셔도 좋아요.</p>
        <p className="mt-3 text-ink-sub"><Link href="/fun/stationery" className="font-semibold text-brand-deep underline">계절 고르기</Link> · <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
