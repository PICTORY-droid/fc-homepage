"use client";
import { useState } from "react";
import { track } from "@/features/analytics/track";
import { sharePage, type ShareResult } from "@/features/share/shareKakao";

const NOTE: Record<ShareResult, string> = { kakao: "", native: "", copied: "주소를 복사했어요. 붙여넣어 보내 주세요.", failed: "공유하지 못했어요. 주소창의 주소를 복사해 보내 주세요." };

// 이 페이지를 카카오톡 등으로 공유하는 버튼 — 눌린 횟수가 통계(share)에 기록됩니다.
export function ShareBar() {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  async function onShare() {
    setBusy(true);
    track("share", location.pathname);
    setNote(NOTE[await sharePage()]);
    setBusy(false);
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => void onShare()} disabled={busy}
        className="flex min-h-[48px] items-center gap-2 rounded-xl bg-[#FEE500] px-5 text-base font-bold text-[#191919] hover:brightness-95 disabled:opacity-60">
        <span aria-hidden="true">💬</span>카카오톡으로 공유하기
      </button>
      <span role="status" className="text-sm text-ink-sub">{note}</span>
    </div>
  );
}
