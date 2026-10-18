import { site } from "@/config/site";

// 최상단 얇은 안내 띠 — 공식 사이트가 아님을 항상 보여주고, 공식 고객센터 번호를 안내
export function TopBar() {
  return (
    <div className="bg-ink text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6">
        <p className="truncate">우체국보험 FC 개인 안내 페이지 · 공식 사이트 아님</p>
        <p className="hidden shrink-0 sm:block">
          공식 고객센터 <a href={`tel:${site.contact.officialCenterPhone}`} className="font-semibold underline">{site.contact.officialCenterPhone}</a>
          {" · "}{site.contact.hours}
        </p>
      </div>
    </div>
  );
}
