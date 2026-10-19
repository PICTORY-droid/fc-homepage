import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";

const sub = "flex min-h-[48px] items-center justify-center rounded-xl text-base font-bold text-ink";

// 홈 첫 화면 버튼 묶음 — 보장 점검(주 버튼) / 카톡·전화 상담 / 전체 상품보기
// 카톡 주소(site.contact.kakaoUrl)가 비어 있으면 카톡 버튼은 만들지 않습니다.
// 현재 주소는 휴대폰 카카오톡 앱용(QR 프로필)이라 PC에서는 열리지 않아, 휴대폰 화면(md 미만)에서만 보입니다.
// PC에서도 열리는 오픈채팅·채널 주소로 바꾸면 이 md:hidden 은 제거하세요.
export function HeroActions({ productsLabel, productsHref }: { productsLabel: string; productsHref: string }) {
  const kakao = site.contact.kakaoUrl;
  return (
    <div className="flex flex-col gap-3 md:max-w-md">
      <ButtonLink href="/find">30초 보장 점검 시작하기</ButtonLink>
      <div className={`grid gap-3 ${kakao ? "grid-cols-2 md:grid-cols-1" : "grid-cols-1"}`}>
        {kakao && (
          <a href={kakao} target="_blank" rel="noopener noreferrer" className={`${sub} bg-[#FEE500] md:hidden`}>
            카톡 상담<span className="sr-only"> (새 창으로 열림)</span>
          </a>
        )}
        <a href={`tel:${site.contact.fcPhone}`} className={`${sub} border border-ink/30 bg-paper`}>전화 상담</a>
      </div>
      <ButtonLink href={productsHref} variant="outline">{productsLabel}</ButtonLink>
    </div>
  );
}
