import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// 관리자 아이디·비밀번호 규칙과 비밀번호 해시(scrypt + 임의 소금). 비밀번호 원문은 어디에도 저장하지 않습니다.
// 순수 함수라 테스트하기 쉽습니다. DB 접근은 services/adminAccount.ts 에서 합니다.
export const USERNAME_RE = /^[A-Za-z0-9_.-]{4,30}$/;
export const MIN_PASSWORD = 12;

export function validateCredentials(username: string, password: string): string | null {
  if (!USERNAME_RE.test(username)) return "아이디는 영문·숫자·_ . - 로 4~30자여야 합니다.";
  if (password.length < MIN_PASSWORD || password.length > 100) return `비밀번호는 ${MIN_PASSWORD}자 이상 100자 이하여야 합니다.`;
  if (password.toLowerCase().includes(username.toLowerCase())) return "비밀번호에 아이디를 넣지 마세요.";
  return null;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [kind, saltB64, hashB64] = stored.split("$");
  if (kind !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64url");
  const actual = scryptSync(password, Buffer.from(saltB64, "base64url"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
