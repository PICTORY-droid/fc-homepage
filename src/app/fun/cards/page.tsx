import type { Metadata } from "next";
import { funMetadata } from "@/lib/seo/funMeta";
import Link from "next/link";
import { HubDirectory } from "@/components/fun/hub/HubDirectory";
import { Section } from "@/components/ui/Section";
import { cardsHub } from "@/config/funHubs";
import { textLink } from "@/components/ui/styles";

export const metadata: Metadata = funMetadata({
  title: "명함 템플릿 무료 다운로드 — 직종별 PPT·SVG",
  description: "직장인·가게 사장님·프리랜서·선생님·공무원·병원·금융까지 10분류, 서로 다른 앞뒤 명함 디자인을 PPT와 SVG로 내려받아 이름과 연락처만 고쳐 쓰세요.",
  path: "/fun/cards", ogKey: "fun",
});

export default function CardsPage() {
  return (
    <>
      <Section as="h1" title="명함 템플릿" lead="직종마다 앞면·뒷면이 서로 다른 명함 디자인이에요. 마음에 드는 장을 PPT나 SVG로 받아 이름과 연락처만 바꾸면 바로 인쇄할 수 있어요.">
        <HubDirectory sections={cardsHub()} searchLabel="명함 분류 검색" placeholder="검색 (예: 카페, 선생님)" />
      </Section>
      <Section>
        <p className="text-sm text-ink-sub">명함 크기는 가로 90mm × 세로 50mm예요. PPT는 파워포인트·한컴 한쇼에서 글을 고치고, SVG는 피그마·캔바·일러스트레이터 같은 디자인 도구에서 열 수 있어요. 인쇄소에는 PDF로 저장해서 보내세요.</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className={textLink}>즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
