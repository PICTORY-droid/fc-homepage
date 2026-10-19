"use client";
import { track } from "@/features/analytics/track";
import { TEMPLATE_REQUEST_MAX } from "@/features/templateRequest/schema";
import { useTemplateRequest } from "@/features/templateRequest/useTemplateRequest";

const field = "mt-1 w-full rounded-xl border border-ink/25 bg-paper px-4 py-3 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";

// 자료 받기 페이지 끝의 '만들어 줬으면 하는 템플릿' 요청 — 글만 받고 연락처는 받지 않습니다. 내용은 담당 FC 이메일로 전달돼요.
export function TemplateRequest({ from }: { from: string }) {
  const f = useTemplateRequest(from);

  if (f.status === "done") {
    return <aside role="status" className="rounded-card border border-ink/10 bg-paper-card p-5 text-ink">요청이 전달됐어요. 소중한 의견 고맙습니다. 참고해서 새 양식을 준비할게요.</aside>;
  }
  return (
    <aside aria-label="템플릿 요청" className="rounded-card border border-ink/10 bg-paper-card p-5">
      <form noValidate onSubmit={(e) => { e.preventDefault(); void f.submit().then((ok) => { if (ok) track("template_request", from); }); }}>
        <label htmlFor="tr-text" className="font-semibold text-ink">이 외에 만들고 싶은 템플릿, 요청하고 싶은 템플릿이 있다면 적어주세요.</label>
        <p id="tr-note" className="mt-1 text-xs leading-relaxed text-ink-sub">보내 주신 내용은 새 양식을 만드는 데 참고하며, 이름·연락처 같은 개인정보는 적지 말아 주세요.</p>
        <textarea id="tr-text" rows={3} maxLength={TEMPLATE_REQUEST_MAX} className={field} value={f.request} placeholder="예) 이사 체크리스트 PPT, 반려동물 건강 기록 엑셀"
          onChange={(e) => f.setRequest(e.target.value)} aria-describedby="tr-note" aria-invalid={Boolean(f.error)} />
        <div className="absolute -left-[9999px]" aria-hidden="true"><label>웹사이트<input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => f.setWebsite(e.target.value)} /></label></div>
        {f.error && <p role="alert" className="mt-1 text-sm text-alert">{f.error}</p>}
        <button type="submit" disabled={f.status === "submitting"} className="mt-3 min-h-[48px] w-full max-w-sm rounded-xl bg-brand text-base font-bold text-ink hover:brightness-95 disabled:opacity-60">
          {f.status === "submitting" ? "보내는 중..." : "요청 보내기"}
        </button>
      </form>
    </aside>
  );
}
