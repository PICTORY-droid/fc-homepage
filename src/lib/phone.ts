// 전화번호 처리 — 입력 보정(하이픈 자동)과 검증은 여기서만 합니다.
export const onlyDigits = (v: string) => v.replace(/\D/g, "");

/** 숫자만 받아 하이픈 형식으로 변환 (010-0000-0000, 02-0000-0000, 055-000-0000) */
export function formatPhone(input: string): string {
  const d = onlyDigits(input).slice(0, 11);
  if (d.startsWith("02")) {
    if (d.length <= 2) return d;
    if (d.length <= 6) return `${d.slice(0, 2)}-${d.slice(2)}`;
    if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}`;
  }
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
}

export const isValidKoreanPhone = (v: string) => /^0\d{8,10}$/.test(onlyDigits(v));
