import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { formFile, formTemplates } from "./forms";
import { stationery, stationeryFile } from "./stationery";

const pub = (p: string) => join(process.cwd(), "public", p);

describe("내려받기 파일이 모두 있다", () => {
  it("이력서·자기소개서: PDF, Word, 미리보기", () => {
    expect(formTemplates).toHaveLength(10);
    for (const f of formTemplates) for (const ext of ["pdf", "docx", "jpg"] as const) expect(existsSync(pub(formFile(f.id, ext))), `${f.id}.${ext}`).toBe(true);
  });
  it("편지지: PDF, Word, PNG, 미리보기", () => {
    expect(stationery).toHaveLength(10);
    for (const s of stationery) for (const ext of ["pdf", "docx", "png", "jpg"] as const) expect(existsSync(pub(stationeryFile(s.id, ext))), `${s.id}.${ext}`).toBe(true);
  });
});
