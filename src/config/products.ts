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
  P011: { tags: ["예금 제휴"], headline: "우체국 예금과 함께 보장을 더해요" },
  P012: { tags: ["단체", "구성원"], headline: "함께 일하는 동료, 모두 함께 지켜요" },
  P013: { tags: ["상해", "교통"], headline: "안전벨트처럼 매일을 든든하게" },
  P014: { tags: ["실손의료비"], headline: "병원비 부담은 실손으로 가볍게" },
  P015: { tags: ["실손 전환", "재개"], headline: "실손 보장, 끊김 없이 이어가세요" },
  P016: { tags: ["노후 실손"], headline: "나이 들어서도 병원비 걱정 덜게" },
  P017: { tags: ["간편 실손"], headline: "가입은 간편하게, 병원비는 든든하게" },
  P018: { tags: ["공익형 소액 보장"], headline: "만원으로 지키는 큰 행복" },
  P019: { tags: ["상해", "안전"], headline: "오가는 길 위에서도 안전하게 지켜요" },
  P020: { tags: ["건강 종합"], headline: "흩어진 건강 보장, 하나로 통합해요" },
  P021: { tags: ["간편 건강"], headline: "간편한 고지로 건강 보장을 준비해요" },
  P022: { tags: ["간편 건강"], headline: "더 간편하게, 건강을 지켜요" },
  P023: { tags: ["치아 보장"], headline: "환한 미소를 위한 치아 보장" },
  P024: { tags: ["간병"], headline: "간병이 필요할 때 가족 부담을 덜어요" },
  P025: { tags: ["치매", "요양", "간병"], headline: "부모님의 내일, 미리 준비해요" },
  P026: { tags: ["당뇨", "합병증"], headline: "당뇨가 있어도 안심할 수 있게" },
  P027: { tags: ["맞춤 설계"], headline: "내게 필요한 보장만 골라 담아요" },
  P028: { tags: ["단체", "재해"], headline: "직원도 회사도 함께 win-win" },
  P030: { tags: ["엄마", "아이"], headline: "엄마와 아이를 함께 지켜요" },
  P031: { tags: ["청소년", "저축"], headline: "아이의 꿈을 위해 차곡차곡 모아요" },
  P034: { tags: ["저축"], headline: "차곡차곡 모으고 보너스로 키워요" },
  P035: { tags: ["적립", "저축"], headline: "꾸준히 쌓아서 목돈을 만들어요" },
  P041: { tags: ["노후 연금"], headline: "평생 든든한 노후 준비" },
  P042: { tags: ["노후 연금"], headline: "노후 준비에 보너스를 팡팡!" },
  P043: { tags: ["연금저축"], headline: "노후 준비와 세액공제를 함께" },
  P044: { tags: ["연금저축 이전"], headline: "다른 곳 연금저축도 우체국으로 옮겨요" },
  P045: { tags: ["개인연금 이전"], headline: "개인연금도 우체국으로 옮겨요" },
  P046: { tags: ["함께하는 연금"], headline: "어깨동무하듯 노후를 함께 준비해요" },
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
