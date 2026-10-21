import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";

// 관리자 계정(1개) 조회·등록 — DB 접근은 이 파일에서만 합니다. 테이블은 db/admin_setup.sql 로 만듭니다.
export type AccountState =
  | { state: "none" }
  | { state: "exists"; username: string; hash: string }
  | { state: "error"; reason: "no-storage" | "no-table" | "failed" };

export async function getAccount(): Promise<AccountState> {
  const db = getSupabaseAdmin();
  if (!db) return { state: "error", reason: "no-storage" };
  const { data, error } = await db.from("admin_account").select("username,password_hash").eq("id", 1).maybeSingle();
  if (error) return { state: "error", reason: error.code === "42P01" || /does not exist|schema cache/i.test(error.message) ? "no-table" : "failed" };
  return data ? { state: "exists", username: data.username as string, hash: data.password_hash as string } : { state: "none" };
}

/** 계정은 한 번만 만들 수 있습니다(id=1 고정). 이미 있으면 "exists" */
export async function createAccount(username: string, hash: string): Promise<"ok" | "exists" | "failed"> {
  const db = getSupabaseAdmin();
  if (!db) return "failed";
  const { error } = await db.from("admin_account").insert({ id: 1, username, password_hash: hash });
  if (!error) return "ok";
  return error.code === "23505" ? "exists" : "failed";
}
