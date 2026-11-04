import { describe, expect, it } from "vitest";
import { filterSections, matchEntry, normalize, withMode, type HubEntry } from "./hubDirectory";

const entry: HubEntry = { key: "it", title: "IT·개발", lead: "개발자 직무", links: [{ label: "백엔드 개발자", href: "/a" }, { label: "UI·UX 디자이너", href: "/b" }] };

describe("즐길거리 토글 목록 검색", () => {
  it("띄어쓰기·가운뎃점을 무시한다", () => expect(normalize("UI · UX 디자이너")).toBe("uiux디자이너"));
  it("빈 검색어는 그대로 둔다", () => expect(matchEntry(entry, "  ")).toBe(entry));
  it("제목이 맞으면 링크를 모두 보여 준다", () => expect(matchEntry(entry, "개발")?.links).toHaveLength(2));
  it("링크 이름만 맞으면 그 링크만 남긴다", () => expect(matchEntry(entry, "uiux")?.links?.map((l) => l.href)).toEqual(["/b"]));
  it("하나도 안 맞으면 묶음째 빠진다", () => {
    expect(matchEntry(entry, "간호")).toBeNull();
    expect(filterSections([{ key: "s", entries: [entry] }], "간호")).toEqual([]);
  });
  it("고른 종류를 주소 끝에 붙인다", () => {
    expect(withMode("/fun/forms/x", "resume")).toBe("/fun/forms/x#resume");
    expect(withMode("/fun/forms/x#cover", "resume")).toBe("/fun/forms/x#resume");
    expect(withMode("/fun/forms/x")).toBe("/fun/forms/x");
  });
});
