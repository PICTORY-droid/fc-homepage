import type { ApiResult } from "@/lib/api";
import type { SubscribeInput, UnsubscribeInput } from "./schema";

// 브라우저 → 서버 호출은 이 파일에서만 합니다. (화면 코드는 fetch 를 직접 쓰지 않음)
async function post(url: string, body: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return (await res.json()) as ApiResult;
  } catch {
    return { ok: false, error: { code: "UNAVAILABLE", message: "네트워크 연결을 확인하고 다시 시도해 주세요." } };
  }
}
export const subscribeNewsletter = (input: SubscribeInput) => post("/api/newsletter", input);
export const unsubscribeNewsletter = (input: UnsubscribeInput) => post("/api/newsletter/unsubscribe", input);
