import { getBanner, type BannerKey } from "@/config/banners";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { BannerVisual } from "@/components/brand/BannerVisual";

const delay = (s: string) => ({ "--d": s }) as React.CSSProperties;

// 페이지 상단 배너 — 페이지당 상품 1개. 문구/상품은 config/banners.ts 에서만 수정합니다.
// 모바일: 문구와 일러스트를 하나의 이미지 카드로 묶어 보여줍니다. (md 이상은 좌우 2단)
export function PageBanner({ bannerKey }: { bannerKey: BannerKey }) {
  const b = getBanner(bannerKey);
  const topic = bannerKey === "home" ? "health" : bannerKey;
  return (
    <section className="bg-gradient-to-b from-brand-soft/70 to-paper" aria-label="대표 상품 안내">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-6 sm:px-6 sm:py-16 md:grid-cols-[1.2fr_1fr]">
        <div>
          {/* 이미지 카드(모바일) — 문구는 그림 안에 들어갑니다 */}
          <div className="max-md:relative max-md:overflow-hidden max-md:rounded-3xl max-md:bg-gradient-to-br max-md:from-brand-soft max-md:to-paper max-md:px-5 max-md:pt-7 max-md:shadow-sm max-md:ring-1 max-md:ring-brand/15">
            <p style={delay("0s")} className="hero-rise inline-block rounded-full bg-paper px-3 py-1 text-xs font-semibold text-brand-deep sm:text-sm md:px-4">
              대표 상품 · {b.product}
            </p>
            <h1 style={delay(".1s")} className="hero-rise mt-4 whitespace-pre-line break-keep text-[1.75rem] font-extrabold leading-snug text-ink sm:text-5xl md:mt-5 md:leading-tight">{b.headline}</h1>
            <p style={delay(".2s")} className="hero-rise mt-3 max-w-xl break-keep text-base text-ink-sub md:mt-4 md:text-lg">{b.sub}</p>
            <div className="mx-auto mt-2 h-48 w-full max-w-[18rem] md:hidden"><BannerVisual /></div>
          </div>
          <div style={delay(".3s")} className="hero-rise mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
            <ButtonLink href={b.ctaHref ?? `/consult?topic=${topic}`}>{b.cta}</ButtonLink>
            <ButtonLink href={b.detailPath} variant="outline">상품 상세보기</ButtonLink>
          </div>
          <ul style={delay(".4s")} className="hero-rise mt-6 flex flex-wrap gap-2" aria-label="상담 원칙">
            {site.trust.map((t) => (
              <li key={t} className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink shadow-sm">✓ {t}</li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-ink-sub">
            {site.notices.premium}{" "}
            {site.reviewNo ? `· 심의필 ${site.reviewNo}` : process.env.NODE_ENV !== "production" ? "· 심의번호 미입력(개발용)" : ""}
          </p>
        </div>
        <div className="hidden h-72 md:block"><BannerVisual /></div>
      </div>
    </section>
  );
}
