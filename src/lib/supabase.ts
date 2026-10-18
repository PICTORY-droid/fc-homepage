import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv } from "./env";

// 서버 전용 Supabase 클라이언트 (service role 키는 브라우저로 절대 나가지 않음)
let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const env = getServerEnv();
  if (!env.configured) return null;
  client ??= createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
