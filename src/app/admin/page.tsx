import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Notice } from "@/components/ui/Notice";
import { getCategory } from "@/config/categories";
import { TIME_LABEL, TIMES } from "@/features/consult/schema";
import { isAdminLoggedIn } from "@/services/adminSession";
import { LEAD_STATUSES, STATUS_LABEL, listLeads, type LeadRow } from "@/services/adminLeads";
import { formatPhone } from "@/lib/phone";
import { summarizeDetail } from "@/features/consult/detailOptions";
import { OwnerNoTrack } from "@/components/analytics/OwnerNoTrack";
import { Pager } from "@/components/ui/Pager";
import { paginate, parsePage } from "@/lib/pagination";
import { AdminNav } from "./AdminNav";
import { AdminEntry } from "./AdminEntry";
import { logoutAction, updateLeadAction } from "./actions";

export const metadata: Metadata = { title: "상담 접수 관리", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic"; // 접수 목록은 항상 최신 값으로

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

function interestLabel(v: string | null) {
  const [topic = "", time = ""] = (v ?? "").split("|");
  const t = getCategory(topic)?.title ?? (topic ? "기타" : "-");
  const tm = (TIMES as readonly string[]).includes(time) ? TIME_LABEL[time as (typeof TIMES)[number]] : "";
  return tm ? `${t} · ${tm}` : t;
}

const fromLabel = (l: LeadRow) => [l.utm_source || l.ref_host, l.utm_campaign].filter(Boolean).join(" / ");

function LeadCard({ lead, memoEnabled }: { lead: LeadRow; memoEnabled: boolean }) {
  return (
    <li className="rounded-card border border-ink/10 bg-paper p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-lg font-bold text-ink">{lead.name ?? "-"} <span className="text-sm font-normal text-ink-sub">{lead.insured_age != null ? `· 만 ${lead.insured_age}세` : ""}</span></p>
        <p className="text-sm text-ink-sub">{fmtDate(lead.created_at)}</p>
      </div>
      {fromLabel(lead) && <p className="mt-1 text-xs font-semibold text-ink-sub">유입: {fromLabel(lead)}</p>}
      <p className="mt-1 text-ink">
        {lead.phone ? <a className="font-semibold underline" href={`tel:${lead.phone}`}>{formatPhone(lead.phone)}</a> : "-"}
        <span className="ml-3 text-sm text-ink-sub">{interestLabel(lead.interest)}</span>
      </p>
      {summarizeDetail(lead.detail).length > 0 && (
        <details className="mt-2 rounded-xl bg-paper-card p-3 text-sm text-ink">
          <summary className="cursor-pointer font-semibold">상세 문진 보기</summary>
          <ul className="mt-2 space-y-1">{summarizeDetail(lead.detail).map((l) => <li key={l}>{l}</li>)}</ul>
        </details>
      )}
      <form action={updateLeadAction} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
        <input type="hidden" name="id" value={lead.id} />
        <label className="text-sm font-semibold text-ink-sub">상태
          <select name="status" defaultValue={lead.status} className="mt-1 block min-h-[44px] rounded-xl border border-ink/25 bg-paper px-3 text-base text-ink">
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </label>
        {memoEnabled && (
          <label className="flex-1 text-sm font-semibold text-ink-sub">메모
            <input name="memo" defaultValue={lead.memo ?? ""} maxLength={500} placeholder="통화 내용, 다음 연락 일정"
              className="mt-1 block min-h-[44px] w-full rounded-xl border border-ink/25 bg-paper px-3 text-base text-ink" />
          </label>
        )}
        <button type="submit" className="min-h-[44px] rounded-xl bg-brand px-5 font-bold text-ink">저장</button>
      </form>
    </li>
  );
}

// 상담 접수 관리 — 로그인(서버 세션) 후에만 목록이 보입니다.
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  if (!(await isAdminLoggedIn())) return <AdminEntry />;
  const { rows, memoEnabled, error } = await listLeads();
  const sp = await searchParams;
  const pg = paginate(rows, parsePage(sp.page)); // 최신 접수순(서버에서 내림차순 조회) 10건씩
  const counts = Object.fromEntries(LEAD_STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length]));
  return (
    <Section title="상담 접수 관리" lead={`최근 ${rows.length}건 · 대기 ${counts.new} · 연락함 ${counts.contacted} · 완료 ${counts.done}`}>
      <OwnerNoTrack />
      <AdminNav current="leads" />
      <form action={logoutAction} className="mb-6"><button type="submit" className="text-sm font-semibold text-ink underline">로그아웃</button></form>
      {error && <Notice tone="alert">{error}</Notice>}
      {!memoEnabled && !error && <div className="mb-4"><Notice>메모·유입 정보를 쓰려면 Supabase SQL Editor에서 db/admin_setup.sql 을 한 번 실행해 주세요.</Notice></div>}
      {rows.length === 0 && !error ? <p className="text-ink-sub">아직 접수된 상담이 없습니다.</p> : (
        <>
          <ul className="space-y-3">{pg.items.map((r) => <LeadCard key={r.id} lead={r} memoEnabled={memoEnabled} />)}</ul>
          <Pager basePath="/admin" page={pg.page} totalPages={pg.totalPages} total={pg.total} from={pg.from} to={pg.to} />
        </>
      )}
    </Section>
  );
}
