// 판매 중인 우체국보험 상품 — 사실 데이터는 products.data.json(엑셀에서 변환), 편집 내용(상담 분야·소개 문구·이미지)은 이 파일에서 관리합니다.
// 엑셀 갱신: python3 scripts/import-products.py <엑셀 경로>  (판매중지·온라인 상품은 자동 제외)
import raw from "./products.data.json";
import type { CategorySlug } from "./categories";

export type ProductGroup = "보장성" | "저축성" | "연금";
export type ConsultTopic = CategorySlug | "other";

interface RawProduct {
  id: string; name: string; group: string; effectiveDate: string;
  ageRange?: string; period?: string; limit?: string; coverage?: string[]; jobCheck?: boolean;
}

export interface Product extends Omit<RawProduct, "group"> {
  group: ProductGroup;
  displayName: string;
  /** 상담 신청 시 미리 선택될 분야 — 상품 성격에 맞춘 편집 판단입니다. */
  topic: ConsultTopic;
  slogan?: { tags: string[]; headline: string };
  /** public/products/<id>.webp, <id>-thumb.webp 가 있으면 true */
  image: boolean;
}

export const productsMeta = {
  source: "우정사업본부 고시 [별표 1] 우체국보험의 종류 (국가법령정보센터)",
  asOf: "2026-10-18",
  /** e마크(온라인·콜센터 전용) 상품이 섞여 있지 않은지 우체국보험 홈페이지에서 확인한 뒤 true 로 바꾸세요. false 이면 운영 빌드(REQUIRE_REVIEW=1)가 차단됩니다. */
  eMarkVerified: false,
};

export const GROUP_ORDER: ProductGroup[] = ["보장성", "저축성", "연금"];

// 상담 분야 연결 (편집 판단)
const TOPIC: Record<string, ConsultTopic> = {
  P001: "health", P002: "health", P003: "health", P004: "health", P005: "health", P006: "other",
  P007: "health", P008: "kids", P009: "other", P010: "other", P011: "other", P012: "business",
  P013: "other", P014: "health", P015: "health", P016: "senior", P017: "special", P018: "other",
  P019: "other", P020: "health", P021: "special", P022: "special", P023: "health", P024: "senior",
  P025: "senior", P026: "special", P027: "other", P028: "business", P030: "mom",
  P031: "saving", P034: "saving", P035: "saving",
  P041: "pension", P042: "pension", P043: "pension", P044: "pension", P045: "pension", P046: "pension",
};

// 목록에 표시할 이름 (엑셀 상품명에 설명 문구가 붙은 경우만)
const DISPLAY_NAME: Record<string, string> = { P030: "우체국대한민국엄마보험" };

// 보유 중인 상품 안내 이미지(홍보 카드)의 문구 — 이미지에 적힌 내용 그대로입니다.
const SLOGAN: Record<string, { tags: string[]; headline: string }> = {
  P001: { tags: ["종신", "건강"], headline: "평생의 보장에 건강 걱정까지 든든하게" },
  P002: { tags: ["건강", "질병"], headline: "아플 때 곁에 있는 건강 주치의 같은 보험" },
  P003: { tags: ["뇌", "심장"], headline: "뇌와 심장 건강, 미리 챙겨두세요" },
  P004: { tags: ["암", "뇌", "심장 치료비"], headline: "3대 질병 치료비, 미리 준비하면 든든해요" },
  P005: { tags: ["종신", "건강"], headline: "건강 보장을 하나로, 평생 OK!" },
  P006: { tags: ["정기 보장"], headline: "꼭 필요한 기간만 실속 있게 지켜요" },
  P007: { tags: ["암 보장"], headline: "암 걱정은 덜고 치료에 집중하세요" },
  P008: { tags: ["어린이", "자녀"], headline: "우리 아이 성장길, 더 든든하게 지켜요" },
  P009: { tags: ["함께하는 보장"], headline: "어깨동무하듯 곁에서 함께 지켜요" },
  P010: { tags: ["상해 보장"], headline: "뜻밖의 사고에도 든든하게 대비해요" },
};
const HAS_IMAGE = new Set(Object.keys(SLOGAN));

export const products: Product[] = (raw as RawProduct[]).map((r) => ({
  ...r,
  group: r.group as ProductGroup,
  displayName: DISPLAY_NAME[r.id] ?? r.name,
  topic: TOPIC[r.id] ?? "other",
  slogan: SLOGAN[r.id],
  image: HAS_IMAGE.has(r.id),
}));

export const TOPIC_IDS = Object.keys(TOPIC);
