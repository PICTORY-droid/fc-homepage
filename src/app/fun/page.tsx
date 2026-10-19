import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { funItems } from "@/config/fun";

export const metadata: Metadata = {
  title: "즐길거리",
  description: "가계부 엑셀, 이력서·자기소개서 양식, 감성 편지지, 편지 받기 게임까지 — 우체국 감성의 무료 자료와 재미를 모았어요.",
  alternates: { canonical: "/fun" },
};

// 즐길거리 허브 — 목록은 config/fun.ts 에서만 관리합니다.
export default function FunPage() {
  return (
    <Section title="즐길거리" lead="보험 걱정은 잠깐 내려놓고, 편하게 놀다 가세요. 모두 무료예요.">
      <ul data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {funItems.map((f) => (
          <li key={f.slug}>
            <Link href={f.href} className="group flex h-full items-start gap-4 rounded-card border border-ink/10 bg-paper-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
              <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-2xl">{f.icon}</span>
              <span className="min-w-0">
                <span className="block text-lg font-bold text-ink">{f.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-sub">{f.short}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
