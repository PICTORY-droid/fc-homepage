import { site } from "@/config/site";
import { KakaoButton } from "@/components/KakaoButton";
import { KakaoScene } from "@/components/kakao/KakaoScene";

// 카카오톡 비대면 상담 안내 카드 — 주소(site.contact.kakaoUrl)가 비어 있으면 그리지 않습니다.
export function KakaoBanner() {
  if (!site.contact.kakaoUrl) return null;
  return (
    <aside
      aria-label="카카오톡 비대면 상담 안내"
      className="flex flex-col items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF6BF] via-[#FFFAE0] to-paper p-5 ring-1 ring-[#FEE500]/70 sm:flex-row sm:gap-8 sm:p-6"
    >
      <KakaoScene className="h-36 w-auto shrink-0 sm:h-40" />
      <div className="text-center sm:text-left">
        <p className="text-sm font-bold text-brand-deep">비대면 카카오톡 상담</p>
        <h3 className="mt-1 break-keep text-xl font-extrabold leading-snug text-ink sm:text-2xl">상담부터 계약까지 카카오톡으로!</h3>
        <p className="mt-2 break-keep text-base text-ink-sub">집이나 직장 어디서든, 방문 없이 대화로 편하게 진행하세요.</p>
        <KakaoButton className="mt-4 w-full sm:w-auto" />
      </div>
    </aside>
  );
}
