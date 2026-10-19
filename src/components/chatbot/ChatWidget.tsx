"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { chatbotCopy, type ChatLink } from "@/config/chatbot";
import { ChatCharacter } from "./ChatCharacter";
import { useChat, type ChatMessage } from "./useChat";

// 작은 알약 버튼(짧은 선택지·링크) / 긴 질문 목록(한 상자 안에서 줄로 구분)
const pillBase = "inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold text-ink";
const pillPlain = `${pillBase} border-ink/20 bg-paper hover:bg-paper-gray`;
const pillPrimary = `${pillBase} border-transparent bg-brand hover:brightness-95`;
const pillKakao = `${pillBase} border-transparent bg-[#FEE500] hover:brightness-95`;
const pillChoice = "inline-flex h-8 items-center rounded-full border border-brand-deep/35 bg-paper px-3 text-[13px] font-medium text-brand-deep hover:bg-brand-soft";
const LONG_CHOICE = 14; // 이 글자 수를 넘는 선택지는 목록 줄로 보여줍니다

function LinkPill({ link, onNavigate }: { link: ChatLink; onNavigate: () => void }) {
  if (link.external) {
    return <a href={link.href} target="_blank" rel="noopener noreferrer" className={link.href.includes("open.kakao.com") ? pillKakao : pillPlain}>{link.label}<span className="sr-only"> (새 창으로 열림)</span></a>;
  }
  if (link.href.startsWith("tel:")) return <a href={link.href} className={pillPlain}>{link.label}</a>;
  return <Link href={link.href} onClick={onNavigate} className={link.href.startsWith("/consult") ? pillPrimary : pillPlain}>{link.label}</Link>;
}

function Choices({ items, onPick }: { items: string[]; onPick: (t: string) => void }) {
  const short = items.filter((s) => s.length <= LONG_CHOICE);
  const long = items.filter((s) => s.length > LONG_CHOICE);
  return (
    <div className="mt-2 space-y-2" role="group" aria-label="추천 질문">
      {short.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {short.map((s) => <button key={s} type="button" onClick={() => onPick(s)} className={pillChoice}>{s}</button>)}
        </div>
      )}
      {long.length > 0 && (
        <ul className="divide-y divide-ink/10 overflow-hidden rounded-xl border border-ink/15 bg-paper">
          {long.map((s) => (
            <li key={s}>
              <button type="button" onClick={() => onPick(s)} className="flex min-h-[40px] w-full items-center gap-2 px-3 py-2 text-left text-[13px] leading-snug text-ink hover:bg-brand-soft">
                <span className="line-clamp-2 flex-1">{s}</span>
                <span aria-hidden="true" className="text-brand-deep">›</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Bubble({ m, onNavigate, onPick, isLast }: { m: ChatMessage; onNavigate: () => void; onPick: (t: string) => void; isLast: boolean }) {
  if (m.role === "user") {
    return <div data-msg="user" className="ml-auto max-w-[85%] break-words rounded-2xl rounded-br-md bg-brand-soft px-3 py-2 text-sm text-ink">{m.text}</div>;
  }
  return (
    <div data-msg="bot" className="flex max-w-[94%] gap-2">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft"><ChatCharacter className="h-5 w-5" /></span>
      <div className="min-w-0">
        <p className="whitespace-pre-line break-keep rounded-2xl rounded-tl-md bg-paper-card px-3 py-2 text-sm leading-relaxed text-ink">{m.text}</p>
        {m.links.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{m.links.map((l) => <LinkPill key={l.href + l.label} link={l} onNavigate={onNavigate} />)}</div>}
        {isLast && m.suggestions.length > 0 && <Choices items={m.suggestions} onPick={onPick} />}
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

  // 새 답변은 '처음 줄'이 보이게, 내가 보낸 말·입력 중 표시는 맨 아래로
  useEffect(() => {
    const el = listRef.current;
    if (!open || !el) return;
    const last = messages[messages.length - 1];
    if (last.role === "bot" && messages.length > 1) {
      const bots = el.querySelectorAll<HTMLElement>('[data-msg="bot"]');
      const node = bots[bots.length - 1];
      if (node) el.scrollTop = Math.max(0, node.offsetTop - 12);
    } else el.scrollTop = el.scrollHeight;
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
          className="flex h-[min(32rem,calc(100dvh-8rem))] w-[calc(100vw-2rem)] max-w-[22rem] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-2xl">
          <header className="flex items-center gap-2 bg-brand-soft px-3 py-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper"><ChatCharacter className="h-6 w-6" /></span>
            <h2 className="flex-1 text-[15px] font-bold text-ink">{chatbotCopy.shortTitle}</h2>
            <button type="button" onClick={reset} className="h-9 rounded-lg px-2 text-[13px] text-ink-sub hover:text-ink">처음으로</button>
            <button type="button" onClick={close} aria-label="안내 도우미 닫기" className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-ink hover:bg-paper/60">✕</button>
          </header>
          <div ref={listRef} className="relative flex-1 space-y-2.5 overflow-y-auto px-3 py-3" aria-live="polite" aria-relevant="additions">
            {messages.map((m, i) => <Bubble key={m.id} m={m} isLast={i === messages.length - 1} onNavigate={close} onPick={send} />)}
            {typing && <p className="pl-9 text-[13px] text-ink-sub" role="status">입력 중…</p>}
          </div>
          <form onSubmit={submit} className="border-t border-ink/10 px-3 pb-2 pt-2.5">
            <div className="flex gap-2">
              <label htmlFor="chat-input" className="sr-only">{chatbotCopy.inputLabel}</label>
              <input id="chat-input" ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} maxLength={chatbotCopy.maxInputLength}
                placeholder={chatbotCopy.inputPlaceholder} autoComplete="off"
                className="h-10 min-w-0 flex-1 rounded-xl border border-ink/20 bg-paper px-3 text-base text-ink placeholder:text-ink-sub/70" />
              <button type="submit" disabled={typing || !text.trim()} className="h-10 rounded-xl bg-brand px-3.5 text-sm font-bold text-ink hover:brightness-95 disabled:opacity-50">보내기</button>
            </div>
            <p className="mt-1.5 text-xs leading-snug text-ink-sub">{chatbotCopy.privacyNote}</p>
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
