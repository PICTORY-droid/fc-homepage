// 가계부 항목 정의 — 항목 추가·삭제·이름 변경은 이 파일만 고치면 됩니다. (key 는 중복되면 안 됩니다)
import type { BudgetGroupDef } from "@/lib/calc/budget";

export const budgetGroups: BudgetGroupDef[] = [
  {
    key: "income", title: "① 월 수입", lead: "세금과 보험료 등을 뗀 뒤 실제로 통장에 들어오는 금액을 넣어 주세요.",
    items: [
      { key: "salary", label: "근로·사업 소득 (월 실수령)", help: "월급 또는 사업 소득의 실수령액" },
      { key: "side", label: "부수입 (월)", help: "아르바이트·프리랜서 등 매달 들어오는 돈" },
      { key: "regular", label: "연금·임대 등 정기 수입 (월)" },
      { key: "bonus", label: "상여·성과급 등 1년에 한두 번 받는 수입 (연 합계)", period: "yearly", help: "1년 동안 받는 총액을 넣으면 12로 나눠 월로 바꿔 계산해요." },
    ],
  },
  {
    key: "fixed", title: "② 고정 지출", lead: "매달 거의 같은 금액이 빠져나가는 항목이에요.",
    items: [
      { key: "housing", label: "월세·관리비" },
      { key: "loan", label: "대출 원금·이자 상환", tag: "loan", help: "주택·신용·자동차 대출 등 이번 달에 갚는 금액의 합계" },
      { key: "utilities", label: "전기·가스·수도" },
      { key: "telecom", label: "통신비 (휴대폰·인터넷)" },
      { key: "insurance", label: "보험료 (모든 보험의 월 납입액 합계)", tag: "insurance", help: "자동차보험을 월납으로 내면 여기에 포함하세요." },
      { key: "transportFixed", label: "교통 (정기권·주차·차량 할부)" },
      { key: "subscription", label: "구독·멤버십 (영상·음악·쇼핑 등)" },
      { key: "education", label: "교육·양육비 (학원·어린이집 등 고정분)" },
      { key: "fixedEtc", label: "기타 고정 지출" },
    ],
  },
  {
    key: "variable", title: "③ 변동 지출", lead: "달마다 금액이 달라지는 항목이에요. 최근 몇 달의 평균을 넣으면 편해요.",
    items: [
      { key: "food", label: "식비 (장보기)" },
      { key: "dining", label: "외식·배달·카페" },
      { key: "daily", label: "생활용품" },
      { key: "fuel", label: "주유·택시 등 교통" },
      { key: "medical", label: "의료·약" },
      { key: "culture", label: "문화·여가·취미" },
      { key: "beauty", label: "의류·미용" },
      { key: "social", label: "경조사·모임·선물" },
      { key: "pet", label: "반려동물" },
      { key: "variableEtc", label: "기타 변동 지출" },
    ],
  },
  {
    key: "yearly", title: "④ 1년에 한두 번 나가는 지출", lead: "1년 동안 쓰는 총액을 넣으면 12로 나눠 월 부담으로 계산해요.",
    items: [
      { key: "carTax", label: "자동차세 (연 합계)", period: "yearly" },
      { key: "tax", label: "재산세·종합부동산세 등 세금 (연 합계)", period: "yearly" },
      { key: "holiday", label: "명절·가족 행사 (연 합계)", period: "yearly" },
      { key: "travel", label: "여행·휴가 (연 합계)", period: "yearly" },
      { key: "appliance", label: "가전·가구 교체 (연 합계)", period: "yearly" },
      { key: "annualFee", label: "연회비·갱신비 (연 합계)", period: "yearly" },
      { key: "yearlyEtc", label: "기타 연 1회 지출 (연 합계)", period: "yearly" },
    ],
  },
  {
    key: "saving", title: "⑤ 저축·투자", lead: "쓰지 않고 따로 모으거나 투자하는 돈이에요. 지출이 아니라 저축으로 계산해요.",
    items: [
      { key: "deposit", label: "예금·적금" },
      { key: "pensionSaving", label: "연금저축·개인연금 납입" },
      { key: "invest", label: "주식·펀드 등 투자" },
      { key: "emergencyAdd", label: "비상금 적립" },
      { key: "goal", label: "목돈 마련 (여행·결혼·주택 등)" },
      { key: "savingEtc", label: "기타 저축" },
    ],
  },
];

// 사용법을 보여 주기 위한 예시 숫자 (추천값이 아님)
export const budgetExample: Record<string, string> = {
  salary: "3,000,000", bonus: "1,200,000",
  housing: "700,000", loan: "400,000", utilities: "150,000", telecom: "90,000", insurance: "200,000",
  food: "450,000", dining: "250,000", daily: "100,000", medical: "60,000", culture: "100,000",
  carTax: "300,000", holiday: "600,000", travel: "800,000",
  deposit: "300,000", pensionSaving: "150,000",
  targetPct: "20", emergency: "3,000,000",
};
