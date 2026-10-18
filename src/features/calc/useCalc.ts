"use client";
import { useCallback, useState } from "react";
import type { FieldErrors, Outcome } from "@/lib/calc/result";

// 계산기 공통 상태 — 입력값/오류/결과만 관리하고 계산은 lib/calc 의 순수 함수에 맡깁니다.
export function useCalc<Raw extends { [K in keyof Raw]: string }, Res>(
  initial: Raw,
  compute: (raw: Raw) => Outcome<Res>,
) {
  const [values, setValues] = useState<Raw>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<Res | null>(null);

  const setField = useCallback(<K extends keyof Raw>(key: K, value: Raw[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => { if (!e[key as string]) return e; const { [key as string]: _drop, ...rest } = e; return rest; });
  }, []);

  const submit = useCallback(() => {
    const out = compute(values);
    if (out.ok) { setErrors({}); setResult(out.value); } else { setErrors(out.errors); setResult(null); }
  }, [compute, values]);

  const reset = useCallback(() => { setValues(initial); setErrors({}); setResult(null); }, [initial]);

  return { values, errors, result, setField, submit, reset };
}
