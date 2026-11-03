// 화면 모양 규칙 — 버튼·알약·글자 링크·카드는 이 파일의 클래스만 씁니다. (사이트 전체가 같은 우체국 감성으로 보이도록 한 곳에서 관리)
// 색 이름은 tailwind.config.ts, 이 파일은 '모양'. 페이지·컴포넌트에서 같은 모양을 새로 적지 말고 여기 함수를 부르세요.

/** 키보드로 이동할 때 보이는 테두리 — 모든 누를 수 있는 요소에 같게 */
export const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export type ButtonVariant = "primary" | "soft" | "outline" | "kakao";
/** sm: 카드 안 작은 버튼(44px) · md: 기본(48px) · lg: 단계 이동처럼 큰 버튼(52px) — 모두 손가락으로 누르기 충분한 높이 */
export type ButtonSize = "sm" | "md" | "lg";

const BUTTON_BASE = `inline-flex items-center justify-center gap-2 rounded-xl font-bold transition duration-200 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${focusRing}`;
const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-4 text-sm",
  md: "min-h-[48px] px-6 text-base",
  lg: "min-h-[52px] px-6 text-lg",
};
const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "btn-shine bg-brand text-ink hover:brightness-95 hover:shadow-md",
  soft: "bg-brand-soft text-ink hover:brightness-95",
  outline: "border border-ink/25 bg-paper text-ink hover:border-brand hover:bg-brand-tint",
  kakao: "bg-kakao text-kakao-ink hover:brightness-95",
};

/** 버튼 모양 — <button>·<a>·<Link> 어디에 붙여도 같은 모양 */
export const buttonClass = (variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = "") =>
  `${BUTTON_BASE} ${BUTTON_SIZE[size]} ${BUTTON_VARIANT[variant]} ${extra}`.trim();

/** 알약 모양 바로가기(분야·계절·묶음 고르기) — 고른 것은 주황 바탕 */
export const pillClass = (active: boolean, extra = "") =>
  `inline-flex min-h-[44px] items-center justify-center rounded-full border px-4 text-sm font-bold transition duration-200 ${focusRing} ${
    active ? "border-brand bg-brand text-ink" : "border-ink/25 bg-paper text-ink hover:border-brand hover:bg-brand-tint"
  } ${extra}`.trim();

/** 문장 속·페이지 끝의 글자 링크 */
export const textLink = `font-semibold text-brand-deep underline underline-offset-2 hover:text-ink ${focusRing}`;

/** 카드 바탕(테두리·모서리) */
export const cardClass = "overflow-hidden rounded-card border border-ink/10 bg-paper";
/** 눌러서 이동하는 카드 — 올리면 살짝 떠오르고 주황 테두리 */
export const cardLinkClass = `group ${cardClass} transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md has-[:focus-visible]:border-brand has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2 focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2`;
/** 이동 카드 맨 아래 '…보기 →' 글자 */
export const cardCtaClass = "mt-2 text-sm font-bold text-brand-deep";

/** 입력 칸 */
export const inputClass = `block min-h-[48px] w-full rounded-xl border border-ink/25 bg-paper px-4 text-base text-ink placeholder:text-ink-sub/70 focus:border-brand ${focusRing}`;

/** 고르는 칸(라디오·선택 버튼) — 올리면 연주황, 고른 칸은 진한 주황 테두리 + 주황 바탕 */
export const choiceClass = `flex min-h-[52px] w-full cursor-pointer items-center gap-3 break-keep rounded-xl border border-ink/25 bg-paper px-4 py-3 text-left text-base text-ink transition duration-200 hover:border-brand hover:bg-brand-tint has-[:checked]:border-brand-deep has-[:checked]:bg-brand-soft aria-pressed:border-brand-deep aria-pressed:bg-brand-soft has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${focusRing}`;

/** 접고 펴는 칸(토글) — PPT 템플릿 카드와 같은 바탕. 올리거나 펼치면 주황 테두리 */
export const disclosureClass = (open?: boolean) =>
  `group rounded-card border border-ink/10 bg-paper transition duration-200 hover:border-brand open:border-brand ${open ? "border-brand" : ""}`.trim();
/** 토글의 제목 줄(<summary>·<button> 공통) */
export const disclosureHeadClass = `flex min-h-[56px] w-full cursor-pointer list-none justify-between gap-3 px-5 py-3 rounded-card text-left text-ink [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink`;
/** 토글 안쪽 내용 */
export const disclosureBodyClass = "border-t border-ink/10 px-5 pb-5 pt-4";

/** 안내 상자(테두리만 있는 정적인 칸) */
export const panelClass = "rounded-xl border border-ink/10 bg-paper";
