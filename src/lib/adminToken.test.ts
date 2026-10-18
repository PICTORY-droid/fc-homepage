import { describe, expect, it } from "vitest";
import { SESSION_TTL_MS, createSessionToken, passwordMatches, verifySessionToken } from "./adminToken";

const SECRET = "s".repeat(32);

describe("관리자 세션 토큰", () => {
  it("방금 만든 토큰은 유효하다", () => {
    expect(verifySessionToken(createSessionToken(SECRET, 1000), SECRET, 2000)).toBe(true);
  });
  it("만료되면 거부한다", () => {
    expect(verifySessionToken(createSessionToken(SECRET, 1000), SECRET, 1000 + SESSION_TTL_MS + 1)).toBe(false);
  });
  it("다른 비밀값으로 서명된 토큰은 거부한다", () => {
    expect(verifySessionToken(createSessionToken("x".repeat(32), 1000), SECRET, 2000)).toBe(false);
  });
  it("변조된 만료 시각은 거부한다", () => {
    const [, sig] = createSessionToken(SECRET, 1000).split(".");
    expect(verifySessionToken(`${9e15}.${sig}`, SECRET, 2000)).toBe(false);
  });
  it("비어 있거나 형식이 틀리면 거부한다", () => {
    for (const t of [undefined, "", "abc", "123.", ".abc", "a.b"]) expect(verifySessionToken(t, SECRET)).toBe(false);
  });
  it("비밀번호 비교", () => {
    expect(passwordMatches("correct-horse-1", "correct-horse-1")).toBe(true);
    expect(passwordMatches("wrong", "correct-horse-1")).toBe(false);
  });
});
