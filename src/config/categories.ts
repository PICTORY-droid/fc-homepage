// 상담 분야 정의 — 분야 추가/삭제/문구 수정은 이 파일만 고치면 됩니다.
export type CategorySlug =
  | "kids" | "mom" | "health" | "pension" | "saving" | "business" | "special" | "senior";

export interface Category {
  slug: CategorySlug;
  title: string;
  short: string;
  featured: boolean; // 메인 '추천 상담 분야'에 노출
  forWhom: string[]; // '이런 분께 도움이 될 수 있어요'
  notice?: string; // 분야별 추가 고지
}

export const categories: Category[] = [
  {
    slug: "health", title: "건강·암 보장", featured: true,
    short: "질병과 암에 대한 보장을 살펴봅니다.",
    forWhom: ["진단·치료비 부담이 걱정되시는 분", "현재 보장이 충분한지 점검하고 싶으신 분", "가족력이 있어 미리 준비하고 싶으신 분"],
  },
  {
    slug: "pension", title: "노후·연금", featured: true,
    short: "노후 소득 준비 방법을 함께 살펴봅니다.",
    forWhom: ["은퇴 후 생활비 준비를 시작하고 싶으신 분", "연금 수령 방식이 궁금하신 분", "기존 연금을 점검하고 싶으신 분"],
    notice: "세제 혜택 등 세금 관련 내용은 개인 상황에 따라 다르므로 세무 전문가 확인이 필요합니다.",
  },
  {
    slug: "kids", title: "어린이·가족", featured: true,
    short: "자녀의 성장 단계에 맞는 보장을 살펴봅니다.",
    forWhom: ["자녀의 질병·상해 보장이 궁금하신 분", "자녀 보장을 처음 준비하시는 분", "가족 전체 보장을 한 번에 점검하고 싶으신 분"],
  },
  {
    slug: "mom", title: "산모·신생아", featured: false,
    short: "임신·출산 시기에 필요한 보장을 살펴봅니다.",
    forWhom: ["임신·출산을 준비하시는 분", "산모와 신생아 보장이 궁금하신 분"],
  },
  {
    slug: "saving", title: "저축·목돈 마련", featured: false,
    short: "목돈 마련 방법을 함께 살펴봅니다.",
    forWhom: ["일정 기간 목돈 마련을 계획하시는 분", "저축성 상품의 조건이 궁금하신 분"],
    notice: "세제 혜택 등 세금 관련 내용은 개인 상황에 따라 다르므로 세무 전문가 확인이 필요합니다.",
  },
  {
    slug: "senior", title: "시니어·간병·치매", featured: false,
    short: "간병과 치매에 대한 준비를 살펴봅니다.",
    forWhom: ["부모님 또는 본인의 간병 준비가 궁금하신 분", "치매·요양 비용이 걱정되시는 분"],
  },
  {
    slug: "special", title: "병력이 있으신 분", featured: false,
    short: "병력이 있어도 알아볼 수 있는 상품을 살펴봅니다.",
    forWhom: ["치료 이력이 있어 가입이 걱정되시는 분", "간편한 가입 절차를 알아보고 싶으신 분"],
    notice: "가입 가능 여부와 조건은 건강 상태와 고지 내용에 따라 달라집니다.",
  },
  {
    slug: "business", title: "기업·단체", featured: false,
    short: "임직원 보장을 단체로 알아봅니다. (5인 이상 단체)",
    forWhom: ["임직원 재해 보장을 준비하시는 사업주", "작업장 안전과 함께 보장도 점검하고 싶으신 분"],
    notice: "단체보험은 산재보험 등 법정 의무를 대체하지 않습니다.",
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
