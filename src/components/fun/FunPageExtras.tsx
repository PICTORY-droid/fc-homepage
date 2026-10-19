import { NewsletterOptIn } from "./NewsletterOptIn";
import { ShareBar } from "./ShareBar";

// 즐길거리 상세페이지 맨 아래 공통 영역 — 공유 버튼 + 새 양식 알림(선택). path 는 이 페이지의 주소입니다.
export function FunPageExtras({ path }: { path: string }) {
  return (
    <div className="space-y-4">
      <ShareBar />
      <NewsletterOptIn from={path} />
    </div>
  );
}
