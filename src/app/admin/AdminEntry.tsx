import { Section } from "@/components/ui/Section";
import { Notice } from "@/components/ui/Notice";
import { isAdminConfigured } from "@/services/adminSession";
import { getAccount } from "@/services/adminAccount";
import { LoginForm, RegisterForm } from "./AdminForms";

// 로그인하지 않은 사람에게 보이는 화면 — "관리자 기능입니다."만 알리고, 계정이 있으면 로그인 칸만 보여 줍니다(가입 칸은 계정이 없을 때 한 번뿐).
export async function AdminEntry() {
  const account = isAdminConfigured() ? await getAccount() : null;
  return (
    <Section title="관리자 기능입니다." lead={account ? "관리자 아이디로 로그인해 주세요." : undefined} as="h1">
      {account?.state === "exists" && <LoginForm />}
      {account?.state === "none" && <RegisterForm />}
      {account?.state === "error" && <Notice>관리자 설정이 아직 끝나지 않았습니다.</Notice>}
    </Section>
  );
}
