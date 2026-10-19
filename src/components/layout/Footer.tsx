import Link from "next/link";
import { site } from "@/config/site";

// 하단 고지 영역 — 법적/안내 문구는 config/site.ts 에서 수정
export function Footer() {
  const reviewText = site.reviewNo ? `심의필 ${site.reviewNo}` : process.env.NODE_ENV !== "production" ? "심의번호 미입력 (개발용 표시)" : "";
  return (
    <footer className="border-t border-ink/10 bg-paper-card">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 text-sm text-ink-sub sm:px-6">
        <div>
          <div>
            <p className="font-semibold text-ink">담당 FC 상담</p>
            <div className="flex flex-wrap items-center gap-3">
              <a className="text-xl font-bold text-ink" href={`tel:${site.contact.fcPhone}`}>{site.contact.fcPhone}</a>
              <a
                href={`tel:${site.contact.fcPhone}`}
                className="flex min-h-[44px] items-center whitespace-nowrap rounded-lg bg-brand px-4 text-sm font-semibold text-ink"
              >
                전화 상담
              </a>
            </div>
            <p>{site.contact.hours}</p>
          </div>
        </div>
        {reviewText && <p className="border-t border-ink/10 pt-6">{reviewText}</p>}
        <nav aria-label="하단 메뉴" className="flex flex-wrap gap-x-5 gap-y-2 font-semibold text-ink">
          <Link href="/guide" className="underline">이용 안내</Link>
          <Link href="/privacy" className="underline">개인정보처리방침</Link>
          <Link href="/products" className="underline">보험 상품</Link>
          <Link href="/find" className="underline">보장 찾기</Link>
        </nav>
        <p className="text-xs font-semibold text-ink">{site.affiliation ? `${site.affiliation} · ` : ""}{site.notices.identity} 공식 정보는 <a className="underline" href={site.links.officialSite} target="_blank" rel="noopener noreferrer">우체국보험 공식 사이트<span className="sr-only"> (새 창으로 열림)</span></a>에서 확인하세요.</p>
        <p className="text-xs">{site.notices.basis}</p>
      </div>
    </footer>
  );
}
