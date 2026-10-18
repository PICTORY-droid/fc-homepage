import "server-only";
import { getServerEnv } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";

// 관리자용 상담 접수 조회·상태 변경 — DB 접근은 이 파일에서만 합니다.
export const LEAD_STATUSES = ["new", "contacted", "done"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export const STATUS_LABEL: Record<LeadStatus, string> = { new: "대기", contacted: "연락함", done: "완료" };

export type LeadRow = {
  id: string; name: string | null; phone: string | null; interest: string | null; insured_age: number | null;
  status: string; created_at: string; memo: string | null;
};

const BASE_COLUMNS = "id,name,phone,interest,insured_age,status,created_at";
const LIST_LIMIT = 200;

export async function listLeads(): Promise<{ rows: LeadRow[]; memoEnabled: boolean; error?: string }> {
  const db = getSupabaseAdmin();
  const owner = getServerEnv().FC_OWNER_ID;
  if (!db || !owner) return { rows: [], memoEnabled: false, error: "저장소가 설정되지 않았습니다." };

  const query = (cols: string) =>
    db.from("leads").select(cols).eq("owner_id", owner).is("deleted_at", null).order("created_at", { ascending: false }).limit(LIST_LIMIT);

  let memoEnabled = true;
  let res = await query(`${BASE_COLUMNS},memo`);
  if (res.error) { // memo 컬럼이 아직 없으면(db/leads_admin.sql 미실행) 메모 없이 조회
    memoEnabled = false;
    res = await query(BASE_COLUMNS);
  }
  if (res.error) return { rows: [], memoEnabled, error: "접수 목록을 불러오지 못했습니다." };
  const rows = (res.data as unknown as Omit<LeadRow, "memo">[]).map((r) => ({ memo: null, ...r })) as LeadRow[];
  return { rows, memoEnabled };
}

export async function updateLead(id: string, patch: { status: LeadStatus; memo?: string | null }): Promise<boolean> {
  const db = getSupabaseAdmin();
  const owner = getServerEnv().FC_OWNER_ID;
  if (!db || !owner) return false;
  const values: Record<string, unknown> = { status: patch.status };
  if (patch.memo !== undefined) values.memo = patch.memo;
  let { error } = await db.from("leads").update(values).eq("id", id).eq("owner_id", owner);
  if (error && "memo" in values) { // memo 컬럼이 없으면 상태만 저장
    delete values.memo;
    ({ error } = await db.from("leads").update(values).eq("id", id).eq("owner_id", owner));
  }
  return !error;
}
