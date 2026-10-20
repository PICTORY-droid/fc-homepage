import type { Metadata } from "next";
import { funMetadata } from "@/lib/seo/funMeta";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SeasonChooser } from "@/components/fun/SeasonChooser";
import { FunPageExtras } from "@/components/fun/FunPageExtras";
import { FunCtaBox } from "@/components/fun/FunCtaBox";
import { stationeryCta } from "@/config/funCta";
import { seasons, stationeryBySeason, stationeryFile } from "@/config/stationery";

export const metadata: Metadata = funMetadata({
  title: "편지지 무료 다운로드 — 감성 편지지 980장 (Word·PNG)",
  description: "계절 편지지 80장과 동물·장소·날씨·커피·창가·정원 주제 편지지 900장(전통문화 500장 포함), 서로 다른 그림의 감성 편지지를 Word 파일로 무료로 내려받아 컴퓨터에서 바로 쓰세요.",
  path: "/fun/stationery", ogKey: "stationery",
});

// 편지지 입구 — 계절 또는 주제를 고르면 그 모음의 상세페이지로 이동합니다.
export default function StationeryPage() {
  const toChoices = (group: "season" | "theme") => seasons.filter((s) => s.group === group).map((s) => {
    const list = stationeryBySeason(s.key);
    return { slug: s.key, label: s.label, count: list.length, href: `/fun/stationery/${s.key}`, lead: s.lead, thumbs: list.slice(0, 3).map((it) => stationeryFile(it, "jpg")) };
  });
  return (
    <>
      <Section title="계절 편지지 80장" lead="봄·여름·가을·겨울 각 20장. 우체국 앞에서 편지 부치던 그 시절의 분위기로 만들었어요. 계절을 골라 들어가 보세요.">
        <SeasonChooser items={toChoices("season")} />
      </Section>
      <Section title="주제 편지지 900장" lead="계절과 상관없이 쓰는 감성 편지지. 한국 전통문화 500 · 장소 100 · 정원과 꽃 100 · 동물 50 · 날씨 50 · 커피 50 · 창가 50장이에요. 제목은 Word에서 원하는 글로 고칠 수 있어요.">
        <SeasonChooser items={toChoices("theme")} />
      </Section>
      <Section><FunCtaBox cta={stationeryCta} from="stationery" /></Section>
      <Section>
        <p className="text-sm text-ink-sub">A4 크기예요. Word 파일은 받는 사람·날짜·본문을 눌러 바로 입력할 수 있고, 줄에 맞춰 글이 써져요. 개인적인 편지와 SNS 공유는 자유롭게 쓰셔도 좋아요.</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
      <Section><FunPageExtras path={"/fun/stationery"} /></Section>
    </>
  );
}
