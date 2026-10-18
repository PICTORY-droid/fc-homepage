import raw from "./productDetails.data.json";

// 상품요약서·사업방법서에서 확인한 상품 상세 데이터 (상품 id 기준).
// 값은 원문에서 직접 확인한 것만 넣습니다. 모르는 항목은 비워 둡니다.
export type DetailTable = { title: string; head: string[]; rows: string[][] };
export type ProductDetail = {
  docName: string;
  docType: string;
  facts: { label: string; value: string }[];
  tables: DetailTable[];
  notes: string[];
};

const items = raw.items as Record<string, ProductDetail>;

export const productDetailsMeta = { asOf: raw.asOf, source: raw.source };
export const productDetailIds = Object.keys(items);

export function getProductDetail(id: string): ProductDetail | undefined {
  return items[id];
}
