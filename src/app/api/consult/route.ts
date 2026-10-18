import { NextResponse, type NextRequest } from "next/server";
import { consultSchema } from "@/features/consult/schema";
import { saveLead, ServiceUnavailableError } from "@/services/leads";
import { failure, success } from "@/lib/api";
import { isRateLimited } from "@/lib/rateLimit";

const MAX_BODY = 4000;

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

// 같은 사이트에서 온 요청만 허용 (CSRF 방어)
function isSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return process.env.NODE_ENV !== "production";
  try { return new URL(origin).host === host; } catch { return false; }
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json(failure("FORBIDDEN"), { status: 403 });
  if (isRateLimited(clientIp(req))) return NextResponse.json(failure("RATE_LIMITED"), { status: 429 });

  const text = await req.text();
  if (text.length > MAX_BODY) return NextResponse.json(failure("TOO_LARGE"), { status: 413 });

  let body: unknown;
  try { body = JSON.parse(text); } catch { return NextResponse.json(failure("VALIDATION"), { status: 400 }); }

  const parsed = consultSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] ??= i.message;
    if ("website" in fields) return NextResponse.json(success(), { status: 200 }); // 봇에게는 성공처럼 응답
    return NextResponse.json(failure("VALIDATION", fields), { status: 400 });
  }

  try {
    await saveLead(parsed.data);
    return NextResponse.json(success(), { status: 201 });
  } catch (e) {
    if (e instanceof ServiceUnavailableError) return NextResponse.json(failure("UNAVAILABLE"), { status: 503 });
    console.error("[consult] save failed"); // 개인정보·내부정보는 로그에 남기지 않음
    return NextResponse.json(failure("INTERNAL"), { status: 500 });
  }
}
