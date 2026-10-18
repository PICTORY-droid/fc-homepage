import { NextResponse, type NextRequest } from "next/server";
import { getCronSecret } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";

// Supabase 무료 플랜이 장기간 미사용으로 일시중지되는 것을 막기 위한 정기 호출 (vercel.json 의 crons)
// 인증: Vercel Cron 이 보내는 Authorization: Bearer <CRON_SECRET> 만 허용합니다. 데이터는 읽지 않고 개수만 확인합니다.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = getCronSecret();
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 503 });
  const { error } = await db.from("leads").select("id", { count: "exact", head: true });
  if (error) {
    console.error("[keepalive] query failed");
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
