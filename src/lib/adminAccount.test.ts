import { describe, expect, it } from "vitest";
import { hashPassword, validateCredentials, verifyPassword } from "./adminAccount";

describe("관리자 계정 규칙", () => {
  it("올바른 아이디·비밀번호는 통과한다", () => {
    expect(validateCredentials("fc_owner", "correct-horse-battery")).toBeNull();
  });
  it("짧은 아이디·짧은 비밀번호·아이디가 든 비밀번호는 거부한다", () => {
    expect(validateCredentials("ab", "correct-horse-battery")).not.toBeNull();
    expect(validateCredentials("fc_owner", "short")).not.toBeNull();
    expect(validateCredentials("fc_owner", "xx-FC_OWNER-xxxx")).not.toBeNull();
    expect(validateCredentials("fc owner", "correct-horse-battery")).not.toBeNull();
  });
  it("해시는 원문이 아니고, 맞는 비밀번호만 통과한다", () => {
    const h = hashPassword("correct-horse-battery");
    expect(h).not.toContain("correct-horse-battery");
    expect(verifyPassword("correct-horse-battery", h)).toBe(true);
    expect(verifyPassword("wrong-horse-battery", h)).toBe(false);
    expect(verifyPassword("x", "broken")).toBe(false);
  });
  it("같은 비밀번호도 해시가 매번 다르다(소금)", () => {
    expect(hashPassword("correct-horse-battery")).not.toBe(hashPassword("correct-horse-battery"));
  });
});
