// 즐길거리(재미·자료실) 목록 — 허브 페이지(/fun)와 상단 메뉴가 이 목록 하나를 같이 씁니다.
// 새 콘텐츠를 추가할 때는 여기에 한 줄을 넣고 해당 페이지를 만들면 메뉴·허브에 자동으로 나타납니다.
import { listedPackGroups } from "./pack";

export interface FunItem {
  slug: string;
  title: string;
  short: string; // 허브 카드 한 줄 설명
  href: string;
  icon: string; // 카드에 보이는 그림 문자
}

// 메뉴는 제목이 짧은 것부터 보여 줍니다(긴 제목이 중간에 끼어 시선을 흩뜨리지 않게). 항목을 추가해도 자동으로 제자리를 찾아요.
const unsorted: FunItem[] = [
  { slug: "stationery", title: "감성 편지지", short: "계절 편지지와 한국 전통문화를 비롯한 주제 편지지, 제목까지 고쳐 쓰는 감성 편지지를 Word로 받아 쓰세요.", href: "/fun/stationery", icon: "✉️" },
  // 자료 꾸러미(PPT …) — config/pack.ts 의 묶음이 늘어나면 자동으로 추가됩니다. (엑셀 양식은 아래 '생활·업무 엑셀 서식' 안의 테마 모음)
  ...listedPackGroups.map((g) => ({ slug: g.slug, title: g.title, short: g.short, href: `/fun/${g.slug}`, icon: g.icon })),
  { slug: "cards", title: "명함 템플릿", short: "직장인·사장님·프리랜서·선생님·공무원 등 직종별, 앞뒤가 모두 다른 명함을 PPT·SVG로 받아 이름만 고쳐 쓰세요.", href: "/fun/cards", icon: "🪪" },
  { slug: "forms", title: "직업별 이력서·자기소개서", short: "포지션마다 짜임이 다른 이력서·자기소개서, 작성 가이드가 붙은 Word 양식을 무료로 받으세요.", href: "/fun/forms", icon: "📄" },
  { slug: "sheets", title: "생활·업무 엑셀 서식", short: "가계부·보험 증권 정리표·견적서부터 취업·학습·모임까지 분야별 서식과 계절 감성 테마 모음, 입력하면 자동으로 계산돼요.", href: "/fun/sheets", icon: "🧮" },
];

export const funItems: FunItem[] = [...unsorted].sort((a, b) => a.title.length - b.title.length);
