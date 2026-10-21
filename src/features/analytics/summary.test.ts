import { describe, expect, it } from "vitest";
import { sourceOf, summarize, type EventRow } from "./summary";

const row = (o: Partial<EventRow>): EventRow => ({ name: "visit", path: "/", label: null, source: null, medium: null, campaign: null, ref_host: null, created_at: "2026-10-22T03:00:00Z", ...o });

describe("이용 통계 요약", () => {
  const now = new Date("2026-10-22T06:00:00Z");
  const rows = [
    row({ source: "kakao", campaign: "10월안내" }), row({ ref_host: "m.search.naver.com" }), row({}),
    row({ name: "page_view", path: "/guide" }), row({ name: "page_view", path: "/guide" }), row({ name: "page_view", path: "/" }),
    row({ name: "consult_done", source: "kakao", campaign: "10월안내" }), row({ name: "download", label: "가계부_01.xlsx" }),
    row({ name: "visit", created_at: "2026-10-20T03:00:00Z" }),
  ];
  const s = summarize(rows, 3, now);
  it("합계와 일별 방문을 센다", () => {
    expect(s.totals.visit).toBe(4);
    expect(s.totals.page_view).toBe(3);
    expect(s.daily.map((d) => d.date)).toEqual(["2026-10-20", "2026-10-21", "2026-10-22"]);
    expect(s.daily.map((d) => d.visits)).toEqual([1, 0, 3]);
  });
  it("유입처는 꼬리표 → 이전 사이트 → 직접 순서로 묶는다", () => {
    expect(sourceOf({ source: "kakao", ref_host: "x.com" })).toBe("kakao");
    expect(sourceOf({ source: null, ref_host: "x.com" })).toBe("x.com");
    expect(sourceOf({ source: null, ref_host: null })).toBe("직접");
    expect(s.sources[0]).toMatchObject({ key: "직접", visits: 2 });
    expect(s.sources.find((r) => r.key === "kakao")).toMatchObject({ visits: 1, consultDone: 1 });
    expect(s.campaigns[0].key).toBe("kakao / 10월안내");
  });
  it("인기 페이지·다운로드 순위를 만든다", () => {
    expect(s.topPages[0]).toEqual({ key: "/guide", count: 2 });
    expect(s.topDownloads[0]).toEqual({ key: "가계부_01.xlsx", count: 1 });
  });
});
