import "server-only";
import { sendOwnerMail } from "./mailer";
import type { TemplateRequestData } from "@/features/templateRequest/schema";

export class TemplateRequestUnavailableError extends Error {}

// 받은 요청을 담당 FC 이메일로 보냅니다. 메일 설정이 없거나 발송에 실패하면 오류를 던집니다(저장하지 않음).
export async function submitTemplateRequest(data: TemplateRequestData): Promise<void> {
  const sent = await sendOwnerMail("[홈페이지] 템플릿 요청이 도착했어요", `요청한 페이지: ${data.from}\n\n${data.request}\n`);
  if (!sent) throw new TemplateRequestUnavailableError();
}
