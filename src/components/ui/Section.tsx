import type { ReactNode } from "react";

interface Props { id?: string; title?: string; lead?: string; children: ReactNode; tone?: "white" | "card" }

// 공통 섹션 래퍼 — 여백/제목 스타일을 한 곳에서 관리
export function Section({ id, title, lead, children, tone = "white" }: Props) {
  return (
    <section id={id} className={tone === "card" ? "bg-paper-card" : "bg-paper"}>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        {title && <h2 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h2>}
        {lead && <p className="mt-2 text-ink-sub">{lead}</p>}
        <div className={title ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}
