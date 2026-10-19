import type { Metadata } from "next";

// 즐길거리 페이지 공통 메타데이터 — 검색어에 가까운 제목, 정규 주소, 페이지별 공유 미리보기(OG) 이미지를 한 곳에서 만듭니다.
// 이미지는 scripts/fun/og/make_og.mjs 가 public/og/fun/<키>.jpg 로 만들며, 키 규칙은 아래 ogKey 와 같아야 합니다.
export const ogImagePath = (key: string) => `/og/fun/${key}.jpg`;

/** 묶음/항목 → 실제 사람들이 검색하는 말 (예: "돌잔치 PPT 무료") */
export const searchTitles: Record<string, string> = {
  "excel/ledger": "가계부 엑셀 양식 무료", "excel/policy": "보험 증권 정리표 엑셀 무료", "excel/saving": "월 저축 플래너 엑셀 무료",
  "excel/gift": "경조사비 장부 엑셀 무료", "excel/allowance": "용돈기입장 엑셀 무료", "excel/quote": "견적서 엑셀 양식 무료",
  "ppt/talk": "발표 PPT 템플릿 무료", "ppt/family": "가족 소개 PPT 무료", "ppt/birthday": "돌잔치 PPT 무료",
  "ppt/wedding": "결혼식 PPT 무료", "ppt/review": "보험 보장 점검 PPT 양식", "ppt/news": "카드뉴스 PPT 템플릿 무료",
};

export interface FunMetaInput { title: string; description: string; path: string; ogKey: string }

export function funMetadata({ title, description, path, ogKey }: FunMetaInput): Metadata {
  const image = { url: ogImagePath(ogKey), width: 1200, height: 630, alt: title };
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "ko_KR", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
