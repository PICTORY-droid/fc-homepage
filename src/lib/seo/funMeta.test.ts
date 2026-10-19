import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { packGroups } from "@/config/pack";
import { searchTitles, funMetadata } from "./funMeta";

describe("즐길거리 메타데이터", () => {
  it("모든 자료 항목에 검색용 제목이 있다", () => {
    for (const g of packGroups) for (const i of g.items) expect(searchTitles[`${g.slug}/${i.key}`], `${g.slug}/${i.key}`).toBeTruthy();
  });
  it("공유 미리보기 이미지가 실제로 있다 (항목·계절별)", () => {
    for (const g of packGroups) for (const i of g.items) for (const k of [`${g.slug}-${i.key}`, `${g.slug}-${i.key}-spring`]) {
      expect(fs.existsSync(path.join(process.cwd(), "public/og/fun", `${k}.jpg`)), k).toBe(true);
    }
  });
  it("정규 주소와 OG 이미지를 채운다", () => {
    const m = funMetadata({ title: "돌잔치 PPT 무료", description: "설명", path: "/fun/ppt/birthday", ogKey: "ppt-birthday" });
    expect(m.alternates?.canonical).toBe("/fun/ppt/birthday");
    expect(JSON.stringify(m.openGraph)).toContain("/og/fun/ppt-birthday.jpg");
  });
});
