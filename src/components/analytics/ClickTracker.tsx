"use client";
import { useEffect } from "react";
import { captureAttribution, track } from "@/features/analytics/track";

// 사이트 전체의 '다운로드·전화·카카오' 클릭을 한 곳에서 기록합니다. (화면 컴포넌트마다 코드를 넣지 않기 위해 이벤트 위임 사용)
// 전화번호·이름 같은 개인정보는 기록하지 않고, 다운로드는 파일의 한글 이름만 남깁니다.
export function ClickTracker() {
  useEffect(() => {
    captureAttribution();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (a.hasAttribute("download")) {
        const name = a.getAttribute("download");
        track("download", name || decodeURIComponent(href.split("/").pop() ?? ""));
      } else if (href.startsWith("tel:")) track("phone_click");
      else if (/^https?:\/\/([\w-]+\.)*kakao\.com\//.test(href)) track("kakao_click");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
