// 편지지 980장(계절 80 + 주제 900) — 파일은 public/fun/stationery/ 에 있고 scripts/fun/memory/build.mjs + scripts/fun/docx/make_stationery_docx.py 로 만듭니다.
// 목록(stationery.data.json)은 build.mjs 가 만든 meta.json 에서 뽑은 것입니다.
import data from "./stationery.data.json";

export type SeasonKey = "spring" | "summer" | "autumn" | "winter" | "animal" | "place" | "weather" | "coffee" | "window" | "garden" | "culture";
export interface Stationery { id: string; season: SeasonKey; no: number; name: string; tag: string; sub?: string }
export interface Season { key: SeasonKey; label: string; lead: string; group: "season" | "theme" }

export const seasons: Season[] = [
  { key: "spring", label: "꽃빛", lead: "교문 앞 병아리, 흩날리던 꽃잎, 카네이션 편지… 꽃빛으로 물든 기억", group: "season" },
  { key: "summer", label: "초록빛", lead: "평상 위 수박, 푸른 바다, 싱그러운 잎사귀… 초록빛으로 물든 기억", group: "season" },
  { key: "autumn", label: "노을빛", lead: "운동회, 은행잎 책갈피, 고향 가는 열차… 노을빛으로 물든 기억", group: "season" },
  { key: "winter", label: "포근빛", lead: "군고구마, 따뜻한 불빛, 연하장… 포근한 빛으로 물든 기억", group: "season" },
  { key: "animal", label: "동물", lead: "알파카, 고양이, 펭귄, 고래… 귀엽고 포근한 동물 친구들", group: "theme" },
  { key: "place", label: "장소", lead: "한국의 명소부터 세계의 풍경까지, 아름답고 마음이 움직이는 곳", group: "theme" },
  { key: "weather", label: "하늘", lead: "무지개, 은하수, 노을, 별빛… 하늘이 그린 화려한 풍경", group: "theme" },
  { key: "coffee", label: "커피", lead: "라떼아트, 핸드드립, 케이크… 향긋한 카페의 한 잔", group: "theme" },
  { key: "window", label: "창가", lead: "노을 진 창, 별 보이는 창, 불빛 번지는 창… 창가에서 쓰는 편지", group: "theme" },
  { key: "garden", label: "정원", lead: "장미, 벚꽃, 수국, 온실, 텃밭… 꽃과 정원이 있는 편지지", group: "theme" },
  { key: "culture", label: "전통", lead: "한복·한옥·한식·놀이·악기·절기·문양·유산까지, 한국 전통문화의 모든 것", group: "theme" },
];

/** 전통 편지지의 세부 묶음 — 상세페이지에서 눌러 골라 볼 수 있어요 */
export const cultureSubs: { key: string; label: string }[] = [
  { key: "hanbok", label: "한복·혼례" }, { key: "hanok", label: "한옥·마을" }, { key: "food", label: "음식" }, { key: "play", label: "놀이·민속" },
  { key: "music", label: "악기·공연" }, { key: "craft", label: "공예·생활" }, { key: "season", label: "절기·명절" }, { key: "symbol", label: "상징·문양" },
  { key: "heritage", label: "역사유산" }, { key: "hangul", label: "한글·서예" },
];
export const subsOf = (key: SeasonKey) => (key === "culture" ? cultureSubs : []);

export const stationery = data as Stationery[];
export const stationeryBySeason = (key: SeasonKey) => stationery.filter((s) => s.season === key);

/** 내려받을 때 보이는 한글 파일 이름 — 예) 편지지_꽃빛01_벚꽃편지.docx (실제 파일 이름도 같아요) */
export const stationeryDownloadName = (s: Stationery, ext: "png" | "docx") => {
  const label = seasons.find((x) => x.key === s.season)?.label ?? "";
  return `편지지_${label}${String(s.no).padStart(s.season === "culture" ? 3 : 2, "0")}_${s.name.replace(/\s+/g, "")}.${ext}`;
};

/** 파일 주소 — Word·PNG 는 한글 이름 그대로, 미리보기 그림만 영문 id */
export const stationeryFile = (s: Stationery, ext: "png" | "docx" | "jpg") => (ext === "jpg" ? `/fun/stationery/thumbs/${s.id}.jpg` : `/fun/stationery/${stationeryDownloadName(s, ext)}`);

/** 짝꿍 엽서(표지) 그림 — 편지지와 같은 분위기의 그림 한 장 */
export const stationeryCoverFile = (s: Stationery) => `/fun/stationery/cover/${s.id}.jpg`;
export const stationeryCoverName = (s: Stationery) => stationeryDownloadName(s, "png").replace(/\.png$/, "_엽서.jpg");
