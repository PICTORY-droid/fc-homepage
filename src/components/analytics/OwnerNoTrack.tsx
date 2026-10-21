"use client";
import { useEffect } from "react";
import { NO_TRACK_KEY } from "@/features/analytics/track";

// 관리자 화면에 로그인한 브라우저는 이후 본인의 방문·클릭을 통계에서 제외합니다.
export function OwnerNoTrack() {
  useEffect(() => { try { localStorage.setItem(NO_TRACK_KEY, "1"); } catch { /* 무시 */ } }, []);
  return null;
}
