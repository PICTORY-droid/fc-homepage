"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { endAdminSession, isAdminLoggedIn, startAdminSession } from "@/services/adminSession";
import { LEAD_STATUSES, updateLead } from "@/services/adminLeads";
import { isRateLimited } from "@/lib/rateLimit";

export type ActionState = { error?: string };

// 로그인 — 시도 횟수 제한 + 비밀번호 확인은 서버에서만 합니다.
export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`admin-login:${ip}`)) return { error: "시도가 너무 많습니다. 잠시 후 다시 시도해 주세요." };
  const password = String(formData.get("password") ?? "").slice(0, 200);
  const ok = await startAdminSession(password);
  if (!ok) return { error: "비밀번호가 맞지 않거나 관리자 기능이 설정되지 않았습니다." };
  revalidatePath("/admin");
  return {};
}

export async function logoutAction(): Promise<void> {
  await endAdminSession();
  revalidatePath("/admin");
}

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
  memo: z.string().trim().max(500).optional(),
});

export async function updateLeadAction(formData: FormData): Promise<void> {
  if (!(await isAdminLoggedIn())) return; // 권한 검사는 서버에서
  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    memo: formData.get("memo") ?? undefined,
  });
  if (!parsed.success) return;
  await updateLead(parsed.data.id, { status: parsed.data.status, ...(parsed.data.memo !== undefined ? { memo: parsed.data.memo || null } : {}) });
  revalidatePath("/admin");
}
