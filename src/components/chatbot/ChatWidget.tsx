"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { chatbotCopy, type ChatLink } from "@/config/chatbot";
import { ChatCharacter } from "./ChatCharacter";
import { useChat, type ChatMessage } from "./useChat";

const chipBase = "inline-flex min-h-[44px] items-center rounded-xl border px-3 text-sm font-semibold text-ink";
const chipPlain = `${chipBase} border-ink/20 bg-paper hover:bg-paper-gray`;
const chipPrimary = `${chipBase} border-transparent bg-brand hover:brightness-95`;
const chipKakao = `${chipBase} border-transparent bg-[#FEE500] hover:brightness-95`;

function LinkChip({ link, onNavigate }: { link: ChatLink; onNavigate: () => void }) {
  if (link.external) {
    return <a href={link.href} target="_blank" rel="noopener noreferrer" className={link.href.includes("open.kakao.com") ? chipKakao : chipPlain}>{link.label}<span className="sr-only"> (새 창으로 열림)</span></a>;
  }
  if (link.href.startsWith("tel:")) return <a href={link.href} className={chipPlain}>{link.label}</a>;
  return <Link href={link.href} onClick={onNavigate} className={link.href.startsWith("/consult") ? chipPrimary : chipPlain}>{link.label}</Link>;
}

function Bubble({ m, onNavigate, onSuggest, isLast }: { m: ChatMessage; onNavigate: () => void; onSuggest: (t: string) => void; isLast: boolean }) {
  if (m.role === "user") {
    return <div className="ml-auto max-w-[85%] break-words rounded-2xl rounded-br-md bg-brand-soft px-3.5 py-2.5 text-[15px] text-ink">{m.text}</div>;
  }
  return (
    <div className="flex max-w-[92%] gap-2">
      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft"><ChatCharacter className="h-6 w-6" /></span>
      <div className="min-w-0">
        <p className="whitespace-pre-line break-keep rounded-2xl rounded-tl-md bg-paper-card px-3.5 py-2.5 text-[15px] leading-relaxed text-ink">{m.text}</p>
        {m.links.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{m.links.map((l) => <LinkChip key={l.href + l.label} link={l} onNavigate={onNavigate} />)}</div>}
        {isLast && m.suggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="추천 질문">
            {m.suggestions.map((s) => <button key={s} type="button" onClick={() => onSuggest(s)} className="min-h-[40px] rounded-2xl border border-brand-deep/40 bg-paper px-3.5 py-1.5 text-left text-sm font-medium leading-snug text-brand-deep hover:bg-brand-soft">{s}</button>)}
          </div>
        )}
      </div>
    </div>
  );
}

// 오른쪽 아래 안내 도우미 — 화면(UI)만 맡고, 답변 로직은 lib/chatbot/engine, 문구는 config/chatbot 에 있습니다.
export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { messages, typing, send, reset } = useChat();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const el = listRef.current;
    if (open && el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else if (wasOpen.current) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  const submit = (e: FormEvent) => { e.preventDefault(); send(text); setText(""); };
  const close = () => setOpen(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6" onKeyDown={(e) => { if (e.key === "Escape" && open) close(); }}>
      {open && (
        <section id="chat-panel" role="dialog" aria-label={chatbotCopy.title}
          className="flex h-[min(34rem,calc(100dvh-7.5rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-2xl">
          <header className="flex items-center gap-3 bg-brand-soft px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper"><ChatCharacter className="h-8 w-8" /></span>
            <h2 className="flex-1 text-base font-bold text-ink">{chatbotCopy.shortTitle}</h2>
            <button type="button" onClick={reset} className="min-h-[44px] rounded-lg px-2 text-sm text-ink-sub hover:text-ink">처음으로</button>
            <button type="button" onClick={close} aria-label="안내 도우미 닫기" className="flex h-11 w-11 items-center justify-center rounded-lg text-xl text-ink hover:bg-paper/60">✕</button>
          </header>
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite" aria-relevant="additions">
            {messages.map((m, i) => <Bubble key={m.id} m={m} isLast={i === messages.length - 1} onNavigate={close} onSuggest={send} />)}
            {typing && <p className="text-sm text-ink-sub" role="status">입력 중…</p>}
          </div>
          <form onSubmit={submit} className="border-t border-ink/10 px-3 pb-2 pt-3">
            <div className="flex gap-2">
              <label htmlFor="chat-input" className="sr-only">{chatbotCopy.inputLabel}</label>
              <input id="chat-input" ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} maxLength={chatbotCopy.maxInputLength}
                placeholder={chatbotCopy.inputPlaceholder} autoComplete="off"
                className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-ink/20 bg-paper px-3 text-base text-ink placeholder:text-ink-sub/70" />
              <button type="submit" disabled={typing || !text.trim()} className="min-h-[44px] rounded-xl bg-brand px-4 text-base font-bold text-ink hover:brightness-95 disabled:opacity-50">보내기</button>
            </div>
            <p className="mt-2 text-xs leading-snug text-ink-sub">{chatbotCopy.privacyNote}</p>
          </form>
        </section>
      )}
      <button ref={launcherRef} type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="chat-panel"
        aria-label={open ? "안내 도우미 닫기" : `안내 도우미 열기 — ${chatbotCopy.launcherLabel}`}
        className="group flex items-center gap-2 rounded-full bg-paper p-1.5 shadow-lg ring-1 ring-brand/30 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft"><ChatCharacter className="cb-bob h-11 w-11" /></span>
        {!open && <span className="hidden pr-4 text-sm font-bold text-ink md:inline">{chatbotCopy.launcherLabel}</span>}
      </button>
    </div>
  );
}
