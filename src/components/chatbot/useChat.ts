"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { chatbotCopy } from "@/config/chatbot";
import { reply, type ChatReply } from "@/lib/chatbot/engine";

export type ChatMessage =
  | { id: number; role: "user"; text: string }
  | ({ id: number; role: "bot" } & ChatReply);

const greeting = (): ChatMessage => ({
  id: 0, role: "bot", text: `${chatbotCopy.greeting} ${chatbotCopy.greetingSub}`, links: [],
  suggestions: [...chatbotCopy.quickReplies],
});

// 대화 상태 — 메모리에만 두고 어디에도 저장·전송하지 않습니다. (새로고침하면 사라집니다)
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting()]);
  const [typing, setTyping] = useState(false);
  const nextId = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const send = useCallback((raw: string) => {
    const text = raw.trim().slice(0, chatbotCopy.maxInputLength);
    if (!text || typing) return;
    const answer = reply(text);
    const userId = nextId.current++;
    const botId = nextId.current++;
    // 개인정보로 보이는 입력은 화면에도 남기지 않습니다.
    const shown = answer.text === chatbotCopy.sensitive.text ? "(개인정보로 보여 가렸어요)" : text;
    setMessages((m) => [...m, { id: userId, role: "user", text: shown }]);
    setTyping(true);
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { id: botId, role: "bot", ...answer }]);
      setTyping(false);
    }, 450);
  }, [typing]);

  // 한 단계 이전으로 — 마지막 질문과 그 답변을 지웁니다 (인사말은 남김). 답을 기다리는 중이면 그 질문만 지웁니다.
  const back = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setTyping(false);
    setMessages((m) => {
      if (m.length <= 1) return m;
      const drop = m[m.length - 1].role === "bot" ? 2 : 1;
      return m.slice(0, Math.max(1, m.length - drop));
    });
  }, []);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setTyping(false);
    setMessages([greeting()]);
  }, []);

  return { messages, typing, send, back, reset };
}
