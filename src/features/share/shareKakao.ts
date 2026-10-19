"use client";
// 공유 로직 — 카카오 공유(JS 키가 있을 때) → 기기 공유창(휴대폰의 카카오톡 포함) → 주소 복사 순으로 시도합니다.
// 카카오 JS 키는 환경변수 NEXT_PUBLIC_KAKAO_JS_KEY (Kakao Developers 의 '플랫폼 > Web'에 사이트 주소 등록 필요). 화면은 이 파일만 부릅니다.
export type ShareResult = "kakao" | "native" | "copied" | "failed";

const SDK = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
type KakaoSdk = { isInitialized(): boolean; init(k: string): void; Share: { sendDefault(o: unknown): void } };
const sdk = () => (window as unknown as { Kakao?: KakaoSdk }).Kakao;

function loadKakao(key: string): Promise<KakaoSdk | null> {
  return new Promise((resolve) => {
    const ready = () => { const k = sdk(); if (!k) return resolve(null); if (!k.isInitialized()) k.init(key); resolve(k); };
    if (sdk()) return ready();
    const s = document.createElement("script");
    s.src = SDK; s.async = true; s.crossOrigin = "anonymous"; s.onload = ready; s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
}

const meta = (p: string) => document.querySelector<HTMLMetaElement>(`meta[property="${p}"]`)?.content ?? "";

export async function sharePage(): Promise<ShareResult> {
  const url = location.origin + location.pathname; // 쿼리(유입 표시 등)는 빼고 공유
  const title = document.title;
  const description = meta("og:description");
  const image = meta("og:image");
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  try {
    if (key) {
      const k = await loadKakao(key);
      if (k) {
        k.Share.sendDefault({ objectType: "feed", content: { title, description, imageUrl: image, link: { mobileWebUrl: url, webUrl: url } }, buttons: [{ title: "자료 보러 가기", link: { mobileWebUrl: url, webUrl: url } }] });
        return "kakao";
      }
    }
    if (navigator.share) { await navigator.share({ title, text: description, url }); return "native"; }
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch (e) {
    if ((e as Error)?.name === "AbortError") return "native"; // 사용자가 공유창을 닫음
    return "failed";
  }
}
