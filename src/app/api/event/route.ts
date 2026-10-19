import { NextResponse, type NextRequest } from "next/server";
import { eventSchema } from "@/features/analytics/events";
import { saveEvent } from "@/services/events";
import { createRateLimiter } from "@/lib/rateLimit";

const MAX_BODY = 1000;
const limited = createRateLimiter(60, 10 * 60 * 1000); // 같은 접속자 10분에 60건까지

const clientIp = (req: NextRequest) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

// 같은 사이트에서 온 요청만 허용 (CSRF·외부 조작 방지)
function isSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return process.env.NODE_ENV !== "production";
  try { return new URL(origin).host === host; } catch { return false; }
}

// 이용 통계 한 건 기록 — 응답 내용은 없습니다(204). IP 는 요청 제한에만 잠깐 쓰고 저장하지 않습니다.
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return new NextResponse(null, { status: 403 });
  if (limited(clientIp(req))) return new NextResponse(null, { status: 429 });
  const text = await req.text();
  if (text.length > MAX_BODY) return new NextResponse(null, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(text); } catch { return new NextResponse(null, { status: 400 }); }
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  try { await saveEvent(parsed.data); } catch { console.error("[event] save failed"); }
  return new NextResponse(null, { status: 204 });
}
