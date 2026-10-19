"use client";
import { site } from "@/config/site";
import { track } from "@/features/analytics/track";
import { newsletterConsentText } from "@/features/newsletter/consentText";
import { useNewsletterForm } from "@/features/newsletter/useNewsletterForm";

const input = "mt-1 w-full min-h-[48px] rounded-xl border border-ink/25 bg-paper px-4 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";

// 자료 받기 페이지 끝의 '새 양식 알림(선택)' — 체크하면 연락처 입력칸이 열립니다. 동의 문구는 features/newsletter/consentText.ts 에서 옵니다.
export function NewsletterOptIn({ from }: { from: string }) {
  const f = useNewsletterForm("subscribe", from);
  const open = f.consent;
  const note = newsletterConsentText({
    channel: site.newsletter.channel, retentionMonths: site.newsletter.retentionMonths, unsubscribePath: "/unsubscribe", contactPhone: site.contact.fcPhone,
  });

  if (f.status === "done") {
    return <aside role="status" className="rounded-card border border-ink/10 bg-paper-card p-5 text-ink">알림 신청이 접수됐어요. 새 양식이 나오면 알려 드릴게요. 해지는 언제든 <a className="font-semibold underline" href="/unsubscribe">여기</a>에서 하실 수 있어요.</aside>;
  }
  return (
    <aside aria-label="새 양식 알림" className="rounded-card border border-ink/10 bg-paper-card p-5">
      <form noValidate onSubmit={(e) => { e.preventDefault(); void f.submit().then(() => track("newsletter_optin", from)); }}>
        <label className="flex min-h-[44px] cursor-pointer items-center gap-3 font-semibold text-ink">
          <input type="checkbox" className="h-5 w-5 accent-brand" checked={f.consent} onChange={(e) => f.setConsent(e.target.checked)} aria-describedby="nl-note" />
          새 양식이 나오면 알려드릴까요? (선택)
        </label>
        <p id="nl-note" className="mt-1 pl-8 text-xs leading-relaxed text-ink-sub">{note}</p>
        {open && (
          <div className="mt-4 max-w-sm pl-8">
            <label htmlFor="nl-phone" className="text-sm font-semibold text-ink">받으실 연락처</label>
            <input id="nl-phone" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" className={input} value={f.phone}
              onChange={(e) => f.setPhone(e.target.value)} aria-invalid={Boolean(f.error)} />
            <div className="absolute -left-[9999px]" aria-hidden="true"><label>웹사이트<input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => f.setWebsite(e.target.value)} /></label></div>
            {f.error && <p role="alert" className="mt-1 text-sm text-alert">{f.error}</p>}
            <button type="submit" disabled={f.status === "submitting"} className="mt-3 min-h-[48px] w-full rounded-xl bg-brand text-base font-bold text-ink hover:brightness-95 disabled:opacity-60">
              {f.status === "submitting" ? "접수 중..." : "알림 신청하기"}
            </button>
          </div>
        )}
      </form>
    </aside>
  );
}
