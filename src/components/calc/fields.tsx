import type { ReactNode } from "react";

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

export function CalcShell({ id, title, lead, children }: { id: string; title: string; lead: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="rounded-card border border-ink/10 bg-paper p-6 sm:p-8">
      <h2 id={`${id}-title`} className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-ink-sub sm:text-base">{lead}</p>
      <div className="mt-6">{children}</div>
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
