import type { Metadata } from "next";
import { funMetadata } from "@/lib/seo/funMeta";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { formFile, jobGroups } from "@/config/forms";

export const metadata: Metadata = funMetadata({
  title: "이력서·자기소개서 양식 무료 다운로드 — 직업별 Word 600종",
  description: "직업 10군, 포지션 30개마다 서로 다른 이력서 10종·자기소개서 10종을 무료 Word 파일로 내려받아 바로 편집하세요.",
  path: "/fun/forms", ogKey: "forms",
});

export default function FormsPage() {
  return (
    <>
      <Section as="h1" title="직업별 이력서·자기소개서" lead="포지션마다 이력서 10종, 자기소개서 10종 — 짜임이 모두 다른 Word 양식이에요. 고용24·NCS·STAR 작성법을 바탕으로 끝 장에 작성 가이드와 예시를 붙였어요.">
        <nav aria-label="직업군 바로가기" className="flex flex-wrap gap-2">
          {jobGroups.map((g) => (
            <a key={g.key} href={`#${g.key}`} className="flex min-h-[44px] items-center rounded-full border border-ink/25 bg-paper px-4 text-sm font-bold text-ink hover:bg-paper-gray">{g.label}</a>
          ))}
        </nav>
      </Section>
      {jobGroups.map((g, i) => (
        <Section key={g.key} id={g.key} tone={i % 2 ? "card" : undefined} title={g.label} lead={g.positions.map((p) => p.name).join(" · ")}>
          <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {g.positions.flatMap((p) => (["resume", "cover"] as const).map((k) => (
              <li key={`${k}-${p.id}`} className="overflow-hidden rounded-card border border-ink/10 bg-paper">
                <Link href={`/fun/forms/${p.id}`} className="flex h-full flex-col">
                  <div className="relative aspect-[794/1123] w-full bg-paper-gray">
                    <Image src={formFile(p.id, k, 1, "jpg")} alt={`${p.name} ${k === "resume" ? "이력서" : "자기소개서"} 미리보기`} fill sizes="(min-width:1024px) 20vw, (min-width:640px) 25vw, 50vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-ink">{p.name} {k === "resume" ? "이력서" : "자기소개서"}</h3>
                    <p className="mt-1 text-sm text-ink-sub">10가지 양식 보기</p>
                  </div>
                </Link>
              </li>
            )))}
          </ul>
        </Section>
      ))}
      <Section>
        <p className="text-sm text-ink-sub">A4 크기 양식이에요. Word 파일을 열어 연한 글씨를 지우고 입력하세요. 마지막 장은 작성 가이드와 예시이니 제출 전에 삭제하세요. 주민등록번호 등 민감한 개인정보는 제출할 때 꼭 필요한 경우에만 적으세요.</p>
        <p className="mt-3 text-ink-sub">다른 즐길거리도 둘러보세요. <Link href="/fun" className="font-semibold text-brand-deep underline">즐길거리 전체 보기</Link></p>
      </Section>
    </>
  );
}
