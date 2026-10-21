import "server-only";
import { cookies } from "next/headers";
import { getAdminEnv } from "@/lib/env";
import { ADMIN_COOKIE, SESSION_TTL_MS, createSessionToken, passwordMatches, verifySessionToken } from "@/lib/adminToken";

// 관리자 로그인 세션 — 인증은 항상 서버에서 확인합니다. (쿠키: httpOnly, 운영에서는 secure, sameSite=strict)
export const isAdminConfigured = () => getAdminEnv() !== null;

export async function isAdminLoggedIn(): Promise<boolean> {
  const env = getAdminEnv();
  if (!env) return false;
  return verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value, env.secret);
}

/** 등록 인증 코드(ADMIN_PASSWORD)가 맞는지 */
export function isSetupCodeValid(code: string): boolean {
  const env = getAdminEnv();
  return Boolean(env && code && passwordMatches(code.slice(0, 200), env.password));
}

/** 아이디·비밀번호 확인이 끝난 뒤 로그인 세션을 시작합니다. 설정이 없으면 false */
export async function startAdminSession(): Promise<boolean> {
  const env = getAdminEnv();
  if (!env) return false;
  (await cookies()).set(ADMIN_COOKIE, createSessionToken(env.secret), {
    httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: SESSION_TTL_MS / 1000,
  });
  return true;
}

export async function endAdminSession(): Promise<void> {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
}
