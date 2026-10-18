import raw from "./productCoverage.data.json";

// 상품요약서·사업방법서의 '보험금 지급사유 및 지급제한 사항' 정리본 (상품 id 기준).
// 값은 원문에서 직접 확인한 것만 넣습니다. 이 데이터가 없는 상품(사업방법서 기반)은 지급사유 표를 보여주지 않습니다.
export type CoverageTable = { title: string; head: string[]; rows: string[][] };
export type ProductCoverage = { compose: string; covs: CoverageTable[]; notes: string[] };

const items = raw.items as Record<string, ProductCoverage>;

export const coverageMeta = { asOf: raw.asOf, source: raw.source };
export const getCoverage = (id: string): ProductCoverage | undefined => items[id];

/** 지급구분(보장 항목) 이름만 모아 중복 없이 반환 — 상품 비교에 사용 */
export function coverageItemNames(id: string): string[] {
  const c = items[id];
  if (!c) return [];
  const names = c.covs.flatMap((t) => t.rows.map((r) => r[0]));
  return [...new Set(names)];
}
