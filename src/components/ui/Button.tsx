import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex min-h-[48px] items-center justify-center rounded-xl px-6 text-base font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const variants = {
  primary: "btn-shine bg-brand text-ink hover:shadow-md hover:brightness-95",
  soft: "bg-brand-soft text-ink hover:brightness-95",
  outline: "border border-ink/30 bg-paper text-ink hover:bg-paper-gray",
} as const;

interface Props {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  external?: boolean;
  className?: string;
  trackLabel?: string; // 지정하면 클릭이 cta_click 으로 집계됩니다(ClickTracker)
}

// 링크형 버튼 (내부 링크는 next/link, 외부 링크는 새 창 + noopener)
export function ButtonLink({ href, children, variant = "primary", external, className = "", trackLabel }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const t = trackLabel ? { "data-track": "cta", "data-label": trackLabel } : {};
  if (external || href.startsWith("tel:")) {
    return (
      <a href={href} className={cls} {...t} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
        {external && <span className="sr-only"> (새 창으로 열림)</span>}
      </a>
    );
  }
  return <Link href={href} className={cls} {...t}>{children}</Link>;
}
