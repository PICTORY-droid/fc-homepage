// 편지지 480장(계절 80 + 주제 400) — 파일은 public/fun/stationery/ 에 있고 scripts/fun/memory/build.mjs + scripts/fun/docx/make_stationery_docx.py 로 만듭니다.
// 목록(stationery.data.json)은 build.mjs 가 만든 meta.json 에서 뽑은 것입니다.
import data from "./stationery.data.json";

export type SeasonKey = "spring" | "summer" | "autumn" | "winter" | "animal" | "place" | "weather" | "coffee" | "window" | "garden";
export interface Stationery { id: string; season: SeasonKey; no: number; name: string; tag: string }
export interface Season { key: SeasonKey; label: string; lead: string; group: "season" | "theme" }

export const seasons: Season[] = [
  { key: "spring", label: "봄", lead: "새 학기 첫날, 교문 앞 병아리, 어버이날 편지… 그 봄의 기억", group: "season" },
  { key: "summer", label: "여름", lead: "방학식, 소나기, 평상 위 수박… 그 여름의 기억", group: "season" },
  { key: "autumn", label: "가을", lead: "운동회, 은행잎 책갈피, 귀성 열차… 그 가을의 기억", group: "season" },
  { key: "winter", label: "겨울", lead: "첫눈, 군고구마, 연하장… 그 겨울의 기억", group: "season" },
  { key: "animal", label: "동물", lead: "알파카, 고양이, 펭귄, 고래… 귀엽고 포근한 동물 친구들", group: "theme" },
  { key: "place", label: "장소", lead: "한국의 명소부터 세계의 풍경까지, 아름답고 마음이 움직이는 곳", group: "theme" },
  { key: "weather", label: "날씨", lead: "첫눈, 무지개, 은하수, 노을… 하늘이 그린 화려한 날씨", group: "theme" },
  { key: "coffee", label: "커피", lead: "라떼아트, 핸드드립, 케이크… 향긋한 카페의 한 잔", group: "theme" },
  { key: "window", label: "창가", lead: "비 오는 창, 노을 진 창, 별 보이는 창… 창가에서 쓰는 편지", group: "theme" },
  { key: "garden", label: "정원", lead: "장미, 벚꽃, 수국, 온실, 텃밭… 꽃과 정원이 있는 편지지", group: "theme" },
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
