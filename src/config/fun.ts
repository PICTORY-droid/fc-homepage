// 즐길거리(재미·자료실) 목록 — 허브 페이지(/fun)와 상단 메뉴가 이 목록 하나를 같이 씁니다.
// 새 콘텐츠를 추가할 때는 여기에 한 줄을 넣고 해당 페이지를 만들면 메뉴·허브에 자동으로 나타납니다.
export interface FunItem {
  slug: string;
  title: string;
  short: string; // 허브 카드 한 줄 설명
  href: string;
  icon: string; // 카드에 보이는 그림 문자
}

export const funItems: FunItem[] = [
  { slug: "stationery", title: "감성 편지지 10종", short: "우체국 감성의 편지지를 무료로 받아 인쇄하거나 폰으로 써 보세요.", href: "/fun/stationery", icon: "✉️" },
  { slug: "forms", title: "이력서·자기소개서 양식 10종", short: "이력서 5종·자기소개서 5종 빈 양식을 PDF로 무료로 받아 가세요.", href: "/fun/forms", icon: "📄" },
];
