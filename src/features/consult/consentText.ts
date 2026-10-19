// 상담 신청 폼의 개인정보 동의 안내 문구 — 법정 고지 4가지(수집 항목·목적·보유 기간·거부 권리)를 짧게 한 문단으로 만듭니다.
// 자세한 내용은 /privacy 에 있으며, 보유 기간은 config/site.ts 의 privacy.retentionMonths 를 따릅니다.
export function consentNote(retentionMonths: number | null): string {
  const keep = retentionMonths ? `상담 종료 후 ${retentionMonths}개월간 보관한 뒤 파기합니다.` : "목적이 달성되면 지체 없이 파기합니다.";
  return `상담 회신과 진행을 위해 이름·연락처·궁금한 점·관심 분야(선택 입력 시 연령·희망 시간)를 수집하며, ${keep} 동의하지 않으셔도 되지만 온라인 상담 신청은 어렵습니다.`;
}
