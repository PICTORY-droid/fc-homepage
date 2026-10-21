// 홈 첫 화면 움직이는 배너 — 5장. 장 수·순서·색은 여기서만 바꿉니다.
// 문구(상품명·제목·설명)는 config/banners.ts 의 같은 key 배너를 그대로 씁니다. (심의 후 한 곳에서만 수정)
import type { BannerKey } from "@/config/banners";

export type HeroArtKey = "shield" | "balloon" | "heart" | "sunrise" | "envelope";

export interface HeroTheme {
  from: string; // 배경 그라데이션 시작(맑고 연한 색)
  to: string; // 배경 그라데이션 끝
  soft: string; // 그림 뒤 큰 원
  accent: string; // 버튼·포인트 색
  deep: string; // 글자용 진한 색(대비 확보)
}

export interface HeroSlideConfig {
  id: string;
  bannerKey: BannerKey;
  art: HeroArtKey;
  theme: HeroTheme;
}

export const HERO_INTERVAL_MS = 4500;

export const heroSlides: HeroSlideConfig[] = [
  { id: "family", bannerKey: "home", art: "shield", theme: { from: "#DCEEFF", to: "#F8FBFF", soft: "#BFE0FF", accent: "#3D8BEB", deep: "#1B4F94" } },
  { id: "kids", bannerKey: "kids", art: "balloon", theme: { from: "#D9F5EA", to: "#F7FFFB", soft: "#B4EBD3", accent: "#25B58C", deep: "#0F6E55" } },
  { id: "mom", bannerKey: "mom", art: "heart", theme: { from: "#FFE2EE", to: "#FFF8FB", soft: "#FFC4DD", accent: "#E5599A", deep: "#A2275F" } },
  { id: "pension", bannerKey: "pension", art: "sunrise", theme: { from: "#E9E2FF", to: "#FAF8FF", soft: "#D3C7FF", accent: "#7C5CE6", deep: "#4A2FA8" } },
  { id: "saving", bannerKey: "saving", art: "envelope", theme: { from: "#FFE1E1", to: "#FFF9F9", soft: "#FFC2C4", accent: "#E03A44", deep: "#9E1B24" } },
];
