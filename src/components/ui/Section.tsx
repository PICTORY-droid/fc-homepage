import type { ReactNode } from "react";

interface Props { id?: string; title?: string; lead?: string; children: ReactNode; tone?: "white" | "card"; reveal?: boolean; dense?: boolean }

// 공통 섹션 래퍼 — 여백/제목 스타일을 한 곳에서 관리
export function Section({ id, title, lead, children, tone = "white", reveal = true, dense = false }: Props) {
  return (
    <section id={id} className={tone === "card" ? "bg-paper-card" : "bg-paper"}>
      <div className={`mx-auto max-w-5xl px-4 sm:px-6 ${dense ? "py-8 sm:py-10" : "py-12 sm:py-16"}`}>
        <div data-reveal>
          {title && <h2 className={`font-bold text-ink ${dense ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>{title}</h2>}
          {lead && <p className={`text-ink-sub ${dense ? "mt-1 text-sm" : "mt-2"}`}>{lead}</p>}
        </div>
        <div className={title ? (dense ? "mt-4" : "mt-8") : ""} {...(reveal ? { "data-reveal": "" } : {})}>{children}</div>
      </div>
    </section>
  );
}
