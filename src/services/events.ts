import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { EventInput } from "@/features/analytics/events";

// 이용 통계 저장 — DB 접근은 이 파일에서만 합니다. 통계는 부가 기능이라 실패해도 사이트 동작에 영향을 주지 않습니다.
export async function saveEvent(e: EventInput): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return; // 저장소 미설정(개발 등) — 조용히 건너뜀
  const { error } = await db.from("site_events").insert({
    name: e.name, path: e.path, label: e.label ?? null, source: e.source || null, medium: e.medium || null, campaign: e.campaign || null, ref_host: e.refHost || null,
  });
  if (error) console.error("[event] insert failed"); // 상세 오류는 남기지 않음 (테이블 미생성 시 db/site_events.sql 실행)
}
