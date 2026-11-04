import type { Metadata } from "next";
import { funMetadata } from "@/lib/seo/funMeta";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { HubDirectory } from "@/components/fun/hub/HubDirectory";
import { FunPageExtras } from "@/components/fun/FunPageExtras";
import { FunCtaBox } from "@/components/fun/FunCtaBox";
import { stationeryCta } from "@/config/funCta";
import { stationeryHub } from "@/config/funHubs";
import { textLink } from "@/components/ui/styles";

export const metadata: Metadata = funMetadata({
  title: "편지지 무료 다운로드 — 감성 편지지 (Word·PNG)",
  description: "꽃빛·초록빛·노을빛·포근빛 계절 편지지와 전통문화·동물·장소·하늘·커피·창가·정원 주제 편지지, 서로 다른 그림의 감성 편지지를 Word 파일로 무료로 내려받아 컴퓨터에서 바로 쓰세요.",
  path: "/fun/stationery", ogKey: "stationery",
});

// 편지지 입구 — 빛깔 또는 주제를 고르면 그 모음의 상세페이지로 이동합니다.
export default function StationeryPage() {
  const sections = stationeryHub();
  return (
    <>
      <Section as="h1" title="감성 편지지" lead="계절 편지지와 한국 전통문화·장소·정원·동물·하늘·커피·창가 주제 편지지예요. 빛깔이나 주제를 눌러 펼쳐 보고, 마음에 드는 묶음으로 들어가세요.">
        <HubDirectory sections={sections} searchLabel="편지지 검색" placeholder="검색 (예: 꽃빛, 커피, 전통)" />
      </Section>
      <Section><FunCtaBox cta={stationeryCta} from="stationery" /></Section>
      <Section>
        <p className="text-sm text-ink-sub">A4 크기예요. Word 파일은 받는 사람·본문을 눌러 바로 입력할 수 있고, 줄에 맞춰 글이 써져요. 개인적인 편지와 SNS 공유는 자유롭게 쓰셔도 좋아요.</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className={textLink}>즐길거리 전체 보기</Link></p>
      </Section>
      <Section><FunPageExtras path={"/fun/stationery"} /></Section>
    </>
  );
}
