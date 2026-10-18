-- schema.sql 의 leads 테이블에 상담 동의 기록 컬럼 추가 (홈페이지 상담 신청용)
alter table leads add column if not exists consent_contact boolean not null default false;
alter table leads add column if not exists consent_at timestamptz;
create index if not exists leads_owner_created on leads (owner_id, created_at desc);
