import { Section } from "@/components/ui/Section";
import { BulletList } from "@/components/ui/BulletList";
import { coverageMeta, getCoverage } from "@/config/productCoverage";

// 보험금 지급사유·지급액 — 상품요약서의 '보험금 지급사유 및 지급제한 사항' 정리 (표시 전용, 서버 컴포넌트)
export function CoverageSection({ productId }: { productId: string }) {
  const c = getCoverage(productId);
  if (!c) return null;
  return (
    <Section title="보험금 지급사유와 지급액" lead="상품요약서에 적힌 지급사유를 표로 정리했어요. 항목을 눌러 펼쳐 보세요." tone="card">
      <div className="mb-6 rounded-card bg-paper p-5">
        <h3 className="font-bold text-ink">상품 구성</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-sub">{c.compose}</p>
      </div>
      <div className="space-y-3">
        {c.covs.map((t, i) => (
          <details key={t.title} open={i === 0} className="group rounded-card border border-ink/10 bg-paper">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 font-semibold text-ink">
              <span>{t.title}</span>
              <span aria-hidden="true" className="text-ink-sub transition group-open:rotate-180">▾</span>
            </summary>
            <div className="overflow-x-auto px-3 pb-4 sm:px-5">
              <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
                <thead className="bg-brand-soft text-ink">
                  <tr>{t.head.map((h) => <th key={h} scope="col" className="px-3 py-2 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {t.rows.map((r, ri) => (
                    <tr key={ri} className="border-t border-ink/10 align-top">
                      {r.map((cell, ci) => <td key={ci} className={`px-3 py-2 ${ci === 0 ? "font-semibold text-ink" : "text-ink-sub"}`}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ))}
      </div>
      {c.notes.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-ink">보장 관련 유의사항</h3>
          <BulletList className="mt-3 text-sm text-ink-sub" items={c.notes} />
        </div>
      )}
      <p className="mt-6 text-xs text-ink-sub">{coverageMeta.source} 기준 · {coverageMeta.asOf} 정리. 실제 지급 여부와 금액은 약관과 가입 조건에 따라 달라지니 상품요약서와 약관을 반드시 확인하세요.</p>
    </Section>
  );
}
