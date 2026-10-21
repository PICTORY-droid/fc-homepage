"use client";
import { useActionState } from "react";
import { loginAction, type ActionState } from "./actions";

export function LoginForm({ entryKey }: { entryKey: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, {});
  return (
    <form action={action} className="max-w-sm space-y-4 rounded-card border border-ink/10 bg-paper p-6">
      <input type="hidden" name="k" value={entryKey} />
      <div>
        <label htmlFor="password" className="font-semibold text-ink">관리자 비밀번호</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required
          className="mt-1 w-full min-h-[48px] rounded-xl border border-ink/25 bg-paper px-4 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink" />
      </div>
      {state.error && <p role="alert" className="text-sm text-alert">{state.error}</p>}
      <button type="submit" disabled={pending} className="min-h-[48px] w-full rounded-xl bg-brand font-bold text-ink disabled:opacity-60">
        {pending ? "확인 중..." : "로그인"}
      </button>
    </form>
  );
}
