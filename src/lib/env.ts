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

// 관리자 화면(선택) 설정 — 둘 다 올바르게 입력돼야 /admin 이 활성화됩니다. (값은 로그에 남기지 않음)
const adminSchema = z.object({
  ADMIN_PASSWORD: z.string().min(12),
  ADMIN_SESSION_SECRET: z.string().min(32),
  ADMIN_ENTRY_KEY: z.string().min(8).optional(),
});

// entryKey: 로그인 화면을 여는 비밀 주소 꼬리표(/admin?k=...). ADMIN_ENTRY_KEY 를 따로 넣지 않으면 ADMIN_SESSION_SECRET 앞 12자를 씁니다.
export function getAdminEnv(): { password: string; secret: string; entryKey: string } | null {
  const parsed = adminSchema.safeParse(process.env);
  if (!parsed.success) return null;
  const d = parsed.data;
  return { password: d.ADMIN_PASSWORD, secret: d.ADMIN_SESSION_SECRET, entryKey: d.ADMIN_ENTRY_KEY ?? d.ADMIN_SESSION_SECRET.slice(0, 12) };
}

// 메일 발송(Resend) 설정 — 보관 기간 만료 알림용. 키가 없으면 알림 메일은 보내지 않습니다. (값은 로그에 남기지 않음)
const mailSchema = z.object({
  RESEND_API_KEY: z.string().min(10),
  RETENTION_MAIL_TO: z.string().email(),
  MAIL_FROM: z.string().min(3).optional(),
});
export function getMailEnv(): { key: string; to: string; from: string } | null {
  const p = mailSchema.safeParse(process.env);
  return p.success ? { key: p.data.RESEND_API_KEY, to: p.data.RETENTION_MAIL_TO, from: p.data.MAIL_FROM ?? "우체국보험 FC 홈페이지 <onboarding@resend.dev>" } : null;
}

// 정기 호출(Vercel Cron) 인증용 비밀 값
export const getCronSecret = (): string | null => {
  const v = process.env.CRON_SECRET;
  return v && v.length >= 16 ? v : null;
};
