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

/** 로그인 화면을 열 수 있는 비밀 꼬리표(?k=)가 맞는지 — 틀리면 /admin 은 '없는 페이지'처럼 보입니다. */
export function isEntryKeyValid(key: string | undefined): boolean {
  const env = getAdminEnv();
  return Boolean(env && key && passwordMatches(key.slice(0, 200), env.entryKey));
}

/** 비밀번호가 맞으면 세션을 시작하고 true */
export async function startAdminSession(password: string): Promise<boolean> {
  const env = getAdminEnv();
  if (!env || !passwordMatches(password, env.password)) return false;
  (await cookies()).set(ADMIN_COOKIE, createSessionToken(env.secret), {
    httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: SESSION_TTL_MS / 1000,
  });
  return true;
}

export async function endAdminSession(): Promise<void> {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
}
