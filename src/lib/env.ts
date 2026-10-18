import "server-only";
import { z } from "zod";

// 서버 환경변수 검증 — 값이 없으면 상담 저장은 비활성(개발 모드에서는 로그만 남김)
const schema = z.object({
  SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  FC_OWNER_ID: z.string().uuid().optional().or(z.literal("")),
});

export function getServerEnv() {
  const parsed = schema.safeParse(process.env);
  const env = parsed.success ? parsed.data : {};
  const configured = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && env.FC_OWNER_ID);
  return { ...env, configured } as {
    SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string; FC_OWNER_ID?: string; configured: boolean;
  };
}
