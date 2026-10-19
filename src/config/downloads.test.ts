import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { formFile, formTemplates } from "./forms";
import { seasons, stationery, stationeryBySeason, stationeryDownloadName, stationeryFile } from "./stationery";

const pub = (p: string) => join(process.cwd(), "public", p);

describe("내려받기 파일이 모두 있다", () => {
  it("이력서·자기소개서: Word, 미리보기", () => {
    for (const f of formTemplates) for (const ext of ["docx", "jpg"] as const) expect(existsSync(pub(formFile(f.id, ext))), `${f.id}.${ext}`).toBe(true);
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
