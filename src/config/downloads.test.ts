import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allPositions, formDownloadName, formFile, formLargeFile, jobGroups, variantNames, variants } from "./forms";
import { seasons, stationery, stationeryBySeason, stationeryDownloadName, stationeryFile } from "./stationery";

const pub = (p: string) => join(process.cwd(), "public", p);

describe("내려받기 파일이 모두 있다", () => {
  it("이력서·자기소개서: 포지션 20개 × 양식 5종, 각각 Word·미리보기", () => {
    expect(jobGroups).toHaveLength(10);
    expect(allPositions).toHaveLength(20);
    expect(new Set(allPositions.map((p) => p.id)).size).toBe(20);
    expect(new Set(allPositions.map((p) => p.desc)).size).toBe(20);
    let n = 0;
    for (const p of allPositions) for (const k of ["resume", "cover"] as const) for (const v of variants) for (const ext of ["docx", "jpg"] as const) { expect(existsSync(pub(formFile(p.id, k, v, ext))), `${k}-${p.id}-${v}.${ext}`).toBe(true); n++; }
    expect(n).toBe(400);
    for (const p of allPositions) for (const k of ["resume", "cover"] as const) for (const v of variants) expect(existsSync(pub(formLargeFile(p.id, k, v))), `large ${k}-${p.id}-${v}`).toBe(true);
  });
  it("양식 5종은 이름이 서로 다르고, 내려받는 파일 이름은 한글이며 겹치지 않는다", () => {
    for (const k of ["resume", "cover"] as const) expect(new Set(variantNames[k]).size).toBe(5);
    const names = allPositions.flatMap((p) => (["resume", "cover"] as const).flatMap((k) => variants.map((v) => formDownloadName(p, k, v))));
    expect(new Set(names).size).toBe(200);
    for (const nm of names) expect(nm).toMatch(/^(이력서|자기소개서)_[가-힣A-Za-z0-9·()]+_[1-5]_[가-힣A-Za-z0-9]+\.docx$/);
  });
  it("편지지: 계절별 20장, Word·PNG·미리보기", () => {
    expect(stationery).toHaveLength(80);
    for (const s of seasons) expect(stationeryBySeason(s.key)).toHaveLength(20);
    for (const s of stationery) for (const ext of ["docx", "png", "jpg"] as const) expect(existsSync(pub(stationeryFile(s.id, ext))), `${s.id}.${ext}`).toBe(true);
  });
  it("편지지 이름이 서로 겹치지 않고, 내려받는 파일 이름은 한글", () => {
    expect(new Set(stationery.map((s) => s.name)).size).toBe(80);
    expect(new Set(stationery.map((s) => s.tag)).size).toBe(80);
    expect(stationeryDownloadName(stationery[0], "docx")).toMatch(/^편지지_봄01_[가-힣]+\.docx$/);
  });
});
