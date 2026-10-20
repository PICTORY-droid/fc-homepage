import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { currentMonthKST, monthlyPick } from "@/config/monthly";

// 홈의 '이달의 양식' — 지금 계절에 맞는 무료 자료 3가지. 각 카드는 자료 상세페이지로 이어지고 클릭 수가 기록됩니다.
export function MonthlyPick() {
  const p = monthlyPick(currentMonthKST());
  return (
    <Section dense title={p.heading} lead={p.lead} tone="card">
      <ul className="grid gap-4 sm:grid-cols-3">
        {p.cards.map((c) => (
          <li key={c.href}>
            <Link href={c.href} data-track="cta" data-label={`home/monthly/${c.href.replace("/fun/", "")}`}
              className="flex h-full flex-col overflow-hidden rounded-card border border-ink/10 bg-paper transition hover:-translate-y-0.5 hover:shadow-md">
              {c.thumb && (
                <div className="relative w-full bg-paper-gray" style={{ aspectRatio: 16 / 10 }}>
                  <Image src={c.thumb} alt="" fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover object-top" />
                </div>
              )}
              <div className="p-3"><h3 className="text-base font-bold text-ink">{c.title}</h3>{c.desc && <p className="mt-1 text-sm leading-snug text-ink-sub">{c.desc}</p>}</div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink-sub"><Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
    </Section>
  );
}
