// 계절 편지지 80장 — 파일은 public/fun/stationery/ 에 있고 scripts/fun/memory/build.mjs + scripts/fun/docx/make_stationery_docx.py 로 만듭니다.
// 목록(stationery.data.json)은 build.mjs 가 만든 meta.json 에서 뽑은 것입니다.
import data from "./stationery.data.json";

export type SeasonKey = "spring" | "summer" | "autumn" | "winter";
export interface Stationery { id: string; season: SeasonKey; no: number; name: string; tag: string }
export interface Season { key: SeasonKey; label: string; lead: string }

export const seasons: Season[] = [
  { key: "spring", label: "봄", lead: "새 학기 첫날, 교문 앞 병아리, 어버이날 편지… 그 봄의 기억" },
  { key: "summer", label: "여름", lead: "방학식, 소나기, 평상 위 수박… 그 여름의 기억" },
  { key: "autumn", label: "가을", lead: "운동회, 은행잎 책갈피, 귀성 열차… 그 가을의 기억" },
  { key: "winter", label: "겨울", lead: "첫눈, 군고구마, 연하장… 그 겨울의 기억" },
];

export const stationery = data as Stationery[];
export const stationeryBySeason = (key: SeasonKey) => stationery.filter((s) => s.season === key);

/** 내려받을 때 보이는 한글 파일 이름 — 예) 편지지_봄01_벚꽃편지.docx (실제 파일 이름도 같아요) */
export const stationeryDownloadName = (s: Stationery, ext: "png" | "docx") => {
  const label = seasons.find((x) => x.key === s.season)?.label ?? "";
  return `편지지_${label}${String(s.no).padStart(2, "0")}_${s.name.replace(/\s+/g, "")}.${ext}`;
};

/** 파일 주소 — Word·PNG 는 한글 이름 그대로, 미리보기 그림만 영문 id */
export const stationeryFile = (s: Stationery, ext: "png" | "docx" | "jpg") => (ext === "jpg" ? `/fun/stationery/thumbs/${s.id}.jpg` : `/fun/stationery/${stationeryDownloadName(s, ext)}`);
