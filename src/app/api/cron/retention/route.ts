import { NextResponse, type NextRequest } from "next/server";
import { getCronSecret } from "@/lib/env";
import { notifyExpiringLeads } from "@/services/retention";

// 상담 신청자 보관 기간(3년) 만료 알림 — vercel.json 의 crons 가 매주 호출합니다.
// 인증: Authorization: Bearer <CRON_SECRET> 만 허용. 응답에는 개인정보 없이 건수만 담습니다.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = getCronSecret();
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  const result = await notifyExpiringLeads();
  if (!result) return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 503 });
  return NextResponse.json({ ok: true, ...result }, { status: result.found > 0 && !result.sent ? 502 : 200 });
}
