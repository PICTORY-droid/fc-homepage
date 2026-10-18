import type { ReactNode } from "react";

// 안내/주의 문구 박스 (공식 사이트의 빨간 주의 문구 스타일을 참고)
export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "alert" }) {
  const cls = tone === "alert" ? "border-alert/40 text-alert" : "border-ink/15 text-ink-sub";
  return <p className={`rounded-xl border bg-paper px-4 py-3 text-sm leading-relaxed ${cls}`}>{children}</p>;
}
