import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { stationery, stationeryFile } from "@/config/stationery";

export const metadata: Metadata = {
  title: "감성 편지지 10종",
  description: "우체국 감성의 편지지 10종을 무료로 내려받아 인쇄하거나 휴대폰으로 써 보세요. (PNG·PDF)",
  alternates: { canonical: "/fun/stationery" },
};

export default function StationeryPage() {
  return (
    <>
      <Section title="감성 편지지 10종" lead="마음을 전하고 싶은 날, 한 장 골라 써 보세요. 컴퓨터에서 쓰려면 Word, 인쇄는 PDF, 휴대폰·메신저는 PNG가 편해요.">
        <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stationery.map((s) => (
            <DownloadCard key={s.id} title={s.name} desc={s.desc} thumb={stationeryFile(s.id, "jpg")}
              links={[{ label: "PDF", href: stationeryFile(s.id, "pdf"), filename: `감성편지지-${s.name}.pdf` }, { label: "Word", href: stationeryFile(s.id, "docx"), filename: `감성편지지-${s.name}.docx` }, { label: "PNG", href: stationeryFile(s.id, "png"), filename: `감성편지지-${s.name}.png` }]} />
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-sub">A4 크기로 만들었어요. 인쇄할 때 "실제 크기"로 설정하면 가장 예쁘게 나와요. 개인적인 편지와 SNS 공유는 자유롭게 쓰셔도 좋아요.</p>
      </Section>
      <Section tone="card">
        <p className="text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
