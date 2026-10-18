"use client";
import { useEffect, useRef } from "react";
import { categories } from "@/config/categories";
import { site } from "@/config/site";
import { TIMES, TIME_LABEL } from "@/features/consult/schema";
import { STEPS } from "@/features/consult/steps";
import { useConsultForm } from "@/features/consult/useConsultForm";

const field = "mt-1 w-full min-h-[48px] rounded-xl border border-ink/25 bg-paper px-4 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";
const choice = "flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border border-ink/20 bg-paper px-4 py-3 text-ink has-[:checked]:border-brand-deep has-[:checked]:bg-brand-soft has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink";

// 상담 신청 폼(3단계) — 화면 표시만 담당 (로직은 useConsultForm, 전송은 features/consult/api.ts)
export function ConsultForm({ initialTopic = "health" }: { initialTopic?: string }) {
  const { values, errors, step, totalSteps, status, serverMessage, setField, next, back, submit } = useConsultForm(initialTopic);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  // 단계가 바뀌면 제목으로 포커스를 옮겨 스크린리더 사용자가 위치를 알 수 있게 함
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    titleRef.current?.focus();
  }, [step, status]);

  if (status === "done") {
    return (
      <div role="status" className="rounded-card bg-brand-soft p-8">
        <h3 ref={titleRef} tabIndex={-1} className="text-center text-2xl font-bold text-ink outline-none">상담 신청이 접수되었어요</h3>
        <ol className="mx-auto mt-6 max-w-md space-y-3 text-ink">
          <li className="flex gap-3"><span className="font-bold text-brand-deep">1</span>접수된 순서대로 내용을 확인합니다.</li>
          <li className="flex gap-3"><span className="font-bold text-brand-deep">2</span>희망하신 시간({TIME_LABEL[values.time]})에 {site.contact.fcPhone} 번호로 전화드립니다.</li>
          <li className="flex gap-3"><span className="font-bold text-brand-deep">3</span>상담만으로 가입이 진행되지 않으니 편하게 물어보세요.</li>
        </ol>
        <p className="mt-6 text-center text-sm text-ink-sub">
          급하시면 <a className="font-semibold underline" href={`tel:${site.contact.fcPhone}`}>{site.contact.fcPhone}</a> · {site.contact.hours}
        </p>
      </div>
    );
  }

  const Err = ({ k }: { k: string }) =>
    errors[k] ? <p role="alert" id={`${k}-err`} className="mt-1 text-sm text-alert">{errors[k]}</p> : null;
  const isLast = step === totalSteps - 1;

  return (
    <form
      noValidate
      onSubmit={(e) => { e.preventDefault(); void submit(); }}
      className="space-y-6 rounded-card border border-ink/10 bg-paper p-6 sm:p-8"
    >
      <ol className="flex items-center gap-2" aria-label="신청 단계">
        {STEPS.map((s, i) => (
          <li key={s.key} className="flex flex-1 items-center gap-2" aria-current={i === step ? "step" : undefined}>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i <= step ? "bg-brand text-ink" : "bg-paper-gray text-ink-sub"}`}>{i + 1}</span>
            <span className={`truncate text-sm ${i === step ? "font-bold text-ink" : "text-ink-sub"}`}>{s.label}</span>
          </li>
        ))}
      </ol>

      <h3 ref={titleRef} tabIndex={-1} className="text-xl font-bold text-ink outline-none">{STEPS[step].title}</h3>

      {step === 0 && (
        <fieldset>
          <legend className="sr-only">관심 분야</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {[...categories.map((c) => ({ slug: c.slug as string, title: c.title, short: c.short })),
              { slug: "other", title: "기타 / 잘 모르겠어요", short: "어떤 보장이 필요한지 함께 정리해 드립니다." }].map((c) => (
              <label key={c.slug} className={choice}>
                <input type="radio" name="topic" className="h-5 w-5 accent-brand" value={c.slug}
                  checked={values.topic === c.slug} onChange={() => setField("topic", c.slug as typeof values.topic)} />
                <span><b className="block">{c.title}</b><span className="text-sm text-ink-sub">{c.short}</span></span>
              </label>
            ))}
          </div>
          <Err k="topic" />
        </fieldset>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label htmlFor="age" className="font-semibold text-ink">가입 대상 연령 (만 나이) <span className="text-alert">*</span></label>
            <input id="age" inputMode="numeric" placeholder="예: 8" className={field} value={values.age}
              onChange={(e) => setField("age", e.target.value)} aria-invalid={Boolean(errors.age)} aria-describedby={`age-help${errors.age ? " age-err" : ""}`} />
            <p id="age-help" className="mt-1 text-sm text-ink-sub">가입하실 분(본인·부모님·자녀)의 나이를 입력해 주세요.</p>
            <Err k="age" />
          </div>
          <fieldset>
            <legend className="font-semibold text-ink">연락 희망 시간</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {TIMES.map((t) => (
                <label key={t} className={choice}>
                  <input type="radio" name="time" className="h-5 w-5 accent-brand" value={t}
                    checked={values.time === t} onChange={() => setField("time", t)} />
                  <span className="text-sm">{TIME_LABEL[t]}</span>
                </label>
              ))}
            </div>
            <Err k="time" />
          </fieldset>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
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
        </div>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <button type="button" onClick={back}
            className="min-h-[52px] rounded-xl border border-ink/30 bg-paper px-6 text-base font-semibold text-ink hover:bg-paper-gray">
            이전
          </button>
        )}
        {isLast ? (
          <button type="submit" disabled={status === "submitting"}
            className="min-h-[52px] flex-1 rounded-xl bg-brand text-lg font-bold text-ink hover:brightness-95 disabled:opacity-60">
            {status === "submitting" ? "접수 중..." : "상담 신청하기"}
          </button>
        ) : (
          <button type="button" onClick={next}
            className="min-h-[52px] flex-1 rounded-xl bg-brand text-lg font-bold text-ink hover:brightness-95">
            다음
          </button>
        )}
      </div>
      <p className="text-center text-xs text-ink-sub">{site.notices.promise}</p>
    </form>
  );
}
