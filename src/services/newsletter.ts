import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NEWSLETTER_CONSENT_VERSION } from "@/features/newsletter/consentText";
import { site } from "@/config/site";
import type { SubscribeData, UnsubscribeData } from "@/features/newsletter/schema";

export class NewsletterUnavailableError extends Error {}

const addMonths = (d: Date, m: number) => { const x = new Date(d); x.setMonth(x.getMonth() + m); return x; };

// 새 양식 알림 저장 — DB 접근은 이 파일에서만 합니다. 같은 번호가 다시 신청하면 동의일·만료일을 갱신하고 수신 거부를 풉니다.
export async function subscribe(data: SubscribeData): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) {
    if (process.env.NODE_ENV !== "production") return; // 개발 중 저장소 미설정 — 건너뜀
    throw new NewsletterUnavailableError("storage not configured");
  }
  const now = new Date();
  const { error } = await db.from("newsletter_subscribers").upsert({
    phone: data.phone, source_path: data.from, consent_text_ver: NEWSLETTER_CONSENT_VERSION,
    consent_at: now.toISOString(), expires_at: addMonths(now, site.newsletter.retentionMonths).toISOString(),
    unsubscribed_at: null, updated_at: now.toISOString(),
  }, { onConflict: "phone" });
  if (error) throw new Error("newsletter upsert failed"); // 상세 오류는 응답·로그에 남기지 않음
}

// 수신 거부 — 번호가 없어도 같은 응답을 주어 가입 여부를 알아낼 수 없게 합니다.
export async function unsubscribe(data: UnsubscribeData): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) {
    if (process.env.NODE_ENV !== "production") return;
    throw new NewsletterUnavailableError("storage not configured");
  }
  const now = new Date().toISOString();
  const { error } = await db.from("newsletter_subscribers").update({ unsubscribed_at: now, updated_at: now }).eq("phone", data.phone);
  if (error) throw new Error("newsletter unsubscribe failed");
}
