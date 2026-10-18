// API 응답 형식 통일 — 성공/실패 모두 이 형태만 사용합니다. 내부 오류 내용은 절대 담지 않습니다.
export type ApiErrorCode =
  | "VALIDATION" | "RATE_LIMITED" | "FORBIDDEN" | "TOO_LARGE" | "UNAVAILABLE" | "INTERNAL";

export type ApiSuccess<T = null> = { ok: true; data: T };
export type ApiFailure = {
  ok: false;
  error: { code: ApiErrorCode; message: string; fields?: Record<string, string> };
};
export type ApiResult<T = null> = ApiSuccess<T> | ApiFailure;

const MESSAGES: Record<ApiErrorCode, string> = {
  VALIDATION: "입력 내용을 다시 확인해 주세요.",
  RATE_LIMITED: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
  FORBIDDEN: "허용되지 않은 요청입니다.",
  TOO_LARGE: "요청 내용이 너무 깁니다.",
  UNAVAILABLE: "현재 접수가 어렵습니다. 전화로 문의해 주세요.",
  INTERNAL: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
};

export const success = <T = null>(data: T = null as T): ApiSuccess<T> => ({ ok: true, data });
export const failure = (code: ApiErrorCode, fields?: Record<string, string>): ApiFailure => ({
  ok: false,
  error: { code, message: MESSAGES[code], ...(fields ? { fields } : {}) },
});
