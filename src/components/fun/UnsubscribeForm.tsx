"use client";
import { useNewsletterForm } from "@/features/newsletter/useNewsletterForm";
import { buttonClass, inputClass } from "@/components/ui/styles";

const input = `mt-1 ${inputClass}`;

// 새 양식 알림 해지 — 연락처를 입력하면 수신 거부로 처리합니다. (가입 여부는 알려 주지 않음)
export function UnsubscribeForm() {
  const f = useNewsletterForm("unsubscribe", "/unsubscribe");
  if (f.status === "done") return <p role="status" className="rounded-card bg-brand-soft p-5 text-ink">수신 거부가 처리됐어요. 더 이상 알림을 보내지 않습니다.</p>;
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); void f.submit(); }} className="max-w-sm space-y-3">
      <div>
        <label htmlFor="un-phone" className="font-semibold text-ink">알림을 받던 연락처</label>
        <input id="un-phone" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" className={input} value={f.phone} onChange={(e) => f.setPhone(e.target.value)} aria-invalid={Boolean(f.error)} />
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true"><label>웹사이트<input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => f.setWebsite(e.target.value)} /></label></div>
      {f.error && <p role="alert" className="text-sm text-alert">{f.error}</p>}
      <button type="submit" disabled={f.status === "submitting"} className={buttonClass("primary", "md", "w-full")}>
        {f.status === "submitting" ? "처리 중..." : "알림 받지 않기"}
      </button>
    </form>
  );
}
