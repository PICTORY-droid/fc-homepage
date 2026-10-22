import { site } from "@/config/site";
import { KakaoButton } from "@/components/KakaoButton";
import { KakaoScene } from "@/components/kakao/KakaoScene";

// 카카오톡 비대면 상담 안내 카드 — 주소(site.contact.kakaoUrl)가 비어 있으면 그리지 않습니다.
export function KakaoBanner() {
  if (!site.contact.kakaoUrl) return null;
  return (
    <aside
      aria-label="카카오톡 비대면 상담 안내"
      className="flex flex-col items-start gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF6BF] via-[#FFFAE0] to-paper p-5 ring-1 ring-[#FEE500]/70 sm:flex-row sm:items-center sm:gap-8 sm:p-6"
    >
      <KakaoScene className="h-36 w-auto shrink-0 sm:h-40" />
      <div className="w-full text-left">
        <p className="text-sm font-bold text-brand-deep">비대면 카카오톡 상담</p>
        <h3 className="mt-1 break-keep text-xl font-extrabold leading-snug text-ink sm:text-2xl">상담부터 계약까지 카카오톡으로!</h3>
        <p className="mt-2 break-keep text-base text-ink-sub">집이나 직장 어디서든, 방문 없이 대화로 편하게 진행하세요.</p>
        <div className="mt-4 flex w-full items-center gap-2 sm:w-[28rem]">
          <KakaoButton className="min-w-0 flex-1" />
          {site.contact.fcPhone && (
            <a
              href={`tel:${site.contact.fcPhone}`}
              aria-label={`전화하기 ${site.contact.fcPhone}`}
              className="flex min-h-[48px] shrink-0 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-bold text-[#C2410C] shadow-sm ring-1 ring-[#FDBA74] transition active:scale-95 hover:bg-[#FFF7ED] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                <path d="M15 3.5c1.7.4 3.1 1.8 3.5 3.5M15.5 7c.6.2 1.1.7 1.3 1.3" />
              </svg>
              전화하기
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
