"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { endAdminSession, isAdminLoggedIn, isSetupCodeValid, startAdminSession } from "@/services/adminSession";
import { createAccount, getAccount } from "@/services/adminAccount";
import { LEAD_STATUSES, updateLead } from "@/services/adminLeads";
import { hashPassword, validateCredentials, verifyPassword } from "@/lib/adminAccount";
import { isRateLimited } from "@/lib/rateLimit";

export type ActionState = { error?: string };

const clientIp = async () => (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
const text = (f: FormData, k: string, max = 200) => String(f.get(k) ?? "").slice(0, max);
const LOGIN_FAIL = "아이디 또는 비밀번호가 맞지 않습니다.";

// 로그인 — 시도 횟수 제한 + 아이디·비밀번호 확인은 서버에서만 합니다. (아이디가 틀려도 비밀번호가 틀려도 같은 문구)
export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (isRateLimited(`admin-login:${await clientIp()}`)) return { error: "시도가 너무 많습니다. 잠시 후 다시 시도해 주세요." };
  const account = await getAccount();
  if (account.state !== "exists") return { error: LOGIN_FAIL };
  const idOk = text(formData, "username", 60) === account.username;
  const pwOk = verifyPassword(text(formData, "password", 100), account.hash); // 아이디가 틀려도 해시 계산은 해서 응답 시간을 비슷하게
  if (!idOk || !pwOk || !(await startAdminSession())) return { error: LOGIN_FAIL };
  revalidatePath("/admin");
  return {};
}

// 관리자 등록 — 계정이 아직 없을 때만 가능하고, 환경변수 ADMIN_PASSWORD(인증 코드)를 알아야 합니다. 한 번 등록되면 다시는 열리지 않습니다.
export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (isRateLimited(`admin-register:${await clientIp()}`)) return { error: "시도가 너무 많습니다. 잠시 후 다시 시도해 주세요." };
  const account = await getAccount();
  if (account.state === "error") return { error: "저장소 설정이 끝나지 않았습니다. db/admin_setup.sql 을 실행했는지 확인해 주세요." };
  if (account.state === "exists") return { error: "이미 관리자가 등록되어 있습니다." };
  if (!isSetupCodeValid(text(formData, "code"))) return { error: "인증 코드가 맞지 않습니다." };
  const username = text(formData, "username", 60).trim();
  const password = text(formData, "password", 100);
  if (password !== text(formData, "password2", 100)) return { error: "비밀번호 확인이 서로 다릅니다." };
  const problem = validateCredentials(username, password);
  if (problem) return { error: problem };
  const made = await createAccount(username, hashPassword(password));
  if (made === "exists") return { error: "이미 관리자가 등록되어 있습니다." };
  if (made !== "ok" || !(await startAdminSession())) return { error: "등록하지 못했습니다. 잠시 후 다시 시도해 주세요." };
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
