import "server-only";
import { z } from "zod";

// 서버 환경변수 검증 — 값이 없으면 상담 저장은 비활성(개발 모드에서는 로그만 남김)
const schema = z.object({
  SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  FC_OWNER_ID: z.string().uuid().optional().or(z.literal("")),
});

export function getServerEnv() {
  const parsed = schema.safeParse(process.env);
  const env = parsed.success ? parsed.data : {};
  const configured = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && env.FC_OWNER_ID);
  return { ...env, configured } as {
    SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string; FC_OWNER_ID?: string; configured: boolean;
  };
}

// 구글 시트 자동 입력(선택) 설정 — DB 설정과 따로 검증해서, 이 값이 잘못돼도 상담 저장에는 영향이 없습니다.
const sheetSchema = z.object({
  SHEET_WEBHOOK_URL: z.string().url().startsWith("https://script.google.com/"),
  SHEET_WEBHOOK_SECRET: z.string().min(16),
});

export function getSheetEnv(): { url: string; secret: string } | null {
  const parsed = sheetSchema.safeParse(process.env);
  if (parsed.success) {
    return { url: parsed.data.SHEET_WEBHOOK_URL, secret: parsed.data.SHEET_WEBHOOK_SECRET };
  }
  // 하나라도 입력돼 있는데 형식이 틀린 경우에만 경고 (값 자체는 로그에 남기지 않음)
  if (process.env.SHEET_WEBHOOK_URL || process.env.SHEET_WEBHOOK_SECRET) {
    console.warn("[sheet] 환경변수 형식 오류: 시트 연동을 건너뜁니다");
  }
  return null;
}
