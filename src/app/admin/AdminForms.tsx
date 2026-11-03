"use client";
import { useActionState } from "react";
import { loginAction, registerAction, type ActionState } from "./actions";
import { buttonClass, cardClass, inputClass } from "@/components/ui/styles";

const input = `mt-1 ${inputClass}`;
const wrap = `max-w-sm space-y-4 ${cardClass} p-6`;

function Field({ id, label, type = "text", auto }: { id: string; label: string; type?: string; auto?: string }) {
  return (
    <div>
      <label htmlFor={id} className="font-semibold text-ink">{label}</label>
      <input id={id} name={id} type={type} autoComplete={auto} required className={input} />
    </div>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, {});
  return (
    <form action={action} className={wrap}>
      <Field id="username" label="아이디" auto="username" />
      <Field id="password" label="비밀번호" type="password" auto="current-password" />
      {state.error && <p role="alert" className="text-sm text-alert">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClass("primary", "md", "w-full")}>{pending ? "확인 중..." : "로그인"}</button>
    </form>
  );
}

// 처음 한 번만 보이는 관리자 등록 — 이미 계정이 있으면 서버가 이 화면을 아예 그리지 않습니다.
export function RegisterForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(registerAction, {});
  return (
    <form action={action} className={wrap}>
      <p className="text-sm text-ink-sub">관리자 아이디와 비밀번호를 처음 한 번 등록합니다. 인증 코드는 Vercel 환경변수 ADMIN_PASSWORD 에 넣은 값이에요.</p>
      <Field id="code" label="인증 코드" type="password" auto="off" />
      <Field id="username" label="새 아이디 (영문·숫자 4~30자)" auto="username" />
      <Field id="password" label="새 비밀번호 (12자 이상)" type="password" auto="new-password" />
      <Field id="password2" label="비밀번호 확인" type="password" auto="new-password" />
      {state.error && <p role="alert" className="text-sm text-alert">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClass("primary", "md", "w-full")}>{pending ? "등록 중..." : "관리자 등록"}</button>
    </form>
  );
}
