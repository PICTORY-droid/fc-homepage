import type { Config } from "tailwindcss";

// 색상은 우체국보험 사이트 화면에서 측정한 값을 기반으로 함 (docs/HARNESS.md 참고)
// 화면에 쓰는 색은 모두 여기 이름으로만 씁니다 — 컴포넌트에 #색상값을 직접 적지 않아요. (버튼·카드·알약 모양은 src/components/ui/styles.ts)
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#FF883A", soft: "#FFDAC1", deep: "#C4540A", tint: "#FFF4EC", red: "#D9432F" },
        ink: { DEFAULT: "#333333", sub: "#666666" },
        paper: { DEFAULT: "#FFFFFF", card: "#F9F9F9", gray: "#EFEFEF" },
        alert: "#F31900",
        // 카카오톡 버튼·배너 (카카오 공식 노란색)
        kakao: { DEFAULT: "#FEE500", ink: "#191919", soft: "#FFF6BF", pale: "#FFFAE0" },
      },
      fontFamily: {
        sans: ['"Pretendard"', '"Malgun Gothic"', '"Apple SD Gothic Neo"', "system-ui", "sans-serif"],
      },
      // compact: 안내 도우미(챗봇)처럼 좁은 창 안의 작은 글자
      fontSize: { compact: ["13px", { lineHeight: "1.45" }] },
      borderRadius: { card: "16px" },
    },
  },
  plugins: [],
};
export default config;
