import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { funMetadata } from "@/lib/seo/funMeta";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { SHEET_ASPECT, featuredSheets, sheetCardDesc, sheetDownloadName, sheetFile, sheetGroups, sheetLarge, sheetTemplates, sheetThumb } from "@/config/sheets";

export const metadata: Metadata = funMetadata({
  title: "엑셀 서식 무료 다운로드 — 취업·업무·가계부·소상공인 100종",
  description: "입사 지원 관리표, 퇴직금 계산표, 가계부, 매출 장부, 출석부, 회비 장부까지 — 입력하면 자동으로 계산되는 엑셀 서식 100종을 무료로 받으세요.",
  path: "/fun/sheets", ogKey: "fun",
});

// 생활·업무 엑셀 서식 허브 — 분야 6개 카드 + 추천 서식. 목록은 config/sheets.ts 에서만 옵니다.
export default function SheetsPage() {
  return (
    <>
      <Section as="h1" title="생활·업무 엑셀 서식" lead={`취업·업무·소상공인·가계·학습·모임까지 ${sheetGroups.length}개 분야 ${sheetTemplates.length}종이에요. 흰 칸에 입력하면 합계와 요약이 자동으로 채워져요.`}>
        <ul data-reveal="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sheetGroups.map((g) => {
            const cover = g.items.find((t) => t.featured) ?? g.items[0];
            return (
              <li key={g.key} className="overflow-hidden rounded-card border border-ink/10 bg-paper">
                <Link href={`/fun/sheets/${g.key}`} className="flex h-full flex-col">
                  <div className="relative w-full bg-paper-gray" style={{ aspectRatio: SHEET_ASPECT }}>
                    <Image src={sheetThumb(cover)} alt={`${g.label} 엑셀 서식 미리보기`} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-ink">{g.label}</h3>
                    <p className="mt-1 text-sm leading-snug text-ink-sub">{g.short}</p>
                    <p className="mt-2 text-sm font-semibold text-brand-deep">서식 {g.items.length}종 보기</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
      <Section tone="card" title="추천 서식" lead="많이 찾는 서식부터 골랐어요. 그림을 누르면 입력 화면과 요약 화면을 크게 볼 수 있어요.">
        <ul data-reveal="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSheets.map((t) => (
            <DownloadCard key={t.id} title={t.title} desc={sheetCardDesc(t)} thumb={sheetThumb(t)} zoom={sheetLarge(t)} aspect={SHEET_ASPECT}
              thumbAlt={`${t.title} 엑셀 서식 미리보기`} links={[{ label: "엑셀 받기", href: sheetFile(t), filename: sheetDownloadName(t) }]} />
          ))}
        </ul>
      </Section>
      <Section>
        <p className="text-sm text-ink-sub">엑셀(.xlsx) 파일이에요. 첫 시트 &lsquo;시작하기&rsquo;에 쓰는 방법이 있고, 회색 바탕 칸은 자동 계산이니 건드리지 않아도 돼요. &lsquo;설정&rsquo; 시트가 있는 서식은 분류·상태 같은 목록을 그곳에서 바꿀 수 있어요.</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
