// 표시용 숫자 서식 — 계산 로직과 분리
const nf = new Intl.NumberFormat("ko-KR");
export const formatWon = (n: number) => `${nf.format(Math.round(n))}원`;
export const formatNum = (n: number) => nf.format(n);

// 큰 금액을 읽기 쉽게(만 원 단위 반올림): 1억 2,345만 원
export function formatWonKorean(n: number): string {
  if (Math.round(n) < 10_000) return formatWon(n);
  const v = Math.round(n / 10_000) * 10_000; // 만 원 단위로 반올림 (표시용)
  const eok = Math.floor(v / 100_000_000);
  const man = Math.floor((v % 100_000_000) / 10_000);
  return `${eok ? `${nf.format(eok)}억 ` : ""}${man ? `${nf.format(man)}만 ` : ""}원`.replace(/\s+/g, " ").trim();
}
