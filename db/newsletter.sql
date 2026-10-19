-- 새 양식 알림 신청자 저장용 테이블 — Supabase SQL Editor 에서 한 번만 실행하세요.
-- 광고성 정보 수신 동의(선택)를 한 분의 연락처만 저장합니다. 상담 신청(leads)과 분리해 보관합니다.
-- 보안: RLS 를 켜고 정책을 만들지 않음 → 브라우저는 접근 불가, 서버(service role 키)만 저장/조회 가능

create table if not exists public.newsletter_subscribers (
  id               bigint generated always as identity primary key,
  phone            text not null unique,          -- 숫자만 (예: 01012345678)
  source_path      text,                          -- 동의한 페이지 (예: /fun/stationery/spring)
  consent_text_ver text not null,                 -- 동의 당시 안내 문구 버전
  consent_at       timestamptz not null default now(),
  expires_at       timestamptz not null,          -- 보유 기간 만료일 (이후 파기 또는 재동의)
  unsubscribed_at  timestamptz,                   -- 수신 거부 시각 (있으면 발송 금지)
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists newsletter_active on public.newsletter_subscribers (expires_at) where unsubscribed_at is null;
alter table public.newsletter_subscribers enable row level security;

-- 예) 발송 대상(수신 거부 안 했고 기간 안 지난 분)
-- select phone from public.newsletter_subscribers where unsubscribed_at is null and expires_at > now();
-- 예) 기간 만료분 파기
-- delete from public.newsletter_subscribers where expires_at < now() or unsubscribed_at < now() - interval '30 days';
