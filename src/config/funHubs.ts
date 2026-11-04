// 즐길거리 각 첫 페이지의 '분류별 토글 목록' 데이터 — 자료 설정(편지지·명함·PPT·엑셀·이력서)에서 자동으로 만듭니다.
// 자료가 늘어나면 토글도 저절로 늘어나요. 화면은 components/fun/hub/HubDirectory.tsx
import type { HubMode, HubSection } from "@/lib/fun/hubDirectory";
import { seasons, stationeryBySeason, stationeryFile } from "./stationery";
import { CARD_ASPECT, cardCategories, cardThumb } from "./cards";
import { packEntries, packThumb, type PackGroup } from "./pack";
import { SHEET_ASPECT, sheetGroups, sheetThumb } from "./sheets";
import { jobGroups } from "./forms";

const firstThree = <T,>(list: T[]) => list.slice(0, 3);

export function stationeryHub(): HubSection[] {
  const build = (group: "season" | "theme", label: string): HubSection => ({
    key: group, label,
    entries: seasons.filter((s) => s.group === group).map((s) => {
      const list = stationeryBySeason(s.key);
      const href = `/fun/stationery/${s.key}`;
      return {
        key: s.key, title: `${s.label} 편지지`, lead: s.lead,
        thumbs: firstThree(list).map((it) => ({ src: stationeryFile(it, "jpg"), alt: `${it.name} 편지지 미리보기` })),
        cta: { label: `${s.label} 편지지 모두 보기`, href },
      };
    }),
  });
  return [build("season", "계절 편지지"), build("theme", "주제 편지지")];
}

export function cardsHub(): HubSection[] {
  return [{
    key: "cards",
    entries: cardCategories.map((c) => ({
      key: c.key, title: c.label, lead: c.short, thumbAspect: CARD_ASPECT,
      thumbs: [1, 2, 3].map((n) => ({ src: cardThumb(c.key, n), alt: `${c.label} 명함 ${n} 미리보기` })),
      cta: { label: `${c.label} 명함 모두 보기`, href: `/fun/cards/${c.key}` },
    })),
  }];
}

export function packHub(g: PackGroup): HubSection[] {
  return [{
    key: g.slug,
    entries: g.items.map((it) => {
      const all = packEntries(it);
      const thumbs = firstThree(all).flatMap((e) => { const src = packThumb(it, e.no); return src ? [{ src, alt: `${it.title} ${e.name} 미리보기` }] : []; });
      return {
        key: it.key, title: it.title, thumbs, thumbAspect: it.aspect,
        cta: { label: `${it.title} 모두 보기`, href: `/fun/${g.slug}/${it.key}` },
      };
    }),
  }];
}

export function sheetsHub(): HubSection[] {
  return [{
    key: "sheets",
    entries: sheetGroups.map((g) => ({
      key: g.key, title: g.label, lead: g.short,
      thumbAspect: SHEET_ASPECT,
      thumbs: firstThree([...g.items.filter((t) => t.featured), ...g.items.filter((t) => !t.featured)]).map((t) => ({ src: sheetThumb(t), alt: `${t.title} 미리보기` })),
      cta: { label: `${g.label} 서식 모두 보기`, href: `/fun/sheets/${g.key}` },
    })),
  }];
}

export const formModes: HubMode[] = [
  { key: "resume", label: "이력서", icon: "📄", desc: "직무마다 짜임이 다른 양식" },
  { key: "cover", label: "자기소개서", icon: "✍️", desc: "직무마다 다른 양식 — STAR·NCS 작성법 가이드와 예시가 붙은 Word 양식" },
];

export function formsHub(): HubSection[] {
  return [{
    key: "forms",
    entries: jobGroups.map((g) => ({
      key: g.key, title: g.label,
      links: g.positions.map((p) => ({ label: p.name, href: `/fun/forms/${p.id}` })),
    })),
  }];
}

