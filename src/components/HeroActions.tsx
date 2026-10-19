import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";

// 홈 첫 화면 버튼 묶음 — 보장 점검(주 버튼) / 전화 상담 / 전체 상품보기
// (카카오톡 문의 버튼은 홈에 두지 않고 상품 상세·상담 신청·담당 FC 소개에서만 보여줍니다.)
export function HeroActions({ productsLabel, productsHref }: { productsLabel: string; productsHref: string }) {
  return (
    <div className="flex flex-col gap-3 md:max-w-md">
      <ButtonLink href="/find">30초 보장 점검 시작하기</ButtonLink>
      <a href={`tel:${site.contact.fcPhone}`} className="flex min-h-[48px] items-center justify-center rounded-xl border border-ink/30 bg-paper text-base font-bold text-ink">
        전화 상담
      </a>
      <ButtonLink href={productsHref} variant="outline">{productsLabel}</ButtonLink>
    </div>
  );
}
