-- 관리자 화면(/admin) 전체 설정 — Supabase SQL Editor 에 통째로 붙여넣고 Run, 딱 한 번만 실행하세요.
-- 여러 번 실행해도 안전합니다(이미 있으면 건너뜀). 이 파일 하나로 아래 4가지가 모두 준비됩니다.
--   1) 이용 통계 테이블(site_events)  2) 상담 신청 유입 정보 컬럼  3) 관리자 메모 컬럼  4) 상세 문진 컬럼

-- 1) 이용 통계(비식별) — 이름·연락처·IP 는 저장하지 않습니다. RLS 를 켜고 정책을 만들지 않아 브라우저는 접근 불가, 서버만 가능
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

-- 2) 상담 신청의 유입 정보
alter table leads add column if not exists utm_source   text;
alter table leads add column if not exists utm_medium   text;
alter table leads add column if not exists utm_campaign text;
alter table leads add column if not exists ref_host     text;
create index if not exists leads_utm_campaign on leads (utm_campaign, created_at desc);

-- 3) 관리자 메모
alter table leads add column if not exists memo text;

-- 4) 상세 문진(건강 관련 내용이 들어갈 수 있으니 RLS 를 켠 상태 유지)
alter table leads add column if not exists detail jsonb;
