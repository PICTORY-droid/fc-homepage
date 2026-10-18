// 사이트 기본 정보 — 이름/연락처/고지 문구는 여기 한 곳에서만 수정합니다.
export const site = {
  /** false 이면 '임시 프로필'로 간주되어 운영 빌드(REQUIRE_REVIEW=1)에서 차단됩니다. */
  profileConfirmed: false,
  fcName: "담당 FC", // TODO: 본인 이름
  affiliation: "", // TODO: 소속 우체국 (예: ○○우체국). 비워두면 표시 안 함
  tagline: "우체국보험 FC",
  /** 로고: src 가 비어 있으면 자체 제작 마크 사용. 승인받은 로고를 public/ 에 넣고 경로(예: "/logo.png")를 입력 */
  logo: { src: "", alt: "" },
  /** 배너 아래 신뢰 문구 — 실제 지킬 수 있는 내용만 (심의 시 함께 검토) */
  trust: ["충분히 비교한 뒤 결정", "가입 전 약관·상품설명서 확인", "동의한 정보만 보관"],
  title: "우체국보험 FC 상담 안내",
  description: "우체국보험 FC가 운영하는 개인 안내 페이지입니다. 필요한 보장을 함께 살펴보세요.",
  contact: {
    fcPhone: "010-2192-1599", // 사용자 제공 번호 (본인 상담 번호 확인 필요)
    officialCenterPhone: "1599-0100", // 우체국보험 공식 고객센터 (공식 사이트 화면으로 확인)
    hours: "평일 09:00~18:00 (점심 12:00~13:00)",
  },
  links: {
    officialSite: "https://www.epostlife.go.kr",
    officialProducts: "https://www.epostlife.go.kr/IGAGDM00AT.do",
  },
  /** 광고 심의 번호 — 심의 통과 후 입력. 모든 상품 배너 하단에 표시됩니다. */
  reviewNo: "", // TODO: 심의필 번호
  notices: {
    notOfficial: "본 페이지는 우체국보험 FC 개인이 운영하는 안내 페이지이며, 우체국 공식 사이트가 아닙니다.",
    premium: "보험료와 보장 내용은 가입 조건에 따라 달라질 수 있습니다. 가입 전 상품설명서와 약관을 꼭 확인하세요.",
    promise: "상담만으로 가입이 진행되지 않습니다. 충분히 비교하고 결정하세요.",
  },
  privacy: {
    purpose: "상담 신청에 대한 회신 및 상담 진행",
    items: "이름, 연락처, 관심 분야, 희망 연락 시간",
    retentionMonths: null as number | null, // TODO: 보유 기간(개월) 확정 필요
    contactEmail: "", // TODO: 개인정보 문의 이메일
  },
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
