import { z } from "zod";
import { categories } from "@/config/categories";
import { isValidKoreanPhone, onlyDigits } from "@/lib/phone";

// 상담 신청 입력 규칙 — 브라우저와 서버가 같은 스키마를 씁니다 (서버 검증이 최종).
export const TOPICS = [...categories.map((c) => c.slug), "other"] as const;
export const TIMES = ["anytime", "morning", "afternoon"] as const;

export const TIME_LABEL: Record<(typeof TIMES)[number], string> = {
  anytime: "언제든 괜찮아요", morning: "오전 (09~12시)", afternoon: "오후 (13~18시)",
};

export const consultSchema = z.object({
  name: z.string().trim().min(2, "이름을 2자 이상 입력해 주세요.").max(30, "이름이 너무 깁니다."),
  phone: z.string().trim().refine(isValidKoreanPhone, "연락처를 정확히 입력해 주세요.").transform(onlyDigits),
  topic: z.enum(TOPICS, { message: "관심 분야를 선택해 주세요." }),
  time: z.enum(TIMES, { message: "희망 시간을 선택해 주세요." }),
  consent: z.literal(true, { message: "개인정보 수집·이용에 동의해 주세요." }),
  website: z.string().max(0), // 스팸 방지용 숨김 필드 (사람은 비워둠)
});

export type ConsultInput = z.input<typeof consultSchema>;
export type ConsultData = z.output<typeof consultSchema>;
