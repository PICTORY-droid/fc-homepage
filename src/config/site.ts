// 사이트 기본 정보 — 이름/연락처/고지 문구는 여기 한 곳에서만 수정합니다.
export const site = {
  /** false 이면 '임시 프로필'로 간주되어 운영 빌드(REQUIRE_REVIEW=1)에서 차단됩니다. */
  profileConfirmed: false,
  fcName: "우체국보험 FC",
  /** 상단 헤더에 보이는 이름 (FC 표기 없이) */
  brandName: "우체국보험",
  affiliation: "", // TODO: 소속 우체국 (예: ○○우체국). 비워두면 표시 안 함
  tagline: "",
  /** 로고: src 가 비어 있으면 자체 제작 마크 사용. 승인받은 로고를 public/ 에 넣고 경로(예: "/logo.png")를 입력 */
  logo: { src: "", alt: "" },
  /** 배너 아래 신뢰 문구 — 실제 지킬 수 있는 내용만 (심의 시 함께 검토) */
  trust: ["충분히 비교한 뒤 결정", "가입 전 약관·상품설명서 확인", "동의한 정보만 보관"],
  title: "우체국보험 FC 상담 안내",
  description: "필요한 보장을 함께 살펴보세요. 우체국보험 상품 안내와 상담 신청을 도와드립니다.",
  /** 프로필 섹션 (사진 없이 이름·소개·상담 방식만 표시) */
  profile: {
    role: "우체국보험 FC",
    region: "경남 김해",
    intro: "필요한 보장을 차분히 비교해 보실 수 있도록 쉽게 설명드립니다.",
    approach: [
      ["먼저 들어요", "지금 걱정되는 부분과 이미 가입한 보장을 먼저 여쭤봅니다."],
      ["비교해서 설명해요", "상품요약서와 약관 기준으로 가입 조건과 보장 내용을 설명드립니다."],
      ["천천히 결정하세요", "상담만으로 가입이 진행되지 않습니다. 충분히 검토한 뒤 결정하세요."],
    ],
  },
  contact: {
    fcPhone: "010-2192-1599", // 사용자 제공 번호 (본인 상담 번호 확인 필요)
    officialCenterPhone: "1599-0100", // 우체국보험 공식 고객센터 (공식 사이트 화면으로 확인)
    hours: "평일 09:00~18:00 (점심 12:00~13:00)",
    /** 카카오톡 오픈프로필/채널 주소 — 입력하면 홈 첫 화면에 '카톡 상담' 버튼이 나타납니다. 비워두면 표시 안 함 */
    kakaoUrl: "https://qr.kakao.com/talk/VYw0MTJ1r5dyrzFUjCyEfsbtefg-",
  },
  links: {
    officialSite: "https://www.epostlife.go.kr",
    officialProducts: "https://www.epostlife.go.kr/IGAGDM00AT.do",
  },
  /** 광고 심의 번호 — 심의 통과 후 입력. 모든 상품 배너 하단에 표시됩니다. */
  reviewNo: "", // TODO: 심의필 번호
  notices: {
    premium: "보험료와 보장 내용은 가입 조건에 따라 달라질 수 있습니다. 가입 전 상품설명서와 약관을 꼭 확인하세요.",
    promise: "상담만으로 가입이 진행되지 않습니다. 충분히 비교하고 결정하세요.",
    basis: "상품 정보는 우체국보험 상품요약서·사업방법서와 우정사업본부 고시를 기준으로 정리했으며, 각 상품 화면에 기준일을 표시합니다.",
  },
  privacy: {
    purpose: "상담 신청에 대한 회신 및 상담 진행",
    items: "이름, 연락처, 가입 대상 연령, 관심 분야, 희망 연락 시간",
    sensitiveItems: "(선택) 가입 중인 보험, 입원·수술 이력, 치료·복약 중인 질환, 가족력 등 건강 관련 정보 — '기타 / 잘 모르겠어요' 선택 시 별도 동의를 받은 경우에만 수집",
    retentionMonths: null as number | null, // TODO: 보유 기간(개월) 확정 필요
    contactEmail: "", // TODO: 개인정보 문의 이메일
  },
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
