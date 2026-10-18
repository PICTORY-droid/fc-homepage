import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Notice } from "@/components/ui/Notice";
import { BulletList } from "@/components/ui/BulletList";
import { ButtonLink } from "@/components/ui/Button";
import { getCoverage, coverageItemNames } from "@/config/productCoverage";
import { productsMeta } from "@/config/products";
import { productPath } from "@/lib/products";
import { buildFactRows, parseCompareIds } from "@/features/compare/compare";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "상품 나란히 비교",
  description: "선택한 우체국보험 상품의 가입 조건과 보장 항목을 한눈에 비교해 보세요.",
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ ids?: string | string[] }> };

// 상품 비교 — 사실 정보만 나란히 보여주며 우열이나 추천은 표시하지 않습니다.
export default async function ComparePage({ searchParams }: Props) {
  const list = parseCompareIds((await searchParams).ids);
  if (list.length < 2) {
    return (
      <Section title="상품 나란히 비교" lead="비교할 상품을 2~3개 선택해 주세요.">
        <ButtonLink href="/products">상품 목록에서 선택하기</ButtonLink>
      </Section>
    );
  }
  const facts = buildFactRows(list);
  const th = "w-32 min-w-[8rem] bg-brand-soft px-3 py-3 text-left align-top text-sm font-semibold text-ink sm:w-40";
  const td = "min-w-[11rem] border-l border-ink/10 px-3 py-3 align-top text-sm text-ink";

  return (
    <>
      <Section title="상품 나란히 비교" lead="가입 조건과 보장 항목을 같은 기준으로 놓고 살펴보세요. 우열을 매기는 표가 아니며, 가입 가능 여부는 상품요약서와 약관으로 확인해야 합니다.">
        <div className="overflow-x-auto rounded-card border border-ink/10 bg-paper">
          <table className="w-full border-collapse">
            <caption className="sr-only">선택한 상품 비교표</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>상품</th>
                {list.map((p) => (
                  <th key={p.id} scope="col" className={`${td} bg-paper font-bold`}>
                    <span className="block text-xs font-semibold text-brand-deep">{p.group}</span>
                    <Link href={productPath(p.id)} className="underline">{p.displayName}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-ink/10">
                <th scope="row" className={th}>고시 시행일</th>
                {list.map((p) => <td key={p.id} className={td}>{p.effectiveDate}</td>)}
              </tr>
              {facts.map((r) => (
                <tr key={r.label} className="border-t border-ink/10">
                  <th scope="row" className={th}>{r.label}</th>
                  {r.values.map((v, i) => <td key={i} className={td}>{v}</td>)}
                </tr>
              ))}
              <tr className="border-t border-ink/10">
                <th scope="row" className={th}>상품 구성</th>
                {list.map((p) => <td key={p.id} className={td}>{getCoverage(p.id)?.compose ?? "—"}</td>)}
              </tr>
              <tr className="border-t border-ink/10">
                <th scope="row" className={th}>보장 항목</th>
                {list.map((p) => {
                  const names = coverageItemNames(p.id);
                  return (
                    <td key={p.id} className={td}>
                      {names.length === 0 ? "—" : <BulletList className="space-y-1" items={names} />}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-sub">{productsMeta.source} 기준 · {productsMeta.asOf} 확인. {site.notices.premium}</p>
        <div className="mt-6"><Notice>가입 가능 여부와 보험료는 나이·건강상태·가입 조건에 따라 달라집니다.</Notice></div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/consult">이 상품들로 상담 신청</ButtonLink>
          <ButtonLink href="/products" variant="outline">다른 상품 고르기</ButtonLink>
        </div>
      </Section>
    </>
  );
}
