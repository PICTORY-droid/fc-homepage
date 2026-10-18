-- 홈페이지 상담 신청 저장용 테이블 (Supabase SQL Editor 에서 한 번만 실행)
-- 보안: RLS 를 켜고 정책을 만들지 않음 → 브라우저(anon/로그인 사용자)는 접근 불가,
--       서버(service role 키)만 저장/조회 가능

create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null,
  source           text not null default 'landing',
  name             text not null,
  phone            text not null,
  interest         text,
  insured_age      smallint,
  consent_contact  boolean not null default false,
  consent_at       timestamptz,
  consent_marketing boolean not null default false,
  status           text not null default 'new',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

create index if not exists leads_owner_created on public.leads (owner_id, created_at desc);

alter table public.leads enable row level security;
