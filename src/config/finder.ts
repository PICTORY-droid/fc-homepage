// '내게 맞는 보장 찾기' 문항 정의 — 문항·보기 문구는 이 파일에서만 수정합니다.
export type Who = "self" | "child" | "parent";
export type AgeBand = "kid" | "adult" | "middle" | "senior";
export type Concern = "disease" | "hospital" | "kids" | "mom" | "care" | "pension" | "saving" | "history" | "business" | "unknown";

export const WHO_OPTIONS: { value: Who; label: string }[] = [
  { value: "self", label: "나 자신" }, { value: "child", label: "자녀" }, { value: "parent", label: "부모님" },
];
export const AGE_OPTIONS: { value: AgeBand; label: string }[] = [
  { value: "kid", label: "15세 이하" }, { value: "adult", label: "16~39세" },
  { value: "middle", label: "40~59세" }, { value: "senior", label: "60세 이상" },
];
export const CONCERN_OPTIONS: { value: Concern; label: string; hint: string }[] = [
  { value: "disease", label: "암·뇌·심장 같은 큰 병", hint: "진단·치료비 보장이 궁금해요" },
  { value: "hospital", label: "병원비 부담", hint: "입원·통원 의료비가 걱정돼요" },
  { value: "kids", label: "아이 보장", hint: "자녀를 위한 보장을 알아보고 싶어요" },
  { value: "mom", label: "임신·출산", hint: "산모와 아이 보장이 궁금해요" },
  { value: "care", label: "간병·치매", hint: "간병·요양 비용을 준비하고 싶어요" },
  { value: "pension", label: "노후·연금", hint: "은퇴 후 생활비를 준비하고 싶어요" },
  { value: "saving", label: "목돈 마련", hint: "차곡차곡 모으는 방법이 궁금해요" },
  { value: "history", label: "병력이 있어 걱정", hint: "치료 이력이 있어도 알아볼 수 있는지 궁금해요" },
  { value: "business", label: "회사·단체 보장", hint: "임직원 보장을 알아보고 싶어요" },
  { value: "unknown", label: "잘 모르겠어요", hint: "무엇부터 봐야 할지 함께 정리하고 싶어요" },
];

/** 걱정 → 상담 분야(slug) — 분야 slug 는 config/categories.ts 와 같아야 합니다. */
export const CONCERN_TOPICS: Record<Concern, string[]> = {
  disease: ["health"], hospital: ["health"], kids: ["kids"], mom: ["mom"], care: ["senior"],
  pension: ["pension"], saving: ["saving"], history: ["special"], business: ["business"], unknown: ["health", "other"],
};
