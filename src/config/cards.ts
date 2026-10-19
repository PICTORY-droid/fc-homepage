// 명함 템플릿 — 분류 10개 × 50장. 파일은 public/fun/cards/<분류>/ 에 있고, 목록(cards.data.json)은 scripts/fun/cards/make_cards.py 가 만듭니다.
import data from "./cards.data.json";

export type CardCategoryKey = "office" | "food" | "beauty" | "life" | "creative" | "expert" | "teacher" | "public" | "care" | "finance";

export interface CardEntry { no: number; name: string; title: string; tag: string; main: string; soft: string; theme: string }
export interface CardCategory { key: CardCategoryKey; label: string; short: string; items: CardEntry[] }

const meta: Record<CardCategoryKey, string> = {
  office: "영업·마케팅·개발·디자인·경영지원 등 회사 포지션별 명함",
  food: "카페·음식점·베이커리 사장님을 위한 따뜻한 명함",
  beauty: "헤어·네일·피부·메이크업 샵 명함",
  life: "꽃집·세탁·수리·인테리어 등 우리 동네 가게 명함",
  creative: "디자이너·사진작가·영상 감독·작가를 위한 프리랜서 명함",
  expert: "개발자·번역가·강사·컨설턴트를 위한 프리랜서 명함",
  teacher: "학교·학원·유치원·어린이집 선생님 명함",
  public: "주무관·팀장·담당관 등 공무원 명함",
  care: "병원·약국·한의원·돌봄 종사자 명함",
  finance: "금융·보험·부동산·세무 분야 상담 명함",
};

const raw = data as unknown as Record<CardCategoryKey, { label: string; items: CardEntry[] }>;
export const cardCategories: CardCategory[] = (Object.keys(meta) as CardCategoryKey[]).map((key) => ({ key, label: raw[key].label, short: meta[key], items: raw[key].items }));

export const getCardCategory = (key: string) => cardCategories.find((c) => c.key === key);

const nn = (n: number) => String(n).padStart(2, "0");

export const cardPptx = (c: CardCategoryKey, e: CardEntry) => `/fun/cards/${c}/${e.name}.pptx`;
export const cardSvg = (c: CardCategoryKey, e: CardEntry) => `/fun/cards/${c}/${e.name}.svg`; // 앞면·뒷면이 한 파일에 위아래로 들어 있음(파일 이름도 한글)
export const cardThumb = (c: CardCategoryKey, no: number) => `/fun/cards/${c}/thumbs/${c}-${nn(no)}.jpg`;

/** 내려받을 때 보이는 한글 이름 — 예) 명함_직장인_01_매화피는아침.pptx / .svg */
export const cardDownloadName = (e: CardEntry, ext: "pptx" | "svg") => `${e.name}.${ext}`;

export const CARD_ASPECT = 640 / 726;
