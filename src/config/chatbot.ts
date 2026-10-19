// 안내 도우미(챗봇) 문구 — AI가 아닌 '정해 둔 답변' 방식입니다. 문구·키워드는 이 파일만 고치면 됩니다.
// 규칙: 보험료 금액·가입 가능 여부·보장 판단·가입 권유는 답하지 않고 상담으로 연결합니다.
// 주의: 문구를 바꾸면 광고 심의 대상이 될 수 있습니다.
// 다이렉트 보험 관련 안내는 넣지 않습니다(사용자 지시). 공식 고객센터 번호(1599-0100)는 직접 쓴 문구에는 넣지 않습니다.
import { site } from "./site";
import type { CategorySlug } from "./categories";
import { officialFaqCategories } from "./officialFaq";

/** short: 버튼이 3개 이상일 때 쓰는 짧은 글자(없으면 label 그대로) */
export interface ChatLink { label: string; short?: string; href: string; external?: boolean }

export interface FaqEntry {
  id: string;
  /** 입력에 이 단어가 들어 있으면 이 답을 보여줍니다 (공백·대소문자 무시, 2글자 이상) */
  keywords: string[];
  text: string;
  links?: ChatLink[];
  suggestions?: string[];
}

const kakao: ChatLink[] = site.contact.kakaoUrl ? [{ label: "카카오톡으로 문의하기", short: "카카오톡", href: site.contact.kakaoUrl, external: true }] : [];
const consult: ChatLink = { label: "상담 신청하기", short: "상담신청", href: "/consult" };
/** 우체국보험 공식 홈페이지 '자주하는 질문' 주소 (답변 원문은 officialFaq.data.json 에 있습니다) */
export const OFFICIAL_FAQ_URL = "https://epostlife.go.kr/IPCCFQ0001.do";

export const chatbotCopy = {
  title: "우체국보험 안내 도우미",
  shortTitle: "안내 도우미",
  launcherLabel: "궁금한 점 물어보세요",
  inputPlaceholder: "예) 아이 보험, 암, 연금",
  inputLabel: "궁금한 내용 입력",
  privacyNote: "이름·연락처·주민번호는 입력하지 마세요.",
  greeting: "안녕하세요! 우체국보험 안내 도우미예요. 상품 찾기와 상담 연결을 도와드려요.",
  greetingSub: "보험료·가입 가능 여부처럼 정확해야 하는 내용은 상담에서 안내해 드려요.",
  quickReplies: ["내게 맞는 상품 찾기", "가입 조건·나이", "보험료가 궁금해요", "자주 묻는 질문", "상담 신청하기", "카카오톡 문의"],
  maxInputLength: 100,
  /** 공식 답변 아래에 붙는 출처 줄 */
  faqSourceLine: "출처: 우체국보험 공식 자주하는 질문",
  faqListText: "관련된 질문을 찾았어요. 궁금한 질문을 눌러 보세요.",
  fallback: {
    text: "그 질문은 제가 정확히 안내하기 어려워요. 상담으로 연결해 드릴게요.",
    suggestions: ["내게 맞는 상품 찾기", "상담 신청하기"],
  },
  /** 개인정보로 보이는 숫자를 입력했을 때 */
  sensitive: {
    text: "개인정보(주민번호·연락처·계좌번호 등)는 이 대화창에 입력하지 말아 주세요. 대화 내용은 저장되지 않지만, 연락처는 아래 상담 신청서로 남겨 주세요.",
  },
  empty: "원하시는 내용을 짧게 입력해 주세요. 예) 아이 보험, 암, 연금",
} as const;

export const faq: FaqEntry[] = [
  {
    id: "faq-list",
    keywords: ["자주하는질문", "자주묻는질문", "faq", "질문목록"],
    text: "우체국보험 공식 '자주하는 질문'을 분류별로 찾아보실 수 있어요. 궁금한 분류를 골라 보세요. '자동이체 변경', '청약 철회'처럼 직접 입력하셔도 돼요.",
    links: [{ label: "공식 자주하는 질문 전체 보기", short: "공식 FAQ", href: OFFICIAL_FAQ_URL, external: true }],
    suggestions: [...officialFaqCategories],
  },
  {
    id: "find",
    keywords: ["상품찾기", "맞는상품", "추천", "뭐가좋", "어떤보험", "고르"],
    text: "어떤 걱정이 있으신가요? 아래에서 고르시거나 '아이', '암', '연금'처럼 입력해 보세요. 30초 보장 점검으로도 살펴보실 수 있어요.",
    links: [{ label: "30초 보장 점검", short: "보장점검", href: "/find" }, { label: "보험 상품 전체 보기", short: "전체상품", href: "/products" }],
    suggestions: ["건강·암 보장", "노후·연금", "어린이·가족", "산모·신생아", "저축·목돈 마련", "시니어·간병·치매", "병력이 있으신 분", "기업·단체"],
  },
  {
    id: "conditions",
    keywords: ["가입조건", "가입나이", "나이제한", "가입한도", "보험기간", "납입기간", "몇살", "가입자격"],
    text: "가입 나이·보험기간·가입 한도는 상품마다 달라요. 상품 이름이나 분야를 입력하시면 해당 상품 페이지에서 '상품 정보'를 확인하실 수 있게 안내해 드릴게요.",
    links: [{ label: "보험 상품 전체 보기", short: "전체상품", href: "/products" }],
    suggestions: ["내게 맞는 상품 찾기", "상담 신청하기"],
  },
  {
    id: "premium",
    keywords: ["보험료", "월납", "가격", "비용", "얼마내", "얼마나내"],
    text: "보험료는 나이·성별·보험기간·보장 구성 등 가입 조건에 따라 달라져서 여기서 금액을 말씀드릴 수 없어요. 상담에서 조건에 맞게 안내해 드립니다.",
    links: [consult, ...kakao],
  },
  {
    id: "consult",
    keywords: ["상담", "상담신청", "상담하고", "상담받", "신청하", "문의하", "상담할"],
    text: "상담 신청서를 남겨 주시면 확인 후 안내해 드려요. 상담만으로 가입이 진행되지 않으니 부담 없이 신청하세요.",
    links: [consult, ...kakao],
  },
  {
    id: "kakao",
    keywords: ["카카오", "카톡", "톡상담", "채팅"],
    text: "카카오톡으로 방문 없이 편하게 문의하실 수 있어요.",
    links: [...kakao, consult],
  },
  {
    id: "contact",
    keywords: ["전화", "전화상담", "연락처", "번호", "통화", "영업시간", "운영시간", "언제연락"],
    text: `전화 상담은 ${site.contact.hours}에 가능해요. 시간 외에는 상담 신청서나 카카오톡으로 남겨 주시면 확인 후 연락드려요.`,
    links: [{ label: "전화 상담하기", short: "전화", href: `tel:${site.contact.fcPhone}` }, consult, ...kakao],
  },
  {
    id: "promise",
    keywords: ["가입되", "바로가입", "강매", "강요", "상담만", "의무"],
    text: site.notices.promise,
    links: [consult],
  },
  {
    id: "compare",
    keywords: ["비교", "차이", "상품비교"],
    text: "상품을 나란히 놓고 비교해 보실 수 있어요.",
    links: [{ label: "상품 비교하기", short: "비교하기", href: "/compare" }, { label: "보험 상품 전체 보기", short: "전체상품", href: "/products" }],
  },
  {
    id: "privacy",
    keywords: ["개인정보", "정보보관", "정보수집", "보관기간"],
    text: "상담 신청 시 입력하신 정보는 동의한 목적으로만 사용해요. 자세한 내용은 개인정보 처리방침에서 확인하실 수 있어요.",
    links: [{ label: "개인정보 처리방침", short: "처리방침", href: "/privacy" }],
  },
  {
    id: "basis",
    keywords: ["출처", "기준일", "믿을", "정확", "공식"],
    text: site.notices.basis,
    links: [{ label: "이용 안내", href: "/guide" }],
  },
  {
    id: "guide",
    keywords: ["가입방법", "가입절차", "이용안내", "어떻게가입", "서류"],
    text: "이용 방법과 상담 절차는 이용 안내에서 확인하실 수 있어요.",
    links: [{ label: "이용 안내", href: "/guide" }, consult],
  },
  {
    id: "profile",
    keywords: ["담당자", "설계사", "누구", "소개"],
    text: "상담을 도와드리는 담당 FC 소개 페이지예요.",
    links: [{ label: "담당 FC 소개", href: "/profile" }],
  },
  {
    id: "hello",
    keywords: ["안녕", "하이", "반가", "처음"],
    text: "안녕하세요! 궁금한 분야를 입력하거나 아래 버튼을 눌러 보세요.",
    suggestions: ["내게 맞는 상품 찾기", "가입 조건·나이", "상담 신청하기"],
  },
  {
    id: "thanks",
    keywords: ["감사", "고마워", "고맙"],
    text: "도움이 되었다면 다행이에요. 더 궁금한 점이 있으면 편하게 물어보세요.",
    links: [consult],
  },
];

/** 분야별로 입력에서 찾을 단어 — 분야 slug 는 config/categories.ts 와 같아야 합니다. */
export const categoryKeywords: Record<CategorySlug, string[]> = {
  health: ["건강", "암", "질병", "입원", "수술", "뇌", "심장", "진단", "치아", "병원"],
  pension: ["연금", "노후", "은퇴", "퇴직"],
  kids: ["아이", "자녀", "어린이", "아기", "아가", "태아", "청소년", "가족", "학생"],
  mom: ["임신", "출산", "산모", "신생아", "엄마", "태교"],
  saving: ["저축", "목돈", "적금", "적립", "모으"],
  senior: ["치매", "간병", "요양", "부모님", "어르신", "시니어"],
  special: ["병력", "간편", "유병", "약복용", "치료중", "고지", "당뇨", "고혈압"],
  business: ["기업", "단체", "직원", "임직원", "사업장", "회사", "법인"],
};
