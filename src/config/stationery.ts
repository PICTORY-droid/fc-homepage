// 계절 편지지 80장 — 파일은 public/fun/stationery/ 에 있고 scripts/fun/seasons/build.mjs + scripts/fun/docx/make_stationery_docx.py 로 만듭니다.
// 목록(stationery.data.json)은 build.mjs 가 만든 meta.json 에서 뽑은 것입니다.
import data from "./stationery.data.json";

export type SeasonKey = "spring" | "summer" | "autumn" | "winter";
export interface Stationery { id: string; season: SeasonKey; no: number; name: string; tag: string }
export interface Season { key: SeasonKey; label: string; lead: string }

export const seasons: Season[] = [
  { key: "spring", label: "봄", lead: "벚꽃·입춘·어버이날… 꽃소식과 함께 시작하는 새봄의 편지" },
  { key: "summer", label: "여름", lead: "바다·소나기·칠석… 시원한 안부를 전하는 여름 편지" },
  { key: "autumn", label: "가을", lead: "단풍·한가위·독서의 계절… 깊어 가는 가을 편지" },
  { key: "winter", label: "겨울", lead: "눈꽃·크리스마스·새해… 포근한 겨울 편지" },
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
