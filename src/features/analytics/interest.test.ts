import { describe, expect, it } from "vitest";
import { AGE_BANDS, decodeAgeLabel, encodeAgeLabel } from "./ageBand";
import { categorize, categoryKey } from "./contentCategory";
import { summarizeInterest } from "./interest";
import { eventSchema } from "./events";
import type { EventRow } from "./summary";

const row = (o: Partial<EventRow>): EventRow => ({ name: "download", path: "/", label: null, source: null, medium: null, campaign: null, ref_host: null, created_at: "2026-11-04T03:00:00Z", ...o });

describe("연령대 label", () => {
  it("목록에 있는 연령대만 만들고, 읽을 때도 형식을 확인한다", () => {
    expect(encodeAgeLabel("30대", "엑셀서식_퇴직금 계산표.xlsx")).toBe("30대/엑셀서식_퇴직금 계산표.xlsx");
    expect(encodeAgeLabel("35살", "x.xlsx")).toBeUndefined();
    expect(encodeAgeLabel("60대 이상", "a/b.xlsx")).toBe("60대 이상/ab.xlsx");
    expect(decodeAgeLabel("20대/견적서.xlsx")).toEqual({ band: "20대", download: "견적서.xlsx" });
    expect(decodeAgeLabel("20대")).toEqual({ band: "20대", download: "" });
    expect(decodeAgeLabel("<script>/x")).toBeUndefined();
    expect(decodeAgeLabel(null)).toBeUndefined();
  });
  it("만든 label 은 서버 이벤트 검증을 통과한다", () => {
    for (const b of AGE_BANDS) {
      expect(eventSchema.safeParse({ name: "age_band", path: "/fun/sheets", label: encodeAgeLabel(b, "엑셀서식_월간 가계부.xlsx") }).success, b).toBe(true);
    }
    expect(eventSchema.safeParse({ name: "preview", path: "/fun/cards/office", label: "01. 매화 피는 아침" }).success).toBe(true);
  });
});

describe("자료 분류", () => {
  it("주소로 자료 종류와 세부 분야를 정한다", () => {
    expect(categorize("/fun/sheets/biz", "견적서")).toEqual({ type: "엑셀 서식", sub: "소상공인·프리랜서" });
    expect(categorize("/fun/cards/office")).toEqual({ type: "명함 템플릿", sub: "직장인·포지션별" });
    expect(categorize("/fun/stationery/spring")?.type).toBe("감성 편지지");
    expect(categorize("/fun/excel/ledger/spring")).toEqual({ type: "엑셀 양식", sub: "가계부" });
    expect(categorize("/fun/forms")).toEqual({ type: "이력서·자기소개서", sub: "전체" });
  });
  it("엑셀 서식 허브에서는 제목이나 파일 이름으로 분야를 찾는다", () => {
    expect(categorize("/fun/sheets", "퇴직금 계산표")?.sub).toBe("취업·직장");
    expect(categorize("/fun/sheets", "엑셀서식_퇴직금 계산표.xlsx")?.sub).toBe("취업·직장");
    expect(categorize("/fun/sheets", "모르는 자료")?.sub).toBe("추천");
  });
  it("즐길거리 밖의 주소는 분류하지 않는다", () => {
    expect(categorize("/products/P001")).toBeUndefined();
    expect(categorize("/fun")).toBeUndefined();
    expect(categorize("/fun/nothing/here")).toBeUndefined();
    expect(categoryKey({ type: "엑셀 서식", sub: "학습·교육" })).toBe("엑셀 서식 › 학습·교육");
  });
});

describe("자료 관심도 요약", () => {
  const rows = [
    row({ name: "preview", path: "/fun/sheets/biz", label: "견적서" }),
    row({ name: "preview", path: "/fun/sheets/biz", label: "견적서" }),
    row({ name: "download", path: "/fun/sheets/biz", label: "엑셀서식_견적서.xlsx" }),
    row({ name: "download", path: "/fun/cards/office", label: "명함_직장인_01.pptx" }),
    row({ name: "age_band", path: "/fun/sheets/biz", label: "30대/엑셀서식_견적서.xlsx" }),
    row({ name: "age_band", path: "/fun/sheets", label: "30대/엑셀서식_퇴직금 계산표.xlsx" }),
    row({ name: "age_band", path: "/fun/cards/office", label: "50대/명함_직장인_01.pptx" }),
    row({ name: "age_band", path: "/fun/sheets", label: "잘못된값" }),
    row({ name: "page_view", path: "/fun/sheets/biz" }),
  ];
  const s = summarizeInterest(rows);
  it("자료 종류별 미리보기·다운로드·받은 비율을 센다", () => {
    expect(s.types[0]).toEqual({ key: "엑셀 서식", previews: 2, downloads: 1, rate: 50 });
    expect(s.types.find((r) => r.key === "명함 템플릿")).toEqual({ key: "명함 템플릿", previews: 0, downloads: 1, rate: null });
    expect(s.subs[0].key).toBe("엑셀 서식 › 소상공인·프리랜서");
  });
  it("연령대는 모든 칸을 순서대로 보여 주고, 잘못된 응답은 빼고, 자료 종류별로 나눈다", () => {
    expect(s.ages.map((a) => a.key)).toEqual([...AGE_BANDS]);
    expect(s.ages.find((a) => a.key === "30대")?.count).toBe(2);
    expect(s.agesAnswered).toBe(3);
    expect(s.ageByType[0]).toMatchObject({ type: "엑셀 서식", total: 2 });
    expect(s.ageByType[0].bands["30대"]).toBe(2);
    expect(s.ageByType.find((r) => r.type === "명함 템플릿")?.bands["50대"]).toBe(1);
  });
});
