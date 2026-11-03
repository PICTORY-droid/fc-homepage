import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./styles";

interface Props {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
  className?: string;
  trackLabel?: string; // 지정하면 클릭이 cta_click 으로 집계됩니다(ClickTracker)
}

// 링크형 버튼 (내부 링크는 next/link, 외부 링크는 새 창 + noopener). 모양은 ui/styles.ts 의 buttonClass 와 같습니다.
export function ButtonLink({ href, children, variant = "primary", size = "md", external, className = "", trackLabel }: Props) {
  const cls = buttonClass(variant, size, className);
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
