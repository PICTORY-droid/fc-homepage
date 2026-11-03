// 연령대(선택 응답) — 자료를 받은 뒤 한 번만 묻는 익명 질문입니다. 이름·생년월일은 받지 않고 '대' 단위만 기록합니다.
// 이벤트 label 은 "연령대/받은 파일 이름" 형식 — 어떤 연령대가 어떤 자료를 받았는지 함께 집계하기 위해서입니다. (파일 이름에는 / 가 없음)
export const AGE_BANDS = ["10대", "20대", "30대", "40대", "50대", "60대 이상"] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

const SEP = "/";
const MAX = 100;

export const isAgeBand = (v: string): v is AgeBand => (AGE_BANDS as readonly string[]).includes(v);

/** 이벤트 label 만들기 — 연령대가 목록에 없으면 undefined(기록하지 않음) */
export function encodeAgeLabel(band: string, download?: string): string | undefined {
  if (!isAgeBand(band)) return undefined;
  const file = (download ?? "").split(SEP).join("").trim();
  return `${band}${SEP}${file}`.slice(0, MAX);
}

/** 이벤트 label 읽기 — 형식이 맞지 않으면 undefined */
export function decodeAgeLabel(label: string | null | undefined): { band: AgeBand; download: string } | undefined {
  if (!label) return undefined;
  const i = label.indexOf(SEP);
  const band = i < 0 ? label : label.slice(0, i);
  if (!isAgeBand(band)) return undefined;
  return { band, download: i < 0 ? "" : label.slice(i + 1) };
}
