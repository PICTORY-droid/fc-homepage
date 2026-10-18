import type { ReactNode } from "react";
import type { Product } from "@/config/products";
import { ArtCard } from "./ArtCard";
import { HealthClinicArt } from "./HealthClinicArt";
import { COMPOSITIONS } from "./compositions";

// 상품별 움직이는 일러스트 — 등록된 상품만 일러스트 카드로 보이고, 나머지는 기존 안내 이미지를 씁니다.
const ART: Record<string, () => ReactNode> = {
  ...COMPOSITIONS,
  P002: () => <HealthClinicArt />,
};

/** 카드 문구 없이 그림만 필요할 때(예: 메인의 TOP 2 카드) */
export function renderProductScene(id: string): ReactNode | null {
  const art = ART[id];
  return art ? art() : null;
}

export function renderProductArt(p: Product): ReactNode | null {
  const art = ART[p.id];
  if (!art) return null;
  return <ArtCard name={p.displayName} headline={p.slogan?.headline} tags={p.slogan?.tags}>{art()}</ArtCard>;
}
