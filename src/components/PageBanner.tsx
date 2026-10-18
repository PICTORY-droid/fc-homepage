import { getBanner, type BannerKey } from "@/config/banners";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { BannerVisual } from "@/components/brand/BannerVisual";

// 페이지 상단 배너 — 페이지당 상품 1개. 문구/상품은 config/banners.ts 에서만 수정합니다.
export function PageBanner({ bannerKey }: { bannerKey: BannerKey }) {
  const b = getBanner(bannerKey);
  const topic = bannerKey === "home" ? "health" : bannerKey;
  return (
    <section className="bg-gradient-to-b from-brand-soft/70 to-paper" aria-label="대표 상품 안내">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p style={{ "--d": "0s" } as React.CSSProperties} className="hero-rise inline-block rounded-full bg-paper px-4 py-1 text-sm font-semibold text-brand-deep">
            대표 상품 · {b.product}
          </p>
          <h1 style={{ "--d": ".1s" } as React.CSSProperties} className="hero-rise mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-5xl">{b.headline}</h1>
          <p style={{ "--d": ".2s" } as React.CSSProperties} className="hero-rise mt-4 max-w-xl text-lg text-ink-sub">{b.sub}</p>
          <div style={{ "--d": ".3s" } as React.CSSProperties} className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={b.ctaHref ?? `/consult?topic=${topic}`}>{b.cta}</ButtonLink>
            <ButtonLink href={b.detailPath} variant="outline">상품 상세보기</ButtonLink>
          </div>
          <ul style={{ "--d": ".4s" } as React.CSSProperties} className="hero-rise mt-6 flex flex-wrap gap-2" aria-label="상담 원칙">
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
