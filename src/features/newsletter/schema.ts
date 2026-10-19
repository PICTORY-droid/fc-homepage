import { z } from "zod";
import { isValidKoreanPhone, onlyDigits } from "@/lib/phone";

// 새 양식 알림 — 브라우저와 서버가 같은 규칙을 씁니다 (서버 검증이 최종).
const phone = z.string().trim().refine(isValidKoreanPhone, "연락처를 정확히 입력해 주세요.").transform(onlyDigits);

export const subscribeSchema = z.object({
  phone,
  consent: z.literal(true, { message: "수신 동의에 체크해 주세요." }),
  from: z.string().max(200).regex(/^\/[^\s<>"'`]*$/, "invalid"), // 동의한 페이지 경로
  website: z.string().max(0), // 스팸 방지용 숨김 필드
});
export type SubscribeInput = z.input<typeof subscribeSchema>;
export type SubscribeData = z.output<typeof subscribeSchema>;

export const unsubscribeSchema = z.object({ phone, website: z.string().max(0) });
export type UnsubscribeInput = z.input<typeof unsubscribeSchema>;
export type UnsubscribeData = z.output<typeof unsubscribeSchema>;
