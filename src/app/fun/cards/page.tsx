import type { Metadata } from "next";
import { funMetadata } from "@/lib/seo/funMeta";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { CARD_ASPECT, cardCategories, cardThumb } from "@/config/cards";

export const metadata: Metadata = funMetadata({
  title: "명함 템플릿 무료 다운로드 — 직종별 PPT·SVG",
  description: "직장인·가게 사장님·프리랜서·선생님·공무원·병원·금융까지 10분류, 서로 다른 앞뒤 명함 디자인을 PPT와 SVG로 내려받아 이름과 연락처만 고쳐 쓰세요.",
  path: "/fun/cards", ogKey: "fun",
});

export default function CardsPage() {
  return (
    <>
      <Section title="명함 템플릿" lead="직종마다 50장씩, 앞면·뒷면이 서로 다른 명함 디자인이에요. 마음에 드는 장을 PPT나 SVG로 받아 이름과 연락처만 바꾸면 바로 인쇄할 수 있어요.">
        <ul data-reveal="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cardCategories.map((c) => (
            <li key={c.key} className="overflow-hidden rounded-card border border-ink/10 bg-paper">
              <Link href={`/fun/cards/${c.key}`} className="flex h-full flex-col">
                <div className="relative w-full bg-paper-gray" style={{ aspectRatio: CARD_ASPECT }}>
                  <Image src={cardThumb(c.key, 1)} alt={`${c.label} 명함 미리보기`} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw" className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-ink">{c.label}</h3>
                  <p className="mt-1 text-sm leading-snug text-ink-sub">{c.short}</p>
                  <p className="mt-2 text-sm font-semibold text-brand-deep">명함 {c.items.length}장 보기</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <p className="text-sm text-ink-sub">명함 크기는 가로 90mm × 세로 50mm예요. PPT는 파워포인트·한컴 한쇼에서 글을 고치고, SVG는 피그마·캔바·일러스트레이터 같은 디자인 도구에서 열 수 있어요. 인쇄소에는 PDF로 저장해서 보내세요.</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
