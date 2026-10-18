import { useEffect, useRef, useState, type ReactNode } from "react";

// 계산기 공통 UI 조각 — 표시만 담당
export const inputCls =
  "mt-1 w-full min-h-[48px] rounded-xl border border-ink/25 bg-paper px-4 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";

interface FieldProps {
  id: string; label: string; error?: string; help?: string; children: ReactNode;
}
export function Field({ id, label, error, help, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="font-semibold text-ink">{label}</label>
      {children}
      {help && <p id={`${id}-help`} className="mt-1 text-sm text-ink-sub">{help}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-alert">{error}</p>}
    </div>
  );
}

interface TextProps {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; help?: string; placeholder?: string; type?: "text" | "date"; inputMode?: "numeric" | "decimal";
  unit?: string;
}
export function TextField({ id, label, value, onChange, error, help, placeholder, type = "text", inputMode, unit }: TextProps) {
  return (
    <Field id={id} label={label} error={error} help={help}>
      <div className="flex items-center gap-2">
        <input id={id} type={type} inputMode={type === "text" ? inputMode ?? "numeric" : undefined} placeholder={placeholder}
          className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)} aria-describedby={[help ? `${id}-help` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined} />
        {unit && <span className="mt-1 shrink-0 text-ink-sub">{unit}</span>}
      </div>
    </Field>
  );
}

interface SelectProps {
  id: string; label: string; value: string; onChange: (v: string) => void;
  options: [string, string][]; error?: string;
}
export function SelectField({ id, label, value, onChange, options, error }: SelectProps) {
  return (
    <Field id={id} label={label} error={error}>
      <select id={id} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </Field>
  );
}

// 접고 펼 수 있는 계산기 카드. 접어도 안의 입력값은 유지됩니다. (닫힐 때 숨기기만 하고 지우지 않음)
export function CalcShell({ id, title, lead, children, defaultOpen = false }: {
  id: string; title: string; lead: string; children: ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  // 바로가기(#id) 링크나 주소의 #id 로 들어오면 해당 계산기를 펼칩니다.
  useEffect(() => {
    const openIfHash = () => {
      if (window.location.hash !== `#${id}`) return;
      setOpen(true);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.(`a[href="#${id}"]`)) setOpen(true);
    };
    openIfHash();
    window.addEventListener("hashchange", openIfHash);
    document.addEventListener("click", onClick);
    return () => { window.removeEventListener("hashchange", openIfHash); document.removeEventListener("click", onClick); };
  }, [id]);

  return (
    <section id={id} className="scroll-mt-24 rounded-card border border-ink/10 bg-paper">
      <h2>
        <button type="button" aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => setOpen((o) => !o)}
          className="flex min-h-[64px] w-full items-center justify-between gap-4 rounded-card px-6 py-5 text-left sm:px-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
          <span className="text-xl font-bold text-ink sm:text-2xl">{title}</span>
          <span className="shrink-0 rounded-full bg-paper-gray px-3 py-1 text-sm font-semibold text-ink">
            {open ? "접기 ▲" : "클릭하여 열기 ▼"}
          </span>
        </button>
      </h2>
      <p className="px-6 pb-4 text-sm text-ink-sub sm:px-8 sm:text-base">{lead}</p>
      <div id={`${id}-panel`} hidden={!open} className="px-6 pb-6 sm:px-8 sm:pb-8">{children}</div>
    </section>
  );
}

export function Buttons({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex gap-3">
      <button type="submit" className="min-h-[52px] flex-1 rounded-xl bg-brand text-lg font-bold text-ink hover:brightness-95">계산하기</button>
      <button type="button" onClick={onReset} className="min-h-[52px] rounded-xl border border-ink/30 bg-paper px-5 font-semibold text-ink hover:bg-paper-gray">처음부터</button>
    </div>
  );
}

export function ResultBox({ children }: { children: ReactNode }) {
  return <div role="status" aria-live="polite" className="mt-6 rounded-card bg-brand-soft/60 p-5">{children}</div>;
}

export function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-2 last:border-0">
      <dt className="text-sm text-ink-sub">{label}</dt>
      <dd className={strong ? "text-lg font-extrabold text-ink" : "font-semibold text-ink"}>{value}</dd>
    </div>
  );
}

// 날짜 입력: 연·월·일을 직접 입력 (브라우저 기본 달력은 생년월일 연도 선택이 불편해서 사용하지 않음)
// 값은 완성되면 "yyyy-mm-dd", 미완성이면 "" 로 부모에 전달합니다.
interface DateProps { id: string; label: string; value: string; onChange: (v: string) => void; error?: string; help?: string }
const digits = (s: string, max: number) => s.replace(/\D/g, "").slice(0, max);
const compose = (p: { y: string; m: string; d: string }) =>
  p.y.length === 4 && p.m && p.d ? `${p.y}-${p.m.padStart(2, "0")}-${p.d.padStart(2, "0")}` : "";

export function DateField({ id, label, value, onChange, error, help }: DateProps) {
  const [parts, setParts] = useState({ y: "", m: "", d: "" });
  const mRef = useRef<HTMLInputElement>(null);
  const dRef = useRef<HTMLInputElement>(null);

  // 부모에서 값이 바뀐 경우(오늘 날짜 자동 입력, 처음부터)에만 입력칸을 맞춥니다.
  useEffect(() => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    setParts((p) => {
      if (compose(p) === value) return p;
      return m ? { y: m[1], m: m[2], d: m[3] } : value === "" ? { y: "", m: "", d: "" } : p;
    });
  }, [value]);

  const update = (next: typeof parts) => { setParts(next); onChange(compose(next)); };
  const box = `${inputCls} text-center`;
  const describedBy = [help ? `${id}-help` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="font-semibold text-ink">{label}</legend>
      <div className="flex items-center gap-2">
        <input id={id} inputMode="numeric" autoComplete="off" placeholder="1990" maxLength={4} aria-label={`${label} 연도`} aria-invalid={Boolean(error)}
          className={`${box} min-w-0 flex-[2]`} value={parts.y}
          onChange={(e) => { const y = digits(e.target.value, 4); update({ ...parts, y }); if (y.length === 4) mRef.current?.focus(); }} />
        <span className="mt-1 text-ink-sub">년</span>
        <input ref={mRef} inputMode="numeric" autoComplete="off" placeholder="12" maxLength={2} aria-label={`${label} 월`} aria-invalid={Boolean(error)}
          className={`${box} min-w-0 flex-1`} value={parts.m}
          onChange={(e) => { const m = digits(e.target.value, 2); update({ ...parts, m }); if (m.length === 2 || Number(m) > 1) dRef.current?.focus(); }} />
        <span className="mt-1 text-ink-sub">월</span>
        <input ref={dRef} inputMode="numeric" autoComplete="off" placeholder="1" maxLength={2} aria-label={`${label} 일`} aria-invalid={Boolean(error)}
          className={`${box} min-w-0 flex-1`} value={parts.d}
          onChange={(e) => update({ ...parts, d: digits(e.target.value, 2) })} />
        <span className="mt-1 text-ink-sub">일</span>
      </div>
      {help && <p id={`${id}-help`} className="mt-1 text-sm text-ink-sub">{help}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-alert">{error}</p>}
    </fieldset>
  );
}
