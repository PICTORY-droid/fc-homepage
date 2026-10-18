import { getBanner, type BannerKey } from "@/config/banners";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";

// 페이지 상단 배너 — 페이지당 상품 1개. 문구/상품은 config/banners.ts 에서만 수정합니다.
export function PageBanner({ bannerKey }: { bannerKey: BannerKey }) {
  const b = getBanner(bannerKey);
  const topic = bannerKey === "home" ? "health" : bannerKey;
  return (
    <section className="bg-gradient-to-b from-brand-soft/70 to-paper" aria-label="대표 상품 안내">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <p className="inline-block rounded-full bg-paper px-4 py-1 text-sm font-semibold text-brand-deep">
          대표 상품 · {b.product}
        </p>
        <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-ink sm:text-5xl">{b.headline}</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-sub">{b.sub}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/consult?topic=${topic}`}>{b.cta}</ButtonLink>
          <ButtonLink href={b.officialUrl} variant="outline" external>공식 상품 보기</ButtonLink>
        </div>
        <p className="mt-6 text-xs text-ink-sub">
          {site.notices.premium}{" "}
          {site.reviewNo ? `· 심의필 ${site.reviewNo}` : process.env.NODE_ENV !== "production" ? "· 심의번호 미입력(개발용)" : ""}
        </p>
      </div>
    </section>
  );
}
