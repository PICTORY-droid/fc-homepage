// 자료 받기 페이지 끝에 붙는 상담 안내 문구 — 자료의 쓰임새와 이어지는 한 줄만 둡니다. (키: "묶음/항목")
// 문구 원칙: 가입을 권유하거나 보장·수익을 단정하지 않고 '살펴보고 안내'만 말합니다. 광고 심의 기준에 맞춰 확정하세요.
// 이력서·자기소개서·편지지·발표 템플릿처럼 보험과 거리가 먼 자료에는 두지 않습니다.
import type { CategorySlug } from "./categories";

export interface FunCta { title: string; text: string; topic: CategorySlug | "other"; button: string }

export const funCtas: Record<string, FunCta> = {
  "excel/policy": { title: "정리하다 궁금해지는 보장이 있나요?", text: "가입한 보험을 한 장에 정리하면 겹치는 보장이나 빈 곳이 보이기도 해요. 증권을 함께 보며 쉽게 설명해 드립니다.", topic: "other", button: "증권 같이 살펴보기" },
  "ppt/review": { title: "정리한 내용, 같이 확인해 볼까요?", text: "양식에 채운 가입 내용이 맞는지, 놓친 부분은 없는지 편하게 물어보세요.", topic: "other", button: "내용 확인 상담" },
  "excel/ledger": { title: "매달 나가는 보험료가 궁금하다면", text: "가계부에서 고정 지출을 정리하다 보면 보험료가 적당한지 궁금해져요. 내용을 살펴보고 안내해 드립니다.", topic: "other", button: "보험료 살펴보기" },
  "excel/saving": { title: "목돈 마련 방법이 궁금하다면", text: "저축 목표를 세우셨다면 어떤 방식들이 있는지 비교해서 안내해 드려요.", topic: "saving", button: "저축·목돈 안내 받기" },
  "excel/allowance": { title: "아이를 위한 준비도 함께 살펴볼까요?", text: "용돈 습관을 키우는 시기에 어린이 보장은 어떻게 준비하는지 안내해 드립니다.", topic: "kids", button: "어린이·가족 상담" },
  "excel/quote": { title: "사업장 보험이 궁금하다면", text: "견적서를 쓰는 사장님께, 사업장과 직원에게 필요한 보험을 알기 쉽게 정리해 드립니다.", topic: "business", button: "기업·단체 상담" },
  "ppt/family": { title: "우리 가족 보장도 한 번 살펴볼까요?", text: "가족 구성에 맞춰 어떤 점을 확인하면 좋은지 안내해 드립니다.", topic: "kids", button: "가족 보장 상담" },
  "ppt/birthday": { title: "아이의 첫 생일, 보장도 한 번 확인해요", text: "첫돌을 맞은 아이에게 어떤 준비가 있는지 편하게 물어보세요.", topic: "kids", button: "어린이 보장 상담" },
  "excel/gift": { title: "경조사비, 보험료와 함께 보면 한눈에 들어와요", text: "한 해 나가는 마음 씀씀이를 정리하셨다면, 고정으로 나가는 보험료도 같이 살펴볼 수 있어요. 궁금한 점을 편하게 물어보세요.", topic: "other", button: "보험료 살펴보기" },
  "ppt/talk": { title: "발표 준비하다 궁금한 점이 생겼다면", text: "직원이나 모임을 위한 보험 이야기가 궁금할 때, 확인할 점을 쉽게 정리해 안내해 드립니다.", topic: "business", button: "기업·단체 문의" },
  "ppt/news": { title: "카드뉴스로 알리고 싶은 보험 이야기가 있다면", text: "보험 용어나 확인할 점이 어렵게 느껴질 때 편하게 물어보세요. 살펴보고 쉽게 안내해 드립니다.", topic: "other", button: "궁금한 점 물어보기" },
  "ppt/wedding": { title: "새로운 출발, 보장도 함께 정리해요", text: "신혼 때 확인하면 좋은 보장 점검 포인트를 안내해 드립니다.", topic: "other", button: "신혼 보장 점검" },
};

export const getFunCta = (group: string, item: string): FunCta | undefined => funCtas[`${group}/${item}`];

// 명함 분류 페이지 끝 안내 — 가게·프리랜서처럼 보험과 이어지는 분류에만 둡니다. (키: 명함 분류)
export const cardCtas: Record<string, FunCta> = {
  food: { title: "가게를 운영하신다면", text: "사장님이 챙기면 좋은 보험은 무엇인지 알기 쉽게 안내해 드려요.", topic: "business", button: "사장님 보험 상담" },
  beauty: { title: "샵을 운영하신다면", text: "일하는 분들과 가게를 위해 확인할 점을 편하게 물어보세요.", topic: "business", button: "사업장 보험 상담" },
  life: { title: "동네 가게 사장님께", text: "가게와 가족을 위해 살펴볼 보험을 쉽게 설명해 드립니다.", topic: "business", button: "사장님 보험 상담" },
  creative: { title: "프리랜서로 일하신다면", text: "회사의 보호 없이 일할 때 확인하면 좋은 점을 안내해 드려요.", topic: "other", button: "프리랜서 보험 상담" },
  office: { title: "회사 밖 보장도 궁금하다면", text: "회사에서 받는 것 외에 내가 따로 확인할 점이 있는지 편하게 물어보세요. 살펴보고 안내해 드립니다.", topic: "other", button: "보장 점검 문의" },
  public: { title: "공직에 계신 분들께", text: "단체보험이나 이미 가입한 보험과 겹치는 부분이 없는지 궁금할 때 편하게 물어보세요.", topic: "other", button: "보장 점검 문의" },
  teacher: { title: "아이들을 가르치는 선생님께", text: "나와 가족의 보장은 어떻게 되어 있는지 궁금할 때 편하게 물어보세요. 쉽게 설명해 드립니다.", topic: "other", button: "보장 점검 문의" },
  care: { title: "돌봄과 의료 현장에서 일하신다면", text: "일하는 동안 건강과 가족을 챙기기 어려울 때, 확인할 점을 알기 쉽게 안내해 드립니다.", topic: "other", button: "보장 점검 문의" },
  finance: { title: "금융 분야에서 일하신다면", text: "나와 가족의 보험을 다른 눈으로 한 번 더 살펴보고 싶을 때 편하게 물어보세요.", topic: "other", button: "보장 점검 문의" },
  expert: { title: "혼자 일하는 전문가께", text: "소득과 건강을 스스로 챙겨야 할 때 살펴볼 점을 안내해 드립니다.", topic: "other", button: "보장 점검 상담" },
};

export const getCardCta = (category: string): FunCta | undefined => cardCtas[category];

// 계절 편지지 상세페이지 끝 안내 — 편지를 쓰는 마음과 이어지는 가벼운 한 줄만 둡니다. (상담 분야: 기타)
export const stationeryCta: FunCta = { title: "안부 편지를 쓰다 가족이 떠올랐다면", text: "가족의 보장은 잘 챙겨져 있는지 궁금할 때 편하게 물어보세요. 살펴보고 쉽게 안내해 드립니다.", topic: "other", button: "가족 보장 문의하기" };
