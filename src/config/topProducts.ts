// '우체국보험 판매량 TOP 2' — 우체국보험 공식 사이트(보험상품 > 추천)의 '보험 판매량 Top 2' 표시를 따름.
// 순위/상품은 공식 사이트가 바뀌면 달라지므로, 갱신할 때 asOf(확인일)도 함께 바꾸세요.
// 주의: '대한민국'처럼 전국 순위로 오해될 표현은 쓰지 않습니다 (우체국보험 내 순위).
export interface TopProduct {
  rank: 1 | 2;
  name: string;
  tags: string[];
  topic: "saving" | "pension"; // 상담 신청 시 미리 선택될 분야
  detailPath: string; // 이 사이트의 상품 상세 페이지
}

export const topProducts = {
  title: "우체국보험 TOP 2",
  asOf: "2026-10-18",
  source: "우체국보험 공식 사이트 '보험 판매량 Top 2' 표시 기준",
  note: "순위와 상품은 공식 사이트 기준이며 변경될 수 있습니다. 집계 기간 등 자세한 내용은 공식 사이트에서 확인하세요.",
  items: [
    {
      rank: 1,
      name: "무배당 파워적립보험 2504 (1종 만기목돈형)",
      tags: ["단기", "재테크", "절세", "중도인출"],
      topic: "saving",
      detailPath: "/products/P035",
    },
    {
      rank: 2,
      name: "우체국연금보험 2504",
      tags: ["연금", "은퇴", "재테크", "유배당"],
      topic: "pension",
      detailPath: "/products/P041",
    },
  ] as TopProduct[],
};
