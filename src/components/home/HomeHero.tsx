// 홈 첫 화면 — 움직이는 배너 5장 + 상담 원칙·고지 문구(고정). 문구는 config/banners.ts, 장 구성은 config/heroSlides.ts 에서 수정합니다.
import { getBanner } from "@/config/banners";
import { HERO_INTERVAL_MS, heroSlides } from "@/config/heroSlides";
import { site } from "@/config/site";
import { HeroCarousel, type HeroSlideView } from "./HeroCarousel";

export function HomeHero() {
  const slides: HeroSlideView[] = heroSlides.map((s) => {
    const b = getBanner(s.bannerKey);
    return { id: s.id, product: b.product, headline: b.headline, sub: b.sub, detailPath: b.detailPath, art: s.art, theme: s.theme };
  });
  return (
    <section aria-label="대표 상품 안내" className="bg-paper">
      <HeroCarousel slides={slides} phone={site.contact.fcPhone} intervalMs={HERO_INTERVAL_MS} />
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
        <ul className="flex flex-wrap gap-1.5" aria-label="상담 원칙">
          {site.trust.map((t) => (
            <li key={t} className="rounded-full bg-paper px-2.5 py-0.5 text-xs font-medium text-ink shadow-sm ring-1 ring-black/5">✓ {t}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-ink-sub">
          {site.notices.premium}{" "}
          {site.reviewNo ? `· 심의필 ${site.reviewNo}` : process.env.NODE_ENV !== "production" ? "· 심의번호 미입력(개발용)" : ""}
        </p>
      </div>
    </section>
  );
}
