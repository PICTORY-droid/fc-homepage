import Image from "next/image";
import Link from "next/link";
import { CardCta } from "@/components/ui/CardCta";
import { cardLinkClass } from "@/components/ui/styles";

export interface SeasonChoice { slug: string; label: string; count: number; href: string; lead: string; thumbs: string[]; aspect?: number }

// 빛깔 고르기 — 카드 네 장. 카드마다 미리보기 세 장을 보여 주고, 누르면 그 모음 상세페이지로 이동합니다.
export function SeasonChooser({ items }: { items: SeasonChoice[] }) {
  return (
    <ul data-reveal="stagger" className="grid gap-4 sm:grid-cols-2">
      {items.map((s) => (
        <li key={s.slug}>
          <Link href={s.href} className={`flex h-full flex-col p-4 outline-none ${cardLinkClass}`}>
            <div className="grid grid-cols-3 gap-2">
              {s.thumbs.map((t) => (
                <div key={t} className="relative w-full overflow-hidden rounded-lg bg-paper-gray" style={{ aspectRatio: s.aspect ?? 794 / 1123 }}>
                  <Image src={t} alt="" fill sizes="(min-width:640px) 15vw, 30vw" className="object-cover" />
                </div>
              ))}
            </div>
            <span className="mt-4 text-xl font-bold text-ink">{s.label}</span>
            <span className="mt-1 flex-1 text-sm leading-relaxed text-ink-sub">{s.lead}</span>
            <CardCta className="mt-3">{s.label} 보기</CardCta>
          </Link>
        </li>
      ))}
    </ul>
  );
}
