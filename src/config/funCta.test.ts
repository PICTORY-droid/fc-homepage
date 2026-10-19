import { describe, expect, it } from "vitest";
import { categories } from "./categories";
import { funCtas } from "./funCta";
import { packGroups } from "./pack";

describe("자료 페이지 상담 안내", () => {
  it("모든 키가 실제 묶음/항목이고, 상담 분야가 올바르다", () => {
    const keys = new Set(packGroups.flatMap((g) => g.items.map((i) => `${g.slug}/${i.key}`)));
    const topics = new Set<string>([...categories.map((c) => c.slug), "other"]);
    for (const [k, c] of Object.entries(funCtas)) { expect(keys.has(k), k).toBe(true); expect(topics.has(c.topic), k).toBe(true); }
  });
});
