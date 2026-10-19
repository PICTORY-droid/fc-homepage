import type { ApiResult } from "@/lib/api";
import type { TemplateRequestInput } from "./schema";

// 브라우저 → 서버 호출은 이 파일에서만 합니다.
export async function sendTemplateRequest(input: TemplateRequestInput): Promise<ApiResult> {
  try {
    const res = await fetch("/api/template-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
    return (await res.json()) as ApiResult;
  } catch {
    return { ok: false, error: { code: "UNAVAILABLE", message: "네트워크 연결을 확인하고 다시 시도해 주세요." } };
  }
}
