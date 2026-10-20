import { z } from "zod";
import { categories } from "@/config/categories";
import { isValidKoreanPhone, onlyDigits } from "@/lib/phone";
import { attributionSchema } from "@/features/analytics/events";
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
    // 선택 입력 — 비워두면 상담 때 확인합니다.
    age: z
      .string()
      .trim()
      .default("")
      .refine((v) => v === "" || (/^\d{1,3}$/.test(v) && Number(v) <= 110), "0~110 사이의 나이를 숫자로 입력해 주세요.")
      .transform((v) => (v === "" ? undefined : Number(v))),
    topic: z.enum(TOPICS, { message: "관심 분야를 선택해 주세요." }),
    time: z.enum(TIMES, { message: "희망 시간을 선택해 주세요." }).default("anytime"),
    consent: z.literal(true, { message: "개인정보 수집·이용에 동의해 주세요." }),
    website: z.string().max(0), // 스팸 방지용 숨김 필드 (사람은 비워둠)
    // ── 상세 문진 — 모두 선택 입력, 건강 관련 항목은 별도 동의가 있을 때만 허용
    hasInsurance: yesNo,
    insuranceKinds: z.array(z.enum(INSURANCE_KINDS)).max(INSURANCE_KINDS.length).default([]),
    surgery: yesNo,
    surgeryNote: note,
    treatment: yesNo,
    treatmentNote: note,
    familyHistory: z.array(z.enum(FAMILY_HISTORY)).max(FAMILY_HISTORY.length).default([]),
    memo: z.string({ message: "궁금한 점을 적어 주세요." }).trim().min(2, "궁금한 점을 2자 이상 적어 주세요.").max(300, "300자 이내로 적어 주세요."),
    healthConsent: z.boolean().default(false),
    // 어느 글·채널에서 왔는지(선택). 형식이 틀리면 신청 자체를 막지 않고 버립니다.
    attribution: attributionSchema.optional().catch(undefined),
  })
  .superRefine((d, ctx) => {
    if (hasHealthInput(d) && d.healthConsent !== true) {
      ctx.addIssue({ code: "custom", path: ["healthConsent"], message: "건강 관련 내용을 입력하시려면 민감정보 수집·이용에 동의해 주세요." });
    }
  });

export type ConsultInput = z.input<typeof consultSchema>;
export type ConsultData = z.output<typeof consultSchema>;
