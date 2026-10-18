import { createHmac, createHash, timingSafeEqual } from "node:crypto";

// 관리자 세션 토큰 — 서명(HMAC-SHA256)된 만료 시각만 담습니다. 개인정보는 담지 않습니다.
// 순수 함수(환경변수 직접 접근 없음)라서 테스트하기 쉽습니다. 환경변수 읽기는 services/adminSession.ts 에서 합니다.
export const ADMIN_COOKIE = "admin_session";
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function createSessionToken(secret: string, now = Date.now()): string {
  const payload = String(now + SESSION_TTL_MS);
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string | undefined, secret: string, now = Date.now()): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !/^\d+$/.test(payload)) return false;
  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  return Number(payload) > now;
}

/** 비밀번호 비교 — 길이가 달라도 같은 시간이 걸리도록 해시 후 비교 */
export function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
