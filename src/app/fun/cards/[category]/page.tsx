import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { DownloadCard } from "@/components/fun/DownloadCard";
import { FunCtaBox } from "@/components/fun/FunCtaBox";
import { CARD_ASPECT, cardCategories, cardDownloadName, cardPptx, cardSvg, cardThumb, getCardCategory } from "@/config/cards";
import { getCardCta } from "@/config/funCta";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return cardCategories.map((c) => ({ category: c.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCardCategory((await params).category);
  if (!c) return {};
  return { title: `${c.label} 명함 템플릿 ${c.items.length}장`, description: `${c.short}. 앞뒤 디자인이 모두 다른 ${c.items.length}장을 PPT·SVG로 무료로 받으세요.`, alternates: { canonical: `/fun/cards/${c.key}` } };
}

// 분류 페이지 — 명함 50장. 그림을 누르면 앞·뒤 큰 미리보기가 열리고, PPT와 SVG(앞/뒤)를 한글 이름으로 받아요.
export default async function CardCategoryPage({ params }: Props) {
  const c = getCardCategory((await params).category);
  if (!c) notFound();
  const cta = getCardCta(c.key);
  return (
    <>
      <Section title={`${c.label} 명함`} lead={`${c.short} — 앞뒤 디자인이 모두 다른 ${c.items.length}장이에요.`}>
        <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {c.items.map((e) => (
            <DownloadCard key={e.no} title={`${String(e.no).padStart(2, "0")}. ${e.title}`} desc={e.tag} thumb={cardThumb(c.key, e.no)} zoom={cardThumb(c.key, e.no)} aspect={CARD_ASPECT}
              thumbAlt={`${c.label} 명함 ${e.no}번 ${e.theme} 앞면과 뒷면 미리보기`}
              links={[
                { label: "PPT", href: cardPptx(c.key, e.no), filename: cardDownloadName(e, "pptx") },
                { label: "SVG", href: cardSvg(c.key, e.no), filename: cardDownloadName(e, "svg") },
              ]} />
          ))}
        </ul>
      </Section>
      {cta && <Section><FunCtaBox cta={cta} from={`cards/${c.key}`} /></Section>}
      <Section>
        <p className="text-sm text-ink-sub">명함 크기는 90mm × 50mm예요. 파일의 이름·직함·연락처는 예시이니 내 정보로 바꿔 쓰세요. PPT는 1쪽이 앞면, 2쪽이 뒷면이고, SVG는 한 파일에 앞면(위)과 뒷면(아래)이 함께 들어 있어요. SVG는 피그마·일러스트레이터 같은 디자인 도구용이에요. 글꼴은 맑은 고딕·바탕이고, 다른 글꼴로 바꾸면 줄이 달라질 수 있어요.</p>
        <p className="mt-3 text-ink-sub"><Link href="/fun/cards" className="font-semibold text-brand-deep underline">다른 분류 보기</Link> · <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
