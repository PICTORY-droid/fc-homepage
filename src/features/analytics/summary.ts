// 이용 통계 요약 — 저장된 이벤트 목록을 관리자 화면용 숫자로 묶는 순수 함수입니다. (DB·화면과 분리)
export type EventRow = {
  name: string; path: string; label: string | null; source: string | null; medium: string | null;
  campaign: string | null; ref_host: string | null; created_at: string;
};

export type Count = { key: string; count: number };
export type SourceRow = { key: string; visits: number; consultDone: number; downloads: number };
export type DayRow = { date: string; visits: number; pageViews: number };
export type Summary = {
  totals: Record<"visit" | "page_view" | "download" | "phone_click" | "kakao_click" | "consult_start" | "consult_done" | "newsletter_optin", number>;
  daily: DayRow[];
  sources: SourceRow[];
  campaigns: SourceRow[];
  topPages: Count[];
  topDownloads: Count[];
};

const kstDate = (d: Date) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(d);

/** 유입처 이름: 링크 꼬리표(utm_source) → 이전 사이트 주소 → 직접 접속 순서 */
export const sourceOf = (e: Pick<EventRow, "source" | "ref_host">) => e.source || e.ref_host || "직접";

const top = (m: Map<string, number>, n: number): Count[] =>
  [...m.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count || a.key.localeCompare(b.key)).slice(0, n);

export function summarize(rows: EventRow[], days: number, now: Date = new Date()): Summary {
  const totals = { visit: 0, page_view: 0, download: 0, phone_click: 0, kakao_click: 0, consult_start: 0, consult_done: 0, newsletter_optin: 0 };
  const daily = new Map<string, DayRow>();
  for (let k = days - 1; k >= 0; k--) {
    const date = kstDate(new Date(now.getTime() - k * 86_400_000));
    daily.set(date, { date, visits: 0, pageViews: 0 });
  }
  const sources = new Map<string, SourceRow>();
  const campaigns = new Map<string, SourceRow>();
  const pages = new Map<string, number>();
  const downloads = new Map<string, number>();
  const bump = (m: Map<string, SourceRow>, key: string, name: string) => {
    const r = m.get(key) ?? { key, visits: 0, consultDone: 0, downloads: 0 };
    if (name === "visit") r.visits++;
    else if (name === "consult_done") r.consultDone++;
    else if (name === "download") r.downloads++;
    m.set(key, r);
  };
  for (const e of rows) {
    if (e.name in totals) totals[e.name as keyof typeof totals]++;
    const day = daily.get(kstDate(new Date(e.created_at)));
    if (day) {
      if (e.name === "visit") day.visits++;
      if (e.name === "page_view") day.pageViews++;
    }
    if (e.name === "page_view") pages.set(e.path, (pages.get(e.path) ?? 0) + 1);
    if (e.name === "download" && e.label) downloads.set(e.label, (downloads.get(e.label) ?? 0) + 1);
    if (e.name === "visit" || e.name === "consult_done" || e.name === "download") {
      bump(sources, sourceOf(e), e.name);
      if (e.campaign) bump(campaigns, `${e.source || e.ref_host || "직접"} / ${e.campaign}`, e.name);
    }
  }
  const byVisits = (a: SourceRow, b: SourceRow) => b.visits - a.visits || b.consultDone - a.consultDone || a.key.localeCompare(b.key);
  return {
    totals, daily: [...daily.values()], sources: [...sources.values()].sort(byVisits).slice(0, 15),
    campaigns: [...campaigns.values()].sort(byVisits).slice(0, 15), topPages: top(pages, 15), topDownloads: top(downloads, 15),
  };
}
