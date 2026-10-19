import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { seasons, stationeryBySeason, stationeryDownloadName, stationeryFile } from "@/config/stationery";

export const metadata: Metadata = {
  title: "계절 편지지 80장",
  description: "봄·여름·가을·겨울 각 20장, 서로 다른 그림의 감성 편지지를 Word 파일로 무료로 내려받아 컴퓨터에서 바로 쓰세요.",
  alternates: { canonical: "/fun/stationery" },
};

export default function StationeryPage() {
  return (
    <>
      <Section title="계절 편지지 80장" lead="봄·여름·가을·겨울 각 20장. 우체국 앞에서 편지 부치던 그 시절의 분위기로 만들었어요. 한 장을 Word로 받아 바로 쓰고, 휴대폰에는 PNG가 편해요.">
        <nav aria-label="계절 바로가기" className="flex flex-wrap gap-2">
          {seasons.map((s) => (
            <a key={s.key} href={`#${s.key}`} className="flex min-h-[44px] items-center rounded-full border border-ink/25 bg-paper px-5 text-sm font-bold text-ink hover:bg-paper-gray">{s.label} 20장</a>
          ))}
        </nav>
      </Section>
      {seasons.map((s, i) => (
        <Section key={s.key} id={s.key} tone={i % 2 ? "card" : undefined} title={`${s.label} 편지지`} lead={s.lead}>
          <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {stationeryBySeason(s.key).map((it) => (
              <DownloadCard key={it.id} title={it.name} desc={it.tag} thumb={stationeryFile(it, "jpg")}
                links={[{ label: "Word", href: stationeryFile(it, "docx"), filename: stationeryDownloadName(it, "docx") }, { label: "PNG", href: stationeryFile(it, "png"), filename: stationeryDownloadName(it, "png") }]} />
            ))}
          </ul>
        </Section>
      ))}
      <Section>
        <p className="text-sm text-ink-sub">A4 크기예요. Word 파일은 받는 사람·날짜·본문을 눌러 바로 입력할 수 있고, 줄에 맞춰 글이 써져요. 개인적인 편지와 SNS 공유는 자유롭게 쓰셔도 좋아요.</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
