import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Notice } from "@/components/ui/Notice";
import { OwnerNoTrack } from "@/components/analytics/OwnerNoTrack";
import { isAdminConfigured, isAdminLoggedIn, isEntryKeyValid } from "@/services/adminSession";
import { loadStats } from "@/services/adminStats";
import type { Count, SourceRow, Summary } from "@/features/analytics/summary";
import { AdminNav } from "../AdminNav";
import { LoginForm } from "../LoginForm";
import { logoutAction } from "../actions";

export const metadata: Metadata = { title: "유입 통계", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;
const n = (v: number) => v.toLocaleString("ko-KR");

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-card border border-ink/10 bg-paper p-4">
      <p className="text-sm font-semibold text-ink-sub">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{n(value)}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-sub">{hint}</p>}
    </div>
  );
}

function Bars({ title, rows, empty = "아직 기록이 없습니다." }: { title: string; rows: Count[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="rounded-card border border-ink/10 bg-paper p-4">
      <h3 className="font-bold text-ink">{title}</h3>
      {rows.length === 0 ? <p className="mt-2 text-sm text-ink-sub">{empty}</p> : (
        <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.key} className="text-sm">
              <div className="flex justify-between gap-3 text-ink"><span className="min-w-0 break-all">{r.key}</span><span className="shrink-0 font-semibold">{n(r.count)}</span></div>
              <div className="mt-1 h-2 rounded bg-paper-card"><div className="h-2 rounded bg-brand" style={{ width: `${Math.max(3, (r.count / max) * 100)}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SourceTable({ title, rows }: { title: string; rows: SourceRow[] }) {
  return (
    <div className="rounded-card border border-ink/10 bg-paper p-4">
      <h3 className="font-bold text-ink">{title}</h3>
      {rows.length === 0 ? <p className="mt-2 text-sm text-ink-sub">아직 기록이 없습니다.</p> : (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="text-ink-sub"><th className="py-1 pr-2 font-semibold">경로</th><th className="px-2 text-right font-semibold">방문</th><th className="px-2 text-right font-semibold">다운로드</th><th className="pl-2 text-right font-semibold">상담 신청</th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.key} className="border-t border-ink/10 text-ink"><td className="break-all py-1.5 pr-2">{r.key}</td><td className="px-2 text-right">{n(r.visits)}</td><td className="px-2 text-right">{n(r.downloads)}</td><td className="pl-2 text-right font-semibold">{n(r.consultDone)}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Daily({ s }: { s: Summary }) {
  const max = Math.max(1, ...s.daily.map((d) => d.visits));
  return (
    <div className="rounded-card border border-ink/10 bg-paper p-4">
      <h3 className="font-bold text-ink">날짜별 방문</h3>
      <div className="mt-3 flex h-28 items-end gap-px" role="img" aria-label={`날짜별 방문 수, 최대 ${max}`}>
        {s.daily.map((d) => <div key={d.date} title={`${d.date} · 방문 ${d.visits}`} className="flex-1 rounded-t bg-brand" style={{ height: `${Math.max(2, (d.visits / max) * 100)}%` }} />)}
      </div>
      <p className="mt-1 flex justify-between text-xs text-ink-sub"><span>{s.daily[0]?.date}</span><span>{s.daily.at(-1)?.date}</span></p>
    </div>
  );
}

const MESSAGE = {
  "no-storage": "저장소(Supabase)가 설정되지 않았습니다.",
  "no-table": "통계 저장 테이블이 아직 없습니다. Supabase SQL Editor에서 db/admin_setup.sql 을 한 번만 실행해 주세요. 그 뒤로는 따로 설정할 것이 없습니다.",
  failed: "통계를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
} as const;

// 유입 통계 — 로그인(서버 세션)한 관리자만 볼 수 있습니다.
export default async function StatsPage({ searchParams }: { searchParams: Promise<{ days?: string; k?: string }> }) {
  if (!isAdminConfigured()) notFound();
  const sp = await searchParams;
  if (!(await isAdminLoggedIn())) {
    if (!isEntryKeyValid(sp.k)) notFound(); // 관리자가 아니면 로그인 화면도 보이지 않음
    return <Section title="유입 통계" lead="관리자만 볼 수 있는 화면입니다."><LoginForm entryKey={sp.k ?? ""} /></Section>;
  }
  const q = Number(sp.days);
  const days = (RANGES as readonly number[]).includes(q) ? q : 30;
  const { summary: s, error, truncated } = await loadStats(days);
  return (
    <Section title="유입 통계" lead={`최근 ${days}일 · 방문자가 어디서 들어와 무엇을 했는지 (이름·연락처·IP 는 저장하지 않아요)`}>
      <OwnerNoTrack />
      <AdminNav current="stats" />
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {RANGES.map((r) => (
          <a key={r} href={`/admin/stats?days=${r}`} aria-current={r === days ? "page" : undefined}
            className={`min-h-[44px] rounded-xl px-4 py-2.5 text-sm font-bold ${r === days ? "bg-ink text-paper" : "border border-ink/20 text-ink"}`}>{r}일</a>
        ))}
        <form action={logoutAction} className="ml-auto"><button type="submit" className="text-sm font-semibold text-ink underline">로그아웃</button></form>
      </div>
      {error && <Notice tone="alert">{MESSAGE[error]}</Notice>}
      {truncated && <div className="mb-4"><Notice>기록이 많아 최근 일부만 집계했습니다. 기간을 줄여 보세요.</Notice></div>}
      {s && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="방문" value={s.totals.visit} hint="한 번 들어와 머문 것" />
            <Stat label="페이지 보기" value={s.totals.page_view} />
            <Stat label="상담 시작" value={s.totals.consult_start} />
            <Stat label="상담 신청 완료" value={s.totals.consult_done} />
            <Stat label="다운로드" value={s.totals.download} />
            <Stat label="전화 누름" value={s.totals.phone_click} />
            <Stat label="카카오 누름" value={s.totals.kakao_click} />
            <Stat label="소식받기 가입" value={s.totals.newsletter_optin} />
          </div>
          <Daily s={s} />
          <SourceTable title="어디서 들어왔나 (유입 경로)" rows={s.sources} />
          <SourceTable title="링크 꼬리표(캠페인)별" rows={s.campaigns} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Bars title="많이 본 페이지" rows={s.topPages} />
            <Bars title="많이 받은 자료" rows={s.topDownloads} />
          </div>
          <p className="text-xs text-ink-sub">경로는 링크의 utm_source 꼬리표가 있으면 그 값, 없으면 이전 사이트 주소(네이버·구글 등), 둘 다 없으면 &lsquo;직접&rsquo;(주소 입력·즐겨찾기·일부 앱)으로 묶습니다. 본인 브라우저는 관리자 로그인 후 자동으로 집계에서 빠집니다.</p>
        </div>
      )}
    </Section>
  );
}
