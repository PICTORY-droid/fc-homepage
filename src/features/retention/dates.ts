// 보관 기간 계산 — 날짜 계산만 합니다(DB·메일과 무관). 모든 날짜는 UTC 기준 ISO 문자열을 받습니다.
const DAY = 86_400_000;

/** 접수일로부터 보관 기간(개월)이 끝나는 날 */
export function expiryDate(createdAt: string | Date, months: number): Date {
  const d = new Date(createdAt);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
}

/** 만료까지 남은 일수(지났으면 음수) */
export const daysLeft = (expiry: Date, now: Date): number => Math.ceil((expiry.getTime() - now.getTime()) / DAY);

/** 지금 알려야 하는지: 만료 noticeDays 일 전부터(이미 지난 것 포함) */
export const isDue = (createdAt: string | Date, months: number, noticeDays: number, now: Date): boolean =>
  daysLeft(expiryDate(createdAt, months), now) <= noticeDays;

/** 접수일 기준으로 '이 날짜(이전)에 접수된 건이 알림 대상' 인 경계 시각 — DB 조회용 */
export function dueCutoff(months: number, noticeDays: number, now: Date): Date {
  const d = new Date(now.getTime() + noticeDays * DAY);
  d.setUTCMonth(d.getUTCMonth() - months);
  return d;
}

const kst = (d: Date) => new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(d).replace(/\.\s?/g, ".").replace(/\.$/, "");
export const formatKstDate = (d: string | Date) => kst(new Date(d));
