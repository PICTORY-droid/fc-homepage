"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/features/analytics/track";

const VISIT_KEY = "fc_visit";

// 페이지를 열 때마다 '페이지 보기'를, 한 번 방문(브라우저 탭 기준)에 한 번 '방문'을 기록합니다.
// 이름·연락처·IP 는 저장하지 않고, 쿠키도 쓰지 않습니다.
export function PageViewTracker() {
  const path = usePathname();
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(VISIT_KEY)) {
        sessionStorage.setItem(VISIT_KEY, "1");
        track("visit");
      }
    } catch { /* 저장소를 못 쓰면 방문 기록만 건너뜀 */ }
    track("page_view");
  }, [path]);
  return null;
}
