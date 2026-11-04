// 보안 헤더 중앙 관리 — 문제가 생기면 이 파일만 확인하세요.
const isDev = process.env.NODE_ENV !== "production";

// 외부에서 불러오는 곳은 카카오 공유 SDK뿐입니다. 새 외부 스크립트·연결을 쓰면 아래 목록에 도메인을 추가하세요.
// 'unsafe-inline' 은 Next.js 가 페이지마다 넣는 초기화 스크립트 때문에 필요합니다(정적 페이지 속도를 지키기 위해 nonce 대신 사용).
const KAKAO = ["https://t1.kakaocdn.net", "https://*.kakao.com"];
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${KAKAO.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.kakaocdn.net",
  "font-src 'self' data:",
  `connect-src 'self' ${KAKAO.join(" ")}`,
  `frame-src ${KAKAO.join(" ")}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
