"use client";
import { categories } from "@/config/categories";
import { site } from "@/config/site";
import { TIMES, TIME_LABEL } from "@/features/consult/schema";
import { useConsultForm } from "@/features/consult/useConsultForm";

const field = "mt-1 w-full min-h-[48px] rounded-xl border border-ink/25 bg-paper px-4 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";

// 상담 신청 폼 — 화면 표시만 담당 (로직은 useConsultForm, 전송은 features/consult/api.ts)
export function ConsultForm({ initialTopic = "health" }: { initialTopic?: string }) {
  const { values, errors, status, serverMessage, setField, submit } = useConsultForm(initialTopic);

  if (status === "done") {
    return (
      <div role="status" className="rounded-card bg-brand-soft p-8 text-center">
        <p className="text-xl font-bold text-ink">상담 신청이 접수되었습니다.</p>
        <p className="mt-2 text-ink-sub">희망하신 시간에 맞춰 연락드리겠습니다. 급하시면 {site.contact.fcPhone} 로 전화 주세요.</p>
      </div>
    );
  }

  const Err = ({ k }: { k: string }) =>
    errors[k] ? <p role="alert" className="mt-1 text-sm text-alert">{errors[k]}</p> : null;

  return (
    <form
      noValidate
      onSubmit={(e) => { e.preventDefault(); void submit(); }}
      className="space-y-5 rounded-card border border-ink/10 bg-paper p-6 sm:p-8"
    >
      <div>
        <label htmlFor="name" className="font-semibold text-ink">이름</label>
        <input id="name" autoComplete="name" className={field} value={values.name}
          onChange={(e) => setField("name", e.target.value)} aria-invalid={Boolean(errors.name)} />
        <Err k="name" />
      </div>
      <div>
        <label htmlFor="phone" className="font-semibold text-ink">연락처</label>
        <input id="phone" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" className={field}
          value={values.phone} onChange={(e) => setField("phone", e.target.value)} aria-invalid={Boolean(errors.phone)} />
        <Err k="phone" />
      </div>
      <div>
        <label htmlFor="age" className="font-semibold text-ink">가입 대상 연령 (만 나이) <span className="text-alert">*</span></label>
        <input id="age" inputMode="numeric" placeholder="예: 8" className={field} value={values.age}
          onChange={(e) => setField("age", e.target.value)} aria-invalid={Boolean(errors.age)} aria-describedby="age-help" />
        <p id="age-help" className="mt-1 text-sm text-ink-sub">가입하실 분(부모님 또는 자녀)의 나이를 입력해 주세요.</p>
        <Err k="age" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="topic" className="font-semibold text-ink">관심 분야</label>
          <select id="topic" className={field} value={values.topic} onChange={(e) => setField("topic", e.target.value as typeof values.topic)}>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
            <option value="other">기타 / 잘 모르겠어요</option>
          </select>
          <Err k="topic" />
        </div>
        <div>
          <label htmlFor="time" className="font-semibold text-ink">연락 희망 시간</label>
          <select id="time" className={field} value={values.time} onChange={(e) => setField("time", e.target.value as typeof values.time)}>
            {TIMES.map((t) => <option key={t} value={t}>{TIME_LABEL[t]}</option>)}
          </select>
          <Err k="time" />
        </div>
      </div>

      {/* 스팸 방지용 숨김 입력: 사람에게는 보이지 않음 */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>웹사이트<input tabIndex={-1} autoComplete="off" value={values.website}
          onChange={(e) => setField("website", e.target.value)} /></label>
      </div>

      <div className="rounded-xl bg-paper-card p-4 text-sm text-ink-sub">
        <p className="font-semibold text-ink">개인정보 수집·이용 안내</p>
        <p>목적: {site.privacy.purpose} / 항목: {site.privacy.items}</p>
        <p><a className="underline" href="/privacy" target="_blank" rel="noopener noreferrer">자세히 보기<span className="sr-only"> (새 창으로 열림)</span></a></p>
        <label className="mt-3 flex min-h-[44px] items-center gap-3 text-ink">
          <input type="checkbox" className="h-5 w-5 accent-brand" checked={Boolean(values.consent)}
            onChange={(e) => setField("consent", e.target.checked as unknown as true)} />
          개인정보 수집·이용에 동의합니다. (필수)
        </label>
        <Err k="consent" />
      </div>

      {status === "error" && <p role="alert" className="text-alert">{serverMessage}</p>}
      <button type="submit" disabled={status === "submitting"}
        className="min-h-[52px] w-full rounded-xl bg-brand text-lg font-bold text-ink hover:brightness-95 disabled:opacity-60">
        {status === "submitting" ? "접수 중..." : "상담 신청하기"}
      </button>
      <p className="text-center text-xs text-ink-sub">{site.notices.promise}</p>
    </form>
  );
}
