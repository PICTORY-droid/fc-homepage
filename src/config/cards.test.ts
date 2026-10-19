import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cardCategories, cardDownloadName, cardPptx, cardSvg, cardThumb } from "./cards";

const pub = (p: string) => join(process.cwd(), "public", p);

describe("명함 템플릿: 10분류 × 50장", () => {
  it("분류 10개, 분류마다 50장", () => {
    expect(cardCategories).toHaveLength(10);
    for (const c of cardCategories) expect(c.items, c.key).toHaveLength(50);
  });
  it("문구·이름·색 조합이 전체 500장에서 겹치지 않는다", () => {
    const all = cardCategories.flatMap((c) => c.items);
    expect(all).toHaveLength(500);
    expect(new Set(all.map((e) => e.tag)).size).toBe(500);
    expect(new Set(all.map((e) => e.name)).size).toBe(500);
  });
  it("파일(PPT·SVG·미리보기)이 모두 있다", () => {
    for (const c of cardCategories) {
      for (const e of c.items) {
        for (const f of [cardPptx(c.key, e), cardSvg(c.key, e), cardThumb(c.key, e.no)]) expect(existsSync(pub(f)), f).toBe(true);
      }
    }
  });
  it("500장의 앞뒤 디자인(SVG)이 서로 하나도 같지 않다", () => {
    const seen = new Set<string>();
    for (const c of cardCategories) for (const e of c.items) {
      const k = readFileSync(pub(cardSvg(c.key, e)), "utf8");
      expect(seen.has(k), `${c.key}-${e.no}`).toBe(false);
      seen.add(k);
    }
    expect(seen.size).toBe(500);
  });
  it("내려받는 파일 이름은 한글이고 500개가 모두 다르다", () => {
    const names = cardCategories.flatMap((c) => c.items.flatMap((e) => (["pptx", "svg"] as const).map((x) => cardDownloadName(e, x))));
    for (const n of names) expect(n).toMatch(/^[가-힣A-Za-z0-9_]+\.(pptx|svg)$/);
    expect(new Set(names).size).toBe(1000);
  });
  it("색상 값이 올바르다", () => {
    for (const c of cardCategories) for (const e of c.items) for (const col of [e.main, e.soft]) expect(col).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});
