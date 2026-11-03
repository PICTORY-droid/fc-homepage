"use client";
// 자료를 처음 받은 뒤 화면 아래에 잠깐 뜨는 연령대 질문(선택) — 다운로드는 그대로 진행되고, 답하지 않아도 됩니다.
// 이름·연락처·생년월일은 묻지 않고 '대' 단위만 익명으로 기록합니다. 상태와 기록은 features/analytics/useAgePrompt.ts 가 담당합니다.
import { AGE_BANDS } from "@/features/analytics/ageBand";
import { useAgePrompt } from "@/features/analytics/useAgePrompt";
import { buttonClass, focusRing } from "@/components/ui/styles";

export function AgePrompt() {
  const { state, choose, skip } = useAgePrompt();
  if (state === "hidden") return null;
  return (
    <div role="region" aria-label="연령대 질문" aria-live="polite"
      className="fixed bottom-4 left-3 right-24 z-40 rounded-card border border-ink/10 bg-paper p-4 shadow-lg sm:left-6 sm:right-auto sm:w-[22rem]">
      {state === "thanks" ? (
        <p className="text-sm font-bold text-ink">고맙습니다. 더 쓸모 있는 자료로 보답할게요.</p>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-bold text-ink">자료를 받으신 분의 연령대를 알려 주세요</p>
            <button type="button" onClick={skip} className={`-mr-1 -mt-1 inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-ink-sub hover:bg-brand-tint ${focusRing}`}>건너뛰기</button>
          </div>
          <p className="text-xs text-ink-sub">선택 사항이에요. 어떤 자료를 더 만들지 정하는 데만 써요.</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {AGE_BANDS.map((b) => (
              <button key={b} type="button" onClick={() => choose(b)}
                className={buttonClass("outline", "sm", "whitespace-nowrap !px-1")}>{b}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
