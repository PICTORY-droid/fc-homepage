import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { entriesBySeason, packDownloadName, packEntries, packFile, packGroups, packSeasons, packThumb } from "./pack";

const pub = (p: string) => join(process.cwd(), "public", p);

describe("자료 꾸러미: 항목마다 50종", () => {
  for (const g of packGroups) {
    for (const item of g.items) {
      describe(`${g.slug}/${item.key}`, () => {
        const list = packEntries(item);
        it("50종이고 이름·문구가 서로 겹치지 않는다", () => {
          expect(list).toHaveLength(50);
          expect(new Set(list.map((e) => e.no)).size).toBe(50);
          expect(new Set(list.map((e) => e.name)).size).toBe(50);
          expect(new Set(list.map((e) => e.tag)).size).toBe(50);
        });
        it("계절별 13·12·13·12종", () => {
          expect(packSeasons.map((s) => entriesBySeason(item, s).length)).toEqual([13, 12, 13, 12]);
        });
        it("파일(과 미리보기)이 모두 있다", () => {
          for (const e of list) {
            expect(existsSync(pub(packFile(item, e))), packFile(item, e)).toBe(true);
            const t = packThumb(item, e.no);
            if (t) expect(existsSync(pub(t)), t).toBe(true);
          }
        });
        it("내려받는 파일 이름은 한글이고 쓸 수 없는 글자가 없다", () => {
          for (const e of list) expect(packDownloadName(item, e)).toMatch(/^[가-힣A-Za-z0-9·()_]+\.(xlsx|pptx|docx|svg)$/);
          expect(new Set(list.map((e) => packDownloadName(item, e))).size).toBe(50);
        });
        it("색상 값이 올바르다", () => {
          for (const e of list) for (const c of [e.main, e.soft, e.dark]) expect(c).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });
      });
    }
  }
});
