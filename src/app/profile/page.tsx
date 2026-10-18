import type { Metadata } from "next";
import { ProfileSection } from "@/components/profile/ProfileSection";

export const metadata: Metadata = {
  title: "담당 FC 소개",
  description: "경남 김해 우체국보험 FC — 상담 진행 방식과 연락 방법을 안내합니다.",
  alternates: { canonical: "/profile" },
};

// 담당 FC 소개 — 내용은 config/site.ts 의 profile 에서 수정합니다.
export default function ProfilePage() {
  return <ProfileSection />;
}
