import Link from "next/link";
import { site } from "@/config/site";

const base = "flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-xl px-2 text-sm font-bold text-ink sm:text-base";

// 홈 첫 화면 버튼 묶음 — 한 줄 3개: 보장 점검(주 버튼) / 전화 상담 / 전체 상품보기
// (카카오톡 문의 버튼은 홈에 두지 않고 상품 상세·상담 신청·담당 FC 소개에서만 보여줍니다.)
export function HeroActions({ productsLabel, productsHref }: { productsLabel: string; productsHref: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 md:max-w-md">
      <Link href="/find" className={`${base} bg-brand`}>30초 보장 점검</Link>
      <a href={`tel:${site.contact.fcPhone}`} className={`${base} border border-ink/30 bg-paper`}>전화 상담</a>
      <Link href={productsHref} className={`${base} border border-ink/30 bg-paper`}>{productsLabel}</Link>
    </div>
  );
}
