import "server-only";
import { getServerEnv } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { ConsultData } from "@/features/consult/schema";
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
  const { error } = await db.from("leads").insert({
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
  });
  if (error) throw new Error("lead insert failed"); // 상세 오류는 응답에 노출하지 않음

  await syncLeadToSheet(data); // 구글 시트 입력 + 알림 메일 (실패해도 접수는 유지)
}
