import { z } from "zod";
import { categories } from "@/config/categories";
import { isValidKoreanPhone, onlyDigits } from "@/lib/phone";
import { FAMILY_HISTORY, INSURANCE_KINDS, YESNO, hasHealthInput } from "./detailOptions";

// 상담 신청 입력 규칙 — 브라우저와 서버가 같은 스키마를 씁니다 (서버 검증이 최종).
export const TOPICS = [...categories.map((c) => c.slug), "other"] as const;
export const TIMES = ["anytime", "morning", "afternoon"] as const;

export const TIME_LABEL: Record<(typeof TIMES)[number], string> = {
  anytime: "언제든 괜찮아요", morning: "오전 (09~12시)", afternoon: "오후 (13~18시)",
};

const yesNo = z.union([z.enum(YESNO), z.literal("")]).default("");
const note = z.string().trim().max(200, "200자 이내로 적어 주세요.").default("");

export const consultSchema = z
  .object({
    name: z.string().trim().min(2, "이름을 2자 이상 입력해 주세요.").max(30, "이름이 너무 깁니다."),
    phone: z.string().trim().refine(isValidKoreanPhone, "연락처를 정확히 입력해 주세요.").transform(onlyDigits),
    age: z
      .string({ message: "가입하실 분(부모님 또는 자녀)의 나이를 입력해 주세요." })
      .trim()
      .regex(/^\d{1,3}$/, "가입하실 분(부모님 또는 자녀)의 나이를 숫자로 입력해 주세요.")
      .transform(Number)
      .pipe(z.number().int().min(0, "0~110 사이의 나이를 입력해 주세요.").max(110, "0~110 사이의 나이를 입력해 주세요.")),
    topic: z.enum(TOPICS, { message: "관심 분야를 선택해 주세요." }),
    time: z.enum(TIMES, { message: "희망 시간을 선택해 주세요." }),
    consent: z.literal(true, { message: "개인정보 수집·이용에 동의해 주세요." }),
    website: z.string().max(0), // 스팸 방지용 숨김 필드 (사람은 비워둠)
    // ── 상세 문진('기타 / 잘 모르겠어요' 선택 시) — 모두 선택 입력, 건강 관련 항목은 별도 동의가 있을 때만 허용
    hasInsurance: yesNo,
    insuranceKinds: z.array(z.enum(INSURANCE_KINDS)).max(INSURANCE_KINDS.length).default([]),
    surgery: yesNo,
    surgeryNote: note,
    treatment: yesNo,
    treatmentNote: note,
    familyHistory: z.array(z.enum(FAMILY_HISTORY)).max(FAMILY_HISTORY.length).default([]),
    memo: z.string().trim().max(300, "300자 이내로 적어 주세요.").default(""),
    healthConsent: z.boolean().default(false),
  })
  .superRefine((d, ctx) => {
    if (hasHealthInput(d) && d.healthConsent !== true) {
      ctx.addIssue({ code: "custom", path: ["healthConsent"], message: "건강 관련 내용을 입력하시려면 민감정보 수집·이용에 동의해 주세요." });
    }
  });

export type ConsultInput = z.input<typeof consultSchema>;
export type ConsultData = z.output<typeof consultSchema>;
