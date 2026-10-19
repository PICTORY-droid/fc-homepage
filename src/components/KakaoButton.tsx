import { site } from "@/config/site";

// 카카오톡(오픈채팅) 문의 버튼 — 주소(site.contact.kakaoUrl)가 비어 있으면 아무것도 그리지 않습니다.
export function KakaoButton({ className = "" }: { className?: string }) {
  const url = site.contact.kakaoUrl;
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-6 text-base font-bold text-ink ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.3 4.6 6.7l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.5.1 1 .1 1.6.1 5.5 0 10-3.6 10-8S17.5 3 12 3Z" /></svg>
      카카오톡으로 문의하기<span className="sr-only"> (새 창으로 열림)</span>
    </a>
  );
}
