-- 관리자 화면(/admin)에서 쓰는 메모 컬럼 추가 — Supabase SQL Editor 에서 한 번만 실행하세요.
alter table leads add column if not exists memo text;
