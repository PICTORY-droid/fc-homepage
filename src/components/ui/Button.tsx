import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex min-h-[48px] items-center justify-center rounded-xl px-6 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const variants = {
  primary: "bg-brand text-ink hover:brightness-95",
  soft: "bg-brand-soft text-ink hover:brightness-95",
  outline: "border border-ink/30 bg-paper text-ink hover:bg-paper-gray",
} as const;

interface Props {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  external?: boolean;
  className?: string;
}

// 링크형 버튼 (내부 링크는 next/link, 외부 링크는 새 창 + noopener)
export function ButtonLink({ href, children, variant = "primary", external, className = "" }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external || href.startsWith("tel:")) {
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
        {external && <span className="sr-only"> (새 창으로 열림)</span>}
      </a>
    );
  }
  return <Link href={href} className={cls}>{children}</Link>;
}
