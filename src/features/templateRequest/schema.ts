import { z } from "zod";

// 템플릿 요청 — 브라우저와 서버가 같은 규칙을 씁니다 (서버 검증이 최종). 연락처 등 개인정보는 받지 않습니다.
export const TEMPLATE_REQUEST_MAX = 500;

export const templateRequestSchema = z.object({
  request: z.string().trim().min(2, "원하시는 템플릿을 2글자 이상 적어 주세요.").max(TEMPLATE_REQUEST_MAX, `${TEMPLATE_REQUEST_MAX}자 이내로 적어 주세요.`),
  from: z.string().max(200).regex(/^\/[^\s<>"'`]*$/, "invalid"), // 요청한 페이지 경로
  website: z.string().max(0), // 스팸 방지용 숨김 필드
});
export type TemplateRequestInput = z.input<typeof templateRequestSchema>;
export type TemplateRequestData = z.output<typeof templateRequestSchema>;
