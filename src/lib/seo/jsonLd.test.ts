import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, serializeJsonLd } from "./jsonLd";

describe("breadcrumbJsonLd", () => {
  it("순서와 위치 번호를 붙인다", () => {
    const d = breadcrumbJsonLd([["홈", "/"], ["즐길거리", "/fun"], ["이력서", "/fun/forms"]]);
    expect(d.itemListElement.map((x) => x.position)).toEqual([1, 2, 3]);
    expect(d.itemListElement[2].item.endsWith("/fun/forms")).toBe(true);
  });
  it("script 를 닫는 문자를 이스케이프한다", () => {
    expect(serializeJsonLd({ a: "</script>" })).not.toContain("</script>");
  });
});
