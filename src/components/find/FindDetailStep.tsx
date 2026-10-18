"use client";
import {
  FAMILY_HISTORY, FAMILY_HISTORY_LABEL, INSURANCE_KINDS, INSURANCE_KIND_LABEL, YESNO, YESNO_LABEL, type YesNo,
} from "@/features/consult/detailOptions";
import type { DetailAnswers } from "@/features/find/recommend";

const choice = "flex min-h-[52px] w-full items-center gap-3 rounded-xl border border-ink/20 bg-paper px-4 py-3 text-left text-base text-ink hover:border-brand-deep hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink aria-pressed:border-brand-deep aria-pressed:bg-brand-soft";

interface Props {
  detail: DetailAnswers;
  setAnswer: <K extends keyof DetailAnswers>(key: K, value: DetailAnswers[K]) => void;
  toggleIn: (key: "insuranceKinds" | "familyHistory", item: string, exclusive?: readonly string[]) => void;
  onSubmit: () => void;
}

function YesNoRow({ legend, value, onPick }: { legend: string; value?: YesNo; onPick: (v: YesNo) => void }) {
  return (
    <fieldset>
      <legend className="font-semibold text-ink">{legend}</legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        {YESNO.map((v) => (
          <button key={v} type="button" className={choice} aria-pressed={value === v} onClick={() => onPick(v)}>{YESNO_LABEL[v]}</button>
        ))}
      </div>
    </fieldset>
  );
}

// '잘 모르겠어요' 선택 시 추가로 묻는 문항 — 모두 선택 입력이고, 답변은 서버로 보내지 않고 결과 계산에만 씁니다.
export function FindDetailStep({ detail, setAnswer, toggleIn, onSubmit }: Props) {
  return (
    <div className="space-y-7">
      <YesNoRow legend="현재 가입 중인 보험이 있나요?" value={detail.hasInsurance} onPick={(v) => setAnswer("hasInsurance", v)} />
      {detail.hasInsurance === "yes" && (
        <fieldset>
          <legend className="font-semibold text-ink">가입 중인 보험 종류 (해당하는 것 모두)</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {INSURANCE_KINDS.map((k) => (
              <button key={k} type="button" className={choice} aria-pressed={(detail.insuranceKinds ?? []).includes(k)} onClick={() => toggleIn("insuranceKinds", k)}>
                {INSURANCE_KIND_LABEL[k]}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <YesNoRow legend="최근 5년 내 입원 또는 수술 이력이 있나요?" value={detail.surgery} onPick={(v) => setAnswer("surgery", v)} />
      <YesNoRow legend="현재 치료·복약 중인 질환이 있나요?" value={detail.treatment} onPick={(v) => setAnswer("treatment", v)} />
      <fieldset>
        <legend className="font-semibold text-ink">가족력 (해당하는 것 모두)</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {FAMILY_HISTORY.map((f) => (
            <button key={f} type="button" className={choice} aria-pressed={(detail.familyHistory ?? []).includes(f)} onClick={() => toggleIn("familyHistory", f, ["none", "unknown"])}>
              {FAMILY_HISTORY_LABEL[f]}
            </button>
          ))}
        </div>
      </fieldset>
      <p className="text-sm text-ink-sub">모두 선택 사항이에요. 여기에서 고르신 내용은 서버로 전송·저장되지 않고, 결과를 보여드리는 데에만 쓰입니다.</p>
      <button type="button" onClick={onSubmit}
        className="min-h-[52px] w-full rounded-xl bg-brand px-6 text-lg font-bold text-ink hover:brightness-95 sm:w-auto">
        결과 보기
      </button>
    </div>
  );
}
