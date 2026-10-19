import "server-only";
import { getMailEnv } from "@/lib/env";

// 담당 FC 본인에게 보내는 알림 메일 — 메일 발송(Resend)은 이 파일에서만 합니다. 설정이 없으면 false 를 돌려줍니다.
export async function sendOwnerMail(subject: string, text: string): Promise<boolean> {
  const env = getMailEnv();
  if (!env) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.from, to: [env.to], subject, text }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) console.error("[mail] send failed", { status: res.status }); // 본문·주소는 남기지 않음
    return res.ok;
  } catch {
    console.error("[mail] send error");
    return false;
  }
}
