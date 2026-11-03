// 자료 관심도 요약 — 미리보기·다운로드·연령대 이벤트를 '자료 종류 › 세부 분야'별 숫자로 묶는 순수 함수입니다. (DB·화면과 분리)
import { AGE_BANDS, decodeAgeLabel, type AgeBand } from "./ageBand";
import { categorize, categoryKey } from "./contentCategory";
import type { Count, EventRow } from "./summary";

/** previews: 미리보기를 크게 연 횟수, downloads: 받은 횟수, rate: 미리보기 대비 받은 비율(%) — 미리보기가 없으면 null */
export type InterestRow = { key: string; previews: number; downloads: number; rate: number | null };
export type AgeTypeRow = { type: string; total: number; bands: Record<AgeBand, number> };
export type Interest = {
  types: InterestRow[];
  subs: InterestRow[];
  ages: Count[];
  agesAnswered: number;
  ageByType: AgeTypeRow[];
};

const emptyBands = (): Record<AgeBand, number> => Object.fromEntries(AGE_BANDS.map((b) => [b, 0])) as Record<AgeBand, number>;

const toRows = (m: Map<string, { previews: number; downloads: number }>, n: number): InterestRow[] =>
  [...m.entries()]
    .map(([key, v]) => ({ key, ...v, rate: v.previews ? Math.round((v.downloads / v.previews) * 100) : null }))
    .sort((a, b) => b.downloads - a.downloads || b.previews - a.previews || a.key.localeCompare(b.key))
    .slice(0, n);

export function summarizeInterest(rows: readonly EventRow[]): Interest {
  const types = new Map<string, { previews: number; downloads: number }>();
  const subs = new Map<string, { previews: number; downloads: number }>();
  const ages = emptyBands();
  const ageByType = new Map<string, AgeTypeRow>();
  let agesAnswered = 0;

  const add = (m: typeof types, key: string, field: "previews" | "downloads") => {
    const r = m.get(key) ?? { previews: 0, downloads: 0 };
    r[field]++;
    m.set(key, r);
  };

  for (const e of rows) {
    if (e.name === "preview" || e.name === "download") {
      const c = categorize(e.path, e.label);
      if (!c) continue;
      const field = e.name === "preview" ? "previews" : "downloads";
      add(types, c.type, field);
      add(subs, categoryKey(c), field);
    } else if (e.name === "age_band") {
      const a = decodeAgeLabel(e.label);
      if (!a) continue;
      agesAnswered++;
      ages[a.band]++;
      const type = categorize(e.path, a.download)?.type ?? "기타";
      const r = ageByType.get(type) ?? { type, total: 0, bands: emptyBands() };
      r.total++;
      r.bands[a.band]++;
      ageByType.set(type, r);
    }
  }

  return {
    types: toRows(types, 20),
    subs: toRows(subs, 15),
    ages: AGE_BANDS.map((b) => ({ key: b, count: ages[b] })),
    agesAnswered,
    ageByType: [...ageByType.values()].sort((a, b) => b.total - a.total || a.type.localeCompare(b.type)),
  };
}
