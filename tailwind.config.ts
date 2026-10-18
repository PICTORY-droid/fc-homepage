import type { Config } from "tailwindcss";

// 색상은 우체국보험 사이트 화면에서 측정한 값을 기반으로 함 (docs/HARNESS.md 참고)
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#FF883A", soft: "#FFDAC1", deep: "#C4540A" },
        ink: { DEFAULT: "#333333", sub: "#666666" },
        paper: { DEFAULT: "#FFFFFF", card: "#F9F9F9", gray: "#EFEFEF" },
        alert: "#F31900",
      },
      fontFamily: {
        sans: ['"Pretendard"', '"Malgun Gothic"', '"Apple SD Gothic Neo"', "system-ui", "sans-serif"],
      },
      borderRadius: { card: "16px" },
    },
  },
  plugins: [],
};
export default config;
