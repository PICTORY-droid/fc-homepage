-- 이용 통계(비식별) 저장용 테이블 — Supabase SQL Editor 에서 한 번만 실행하세요.
-- 이름·연락처·IP 는 저장하지 않습니다. (다운로드/전화/카카오 클릭, 상담 신청 시작·완료 횟수만 집계)
-- 보안: RLS 를 켜고 정책을 만들지 않음 → 브라우저는 접근 불가, 서버(service role 키)만 저장/조회 가능

create table if not exists public.site_events (
  id         bigint generated always as identity primary key,
  name       text not null,
  path       text not null,
  label      text,
  source     text,
  medium     text,
  campaign   text,
  ref_host   text,
  created_at timestamptz not null default now()
);

create index if not exists site_events_name_created on public.site_events (name, created_at desc);
create index if not exists site_events_created on public.site_events (created_at desc);

alter table public.site_events enable row level security;

-- 예) 최근 30일 콘텐츠별 다운로드 수 TOP 10
-- select label, count(*) from public.site_events where name = 'download' and created_at > now() - interval '30 days' group by label order by 2 desc limit 10;
-- 예) 유입 경로별 상담 신청 완료 수
-- select coalesce(source, ref_host, '직접') as from_where, count(*) from public.site_events where name = 'consult_done' group by 1 order by 2 desc;
