import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { funMetadata } from "@/lib/seo/funMeta";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { FunPageExtras } from "@/components/fun/FunPageExtras";
import { CollectionCard } from "@/components/fun/CollectionCard";
import { PillNav } from "@/components/fun/PillNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { SHEET_ASPECT, getSheetGroup, sheetCardDesc, sheetDownloadName, sheetFile, sheetGroups, sheetLarge, sheetThumb } from "@/config/sheets";
import { textLink } from "@/components/ui/styles";

type Props = { params: Promise<{ group: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sheetGroups.map((g) => ({ group: g.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getSheetGroup((await params).group);
  if (!g) return {};
  return funMetadata({ title: `${g.label} 엑셀 서식 무료 다운로드`, description: `${g.short} — 입력하면 자동으로 계산되는 ${g.label} 엑셀 서식을 무료로 받으세요.`, path: `/fun/sheets/${g.key}`, ogKey: "fun" });
}

// 분야 페이지 — 테마 모음(디자인 50가지 묶음)이 있으면 먼저 보여 주고, 아래에 서식 카드 목록. 그림을 누르면 입력·요약 화면이 크게 열리고, 엑셀 파일을 한글 이름으로 받아요.
export default async function SheetGroupPage({ params }: Props) {
  const g = getSheetGroup((await params).group);
  if (!g) notFound();
  const path = `/fun/sheets/${g.key}`;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([["홈", "/"], ["즐길거리", "/fun"], ["엑셀 서식", "/fun/sheets"], [g.label, path]])} />
      <Section as="h1" title={`${g.label} 엑셀 서식`} lead={`${g.short}${g.collections.length ? " — 서식과 테마 모음이 함께 있어요." : ""}`}>
        <PillNav label="엑셀 서식 분야" current={g.key} items={sheetGroups.map((x) => ({ key: x.key, label: x.label, href: `/fun/sheets/${x.key}` }))} />
        {g.collections.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-ink">테마 모음</h2>
            <p className="mt-1 text-sm text-ink-sub">같은 양식을 계절 감성 디자인으로 만들었어요. 마음에 드는 색을 골라 받으세요.</p>
            <ul data-reveal="stagger" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.collections.map((c) => <CollectionCard key={c.item.key} c={c} />)}
            </ul>
          </div>
        )}
        {g.collections.length > 0 && <h2 className="mb-4 text-lg font-bold text-ink">서식</h2>}
        <ul data-reveal="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {g.items.map((t, i) => (
            <DownloadCard key={t.id} priority={i < 2} title={t.title} desc={sheetCardDesc(t)} thumb={sheetThumb(t)} zoom={sheetLarge(t)} aspect={SHEET_ASPECT}
              thumbAlt={`${t.title} 엑셀 서식 미리보기`} links={[{ label: "엑셀", href: sheetFile(t), filename: sheetDownloadName(t) }]} />
          ))}
        </ul>
      </Section>
      <Section>
        <p className="text-sm text-ink-sub">첫 시트 &lsquo;시작하기&rsquo;에 쓰는 방법이 있어요. 입력 칸에 적으면 합계와 요약 화면이 자동으로 채워지고, 들어 있는 내용은 예시이니 지우고 쓰세요.</p>
        <p className="mt-3 text-ink-sub"><Link href="/fun/sheets" className={textLink}>다른 분야 보기</Link> · <Link href="/fun" className={textLink}>즐길거리 전체 보기</Link></p>
      </Section>
      <Section><FunPageExtras path={path} /></Section>
    </>
  );
}
