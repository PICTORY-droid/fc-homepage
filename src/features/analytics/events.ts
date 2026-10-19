import { z } from "zod";

// 이용 통계 이벤트 — 개인정보 없이 '무슨 일이 있었는지'만 기록합니다. 브라우저와 서버가 같은 규칙을 씁니다.
export const EVENT_NAMES = ["download", "phone_click", "kakao_click", "consult_start", "consult_done", "cta_click", "newsletter_optin", "template_request", "share"] as const;
export type EventName = (typeof EVENT_NAMES)[number];

const tag = z.string().trim().max(40).regex(/^[\w.\-가-힣]*$/, "invalid").optional();

export const eventSchema = z.object({
  name: z.enum(EVENT_NAMES),
  path: z.string().max(200).regex(/^\/[^\s<>"'`]*$/, "invalid"),
  label: z.string().trim().max(100).regex(/^[^<>"'`\n\r]*$/, "invalid").optional(), // 예) 이력서_백엔드개발자_1_정석형.docx
  source: tag, medium: tag, campaign: tag,
  refHost: z.string().trim().max(60).regex(/^[\w.\-]*$/, "invalid").optional(),
});
export type EventInput = z.infer<typeof eventSchema>;
