// 상품 상세 상단의 '핵심 정보' 카드용 데이터 — 화면과 무관한 순수 함수입니다.
// 값은 상품요약서/약관 기준 문구를 그대로 쓰며, 짧은 항목(카드에 들어가는 길이)만 우선순위대로 고릅니다.
export type KeyFact = { label: string; value: string };
type Fact = { label: string; value: string };

export const KEY_FACT_LIMIT = 4;
const MAX_VALUE_LENGTH = 34;

// 같은 의미의 항목명을 한 카드로 묶어, 상품마다 같은 순서로 보이게 합니다.
const PRIORITY: { title: string; labels: string[] }[] = [
  { title: "보험기간", labels: ["보험기간"] },
  { title: "가입나이", labels: ["가입나이", "가입 나이"] },
  { title: "납입", labels: ["납입기간·주기", "납입기간", "납입주기"] },
  { title: "가입금액", labels: ["보험금액(가입금액)", "보험가입금액"] },
  { title: "가입 한도", labels: ["가입 한도", "가입한도"] },
  { title: "건강진단", labels: ["건강진단"] },
  { title: "연금개시나이", labels: ["연금개시나이"] },
];

export function buildKeyFacts(args: { group: string; effectiveDate: string; facts?: Fact[] }): KeyFact[] {
  const out: KeyFact[] = [{ label: "분류", value: `${args.group} 보험` }];
  for (const p of PRIORITY) {
    if (out.length >= KEY_FACT_LIMIT) break;
    const hit = args.facts?.find((f) => p.labels.includes(f.label) && f.value.length <= MAX_VALUE_LENGTH);
    if (hit) out.push({ label: p.title, value: hit.value });
  }
  if (out.length < KEY_FACT_LIMIT) out.push({ label: "고시 시행일", value: args.effectiveDate }); // 항목이 적은 상품은 마지막 칸을 시행일로
  return out;
}
