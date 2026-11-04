"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { chatLauncherLabel } from "@/config/chatbotLauncher";
import { ChatCharacter } from "./ChatCharacter";

// 대화창(답변 엔진·상품 목록 포함)은 처음 열 때 받아옵니다 — 모든 페이지의 첫 화면 속도를 위해서예요.
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

// 오른쪽 아래 안내 도우미 — 여는 버튼만 바로 그리고, 대화창은 ChatPanel 이 맡습니다. (답변 로직은 lib/chatbot/engine, 문구는 config/chatbot)
export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false); // 한 번 열면 대화창을 계속 붙여 둬서 대화가 이어지게
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open && wasOpen.current) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  if (pathname.startsWith("/admin")) return null;
  const close = () => setOpen(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6" onKeyDown={(e) => { if (e.key === "Escape" && open) close(); }}>
      {loaded && <ChatPanel open={open} onClose={close} />}
      <button ref={launcherRef} type="button" onClick={() => { setLoaded(true); setOpen((v) => !v); }} aria-expanded={open} aria-controls="chat-panel"
        aria-label={open ? "안내 도우미 닫기" : `안내 도우미 열기 — ${chatLauncherLabel}`}
        className="cb-glow group flex items-center gap-2 rounded-full bg-paper p-1.5 shadow-lg ring-1 ring-brand/30 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft"><ChatCharacter className="cb-bob h-11 w-11" /></span>
        {!open && <span className="hidden pr-4 text-sm font-bold text-ink md:inline">{chatLauncherLabel}</span>}
      </button>
    </div>
  );
}
