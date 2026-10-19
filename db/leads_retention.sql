-- 상담 신청자 보관 기간(3년) 만료 알림을 한 번만 보내기 위한 표시 컬럼 — Supabase SQL Editor 에서 한 번만 실행하세요.
alter table public.leads add column if not exists retention_notified_at timestamptz;
create index if not exists leads_retention_due on public.leads (created_at) where deleted_at is null and retention_notified_at is null;
