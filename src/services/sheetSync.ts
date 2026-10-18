import "server-only";
import { getSheetEnv } from "@/lib/env";
import { getCategory } from "@/config/categories";
import { TIME_LABEL, type ConsultData } from "@/features/consult/schema";
import { summarizeDetail, type DetailPayload } from "@/features/consult/detailOptions";

// 상담 신청을 구글 시트(Apps Script 웹 앱)로 보냅니다. — 시트 연동은 이 파일에서만 합니다.
// 시트 전송이 실패해도 상담 신청 자체는 실패로 처리하지 않습니다. (저장은 DB가 기준)
const TIMEOUT_MS = 8000;
// 신청서(ConsultForm)의 '기타' 선택지 문구와 같게 유지하세요.
const OTHER_TOPIC_LABEL = "기타 / 잘 모르겠어요";

const topicLabel = (topic: string) => getCategory(topic)?.title ?? OTHER_TOPIC_LABEL;

export async function syncLeadToSheet(data: ConsultData, detail: DetailPayload | null = null): Promise<void> {
  const env = getSheetEnv();
  if (!env) return; // 미설정이면 건너뜀

  try {
    const res = await fetch(env.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.secret,
        name: data.name,
        phone: data.phone,
        age: data.age,
        topic: topicLabel(data.topic),
        time: TIME_LABEL[data.time],
        consent: data.consent,
        detail: summarizeDetail(detail).join("\n"), // 상세 문진 요약(없으면 빈 문자열)
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const result = (await res.json().catch(() => null)) as { ok?: boolean; code?: string } | null;
    if (!res.ok || !result?.ok) {
      console.error("[sheet] sync failed", { status: res.status, code: result?.code }); // 개인정보는 남기지 않음
    }
  } catch {
    console.error("[sheet] sync error");
  }
}
