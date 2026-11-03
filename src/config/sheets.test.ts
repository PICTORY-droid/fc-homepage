import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { featuredSheets, getSheetGroup, sheetDownloadName, sheetFile, sheetGroups, sheetLarge, sheetTemplates, sheetThumb } from "./sheets";

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
