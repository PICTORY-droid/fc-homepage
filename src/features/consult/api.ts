import type { ApiResult } from "@/lib/api";
import type { ConsultInput } from "./schema";

// 브라우저 → 서버 호출은 이 함수 하나로만 합니다. (화면 코드는 fetch 를 직접 쓰지 않음)
export async function submitConsult(input: ConsultInput): Promise<ApiResult> {
  try {
    const res = await fetch("/api/consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return (await res.json()) as ApiResult;
  } catch {
    return { ok: false, error: { code: "UNAVAILABLE", message: "네트워크 연결을 확인하고 다시 시도해 주세요." } };
  }
}
