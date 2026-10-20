import "server-only";
import { getServerEnv } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { ConsultData } from "@/features/consult/schema";
import { buildDetailPayload } from "@/features/consult/detailOptions";
import { syncLeadToSheet } from "@/services/sheetSync";

export class ServiceUnavailableError extends Error {}

// 상담 신청 저장 — DB 접근은 이 파일에서만 합니다. (저장소를 바꾸려면 이 파일만 교체)
export async function saveLead(data: ConsultData): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[dev] 상담 신청(저장소 미설정, 로그만 기록)", { topic: data.topic, time: data.time });
      return;
    }
    throw new ServiceUnavailableError("storage not configured");
  }
  const detail = buildDetailPayload(data); // 건강 항목은 별도 동의가 있을 때만 포함됨
  const row: Record<string, unknown> = {
    owner_id: getServerEnv().FC_OWNER_ID,
    source: "landing",
    name: data.name,
    phone: data.phone,
    interest: `${data.topic}|${data.time}`,
    insured_age: data.age,
    consent_contact: true,
    consent_at: new Date().toISOString(),
    consent_marketing: false,
    status: "new",
  };
  const a = data.attribution;
  const attr = a && (a.source || a.medium || a.campaign || a.refHost)
    ? { utm_source: a.source ?? null, utm_medium: a.medium ?? null, utm_campaign: a.campaign ?? null, ref_host: a.refHost ?? null }
    : null;
  // 컬럼이 아직 없는 DB(db/leads_attribution.sql, db/leads_detail.sql 미실행)에서도 접수는 유지: 선택 컬럼을 빼며 재시도
  const attempts: Record<string, unknown>[] = [];
  if (detail && attr) attempts.push({ ...row, detail, ...attr });
  if (attr) attempts.push({ ...row, ...attr });
  if (detail) attempts.push({ ...row, detail });
  attempts.push(row);
  let error: unknown = null;
  for (const payload of attempts) {
    ({ error } = await db.from("leads").insert(payload));
    if (!error) break;
    console.error("[consult] insert retry (optional column missing?)");
  }
  if (error) throw new Error("lead insert failed"); // 상세 오류는 응답에 노출하지 않음

  await syncLeadToSheet(data, detail); // 구글 시트 입력 + 알림 메일 (실패해도 접수는 유지)
}
