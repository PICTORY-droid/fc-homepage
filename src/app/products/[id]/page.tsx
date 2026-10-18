import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Notice } from "@/components/ui/Notice";
import { ButtonLink } from "@/components/ui/Button";
import { ConsultForm } from "@/components/consult/ConsultForm";
import { ProductCard } from "@/components/products/ProductCard";
import { productCopy } from "@/config/productCopy";
import { products, productsMeta } from "@/config/products";
import { getProductDetail, productDetailsMeta } from "@/config/productDetails";
import { site } from "@/config/site";
import { getProduct, productImage, relatedProducts } from "@/lib/products";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).id);
  if (!p) return {};
  const img = productImage(p);
  return {
    title: p.displayName,
    description: p.slogan?.headline ?? `${p.displayName} — ${p.group} 보험 상품 안내`,
    ...(img ? { openGraph: { images: [{ url: img.full, width: 720, height: 1280 }] } } : {}),
  };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-ink/10 py-3 last:border-0 sm:grid-cols-[10rem_1fr]">
      <dt className="text-sm font-semibold text-ink-sub">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

// 상품 상세 — 상품 정보는 config/products*.ts, 상담 신청은 기존 상담 폼(구글 시트 연동)을 그대로 씁니다.
export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).id);
  if (!p) notFound();
  const img = productImage(p);
  const related = relatedProducts(p.id, 4);
  const detail = getProductDetail(p.id);

  return (
    <>
      <Section>
        <nav aria-label="현재 위치" className="mb-6 text-sm text-ink-sub">
          <Link href="/" className="underline">홈</Link> · <Link href="/products" className="underline">보험 상품</Link> · {p.displayName}
        </nav>
        <div className="grid items-start gap-8 md:grid-cols-[1.3fr_1fr]">
          <div>
            <ul className="flex flex-wrap gap-2" aria-label="상품 분류">
              <li className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-deep">{p.group}</li>
              {p.slogan?.tags.map((t) => <li key={t} className="rounded-full bg-paper-gray px-3 py-1 text-sm text-ink-sub">{t}</li>)}
            </ul>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{p.displayName}</h1>
            {p.slogan && <p className="mt-3 text-lg text-ink-sub">{p.slogan.headline}</p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#consult">이 상품 상담하기</ButtonLink>
              <ButtonLink href="/products" variant="outline">다른 상품 보기</ButtonLink>
            </div>
            <div className="mt-6"><Notice>{site.notices.premium}</Notice></div>
          </div>
          {img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img.full} alt={`${p.displayName} 안내 이미지`} width={720} height={1280}
              className="mx-auto w-full max-w-xs rounded-card border border-ink/10" />
          )}
        </div>
      </Section>

      <Section title="상품 정보" tone="card">
        <dl className="rounded-card border border-ink/10 bg-paper px-5 py-2">
          <Row label="상품명" value={p.name} />
          <Row label="분류" value={`${p.group} 보험`} />
          {p.ageRange && <Row label="가입 나이" value={p.ageRange} />}
          {p.period && <Row label="보험기간 / 납입기간" value={p.period} />}
          {p.limit && <Row label="가입 한도" value={p.limit} />}
          <Row label="판매 구분" value="판매 중" />
          <Row label="고시 시행일" value={p.effectiveDate} />
        </dl>
        {p.coverage && p.coverage.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-ink">주요 보장</h3>
            <ul className="mt-3 space-y-2">
              {p.coverage.map((c) => (
                <li key={c} className="flex gap-3 rounded-card bg-paper p-4 text-ink">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />{c}
                </li>
              ))}
            </ul>
          </div>
        )}
        {!(detail || p.ageRange || p.period || p.limit || p.coverage?.length) && (
          <p className="mt-4 text-ink-sub">{productCopy.detailPending}</p>
        )}
        {p.jobCheck && <div className="mt-4"><Notice tone="alert">{productCopy.jobNotice}</Notice></div>}
        <p className="mt-4 text-xs text-ink-sub">
          {productsMeta.source} 기준 · {productsMeta.asOf} 확인 · {productCopy.statusNote}
        </p>
      </Section>

      {detail && (
        <Section title="상품 상세 안내" lead={`${detail.docName} (${detail.docType}) 기준`}>
          <dl className="rounded-card border border-ink/10 bg-paper px-5 py-2">
            {detail.facts.map((f) => <Row key={f.label} label={f.label} value={f.value} />)}
          </dl>
          {detail.tables.map((t) => (
            <div key={t.title} className="mt-6">
              <h3 className="text-lg font-bold text-ink">{t.title}</h3>
              <div className="mt-3 overflow-x-auto rounded-card border border-ink/10">
                <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                  <thead className="bg-brand-soft text-ink">
                    <tr>{t.head.map((h) => <th key={h} scope="col" className="px-3 py-2 font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {t.rows.map((r, i) => (
                      <tr key={i} className="border-t border-ink/10">
                        {r.map((c, j) => <td key={j} className="px-3 py-2 text-ink">{c}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          {detail.notes.length > 0 && (
            <ul className="mt-6 space-y-2 text-sm text-ink-sub">
              {detail.notes.map((n) => <li key={n}>· {n}</li>)}
            </ul>
          )}
          <p className="mt-4 text-xs text-ink-sub">
            {productDetailsMeta.source} · {productDetailsMeta.asOf} 확인. 보험료·보장 내용은 가입 조건에 따라 달라질 수 있으니 상품요약서와 약관을 반드시 확인하세요.
          </p>
        </Section>
      )}

      <Section title={productCopy.checklistTitle}>
        <ol className="grid gap-4 sm:grid-cols-2">
          {productCopy.checklist.map((t, i) => (
            <li key={t} className="flex items-center gap-4 rounded-card bg-paper-card p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-ink">{i + 1}</span>
              <span className="text-ink">{t}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="consult" title={`${p.displayName} 상담 신청`} lead="남겨주신 연락처로 희망하신 시간에 연락드립니다." tone="card">
        <div className="max-w-xl"><ConsultForm initialTopic={p.topic} /></div>
      </Section>

      {related.length > 0 && (
        <Section title={`같은 ${p.group} 보험`}>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} product={r} />)}
          </ul>
        </Section>
      )}

      <Section>
        <p className="text-xs text-ink-sub">
          {site.notices.premium}
          {site.reviewNo ? ` · 심의필 ${site.reviewNo}` : process.env.NODE_ENV !== "production" ? " · 심의번호 미입력(개발용)" : ""}
        </p>
      </Section>
    </>
  );
}
