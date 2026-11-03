import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { EXCEL_PACK, getGroup as getPackGroup, packEntries, packSeasons } from "./pack";
import {
  COLLECTION_GROUP, collectionByItem, collectionCardThumb, collectionPath, collectionSeasons, featuredSheets, getSheetCollection, getSheetGroup,
  sheetCollections, sheetDownloadName, sheetFile, sheetFileCount, sheetGroups, sheetLarge, sheetTemplates, sheetThumb,
} from "./sheets";

const pub = (p: string) => join(process.cwd(), "public", p);

describe("생활·업무 엑셀 서식(템블리 100종)", () => {
  it("100종이고 id·제목이 겹치지 않으며, 모든 서식이 6개 분야 중 하나에 들어 있다", () => {
    expect(sheetTemplates).toHaveLength(100);
    expect(new Set(sheetTemplates.map((t) => t.id)).size).toBe(100);
    expect(new Set(sheetTemplates.map((t) => t.title)).size).toBe(100);
    expect(sheetGroups).toHaveLength(6);
    expect(sheetGroups.reduce((n, g) => n + g.items.length, 0)).toBe(100);
    for (const g of sheetGroups) expect(g.items.length, g.key).toBeGreaterThan(0);
  });
  it("엑셀 파일·카드 미리보기·큰 미리보기가 모두 있다", () => {
    for (const t of sheetTemplates) {
      for (const p of [sheetFile(t), sheetThumb(t), sheetLarge(t)]) expect(existsSync(pub(p)), p).toBe(true);
    }
  });
  it("내려받는 파일 이름은 한글이고 겹치지 않으며, 파일 이름에 쓸 수 없는 글자를 뺀다", () => {
    const names = sheetTemplates.map(sheetDownloadName);
    expect(new Set(names).size).toBe(100);
    for (const n of names) expect(n).toMatch(/^엑셀서식_[^\\/:*?"<>|]+\.xlsx$/);
    expect(sheetDownloadName({ title: 'a/b:c*"d' })).toBe("엑셀서식_abcd.xlsx");
  });
  it("추천 서식이 있고, 없는 분야 주소는 찾지 않는다", () => {
    expect(featuredSheets.length).toBeGreaterThan(0);
    expect(featuredSheets.every((t) => t.featured)).toBe(true);
    expect(getSheetGroup("work")?.label).toBe("취업·직장");
    expect(getSheetGroup("../etc")).toBeUndefined();
  });
});

describe("테마 모음(예전 엑셀 양식)", () => {
  const excel = getPackGroup(EXCEL_PACK);
  it("엑셀 양식 항목이 빠짐없이 테마 모음이 되고, 각각 정해진 분야에 들어 있다", () => {
    expect(excel?.items.length).toBe(6);
    for (const it of excel?.items ?? []) expect(COLLECTION_GROUP[it.key], `${it.key} 의 분야`).toBeTruthy();
    expect(sheetCollections).toHaveLength(6);
    for (const c of sheetCollections) {
      expect(getSheetGroup(c.group)?.collections, c.item.key).toContain(c);
      expect(c.count, c.item.key).toBe(50);
      expect(collectionSeasons(c).reduce((n, s) => n + s.count, 0)).toBe(50);
    }
    expect(sheetFileCount).toBe(400);
  });
  it("카드 미리보기가 모두 있다", () => {
    for (const c of sheetCollections) for (const e of packEntries(c.item)) expect(existsSync(pub(collectionCardThumb(c, e.no))), `${c.item.key}-${e.no}`).toBe(true);
  });
  it("주소가 분야·항목·계절로 이어지고, 맞지 않는 분야·항목 조합은 찾지 않는다", () => {
    const ledger = collectionByItem("ledger")!;
    expect(collectionPath(ledger)).toBe("/fun/sheets/life/ledger");
    expect(collectionPath(ledger, packSeasons[3])).toBe("/fun/sheets/life/ledger/winter");
    expect(collectionPath(collectionByItem("quote")!)).toBe("/fun/sheets/biz/quote");
    expect(getSheetCollection("life", "ledger")).toBe(ledger);
    expect(getSheetCollection("biz", "ledger")).toBeUndefined();
    expect(getSheetCollection("life", "talk")).toBeUndefined();
  });
});
