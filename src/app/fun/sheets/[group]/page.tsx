import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { funMetadata } from "@/lib/seo/funMeta";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { FunPageExtras } from "@/components/fun/FunPageExtras";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { SHEET_ASPECT, getSheetGroup, sheetCardDesc, sheetDownloadName, sheetFile, sheetGroups, sheetLarge, sheetThumb } from "@/config/sheets";

type Props = { params: Promise<{ group: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sheetGroups.map((g) => ({ group: g.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getSheetGroup((await params).group);
  if (!g) return {};
  return funMetadata({ title: `${g.label} 엑셀 서식 무료 다운로드 ${g.items.length}종`, description: `${g.short} — 입력하면 자동으로 계산되는 ${g.label} 엑셀 서식 ${g.items.length}종을 무료로 받으세요.`, path: `/fun/sheets/${g.key}`, ogKey: "fun" });
}

// 분야 페이지 — 서식 카드 목록. 그림을 누르면 입력·요약 화면이 크게 열리고, 엑셀 파일을 한글 이름으로 받아요.
export default async function SheetGroupPage({ params }: Props) {
  const g = getSheetGroup((await params).group);
  if (!g) notFound();
  const path = `/fun/sheets/${g.key}`;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([["홈", "/"], ["즐길거리", "/fun"], ["엑셀 서식", "/fun/sheets"], [g.label, path]])} />
      <Section as="h1" title={`${g.label} 엑셀 서식`} lead={`${g.short} — ${g.items.length}종이에요.`}>
        <nav aria-label="엑셀 서식 분야" className="mb-6 flex flex-wrap gap-2">
          {sheetGroups.map((x) => (
            <Link key={x.key} href={`/fun/sheets/${x.key}`} aria-current={x.key === g.key ? "page" : undefined}
              className={`flex min-h-[44px] items-center rounded-full border px-4 text-sm font-bold ${x.key === g.key ? "border-ink bg-ink text-paper" : "border-ink/25 bg-paper text-ink hover:bg-paper-gray"}`}>
              {x.label}
            </Link>
          ))}
        </nav>
        <ul data-reveal="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {g.items.map((t) => (
            <DownloadCard key={t.id} title={t.title} desc={sheetCardDesc(t)} thumb={sheetThumb(t)} zoom={sheetLarge(t)} aspect={SHEET_ASPECT}
              thumbAlt={`${t.title} 엑셀 서식 미리보기`} links={[{ label: "엑셀 받기", href: sheetFile(t), filename: sheetDownloadName(t) }]} />
          ))}
        </ul>
      </Section>
      <Section>
        <p className="text-sm text-ink-sub">첫 시트 &lsquo;시작하기&rsquo;에 쓰는 방법이 있어요. 흰 칸에 입력하면 회색 바탕 칸과 요약 화면이 자동으로 채워지고, 들어 있는 내용은 예시이니 지우고 쓰세요.</p>
        <p className="mt-3 text-ink-sub"><Link href="/fun/sheets" className="font-semibold text-brand-deep underline">다른 분야 보기</Link> · <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
      <Section><FunPageExtras path={path} /></Section>
    </>
  );
}
