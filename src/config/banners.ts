// 페이지별 상단 배너 — '페이지당 상품 1개' 규칙.
// 구조상 key 하나에 배너 하나만 넣을 수 있고, scripts/check-content.mjs 가 상품 중복도 검사합니다.
// 상품 교체: product.name / headline / sub 만 바꾸면 됩니다. 문구는 광고 심의 후 반영하세요.
export type BannerKey = "home" | "kids" | "mom" | "health" | "pension" | "saving" | "business" | "special" | "senior";

export interface Banner {
  product: string; // 공식 상품명 (회차 표기 포함 시 그대로)
  nameVerified: boolean; // 우체국보험 공식 화면/고시로 상품명 확인 여부
  eMarkChecked: boolean; // e마크(온라인 전용) 아닌 것을 확인했는지 — false 이면 운영 빌드 차단
  headline: string;
  sub: string;
  cta: string;
  ctaHref?: string; // 없으면 상담 신청(/consult?topic=…)으로 연결
  detailPath: string; // 이 사이트의 상품 상세 페이지 (/products/<id>)
}

export const banners: Record<BannerKey, Banner> = {
  home: {
    product: "무배당 우체국New건강클리닉보험 2509", nameVerified: true, eMarkChecked: false,
    headline: "더 살아갈 날들을 위해, 오늘 든든한 준비를 시작하세요",
    sub: "부담 없는 시작, 충분히 비교한 선택. 소중한 내일을 우체국보험이 함께 준비합니다.",
    cta: "전체 상품보기", ctaHref: "/products", detailPath: "/products/P002",
  },
  health: {
    product: "우체국암케어보험", nameVerified: true, eMarkChecked: false,
    headline: "암 진단 이후의 걱정까지 미리 살펴보세요", sub: "내 보장이 충분한지 점검부터 시작해요.",
    cta: "건강 보장 상담하기", detailPath: "/products/P007",
  },
  pension: {
    product: "우체국연금보험 2504", nameVerified: true, eMarkChecked: false,
    headline: "노후 소득, 지금부터 하나씩 준비해요", sub: "나에게 맞는 수령 방식을 함께 살펴봅니다.",
    cta: "노후 준비 상담하기", detailPath: "/products/P041",
  },
  kids: {
    product: "우체국더든든한자녀지킴이보험", nameVerified: true, eMarkChecked: false,
    headline: "아이의 성장 단계에 맞춘 보장을 살펴보세요", sub: "자녀 보장이 처음이어도 쉽게 설명드립니다.",
    cta: "자녀 보장 상담하기", detailPath: "/products/P008",
  },
  mom: {
    product: "무배당 우체국대한민국엄마보험 2504", nameVerified: true, eMarkChecked: false,
    headline: "임신부터 출산까지, 필요한 준비를 살펴보세요", sub: "산모와 신생아 보장을 함께 안내합니다.",
    cta: "산모 보장 상담하기", detailPath: "/products/P030",
  },
  saving: {
    product: "무배당 파워적립보험 2504", nameVerified: true, eMarkChecked: false,
    headline: "목돈 마련, 내 계획에 맞게 살펴보세요", sub: "기간과 납입 조건을 함께 비교해 드립니다.",
    cta: "목돈 마련 상담하기", detailPath: "/products/P035",
  },
  business: {
    product: "무배당 win-win단체플랜보험 2504", nameVerified: true, eMarkChecked: false,
    headline: "함께 일하는 분들의 보장을 단체로 알아보세요", sub: "5인 이상 단체를 위한 보장 구성을 안내합니다.",
    cta: "단체 보장 상담하기", detailPath: "/products/P028",
  },
  special: {
    product: "우체국간편건강보험(325·355)", nameVerified: true, eMarkChecked: false,
    headline: "병력이 있어도 먼저 알아보세요", sub: "가입 가능 여부는 상담에서 차분히 확인해 드립니다.",
    cta: "간편 가입 상담하기", detailPath: "/products/P021",
  },
  senior: {
    product: "우체국치매요양간병보험", nameVerified: true, eMarkChecked: false,
    headline: "간병과 치매, 미리 준비해 두세요", sub: "가족 모두의 부담을 줄이는 방법을 함께 살펴봅니다.",
    cta: "간병 보장 상담하기", detailPath: "/products/P025",
  },
};

export const getBanner = (key: BannerKey): Banner => banners[key];
