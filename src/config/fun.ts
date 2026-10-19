// 즐길거리(재미·자료실) 목록 — 허브 페이지(/fun)와 상단 메뉴가 이 목록 하나를 같이 씁니다.
// 새 콘텐츠를 추가할 때는 여기에 한 줄을 넣고 해당 페이지를 만들면 메뉴·허브에 자동으로 나타납니다.
import { packGroups } from "./pack";

export interface FunItem {
  slug: string;
  title: string;
  short: string; // 허브 카드 한 줄 설명
  href: string;
  icon: string; // 카드에 보이는 그림 문자
}

// 메뉴는 제목이 짧은 것부터 보여 줍니다(긴 제목이 중간에 끼어 시선을 흩뜨리지 않게). 항목을 추가해도 자동으로 제자리를 찾아요.
const unsorted: FunItem[] = [
  { slug: "stationery", title: "계절 편지지", short: "봄·여름·가을·겨울 각 20장, 서로 다른 그림의 편지지를 Word로 받아 바로 쓰세요.", href: "/fun/stationery", icon: "✉️" },
  // 자료 꾸러미(엑셀·PPT·워드 …) — config/pack.ts 의 묶음이 늘어나면 자동으로 추가됩니다.
  ...packGroups.map((g) => ({ slug: g.slug, title: g.title, short: g.short, href: `/fun/${g.slug}`, icon: g.icon })),
  { slug: "forms", title: "직업별 이력서·자기소개서", short: "포지션 20개마다 이력서 5종·자기소개서 5종, 짜임이 모두 다른 Word 양식을 무료로 받으세요.", href: "/fun/forms", icon: "📄" },
];

export const funItems: FunItem[] = [...unsorted].sort((a, b) => a.title.length - b.title.length);
