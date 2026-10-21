import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";
import { summarize, type EventRow, type Summary } from "@/features/analytics/summary";

// 관리자용 이용 통계 조회 — DB 접근은 이 파일에서만 합니다. (집계는 features/analytics/summary.ts)
const PAGE = 1000;
const MAX_ROWS = 30_000; // 폭주 방지: 기간 안에 이보다 많으면 최근 것부터 이만큼만 집계

export type StatsResult = { summary?: Summary; truncated?: boolean; error?: "no-storage" | "no-table" | "failed" };

export async function loadStats(days: number): Promise<StatsResult> {
  const db = getSupabaseAdmin();
  if (!db) return { error: "no-storage" };
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const rows: EventRow[] = [];
  for (let from = 0; from < MAX_ROWS; from += PAGE) {
    const { data, error } = await db.from("site_events")
      .select("name,path,label,source,medium,campaign,ref_host,created_at")
      .gte("created_at", since).order("created_at", { ascending: false }).range(from, from + PAGE - 1);
    if (error) return { error: error.code === "42P01" || /does not exist|schema cache/i.test(error.message) ? "no-table" : "failed" };
    rows.push(...(data as EventRow[]));
    if (!data || data.length < PAGE) return { summary: summarize(rows, days) };
  }
  return { summary: summarize(rows, days), truncated: true };
}
