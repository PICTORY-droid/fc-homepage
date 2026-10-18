// 계산기 공통: 결과 타입 + 입력값 검증 도우미 (화면과 무관한 순수 함수)
export type FieldErrors = Record<string, string>;
export type Outcome<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

export interface NumOptions {
  label: string;
  min?: number;
  max?: number;
  integer?: boolean;
  required?: boolean; // 기본 true
}

type NumResult = { ok: true; value: number | null } | { ok: false; error: string };

// 문자열 → 숫자. 쉼표/공백 제거, 빈 값은 required 에 따라 오류 또는 null
export function parseNum(raw: string, o: NumOptions): NumResult {
  const s = (raw ?? "").replace(/[,\s]/g, "");
  if (s === "") return o.required === false ? { ok: true, value: null } : { ok: false, error: `${o.label}을(를) 입력해 주세요.` };
  if (!/^-?\d+(\.\d+)?$/.test(s)) return { ok: false, error: `${o.label}은(는) 숫자로 입력해 주세요.` };
  const n = Number(s);
  if (!Number.isFinite(n)) return { ok: false, error: `${o.label}을(를) 확인해 주세요.` };
  if (o.integer && !Number.isInteger(n)) return { ok: false, error: `${o.label}은(는) 정수로 입력해 주세요.` };
  if (o.min !== undefined && n < o.min) return { ok: false, error: `${o.label}은(는) ${o.min.toLocaleString("ko-KR")} 이상이어야 합니다.` };
  if (o.max !== undefined && n > o.max) return { ok: false, error: `${o.label}은(는) ${o.max.toLocaleString("ko-KR")} 이하여야 합니다.` };
  return { ok: true, value: n };
}

// 여러 필드를 한 번에 검증해 값/오류를 모아 줍니다.
export function collect<K extends string>(
  raws: Record<K, string>,
  specs: Record<K, NumOptions>,
): { values: Record<K, number | null>; errors: FieldErrors } {
  const values = {} as Record<K, number | null>;
  const errors: FieldErrors = {};
  (Object.keys(specs) as K[]).forEach((k) => {
    const r = parseNum(raws[k], specs[k]);
    if (r.ok) values[k] = r.value; else { errors[k] = r.error; values[k] = null; }
  });
  return { values, errors };
}

export const fail = (errors: FieldErrors): { ok: false; errors: FieldErrors } => ({ ok: false, errors });
export const succeed = <T,>(value: T): { ok: true; value: T } => ({ ok: true, value });
