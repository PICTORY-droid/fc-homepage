import type { Metadata } from "next";
import { funMetadata } from "@/lib/seo/funMeta";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { funItems } from "@/config/fun";

export const metadata: Metadata = funMetadata({
  title: "무료 양식 모음 — 엑셀·PPT·편지지·명함",
  description: "가계부 엑셀, 이력서·자기소개서 양식, 감성 편지지까지 — 따뜻한 감성의 무료 자료를 모았어요.",
  path: "/fun", ogKey: "fun",
});

// 즐길거리 허브 — 목록은 config/fun.ts 에서만 관리합니다.
export default function FunPage() {
  return (
    <Section as="h1" title="즐길거리" lead="보험 걱정은 잠깐 내려놓고, 편하게 놀다 가세요. 모두 무료예요.">
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
