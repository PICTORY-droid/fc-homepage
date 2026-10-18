// 날짜 계산 (시간대 영향이 없도록 연/월/일 숫자로만 다룹니다)
export interface Ymd { y: number; m: number; d: number }

export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

export function isValidYmd(v: Ymd): boolean {
  return Number.isInteger(v.y) && Number.isInteger(v.m) && Number.isInteger(v.d)
    && v.y >= 1800 && v.y <= 2200 && v.m >= 1 && v.m <= 12 && v.d >= 1 && v.d <= daysInMonth(v.y, v.m);
}

export function parseYmd(s: string): Ymd | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((s ?? "").trim());
  if (!m) return null;
  const v = { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
  return isValidYmd(v) ? v : null;
}

export const formatYmd = (v: Ymd) => `${v.y}-${String(v.m).padStart(2, "0")}-${String(v.d).padStart(2, "0")}`;

export const cmpYmd = (a: Ymd, b: Ymd) => (a.y - b.y) || (a.m - b.m) || (a.d - b.d);

// n개월 뒤(음수 가능). 날짜가 없는 달이면 그 달 말일로 맞춥니다. (예: 8/31 + 6개월 = 2/28)
export function addMonths(v: Ymd, n: number): Ymd {
  const total = v.y * 12 + (v.m - 1) + n;
  const y = Math.floor(total / 12);
  const m = total - y * 12 + 1;
  return { y, m, d: Math.min(v.d, daysInMonth(y, m)) };
}

const dayNumber = (v: Ymd) => Date.UTC(v.y, v.m - 1, v.d) / 86_400_000;
export const diffDays = (from: Ymd, to: Ymd) => Math.round(dayNumber(to) - dayNumber(from));

// 오늘 날짜(한국 시간 기준)
export function todayKst(now: Date = new Date()): Ymd {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(now);
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}
