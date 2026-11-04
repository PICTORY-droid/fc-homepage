// 즐길거리 첫 페이지의 '분류별 토글 목록' — 데이터 모양과 검색 규칙(순수 함수). 화면은 components/fun/hub, 목록은 config/funHubs.ts
export interface HubLink { label: string; href: string }
export interface HubThumb { src: string; alt: string }
export interface HubEntry {
  key: string;
  title: string;
  lead?: string;
  thumbs?: HubThumb[];
  thumbAspect?: number;
  links?: HubLink[]; // 펼치면 보이는 세부 바로가기
  cta?: HubLink; // 펼치면 맨 아래 '…모두 보기' 버튼
}
export interface HubSection { key: string; label?: string; entries: HubEntry[] }
/** 첫 화면에서 먼저 고르는 종류(예: 이력서 / 자기소개서) — 고르면 세부 링크 끝에 #key 가 붙어 그 칸으로 바로 이동 */
export interface HubMode { key: string; label: string; desc: string; icon?: string } // icon: 즐길거리 카드와 같은 그림 문자

/** 띄어쓰기·대소문자·가운뎃점 차이는 무시하고 비교합니다. */
export const normalize = (s: string) => s.toLowerCase().replace(/[\s·・,./()\-]+/g, "");

/** 검색어가 들어간 세부 링크만 남깁니다. 제목·설명이 맞으면 링크는 모두 보여 줍니다. 하나도 안 맞으면 null */
export function matchEntry(entry: HubEntry, query: string): HubEntry | null {
  const q = normalize(query);
  if (!q) return entry;
  if (normalize(`${entry.title}${entry.lead ?? ""}`).includes(q)) return entry;
  const links = (entry.links ?? []).filter((l) => normalize(l.label).includes(q));
  return links.length ? { ...entry, links } : null;
}

export const filterSections = (sections: HubSection[], query: string): HubSection[] =>
  sections
    .map((s) => ({ ...s, entries: s.entries.map((e) => matchEntry(e, query)).filter((e): e is HubEntry => e !== null) }))
    .filter((s) => s.entries.length > 0);

/** 고른 종류가 있으면 링크 끝에 #종류 를 붙입니다(이미 # 이 있으면 바꿈). */
export const withMode = (href: string, mode?: string) => (mode ? `${href.split("#")[0]}#${mode}` : href);
