import "server-only";
import { site } from "@/config/site";
import { getServerEnv } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import { daysLeft, dueCutoff, expiryDate, formatKstDate } from "@/features/retention/dates";
import { sendOwnerMail } from "./mailer";

export interface ExpiringLead { id: string; name: string; phoneTail: string; createdAt: string; expiry: string; daysLeft: number }

// 보관 기간이 곧 끝나는 상담 신청자 조회 — DB 접근은 이 파일에서만 합니다. (아직 알리지 않은 건만)
export async function findExpiringLeads(now = new Date()): Promise<ExpiringLead[] | null> {
  const db = getSupabaseAdmin();
  const owner = getServerEnv().FC_OWNER_ID;
  const months = site.privacy.retentionMonths;
  if (!db || !owner || !months) return null;
  const { data, error } = await db.from("leads").select("id,name,phone,created_at")
    .eq("owner_id", owner).is("deleted_at", null).is("retention_notified_at", null)
    .lte("created_at", dueCutoff(months, site.privacy.retentionNoticeDays, now).toISOString()).order("created_at").limit(200);
  if (error) { console.error("[retention] query failed (db/leads_retention.sql 실행 필요?)"); return null; }
  return (data ?? []).map((r) => {
    const exp = expiryDate(r.created_at, months);
    return { id: r.id, name: r.name ?? "(이름 없음)", phoneTail: String(r.phone ?? "").slice(-4), createdAt: r.created_at, expiry: formatKstDate(exp), daysLeft: daysLeft(exp, now) };
  });
}

export function buildRetentionMail(list: ExpiringLead[]): { subject: string; text: string } {
  const months = site.privacy.retentionMonths ?? 36;
  const lines = list.map((l) => `- ${l.name} (연락처 끝 ${l.phoneTail || "----"}) · 접수 ${formatKstDate(l.createdAt)} · 만료 ${l.expiry} · ${l.daysLeft >= 0 ? `D-${l.daysLeft}` : `${-l.daysLeft}일 지남`}`);
  return {
    subject: `[개인정보 파기 알림] 상담 신청 ${list.length}건 보관 기간(${months}개월) 만료 예정`,
    text: [
      `보관 기간 ${months}개월이 곧 끝나거나 지난 상담 신청자입니다. 확인 후 삭제해 주세요.`, "", ...lines, "",
      "삭제 방법: Supabase → Table Editor → leads 에서 이름·접수일로 찾아 해당 줄을 삭제하세요.",
      "구글 시트에도 같은 신청 내용이 있으면 그 줄도 함께 삭제해 주세요.",
      "이 메일은 같은 사람에게 다시 보내지 않습니다.",
    ].join("\n"),
  };
}

// 알림 메일을 보낸 건은 다시 보내지 않도록 표시합니다.
export async function markNotified(ids: string[], now = new Date()): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db || ids.length === 0) return;
  const { error } = await db.from("leads").update({ retention_notified_at: now.toISOString() }).in("id", ids);
  if (error) console.error("[retention] mark failed");
}

export async function notifyExpiringLeads(now = new Date()): Promise<{ found: number; sent: boolean } | null> {
  const list = await findExpiringLeads(now);
  if (!list) return null;
  if (list.length === 0) return { found: 0, sent: false };
  const mail = buildRetentionMail(list);
  const sent = await sendOwnerMail(mail.subject, mail.text);
  if (sent) await markNotified(list.map((l) => l.id), now);
  return { found: list.length, sent };
}
