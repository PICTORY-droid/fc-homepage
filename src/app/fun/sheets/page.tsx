import type { Metadata } from "next";
import Link from "next/link";
import { HubDirectory } from "@/components/fun/hub/HubDirectory";
import { sheetsHub } from "@/config/funHubs";
import { funMetadata } from "@/lib/seo/funMeta";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { CollectionCard } from "@/components/fun/CollectionCard";
import { SHEET_ASPECT, featuredSheets, sheetCardDesc, sheetCollections, sheetDownloadName, sheetFile, sheetLarge, sheetThumb } from "@/config/sheets";
import { textLink } from "@/components/ui/styles";

export const metadata: Metadata = funMetadata({
  title: "엑셀 서식 무료 다운로드 — 가계부·보험 정리표·견적서·취업·소상공인",
  description: "입사 지원 관리표, 퇴직금 계산표, 가계부, 보험 증권 정리표, 견적서, 출석부, 회비 장부까지 — 입력하면 자동으로 계산되는 엑셀 서식과 계절 감성 테마 모음을 무료로 받으세요.",
  path: "/fun/sheets", ogKey: "fun",
});

// 생활·업무 엑셀 서식 허브 — 분야 6개 카드 + 테마 모음 + 추천 서식. 목록은 config/sheets.ts 에서만 옵니다.
export default function SheetsPage() {
  return (
    <>
      <Section as="h1" title="생활·업무 엑셀 서식" lead={`취업·업무·소상공인·가계·학습·모임까지 분야별 서식과 테마 모음이에요. 입력 칸에 적으면 합계와 요약이 자동으로 채워져요.`}>
        <HubDirectory sections={sheetsHub()} searchLabel="엑셀 서식 분야 검색" placeholder="검색 (예: 가계부, 견적서)" />
      </Section>
      <Section tone="card" title="테마 모음" lead="가계부·보험 증권 정리표·저축 플래너·경조사비 장부·용돈기입장·견적서를 계절 감성 디자인으로 만들었어요.">
        <ul data-reveal="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sheetCollections.map((c) => <CollectionCard key={c.item.key} c={c} />)}
        </ul>
      </Section>
      <Section title="추천 서식" lead="많이 찾는 서식부터 골랐어요. 그림을 누르면 입력 화면과 요약 화면을 크게 볼 수 있어요.">
        <ul data-reveal="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSheets.map((t) => (
            <DownloadCard key={t.id} title={t.title} desc={sheetCardDesc(t)} thumb={sheetThumb(t)} zoom={sheetLarge(t)} aspect={SHEET_ASPECT}
              thumbAlt={`${t.title} 엑셀 서식 미리보기`} links={[{ label: "엑셀", href: sheetFile(t), filename: sheetDownloadName(t) }]} />
          ))}
        </ul>
      </Section>
      <Section>
        <p className="text-sm text-ink-sub">엑셀(.xlsx) 파일이에요. 첫 시트 &lsquo;시작하기&rsquo;에 쓰는 방법이 있고, 자동 계산 칸과 요약 시트는 건드리지 않아도 돼요. &lsquo;설정&rsquo; 시트가 있는 서식은 분류·상태 같은 목록을 그곳에서 바꿀 수 있어요.</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className={textLink}>즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
