"use client";

// 최상위 레이아웃까지 실패했을 때의 마지막 안내 화면 (자체 html/body 필요, 외부 의존 없이 동작)
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1.5rem", color: "#333", wordBreak: "keep-all" }}>
        <h1 style={{ fontSize: "1.5rem" }}>잠시 접속이 원활하지 않아요</h1>
        <p style={{ marginTop: "0.75rem", color: "#666" }}>잠시 후 다시 시도해 주세요. 급하시면 전화로 문의해 주세요.</p>
        <button onClick={reset} style={{ marginTop: "1.5rem", minHeight: 48, padding: "0 1.5rem", borderRadius: 12, border: 0, background: "#FF883A", fontWeight: 700 }}>
          다시 시도
        </button>
      </body>
    </html>
  );
}
