"use client";
// 홈 첫 화면 움직이는 배너 — 가로로 넘어가는 5장. 자동 넘김(6초), 점·화살표·스와이프, 일시정지 버튼 제공.
// '동작 줄이기' 설정에서는 자동 넘김과 이동 효과가 꺼집니다.
import Link from "next/link";
import type { HeroArtKey, HeroTheme } from "@/config/heroSlides";
import { HeroArt } from "./HeroArt";
import { useCarousel } from "./useCarousel";

export interface HeroSlideView {
  id: string;
  product: string;
  headline: string;
  sub: string;
  detailPath: string;
  art: HeroArtKey;
  theme: HeroTheme;
}

const btn = "flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-xl px-2 text-sm font-bold sm:text-base";
const ctl = "flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-ink shadow-sm ring-1 ring-black/5 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export function HeroCarousel({ slides, phone, intervalMs }: { slides: HeroSlideView[]; phone: string; intervalMs: number }) {
  const c = useCarousel(slides.length, intervalMs);
  const cur = slides[c.index].theme;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="대표 상품 안내"
      className="relative overflow-clip"
      onMouseEnter={() => c.setHover(true)}
      onMouseLeave={() => c.setHover(false)}
      onFocus={() => c.setHover(true)}
      onBlur={() => c.setHover(false)}
      {...c.swipe}
    >
      <div
        className="flex motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(.65,.05,.25,1)]"
        style={{ transform: `translateX(-${c.index * 100}%)` }}
        aria-live={c.running ? "off" : "polite"}
      >
        {slides.map((s, i) => {
          const H = i === 0 ? "h1" : "h2"; // 페이지 제목(h1)은 첫 장 하나만
          return (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${slides.length}`}
            aria-hidden={i !== c.index}
            inert={i !== c.index}
            className="w-full shrink-0"
            style={{ background: `linear-gradient(160deg, ${s.theme.from} 0%, ${s.theme.to})` }}
          >
            <div className="mx-auto grid max-w-5xl items-center gap-2 px-4 pb-14 pt-5 sm:px-6 sm:pb-16 sm:pt-10 md:grid-cols-[1.3fr_1fr] md:gap-8">
              <div className="order-2 md:order-1">
                <p className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm" style={{ color: s.theme.deep }}>
                  대표 상품 · {s.product}
                </p>
                <H className="mt-3 whitespace-pre-line break-keep text-2xl font-extrabold leading-snug text-ink sm:text-4xl md:leading-tight">{s.headline}</H>
                <p className="mt-2 max-w-xl break-keep text-sm text-ink-sub sm:text-base md:mt-3">{s.sub}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 md:mt-5 md:max-w-md">
                  <Link href="/find" className={`${btn} text-white`} style={{ background: s.theme.deep }}>30초 보장 점검</Link>
                  <a href={`tel:${phone}`} className={`${btn} bg-white`} style={{ color: s.theme.deep, boxShadow: `inset 0 0 0 1.5px ${s.theme.accent}` }}>전화 상담</a>
                  <Link href={s.detailPath} className={`${btn} bg-white`} style={{ color: s.theme.deep, boxShadow: `inset 0 0 0 1.5px ${s.theme.accent}` }}>상품 보기</Link>
                </div>
              </div>
              <div className="order-1 mx-auto h-32 w-full max-w-[13rem] md:order-2 md:h-60 md:max-w-none">
                <HeroArt kind={s.art} theme={s.theme} />
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* 아래쪽 조작부: 이전 · 점 · 다음 · 멈춤 */}
      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 px-4">
        <button type="button" onClick={c.prev} aria-label="이전 배너" className={ctl} style={{ outlineColor: cur.accent }}>‹</button>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="배너 선택">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === c.index}
              aria-label={`${i + 1}번 배너`}
              onClick={() => c.go(i)}
              className="flex h-6 items-center px-0.5"
            >
              <span
                className="block h-2 rounded-full motion-safe:transition-all motion-safe:duration-300"
                style={{ width: i === c.index ? 26 : 8, background: i === c.index ? cur.deep : "#fff", boxShadow: i === c.index ? "none" : "0 0 0 1px rgb(0 0 0 / .12)" }}
              />
            </button>
          ))}
        </div>
        <button type="button" onClick={c.next} aria-label="다음 배너" className={ctl} style={{ outlineColor: cur.accent }}>›</button>
        {!c.reduced && (
          <button type="button" onClick={() => c.setPaused((p) => !p)} aria-label={c.paused ? "자동 넘김 다시 시작" : "자동 넘김 멈춤"} className={ctl} style={{ outlineColor: cur.accent }}>
            {c.paused ? "▶" : "❚❚"}
          </button>
        )}
      </div>
    </div>
  );
}
