"use client";
import { useEffect, useRef } from "react";
import { categories } from "@/config/categories";
import { site } from "@/config/site";
import { TIMES, TIME_LABEL } from "@/features/consult/schema";
import { FAMILY_HISTORY, FAMILY_HISTORY_LABEL, INSURANCE_KINDS, INSURANCE_KIND_LABEL, YESNO, YESNO_LABEL } from "@/features/consult/detailOptions";
import { consentNote } from "@/features/consult/consentText";
import { useConsultForm } from "@/features/consult/useConsultForm";

const field = "mt-2 w-full min-h-[48px] rounded-xl border border-ink/25 bg-paper px-4 text-base text-ink placeholder:text-ink-sub/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";
// 칸 너비는 '화면 너비'가 아니라 '들어간 자리의 너비'에 맞춰 늘고 줄어듭니다(좁은 자리에서 글자가 한 줄에 한 낱말씩 쪼개지지 않게).
const topicGrid = "grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3"; // 분야 9개 → 3×3 로 딱 맞게 떨어짐
const choiceGrid = "mt-3 grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-3";
// 분야 선택 카드 — '전체 상담 분야' 카드와 같은 모양(라디오는 화면에서 숨기고 오른쪽 위 표시로 대신함)
const topicCard = "relative flex h-full cursor-pointer items-start gap-3 rounded-xl border border-ink/15 bg-paper p-4 text-ink transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md has-[:checked]:border-brand-deep has-[:checked]:bg-brand-soft has-[:checked]:shadow-[0_0_0_1px_theme(colors.brand.deep)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink";
const choice = "flex min-h-[52px] cursor-pointer items-center gap-3 break-keep rounded-xl border border-ink/20 bg-paper px-4 py-3 text-ink transition hover:border-brand has-[:checked]:border-brand-deep has-[:checked]:bg-brand-soft has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink";

// 상담 신청 폼(3단계) — 화면 표시만 담당 (로직은 useConsultForm, 전송은 features/consult/api.ts)
export function ConsultForm({ initialTopic = "health" }: { initialTopic?: string }) {
  const { values, errors, steps, step, totalSteps, status, serverMessage, setField, toggleInList, setHealthConsent, next, back, submit } = useConsultForm(initialTopic);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  // 단계가 바뀌면 제목으로 포커스를 옮겨 스크린리더 사용자가 위치를 알 수 있게 함
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    titleRef.current?.focus();
  }, [step, status]);

  if (status === "done") {
    return (
      <div role="status" className="max-w-2xl rounded-card bg-brand-soft p-8">
        <div aria-hidden="true" className="fx-pop-in mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-3xl font-extrabold text-ink">✓</div>
        <h3 ref={titleRef} tabIndex={-1} className="text-center text-2xl font-bold text-ink outline-none">상담 신청이 접수되었어요</h3>
        <ol className="mx-auto mt-6 max-w-md space-y-3 text-ink">
          <li className="flex gap-3"><span className="font-bold text-brand-deep">1</span>접수된 순서대로 내용을 확인합니다. ({site.contact.responseTime} 안에 연락드립니다)</li>
          <li className="flex gap-3"><span className="font-bold text-brand-deep">2</span>{site.contact.fcPhone} 번호로 전화드립니다. (희망 시간: {TIME_LABEL[values.time ?? "anytime"]})</li>
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
      className="space-y-8 rounded-card border border-ink/10 bg-paper p-5 sm:p-8"
    >
      <ol className="flex items-center" aria-label="신청 단계">
        {steps.map((s, i) => (
          <li key={s.key} className={`flex items-center gap-2.5 ${i < steps.length - 1 ? "flex-1" : ""}`} aria-current={i === step ? "step" : undefined}>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i <= step ? "bg-brand text-ink" : "bg-paper-gray text-ink-sub"}`}>{i + 1}</span>
            <span className={`whitespace-nowrap text-sm ${i === step ? "font-bold text-ink" : "text-ink-sub"}`}>{s.label}</span>
            {i < steps.length - 1 && <span aria-hidden="true" className={`mx-2 h-0.5 flex-1 rounded-full ${i < step ? "bg-brand" : "bg-ink/10"}`} />}
          </li>
        ))}
      </ol>

      <div key={steps[step].key} className="step-enter space-y-6">
      <div>
        <h3 ref={titleRef} tabIndex={-1} className="break-keep text-xl font-bold text-ink outline-none sm:text-2xl">{steps[step].title}</h3>
        {steps[step].key === "topic" && <p className="mt-1.5 text-sm text-ink-sub">가장 가까운 분야를 하나 골라 주세요.</p>}
      </div>

      {steps[step].key === "topic" && (
        <fieldset>
          <legend className="sr-only">관심 분야</legend>
          <div className={topicGrid}>
            {[...categories.map((c) => ({ slug: c.slug as string, title: c.title, short: c.short })),
              { slug: "other", title: "기타 / 잘 모르겠어요", short: "어떤 보장이 필요한지 함께 정리해 드립니다." }].map((c) => (
              <label key={c.slug} className={topicCard}>
                <input type="radio" name="topic" className="peer sr-only" value={c.slug}
                  checked={values.topic === c.slug} onChange={() => setField("topic", c.slug as typeof values.topic)} />
                <span aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-ink/30 bg-paper peer-checked:border-brand-deep peer-checked:bg-brand-deep peer-checked:shadow-[inset_0_0_0_3px_#FFDAC1]" />
                <span className="min-w-0"><b className="block break-keep text-base leading-snug">{c.title}</b><span className="mt-1 block break-keep text-sm leading-relaxed text-ink-sub">{c.short}</span></span>
              </label>
            ))}
          </div>
          <Err k="topic" />
        </fieldset>
      )}

      {steps[step].key === "contact" && (
        <div className="mx-auto max-w-xl space-y-6">
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
            <label htmlFor="memo" className="font-semibold text-ink">궁금한 점</label>
            <textarea id="memo" rows={3} maxLength={300} placeholder="예: 가입한 보험이 잘 맞는지 궁금해요" className={`${field} py-3`} value={values.memo}
              onChange={(e) => setField("memo", e.target.value)} aria-invalid={Boolean(errors.memo)} />
            <Err k="memo" />
          </div>

          <details className="group rounded-xl border border-ink/15 bg-paper">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 font-semibold text-ink [&::-webkit-details-marker]:hidden">
              <span>더 알려 주실 내용이 있다면 <span className="font-normal text-ink-sub">(선택)</span></span>
              <span aria-hidden="true" className="text-ink-sub transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="space-y-7 border-t border-ink/10 px-4 pb-5 pt-5">
          <div>
            <label htmlFor="age" className="font-semibold text-ink">가입 대상 연령 (만 나이, 선택)</label>
            <input id="age" inputMode="numeric" placeholder="예: 8" className={field} value={values.age}
              onChange={(e) => setField("age", e.target.value)} aria-invalid={Boolean(errors.age)} aria-describedby={`age-help${errors.age ? " age-err" : ""}`} />
            <p id="age-help" className="mt-1 text-sm text-ink-sub">가입하실 분(본인·부모님·자녀)의 나이를 입력해 주세요.</p>
            <Err k="age" />
          </div>
          <fieldset>
            <legend className="font-semibold text-ink">연락 희망 시간</legend>
            <div className={choiceGrid}>
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
        
          <fieldset>
            <legend className="font-semibold text-ink">현재 가입 중인 보험이 있나요?</legend>
            <div className={choiceGrid}>
              {YESNO.map((v) => (
                <label key={v} className={choice}>
                  <input type="radio" name="hasInsurance" className="h-5 w-5 accent-brand" value={v}
                    checked={values.hasInsurance === v} onChange={() => setField("hasInsurance", v)} />
                  <span className="text-sm">{YESNO_LABEL[v]}</span>
                </label>
              ))}
            </div>
            {values.hasInsurance === "yes" && (
              <div className={choiceGrid}>
                {INSURANCE_KINDS.map((k) => (
                  <label key={k} className={choice}>
                    <input type="checkbox" className="h-5 w-5 accent-brand" checked={(values.insuranceKinds ?? []).includes(k)}
                      onChange={() => toggleInList("insuranceKinds", k)} />
                    <span className="text-sm">{INSURANCE_KIND_LABEL[k]}</span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <div className="rounded-xl border border-ink/15 p-4 sm:p-5">
            <p className="font-semibold text-ink">건강 관련 내용 (선택)</p>
            <label className="mt-3 flex min-h-[44px] items-center gap-3 text-ink">
              <input type="checkbox" className="h-5 w-5 accent-brand" checked={values.healthConsent}
                onChange={(e) => setHealthConsent(e.target.checked)} />
              건강 관련 민감정보 수집·이용에 동의합니다. (선택)
            </label>
            <Err k="healthConsent" />

            {values.healthConsent && (
              <div className="mt-4 space-y-5">
                <fieldset>
                  <legend className="font-semibold text-ink">최근 5년 내 입원 또는 수술 이력</legend>
                  <div className={choiceGrid}>
                    {YESNO.map((v) => (
                      <label key={v} className={choice}>
                        <input type="radio" name="surgery" className="h-5 w-5 accent-brand" value={v}
                          checked={values.surgery === v} onChange={() => setField("surgery", v)} />
                        <span className="text-sm">{YESNO_LABEL[v]}</span>
                      </label>
                    ))}
                  </div>
                  {values.surgery === "yes" && (
                    <input aria-label="입원·수술 내용" maxLength={200} placeholder="예: 3년 전 맹장 수술" className={field}
                      value={values.surgeryNote} onChange={(e) => setField("surgeryNote", e.target.value)} />
                  )}
                  <Err k="surgeryNote" />
                </fieldset>

                <fieldset>
                  <legend className="font-semibold text-ink">현재 치료·복약 중인 질환</legend>
                  <div className={choiceGrid}>
                    {YESNO.map((v) => (
                      <label key={v} className={choice}>
                        <input type="radio" name="treatment" className="h-5 w-5 accent-brand" value={v}
                          checked={values.treatment === v} onChange={() => setField("treatment", v)} />
                        <span className="text-sm">{YESNO_LABEL[v]}</span>
                      </label>
                    ))}
                  </div>
                  {values.treatment === "yes" && (
                    <input aria-label="치료·복약 내용" maxLength={200} placeholder="예: 고혈압 약 복용 중" className={field}
                      value={values.treatmentNote} onChange={(e) => setField("treatmentNote", e.target.value)} />
                  )}
                  <Err k="treatmentNote" />
                </fieldset>

                <fieldset>
                  <legend className="font-semibold text-ink">가족력 (해당하는 것 모두)</legend>
                  <div className={choiceGrid}>
                    {FAMILY_HISTORY.map((f) => (
                      <label key={f} className={choice}>
                        <input type="checkbox" className="h-5 w-5 accent-brand" checked={(values.familyHistory ?? []).includes(f)}
                          onChange={() => toggleInList("familyHistory", f, ["none", "unknown"])} />
                        <span className="text-sm">{FAMILY_HISTORY_LABEL[f]}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}
          </div>
            </div>
          </details>

          {/* 스팸 방지용 숨김 입력: 사람에게는 보이지 않음 */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>웹사이트<input tabIndex={-1} autoComplete="off" value={values.website}
              onChange={(e) => setField("website", e.target.value)} /></label>
          </div>

          <div className="rounded-xl bg-paper-card p-4">
            <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-ink">
              <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-brand" checked={Boolean(values.consent)}
                onChange={(e) => setField("consent", e.target.checked as unknown as true)} aria-describedby="consent-note" />
              <span><b>(필수)</b> 개인정보 수집·이용에 동의합니다. <a className="text-sm underline" href="/privacy" target="_blank" rel="noopener noreferrer">자세히<span className="sr-only"> (새 창으로 열림)</span></a></span>
            </label>
            <p id="consent-note" className="mt-1 break-keep pl-8 text-sm leading-relaxed text-ink-sub">{consentNote(site.privacy.retentionMonths)}</p>
            <Err k="consent" />
          </div>
          {status === "error" && <p role="alert" className="text-alert">{serverMessage}</p>}
        </div>
      )}

      </div>

      <div className="mx-auto flex w-full max-w-md gap-3">
        {step > 0 && (
          <button type="button" onClick={back}
            className="min-h-[48px] rounded-xl border border-ink/30 bg-paper px-6 text-base font-semibold text-ink hover:bg-paper-gray">
            이전
          </button>
        )}
        {isLast ? (
          <button key="submit" type="submit" disabled={status === "submitting"}
            className="min-h-[48px] flex-1 rounded-xl bg-brand text-base font-bold text-ink hover:brightness-95 disabled:opacity-60">
            {status === "submitting" ? "접수 중..." : "상담 신청하기"}
          </button>
        ) : (
          <button key="next" type="button" onClick={next}
            className="min-h-[48px] flex-1 rounded-xl bg-brand text-base font-bold text-ink hover:brightness-95">
            다음
          </button>
        )}
      </div>
      <p className="mx-auto max-w-md text-balance break-keep text-center text-sm leading-relaxed text-ink-sub">신청하시면 {site.contact.responseTime} 안에 연락드립니다. {site.notices.promise}</p>
    </form>
  );
}
