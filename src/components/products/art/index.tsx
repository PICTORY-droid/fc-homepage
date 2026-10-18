import type { ReactNode } from "react";
import type { Product } from "@/config/products";
import { ArtCard } from "./ArtCard";
import { HealthClinicArt } from "./HealthClinicArt";

// 상품별 움직이는 일러스트 — 등록된 상품만 일러스트 카드로 보이고, 나머지는 기존 안내 이미지를 씁니다.
const ART: Record<string, () => ReactNode> = {
  P002: () => <HealthClinicArt />,
};

export function renderProductArt(p: Product): ReactNode | null {
  const art = ART[p.id];
  if (!art) return null;
  return <ArtCard name={p.displayName} headline={p.slogan?.headline} tags={p.slogan?.tags}>{art()}</ArtCard>;
}
