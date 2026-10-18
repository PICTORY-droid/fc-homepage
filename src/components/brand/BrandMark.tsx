import Image from "next/image";
import { site } from "@/config/site";

// 로고 자리 — 기본은 '방패+체크' 자체 제작 마크(우체국 CI 아님).
// 승인받은 공식 로고 파일을 쓰려면 public/ 에 넣고 config/site.ts 의 logo.src 만 바꾸세요.
export function BrandMark({ size = 40 }: { size?: number }) {
  if (site.logo.src) {
    return <Image src={site.logo.src} alt={site.logo.alt} width={size * 3} height={size} priority />;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="보험 상담 마크">
      <rect width="40" height="40" rx="10" fill="#FF883A" />
      <path d="M20 7.5 31 11.5v8.2c0 6.3-4.3 10.8-11 13.3-6.7-2.5-11-7-11-13.3v-8.2L20 7.5Z" fill="#fff" />
      <path d="m14.5 19.8 4 4 7.5-8" fill="none" stroke="#C4540A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
