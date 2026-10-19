import { NextResponse, type NextRequest } from "next/server";
import { subscribeSchema } from "@/features/newsletter/schema";
import { subscribe, NewsletterUnavailableError } from "@/services/newsletter";
import { failure, success } from "@/lib/api";
import { createRateLimiter } from "@/lib/rateLimit";

const MAX_BODY = 1000;
const limited = createRateLimiter(5, 10 * 60 * 1000); // 같은 접속자 10분에 5건까지

const clientIp = (req: NextRequest) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

// 같은 사이트에서 온 요청만 허용 (CSRF 방어)
function isSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return process.env.NODE_ENV !== "production";
  try { return new URL(origin).host === host; } catch { return false; }
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json(failure("FORBIDDEN"), { status: 403 });
  if (limited(clientIp(req))) return NextResponse.json(failure("RATE_LIMITED"), { status: 429 });
  const text = await req.text();
  if (text.length > MAX_BODY) return NextResponse.json(failure("TOO_LARGE"), { status: 413 });
  let body: unknown;
  try { body = JSON.parse(text); } catch { return NextResponse.json(failure("VALIDATION"), { status: 400 }); }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] ??= i.message;
    if ("website" in fields) return NextResponse.json(success(), { status: 200 }); // 봇에게는 성공처럼 응답
    return NextResponse.json(failure("VALIDATION", fields), { status: 400 });
  }
  try {
    await subscribe(parsed.data);
    return NextResponse.json(success(), { status: 201 });
  } catch (e) {
    if (e instanceof NewsletterUnavailableError) return NextResponse.json(failure("UNAVAILABLE"), { status: 503 });
    console.error("[newsletter] subscribe failed"); // 연락처 등 개인정보는 로그에 남기지 않음
    return NextResponse.json(failure("INTERNAL"), { status: 500 });
  }
}
