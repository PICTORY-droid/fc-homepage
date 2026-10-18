// '잘 모르겠어요' 선택 후 받는 추가 문항의 결과 규칙 — 상품 연결·안내 문구는 이 파일에서만 수정합니다.
// 보기(예/아니오, 보험 종류, 가족력)는 상담 신청 폼과 같은 features/consult/detailOptions.ts 를 씁니다.
import type { FamilyHistory } from "../features/consult/detailOptions";

export const DETAIL_PRODUCT_RULES = {
  /** 입원·수술 이력 또는 치료·복약 중인 질환이 있을 때 — 간편 고지 상품 */
  history: { ids: ["P021", "P022"], reason: "입원·수술 이력이나 치료 중인 질환이 있으시다고 해서, 간편하게 고지하는 건강보험을 먼저 살펴봤어요." },
  /** 가족력별 */
  family: {
    cancer: { ids: ["P007"], reason: "가족력에 암이 있어, 암 보장 상품을 살펴봤어요." },
    brain: { ids: ["P003", "P004"], reason: "가족력에 뇌혈관 질환이 있어, 뇌·심장 보장 상품을 살펴봤어요." },
    heart: { ids: ["P003", "P004"], reason: "가족력에 심장 질환이 있어, 뇌·심장 보장 상품을 살펴봤어요." },
    diabetes: { ids: ["P026"], reason: "가족력에 당뇨가 있어, 당뇨 관련 상품을 살펴봤어요." },
    dementia: { ids: ["P025", "P024"], reason: "가족력에 치매가 있어, 치매·간병 상품을 살펴봤어요." },
  } as Record<Exclude<FamilyHistory, "none" | "unknown">, { ids: string[]; reason: string }>,
  /** 가입 중인 보험 유무별 */
  insurance: {
    no: { ids: ["P002", "P020"], reason: "가입 중인 보험이 없으셔서, 기본 건강 보장을 갖춘 상품부터 살펴봤어요." },
    yes: { ids: ["P002"], reason: "이미 가입한 보장과 겹치지 않는지 점검하면서 살펴보시면 좋아요. 가입 내용은 상담에서 함께 확인해 드려요." },
    unknown: { ids: ["P002"], reason: "가입 중인 보험은 상담에서 함께 확인해 드려요. 우선 기본 건강 보장 상품을 살펴봤어요." },
  },
} as const;

export const DETAIL_FALLBACK_IDS = ["P002", "P020"];
