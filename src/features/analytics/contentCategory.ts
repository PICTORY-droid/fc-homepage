// 자료 분류 — 이벤트가 일어난 주소(path)와 label(파일 이름·미리보기 제목)로 '자료 종류 › 세부 분야'를 정합니다.
// 화면·DB 와 분리된 순수 함수이며, 분류 이름은 config/ 의 각 자료 목록에서 가져옵니다. (자료가 늘어도 이 파일은 그대로)
import { cardCategories } from "@/config/cards";
import { allPositions } from "@/config/forms";
import { packGroups } from "@/config/pack";
import { getSheetGroup, sheetDownloadName, sheetGroups, sheetTemplates } from "@/config/sheets";
import { seasons } from "@/config/stationery";

export type ContentCategory = { type: string; sub: string };

const SHEETS = "엑셀 서식";
const ALL = "전체";

// 엑셀 서식 허브(/fun/sheets)에서는 주소에 분야가 없으므로 제목·파일 이름으로 분야를 찾습니다.
const sheetGroupByLabel = new Map<string, string>(
  sheetTemplates.flatMap((t) => {
    const label = sheetGroups.find((g) => g.key === t.group)?.label ?? ALL;
    return [[t.title, label], [sheetDownloadName(t), label]] as [string, string][];
  }),
);

/** 즐길거리 밖의 주소나 알 수 없는 주소는 undefined */
export function categorize(path: string, label?: string | null): ContentCategory | undefined {
  const seg = path.split(/[?#]/)[0].split("/").filter(Boolean);
  if (seg[0] !== "fun" || seg.length < 2) return undefined;
  const [, kind, key] = seg;

  if (kind === "sheets") {
    const fromPath = key ? getSheetGroup(key)?.label : undefined;
    return { type: SHEETS, sub: fromPath ?? (label && sheetGroupByLabel.get(label)) ?? "추천" };
  }
  if (kind === "cards") return { type: "명함 템플릿", sub: cardCategories.find((c) => c.key === key)?.label ?? ALL };
  if (kind === "forms") return { type: "이력서·자기소개서", sub: allPositions.find((p) => p.id === key)?.name ?? ALL };
  if (kind === "stationery") return { type: "감성 편지지", sub: seasons.find((s) => s.key === key)?.label ?? ALL };

  const group = packGroups.find((g) => g.slug === kind);
  if (group) return { type: group.title, sub: group.items.find((i) => i.key === key)?.title ?? ALL };
  return undefined;
}

/** 표에 쓰는 한 줄 이름 — 예) 엑셀 서식 › 소상공인·프리랜서 */
export const categoryKey = (c: ContentCategory) => `${c.type} › ${c.sub}`;
