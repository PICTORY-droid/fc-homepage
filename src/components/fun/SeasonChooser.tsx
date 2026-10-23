import Image from "next/image";
import Link from "next/link";

export interface SeasonChoice { slug: string; label: string; count: number; href: string; lead: string; thumbs: string[]; aspect?: number }

// 빛깔 고르기 — 카드 네 장. 카드마다 미리보기 세 장을 보여 주고, 누르면 그 모음 상세페이지로 이동합니다.
export function SeasonChooser({ items }: { items: SeasonChoice[] }) {
  return (
    <ul data-reveal="stagger" className="grid gap-4 sm:grid-cols-2">
      {items.map((s) => (
        <li key={s.slug}>
          <Link href={s.href} className="group flex h-full flex-col overflow-hidden rounded-card border border-ink/10 bg-paper-card p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
            <div className="grid grid-cols-3 gap-2">
              {s.thumbs.map((t) => (
                <div key={t} className="relative w-full overflow-hidden rounded-lg bg-paper-gray" style={{ aspectRatio: s.aspect ?? 794 / 1123 }}>
                  <Image src={t} alt="" fill sizes="(min-width:640px) 15vw, 30vw" className="object-cover" />
                </div>
              ))}
            </div>
            <span className="mt-4 text-xl font-bold text-ink">{s.label} <span className="text-sm font-semibold text-brand-deep">{s.count}종</span></span>
            <span className="mt-1 flex-1 text-sm leading-relaxed text-ink-sub">{s.lead}</span>
            <span className="mt-3 text-sm font-bold text-brand-deep">{s.label} 보러 가기 →</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
