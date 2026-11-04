import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { MonthlyCardLink } from "@/components/home/MonthlyCardLink";
import { RandomMonthlyCard } from "@/components/home/RandomMonthlyCard";
import { homeMonth, monthlyPick } from "@/config/monthly";
import { textLink } from "@/components/ui/styles";

// 홈의 '이달의 양식' — 카드는 그림과 제목만. 편지지 카드는 방문할 때마다 무작위로 바뀝니다. 홈에 올리기로 정한 달(config/monthly 의 FEATURED_MONTH, 지금은 12월)의 무료 자료 3가지. 각 카드는 자료 상세페이지로 이어지고 클릭 수가 기록됩니다.
export function MonthlyPick() {
  const p = monthlyPick(homeMonth());
  return (
    <Section dense title={p.heading} lead={p.lead} tone="card">
      <ul className="grid gap-4 sm:grid-cols-3">
        {p.cards.map((c) => (
          <li key={c.href}>
            {c.pool?.length ? <RandomMonthlyCard pool={c.pool} /> : <MonthlyCardLink href={c.href} title={c.title} thumbs={c.thumb ? [c.thumb] : []} />}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink-sub"><Link href="/fun" className={textLink}>즐길거리 전체 보기</Link></p>
    </Section>
  );
}
